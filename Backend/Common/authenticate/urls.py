from .views import ListUsers, Signup, SendOTP, VerifyDLUID
from django.urls import path
from rest_framework_jwt.views import (obtain_jwt_token,
                                      refresh_jwt_token,
                                      verify_jwt_token)

urlpatterns = [
    path('signup/', Signup.as_view()),
    path('otp/', SendOTP.as_view()),
    path('verify/', VerifyDLUID.as_view()),

    path('login/', obtain_jwt_token),
    path('refreshtoken/', refresh_jwt_token),
    path('verifytoken/', verify_jwt_token),

    path('user/', ListUsers.as_view()),
]
