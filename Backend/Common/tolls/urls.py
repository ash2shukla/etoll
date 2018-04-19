from .views import TollTax, PayTollSuccess, RaspbVerify, GetTransactions
from django.urls import path

urlpatterns = [
    path('gettolltax/', TollTax.as_view()),
    path('paymentsuccess/', PayTollSuccess.as_view()),
    path('raspbverify/', RaspbVerify.as_view()),
    path('gettxns/', GetTransactions.as_view())
]
