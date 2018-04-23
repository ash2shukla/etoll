from .views import Signup, SendOTP, VerifyDLUID, GetIDQR, GetProfile
from django.urls import path
from rest_framework_jwt.views import (obtain_jwt_token,
                                      refresh_jwt_token,
                                      verify_jwt_token)

urlpatterns = [
    path('signup/', Signup.as_view()),
    path('otp/', SendOTP.as_view()),
    path('verify/', VerifyDLUID.as_view()),
    path('getid/', GetIDQR.as_view()),
    path('profile/', GetProfile.as_view()),

    path('login/', obtain_jwt_token),
    path('refreshtoken/', refresh_jwt_token),
    path('verifytoken/', verify_jwt_token),
]
