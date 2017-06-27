from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^get_more_tables/',views.get_more_tables, name='get_more_tables'),
    url(r'^ML/',views.ml,name='ML'),
]
