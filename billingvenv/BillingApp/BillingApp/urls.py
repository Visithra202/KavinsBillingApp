from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView, RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('BillingModule.urls')),

    re_path(r'^kavins-billing-app/(?!static/).*$', TemplateView.as_view(template_name='index.html')),
    path('kavins-billing-app/', TemplateView.as_view(template_name='index.html')),
    path('', RedirectView.as_view(url='/kavins-billing-app/login/', permanent=False)),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
