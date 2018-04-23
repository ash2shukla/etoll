from .views import TollTax, PayTollSuccess, RaspbVerify, GetTransactions, GetTolls
from django.urls import path

urlpatterns = [
    path('gettolltax/', TollTax.as_view()),
    path('paymentsuccess/', PayTollSuccess.as_view()),
    path('raspbverify/', RaspbVerify.as_view()),
    path('gettxns/', GetTransactions.as_view()),
    path('gettolls/', GetTolls.as_view())
]
