from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Create your views here.
import json
from django.http import HttpResponse
import requests

# import pandas as pd


@login_required
def index(request):
    # url = 'http://iss.moex.com/iss/engines/futures/markets/forts/securities.json'
    url = 'http://iss.moex.com/iss/engines/futures/markets/forts/securities.json?iss.json=extended'
    obj = requests.get(url)
    data = json.loads(obj.content)
    # df1 = pd.DataFrame(data['securities']['data'],columns=data['securities']['metadata'])
    return render(request,'deck/deck_home.html',{'data':data[1]['securities'][1]})


# url = 'http://iss.moex.com/iss/engines/futures/markets/forts/securities.json?'
# obj = requests.get(url)
# data = json.loads(obj.content)
