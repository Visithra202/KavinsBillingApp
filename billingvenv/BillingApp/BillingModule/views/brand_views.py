from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Brand
from BillingModule.serializer import BrandSerializer
from django.shortcuts import get_object_or_404


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
