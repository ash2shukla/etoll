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
  AppRegistry
} from 'react-native';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import config from '../../../config';

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
      console.log('mal attempt to login');
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

  render() {
    return (
      <View>
        <TextInput
          placeholder="DL"
          editable = {true}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          maxLength = {40}
        />
        <TextInput
          placeholder="Password"
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          editable = {true}
          maxLength = {40}
        />
        <Button
          onPress={this.login.bind(this)}
          title="Login"
          color="#841584"
        />
        <Button
          onPress={()=> this.props.navigation.navigate('Signup')}
          title="Go to Signup"
          color="#841584"
        />
      </View>
    );
  }
}