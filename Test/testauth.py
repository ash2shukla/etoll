from requests import get, post
from json import loads


USER1 = 'DL123456789012'
USER2 = 'UP123456789012'
PASS = 'test_pass'
BASE = 'http://localhost:8000/'


# 1.
def sendOTP(phone='9818611161'):
    """
    User Opens app and enters his own phone number for aadhaar verification
    """
    url = BASE + 'auth/otp/'
    return get(url, params={'phone': phone}).text


# 2.
def verifyDL(uid='987654321012', dl='DL123456789012'):
    """
    After entering the aadhaar number he has received an OTP on his phone
    He enters his UID now with OTP and DL
    and verifies his DL through aadhaar
    On sending this request his dl and uid are cached in redis corresponding to
    a token that he recieves as response of this request
    """
    url = BASE + 'auth/verify/'
    return post(url, data={'uid': uid,
                           'otp': '1234',
                           'dl': dl}).text


# 3.
def signup(token):
    """
    He sends a request with password with this token
    server gets his dl and mobile through this token and signs him up.

    If no token exists then it means either he has timed out or else he is
    messing with application.
    """
    url = BASE + 'auth/signup/'
    return post(url, data={'token': token, 'pass': PASS}).text


# 4.
def login1():
    url = BASE + 'auth/login/'
    return post(url, data={'username': USER1, 'password': PASS}).text


# 5.
def login2():
    url = BASE + 'auth/login/'
    return post(url, data={'username': USER2, 'password': PASS}).text


# 6.
def login(username):
    url = BASE + 'auth/login/'
    return post(url, data={'username': username, 'password': PASS}).text


# 7.
def refresh(token):
    url = BASE + 'auth/refreshtoken/'
    return post(url, data={'token': token}).text


# 8.
def getid(token, rc="TEST_RC"):
    url = BASE + 'auth/getid/'
    return post(url,
                data={'rc': rc},
                headers={'Authorization': 'JWT ' + token}).text


if __name__ == "__main__":
    # print(sendOTP())
    # signup_token = loads(verifyDL())['token']
    # print(signup(signup_token))
    token = loads(login2())['token']
    # print(token)
    print(getid(token))
