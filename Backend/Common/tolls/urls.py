from .views import TollTax, PayTollSuccess
from django.urls import path

urlpatterns = [
    path('gettolltax/', TollTax.as_view()),
    path('paymentsuccess/', PayTollSuccess.as_view())
]
