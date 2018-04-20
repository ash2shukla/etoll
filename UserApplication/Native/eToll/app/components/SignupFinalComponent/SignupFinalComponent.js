import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Button,
  AppRegistry
} from 'react-native';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import config from '../../../config';


export default class SignupFinalComponent extends Component {

  constructor(props) {
  	super(props);
    this.state={p1: '', p2: '', signupToken: this.props.navigation.state.params.signupToken};
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

  signupHandler(jsonResponse) {
    if (jsonResponse.res == 'created') {
      // ask for a token and login the user
      url = config.API_URL+config.AUTH_LOGIN;
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.props.navigation.state.params.dl,
          password: this.state.p1,
        }),
      }).then((response)=>response.json())
        .then((jsonResponse)=>{this.loginHandler(jsonResponse)})
        .catch((error)=>console.log('Error sending request ',error));
    } else {
      console.log('Either timeout or mal attempt');
    }
  }

  signupUser() {
    if(this.state.p1 == this.state.p2){
      url = config.API_URL+config.AUTH_SIGNUP;
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pass: this.state.p1,
          token: this.state.signupToken
        }),
      }).then((response)=>response.json())
        .then((jsonResponse)=>{this.signupHandler(jsonResponse)})
        .catch((error)=>console.log('Error sending request ',error));
    } else {
      console.log('p1 p2 didnt match');
    }
  }

  render() {
    return (
      <View>
        <TextInput
            placeholder="Password"
            onChangeText={(p1) => this.setState({p1})}
            value={this.state.p1}
            editable = {true}
            maxLength = {40}
          />
        <TextInput
            placeholder="Repeat Password"
            onChangeText={(p2) => this.setState({p2})}
            value={this.state.p2}
            editable = {true}
            maxLength = {40}
          />
        <Button
          onPress={this.signupUser.bind(this)}
          title="Finish Signup"
          color="#841584"
        />
      </View>
    );
  }
}