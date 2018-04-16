from .views import AddVehicle, Share, AddShare, ListOwned, ListShared
from django.urls import path

urlpatterns = [
    path('add/', AddVehicle.as_view()),
    path('share/<str:typ>/', Share.as_view()),
    path('addshare/', AddShare.as_view()),
    path('listowned/', ListOwned.as_view()),
    path('listshared/', ListShared.as_view())
]
