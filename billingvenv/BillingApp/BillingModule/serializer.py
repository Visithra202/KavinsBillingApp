from rest_framework import serializers
from .models import *
from datetime import timedelta
from datetime import datetime
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from decimal import Decimal
import math


class CompdetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compdet
        fields = ['logo_path']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

    def validate_category_name(self, value):
        if Category.objects.filter(category_name=value).exists():
            raise serializers.ValidationError("Category Already exists.")
        return value


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

    def validate_brand_name(self, value):
        if Brand.objects.filter(brand_name=value).exists():
            raise serializers.ValidationError("Brand Already exists.")
        return value


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['item_id', 'item_name', 'category', 'brand', 'quantity', 'min_stock', 'purchase_price', 'sale_price', 'tax_option', 'mrp', 'discount_type', 'discount']

    def validate(self, data):
        if data['sale_price'] > data['mrp']:
            raise serializers.ValidationError("Sale price cannot be greater than MRP.")
        
        if data['sale_price']< data['purchase_price']:
            raise serializers.ValidationError('Purchase price cannot be greater than sale price.')
        return data
    
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class SaleBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleBill
        fields='__all__'

class PurchaseBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseBill
        fields='__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'



class TransactionItemSerializer(serializers.ModelSerializer):
    product = ItemSerializer()

    class Meta:
        model = SaleItem  # Dummy model for inheritance
        fields = ['product', 'item_seq', 'quantity', 'unit_price', 'total_price']

class SaleItemSerializer(TransactionItemSerializer):
    sale = serializers.PrimaryKeyRelatedField(read_only=True)  
    
    class Meta(TransactionItemSerializer.Meta):
        model = SaleItem
        fields = TransactionItemSerializer.Meta.fields + ['sale']
        extra_kwargs = {'sale': {'required': False}}
        
class PurchaseItemSerializer(TransactionItemSerializer):
    purchase = serializers.PrimaryKeyRelatedField(read_only=True)  
    
    class Meta(TransactionItemSerializer.Meta):
        model = PurchaseItem
        fields = TransactionItemSerializer.Meta.fields + ['purchase']
        extra_kwargs = {'purchase': {'required': False}}
        

class PurchasePaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model=PurchasePayment
        fields='__all__'
        
class SaleSerializer(serializers.ModelSerializer):
    sale_products = SaleItemSerializer(source='sale_items', many=True)
    payment = PaymentSerializer()
    customer = CustomerSerializer()
    income = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Sale
        fields = ['bill_no', 'sale_date', 'customer', 'payment', 'total_amount', 'discount', 'sale_products', 'balance', 'paid_amount', 'income']

    @transaction.atomic
    def create(self, validated_data):
        customer_data = validated_data.pop('customer')
        payment_data = validated_data.pop('payment')
        sale_items_data = validated_data.pop('sale_items', [])

        customer, _ = Customer.objects.get_or_create(**customer_data)
        payment = Payment.objects.create(**payment_data)

        bill_no = validated_data.get('bill_no')
        current_year = datetime.now().year
        bill, created = SaleBill.objects.get_or_create(
            bill_year=current_year,
            defaults={'bill_seq': 1}
        )
        if not created:
            bill.bill_seq += 1
            bill.save()


        current_year = datetime.now().year
        latest_sale = Sale.objects.filter(sale_date__year=current_year).order_by('-sale_seq').first()
        sale_seq = (latest_sale.sale_seq if latest_sale else 0) + 1

        sale = Sale.objects.create(
            customer=customer,
            payment=payment,
            sale_seq=sale_seq,
            income=0,
            **validated_data
        )

        income = 0
        income_type=''

        for index, item_data in enumerate(sale_items_data):
            product_data = item_data.pop("product")
            category=product_data['category']
            income_type='Mobile' if category == 'Mobile' else 'Accessories'

            try:
                item = Item.objects.get(
                    item_name=product_data['item_name'],
                    category=product_data['category'],
                    brand=product_data['brand'],
                    sale_price=product_data['sale_price']
                )

                if item.quantity >= item_data['quantity']:
                    item.quantity -= item_data['quantity']
                    item.save()

                    SaleItem.objects.create(
                        sale=sale,
                        item_seq=index + 1,
                        product=item,
                        **item_data
                    )

                    income += (item.sale_price - item.purchase_price) * item_data['quantity']
                else:
                    raise serializers.ValidationError(f"Not enough stock for {item.item_name}")

            except ObjectDoesNotExist:
                raise serializers.ValidationError(f"Item '{product_data['item_name']}' not found.")

        sale.income = income-sale.discount
        sale.save()

        trans_amt = validated_data['paid_amount']
        trans_comment = f"Sale {bill_no} created, credited amount: {trans_amt:.2f}"
        paid=sale.payment
        create_cash_transaction(trans_amt=trans_amt, cash=paid.cash, account=paid.account, trans_comment=trans_comment,trans_type='CREDIT')

        income_obj, created = Income.objects.get_or_create(
        income_date=date.today(),
        inctype=income_type,
        defaults={'income_amt': sale.income}
        )

        if not created:
            income_obj.income_amt += sale.income
            income_obj.save()

        return sale


    

