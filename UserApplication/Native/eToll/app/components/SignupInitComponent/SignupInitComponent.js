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


export default class SignupInitComponent extends Component {

  constructor(props) {
  	super(props);
    this.state = {mobile: ''};
  }

  otpHandler(jsonResponse){
    this.props.navigation.navigate({routeName: 'Verify', params: {mobile: this.state.mobile}});
  }

  genotp() {
    url = config.API_URL+config.AUTH_OTP+'?phone='+this.state.mobile;
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response)=>response.json())
      .then((jsonResponse)=>{this.otpHandler(jsonResponse)})
      .catch((error)=>console.log('Error sending request ',error));
  }

  render() {
    return (
      <View>
        <TextInput
            placeholder="Mobile"
            onChangeText={(mobile) => this.setState({mobile})}
            value={this.state.mobile}
            editable = {true}
            maxLength = {40}
          />
        <Button
          onPress={this.genotp.bind(this)}
          title="Login"
          color="#841584"
        />
      </View>
    );
  }
}