import pandas as pd
from sqlalchemy import create_engine
engine2 = create_engine('postgres://quikuser:JbT061409@0.0.0.0:5432/quik')
connection2 = engine2.connect()
df = pd.read_sql('SELECT * FROM ri_options',connection2)
