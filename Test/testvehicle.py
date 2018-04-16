from requests import get, post
from testauth import BASE, login1, login2
from json import loads


def addvehicle(token):
    url = BASE + "vehicle/add/"
    return post(url, data={'RC': 'TEST_RC'},
                headers={'Authorization': 'JWT ' + token}).text


def sharevehicleqr(token):
    url = BASE + "vehicle/share/qr/"
    return post(url, data={'RC': 'TEST_RC'},
                headers={'Authorization': 'JWT ' + token}).text


def sharevehiclepin(token):
    url = BASE + "vehicle/share/pin/"
    return post(url, data={'RC': 'TEST_RC'},
                headers={'Authorization': 'JWT ' + token}).text


def addsharevehicle(token):
    url = BASE + "vehicle/addshare/"
    return post(url, data={'RC': 'TEST_RC', 'pin': '4573'},
                headers={'Authorization': 'JWT ' + token}).text


def getallownedvehicles(token):
    url = BASE + "vehicle/listowned/"
    return get(url, headers={'Authorization': 'JWT ' + token}).text


def getallsharedvehicles(token):
    url = BASE + "vehicle/listshared/"
    return get(url, headers={'Authorization': 'JWT ' + token}).text


if __name__ == "__main__":
    token = loads(login1())['token']
    print(addvehicle(token))
    print(sharevehicleqr(token))
    print(sharevehiclepin(token))
    print(addsharevehicle(token))
    print(getallownedvehicles(token))
    print(getallsharedvehicles(token))
