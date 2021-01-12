from django.db import models
# Create your models here.

from django.contrib.auth.models import User
 
class Comments(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,)
    text = models.CharField(max_length=255)

class Orders(models.Model):
#    ORDERNUM = models.IntegerField(db_index=True)
    EXCHANGE_CODE = models.CharField(max_length=25,blank=True)
    ORDERGROUP = models.CharField(max_length=255)
    ORDERTIME =models.CharField(max_length=255)
    PERIOD = models.CharField(max_length=255)
    SECNAME = models.CharField(max_length=255)
    BUYSELL = models.CharField(max_length=5)
    FIRM = models.CharField(max_length=25)
    ACCOUNT = models.CharField(max_length=25)
    PRICE = models.FloatField()
    QTY = models.IntegerField()
    VISIBLE_QTY  = models.IntegerField(blank=True)
    BALANCE  = models.IntegerField()
    VALUE  = models.FloatField()
    BROKERREF  = models.CharField(max_length=225,blank=True)
    STATUS  = models.CharField(max_length=20)
    MARGIN = models.FloatField()

class TradeAccount(models.Model):
    TRDACCID = models.CharField(max_length=25,unique=True)
    NAME = models.CharField(max_length=250)
    DAYCREATED = models.DateTimeField()
    FIRMID = models.CharField(max_length=250)
    LIMIT_TYPE = models.CharField(max_length=25,default='Cash')
    LIQUIDITY_COEFF = models.FloatField(default=0.0)
    CBP_PREV_LIMIT = models.FloatField(default=0.0)
    LAST_CLEAR_DATE = models.DateTimeField()
    CBPLIMIT = models.FloatField()
    CBPLUSED = models.FloatField(default=0.0)
    CBPLUSED_FOR_ORDERS = models.FloatField(default=0.0)
    CBPLUSED_FOR_POSITIONS = models.FloatField(default=0.0)
    CBPLPLANNED = models.FloatField(default=0.0)
    VARMARGIN = models.FloatField(default=0.0)
    ACCRUEDINT = models.FloatField(default=0.0)
    OPTIONS_PREMIUM = models.FloatField(default=0.0)
    TS_COMISSION = models.FloatField(default=0.0)
    KGO = models.FloatField(default=1.0)
    CURRCODE = models.CharField(max_length=25,default='SUR')
    REAL_VARMARGIN = models.FloatField(default=0.0)

class Position(models.Model):
    FIRMID = models.CharField(max_length=25)
    TRDACCID = models.CharField(max_length=25)
    SECCODE = models.CharField(max_length=255)
    SEC_UNDERLYING = models.CharField(max_length=25,default='NR')
    SEC_SHORT_NAME = models.CharField(max_length=255)
    SEC_EXPIRY_DATE = models.DateTimeField()
    STRIKE = models.FloatField(default=0.0)
    TYPE = models.CharField(max_length=25)
    START_BUY = models.IntegerField(default=0)
    START_SELL = models.IntegerField(default=0)  
    START_NET = models.IntegerField(default=0)
    TODAY_BUY = models.IntegerField(default=0)
    TODAY_SELL = models.IntegerField(default=0)
    TOTAL_NET = models.IntegerField(default=0)
    OPEN_BUYS = models.IntegerField(default=0)
    OPEN_SELLS = models.IntegerField(default=0)
    CBPLUSED = models.FloatField(default=0.0)
    CBPLPLANNED = models.FloatField(default=0.0)
    VARMARGIN = models.FloatField(default=0.0)  
    AVRPOSNPRICE = models.FloatField() 
    POSITIONVALUE = models.FloatField()
    REAL_VARMARGIN = models.FloatField(default=0.0)
    TOTAL_VARMARGIN = models.FloatField(default=0.0)
    ORDERGROUP = models.CharField(max_length=255,default='leg')

    class Meta:
        unique_together = ('TRDACCID','SECCODE')
