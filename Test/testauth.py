from requests import get, post
from json import loads


USER1 = 'UP131234567890'
USER2 = 'DL123456789012'
PASS = '!23ashish'
BASE = 'http://localhost:8000/'


# 1.
def sendOTP():
    """
    User Opens app and enters his own phone number for aadhaar verification
    """
    url = BASE + 'auth/otp/'
    return get(url, params={'phone': '9818611161'}).text


# 2.
def verifyDL():
    """
    After entering the aadhaar number he has received an OTP on his phone
    He enters his UID now with OTP and DL
    and verifies his DL through aadhaar
    On sending this request his dl and uid are cached in redis corresponding to
    a token that he recieves as response of this request
    """
    url = BASE + 'auth/verify/'
    return post(url, data={'uid': '903298497974',
                           'otp': '123456',
                           'dl': 'UP131234567890'}).text


# 3.
def signup(token):
    """
    He sends a request with password with this token
    server gets his dl and mobile through this token and signs him up.

    If no token exists then it means either he has timed out or else he is
    messing with application.
    """
    url = BASE + 'auth/signup/'
    return post(url, data={'token': token, 'pass': '!23ashish'}).text


# 4.
def login1():
    url = BASE + 'auth/login/'
    return post(url, data={'username': USER1, 'password': PASS}).text


# 5.
def login2():
    url = BASE + 'auth/login/'
    return post(url, data={'username': USER2, 'password': PASS}).text


if __name__ == "__main__":
    # print(sendOTP())
    # token = loads(verifyDL())['token']
    # print(signup(token))
    token = loads(login())['token']
    print(token)
    print(get_user(token))

