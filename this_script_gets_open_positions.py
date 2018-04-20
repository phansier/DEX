import pandas as pd
import requests
from io import StringIO
from datetime import date, timedelta
import numpy as np

today = date.today().strftime ("%Y%m%d")
yesterday = date.today() - timedelta(1)
yesterday = yesterday.strftime("%Y%m%d")

url = 'http://www.moex.com/en/derivatives/open-positions-csv.aspx?d='+yesterday+'&t=1'
html = requests.get(url).text
thing = StringIO(html)
df = pd.read_csv(thing)

df['iz_fiz'].replace(np.nan,0,inplace=True)
df['iz_fiz'] = df['iz_fiz'].astype('int').astype('str')
df['name_type_iz'] = df['isin']+'_'+df['contract_type']+'_'+df['iz_fiz']
print(len(df))
bora = pd.read_pickle('borapik_indexed.p')
bora = bora.append(df.set_index(['name_type_iz','moment'])).sort_index()
bora.to_pickle('borapik_indexed.p')
print('dunso')
