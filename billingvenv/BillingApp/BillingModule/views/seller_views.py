from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Seller
from BillingModule.serializer import SellerSerializer
from django.shortcuts import get_object_or_404


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