import pandas as pd 
from sqlalchemy import create_engine
import datetime

engine = create_engine('postgres://quikuser:JbT061409@0.0.0.0:5432/quik')
connection = engine.connect()


df = pd.read_sql('SELECT * FROM ri_options',connection)
df2 = pd.read_sql('SELECT * FROM ri_options_fixed',connection)

df1 = df[['id','bid','ask','last','num_trades','open_pos','volatility','theor_price']]

# now = datetime.datetime.now()
# delta = datetime.timedelta(hours=3)
moscow_time = datetime.datetime.now() + datetime.timedelta(hours=3)
mt = 'A_'+moscow_time.strftime("%Y_%m_%d_%H_%M_%S")


df1['datetime'] = moscow_time


price = pd.read_sql('SELECT * FROM bal',connection)
price.set_index(price['id'].str.split().str[0],inplace=True)
ri = price.loc['RIZ7']['last']
si = price.loc['SiZ7']['last']
interval = 2500

df.drop(df['time_to_maturity'] < 0,inplace=True)
dfr = df.loc[df['id'].str.startswith('RI')]

atm = dfr.loc[dfr['time_to_maturity'] > -1].loc[(dfr['strike'] > ri - interval)].loc[dfr['strike'] < ri + interval][['strike','volatility','time_to_maturity','bid','ask','option_type']]

# expirations = ['price','lband','uband','nearest','ttm_1','atm_spread_1','vol_u_1','vol_d_1','vol_1','ttm_2','atm_spread_2','vol_u_2','vol_d_2','vol_2','ttm_3','atm_spread_3','vol_u_3','vol_d_3','vol_3','ttm_4','atm_spread_4','vol_u_4','vol_d_4','vol_5','ttm_5','atm_spread_5','vol_u_5','vol_d_5','vol_5','ttm_6','atm_spread_6','vol_u_6','vol_d_6','vol_6','ttm_7','atm_spread_7','vol_u_7','vol_d_7','vol_7','ttm_8','atm_spread_8','vol_u_8','vol_d_8','vol_8']

expirations = ['price','lband','uband','nearest',]
for i in range(8):
	i = str(i+1)
	expirations.append('ttm_'+i)
	expirations.append('atm_spread_c_'+i)
	expirations.append('atm_spread_p_'+i)
	expirations.append('vol_u_'+i)
	expirations.append('vol_d_'+i)
	expirations.append('vol_'+i)



lband = atm['strike'].sort_values().unique()[0]
uband = atm['strike'].sort_values().unique()[1]


if (ri - lband < uband - ri):
	nearest = lband
else:
	nearest = uband


atm['spread'] = atm['bid'] - atm['ask']
atm['spread'] = abs(atm['spread'])

atm2 = atm.loc[atm['strike'] == nearest].groupby(['time_to_maturity','option_type']).min()


ttms = atm['time_to_maturity'].sort_values().unique()

atm1 = atm.groupby(['time_to_maturity','strike']).mean()

curs = {'price':ri,'lband':lband,'uband':uband,'nearest':nearest,}

for i in range(len(ttms)):
	j = str(i+1)
	curs['ttm_'+j] = ttms[i]
	i = ttms[i]
	curs['atm_spread_c_'+j] = atm2.loc[i].loc['Call']['spread']
	curs['atm_spread_p_'+j] = atm2.loc[i].loc['Put']['spread']
	curs['vol_u_'+j] = atm1.loc[i].loc[uband].values[0]
	curs['vol_d_'+j] = atm1.loc[i].loc[lband].values[0]
	curs['vol_'+j] = atm1.loc[i].loc[nearest].values[0]
	

crs = {moscow_time:curs}
new_df = pd.DataFrame.from_dict(crs,orient='index')




store = pd.HDFStore('Minutes.h5')
store.append('ALL',df1,format='table')
store.append('RI',new_df,format='table')
store.close()


with open("crons/minute_snap_log.txt", "a") as myfile:
    myfile.write(mt+'\n')
