from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from BillingModule.models import Customer, Sale, Purchase, Item, Income, Discmon
from django.utils import timezone
from django.http import JsonResponse
from django.db.models import Sum, F, Q, ExpressionWrapper, DecimalField
from django.utils.timezone import now
from datetime import datetime, timedelta


# Dashboard details


def get_today():
    return timezone.localdate()


def get_week_range(reference_date=None):
    if not reference_date:
        reference_date = get_today()
    this_monday = reference_date - timedelta(days=reference_date.weekday())
    last_monday = this_monday - timedelta(days=7)
    last_sunday = last_monday + timedelta(days=6)

    start = timezone.make_aware(datetime.combine(last_monday, datetime.min.time()))
    end = timezone.make_aware(datetime.combine(last_sunday, datetime.max.time()))
    return start, end


def get_month_range(reference_date=None):
    if not reference_date:
        reference_date = get_today()
    this_month_first = reference_date.replace(day=1)
    prev_month_last = this_month_first - timedelta(days=1)
    prev_month_first = prev_month_last.replace(day=1)

    start = timezone.make_aware(datetime.combine(prev_month_first, datetime.min.time()))
    end = timezone.make_aware(datetime.combine(prev_month_last, datetime.max.time()))
    return start, end


@api_view(["GET"])
def get_dashboard_customer_details(request):
    today = get_today()
    total_customers = Customer.objects.count()

    start_week, end_week = get_week_range(today)
    start_month, end_month = get_month_range(today)

    last_week_customers = Customer.objects.filter(
        created_at__range=(start_week, end_week)
    ).count()
    last_month_customers = Customer.objects.filter(
        created_at__range=(start_month, end_month)
    ).count()

    return JsonResponse(
        {
            "total_customers": total_customers,
            "last_week_customers": last_week_customers,
            "last_month_customers": last_month_customers,
        }
    )


@api_view(["GET"])
def get_sales_summary(request):
    today = get_today()
    today_sales_amount = (
        Sale.objects.filter(sale_date=today).aggregate(total=Sum("paid_amount"))[
            "total"
        ]
        or 0
    )

    start_week, end_week = get_week_range(today)
    start_month, end_month = get_month_range(today)

    last_week_total = (
        Sale.objects.filter(sale_date__range=(start_week, end_week)).aggregate(
            total=Sum("paid_amount")
        )["total"]
        or 0
    )

    last_month_total = (
        Sale.objects.filter(sale_date__range=(start_month, end_month)).aggregate(
            total=Sum("paid_amount")
        )["total"]
        or 0
    )

    return JsonResponse(
        {
            "today_sales_amount": today_sales_amount,
            "last_week_sales": last_week_total,
            "last_month_sales": last_month_total,
        }
    )


@api_view(["GET"])
def get_purchase_summary(request):
    today = get_today()
    today_purchase_amount = (
        Purchase.objects.filter(purchase_date=today).aggregate(
            total=Sum("total_amount")
        )["total"]
        or 0
    )

    start_week, end_week = get_week_range(today)
    start_month, end_month = get_month_range(today)

    last_week_total = (
        Purchase.objects.filter(purchase_date__range=(start_week, end_week)).aggregate(
            total=Sum("total_amount")
        )["total"]
        or 0
    )

    last_month_total = (
        Purchase.objects.filter(
            purchase_date__range=(start_month, end_month)
        ).aggregate(total=Sum("total_amount"))["total"]
        or 0
    )

    return JsonResponse(
        {
            "today_purchase_amount": today_purchase_amount,
            "last_week_purchase": last_week_total,
            "last_month_purchase": last_month_total,
        }
    )


def calculate_stock_summary():
    value_expr = ExpressionWrapper(
        F("quantity") * F("purchase_price"), output_field=DecimalField()
    )

    total_stock = Item.objects.aggregate(total=Sum(value_expr))["total"] or 0

    mobile_stock = (
        Item.objects.filter(category="Mobile").aggregate(total=Sum(value_expr))["total"]
        or 0
    )

    accessories_stock = (
        Item.objects.filter(~Q(category="Mobile")).aggregate(total=Sum(value_expr))[
            "total"
        ]
        or 0
    )

    return {
        "total_stock": total_stock,
        "mobile_stock": mobile_stock,
        "accessories_stock": accessories_stock,
    }


@api_view(["GET"])
def get_stock_summary(request):
    stock_data = calculate_stock_summary()
    return JsonResponse(stock_data)


