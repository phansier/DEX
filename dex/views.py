from django.shortcuts import render
from django.forms.models import model_to_dict
# Create your views here.

from .models import Comments, User, Orders,TradeAccount, Position
import json
import time
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
import requests
def data_from_api():
    # url = 'http://iss.moex.com/iss/engines/futures/markets/forts/securities.json'
    url = 'http://iss.moex.com/iss/engines/futures/markets/forts/securities.json?iss.json=extended'
    obj = requests.get(url)
    #data = json.loads(obj.content)
    data = json.loads(obj.content.decode('utf-8'))
    # market_data = data[1]['securities'][1]
    market_data = data[1]['marketdata'][1]
    dd = pd.DataFrame(market_data)
    dud = dd[['SECID','BID','OFFER','LAST','LASTCHANGEPRCNT','VALTODAY']]
    dud.rename(columns={'BID':'bid','OFFER':'ask','LAST':'last','LASTCHANGEPRCNT':'change','VALTODAY':'valtoday'},inplace=True)
    dud = dud.sort_values('valtoday',ascending=False).set_index('SECID').T.to_json()
    return dud

def blockchainview(request):
	return render(request, 'dex/indexBC.html')




def first_account():
	first_account = {'OPTIONS_PREMIUM': 0.0, 'TRDACCID': ' ', 'CURRCODE': 'SUR', 'CBP_PREV_LIMIT': 0.0, 'CBPLUSED': 0.0, 'LIQUIDITY_COEFF': 0.0, 'CBPLUSED_FOR_POSITIONS': 0.0, 'LAST_CLEAR_DATE':' ', 'DAYCREATED': ' ', 'KGO': 1.0, 'VARMARGIN': 0.0, 'CBPLUSED_FOR_ORDERS': 0.0, 'CBPLIMIT': '100000', 'TS_COMISSION': 0.0, 'FIRMID': ' ', 'LIMIT_TYPE': 'Cash', 'ACCRUEDINT': 0.0, 'CBPLPLANNED': 0.0, 'REAL_VARMARGIN': 0.0, 'NAME': 'MAIN'}
	return first_account

engine2 = create_engine('postgres://quikuser:JbT061409@0.0.0.0:5432/quik')
@login_required
def home(request):
    form = OrderForm()
    cuser = request.user
    accus = []
    tas = TradeAccount.objects.filter(FIRMID=cuser)
    if len(tas) == 0:
        fa = first_account()
        fa['TRDACCID'] = str(cuser)+'_MAIN'
        fa['LAST_CLEAR_DATE'] = datetime.datetime.now()
        fa['DAYCREATED'] = datetime.datetime.now()
        fa['FIRMID'] = cuser
        fa['NAME'] = 'MAIN'
        m = TradeAccount(**fa)
        m.save()
        tas = TradeAccount.objects.filter(FIRMID=cuser)
    for i in tas:
        s = i
        s.DAYCREATED =str(s.DAYCREATED)
        s.LAST_CLEAR_DATE =str(s.LAST_CLEAR_DATE)
        accus.append(model_to_dict(s))
    ao = Orders.objects.filter(FIRM=cuser)
    all_orderos = []
    for i in ao:
        s = i
        s.ORDERTIME = str(s.ORDERTIME)
        s.PERIOD = str(s.PERIOD)
        all_orderos.append(model_to_dict(s))
    print(cuser)
    positions = []
    obya = Position.objects.filter(FIRMID=request.user)
    for i in obya:
        i.SEC_EXPIRY_DATE =str(i.SEC_EXPIRY_DATE)
        positions.append(model_to_dict(i))
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
#    df = pd.read_sql('SELECT * FROM opsall',connection2)
    df = pd.read_sql('SELECT * FROM ri_options',connection2)
    df2 = pd.read_sql('SELECT * FROM ri_options_fixed',connection2)
#    bal = pd.read_sql('SELECT * FROM bal',connection2)
#    bal['id'] = bal['id'].str.split().str[0]
#    bal = bal.set_index('id').T.to_json()
    volterms = pd.read_sql('SELECT * FROM ri_volatility_terms',connection2).T.to_json()
