from json import load, dump
from random import choice, shuffle
from datetime import datetime

tolls = load(open('tolls.json'))
users = load(open('users.json'))

freq = [894, 981, 363, 440, 842, 227, 188, 215, 363, 861, 326, 803, 803, 470,
        267, 758, 328, 857, 458, 560]
fare_list = [53, 120, 162, 107, 134, 128, 162, 53, 101,
             200, 170, 168, 166, 89, 103, 100, 130, 184, 182, 200]
toll_weightage = [0.17, 0.08, 0.18, 0.02, 0.10, 0.17, 0.15, 0.08, 0.02, 0.03]
tollwise_transactions = [1871, 880, 1981, 220, 1100, 1871, 1650, 880, 220, 330]

invalid_reason_list = ['Transaction DoesNotExist',
                       'Invalid Type',
                       'Server Down']

dump_list = []

for i, user in enumerate(users):
    data_format = {'eTollID': '',
                   'dl': '',
                   'rc': '',
                   'vehicle_no': '',
                   'timestamp': '',
                   'amount_paid': '',
                   'journey_type': '',
                   'scan_valid': '',
                   'invalid_reason': ''}
    data_format['dl'] = user['dl']
    data_format['rc'] = user['vehicle_1']
    data_format['vehicle_no'] = user['vehicle_1'][:5]
    dump_list += [data_format] * freq[2 * i]
    data_format2 = {'eTollID': '',
                    'dl': '',
                    'rc': '',
                    'vehicle_no': '',
                    'timestamp': '',
                    'amount_paid': '',
                    'journey_type': '',
                    'scan_valid': '',
                    'invalid_reason': ''}
    data_format2['dl'] = user['dl']
    data_format2['rc'] = user['vehicle_2']
    data_format2['vehicle_no'] = user['vehicle_2'][:5]
    dump_list += [data_format2] * freq[2 * i + 1]

shuffle(dump_list)

dump_list_new = []

for i in range(len(dump_list)):
    temp_list = {}
    temp_list['dl'] = dump_list[i]['dl']
    temp_list['rc'] = dump_list[i]['rc']
    temp_list['vehicle_no'] = dump_list[i]['vehicle_no'][:5]
    temp_list['amount_paid'] = fare_list[i % 20]
    time_current = datetime.now().timestamp() * 1000
    temp_list['timestamp'] = int(time_current) - choice(range(29)) * 86400000
    if i < (len(dump_list) - 5000):
        # only last 5000 transactions may
        temp_list['journey_type'] = 'S'
    else:
        temp_list['journey_type'] = choice(['S', 'R'])
    if i < (len(dump_list) - 100):
        temp_list['scan_valid'] = True
    else:
        temp_list['scan_valid'] = False
        temp_list['invalid_reason'] = choice(invalid_reason_list)
    dump_list_new.append(temp_list)

last = 0
for i, toll in enumerate(tolls):
    for j in range(last, last + int(len(dump_list) * toll_weightage[i])):
        dump_list_new[j]['eTollID'] = toll['tid']
    last += int(len(dump_list) * toll_weightage[i])

dump(dump_list_new, open('raw_data.json', 'w'))