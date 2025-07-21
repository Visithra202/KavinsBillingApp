from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Purchase, PurchaseItem, PurchasePayment, PurchaseBill
from BillingModule.serializer import PurchaseSerializer, PurchaseItemSerializer, PurchasePaymentSerializer
from django.http import JsonResponse
from django.utils.timezone import now


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
    purchase=Purchase.objects.all().order_by('-purchase_seq')
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

