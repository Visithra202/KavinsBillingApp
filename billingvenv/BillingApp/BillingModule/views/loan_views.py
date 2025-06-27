from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Loan, LoanBill, LoanJournal, GlHist, Income
from BillingModule.serializer import LoanSerializer, LoanBillSerializer, LoanJournalSerializer, create_cash_transaction
from django.http import JsonResponse
from decimal import Decimal
from django.db import transaction
from collections import defaultdict
from django.utils import timezone


def get_today():
    return timezone.localdate()

# Loan
@api_view(['POST'])
def create_loan(request):
    serializer=LoanSerializer(data=request.data)
    # print(request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_loan_list(request):
    loanList=Loan.objects.all().order_by('-loan_date')
    serializer = LoanSerializer(loanList, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@transaction.atomic
def get_collection_list(request):
    today = get_today()
    loan_bills = LoanBill.objects.filter(bill_date__lte=today, paid_date__isnull=True)

    overdue_loans_dict = defaultdict(lambda: {
        'due_amount': Decimal('0.00'),
        'late_fee': Decimal('0.00'),
        'customer': None,
        'loan_accno': '',
        'payment_freq': '',
        'od_days': 0
    })

    totalDueSum = 0

    for bill in loan_bills:
        loan = bill.loan_acc
        acc_no = loan.loan_accno
        totalDueSum+=(bill.total_due-bill.paid_amount)
        # Only set customer info once
        if overdue_loans_dict[acc_no]['customer'] is None:
            overdue_loans_dict[acc_no]['customer'] = {
                'customer_name': loan.customer.customer_name,
                'mph': str(loan.customer.mph)
            }
            overdue_loans_dict[acc_no]['loan_accno'] = acc_no
            overdue_loans_dict[acc_no]['payment_freq'] = 'M' if loan.payment_freq.startswith('M') else 'W'

            # OD Days Calculation
            last_paid_bill = LoanBill.objects.filter(loan_acc=loan, paid_date__isnull=True).order_by('bill_date').first()
            if last_paid_bill:
                overdue_loans_dict[acc_no]['od_days'] = (today - last_paid_bill.bill_date).days
            

        overdue_loans_dict[acc_no]['due_amount'] += (bill.due_amount - bill.paid_amount)
        overdue_loans_dict[acc_no]['late_fee'] += bill.late_fee

    overdue_loans = [{
        'customer': data['customer'],
        'loan_accno': data['loan_accno'],
        'due_amount': str(data['due_amount']),
        'late_fee': str(data['late_fee']),
        'frequency': data['payment_freq'],
        'od_days': data['od_days']
    } for acc_no, data in overdue_loans_dict.items()]

    return JsonResponse({'overdue_loans': overdue_loans, 'totalDueSum' : totalDueSum})



@api_view(['GET'])
def get_loan_bill(request, loan_accno):
    today=get_today()
    loan_bills = LoanBill.objects.filter(loan_acc__loan_accno=loan_accno).order_by('bill_date')
    bills_data = []
    for bill in loan_bills:
        if bill.paid_date is None and bill.bill_date <= today :
            bills_data.append({
                'bill_seq': bill.bill_seq,
                'bill_date': bill.bill_date.strftime('%Y-%m-%d'),
                'due_amount': str(bill.due_amount),
                'late_fee': str(bill.late_fee),
                'total_due': bill.total_due,
                'paid_amount' : bill.paid_amount,
                'paid_date' : bill.paid_date
            })
    return JsonResponse({'loan_bills': bills_data})

@api_view(['GET'])
def get_acc_loan_bills(request, loan_accno):
    bills = LoanBill.objects.filter(loan_acc__loan_accno=loan_accno)  
    serializer = LoanBillSerializer(bills, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@transaction.atomic
def add_loan_payment(request):
    today = get_today()
    data = request.data
    loan_accno = data.get('loan_accno')
    payment_amount = Decimal(data.get('payment_amount'))
    payment_type=data.get('payment')
    discount=data.get('discount')
    
    pay_amount=payment_amount+discount
    paid_amount=payment_amount

    loan = Loan.objects.get(loan_accno=loan_accno)
    loan.bal_amount=loan.bal_amount- (paid_amount+discount)
    loan.save()
    
    loan_bills = LoanBill.objects.filter(
        loan_acc__loan_accno=loan_accno,
        paid_date__isnull=True
    ).order_by('bill_date')

    for bill in loan_bills:
        remaining_due = bill.total_due - bill.paid_amount

        if pay_amount >= remaining_due:
            bill.paid_amount += remaining_due
            bill.paid_date = today
            if bill.due_type=='EMI':
                loan.loanamt_bal-=bill.prin
            pay_amount -= remaining_due
        else:
            bill.paid_amount += pay_amount
            if bill.paid_amount >= bill.total_due:
                bill.paid_date = today
                if bill.due_type=='EMI':
                    loan.loanamt_bal-=bill.prin

            pay_amount = Decimal('0.00')

        bill.save()
        loan.save()


        if bill.paid_amount==bill.total_due and bill.late_fee>0:
            create_cash_transaction(penalty=bill.late_fee, trans_comment= f'Accno : {loan_accno}, Bill seq : {bill.bill_seq}', trans_type='CREDIT')
            income_obj, created = Income.objects.get_or_create(
                    income_date=get_today(),
                    inctype='Penalty',
                    defaults={'income_amt': bill.late_fee}
                )

            if not created:
                income_obj.income_amt += bill.late_fee
                income_obj.save()
        if bill.paid_amount==bill.total_due :
            create_cash_transaction(interest=bill.int, trans_comment=f"Loan - {bill.loan_acc} Interest credited. seq - {bill.bill_seq}", trans_type='CREDIT')
            income_obj, created = Income.objects.get_or_create(
                    income_date=get_today(),
                    inctype='Interest',
                    defaults={'income_amt': bill.int}
                )

            if not created:
                income_obj.income_amt += bill.int
                income_obj.save()

        if pay_amount == 0:
            break

    last_hist = GlHist.objects.order_by('-trans_seq').first()

    prev_balance = last_hist.balance if last_hist else Decimal('0.00')
    new_balance = prev_balance + paid_amount

    GlHist.objects.create(
        date=today,
        loan_acc=loan,
        credit=1, 
        trans_command=f"{paid_amount} credited",
        trans_amount=paid_amount,
        balance=new_balance
    )
    
    
    latest_journal_entry = LoanJournal.objects.filter(loan__loan_accno=loan.loan_accno).order_by('-journal_id').first() 

    if latest_journal_entry:
        previous_data = latest_journal_entry.new_data
        last_seq=latest_journal_entry.journal_seq 
    else:
        previous_data = Decimal('0.00')
        last_seq=0 
            
            
    loan_journal=LoanJournal.objects.create(
        loan=loan,
        journal_date=today,
        journal_seq=last_seq+1,
        action_type='PAYMENT',
        description="Due payment added",
        old_data=previous_data,
        new_data=previous_data-paid_amount,
        crdr=True,
        trans_amt=paid_amount,
        balance_amount=previous_data - paid_amount
    )

    updated_data = previous_data - paid_amount

    if discount > 0:
        LoanJournal.objects.create(
            loan=loan,
            journal_date=today,
            journal_seq=last_seq + 2,
            action_type='DISCOUNT',
            description="Discount added",
            old_data=updated_data,
            new_data=updated_data - discount,
            crdr=True,
            trans_amt=discount,
            balance_amount=updated_data - discount
        )
    cash=0
    account=0

    if(payment_type=='Cash'):
        cash=paid_amount+discount
    else:
        account=paid_amount+discount

    create_cash_transaction(cash=cash, account=account, trans_comment=f'Loan due received - accno : {loan_accno}, seq : {loan_journal.journal_seq} ', trans_type='CREDIT')

    if discount>0:
        create_cash_transaction(cash=discount, trans_comment=f'Loan due discount - accno : {loan_accno}', trans_type='DEBIT')
        create_cash_transaction(penalty=discount, trans_comment=f'Loan due discount - accno : {loan_accno},', trans_type='DEBIT')
    
    return Response({'message': 'Payment added successfully'})


# Loan Journal
@api_view(['GET'])
def get_loan_journal(request, loan_accno):
    journals=LoanJournal.objects.filter(loan__loan_accno=loan_accno).order_by('journal_id')
    serializer=LoanJournalSerializer(journals, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
    
    