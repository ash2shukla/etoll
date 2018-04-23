import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  Image,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  AppRegistry
} from 'react-native';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import config from '../../../config';
import styles from './splash.styles';

export default class SplashComponent extends Component {

  componentDidMount() {
    setTimeout(()=>{
      AsyncStorage.getItem('@TokenStore:token')
      .then((val)=>{
        if(val !=null) {
          this.props.navigation.navigate('Main');
         } else {
          this.props.navigation.navigate('Home');
         }
      })
      .catch((error)=>{
        console.warn('Error Retrieving token', error);
      });
    }, 0);
  }

  render() {
    return (
      <View style={styles.splashContainer}>
        <View style={{flex:1,marginTop:100, marginBottom:70, alignItems:'center'}}>
          <Text style={{fontWeight:'500', fontSize:50,  color:'#003e9c'}} >eToll</Text>
          <Text style={{fontSize:12, color:'#1c437c'}} >Pay Toll Digitally.</Text>
        </View>
        <Image
              source={require('./assets/nhaiLogo.png')}
        />
        <Text style={{flex:1}}></Text>
        <Text style={{flex:1}}></Text>
        <Text style={{flex:1}}></Text>
      </View>
    )
  }
}