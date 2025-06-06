# BillingModule/latefeeupd.py

import schedule
import threading
import time
from datetime import date, timedelta
from BillingModule.models import LoanBill, LoanJournal, Loan
from decimal import Decimal


def apply_task():
    today = date.today()

    bills = LoanBill.objects.filter(
        loan_acc__ln_typ='MOB',
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
            description="Due penalty added",
            old_data=previous_data,
            new_data=previous_data+bill.late_fee,
            crdr=False,
            trans_amt=bill.late_fee,
            balance_amount=previous_data + bill.late_fee
        )

def start_task():
    schedule.every().day.at("13:52").do(apply_task)

    def run_scheduler():
        while True:
            schedule.run_pending()
            time.sleep(1)

    threading.Thread(target=run_scheduler, daemon=True).start()
