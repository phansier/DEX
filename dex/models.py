from django.db import models

# Create your models here.

from django.contrib.auth.models import User
 
class Comments(models.Model):
    user = models.ForeignKey(User)
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
    LIMIT_TYPE = models.CharField(max_length=25)
    LIQUIDITY_COEFF = models.FloatField()
    CBP_PREV_LIMIT = models.FloatField()
    PREV_DATE = models.DateTimeField()
    CBPLIMIT = models.FloatField()
    CBPLUSED = models.FloatField()
    CBPLUSED_FOR_ORDERS = models.FloatField()
    CBPLUSED_FOR_POSITIONS = models.FloatField()
    CBPLPLANNED = models.FloatField()
    VARMARGIN = models.FloatField()
    ACCRUEDINT = models.FloatField()
    OPTIONS_PREMIUM = models.FloatField()
    TS_COMISSION = models.FloatField()
    KGO = models.FloatField()
    CURRCODE = models.CharField(max_length=25)
    REAL_VARMARGIN = models.FloatField()