class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    purchase_products = PurchaseItemSerializer(source='purchase_items', many=True)
    purchase_payment = PurchasePaymentSerializer()
    seller = SellerSerializer()

    class Meta:
        model = Purchase
        fields = ['purchase_id', 'purchase_date', 'seller', 'purchase_payment', 'total_amount','paid_amount', 'discount', 'purchase_products', 'balance']

    @transaction.atomic
    def create(self, validated_data):
        seller_data = validated_data.pop('seller')
        payment_data = validated_data.pop('purchase_payment')
        purchase_items_data = validated_data.pop('purchase_items', [])

        seller, _ = Seller.objects.get_or_create(**seller_data)

        payment = PurchasePayment.objects.create(**payment_data)

        current_year = datetime.now().year
        bill, created = PurchaseBill.objects.get_or_create(
            bill_year=current_year,
            defaults={'bill_seq': 1}
        )
        if not created:
            bill.bill_seq += 1
            bill.save()

        current_year = datetime.now().year
        latest_purchase = Purchase.objects.filter(purchase_date__year=current_year).order_by('-purchase_seq').first()
        purchase_seq = (latest_purchase.purchase_seq if latest_purchase else 0) + 1


        purchase_id=validated_data.get('purchase_id')
        purchase = Purchase.objects.create(
            seller=seller,
            purchase_payment=payment,
            purchase_seq=purchase_seq,
            **validated_data
        )

        for index, item_data in enumerate(purchase_items_data):
            product_data = item_data.pop("product")

            try:
                item = Item.objects.get(
                    item_name=product_data['item_name'],
                    category=product_data['category'],
                    brand=product_data['brand'],
                    sale_price=product_data['sale_price']
                )

                item.quantity += item_data['quantity']
                item.save()

                PurchaseItem.objects.create(
                    purchase=purchase,
                    item_seq=index + 1,
                    product=item,
                    **item_data
                )

            except ObjectDoesNotExist:
                raise serializers.ValidationError(f"Item '{product_data['item_name']}' not found.")

        trans_amt = validated_data['paid_amount']
        trans_comment = f"Purchase {purchase_id} created, Debited amount: {trans_amt:.2f}"
        paid=purchase.purchase_payment
        create_cash_transaction(trans_amt=trans_amt, cash=paid.cash, account=paid.account, trans_comment=trans_comment,trans_type='DEBIT')

        return purchase
    
class LoanBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanBill
        fields = '__all__'

