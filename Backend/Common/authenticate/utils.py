from urllib.request import HTTPCookieProcessor,build_opener
from http.cookiejar import CookieJar
from random import random
from bs4 import BeautifulSoup as BS

def sendOTPto(to_number):
        url ='http://site24.way2sms.com/Login1.action?'
        data = bytes('username=9818611161&password=123ashish&Submit=Sign+in','utf-8')
        # 7988367320
        cj= CookieJar()
        opener = build_opener(HTTPCookieProcessor(cj))
        opener.addheaders=[('User-Agent','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120')]
        try:
            opener.open(url, data)
        except IOError:
            return "ERR: SENDMSG"
        otp = str(random())[2:8]
        jession_id =str(cj).split('~')[1].split(' ')[0]
        send_sms_url = 'http://site24.way2sms.com/smstoss.action?'
        send_sms_data = bytes('ssaction=ss&Token='+jession_id+'&mobile='+to_number+'&message='+'Your One Time Pass is '+otp+'&msgLen=136','utf-8')
        print('SENT OTP IS', otp)
        opener.addheaders=[('Referer', 'http://site25.way2sms.com/sendSMS?Token='+jession_id)]
        try:
            sms_sent_page = opener.open(send_sms_url,send_sms_data)
            soup = BS(sms_sent_page.read())
            errNode = soup.find('span',{'class':'err'})
            if errNode:
                print(errNode)
                return "ERR: SENDMSG"
            else:
                return "SUCCESS: SENDMSG"
        except IOError:
            return "ERR: SENDMSG"
        return "SUCCESS: SENDMSG"