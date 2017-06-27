from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Create your views here.
import json
from django.http import HttpResponse
import requests

# import pandas as pd
#req = json.loads( request.body.decode('utf-8') )

@login_required
def index(request):
    # url = 'http://iss.moex.com/iss/engines/futures/markets/forts/securities.json'
    url = 'http://iss.moex.com/iss/engines/futures/markets/forts/securities.json?iss.json=extended'
    obj = requests.get(url)
    #data = json.loads(obj.content)
    data = json.loads(obj.content.decode('utf-8'))
    market_data = data[1]['securities'][1]
    # df1 = pd.DataFrame(data['securities']['data'],columns=data['securities']['metadata'])
    return render(request,'deck/deck_home.html',{'data':data[1]['securities'][1],'market_data':market_data})



#def get_more_tables(request):
#    increment = int(request.GET['append_increment'])
#    increment_to = increment + 10
#    order = [increment_to,5,6]
    # order = Order.objects.filter(owner=request.user).order_by('-id')[increment:increment_to]
#    return render(request, 'deck/deck_table.html', {'order': order})

def ml(request):
    return render(request,'deck/ML.html')


# url = 'http://iss.moex.com/iss/engines/futures/markets/forts/securities.json?'
# obj = requests.get(url)
# data = json.loads(obj.content)
