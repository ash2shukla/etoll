from requests import get, post
from testauth import BASE, login1, login2
from json import loads


def gettolltax(token):
    url = BASE + "etoll/gettolltax/"
    return get(url,
               params={'RC': 'TEST_RC', 'eTollID': 'eTollID1', 'ttype': 'S'},
               headers={'Authorization': 'JWT ' + token}).text


def paymentsuccess(token):
    data = {"eTollTxnID": "DemoTransaction",
            "gatewayTxnID": "DemoGatewayTransaction",
            "dl": "UP131234567890",
            "rc": "TEST_RC",
            "eTollID": "eToll1",
            "ttype": "S"}
    url = BASE + 'etoll/paymentsuccess/'
    return post(url, data=data,
                headers={'Authorization': 'JWT ' + token}).text


def qrverify():
    """
    method invoked by raspb
    """
    pass

if __name__ == "__main__":
    token = loads(login1())['token']
    print(gettolltax(token))
    print(paymentsuccess(token))
