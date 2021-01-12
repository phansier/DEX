"""myproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url,include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from dex import views as vws


urlpatterns = [
    url(r'^$', vws.home, name='home'),
    url(r'^blockchain/$',vws.blockchainview, name='blockchainview'),
    url(r'^dex/ordercomm/',vws.ordercomm,name='ordercomm'),
    url(r'^dex/formol/',vws.orderadd,name='orderadd'),
    url(r'^dex/refreshpos/',vws.refreshpositions,name='refreshpositions'),
    url(r'^dex/optionlevels/',vws.option_levels,name='option_levels'),
    url(r'^dex/zardulu/',vws.zardulu,name='zardulu'),
    url(r'^dex/zardulu_one_year/',vws.zardulu_one_year,name='zardulu_one_year'),
    url(r'^dex/futuresResponse/',vws.futuresResponse,name='futuresResponse'),
    url(r'^node_api/$', vws.node_api, name='node_api'),
#    url(r'^ajax_mark_as_read/$', views.ajax_mark_as_read, name='ajax_mark_as_read'),
    url(r'^admin/', admin.site.urls),
    url(r'^login/$', auth_views.LoginView.as_view(template_name='admin/login.html'), name='login'),
    url(r'^logout/$', auth_views.LogoutView.as_view(next_page='/'), {'next_page': '/'}, name='logout'),
    # url(r'^accounts/', include('django.contrib.auth.urls', namespace="auth")),
    url(r'^accounts/', include(('django.contrib.auth.urls','auth'), namespace="auth")),
#    url(r'^$', include('landing.urls')),
    url(r'^about/', include('landing.urls')),
    url(r'^deck/',include('deck.urls')),
    url(r'^IVdeck/',include('IVdeck.urls')),
#    url(r'^dex/',include('dex.urls')),
    url(r'^accounts/',include('django.contrib.auth.urls')),
]

#from django.conf.urls import patterns, include, url
 
#urlpatterns = patterns('',
#    url(r'^$', 'core.views.home', name='home'),
#    url(r'^node_api$', 'core.views.node_api', name='node_api'),
#    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'admin/login.html'}, name='login'),
#    url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}, name='logout'),
#)
#from django.conf.urls import patterns, include, url

#urlpatterns = [
#    url(r'^$', 'core.views.home', name='home'),
#    url(r'^node_api$', 'core.views.node_api', name='node_api'),
#    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'admin/login.html'}, name='login'),
#    url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}, name='logout'),
#]
