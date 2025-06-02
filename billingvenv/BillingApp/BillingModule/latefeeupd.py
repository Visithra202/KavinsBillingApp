# BillingModule/latefeeupd.py

import schedule
import threading
import time
from datetime import date, timedelta
from BillingModule.models import LoanBill

def apply_task():
    today = date.today()
    yesterday = today - timedelta(days=1)

    bills = LoanBill.objects.filter(
        loan_acc__ln_typ='Mobile',
        bill_date=yesterday,
        paid_date__isnull=True
    )

    for bill in bills:
        print(f"Late bill found: {bill.loan_acc} | Due: {bill.bill_date}")
        if bill.due_type == 'Advance' or bill.loan_acc.payment_freq == 'Weekly':
            bill.late_fee = 100
        else:
            bill.late_fee = 300
        bill.total_due = bill.due_amount + bill.late_fee
        bill.save()

def start_task():
    schedule.every().day.at("16:19").do(apply_task)

    def run_scheduler():
        while True:
            schedule.run_pending()
            time.sleep(1)

    threading.Thread(target=run_scheduler, daemon=True).start()
