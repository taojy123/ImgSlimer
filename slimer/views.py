# -*- coding: utf-8 -*-

import StringIO

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
from models import *

from PIL import Image


def index(request):
    return render_to_response('index.html', locals())


def slim(request):
    size = request.POST.get('size')
    img = request.FILES.get('img')

    if not img:
        return HttpResponse(u'未选择图片，请后退重试')

    name = img.name


    ext = name.split('.')[-1].lower()

    if ext == 'jpg':
        ext = 'jpeg'

    im = Image.open(img)
    w, h = im.size

    try:
        size = float(size) * 1000 * 1000
    except:
        size = 1000 * 1000

    print 'target:', size

    s = StringIO.StringIO()

    for i in range(10, 0, -1):
        wt = int(w * i / 10)
        ht = int(h * i / 10)
        imt = im.resize((wt, ht), 1)
        s = StringIO.StringIO()

        try:
            imt.save(s, ext)
        except Exception as e:
            return HttpResponse(str(e))

        sizet = s.len

        print sizet

        if sizet < size:
            break

    s.seek(0)
    data = s.read()
    response = HttpResponse(data)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="%s"' % name.encode('gbk')

    return response
