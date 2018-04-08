from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    ulr(r'^ordercomm/', views.ordercomm, name='ordercomm'),
    url(r'^optionlevels/', views.option_levels, name='option_levels')
]
