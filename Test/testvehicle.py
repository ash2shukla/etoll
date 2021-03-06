from requests import get, post
from testauth import BASE, login1, login2
from json import loads


def addvehicle(token, rc='TEST_RC'):
    url = BASE + "vehicle/add/"
    return post(url, data={'RC': rc},
                headers={'Authorization': 'JWT ' + token}).text


def sharevehicleqr(token, rc="TEST_RC"):
    url = BASE + "vehicle/share/qr/"
    return post(url, data={'RC': rc},
                headers={'Authorization': 'JWT ' + token}).text


def sharevehiclepin(token, rc="TEST_RC"):
    url = BASE + "vehicle/share/pin/"
    return post(url, data={'RC': rc},
                headers={'Authorization': 'JWT ' + token}).text


def addsharevehicle(token, rc="TEST_RC", pin="4573"):
    url = BASE + "vehicle/addshare/"
    return post(url, data={'RC': rc, 'pin': pin},
                headers={'Authorization': 'JWT ' + token}).text


def getallownedvehicles(token):
    url = BASE + "vehicle/listowned/"
    return get(url, headers={'Authorization': 'JWT ' + token}).text


def getallsharedvehicles(token):
    url = BASE + "vehicle/listshared/"
    return get(url, headers={'Authorization': 'JWT ' + token}).text


def getprofile(token):
    url = BASE + "auth/profile/"
    return get(url, headers={'Authorization': 'JWT ' + token}).text


if __name__ == "__main__":
    token = loads(login1())['token']
    # print(addvehicle(token))
    # print(sharevehicleqr(token))
    # print(sharevehiclepin(token))
    # print(addsharevehicle(token))
    # print(getallownedvehicles(token))
    # print(getallsharedvehicles(token))
    print(getprofile(token))
