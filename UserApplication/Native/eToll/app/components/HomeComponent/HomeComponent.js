import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  AppRegistry,
  ToastAndroid
} from 'react-native';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import config from '../../../config';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { TextButton, RaisedTextButton } from 'react-native-material-buttons';
import { Sae } from 'react-native-textinput-effects';
import styles from './home.styles';

export default class HomeComponent extends Component {

  constructor(props) {
  	super(props);
    this.state = {username: '', password: '' };
    AsyncStorage.getItem('@TokenStore:token')
    .then((val)=>{
      if(val !=null) {
        this.props.navigation.navigate('Main');
       } 
    })
    .catch((error)=>{
      console.log('Error Retrieving token', error);
    })
  }

  loginHandler(jsonResponse) {
    if(jsonResponse.token != undefined){
      // save this token in asyncstore
        AsyncStorage.setItem('@TokenStore:token', jsonResponse.token)
        .then(()=>this.props.navigation.navigate('Main'))
        .catch((error)=>console.log('Error Saving Data', error));
    } else {
      ToastAndroid.show('Wrong Credentials',ToastAndroid.SHORT);
    }
  }

  login() {
    url = config.API_URL+config.AUTH_LOGIN;
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    }).then((response)=>response.json())
      .then((jsonResponse)=>{this.loginHandler(jsonResponse)})
      .catch((error)=>console.log('Error sending request ',error));
  }
//{flex:1, justifyContent:'center', padding:60}
  render() {
    return (
      <View style={{flex:1, justifyContent:'center', padding:20}}>
        <View style={styles.card}>
        <Sae
          label={'Driving License'}
          iconClass={FontAwesomeIcon}
          inputStyle={{color:'#003e9c'}}
          iconName={'address-card'}
          iconColor={'#003e9c'}
          autoFocus={true}
          labelStyle={{color:'#003e9c'}}
          autoCapitalize={'characters'}
          autoCorrect={false}
          editable = {true}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          maxLength = {40}
          autoCorrect={false}
        />
        <Sae
          label={'Password'}
          iconClass={FontAwesomeIcon}
          iconName={'pencil'}
          iconColor={'#003e9c'}
          inputStyle={{color:'#003e9c'}}
          labelStyle={{color:'#003e9c'}}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry={true}
          value={this.state.password}
          editable = {true}
          maxLength = {40}
          autoCorrect={false}
          style={{marginBottom:10}}
        />
         <RaisedTextButton color='#1c437c' onPress={this.login.bind(this)} style={{ marginTop: 4, marginLeft: 0 }} titleColor='white' title='Login' />
         <TextButton style={{marginBottom: 10}} onPress={()=> this.props.navigation.navigate('Signup')} rippleDuration={600} rippleOpacity={0.54} titleStyle={{fontSize:12}} title="Haven't signed up yet?" titleColor='#1c437c' />
      </View>
     </View>
    );
  }
}
