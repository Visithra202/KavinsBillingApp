from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Customer
from BillingModule.serializer import CustomerSerializer
from django.shortcuts import get_object_or_404

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

@api_view(['PATCH'])
def update_customer_mph(request, customer_id):
    try:
        customer = Customer.objects.get(customer_id=customer_id)
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=404)

    mph = request.data.get('mph')
    if not mph:
        return Response({'error': 'Missing phone number (mph)'}, status=400)

    customer.mph = mph
    customer.save()
    return Response({'message': 'Customer phone number updated successfully'}, status=status.HTTP_202_ACCEPTED)
