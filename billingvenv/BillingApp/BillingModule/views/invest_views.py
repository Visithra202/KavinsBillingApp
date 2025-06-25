from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Invest
from BillingModule.serializer import InvestSerializer

# Invest
@api_view(['POST'])
def add_invest(request):
    serializer= InvestSerializer(data=request.data)
    if serializer.is_valid(): 
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # print(serializer.data)
    # print(serializer.errors)
    return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_invest_list(request):
    invest = Invest.objects.all()
    serializer=InvestSerializer(invest, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

