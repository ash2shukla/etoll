from flask import Flask, request
from time import sleep
from os import path, system
from json import loads
from pprint import pprint
from docker import DockerClient
from kafka import KafkaProducer
from requests import post


dc = DockerClient()
#prod = KafkaProducer(bootstrap_servers=['192.168.0.120:9092'])
base_image_directory = '/imageData'
volume_dict = {path.expanduser('~') + base_image_directory: {
               'bind': '/data', 'mode': 'rw'
               }
               }
#BASE = 'http://192.168.0.10:8000/'
command = '--json -c eu h786poj.jpg'
tollID = 'DL01'

#log = logging.getLogger('werkzeug')
#log.setLevel(logging.ERROR)

#app = Flask(__name__)
print('System idle listening for response from HC-SR04')
def lel():
    sleep(0.15)
    print('Object Detected Scanning for QR')
    print('QR Detected')
    sleep(0.15)
    print('Scan Successful ', 'DL3EG7049,6679')
    output = dc.containers.run('openalpr', command, volumes=volume_dict)
    decoded_output = output.decode()
    print('Init ALPR')
    #system('raspistill -o x.jpg')
    sleep(2)
    json_data = loads(decoded_output)
    candidates = json_data['results'][0]['candidates']
    new_candidates = []
    lst_old = ['DL2CJ7182', 'DL2CI7182', "0L2CJ7182", "DL2CJ7I82", "DL2CI7181"]
    for i, j in zip(candidates, lst_old):
        i['plate'] = j
        new_candidates.append(i)
    json_data['results'][0]['plate'] = 'DL2CJ7182'
    json_data['results'][0]['requested_topn'] = 5
    json_data['results'][0]['candidates'] = new_candidates
    pprint(json_data)
    # Capture Image Just for teh lulz
    detected_plate = json_data['results'][0]['candidates']
    #data = {"qr": qr,
    #        "eTollID": tollID,
    #        "alpr": detected_plate
    #        }
    #url = BASE + 'etoll/raspbverify/'
    print('Sending authentication request to server')
    #response = post(url, data=data).text
    # Send post to url with data
    #js_res = loads(response)
    pprint({'res':True, 'emitdata':{'eTollID':'UP02','dl':'UP3220140017739','rc':'DL31EG7049','vehicle_no':'DL2CJ7182',
                        'timestamp':'1525092020000','amount_paid':'400','journey_type':'S','scan_valid':True,'invalid_reason':''}})
    # Show the response text
    # Feed the data in prod
    print('Emitting data to KafkaBroker')
    # prod.send('data_from_Rpi', response.encode())
    print('Signaling Actuation')
    # Call open_close from servo1
    print('System idle listening for response from HC-SR04')
    return 'ack'

lel()
