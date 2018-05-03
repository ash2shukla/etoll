from json import loads

from testauth import *
from testtoll import *
from testvehicle import *


# __ test auth __ #
# 0. Try sending OTP to user1.
# 1. Signup a User.
# 2. login

# __ test vehicle __ #
# 3. enroll 2 owned vehicles.
# 4. get their id
# 5. signup another user. do step 2-4 for him as well.
# 6. share the user2's 2nd vehicle with user1 using pin.
# 7. share the user1's 2nd vehicle with user2 using qr.
# 8. list all owned vehicles of user1.
# 9. list all shared vehicles of user2.

# __ test toll __ #
# 10. get toll tax.
# 11. pay for eTollID1 from user1.
# 12. pay for eTollID2 from user2.
# 13. verify user1's payment @ eTollID1
# 14. verify user2's payment @ eTollID2
# 15. List Transactions

user1 = loads(open('testuser1.json', 'r').read())

# sendOTP(phone=user1['mob'])

signup_res = verifyDL(uid=user1['uid'], dl=user1['dl'])
signup_token1 = loads(signup_res)['token']

print(signup(signup_token1))

login_token1 = loads(login(user1['dl']))['token']

print(addvehicle(login_token1, rc=user1['vehicle1']))
print(addvehicle(login_token1, rc=user1['vehicle2']))

print(getid(login_token1, rc=user1['vehicle1']))
print(getid(login_token1, rc=user1['vehicle2']))

user2 = loads(open('testuser2.json', 'r').read())

# sendOTP(phone=user2['mob'])

signup_res = verifyDL(uid=user2['uid'], dl=user2['dl'])
signup_token2 = loads(signup_res)['token']

print(signup(signup_token2))

login_token2 = loads(login(user2['dl']))['token']

print(addvehicle(login_token2, rc=user2['vehicle1']))
print(addvehicle(login_token2, rc=user2['vehicle2']))

print(getid(login_token2, rc=user2['vehicle1']))
print(getid(login_token2, rc=user2['vehicle2']))

print('Get pin for user2s second vehicle')
pin2 = loads(sharevehiclepin(login_token2, user2['vehicle2']))['pin']

print('Add user2s second vehicle to user1')
print(addsharevehicle(login_token1, user2['vehicle2'], pin2))

print('Get qr for user1s second vehicle')
qr1 = loads(sharevehicleqr(login_token1, user1['vehicle2']))['qr']
pin1 = loads(sharevehiclepin(login_token1, user1['vehicle2']))['pin']
print(addsharevehicle(login_token2, user1['vehicle2'], pin1))
# essentially sharevhicleqr returns rc,pin which would be parsed and sent in
# addsharevehicle by frontend

print('All vehicles owned by user1')
print(getallownedvehicles(login_token1))
print('All vehicles shared with user2')
print(getallsharedvehicles(login_token2))

print('getting tolltax')
print(gettolltax(login_token1))

print('paying for eTollID1 by vehicle1 user1')
print(paymentsuccess(login_token1, user1['vehicle1'], "eTollID1"))
print('paying for eTollID2 by vehicle1 user2')
print(paymentsuccess(login_token2, user2['vehicle2'], "eTollID2"))


print(qrverify1(','.join([user1['dl'], user1['vehicle1'], 'TEST 123456'])))

print(qrverify2(','.join([user2['dl'], user2['vehicle2'], 'TEST 123456'])))

print(gettransactions(login_token1))
