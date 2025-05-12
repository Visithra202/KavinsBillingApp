from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializer import *
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from collections import defaultdict
from decimal import Decimal, InvalidOperation
from django.db import transaction
from django.utils import timezone
from django.db.models import Sum, Count, Max, F, Q, ExpressionWrapper, DecimalField




@api_view(['GET'])
def get_logo(request):
    compdet = Compdet.objects.first()
    if not compdet:
        return Response({"error": "No logo found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CompdetSerializer(compdet)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Category
@api_view(['POST'])
def add_category(request):
    serializer=CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_category_list(request):
    categories=Category.objects.all().order_by('category_name')
    serializer=CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_category(request, category_id):
    category=get_object_or_404(Category,category_id=category_id)
    category.delete()
    return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


#Brand
@api_view(['GET'])
def get_brand_list(request):
    brands=Brand.objects.all().order_by('brand_name')
    serializer = BrandSerializer(brands, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_brand(request):
    serializer= BrandSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_brand(request, brand_id):
    brand=get_object_or_404(Brand,brand_id=brand_id)
    brand.delete()
    return Response({"message": "Brand deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


#Item
@api_view(['POST'])
def add_item(request):
    serializer= ItemSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        item = serializer.save()
        return Response(serializer.data, status=200)
    
@api_view(['GET'])
def get_stock_list(request):
    items=Item.objects.all().order_by('category')
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_item(request, item_id):
    item=get_object_or_404(Item,item_id=item_id)
    item.delete()
    return Response({"message": "Item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def edit_item(request, item_id):  
    item = get_object_or_404(Item, item_id=item_id)
    # print(request.data)
    serializer = ItemSerializer(item, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        # print(serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Customer
@api_view(['POST'])
def add_customer(request):
    serializer= CustomerSerializer(data=request.data)
    if serializer.is_valid():
        item = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # print(serializer.data)
    # print(serializer.errors)
    return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['GET'])
def get_customer_list(request):
    customers=Customer.objects.all()
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_customer(request, customer_id):
    customer=get_object_or_404(Customer,customer_id=customer_id)
    customer.delete()
    return Response({"message": "Customer deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    
@api_view(['GET'])
def get_sale_bill_no(request):
    # print(request.data)
    current_year=now().year
    prefix=f'BILL-{current_year}-'

    bill=SaleBill.objects.filter(bill_year=current_year).first()

    if bill:
        nex_seq=bill.bill_seq + 1
    else:
        nex_seq=1
    # print(nex_seq)

    bill_no=f'{prefix}{nex_seq}'
    return JsonResponse({'bill_no':bill_no})


# Sale
@api_view(['POST'])
def add_sale(request):
    
    serializer=SaleSerializer(data= request.data)
    # print(request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    # print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_sale_list(request):
    sales=Sale.objects.all().order_by('sale_seq')
    serializer = SaleSerializer(sales, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_sale(request, bill_no):
    sale=get_object_or_404(Sale,bill_no=bill_no)
    sale.delete()
    return Response({"message": "Item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_sale_items_list(request):
    sales = SaleItem.objects.all()
    serializer = SaleItemSerializer(sales, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Payments
@api_view(['GET'])
def get_payment_list(request):
    payments=Payment.objects.all()
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


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
    loanList=Loan.objects.all()
    serializer = LoanSerializer(loanList, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@transaction.atomic
def get_collection_list(request):
    today = date.today()
    loan_bills = LoanBill.objects.filter(bill_date__lte=today, paid_date__isnull=True)

    overdue_loans_dict = defaultdict(lambda: {'due_amount': Decimal('0.00'), 'late_fee': Decimal('0.00')})

    for bill in loan_bills:
        acc_no = bill.loan_acc.loan_accno
        overdue_loans_dict[acc_no]['customer'] = {
            'customer_name': bill.loan_acc.customer.customer_name,
            'mph': str(bill.loan_acc.customer.mph)
        }
        overdue_loans_dict[acc_no]['loan_accno'] = acc_no
        overdue_loans_dict[acc_no]['due_amount'] += (bill.due_amount- bill.paid_amount)
        overdue_loans_dict[acc_no]['late_fee'] += bill.late_fee

    overdue_loans = [{
        'customer': data['customer'],
        'loan_accno': acc_no,
        'due_amount': str(data['due_amount']),
        'late_fee': str(data['late_fee']),
    } for acc_no, data in overdue_loans_dict.items()]

    return JsonResponse({'overdue_loans': overdue_loans})


@api_view(['GET'])
def get_loan_bill(request, loan_accno):
    today=date.today()
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
    today = date.today()
    data = request.data

    loan_accno = data.get('loan_accno')
    
    payment_amount = Decimal(data.get('payment_amount'))
    
    paid_amount=payment_amount
    loan = Loan.objects.get(loan_accno=loan_accno)
    # prev_loanbalance=loan.bal_amount
    
    loan_bills = LoanBill.objects.filter(
        loan_acc__loan_accno=loan_accno,
        paid_date__isnull=True
    ).order_by('bill_date')

    for bill in loan_bills:
        remaining_due = bill.total_due - bill.paid_amount
        principal_due = bill.due_amount - min(bill.paid_amount, bill.due_amount)

        if payment_amount >= remaining_due:
            bill.paid_amount += remaining_due
            bill.paid_date = today
            loan.bal_amount -= principal_due
            payment_amount -= remaining_due
        else:
            bill.paid_amount += payment_amount
            if bill.paid_amount >= bill.total_due:
                bill.paid_date = today

            # Pay principal first
            amount_toward_due = min(payment_amount, principal_due)
            loan.bal_amount -= amount_toward_due
            payment_amount = Decimal('0.00')

        bill.save()
        if payment_amount == 0:
            break

    loan.save()
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
        last_seq=1
            
            
    LoanJournal.objects.create(
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

    create_cash_transaction(trans_amt=paid_amount, trans_comment='Loan due received', trans_type='CREDIT')
    return Response({'message': 'Payment added successfully'})



# Purchase
@api_view(['POST'])
def add_purchase(request):
    serializer=PurchaseSerializer(data=request.data)
    # print(request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    # print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_purchase_list(request):
    purchase=Purchase.objects.all().order_by('purchase_seq')
    serializer = PurchaseSerializer(purchase, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_purchase_items_list(request):
    purchase=PurchaseItem.objects.all()
    serializer = PurchaseItemSerializer(purchase, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Payments
@api_view(['GET'])
def get_purchase_payment_list(request):
    payments=PurchasePayment.objects.all()
    serializer = PurchasePaymentSerializer(payments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



# seller
@api_view(['POST'])
def add_seller(request):
    serializer= SellerSerializer(data=request.data)
    if serializer.is_valid():
        seller = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # print(serializer.data)
    # print(serializer.errors)
    return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['GET'])
def get_seller_list(request):
    sellers=Seller.objects.all()
    serializer = SellerSerializer(sellers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_seller(request, seller_id):
    seller=get_object_or_404(Seller,seller_id=seller_id)
    seller.delete()
    return Response({"message": "Seller deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# Purchase bill no
@api_view(['GET'])
def get_purchase_bill_no(request):
    current_year=now().year
    prefix=f'PUR-{current_year}-'
    bill=PurchaseBill.objects.filter(bill_year=current_year).first()

    if bill:
        nex_seq=bill.bill_seq + 1
    else:
        nex_seq=1
    
    bill_no=f'{prefix}{nex_seq}'
    return JsonResponse({'bill_no':bill_no})


# Users

@api_view(['POST'])
def user_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    # print(username + " "+ password)
    user = authenticate(username=username, password=password)
    # print(user)
    if user:
        return Response({"message": "Login successful!"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@transaction.atomic
def add_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    confirm_password = request.data.get("confirm_password")

    if not username or not password:
        return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    if password != confirm_password:
        return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists."}, status=status.HTTP_409_CONFLICT)

    User.objects.create(username=username, password=make_password(password))

    return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)


# Get Users
@api_view(['GET'])
def get_user_list(request):
    users = User.objects.all().values("id", "username")
    user_list = [{"user_id": u["id"], "username": u["username"]} for u in users]
    return Response(user_list, status=status.HTTP_200_OK)


# Delete User
@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully!"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    
# Invest
@api_view(['POST'])
def add_invest(request):
    serializer= InvestSerializer(data=request.data)
    if serializer.is_valid(): 
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.data)
    print(serializer.errors)
    return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_invest_list(request):
    invest = Invest.objects.all()
    serializer=InvestSerializer(invest, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


    
# Loan Journal
@api_view(['GET'])
def get_loan_journal(request, loan_accno):
    journals=LoanJournal.objects.filter(loan__loan_accno=loan_accno).order_by('journal_id')
    serializer=LoanJournalSerializer(journals, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
    
    
# Dashboard details

def get_today():
    return timezone.localdate()

def get_week_range(reference_date=None):
    if not reference_date:
        reference_date = get_today()
    this_monday = reference_date - timedelta(days=reference_date.weekday())
    last_monday = this_monday - timedelta(days=7)
    last_sunday = last_monday + timedelta(days=6)

    start = timezone.make_aware(datetime.combine(last_monday, datetime.min.time()))
    end = timezone.make_aware(datetime.combine(last_sunday, datetime.max.time()))
    return start, end

def get_month_range(reference_date=None):
    if not reference_date:
        reference_date = get_today()
    this_month_first = reference_date.replace(day=1)
    prev_month_last = this_month_first - timedelta(days=1)
    prev_month_first = prev_month_last.replace(day=1)

    start = timezone.make_aware(datetime.combine(prev_month_first, datetime.min.time()))
    end = timezone.make_aware(datetime.combine(prev_month_last, datetime.max.time()))
    return start, end

@api_view(['GET'])
def get_dashboard_customer_details(request):
    today = get_today()
    total_customers = Customer.objects.count()

    start_week, end_week = get_week_range(today)
    start_month, end_month = get_month_range(today)

    last_week_customers = Customer.objects.filter(created_at__range=(start_week, end_week)).count()
    last_month_customers = Customer.objects.filter(created_at__range=(start_month, end_month)).count()

    return JsonResponse({
        'total_customers': total_customers,
        'last_week_customers': last_week_customers,
        'last_month_customers': last_month_customers
    })

@api_view(['GET'])
def get_sales_summary(request):
    today = get_today()
    today_sales_amount = Sale.objects.filter(sale_date=today).aggregate(total=Sum('paid_amount'))['total'] or 0

    start_week, end_week = get_week_range(today)
    start_month, end_month = get_month_range(today)

    last_week_total = Sale.objects.filter(sale_date__range=(start_week, end_week)) \
                                  .aggregate(total=Sum('paid_amount'))['total'] or 0

    last_month_total = Sale.objects.filter(sale_date__range=(start_month, end_month)) \
                                   .aggregate(total=Sum('paid_amount'))['total'] or 0

    return JsonResponse({
        'today_sales_amount': today_sales_amount,
        'last_week_sales': last_week_total,
        'last_month_sales': last_month_total,
    })

@api_view(['GET'])
def get_purchase_summary(request):
    today = get_today()
    today_purchase_amount = Purchase.objects.filter(purchase_date=today).aggregate(total=Sum('total_amount'))['total'] or 0

    start_week, end_week = get_week_range(today)
    start_month, end_month = get_month_range(today)

    last_week_total = Purchase.objects.filter(purchase_date__range=(start_week, end_week)) \
                                      .aggregate(total=Sum('total_amount'))['total'] or 0

    last_month_total = Purchase.objects.filter(purchase_date__range=(start_month, end_month)) \
                                       .aggregate(total=Sum('total_amount'))['total'] or 0

    return JsonResponse({
        'today_purchase_amount': today_purchase_amount,
        'last_week_purchase': last_week_total,
        'last_month_purchase': last_month_total,
    })

@api_view(['GET'])
def get_stock_summary(request):
    today = get_today()

    value_expr = ExpressionWrapper(F('quantity') * F('purchase_price'), output_field=DecimalField())

    total_stock = Item.objects.aggregate(
        total=Sum(value_expr)
    )['total'] or 0

    mobile_stock = Item.objects.filter(category='Mobile').aggregate(
        total=Sum(value_expr)
    )['total'] or 0

    accessories_stock = Item.objects.filter(~Q(category='Mobile')).aggregate(
        total=Sum(value_expr)
    )['total'] or 0

    return JsonResponse({
        'total_stock': total_stock,
        'mobile_stock': mobile_stock,
        'accessories_stock': accessories_stock,
    })

@api_view(['GET'])
def get_income_summary(request):
    today = get_today()

    today_income = Sale.objects.filter(sale_date=today).aggregate(total=Sum('income'))['total'] or 0

    start_week, end_week = get_week_range(today)
    last_week_income = Sale.objects.filter(sale_date__range=(start_week, end_week)) \
                                   .aggregate(total=Sum('income'))['total'] or 0

    start_month, end_month = get_month_range(today)
    last_month_income = Sale.objects.filter(sale_date__range=(start_month, end_month)) \
                                    .aggregate(total=Sum('income'))['total'] or 0

    return JsonResponse({
        'today_income': today_income,
        'last_week_income': last_week_income,
        'last_month_income': last_month_income,
    })

@api_view(['GET'])
def recent_sales(request):
    recent_sales = Sale.objects.order_by('-sale_seq')[:10].values(
        'bill_no', 'customer__customer_name', 'total_amount', 'sale_date','balance'
    )

    return JsonResponse(list(recent_sales), safe=False)

@api_view(['GET'])
def last_10_days_stats(request):
    today = now().date()
    stats = []

    for i in range(9, -1, -1):  
        day = today - timedelta(days=i)
        sales = Sale.objects.filter(sale_date=day).aggregate(total=Sum('total_amount'))['total'] or 0
        purchase = Purchase.objects.filter(purchase_date=day).aggregate(total=Sum('total_amount'))['total'] or 0
        stats.append({
            'date': day.strftime('%b %d'), 
            'sales': float(sales),
            'purchase': float(purchase)
        })

    return Response(stats)

# Reports

# Sale report
@api_view(['GET'])
def sales_by_customer(request):
    sales = (
        Sale.objects.values('customer__customer_name', 'customer__mph')
        .annotate(
            total_sales=Sum('total_amount'),
            total_paid=Sum('paid_amount'),
            bills=Count('bill_no'),
            last_sale_date=Max('sale_date')
        )
    )

    result = []
    for s in sales:
        result.append({
            'customer_name': s['customer__customer_name'],
            'mph': str(s['customer__mph']),
            'total_sales': s['total_sales'],
            'total_paid': s['total_paid'],
            'bills': s['bills'],
            'last_sale_date': s['last_sale_date'],
        })

    return Response(result)


@api_view(['GET'])
def sale_by_products(request):
    sales = (
        SaleItem.objects
        .values(
            'product__item_name',
            'product__category',  
            'product__brand',      
            'product__sale_price'
        )
        .annotate(
            total_quantity=Sum('quantity'),
            total_sales=Sum('total_price'),
            bills=Count('sale'),
            last_sale_date=Max('sale__sale_date')
        )
    )
    return Response(sales)
    

# Purchase report
@api_view(['GET'])
def purchase_by_products(request):
    purchase = (
        PurchaseItem.objects
        .values(
            'product__item_name',
            'product__category',  
            'product__brand',      
            'product__sale_price'
        )
        .annotate(
            total_quantity=Sum('quantity'),
            total_purchase=Sum('total_price'),
            bills=Count('purchase'),
            last_purchase_date=Max('purchase__purchase_date')
        )
    )
    return Response(purchase)
    
@api_view(['GET'])
def purchase_by_seller(request):
    purchase = (
        Purchase.objects.values('seller__seller_name', 'seller__seller_mph')
        .annotate(
            total_purchase=Sum('total_amount'),
            total_paid=Sum('paid_amount'),
            bills=Count('purchase_id'),
            last_purchase_date=Max('purchase_date')
        )
    )
    
    result = []
    for s in purchase:
        result.append({
            'seller_name': s['seller__seller_name'],
            'mph': str(s['seller__seller_mph']),
            'total_purchase': s['total_purchase'],
            'total_paid': s['total_paid'],
            'bills': s['bills'],
            'last_purchase_date': s['last_purchase_date'],
        })

    return Response(result)

@api_view(['GET'])
def cash_report(request):
    cashgl=CashGl.objects.all()
    serializer = CashGlSerializer(cashgl, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Stock report
@api_view(['GET'])
def get_required_stock_list(request):
    item= Item.objects.filter(quantity__lt=F('min_stock'))
    serializer = ItemSerializer(item, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Income
@api_view(['GET'])
def get_income_list(request):
    today=get_today()
    mobile_income = Income.objects.filter(income_taken=False, income_date__lt=today, inctype='Mobile')
    acc_income = Income.objects.filter(income_taken=False, income_date__lt=today, inctype='Accessories')

    serializer_mob = IncomeSerializer(mobile_income, many=True)
    serializer_acc = IncomeSerializer(acc_income, many=True)

    totmob_income = mobile_income.aggregate(total=Sum('income_amt'))['total'] or 0
    totacc_income = acc_income.aggregate(total=Sum('income_amt'))['total'] or 0

    return Response({
        'mobincome_list': serializer_mob.data,
        'mobile_income': totmob_income,
        'accincome_list': serializer_acc.data,
        'acc_income': totacc_income,
    })

@api_view(['POST'])
def receive_income(request):
    today=get_today()
    receive_amt = request.data.get('receive_amt')
    receive_date = request.data.get('date')
    inc_type=request.data.get('income_type')

    income = Income.objects.filter(income_taken=False, income_date__lt=today, inctype=inc_type)

    for inc in income: 
        inc.income_taken=True
        inc.received_date=receive_date
        inc.save()

    
    create_cash_transaction(
        trans_amt=receive_amt,
        trans_comment=f"{inc_type} Income Received",
        trans_type="DEBIT"
    )

    return Response({"message":"Income Received"}, status=status.HTTP_200_OK)

