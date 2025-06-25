from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import AmountTransfer
from BillingModule.serializer import AmountTransferSerializer

# amount transfer
@api_view(['POST'])
def amount_transfer(request):
    serializer=AmountTransferSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # print(serializer.data)
    # print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def amount_transfer_list(request):
    transactions=AmountTransfer.objects.order_by('-trans_id')
    serializer= AmountTransferSerializer(transactions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
