from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Sale, SaleItem, SaleBill, Payment, Item, GlBal, CashGl
from BillingModule.serializer import SaleSerializer, SaleItemSerializer, PaymentSerializer, create_cash_transaction
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.http import JsonResponse
from django.db import transaction
from rest_framework.pagination import PageNumberPagination

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

    sales = (
        Sale.objects
        .select_related('customer', 'payment')
        .prefetch_related('sale_products')
        .order_by('-sale_seq')
    )

    paginator = PageNumberPagination()
    paginator.page_size = 12
    result_page = paginator.paginate_queryset(sales, request)
    serializer = SaleSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

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
from django.forms.models import model_to_dict

@api_view(['POST'])
def reverse_sale(request, bill_no):
    try:
        with transaction.atomic():
            sale = Sale.objects.select_related('payment').get(bill_no=bill_no)
            if sale.reversed:
                return Response({'message': 'Sale already reversed'}, status=status.HTTP_400_BAD_REQUEST)

            sale.reversed = True
            sale.save()

            # Restore sold item stock
            for sale_item in sale.sale_items.all():
                item = sale_item.product
                item.quantity += sale_item.quantity
                item.save()

            payment = sale.payment
            if not payment:
                return Response({'message': 'No payment record found for this sale'}, status=status.HTTP_400_BAD_REQUEST)

            # Handle cash reversal
            if payment.cash > 0 or payment.account > 0:
                create_cash_transaction(
                    cash=payment.cash,
                    account=payment.account,
                    trans_comment=f'Reversal of sale {bill_no}',
                    trans_type='DEBIT'
                )
            
            income_type = ''
            for item in sale.sale_items.all():
                if item.product.category == 'Mobile':
                    income_type = 'Mobile'
                    break
                elif item.product.category == 'Accessories':
                    income_type = 'Accessories'

            income = sale.income
            cmt = f"Reversal of sale {sale.bill_no} Income"
            if income_type == 'Mobile':
                create_cash_transaction(mobile=income, trans_comment=cmt, trans_type='DEBIT')
            elif income_type == 'Accessories':
                create_cash_transaction(accessories=income, trans_comment=cmt, trans_type='DEBIT')

            return Response({'message': 'Sale Reversed'}, status=status.HTTP_200_OK)

    except Sale.DoesNotExist:
        return Response({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)
    except GlBal.DoesNotExist as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