#    snap1 = pd.read_sql('SELECT index,ttm_1,vol_1,ttm_2,vol_2,ttm_3,vol_3,ttm_4,vol_4,ttm_5,vol_5 FROM ri_snap_mirror',connection2)
#    snap2 = snap1.set_index('index').T.to_json()
#    snap1 = snap1.T.to_json()
    mona = df.set_index('id').T.to_json()
    df2['id'] = df2['id'].str.split().str[0]
    margins = df2.set_index('id').T.to_json()
    futures = pd.read_sql('SELECT * FROM baltic',connection2)
    futures['id'] = futures['id'].str.split().str[0]
    futures = futures.sort_values('valtoday',ascending=False).set_index('id').T.to_json()
    futures = data_from_api()
    return render(request, 'dex/index2.html', {'futures':futures,
                    'mona':mona,'rts_min':rts_min,'accus':accus,
                    'margins':margins,'rvi_min':rvi_min,'cuser':cuser,'positions':positions})

def orderadd(request):
    print('account add requested')
    if request.method == 'POST':
        qd = request.POST.copy()
        print('this is the coming qtd')
        print(qd)
        del qd['csrfmiddlewaretoken']
        m = TradeAccount(**qd)
        m.NAME = m.NAME[0]
        m.CBPLIMIT = m.CBPLIMIT[0]
        m.FIRMID = m.FIRMID[0]
        m.DAYCREATED = datetime.datetime.now()
        m.LAST_CLEAR_DATE = datetime.datetime.now()
        tas = TradeAccount.objects.filter(FIRMID=m.FIRMID)
        m.TRDACCID = m.FIRMID + str(len(tas) + 1)
        print('this is the saved one')
        print(model_to_dict(m))
        m.save()
        print(request.POST)
        accus = []
        tas = TradeAccount.objects.filter(FIRMID=m.FIRMID)
        for i in tas:
            s = i
            s.DAYCREATED =str(s.DAYCREATED)
            s.LAST_CLEAR_DATE =str(s.LAST_CLEAR_DATE)
            accus.append(model_to_dict(s))
            print(model_to_dict(s))
        return HttpResponse(json.dumps({'accounts': accus}))

def API_getter(futs_or_ops,split_or_not):
	url_options = 'https://iss.moex.com/iss/engines/futures/markets/options/securities.json?iss.json'
	url_futures = 'https://iss.moex.com/iss/engines/futures/markets/forts/securities.json'
	if futs_or_ops == 'options':
		url = url_options
	else:
		if futs_or_ops == 'futures':
			url = url_futures
		else:
			return print('Please input futures or options as arg in function')

	html = requests.get(url)
#	jj = json.loads(html.text)
	jj = html.json()
	md = pd.DataFrame(jj['marketdata']['data'],columns=jj['marketdata']['columns'])
	sd = pd.DataFrame(jj['securities']['data'],columns=jj['securities']['columns'])
	if split_or_not == 'split':
		return md,sd
	else:
		ch = md.set_index('SECID')
		ch_2 = sd.set_index('SECID')
		cced = pd.concat([ch,ch_2],axis=1)
		return cced

@csrf_exempt
def option_levels(request):
    if request.method == 'POST':

        print('mama liucha')
        cced = API_getter('options','n')
        cced['CALL'] = cced.SECNAME.str.contains('Call')
        cced['PUT'] = cced.SECNAME.str.contains('Put')
        cao = cced[['CALL','ASSETCODE','OICHANGE','VOLTODAY','VALTODAY','NUMTRADES','PREVOPENPOSITION']]
        cao['CALL'] = cao['CALL'].astype(int)
        sums = cao.groupby(['ASSETCODE','CALL']).sum().sort_values('VALTODAY',ascending=False)
        print(sums)
        sums = sums.reset_index().T.to_json()
#        sums = sums.T.to_json()
        return HttpResponse(json.dumps({'rr':[sums]}))


