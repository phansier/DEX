"""
Do this at the beginning of every day
this forms the basis of the instruments shown at the deck

"""

import pandas as pd
import requests
import StringIO
from datetime import date, timedelta

# today = date.today().strftime ("%Y%m%d")
yesterday = date.today() - timedelta(1)
yesterday = yesterday.strftime("%Y%m%d")

url = 'http://www.moex.com/en/derivatives/open-positions-csv.aspx?d='+yesterday+'&t=1'
html = requests.get(url).text
thing = StringIO(html)
df = pd.read_csv(thing)

df['iz_fiz'].replace(np.nan,0,inplace=True)
df['iz_fiz'] = df['iz_fiz'].astype('int').astype('str')
df['name_type_iz'] = df['isin']+'_'+df['contract_type']+'_'+df['iz_fiz']

df.to_csv('latest_open_positions.csv')


# names_today = df['isin'].unique()

duda = pd.read_pickle('raw_open_pos.p')
duda = duda.append(df)
duda.to_pickle('raw_open_pos.p')
