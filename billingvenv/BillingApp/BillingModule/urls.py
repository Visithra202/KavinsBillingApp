from django.urls import path
from .views import *
from django.views.generic import TemplateView

urlpatterns=[
    path('get-logo/', get_logo, name='get_logo'),
    
    # user
    path('user-login/', user_login, name='user_login'),
   
    path('add-user/', add_user, name='add_user'),
    path('get-user-list/', get_user_list, name='get_user_list'),
    path('delete-user/<int:user_id>/', delete_user, name='delete_user'),

    # Category
    path('add-category/', add_category, name='add_category'),
    path('get-category-list/', get_category_list, name='get_category_list'),
    path('delete-category/<int:category_id>/', delete_category, name='delete_category'),

    # Brand
    path('add-brand/', add_brand, name='add_brand'),
    path('get-brand-list/', get_brand_list, name='get_brand_list'),
    path('delete-brand/<int:brand_id>/', delete_brand, name='delete_brand'),

    #Item
    path('add-item/',add_item, name='add_item'),
    path('get-stock-list/', get_stock_list, name='get_stock_list'),
    path('delete-item/<int:item_id>/', delete_item, name='delete_item'),
    path('edit-item/<int:item_id>/', edit_item, name='edit_item' ),

    # Customer
    path('add-customer/',add_customer, name='add_customer'),
    path('get-customer-list/', get_customer_list, name='get_customer_list'),
    path('delete-customer/<int:customer_id>/', delete_customer, name='delete_customer'),

    # Seller
    path('add-seller/',add_seller, name='add_seller'),
    path('get-seller-list/', get_seller_list, name='get_seller_list'),
    path('delete-seller/<int:seller_id>/', delete_seller, name='delete_seller'),

    # Sale bill
    path('get-sale-bill-no/', get_sale_bill_no, name='get_sale_bill_no'),

    # Sale bill
    path('get-purchase-bill-no/', get_purchase_bill_no, name='get_purchase_bill_no'),

    # Sale
    path('add-sale/', add_sale, name='add_sale'),
    path('get-sale-list/', get_sale_list, name='get_sale_list'),
    path('get-sale-items-list/', get_sale_items_list, name='get_sale_items_list'),
    path('delete-sale/<int:bill_no>/', delete_sale, name='delete_sale'),

    # payments
    path('get-payment-list/', get_payment_list, name='get_payment_list'),
    
    # Loan
    path('create-loan/', create_loan, name='create_loan'),
    path('get-loan-list/', get_loan_list, name='get_loan_list'),
    path('get-collection-list/', get_collection_list, name='get_collection_list'),
    path('get-loan-bill/<str:loan_accno>', get_loan_bill, name='get_loan_bill'),
    path('get-acc-loan-bills/<str:loan_accno>', get_acc_loan_bills, name='get_acc_loan_bills'),
    path('add-loan-payment/', add_loan_payment, name='add_loan_payment'),
    path('get-loan-journal/<str:loan_accno>/', get_loan_journal, name='get_loan_journal'),
    
    # Purchase
    path('add-purchase/', add_purchase, name='add_purchase'),
    path('get-purchase-list/', get_purchase_list, name='get_purchase_list'),
    path('get-purchase-items-list/', get_purchase_items_list, name='get_purchase_items_list'),
    path('get-purchase-payment-list/', get_purchase_payment_list, name='get_purchase_payment_list'),
    
    # Dashboard
    path('get-dashboard-customer-details/', get_dashboard_customer_details, name='get_dashboard_customer_details'),
    path('get-sales-summary/', get_sales_summary, name='get_sales_summary'),
    path('get-purchase-summary/', get_purchase_summary, name='get_purchase_summary'),
    path('get-income-summary/', get_income_summary, name='get_income_summary'),
    path('get-stock-summary/', get_stock_summary, name='get_stock_summary'),
    path('recent-sales/', recent_sales, name='recent_sales'),
    path('stats/last-10-days/', last_10_days_stats, name='last_10_days_stats'),
    
    # report
    path('get-report-sales-by-customer/', sales_by_customer, name='sales_by_customer'),
    path('get-report-sales-by-products/', sale_by_products, name='sale_by_products'),
    
    path('get-report-purchase-by-products/', purchase_by_products, name='purchase_by_products'),
    path('get-report-purchase-by-seller/', purchase_by_seller, name='purchase_by_seller'),
    path('get-report-cash/', cash_report, name='cash-report'),
    path('get-report-account/', account_report, name='account-report'),
    path('get-report-penalty/', penalty_report, name='penalty-report'),
    path('get-required-stock-list/', get_required_stock, name='get_required_stock_list'),

    path('get-balance-sheet-report/', get_balancesheet_report, name='get_balancesheet_report'),

    path('get-last-balance/', get_last_balance, name='get_last_balance'),
    path('amount-transfer/', amount_transfer, name='amount_transfer'),
    path('get-amount-transfer-list/', amount_transfer_list, name='amount_transfer_list'),

    # service
    path('add-service/', add_service, name='add_service'),
    path('get-service-list/', get_service_list, name='get_service_list'),
    path('add-service-paid-amount/', add_service_paidamt, name='add_service_paidamt'),
    path('add-service-receive-amount/', add_service_receiveamt, name='add_service_receiveamt'),

    path('', TemplateView.as_view(template_name='index.html')), 

    # invest
    path('add-invest/',add_invest, name='add_invest'),
    path('get-invest-list/', get_invest_list, name='get_invest_list'),

    # Income
    path('get-income-list/', get_income_list, name='get_income_list'),
    path('receive-income/', receive_income, name='receive_income'),
]