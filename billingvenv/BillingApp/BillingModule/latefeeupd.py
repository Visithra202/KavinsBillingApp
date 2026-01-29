# BillingModule/latefeeupd.py

import schedule
import threading
import time
from datetime import date
from BillingModule.models import LoanBill, LoanJournal, Loan
from decimal import Decimal


def apply_task():
    today = date.today()

    bills = LoanBill.objects.filter(
        loan_acc__ln_typ__in=('MOB','OLD'),
        bill_date__lt=today,
        paid_date__isnull=True,
        late_fee=0
    )

    for bill in bills:
        print(f"Late bill found: {bill.loan_acc} | Due: {bill.bill_date}")
        if bill.due_type == 'Advance' or bill.loan_acc.payment_freq == 'Weekly':
            bill.late_fee = 100
        else:
            bill.late_fee = 300
        bill.total_due = bill.due_amount + bill.late_fee
        bill.save()

        loan=Loan.objects.get(loan_accno=bill.loan_acc)
        loan.bal_amount+=bill.late_fee
        loan.save()
        
        latest_journal_entry = LoanJournal.objects.filter(loan__loan_accno=bill.loan_acc).order_by('-journal_id').first() 

        if latest_journal_entry:
            previous_data = latest_journal_entry.new_data
            last_seq=latest_journal_entry.journal_seq 
        else:
            previous_data = Decimal('0.00')
            last_seq=1
                
                
        LoanJournal.objects.create(
            loan=bill.loan_acc,
            journal_date=today,
            journal_seq=last_seq+1,
            action_type='PENALTY',
            description=f"Due penalty added, bill seq - {bill.bill_seq}",
            old_data=previous_data,
            new_data=previous_data+bill.late_fee,
            crdr=False,
            trans_amt=bill.late_fee,
            balance_amount=previous_data + bill.late_fee
        )

def start_task():
    schedule.every().day.at("09:30").do(apply_task)

    def run_scheduler():
        while True:
            schedule.run_pending()
            time.sleep(1)

    threading.Thread(target=run_scheduler, daemon=True).start()


# BillingModule/latefeeupd.py

# import schedule
# import threading
# import time
# from datetime import date
# from BillingModule.models import LoanBill, LoanJournal, Loan
# from decimal import Decimal
# from dateutil.relativedelta import relativedelta


# def apply_task():
#     today = date.today()

#     bills = LoanBill.objects.filter(
#         loan_acc__ln_typ__in=("MOB", "OLD"),
#         bill_date__lt=today,
#         paid_date__isnull=True,
#         late_fee=0,
#     )

#     for bill in bills:
#         print(f"Late bill found: {bill.loan_acc} | Due: {bill.bill_date}")
#         if bill.due_type == "Advance" or bill.loan_acc.payment_freq == "Weekly":
#             bill.late_fee = 100
#         else:
#             bill.late_fee = 300
#         bill.total_due = bill.due_amount + bill.late_fee
#         bill.save()

#         loan = Loan.objects.get(loan_accno=bill.loan_acc)
#         loan.bal_amount += bill.late_fee
#         loan.save()

#         latest_journal_entry = (
#             LoanJournal.objects.filter(loan__loan_accno=bill.loan_acc)
#             .order_by("-journal_id")
#             .first()
#         )

#         if latest_journal_entry:
#             previous_data = latest_journal_entry.new_data
#             last_seq = latest_journal_entry.journal_seq
#         else:
#             previous_data = Decimal("0.00")
#             last_seq = 1

#         LoanJournal.objects.create(
#             loan=bill.loan_acc,
#             journal_date=today,
#             journal_seq=last_seq + 1,
#             action_type="PENALTY",
#             description=f"Due penalty added, bill seq - {bill.bill_seq}",
#             old_data=previous_data,
#             new_data=previous_data + bill.late_fee,
#             crdr=False,
#             trans_amt=bill.late_fee,
#             balance_amount=previous_data + bill.late_fee,
#         )

        
#     cutoff = today - relativedelta(months=1)

#     overdue_bills = LoanBill.objects.filter(
#         loan_acc__ln_typ__in=("MOB", "OLD"),
#         bill_date__lt=cutoff,
#         paid_date__isnull=True,
#     )

#     for bill in overdue_bills:
#         print(
#             f"Overdue bill found: {bill.loan_acc} | Due: {bill.bill_date} | Late Fee: {bill.late_fee}"
#         )

#         months_overdue = (today.year - bill.bill_date.year) * 12 + (
#             today.month - bill.bill_date.month
#         )

#         if bill.due_type == "Advance" or bill.loan_acc.payment_freq == "Weekly":
#             late_fee = 100 * months_overdue
#         else:
#             late_fee = 300 * months_overdue

#         last_bill = (
#             LoanBill.objects.filter(
#                 loan_acc=bill.loan_acc,
#                 bill_date = bill.bill_date
#             )
#             .order_by("-bill_seq")
#             .first()
#         )

#         if last_bill.due_amount == 0:
#             last_bill.late_fee += late_fee
#             last_bill.total_due += late_fee
#             last_bill.bill_date = today
#             last_bill.save()
#         else:
#             LoanBill.objects.create(
#                 loan_acc=bill.loan_acc,
#                 bill_date=today,
#                 due_amount=0,
#                 late_fee=late_fee,
#                 total_due=late_fee,
#                 due_type="PENALTY",
#                 bill_seq=last_bill.bill_seq + 1
#             )


# def start_task():
#     schedule.every().day.at("09:30").do(apply_task)

#     def run_scheduler():
#         while True:
#             schedule.run_pending()
#             time.sleep(1)

#     threading.Thread(target=run_scheduler, daemon=True).start()