from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Service, Income, GlBal
from BillingModule.serializer import ServiceSerializer, create_cash_transaction
from django.utils import timezone
from django.db import transaction
from django.db.models import Q

# service

def get_today():
    return timezone.localdate()

@api_view(['POST'])
def add_service(request):
    serializer=ServiceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    print(serializer.data)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_service_list(request):
    services = Service.objects.filter(~Q(service_status='Closed')).order_by('-service_id')
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PATCH'])
def add_service_paidamt(request):
    data = request.data
    # print(data)

    service_id=data.get('service_id')
    paid_amt=data.get('paid_amt')
    receivable_amt=data.get('receivable_amt')
    payment=data.get('payment')

    if not all([service_id, paid_amt, receivable_amt, payment]):
        return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        service=Service.objects.get(service_id=service_id)

        service.paid_amt=paid_amt
        service.paid_date=get_today()
        service.receivable_amt=receivable_amt
        service.service_status='Paid'
        service.paidpayment_type=payment

        service.save()
        cash=0
        account=0

        if(payment=='Cash'):
            cash=paid_amt
        else:
            account=paid_amt

        trans_comment=f"Service {service.service_id} amount paid"
        create_cash_transaction(cash=cash, account=account, trans_comment=trans_comment, trans_type='DEBIT')
        return Response({"message": "Payment updated successfully."}, status=status.HTTP_200_OK)

    except Service.DoesNotExist:
        return Response({"error": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH'])
def add_service_receiveamt(request):
    data = request.data
    print(data)
    try:
        service_id = data.get('service_id')
        received_amt = data.get('received_amt', 0)
        discount =data.get('discount', 0)
        payment = data.get('payment')

        if not all([service_id, received_amt, payment]):
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            service = Service.objects.get(service_id=service_id)

            service.received_amt += received_amt
            service.discount += discount
            service.received_date = get_today()
            service.receivedpayment_type = payment
            
            total_received = service.received_amt + service.discount
            service.balance = service.receivable_amt - total_received

            if service.received_amt > service.paid_amt:
                service.income = service.received_amt - service.paid_amt
            else:
                service.income = 0
            
            # ----------------------------------
            if service.receivable_amt == total_received:
                service.service_status = 'Closed'
                
                if service.income > 0:
                    income_obj, created = Income.objects.get_or_create(
                        income_date=get_today(),
                        inctype='Service',
                        defaults={'income_amt': service.income}
                    )
                    if not created:
                        income_obj.income_amt += service.income
                        income_obj.save()

                    last_glbal = GlBal.objects.filter(date__lte=get_today(), glac='SER001').order_by('-date').first()
                    last_balance = last_glbal.balance if last_glbal else 0
                    new_balance = last_balance + service.income

                    glbal_obj, created = GlBal.objects.get_or_create(
                        date=get_today(),
                        glac='SER001',
                        defaults={'balance': new_balance}
                    )
                    if not created:
                        glbal_obj.balance = new_balance
                        glbal_obj.save()
            else:
                service.service_status = 'Pending'

            service.save()

            cash=0
            account=0

            if payment=='Cash':
                cash=received_amt
            else:
                account=received_amt

            trans_comment = f"Service {service.service_id} amount Received"
            create_cash_transaction(
                cash=cash,
                account=account,
                trans_comment=trans_comment,
                trans_type='CREDIT'
            )

        return Response({"message": "Payment updated successfully."}, status=status.HTTP_200_OK)

    except Service.DoesNotExist:
        return Response({"error": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
