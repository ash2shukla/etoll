from requests import get, post
from testauth import BASE, login
from json import loads
from random import random


def gettolltax(token, rc="TEST_RC", eTollID='eTollID1'):
    url = BASE + "etoll/gettolltax/"
    return get(url,
               params={'RC': rc, 'eTollID': eTollID, 'ttype': 'S'},
               headers={'Authorization': 'JWT ' + token}).text


def paymentsuccess(token, rc="TEST_RC", eTollID="eTollID1"):
    data = {"gatewayTxnID": "GTXN" + str(random())[2:],
            "rc": rc,
            "eTollID": eTollID,
            "amount_paid": "100",
            "ttype": "S"}
    url = BASE + 'etoll/paymentsuccess/'
    return post(url, data=data,
                headers={'Authorization': 'JWT ' + token}).text


def qrverify1(data="DL123456789012,DL02J0123,TEST 123456"):
    """
    method invoked by raspb @ eTollID1
    """
    hardCodedeTollID = 'eTollID1'
    data = {"qr": data,
            "eTollID": hardCodedeTollID,
            "alpr": "TEST 123456"
            }
    url = BASE + 'etoll/raspbverify/'
    return post(url, data=data).text


def qrverify2(data="DL123456789012,DL02J0123,TEST 123456"):
    """
    method invoked by raspb @ eTollID2
    """
    hardCodedeTollID = 'eTollID2'
    data = {"qr": data,
            "eTollID": hardCodedeTollID,
            "alpr": "TEST 123456"
            }
    url = BASE + 'etoll/raspbverify/'
    return post(url, data=data).text


def gettransactions(token):
    url = BASE + 'etoll/gettxns/'
    return get(url, headers={'Authorization': 'JWT ' + token}).text


if __name__ == "__main__":
    user1 = loads(open('testuser1.json', 'r').read())
    login_token1 = loads(login(user1['dl']))['token']
    print(gettransactions(login_token1))
    # tok1 = loads(login1())['token']
    # rc = "DL02J0123"
    # print(gettolltax(tok1, rc))
    # print(paymentsuccess(tok1, rc))
    # print(qrverify())
