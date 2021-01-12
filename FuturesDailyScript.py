import pandas as pd
import time
import datetime

emo = {'AUDU': '81009', 'BR': '22460', 'GBMW': '181582', 'UCAD': '409339', 'UCHF': '175907', 'CHMF': '81023', 'CU': '81172', 'CY': '410570', 'GDBK': '181584', 'GDAI': '181583', 'ED': '21989', 'Eu': '22010', 'FEES': '81020', 'GOLD': '19898', 'GMKR': '17452', 'GBPU': '81010', 'GAZR': '17451', 'HYDR': '81025', 'UJPY': '175893', 'LKOH': '17453', 'MOEX': '390846', 'MXI': '436202', 'MGNT': '390848', 'MOPR': '81031', 'MTSI': '81029', 'MIX': '81408', 'NOTK': '19892', 'NLMK': '453418', 'OFZ2': '81173', 'OFZ4': '81174', 'OFZ6': '81746', 'OF15': '175864', 'OF10': '152663', 'PLD': '81011', 'PLT': '81012', 'RI': '17455', 'ROSN': '19894', 'RTSS': '22890', 'RTKM': '17454', 'SUGR': '81159', 'SNGP': '81021', 'Si': '19899', 'GSIE': '181585', 'SNGR': '17457', 'SBPR': '81026', 'SBRF': '17456', 'SILV': '19902', 'TRNF': '19901', 'UTRY': '409337', 'TATN': '81024', 'UUAH': '175922', 'VTBR': '19891', 'RVI': '398008', 'GVW3': '181586'};


def gffD(symbol,delta):
	today = datetime.datetime.today()
	tda = today - datetime.timedelta(days=delta)

	# dayf = '16'
	dayf = str(tda.day)
	# mf = '3'
	mf = str(tda.month-1)
	# yf = '2018'
	yf = str(tda.year)
	# yfull = '16.04.2018'
	yfull = tda.strftime('%d.%m.%Y')

	# symbol = 'RI'
	fin_code = emo[symbol]
	symbol_code = 'SPFB.'+symbol
	# dt = '18'
	dt = today.strftime('%d')
	# mt = '04'
	mt = today.strftime('%m')
	# yt = '2018'
	yt = today.strftime('%Y')
	# today = "17.04.2018"
	today = today.strftime('%d.%m.%Y')
	fin_url = 'http://export.finam.ru/table.txt?market=14&em='+fin_code+'&code='+symbol_code+'&apply=0&df='+dayf+'&mf='+mf+'&yf='+yf+'&from='+yfull+'&dt='+dt+'&mt='+mt+'&yt='+yt+'&to='+today+'&p=8&f=table&e=.txt&cn='+symbol+'&dtf=1&tmf=1&MSOR=1&mstime=on&mstimever=1&sep=1&sep2=1&datf=1&at=1'
	df = pd.read_csv(fin_url,parse_dates=['<DATE>'],index_col=['<DATE>','<TICKER>'])
	return df

df = pd.DataFrame()
for i in emo.keys():
	time.sleep(1)
	# print(i)
	try:
		df1 = gffD(i,20)
	except:
		print('Above doesnt work: '+i)
	# print(df1['<DATE>'][0])
	# print(df1['<DATE>'][len(df1)-1])
	df = df.append(df1.tail(3))
	# print(len(df))



df.sort_index(inplace=True)
today = datetime.datetime.today()
yesterday = today - datetime.timedelta(days=1)
yesterdayf = yesterday.strftime('%Y-%m-%d')

try:
	DF = pd.read_pickle('FuturesDaily.p')
	DF = DF.append(df.loc[yesterdayf])
except:
	DF = df.loc[yesterdayf]
DF.to_pickle('FuturesDaily.p')
