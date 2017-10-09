from django.shortcuts import render
from django.forms.models import model_to_dict
# Create your views here.

from .models import Comments, User, Orders
import json
import datetime
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseServerError
from django.views.decorators.csrf import csrf_exempt
from django.contrib.sessions.models import Session
from django.contrib.auth.decorators import login_required

from .forms import OrderForm

import redis

import numpy as np
import pandas as pd
from sqlalchemy import create_engine
#engine2 = create_engine('postgres://quikuser:JbT061409@0.0.0.0:5432/quik')
#connection2 = engine2.connect()
#df = pd.read_sql('SELECT * FROM ri_options',connection2)
#mona = df.set_index('id').head().to_json()

@login_required
def home(request):
    form = OrderForm()
    cuser = request.user
    print(cuser)
    engine2 = create_engine('postgres://quikuser:JbT061409@0.0.0.0:5432/quik')
    connection2 = engine2.connect()
    account = pd.read_sql('SELECT * from trade_accounts where firmid = \''+str(cuser)+'\'',connection2)
    account = account.T.to_json()
    rts_min = pd.read_csv('crons/RTS_min.csv',index_col='<DATE>')
    rvi_min = pd.read_csv('crons/RVI_min.csv',index_col='date').T.to_json()
    rts_min['log_ret'] = np.log(rts_min['<CLOSE>']) - np.log(rts_min['<CLOSE>'].shift(1))
    rts_min['returns'] = np.log(rts_min['<CLOSE>'] / rts_min['<CLOSE>'].shift(1))
    rts_min['rea_var'] = 252 * np.cumsum(rts_min['returns'] ** 2) / np.arange(len(rts_min))
    rts_min['rea_vol'] = np.sqrt(rts_min['rea_var'])
    rts_min = rts_min.T.to_json()
    df = pd.read_sql('SELECT * FROM ri_options',connection2)
    df2 = pd.read_sql('SELECT * FROM ri_options_fixed',connection2)
    snap1 = pd.read_sql('SELECT index,ttm_1,vol_1,ttm_2,vol_2,ttm_3,vol_3,ttm_4,vol_4,ttm_5,vol_5 FROM ri_snap_mirror',connection2)
    snap2 = snap1.set_index('index').T.to_json()
    snap1 = snap1.T.to_json()
    mona = df.set_index('id').T.to_json()
    df2['id'] = df2['id'].str.split().str[0]
    margins = df2.set_index('id').T.to_json()
    return render(request, 'dex/index2.html', locals())

def orderadd(request):
    if request.method == 'POST':
        print(request.POST)
        return HttpResponse(json.dumps({'message': 'aduuuuu'}))

def ordercomm(request):
    print('requested')
    if request.method == 'POST':
#        print(request.POST)
        qd = request.POST.copy()
        del qd['csrfmiddlewaretoken']
#        print(dict(qd.lists()))
        df = pd.DataFrame.from_dict(dict(qd.lists()))
#        df['ORDERTIME'] = pd.to_datetime(df['ORDERTIME'],utc=True)
        df['PERIOD'] = datetime.datetime.now()
        ordergroup = qd['ACCOUNT']+'_'+datetime.datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
        df['ORDERGROUP'] = ordergroup
#        print(qd['ACCOUNT']+'_'+datetime.datetime.now().strftime("%Y_%m_%d_%H_%M_%S"))
        conf = {'ordergroup':ordergroup,}
        legs = []
        for i in range(len(df)):
            m = Orders(**df.loc[i].to_dict())
            m.save()
            m.PERIOD = str(m.PERIOD)
            m.ORDERTIME = str(m.ORDERTIME)
            legs.append(model_to_dict(m))
#            print('saved',model_to_dict(m))
            print('CAPUCHA',m.id,m.ORDERGROUP)
        conf['legs'] = legs
        return HttpResponse(json.dumps({'message': conf}))

@csrf_exempt
def node_api(request):
    try:
        #Get User from sessionid
        session = Session.objects.get(session_key=request.POST.get('sessionid'))
        user_id = session.get_decoded().get('_auth_user_id')
        user = User.objects.get(id=user_id)
 
        #Create comment
        Comments.objects.create(user=user, text=request.POST.get('comment'))
        
        #Once comment has been created post it to the chat channel
        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        r.publish('chat', user.username + ': ' + request.POST.get('comment'))
        
        return HttpResponse("Everything worked :)")
    except Exception:
        return HttpResponseServerError(str('e'))
