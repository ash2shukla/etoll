import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { Component } from 'react';
import { AppRegistry, ActivityIndicator, FlatList, AsyncStorage, StyleSheet, Text, TextInput, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { NavigationComponent } from 'react-native-material-bottom-navigation';
import Modal from "react-native-modal";
import ActionButton from 'react-native-action-button';
import styles from './vehicles.style';
import QRCodeScanner from 'react-native-qrcode-scanner';
import config from '../../../config';
import { TextButton, RaisedTextButton } from 'react-native-material-buttons';
import { Sae } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';


let Strong = ({ children, ...props }) =>
<Text style={styles.bold} {...props}>{children}</Text>

export default class VehiclesComponent extends Component {
  static navigationOptions = {
    tabBarLabel: 'Vehicles',
    tabBarIcon: () => <Icon size={24} name="directions-car" color="black" />
  }

  state = {
          visibleModal: false,
          backdropOpacity:0.4,
          pin:'',
          rc:'',
          token: '',
          qrModal: false,
          shareQRModal: false,
          vehicleModal: false,
          idQRModal: false,
          shared: [],
          owned: [],
          qr:'',
          id_qr:'',
          isLoading:true,

  }

 componentDidMount() {
    this.props.navigation.addListener('willFocus', (playload)=>{
       AsyncStorage.getItem('@TokenStore:token')
        .then((val)=>{
        if(val !=null) {
        // Get all vehicles
          this.setState({token:val},()=>{
            this.getAllOwnedVehicles();
            this.getAllSharedVehicles();
          });
         } else {
          this.props.navigation.navigate('Home');
        }
    })
    .catch((error)=>{
      console.log('Error Retrieving token', error);
    });
    });
  }

  onSuccess(e) {
    parts = e.data.split(',');
    this.setState({rc: parts[0], pin: parts[1]}, ()=> this.shareVehicle());
    this.setState({visibleModal: false})
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
  
  shareVehicleHandler(jsonResponse) {
    if (jsonResponse.pin != undefined) {
      this.setState({pin:'', rc:''});
      this.getAllSharedVehicles();
      this.getAllOwnedVehicles();
      this.setState({visibleModal: false, backdropOpacity:0.4})
      console.warn(jsonResponse);
    } else {
      console.warn("Something went wrong");
      console.warn(jsonResponse);
    }
  }

  shareVehicle() {
    url = config.API_URL+config.ADD_SHARE;
    if(this.state.pin=="") {
      url = config.API_URL+config.ADD_VEHICLE;
    }
   this._startload();
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'JWT '+this.state.token
      },
      body: JSON.stringify({
        RC: this.state.rc,
        pin: this.state.pin,
      }),
    }).then((response)=>response.json())
      .then((jsonResponse)=>{this._endload();this.shareVehicleHandler(jsonResponse)})
      .catch((error)=>{this._endload();console.log('Error sending request ',error)});
  }

  _renderIDQR = () => {
    return (
        <View style={styles.modalContent}>
          <Image style={{width: 320, height: 300}}
            source={{uri: "data:image/gif;base64,"+this.state.id_qr}}
          />
        </View>
    )}

  _renderShareQR = () => {
    return (
        <View style={styles.modalContent}>
          <Image style={{width: 320, height: 300}}
            source={{uri: "data:image/gif;base64,"+this.state.qr}}
          />
        </View>
    )}

  _renderQRScanner = () => (
        <QRCodeScanner
          style={{width: 50, height: 50}}
          onRead={this.onSuccess.bind(this)}
        />
    )

  _renderAddVehicle = () => (
    <View style={styles.modalContent2}>
      <Sae
        label={'RC'}
        iconClass={FontAwesomeIcon}
        iconName={'pencil'}
        iconColor={'#003e9c'}
        inputStyle={{color:'#003e9c'}}
        labelStyle={{color:'#003e9c'}}
        autoCapitalize={'none'}
        autoCorrect={false}
        onChangeText={(rc) => this.setState({rc})}
        secureTextEntry={true}
        value={this.state.rc}
        editable = {true}
        maxLength = {40}
        autoCorrect={false}
        style={{marginBottom:10}}
      />
      <Sae
        label={'PIN'}
        iconClass={FontAwesomeIcon}
        iconName={'pencil'}
        iconColor={'#003e9c'}
        inputStyle={{color:'#003e9c'}}
        labelStyle={{color:'#003e9c'}}
        autoCapitalize={'none'}
        autoCorrect={false}
        onChangeText={(pin) => this.setState({pin})}
        secureTextEntry={true}
        keyboardType={'numeric'}
        value={this.state.pin}
        editable = {true}
        maxLength = {40}
        autoCorrect={false}
        style={{marginBottom:10}}
      />
      <RaisedTextButton color='#1c437c' onPress={this.shareVehicle.bind(this)} style={{ marginTop: 4, marginLeft: 0, marginBottom:10 }} titleColor='white' title='add vehicle' />
    </View>  
  );

  _renderItem({item}) {
    return (<View style={styles.vCard}>
                <View style={styles.content}>
                  <Text style={styles.display}>Vehicle no {item.vehicle_no}</Text>
                  <Text style={styles.text}><Strong>Vehicle Name </Strong>{item.vname == ""? "Not Available": item.vname}</Text>
                  <Text style={styles.text}><Strong>Vehicle Model </Strong>{item.vmodel == ""? "Not Available": item.vmodel}</Text>
                  <Text style={styles.text}><Strong>Owner DL </Strong>{item.owner}</Text>
                  <Text style={styles.text}><Strong>Vehicle RC </Strong>{item.RC}</Text>
                  <Text style={styles.text}><Strong>Vehicle Type </Strong>{item.vtype}</Text>
                  <Text style={styles.text}><Strong>Share PIN </Strong>{item.pin}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TextButton
                      style={{ margin: 4, marginLeft: 0 }}
                      onPress={()=>{
                        this._startload();
                        // Send a request to fetch QR and show it on screen with Opaque modal
                        url = config.API_URL + config.GET_SHARE_QR;
                        fetch(url, {
                          method: 'POST',
                          headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'JWT '+this.state.token
                          },
                          body: JSON.stringify({
                            RC: item.RC,
                          }),
                        }).then((response)=>response.json())
                          .then((jsonResponse)=>{this._endload();this.setState({qr: jsonResponse.qr, visibleModal: true, shareQRModal: true });})
                          .catch((error)=>{this._endload();console.log('Error sending request ',error)});
                      }}
                      color='rgba(0, 0, 0, .05)'
                      title="Show share QR"
                    />
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
                            rc: item.RC,
                          }),
                        }).then((response)=>response.json())
                          .then((jsonResponse)=>{this._endload();this.setState({id_qr: jsonResponse.qr, visibleModal: true, idQRModal: true });})
                          .catch((error)=>{this._endload();console.log('Error sending request ',error)});
                      }}
                      title="SHOW ID"
                    />
                  </View>
                </View>
            </View>)
  }

  _keyExtractor = (item, index) => item.RC;
  _startload = () => this.setState({visibleModal:true, isLoading:true})
  _endload = () => this.setState({visibleModal:false, isLoading: false})
  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationIn='zoomInUp'
          animationOut='zoomOutUp'
          backdropColor='black'
          backdropOpacity={this.state.backdropOpacity}
          onBackButtonPress={()=>{this.setState({visibleModal: false, backdropOpacity:0.4})}}
          onModalHide={()=>{this.setState({vehicleModal: false, qrModal: false, shareQRModal: false, idQRModal: false})}}
          isVisible={this.state.visibleModal}
          supportedOrientations={['portrait', 'landscape']}
          onBackdropPress={() => this.setState({ visibleModal: false, backdropOpacity:0.4})}
        >
          {this.state.shareQRModal && this._renderShareQR()}
          {this.state.vehicleModal && this._renderAddVehicle()}
          {this.state.qrModal && this._renderQRScanner()}
          {this.state.idQRModal && this._renderIDQR()}
          {this.state.isLoading && <ActivityIndicator size="large" color="#1c437c" />}
        </Modal>
        {this.state.owned.concat(this.state.shared).length != 0 && <FlatList
          style={{padding:8}}
          data={this.state.owned.concat(this.state.shared)}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem.bind(this)}/>}

        {this.state.owned.concat(this.state.shared).length == 0 &&<Text style={{alignSelf:"center", fontSize:30}} color="white">Nothing To Show Here</Text>}
        
        <ActionButton buttonColor="#1c437c" offsetY={8} offsetX={8}>
          <ActionButton.Item buttonColor='#abb1ba' size={40} title="Add owned vehicle or vehicle by PIN"  onPress={()=>this.setState({ visibleModal: true, vehicleModal: true })}>
            <Icon name="filter-none" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#abb1ba' size={40} title="Add vehicle by QR" onPress={()=>this.setState({visibleModal:true, qrModal:true, vehicleModal:false})}>
            <Icon name="border-clear" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
    </View>
    )
  }
}
