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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import OtpInputs from 'react-native-otp-inputs'
import Icon from 'react-native-vector-icons/MaterialIcons';
import config from '../../../config';
import { Sae } from 'react-native-textinput-effects';
import { TextButton, RaisedTextButton } from 'react-native-material-buttons';


export default class SignupVerifyComponent extends Component {

  constructor(props) {
  	super(props);
    this.state = {dl: '', otp: '', uid: '', mobile: ''};
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
      <View flex={1} style={{flexDirection:'column'}}>
        <View flex={1} style={{
          borderRadius: 2,
          padding: 8,
          margin: 8,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          minHeight: 76,
          shadowOpacity: 0.54,
          shadowRadius: 1,
          shadowOffset: { width: 0, height: 1 },
          elevation: 1,
        }}>
          <Sae
            label={'Enter DL'}
            iconClass={FontAwesomeIcon}
            iconName={'pencil'}
            iconColor={'#003e9c'}
            inputStyle={{color:'#003e9c'}}
            labelStyle={{color:'#003e9c'}}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={(dl) => this.setState({dl})}
            secureTextEntry={true}
            value={this.state.dl}
            editable = {true}
            maxLength = {40}
            autoCorrect={false}
            style={{marginBottom:10}}
            />
          <Sae
            label={'Enter Aadhaar'}
            iconClass={FontAwesomeIcon}
            iconName={'pencil'}
            iconColor={'#003e9c'}
            inputStyle={{color:'#003e9c'}}
            labelStyle={{color:'#003e9c'}}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={(uid) => this.setState({uid})}
            secureTextEntry={true}
            keyboardType={'numeric'}
            value={this.state.uid}
            editable = {true}
            maxLength = {40}
            autoCorrect={false}
            style={{marginBottom:10}}
            />
          <Sae
            label={'Enter Received OTP'}
            iconClass={FontAwesomeIcon}
            iconName={'pencil'}
            iconColor={'#003e9c'}
            inputStyle={{color:'#003e9c'}}
            labelStyle={{color:'#003e9c'}}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={(otp) => this.setState({otp})}
            secureTextEntry={true}
            value={this.state.otp}
            editable = {true}
            maxLength = {40}
            keyboardType={'numeric'}
            autoCorrect={false}
            style={{marginBottom:10}}
            />
          <TextButton
            onPress={this.verifyUser.bind(this)}
            title="Verify DL by Aadhaar"
            color="#1c437c"
            titleColor='white'
            style={{marginTop:10}}
          />
        </View>
      </View>
    );
  }
}