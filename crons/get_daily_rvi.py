import pandas as pd
import requests
import json
import datetime
from io import StringIO

today = datetime.datetime.now().strftime("%Y-%m-%d")

url = 'http://iss.moex.com/iss/engines/stock/markets/index/securities/RVI/candles.json?from=2017-08-08&till='+today+'&interval=24&start=0&iss.meta=off'
response = requests.get(url)
pp = json.loads(response.content.decode('UTF-8'))
d1 = pd.DataFrame(pp['candles']['data'],columns=pp['candles']['columns'])
d1['begin'] = d1['begin'].str.split(' ').str[0]
latest = d1.rename(columns={'begin':'date'}).sort_values('date').set_index('date')[['open','high','low','close']][-1:]
latest['secid'] = 'RVI'


latest.to_csv('yyyyy.csv')
dd = pd.read_csv('/home/jbt/myproject/crons/RVI_min.csv',index_col='date')
dd = dd.append(latest)
dd.to_csv('/home/jbt/myproject/crons/RVI_min.csv')

symbol_code = 'SPFB.RTS'
fin_code = '17455'
fromd = '05.01.2017'
# today = '03.10.2017'
today = datetime.datetime.now()
dt = str(today.day)
mt = str(today.month)
yt = str(today.year)
today = today.strftime("%d.%m.%Y")
fin_url = 'http://export.finam.ru/table.txt?market=14&em='+fin_code+'&code='+symbol_code+'&apply=0&df=1&mf=9&yf=2017&from='+fromd+'&dt='+dt+'&mt='+mt+'&yt='+yt+'&to='+today+'&p=8&f=table&e=.txt&cn='+symbol_code+'&dtf=1&tmf=1&MSOR=1&mstime=on&mstimever=1&sep=1&sep2=1&datf=1&at=1'

ss = StringIO(requests.get(fin_url).text)

d1 = pd.read_csv(ss,index_col='<DATE>',parse_dates=True)
d1 = d1[['<OPEN>','<HIGH>','<LOW>','<CLOSE>','<VOL>']]
d1['secid'] = 'RTS'
dd = dd[-1:]
dd = pd.read_csv('/home/jbt/myproject/crons/RTS_min.csv',index_col='<DATE>',parse_dates=True)
dd = dd.append(d1)
dd.drop_duplicates(inplace=True)

dd.to_csv('/home/jbt/myproject/crons/RTS_min.csv')
d1.to_csv('xxxxxxxx.csv')
