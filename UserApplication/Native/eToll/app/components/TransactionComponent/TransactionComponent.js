import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { Component } from 'react';
import { AppRegistry, Image, ActivityIndicator, AsyncStorage, FlatList, StyleSheet, Picker, Text, View, Button } from 'react-native';
import { NavigationComponent } from 'react-native-material-bottom-navigation';
import ActionButton from 'react-native-action-button';
import config from '../../../config';
import Modal from "react-native-modal";
import styles from './transaction.styles';
import { TextButton, RaisedTextButton } from 'react-native-material-buttons';


let Strong = ({ children, ...props }) =>
<Text style={styles.bold} {...props}>{children}</Text>

export default class TransactionComponent extends Component {
  static navigationOptions = {
    tabBarLabel: 'Transactions',
    tabBarIcon: () => <Icon size={24} name="receipt" color="black" />
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', (playload)=>{
       AsyncStorage.getItem('@TokenStore:token')
        .then((val)=>{
        if(val !=null) {
        // Get all vehicles
          this.setState({token:val},()=>{
            this.getTxns();
            this.getTolls();
            this.getAllOwnedVehicles();
            this.getAllSharedVehicles();
          })
         } else {
          this.props.navigation.navigate('Home');
        }
    })
    .catch((error)=>{
      console.log('Error Retrieving token', error);
    });
    });
  }

  default_state= {
    visibleModal: false,
    backdropOpacity:0.4,
    ttypes: [{type: 'One Way/ Single', code: 'S' }, {type: 'Return', code: 'R' }],
    selectedToll: 'Choose Toll',
    selectedType: 'Choose Journey Type',
    selectedVehicle: 'Choose Vehicle',
    fare: 'Fill Form Above to Get Tax',
    cardInfoModal: false,
    cardOTPModal: false,
    OKModal: false,
    addTransactionModal:false,
    currentInAnimation: 'zoomInUp',
    currentOutAnimation: 'zoomOutUp',
    backdropColor: 'black',
    idQRModal: false

  } 
  state= {
    isLoading:false,
    idQRModal: false,
    addTransactionModal:false,
    visibleModal: false,
    backdropOpacity:0.4,
    txns: [],
    tolls: [],
    owned: [],
    shared: [],
    ttypes: [{type: 'One Way/ Single', code: 'S' }, {type: 'Return', code: 'R' }],
    selectedToll: 'Choose Toll',
    selectedType: 'Choose Journey Type',
    selectedVehicle: 'Choose Vehicle',
    fare: 'Fill Form Above to Get Tax',
    cardInfoModal: false,
    cardOTPModal: false,
    OKModal: false,
    currentInAnimation: 'zoomInUp',
    currentOutAnimation: 'zoomOutUp',
    backdropColor: 'black',
    id_qr:''
  }

  _renderCardInfo = () => {
    return (<View>
              <Text>Card Info Content Goes Here</Text>
              <Button
                onPress={()=>this.setState({cardOTPModal:true, cardInfoModal:false})}
                title="To Card OTP Page"
                color="#841584"
              />
            </View>)
  }
  
  _renderCardOTP = () => {
    return (<View>
              <Text>Card OTP Content Goes Here</Text>
              <Button
                onPress={()=>{url = config.API_URL + config.PAY_TOLL;
                              this._startload();
                              fetch(url, {
                              method: 'POST',
                              headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': 'JWT '+this.state.token
                              },
                              body: JSON.stringify({
                                "gatewayTxnID": "GTXN" + String(Math.random()).substr(2,),
                                "rc": this.state.selectedVehicle,
                                "eTollID": this.state.selectedToll,
                                "amount_paid": this.state.fare.toString(),
                                "ttype": this.state.selectedType
                              }),
                            }).then((response)=>response.json())
                            .then((jsonResponse)=>{this._endload();this.setState({visibleModal: true,cardOTPModal:false, OKModal:true})})
                            .catch((error)=>{this._endload();console.log('Error sending request ',error)})}}
                title="To Transaction OK"
                color="#841584"
              />
            </View>)
  }

  _renderTransactionOK = () => {
    // send request to payment success
    return (<Text>Transaction OK Goes Here</Text>)
  }



  _renderAddTransaction = () => {
    let tollItems = this.state.tolls.map( (s, i) => {
            return <Picker.Item key={i} value={s.eTollID} label={s.meta} />
    });
    let typeItems = this.state.ttypes.map( (s, i) => {
            return <Picker.Item key={i} value={s.code} label={s.type} />
    });
    let vehicleItems = this.state.owned.concat(this.state.shared).map( (s, i) => {
            return <Picker.Item key={i} value={s.RC} label={s.vehicle_no} />
    });
    return (
        <View style={styles.modalContent2}>
          <Picker
            selectedValue={this.state.selectedToll}
            onValueChange={(itemValue, itemIndex) => this.setState({selectedToll: itemValue},()=>this.getFare())}>
            <Picker.Item key={-1} value="" label="Choose Toll" color="grey"/>
            {tollItems}
          </Picker>
          <Picker
            selectedValue={this.state.selectedType}
            onValueChange={(itemValue, itemIndex) => this.setState({selectedType: itemValue},()=>this.getFare())}>
            <Picker.Item key={-1} value="" label="Choose Journey Type" color="grey" />
            {typeItems}
          </Picker>
          <Picker
            selectedValue={this.state.selectedVehicle}
            onValueChange={(itemValue, itemIndex) => this.setState({selectedVehicle: itemValue},()=>this.getFare())}>
            <Picker.Item key={-1} value="" label="Choose Vehicle" color="grey"/>
            {vehicleItems}
          </Picker>
          {
            !isNaN(Number(this.state.fare)) &&
                     <TextButton style={{marginBottom: 10}}
                      onPress={() =>this.setState({visibleModal: true, backdropColor:'white', currentInAnimation: 'slideInRight',currentOutAnimation:'slideOutLeft',cardInfoModal:true, addTransactionModal:false, backdropOpacity: 1})}
                      rippleDuration={600} 
                      rippleOpacity={0.54} 
                      titleStyle={{fontSize:15}}
                      color='rgba(0, 0, 0, .05)'
                      title={"Proceed to Pay " + this.state.fare.toString()} 
                      titleColor='#1c437c' />
          }
         
        </View>
  )}

  getFare() {
    url = config.API_URL + config.GET_FARE+`?RC=${this.state.selectedVehicle}&eTollID=${this.state.selectedToll}&ttype=${this.state.selectedType}`;
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'JWT '+this.state.token
      },
    }).then((response)=>response.json())
      .then((jsonResponse)=>{
                            if (jsonResponse.tax !=undefined) {
                              this.setState({fare: jsonResponse.tax});
                            }
                           })
      .catch((error)=>{console.warn('Error sending request ',error)});
  }

  getTxns() {
    url = config.API_URL + config.GET_TXNS;
    this._startload();
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'JWT '+this.state.token
      }
    }).then((response)=>response.json())
      .then((jsonResponse)=>{this._endload();this.setState({txns: jsonResponse.data})})
      .catch((error)=>{this._endload();console.warn('Error sending request ',error)});
  }

  getAllOwnedVehicles() {
    url = config.API_URL + config.LIST_OWNED;
    this._startload();
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'JWT '+this.state.token
      }
    }).then((response)=>response.json())
      .then((jsonResponse)=>{this._endload();this.setState({owned: jsonResponse})})
      .catch((error)=>{this._endload();console.warn('Error sending request ',error)});
  }

  getAllSharedVehicles() {
    url = config.API_URL+config.LIST_SHARED;
    this._startload();
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'JWT '+this.state.token
      }
    }).then((response)=>response.json())
      .then((jsonResponse)=>{this._endload();console.log(jsonResponse);this.setState({shared: jsonResponse})})
      .catch((error)=>{this._endload();console.log('Error sending request ',error)});
  }

  getTolls() {
    url = config.API_URL + config.GET_TOLL_LIST;
    this._startload();
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'JWT '+this.state.token
      }
    }).then((response)=>response.json())
      .then((jsonResponse)=>{this._endload();this.setState({tolls: jsonResponse.data})})
      .catch((error)=>{this._endload();console.warn('Error sending request ',error)});
  }

  onActionInvoke() {
    this.setState({ visibleModal: true, addTransactionModal: true });
  }

  _keyExtractor = (item, index) => item.eTollTxnID;

  _renderIDQR = () => {
    return (
        <View style={styles.modalContent}>
          <Image style={{width: 320, height: 300}}
            source={{uri: "data:image/gif;base64,"+this.state.id_qr}}
          />
        </View>
    )}

  _renderItem({item}) {
    return (<View style={styles.tCard}>
              <View style={styles.content}>
                <Text style={styles.display}>{item.eTollTxnID}
                  <Icon name={item.validity? "done" :"clear" } size={20} color={item.validity? "green" :"red" } />
                </Text>
                <Text style={styles.text}>{item.gatewayTxnID}</Text>
                <Text style={styles.text}><Strong>Paid for eToll </Strong>{item.eTollID}</Text>
                <Text style={styles.text}><Strong>Paid for RC </Strong>{item.rc}</Text>
                <Text style={styles.text}><Strong>Amount Paid </Strong>{item.amount_paid}</Text>
                <Text style={styles.text}><Strong>Date </Strong>{
                  (new Date(Number(item.created))).toString().split(' ')[2]+ ' '
                  + (new Date(Number(item.created))).toString().split(' ')[1] + ' '
                  + (new Date(Number(item.created))).toString().split(' ')[3]
                }</Text>
                <Text style={styles.text}><Strong>Time </Strong>{
                  (new Date(Number(item.created))).toString().split(' ')[4]
                }</Text>
                <TextButton
                      color='rgba(0, 0, 0, .05)'
                      style={{ margin: 4 }}
                      onPress={()=>{
                        // Send a request to fetch QR and show it on screen with Opaque modal
                        url = config.API_URL + config.GET_VID;
                        this._startload();
                        fetch(url, {
                          method: 'POST',
                          headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'JWT '+this.state.token
                          },
                          body: JSON.stringify({
                            rc: item.rc,
                          }),
                        }).then((response)=>response.json())
                          .then((jsonResponse)=>{this._endload();this.setState({id_qr: jsonResponse.qr, visibleModal: true, idQRModal: true });})
                          .catch((error)=>{this._endload();console.log('Error sending request ',error)});
                      }}
                      title="SHOW ID"
                    />
               </View>
            </View>)
  }
  _startload = () => this.setState({visibleModal:true, isLoading:true})
  _endload = () => this.setState({visibleModal:false, isLoading: false})
  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationIn={this.state.currentInAnimation}
          animationOut={this.state.currentOutAnimation}
          backdropColor={this.state.backdropColor}
          backdropOpacity={this.state.backdropOpacity}
          onBackButtonPress={()=>{this.getTxns();this.setState(this.default_state)}}
          onModalHide={()=>{this.setState(this.default_state)}}
          isVisible={this.state.visibleModal}
          supportedOrientations={['portrait', 'landscape']}
          onBackdropPress={() => {this.getTxns();this.setState(this.default_state)}}
        >
          {this.state.addTransactionModal && this._renderAddTransaction()}
          {this.state.cardInfoModal && this._renderCardInfo()}
          {this.state.cardOTPModal && this._renderCardOTP()}
          {this.state.OKModal && this._renderTransactionOK()}
          {this.state.idQRModal && this._renderIDQR()}
          {this.state.isLoading && <ActivityIndicator size="large" color="#1c437c" />}
        </Modal>
        {this.state.txns.length != 0 && <FlatList
          style={{padding:8}}
          data={this.state.txns}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem.bind(this)}/>}

        {this.state.txns.length == 0 && <Text style={{alignSelf:"center", fontSize:30}} color="white">Nothing To Show Here</Text>}
        
        <ActionButton buttonColor="#1c437c" offsetY={8} offsetX={8} onPress={()=>this.onActionInvoke()}>
        </ActionButton>
    </View>
    )
  }
}