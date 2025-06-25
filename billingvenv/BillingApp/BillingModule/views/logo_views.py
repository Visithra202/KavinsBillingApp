from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Compdet
from BillingModule.serializer import CompdetSerializer


@api_view(['GET'])
def get_logo(request):
    compdet = Compdet.objects.first()
    if not compdet:
        return Response({"error": "No logo found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CompdetSerializer(compdet)
    return Response(serializer.data, status=status.HTTP_200_OK)

    