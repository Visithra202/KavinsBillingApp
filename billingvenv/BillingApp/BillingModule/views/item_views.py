from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Item
from BillingModule.serializer import ItemSerializer
from django.shortcuts import get_object_or_404

#Item
@api_view(['POST'])
def add_item(request):
    data = request.data

    if Item.objects.filter(
        item_name__iexact=data.get('item_name', '').strip(),
        category__iexact=data.get('category', '').strip(),
        brand__iexact=data.get('brand', '').strip(),
        purchase_price=data.get('purchase_price'),
        sale_price=data.get('sale_price'),
    ).exists():
        return Response({"detail": "Item already exists."}, status=status.HTTP_400_BAD_REQUEST)

    serializer = ItemSerializer(data=data)
    if serializer.is_valid():
        item = serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
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
