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

export default class SplashComponent extends Component {

  constructor(props) {
  	super(props);
    AsyncStorage.getItem('@TokenStore:token')
    .then((val)=>{
      if(val !=null) {
        this.props.navigation.navigate('Main');
       } else {
        this.props.navigation.navigate('Home');
       }
    })
    .catch((error)=>{
      console.log('Error Retrieving token', error);
    })
  }

  render() {
    return (
      <View>
        <Text>This should be the splash</Text>
      </View>
    );
  }
}