# This is to get the open position information
zulu = pd.read_pickle('borapik_indexed.p')
zulu.drop('name',axis=1,inplace=True)
z2 = zulu.reset_index()
z2['moment'] = pd.to_datetime(z2['moment'])
last_year = datetime.datetime.today() - pd.DateOffset(year=(datetime.datetime.today().year - 1))
z2 = z2.loc[z2['moment']>last_year]
z2.set_index(['name_type_iz','moment'],inplace=True)
@csrf_exempt
def zardulu(request):
	if request.method == 'POST':
		start = time.time()
		print('ZARDULU!!')
		locaso = request.POST.copy()['zardulu']
		print(locaso)
		mole = zulu.loc[locaso+'_C_0'].sort_index().drop_duplicates().T.to_json()
		mole2 = zulu.loc[locaso+'_C_1'].sort_index().drop_duplicates().T.to_json()
		mole3 = zulu.loc[locaso+'_P_0'].sort_index().drop_duplicates().T.to_json()
		mole4 = zulu.loc[locaso+'_P_1'].sort_index().drop_duplicates().T.to_json()
		end = time.time()
		print('this is the time it took')
		print(end - start)
		return HttpResponse(json.dumps({locaso+'_C_0':mole,locaso+'_C_1':mole2,locaso+'_P_0':mole3,locaso+'_P_1':mole4}))

@csrf_exempt
def zardulu_one_year(request):
        if request.method == 'POST':
                start = time.time()
                print('ZARDULU!!')
                z3 = z2.sort_index().drop_duplicates().to_json(orient='split')
                end = time.time()
                print('this is the time it took')
                print(end - start)
                return HttpResponse(json.dumps(z3))
















def shoot_confirmation(msg):
    pos = pd.DataFrame(msg['legs'])
    connection2 = engine2.connect()
    df2 = pd.read_sql('SELECT * FROM ri_options_fixed',connection2)
    df2['id'] = df2['id'].str.split().str[0]
    df2 = df2.set_index('id')
    df = pd.read_sql('SELECT * FROM ri_options',connection2)
    df['id'] = df['id'].str.split().str[0]
    pos['QTY'] = pos['QTY'].astype(int)
    pos['PRICE'] = pos['PRICE'].astype(float)
    df = df.set_index('id')
    for i in range(len(pos)):
        zisting = Position.objects.filter(SECCODE=pos.iloc[i].SECNAME,TRDACCID=pos.iloc[i].ACCOUNT)
        if (zisting):
            code = pos.iloc[i].SECNAME
            zisting = zisting[0]
            net_pos = zisting.TOTAL_NET
            qty = pos.iloc[i].QTY
            zisting.TOTAL_NET = net_pos + qty
            avgprice = zisting.AVRPOSNPRICE
            newprice = pos.iloc[i].PRICE
            if ((qty+net_pos) == 0):
                zisting.AVRPOSNPRICE = 0
            else:
                zisting.AVRPOSNPRICE = ((newprice*qty) + (net_pos*avgprice)) / (qty+net_pos)
            sec_value = df.ix[code].theor_price
            zisting.POSITIONVALUE = sec_value * (net_pos + qty)
            zisting.save()
            print('position updated')
        else:
            # pos = pd.DataFrame(msg['legs'])
            print('POSSSSSSSS')
            print(pos)
            p = Position()
            p.FIRMID = pos.iloc[i].FIRM 
            p.TRDACCID = pos.iloc[i].ACCOUNT
            code = pos.iloc[i].SECNAME
            p.SECCODE = code
            p.SEC_SHORT_NAME = pos.iloc[i].SECNAME
            p.SEC_EXPIRY_DATE  = df2.ix[code].mat_date
            p.TYPE = df2.ix[code].optiontype
            p.SEC_UNDERLYING = df2.ix[code].optionbase
            p.STRIKE = df2.ix[code].strike
            p.AVRPOSNPRICE = pos.iloc[i].PRICE
            p.POSITIONVALUE = pos.iloc[i].VALUE
            p.TOTAL_NET = pos.iloc[i].QTY
            p.ORDERGROUP = msg['ordergroup']
            p.save()
            print(model_to_dict(p))
            print("HOOOOOHAAAAAA")

def refreshpositions(request):
    if request.method == 'POST':
        print('Positions requested!')
        positions = []
        obya = Position.objects.filter(FIRMID=request.user)
        for i in obya:
            i.SEC_EXPIRY_DATE =str(i.SEC_EXPIRY_DATE)
            positions.append(model_to_dict(i))
        return HttpResponse(json.dumps({'message': positions}))
    else:
        return HttpResponse(json.dumps({'message': 'Suuing rang'}))

def ordercomm(request):
    print('requested')
    if request.method == 'POST':
#        print(request.POST)
        qd = request.POST.copy()
        print(qd)
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
        try:
            return HttpResponse(json.dumps({'message': conf}))
        finally:
            shoot_confirmation(conf)

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
