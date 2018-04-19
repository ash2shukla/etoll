from django.contrib import admin
from .models import eToll, Transaction

admin.site.register(eToll)


class TransactionAdmin(admin.ModelAdmin):
    readonly_fields = ('created',)


admin.site.register(Transaction, TransactionAdmin)
