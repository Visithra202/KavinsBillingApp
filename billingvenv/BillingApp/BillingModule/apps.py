from django.apps import AppConfig
import threading
import os

scheduler_started = False

class BillingmoduleConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'BillingModule'

    def ready(self):
        global scheduler_started
        if not scheduler_started and os.environ.get('RUN_MAIN') == 'true':
            from .latefeeupd import start_task
            threading.Thread(target=start_task, daemon=True).start()
            scheduler_started = True
