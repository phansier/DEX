from django.forms import ModelForm
from dex.models import Orders

class OrderForm(ModelForm):
    class Meta:
        model = Orders
        exclude = ['VISIBLE_QTY']
