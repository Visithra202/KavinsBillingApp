from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Sale, SaleItem, Purchase, PurchaseItem, CashGl, Item, Category, Loan, GlBal
from BillingModule.serializer import CashGlSerializer
from django.db.models import Sum, Count, Max, F
from django.utils import timezone
from .dashboard_views import calculate_stock_summary

# Reports

def get_today():
    return timezone.localdate()

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
    cashgl=CashGl.objects.filter(accno='CASH001').order_by('-seq_no')
    serializer = CashGlSerializer(cashgl, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def account_report(request):
    cashgl=CashGl.objects.filter(accno='ACC001').order_by('-seq_no')
    serializer = CashGlSerializer(cashgl, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def penalty_report(request):
    penalty=CashGl.objects.filter(accno='PENL001').order_by('-seq_no')
    serializer = CashGlSerializer(penalty, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Stock report
@api_view(['GET'])
def get_required_stock(request):
    low_stock_categories = []

    for category in Category.objects.all():
        items=Item.objects.filter(category=category)
        total_quantity = items.aggregate(
            total=Sum('quantity')
        )['total'] or 0

        if category.min_stock:
            if total_quantity < category.min_stock:
                low_stock_categories.append({
                    'item_name': "-",
                    'category_name': category.category_name,
                    'total_quantity': total_quantity,
                    'min_stock': category.min_stock
                })
        else :
            for item in items.filter(quantity__lt=F('min_stock')):
                low_stock_categories.append({
                    'item_name': item.item_name,
                    'category_name': item.category,
                    'total_quantity': item.quantity,
                    'min_stock': item.min_stock
                })


    return Response({'low_stock_categories':low_stock_categories}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_balancesheet_report(request):
    today = get_today()

    glbal_cash = GlBal.objects.filter(glac='CASH001').order_by('-id').first()
    cash_balance = glbal_cash.balance if glbal_cash else 0

    glbal_account = GlBal.objects.filter(glac='ACC001').order_by('-id').first()
    account_balance = glbal_account.balance if glbal_account else 0

    stock_summary = calculate_stock_summary() 
    loan_given = Loan.objects.aggregate(total=Sum('loanamt_bal'))['total'] or 0

    return Response({
        'cash_balance': cash_balance,
        'account_balance': account_balance,
        'loan': loan_given,
        'mobile': stock_summary['mobile_stock'],
        'accessories': stock_summary['accessories_stock']
    })

