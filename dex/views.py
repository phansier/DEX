from django.shortcuts import render

# Create your views here.

from .models import Comments, User
 
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseServerError
from django.views.decorators.csrf import csrf_exempt
from django.contrib.sessions.models import Session
from django.contrib.auth.decorators import login_required
 
import redis
 
import pandas as pd
from sqlalchemy import create_engine
#engine2 = create_engine('postgres://quikuser:JbT061409@0.0.0.0:5432/quik')
#connection2 = engine2.connect()
#df = pd.read_sql('SELECT * FROM ri_options',connection2)
#mona = df.set_index('id').head().to_json()

@login_required
def home(request):
    engine2 = create_engine('postgres://quikuser:JbT061409@0.0.0.0:5432/quik')
    connection2 = engine2.connect()
    df = pd.read_sql('SELECT * FROM ri_options',connection2)
    df2 = pd.read_sql('SELECT * FROM ri_options_fixed',connection2)
    mona = df.set_index('id').T.to_json()
    df2['id'] = df2['id'].str.split().str[0]
    margins = df2.set_index('id').T.to_json()
    return render(request, 'dex/index2.html', locals())
 
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
