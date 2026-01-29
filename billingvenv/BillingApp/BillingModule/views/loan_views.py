from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import (
    Loan,
    LoanBill,
    LoanJournal,
    GlHist,
    Income,
    LoanInfo,
    CashGl,
)
from BillingModule.serializer import (
    LoanSerializer,
    LoanBillSerializer,
    LoanJournalSerializer,
    LoanInfoSerializer,
    create_cash_transaction,
)
from django.http import JsonResponse
from decimal import Decimal
from django.db import transaction
from collections import defaultdict
from django.utils import timezone
from django.db.models import Sum, ExpressionWrapper, F, DecimalField, Q
from datetime import date, timedelta, datetime
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404


def get_today():
    return timezone.localdate()


# Loan
@api_view(["POST"])
def create_loan(request):
    serializer = LoanSerializer(data=request.data)
    # print(request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_loan_list(request):
    loanList = Loan.objects.all().order_by("-loan_date")
    serializer = LoanSerializer(loanList, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_loan_bill(request, loan_accno):
    today = get_today()
    loan_bills = LoanBill.objects.filter(loan_acc__loan_accno=loan_accno).order_by(
        "bill_date"
    )
    bills_data = []
    for bill in loan_bills:
        if bill.paid_date is None and bill.bill_date <= today:
            bills_data.append(
                {
                    "bill_seq": bill.bill_seq,
                    "bill_date": bill.bill_date.strftime("%Y-%m-%d"),
                    "due_amount": str(bill.due_amount),
                    "late_fee": str(bill.late_fee),
                    "total_due": bill.total_due,
                    "paid_amount": bill.paid_amount,
                    "paid_date": bill.paid_date,
                }
            )
    return JsonResponse({"loan_bills": bills_data})


@api_view(["GET"])
def get_acc_loan_bills(request, loan_accno):
    bills = LoanBill.objects.filter(loan_acc__loan_accno=loan_accno)
    serializer = LoanBillSerializer(bills, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@transaction.atomic
def add_loan_payment(request):
    today = get_today()
    data = request.data
    loan_accno = data.get("loan_accno")
    payment_amount = Decimal(data.get("payment_amount"))
    payment_type = data.get("payment")
    discount = data.get("discount")

    pay_amount = payment_amount + discount
    paid_amount = payment_amount

    loan = Loan.objects.get(loan_accno=loan_accno)
    loan.bal_amount = loan.bal_amount - (paid_amount + discount)
    loan.save()

    LoanInfo.objects.filter(loan_accno=loan).delete()

    loan_bills = LoanBill.objects.filter(
        loan_acc__loan_accno=loan_accno, paid_date__isnull=True
    ).order_by("bill_date")

    for bill in loan_bills:
        remaining_due = bill.total_due - bill.paid_amount

        if pay_amount >= remaining_due:
            bill.paid_amount += remaining_due
            bill.paid_date = today
            if bill.due_type == "EMI":
                loan.loanamt_bal -= bill.prin
            pay_amount -= remaining_due
        else:
            bill.paid_amount += pay_amount
            if bill.paid_amount >= bill.total_due:
                bill.paid_date = today
                if bill.due_type == "EMI":
                    loan.loanamt_bal -= bill.prin

            pay_amount = Decimal("0.00")

        bill.save()
        loan.save()

        if bill.paid_amount == bill.total_due and bill.late_fee > 0:
            if loan.ln_typ in ("SHRTCSH"):
                create_cash_transaction(
                    shrtpen=bill.late_fee,
                    trans_comment=f"Accno : {loan_accno}, Bill seq : {bill.bill_seq}",
                    trans_type="CREDIT",
                )
                income_obj, created = Income.objects.get_or_create(
                    income_date=get_today(),
                    inctype="Short Penalty",
                    defaults={"income_amt": bill.late_fee},
                )

                if not created:
                    income_obj.income_amt += bill.late_fee
                    income_obj.save()
            else:
                create_cash_transaction(
                    penalty=bill.late_fee,
                    trans_comment=f"Accno : {loan_accno}, Bill seq : {bill.bill_seq}",
                    trans_type="CREDIT",
                )
                income_obj, created = Income.objects.get_or_create(
                    income_date=get_today(),
                    inctype="Penalty",
                    defaults={"income_amt": bill.late_fee},
                )

                if not created:
                    income_obj.income_amt += bill.late_fee
                    income_obj.save()
        if bill.paid_amount == bill.total_due:
            if loan.ln_typ in ("SHRTCSH"):
                create_cash_transaction(
                    shrtint=bill.int,
                    trans_comment=f"Short loan - {bill.loan_acc} Interest credited. seq - {bill.bill_seq}",
                    trans_type="CREDIT",
                )
                income_obj, created = Income.objects.get_or_create(
                    income_date=get_today(),
                    inctype="Short Interest",
                    defaults={"income_amt": bill.int},
                )

                if not created:
                    income_obj.income_amt += bill.int
                    income_obj.save()
            else:
                create_cash_transaction(
                    interest=bill.int,
                    trans_comment=f"Loan - {bill.loan_acc} Interest credited. seq - {bill.bill_seq}",
                    trans_type="CREDIT",
                )
                income_obj, created = Income.objects.get_or_create(
                    income_date=get_today(),
                    inctype="Interest",
                    defaults={"income_amt": bill.int},
                )

                if not created:
                    income_obj.income_amt += bill.int
                    income_obj.save()

        if pay_amount == 0:
            break

    last_hist = GlHist.objects.order_by("-trans_seq").first()

    prev_balance = last_hist.balance if last_hist else Decimal("0.00")
    new_balance = prev_balance + paid_amount

    GlHist.objects.create(
        date=today,
        loan_acc=loan,
        credit=1,
        trans_command=f"{paid_amount} credited",
        trans_amount=paid_amount,
        balance=new_balance,
    )

    latest_journal_entry = (
        LoanJournal.objects.filter(loan__loan_accno=loan.loan_accno)
        .order_by("-journal_id")
        .first()
    )

    if latest_journal_entry:
        previous_data = latest_journal_entry.new_data
        last_seq = latest_journal_entry.journal_seq
    else:
        previous_data = Decimal("0.00")
        last_seq = 0

    loan_journal = LoanJournal.objects.create(
        loan=loan,
        journal_date=today,
        journal_seq=last_seq + 1,
        action_type="PAYMENT",
        description="Due payment added",
        old_data=previous_data,
        new_data=previous_data - paid_amount,
        crdr=True,
        trans_amt=paid_amount,
        balance_amount=previous_data - paid_amount,
    )

    updated_data = previous_data - paid_amount

    if discount > 0:
        LoanJournal.objects.create(
            loan=loan,
            journal_date=today,
            journal_seq=last_seq + 2,
            action_type="DISCOUNT",
            description="Discount added",
            old_data=updated_data,
            new_data=updated_data - discount,
            crdr=True,
            trans_amt=discount,
            balance_amount=updated_data - discount,
        )
    cash = 0
    account = 0

    if payment_type == "Cash":
        cash = paid_amount + discount
    elif payment_type == "Account":
        account = paid_amount + discount
    elif payment_type == "Short Cash":
        shrtcsh = paid_amount + discount

    create_cash_transaction(
        cash=cash,
        account=account,
        shrtcash=shrtcsh,
        trans_comment=f"Loan due received - accno : {loan_accno}, seq : {loan_journal.journal_seq} ",
        trans_type="CREDIT",
    )

    if discount > 0:
        if loan.ln_typ in ("SHRTCSH"):
            create_cash_transaction(
                shrtcash=discount,
                trans_comment=f"Short loan due discount - accno : {loan_accno}",
                trans_type="DEBIT",
            )
            create_cash_transaction(
                shrtpen=discount,
                trans_comment=f"Short loan due discount - accno : {loan_accno},",
                trans_type="DEBIT",
            )
            
        else:
            create_cash_transaction(
                cash=discount,
                trans_comment=f"Loan due discount - accno : {loan_accno}",
                trans_type="DEBIT",
            )
            create_cash_transaction(
                penalty=discount,
                trans_comment=f"Loan due discount - accno : {loan_accno},",
                trans_type="DEBIT",
            )

    if loan.bal_amount <= 0:
        LoanInfo.objects.filter(loan_accno=loan).delete()

    return Response({"message": "Payment added successfully"})


# Loan Journal
@api_view(["GET"])
def get_loan_journal(request, loan_accno):
    journals = LoanJournal.objects.filter(loan__loan_accno=loan_accno).order_by(
        "journal_id"
    )
    serializer = LoanJournalSerializer(journals, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def add_loan_info(request):
    loan_accno = request.data.get("loan_accno")
    extended_date_str = request.data.get("extended_date")

    if not loan_accno or not extended_date_str:
        return Response(
            {"error": "Missing loan accno or extended date"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        extended_date = datetime.strptime(extended_date_str, "%Y-%m-%d").date()
    except ValueError:
        return Response(
            {"error": "Invalid date format. Use YYYY-MM-DD."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        loan = Loan.objects.get(loan_accno=loan_accno)
    except Loan.DoesNotExist:
        return Response({"error": "Loan not found"}, status=status.HTTP_404_NOT_FOUND)

    today = get_today()
    days = (extended_date - today).days

    last_info = LoanInfo.objects.filter(loan_accno=loan).order_by("-seq").first()
    last_seq = last_info.seq if last_info else 0

    LoanInfo.objects.create(
        seq=last_seq + 1,
        date=today,
        committed_in=days,
        extended_date=extended_date,
        loan_accno=loan,
    )

    return Response(
        {"message": "Loan information added successfully"},
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
def get_loan_info(request, loan_accno):
    loan = Loan.objects.get(loan_accno=loan_accno)
    loanInfo = LoanInfo.objects.filter(loan_accno=loan).order_by("-seq")
    serializer = LoanInfoSerializer(loanInfo, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["PATCH"])
def update_loan(request, loan_accno):
    try:
        loan = Loan.objects.get(loan_accno=loan_accno)
    except Loan.DoesNotExist:
        return Response({"error": "Loan not found"}, status=404)

    allowed_fields = ["lock_id", "ref_mph", "details"]
    data_updated = False

    for field in allowed_fields:
        if field in request.data:
            setattr(loan, field, request.data[field])
            data_updated = True

    if data_updated:
        loan.save()
        return Response(
            {"message": "Loan updated successfully"}, status=status.HTTP_202_ACCEPTED
        )
    else:
        return Response({"error": "No valid fields provided to update"}, status=400)


@api_view(["POST"])
def lock_mobile(request, loan_accno):
    try:
        loan = Loan.objects.get(loan_accno=loan_accno)
        loan.lock_sts = not loan.lock_sts
        loan.save()
        return Response({"lock_sts": loan.lock_sts})
    except Loan.DoesNotExist:
        return Response({"error": "Loan not found"}, status=404)


@api_view(["GET"])
@transaction.atomic
def get_collection_list(request):
    today = get_today()

    loan_bills = (
        LoanBill.objects.select_related("loan_acc__customer")
        .filter(bill_date__lte=today, paid_date__isnull=True)
        .order_by("-bill_date")
    )

    search_term = request.GET.get("search", "")
    if search_term:
        loan_bills = loan_bills.filter(
            Q(loan_acc__loan_accno__icontains=search_term)
            | Q(loan_acc__customer__customer_name__icontains=search_term)
            | Q(loan_acc__customer__mph__icontains=search_term)
        )

    overdue_loans_dict = defaultdict(
        lambda: {
            "due_amount": Decimal("0.00"),
            "late_fee": Decimal("0.00"),
            "customer": None,
            "loan_accno": "",
            "payment_freq": "",
            "od_days": 0,
            "lock_sts": 0,
        }
    )

    for bill in loan_bills:
        loan = bill.loan_acc
        acc_no = loan.loan_accno

        if "extended_date" not in overdue_loans_dict[acc_no]:
            latest_info = (
                LoanInfo.objects.filter(loan_accno=loan)
                .order_by("-seq")
                .values("extended_date")
                .first()
            )
            overdue_loans_dict[acc_no]["extended_date"] = (
                latest_info["extended_date"].isoformat() if latest_info else None
            )

        # Only set customer info once
        if overdue_loans_dict[acc_no]["customer"] is None:
            overdue_loans_dict[acc_no]["customer"] = {
                "customer_name": loan.customer.customer_name,
                "mph": str(loan.customer.mph),
            }
            overdue_loans_dict[acc_no]["loan_accno"] = acc_no
            overdue_loans_dict[acc_no]["payment_freq"] = (
                "M" if loan.payment_freq.startswith("M") else "W"
            )
            overdue_loans_dict[acc_no]["lock_sts"] = loan.lock_sts

            # OD Days Calculation
            last_paid_bill = (
                LoanBill.objects.filter(loan_acc=loan, paid_date__isnull=True)
                .order_by("bill_date")
                .first()
            )
            if last_paid_bill:
                overdue_loans_dict[acc_no]["od_days"] = (
                    today - last_paid_bill.bill_date
                ).days

        if bill.paid_amount >= bill.due_amount:
            overdue_loans_dict[acc_no]["late_fee"] += bill.total_due - bill.paid_amount
        else:
            overdue_loans_dict[acc_no]["due_amount"] += (
                bill.due_amount - bill.paid_amount
            )
            overdue_loans_dict[acc_no]["late_fee"] += bill.late_fee

    overdue_loans = [
        {
            "customer": data["customer"],
            "loan_accno": data["loan_accno"],
            "due_amount": str(data["due_amount"]),
            "late_fee": str(data["late_fee"]),
            "frequency": data["payment_freq"],
            "od_days": data["od_days"],
            "extended_date": data.get("extended_date"),
            "lock_sts": data.get("lock_sts", 0),
        }
        for acc_no, data in overdue_loans_dict.items()
    ]

    overdue_loans = sorted(
        overdue_loans,
        key=lambda x: (x["extended_date"] is not None, x["extended_date"] or ""),
    )

    paginator = PageNumberPagination()
    paginator.page_size = 10
    result_page = paginator.paginate_queryset(overdue_loans, request)
    return paginator.get_paginated_response(result_page)


@api_view(["GET"])
def get_collection_data(request):
    today = get_today()
    loan_bills = LoanBill.objects.filter(
        bill_date__lte=today, paid_date__isnull=True
    ).order_by("-bill_date")

    total_due_expr = ExpressionWrapper(
        F("total_due") - F("paid_amount"), output_field=DecimalField()
    )

    total_due_sum = (
        loan_bills.aggregate(total_due_sum=Sum(total_due_expr))["total_due_sum"] or 0
    )

    today_collection = GlHist.objects.filter(date=today, credit=True).aggregate(
        total=Sum("trans_amount")
    )
    collected = today_collection["total"] or 0

    totalCount = loan_bills.values("loan_acc").distinct().count()

    return Response(
        {
            "totalDueSum": total_due_sum,
            "todayCollection": collected,
            "totalCount": totalCount,
        }
    )


@api_view(["POST"])
@transaction.atomic
def reverse_loan_payment(request, loan_accno):

    today = get_today()

    loan = get_object_or_404(Loan, loan_accno=loan_accno)

    last_journal = (
        LoanJournal.objects.filter(loan=loan).order_by("-journal_seq").first()
    )
    if not last_journal:
        return Response({"error": "No transactions found"}, status=400)

    if last_journal.action_type == "REVERSAL":
        return Response({"error": "Last transaction already reversed"}, status=400)

    if last_journal.action_type != "PAYMENT":
        return Response(
            {"error": "Last transaction is not a payment, cannot reverse"}, status=400
        )

    reversed_amount = last_journal.trans_amt

    loan.bal_amount += reversed_amount
    loan.save()

    pay_back = reversed_amount
    paid_bills = LoanBill.objects.filter(loan_acc=loan, paid_amount__gt=0).order_by(
        "-bill_seq"
    )

    for bill in paid_bills:
        if pay_back <= 0:
            break

        if bill.paid_amount > pay_back:
            bill.paid_amount -= pay_back
            pay_back = Decimal("0.00")
        else:
            pay_back -= bill.paid_amount
            bill.paid_amount = Decimal("0.00")

        if bill.paid_date:
            if bill.due_type == "EMI":
                loan.loanamt_bal += bill.prin

            if bill.late_fee > 0:
                create_cash_transaction(
                    penalty=bill.late_fee,
                    trans_comment=f"Reversal of late fee payment - {loan_accno}",
                    trans_type="DEBIT",
                )
                income_obj, created = Income.objects.get_or_create(
                    income_date=get_today(),
                    inctype="Penalty",
                    defaults={"income_amt": bill.late_fee},
                )

                if not created:
                    income_obj.income_amt -= bill.late_fee
                    income_obj.save()

            if bill.int > 0:
                create_cash_transaction(
                    interest=bill.int,
                    trans_comment=f"Reversal of loan interest payment - {loan_accno}",
                    trans_type="DEBIT",
                )
                income_obj, created = Income.objects.get_or_create(
                    income_date=get_today(),
                    inctype="Interest",
                    defaults={"income_amt": bill.int},
                )

                if not created:
                    income_obj.income_amt -= bill.int
                    income_obj.save()

            bill.paid_date = None

        bill.save()
    loan.save()

    last_hist = GlHist.objects.order_by("-trans_seq").first()
    prev_balance = last_hist.balance if last_hist else Decimal("0.00")
    GlHist.objects.create(
        date=today,
        loan_acc=loan,
        debit=1,
        trans_command=f"Reversal of loan payment - {loan_accno}",
        trans_amount=reversed_amount,
        balance=prev_balance - reversed_amount,
    )

    last_gl = CashGl.objects.get(
        trans_comt=f"Loan due received - accno : {loan_accno}, seq : {last_journal.journal_seq} "
    )

    cash = 0
    account = 0

    if last_gl and last_gl.accno == "CASH001":
        cash = reversed_amount
    else:
        account = reversed_amount

    create_cash_transaction(
        cash=cash,
        account=account,
        trans_comment=f"Reversal of loan payment - {loan_accno}, seq - {last_journal.journal_seq}",
        trans_type="DEBIT",
    )

    LoanJournal.objects.create(
        loan=loan,
        journal_date=today,
        journal_seq=last_journal.journal_seq + 1,
        action_type="REVERSAL",
        description=f"Reversal of loan payment. seq - {last_journal.journal_seq}",
        old_data=last_journal.new_data,
        new_data=last_journal.old_data,
        crdr=False,
        trans_amt=reversed_amount,
        balance_amount=last_journal.old_data,
    )

    return Response({"message": "Last transaction reversed successfully"})


@api_view(["GET"])
def get_loan(request, loan_accno):
    loan = Loan.objects.get(loan_accno=loan_accno)
    serializer = LoanSerializer(loan)
    return Response(serializer.data, status=status.HTTP_200_OK)
