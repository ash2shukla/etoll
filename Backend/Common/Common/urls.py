from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('auth/', include('authenticate.urls')),
    path('vehicle/', include('vehicle.urls')),
    path('etoll/', include('tolls.urls')),
    path('admin/', admin.site.urls),
]
