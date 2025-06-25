from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Income, GlBal
from BillingModule.serializer import IncomeSerializer, create_cash_transaction
from django.utils import timezone

# Income

def get_today():
    return timezone.localdate()

@api_view(['GET'])
def get_income_list(request):
    today=get_today()
    mobile_income = Income.objects.filter(income_taken=False, income_date__lt=today, inctype='Mobile')
    acc_income = Income.objects.filter(income_taken=False, income_date__lt=today, inctype='Accessories')
    ser_income = Income.objects.filter(income_taken=False, income_date__lt=today, inctype='Service')
    pen_income = Income.objects.filter(income_taken=False, income_date__lt=today, inctype='Penalty')
    int_income = Income.objects.filter(income_taken=False, income_date__lt=today, inctype='Interest')

    mob_obj = GlBal.objects.filter(glac='MOB001').order_by('-date').first()
    tot_mob_inc = mob_obj.balance if mob_obj else 0

    acc_obj = GlBal.objects.filter(glac='ACS001').order_by('-date').first()
    tot_acc_inc = acc_obj.balance if acc_obj else 0

    ser_obj = GlBal.objects.filter(glac='SER001').order_by('-date').first()
    tot_ser_inc = ser_obj.balance if ser_obj else 0

    pen_obj = GlBal.objects.filter(glac='PENL001').order_by('-date').first()
    tot_pen_inc = pen_obj.balance if pen_obj else 0

    int_obj = GlBal.objects.filter(glac='INT001').order_by('-date').first()
    tot_int_inc = int_obj.balance if int_obj else 0


    serializer_mob = IncomeSerializer(mobile_income, many=True)
    serializer_acc = IncomeSerializer(acc_income, many=True)
    serializer_ser = IncomeSerializer(ser_income, many=True)
    serializer_pen = IncomeSerializer(pen_income, many=True)
    serializer_int = IncomeSerializer(int_income, many=True)

    return Response({
        'mobincome_list': serializer_mob.data,
        'accincome_list': serializer_acc.data,
        'serincome_list':serializer_ser.data,
        'penincome_list':serializer_pen.data,
        'intincome_list':serializer_int.data,
        'mobileInc':tot_mob_inc,
        'accInc':tot_acc_inc,
        'interestInc':tot_int_inc,
        'serviceInc':tot_ser_inc,
        'penaltyInc':tot_pen_inc
    })

@api_view(['POST'])
def receive_income(request):
    data=request.data
    receive_amt = data.get('receive_amt')
    inc_type = data.get('income_type')
    payment = data.get('payment')

    if not receive_amt or not payment or not inc_type:
        return Response({"message": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    income_list = Income.objects.filter(income_taken=False, inctype=inc_type).order_by('income_date')

    if not income_list.exists():
        return Response({"message": "No pending income found for this type"}, status=status.HTTP_404_NOT_FOUND)
    
    amount=receive_amt
    for income in income_list:
        rem=income.income_amt-income.received_amt

        if rem <= amount:
            income.received_amt+=rem
            income.income_taken = True
            income.received_date=get_today()
            amount-=rem    
        else:
            income.received_amt+=amount
            amount=0
        
        income.save()

        if amount==0:
            break

    cash = account = 0

    if(payment=='Cash'):
        cash=receive_amt
    else:
        account=receive_amt

    create_cash_transaction(
        cash=cash,
        account=account,
        trans_comment=f"{inc_type} Income Received",
        trans_type="DEBIT"
    )

    today=get_today()

    accno=''

    if(inc_type=='Penalty'):
        create_cash_transaction(
            penalty=receive_amt,
            trans_comment="Penalty Income Received",
            trans_type='DEBIT'
        )
    elif inc_type=='Mobile':
        accno='MOB001'
    elif inc_type=='Accessories':
        accno='ACS001'
    elif inc_type=='Service':
        accno='SER001'
        
    if accno:
        last_glbal = GlBal.objects.filter(date__lte=today, glac=accno).order_by('-date').first()
        last_balance = last_glbal.balance if last_glbal else 0
        new_balance = last_balance - receive_amt

        glbal_obj, created = GlBal.objects.get_or_create(
            date=today,
            glac=accno,
            defaults={'balance': new_balance}
        )
        if not created:
            glbal_obj.balance = new_balance
            glbal_obj.save()
    
       
    return Response({"message": "Income Received"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_last_balance(request):
    cash_bal = GlBal.objects.filter(glac='CASH001').order_by('-date').first()
    acc_bal = GlBal.objects.filter(glac='ACC001').order_by('-date').first()
    return Response({
        'cash_bal': cash_bal.balance if cash_bal else 0,
        'acc_bal': acc_bal.balance if acc_bal else 0,
    }, status=status.HTTP_200_OK)