class LoanSerializer(serializers.ModelSerializer):
    customer= CustomerSerializer()
    
    class Meta:
        model = Loan
        fields = '__all__'
        read_only_fields = ['loan_accno']  

    @transaction.atomic
    def create(self, validated_data):
        """Creates a Loan and auto-generates LoanBill entries"""
        today = date.today().strftime("%Y%m%d")  
        last_loan = Loan.objects.filter(loan_accno__startswith=today).order_by('-loan_accno').first()

        if last_loan:
            last_seq = int(last_loan.loan_accno[-3:])  
            new_seq = f"{last_seq + 1:03d}"  
        else:
            new_seq = "001"  
        loan_accno = f"{today}{new_seq}" 
        
        customer_data= validated_data.pop('customer', {})
        
        customer, created = Customer.objects.get_or_create(**customer_data)
        loan = Loan.objects.create(
            loan_accno=loan_accno, 
            customer=customer, 
            **validated_data
        )

        due_date = loan.next_pay_date
        frequency_map = {"Monthly": 30, "Weekly": 7}
        interval = timedelta(days=frequency_map.get(loan.payment_freq, 30))

        if loan.payment_freq == "Weekly":
            total_bills = loan.term * 4 
        else:
            total_bills = loan.term

        billSeq=1
        principal=round(loan.loan_amount/loan.term)
        interest=round(loan.emi_amount-principal)

        if loan.advance_bal and loan.advance_bal>0:
            LoanBill.objects.create(
                loan_acc=loan,
                bill_seq=billSeq,
                bill_date=loan.advance_paydate,
                due_amount=loan.advance_bal,
                due_type=f'Advance',
                total_due=loan.advance_bal,
                prin=loan.advance_bal,
                int=0
            )
            billSeq+=1
            total_bills+=1

        for seq in range(billSeq, total_bills + 1):
            LoanBill.objects.create(
                loan_acc=loan,
                bill_seq=seq,
                bill_date=due_date,
                due_amount=loan.emi_amount,
                due_type=f'EMI',
                total_due=loan.emi_amount,
                prin=principal,
                int=interest
            )
            due_date += interval
        
        desc=''
        if(loan.advance_bal>0):
            desc='Loan account creation with adv'
        else:
            desc='Loan account creation'

        LoanJournal.objects.create(
            loan=loan,
            journal_date=today,
            journal_seq=1,
            action_type='CREATE',
            description=desc,
            new_data=Decimal(loan.payment_amount + loan.advance_bal),
            crdr=False,
            trans_amt=Decimal(loan.payment_amount + loan.advance_bal),
            balance_amount=Decimal(loan.payment_amount + loan.advance_bal)
        )

        create_cash_transaction(trans_amt=loan.loan_amount+loan.advance_bal, cash=loan.loan_amount+loan.advance_bal, account=0, trans_comment=f'Loan Issued - {loan.customer.customer_name}', trans_type="DEBIT")
        return loan
    
class GlHistSerializer(serializers.ModelSerializer):

    class Meta:
        model = GlHist
        fields = '__all__'

class LoanJournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanJournal
        fields = '__all__'


class CashGlSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashGl
        fields = '__all__'

class GlBalSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlBal
        fields = '__all__'

class InvestSerializer(serializers.ModelSerializer):
    class Meta :
        model = Invest
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        trans_amt=validated_data.get('invest_amt')
        trans_comment=validated_data.get('invest_desc')
        create_cash_transaction(trans_amt=trans_amt, trans_comment=trans_comment,trans_type='CREDIT')

        return super().create(validated_data)


@transaction.atomic
def create_cash_transaction(trans_amt, cash, account, trans_comment, trans_type):
    today = date.today()
    crdr = trans_type.upper() == 'CREDIT'

    def update_accounts(accno, amount):
        if amount <= 0:
            return None
        
        last_glbal = GlBal.objects.filter(date__lte=today, glac=accno).order_by('-date').first()
        last_balance = last_glbal.balance if last_glbal else 0
        new_balance = last_balance + amount if crdr else last_balance - amount

        gl_entry = CashGl.objects.create(
            accno=accno,
            date=today,
            trans_amt=amount,
            crdr=crdr,
            trans_comt=trans_comment,
            end_balance=new_balance
        )

        glbal_obj, created = GlBal.objects.get_or_create(
            date=today,
            glac=accno,
            defaults={'balance': new_balance}
        )
        if not created:
            glbal_obj.balance = new_balance
            glbal_obj.save()

        return gl_entry

    cash_gl_entry = update_accounts('CASH001', cash)
    acc_gl_entry = update_accounts('ACC001', account)

    return {
        'cash_entry': cash_gl_entry,
        'account_entry': acc_gl_entry
    }

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = '__all__'