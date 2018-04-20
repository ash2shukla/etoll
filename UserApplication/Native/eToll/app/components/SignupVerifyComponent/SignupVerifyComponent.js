import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Button,
  AppRegistry
} from 'react-native';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import config from '../../../config';


export default class SignupVerifyComponent extends Component {

  constructor(props) {
  	super(props);
    this.state = {dl: '', otp: '', uid: '', mobile: this.props.navigation.state.params.mobile};
  }

  verifyHandler(jsonResponse) {
    if(jsonResponse.token != undefined) {
      this.props.navigation.navigate({routeName: 'Final', params: {signupToken: jsonResponse.token, dl: this.state.dl}});
    } else {
      console.log('Err not verified or something');
    }
  }

  verifyUser() {
    url = config.API_URL+config.AUTH_VERIFY;
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dl: this.state.dl,
        otp: this.state.otp,
        uid: this.state.uid
      }),
    }).then((response)=>response.json())
      .then((jsonResponse)=>{this.verifyHandler(jsonResponse)})
      .catch((error)=>console.log('Error sending request ',error));
  }

  render() {
    return (
      <View>
        <TextInput
            placeholder="DL"
            onChangeText={(dl) => this.setState({dl})}
            value={this.state.dl}
            editable = {true}
            maxLength = {40}
          />
        <TextInput
            placeholder="UID"
            onChangeText={(uid) => this.setState({uid})}
            value={this.state.uid}
            editable = {true}
            maxLength = {40}
          />
        <TextInput
            placeholder="OTP"
            onChangeText={(otp) => this.setState({otp})}
            value={this.state.otp}
            editable = {true}
            maxLength = {40}
          />
        <Button
          onPress={this.verifyUser.bind(this)}
          title="verify"
          color="#841584"
        />
      </View>
    );
  }
}