@api_view(["GET"])
def get_income_summary(request):
    today = get_today()

    today_income = (
        Sale.objects.filter(sale_date=today).aggregate(total=Sum("income"))["total"]
        or 0
    )

    start_week, end_week = get_week_range(today)
    last_week_income = (
        Sale.objects.filter(sale_date__range=(start_week, end_week)).aggregate(
            total=Sum("income")
        )["total"]
        or 0
    )

    start_month, end_month = get_month_range(today)
    last_month_income = (
        Sale.objects.filter(sale_date__range=(start_month, end_month)).aggregate(
            total=Sum("income")
        )["total"]
        or 0
    )

    return JsonResponse(
        {
            "today_income": today_income,
            "last_week_income": last_week_income,
            "last_month_income": last_month_income,
        }
    )


@api_view(["GET"])
def recent_sales(request):
    recent_sales = Sale.objects.order_by("-sale_seq")[:10].values(
        "bill_no", "customer__customer_name", "total_amount", "sale_date", "balance"
    )

    return JsonResponse(list(recent_sales), safe=False)


@api_view(["GET"])
def last_10_days_stats(request):
    today = now().date()
    stats = []

    for i in range(9, -1, -1):
        day = today - timedelta(days=i)
        sales = (
            Sale.objects.filter(sale_date=day).aggregate(total=Sum("total_amount"))[
                "total"
            ]
            or 0
        )
        purchase = (
            Purchase.objects.filter(purchase_date=day).aggregate(
                total=Sum("total_amount")
            )["total"]
            or 0
        )
        stats.append(
            {
                "date": day.strftime("%b %d"),
                "sales": float(sales),
                "purchase": float(purchase),
            }
        )

    return Response(stats)


@api_view(['GET'])
def get_average_income(request):
    today = now().date()
    first_day_this_month = today.replace(day=1)
    days_so_far = today.day

    # last month calculation
    last_day_last_month = first_day_this_month - timedelta(days=1)
    first_day_last_month = last_day_last_month.replace(day=1)
    days_last_month = last_day_last_month.day  # total days in that month

    def avg_income_for_type(inctype, start_date, end_date, days):
        incomes = Income.objects.filter(
            inctype=inctype,
            income_date__range=(start_date, end_date)
        )
        total_income = incomes.aggregate(total=Sum('income_amt'))['total'] or 0

        #if inctype == "Penalty" and start_date.month == now.month:
        if inctype == "Penalty":
            now = datetime.now()
            if start_date.month == now.month: yearmon = now.strftime("%y%m")
            if start_date.month != now.month: yearmon = start_date.strftime("%y%m")

            disc_record = Discmon.objects.filter(yearmon=yearmon).first()

            if disc_record:
                total_income = total_income - disc_record.discamt

        avg = (total_income / days if days > 0 else 0)

        return float(avg)

    # --- this month averages ---
    mobile_avg = avg_income_for_type('Mobile', first_day_this_month, today, days_so_far)
    accessories_avg = avg_income_for_type('Accessories', first_day_this_month, today, days_so_far)
    service_avg = avg_income_for_type('Service', first_day_this_month, today, days_so_far)
    interest_avg = avg_income_for_type('Interest', first_day_this_month, today, days_so_far)
    penalty_avg = avg_income_for_type('Penalty', first_day_this_month, today, days_so_far)
    overall_total = mobile_avg + accessories_avg + service_avg + interest_avg + penalty_avg

    # --- last month averages ---
    mobile_last = avg_income_for_type('Mobile', first_day_last_month, last_day_last_month, days_last_month)
    accessories_last = avg_income_for_type('Accessories', first_day_last_month, last_day_last_month, days_last_month)
    service_last = avg_income_for_type('Service', first_day_last_month, last_day_last_month, days_last_month)
    interest_last = avg_income_for_type('Interest', first_day_last_month, last_day_last_month, days_last_month)
    penalty_last = avg_income_for_type('Penalty', first_day_last_month, last_day_last_month, days_last_month)
    overall_last = mobile_last + accessories_last + service_last + interest_last + penalty_last

    return Response({
        'this_month': {
            'mobile_income': mobile_avg,
            'accessories_income': accessories_avg,
            'service_income': service_avg,
            'interest_income': interest_avg,
            'penalty_income': penalty_avg,
            'overall_total': overall_total,
        },
        'last_month': {
            'mobile_income': mobile_last,
            'accessories_income': accessories_last,
            'service_income': service_last,
            'interest_income': interest_last,
            'penalty_income': penalty_last,
            'overall_total': overall_last,
        }
    })
