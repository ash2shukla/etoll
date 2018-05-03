import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Image, TouchableOpacity, Text, View, Button, AsyncStorage } from 'react-native';
import { NavigationComponent } from 'react-native-material-bottom-navigation';
import Modal from "react-native-modal";
import { TextButton, RaisedTextButton } from 'react-native-material-buttons';
import ActionButton from 'react-native-action-button';
import styles from "./profile.style";
import config from '../../../config';


let Strong = ({ children, ...props }) =>
<Text style={styles.bold} {...props}>{children}</Text>

export default class ProfileComponent extends Component {

  static navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: () => <Icon size={24} name="account-box" color="black" />
  }
  
  state = {
    visibleModal: false,
    profileContent: {},
    showProfile: false
  };

  _renderProfileContent = () => (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.display}>
          {'  '+this.state.profileContent.firstname + ' ' + this.state.profileContent.lastname}</Text>
        <Text style={styles.text}>{this.state.profileContent.mobile}</Text>
        <Text style={styles.text}>{this.state.profileContent.dl}</Text>
        <Text style={styles.text}>{this.state.profileContent.email}</Text>
        <Text style={styles.text}>{this.state.profileContent.address==''?"No Address Available":this.state.profileContent.address}</Text>
        <Text style={styles.text2}><Strong>Total Money Spent On Tolls </Strong>{this.state.profileContent.sql_analytics.total_spent} &#8377;</Text>
        <Text style={styles.text2}><Strong>Most Visited Toll </Strong>{this.state.profileContent.sql_analytics.most_visited}</Text>
        <Text style={styles.text2}><Strong>Active Transactions </Strong>{this.state.profileContent.sql_analytics.active_txn}</Text>
        <Text style={styles.text2}><Strong>Most Used Vehicle No </Strong>{this.state.profileContent.sql_analytics.most_used_vehicle}</Text>
        <Text style={styles.text2}><Strong>Vehicles People Share With You </Strong></Text>
        <Text style={styles.text2}>{this.state.profileContent.sql_analytics.shared_with}</Text>
        <TextButton
            onPress={()=>this.logout()}
            title="Logout"
            rippleDuration={600} 
            rippleOpacity={0.54}
            color='rgba(28, 67, 124, .14)'
            titleColor='#1c437c'
          />
      </View> 
    </View>
  );

  componentDidMount() {
    this.props.navigation.addListener('willFocus', (playload)=>{
       AsyncStorage.getItem('@TokenStore:token')
        .then((val)=>{
        if(val !=null) {
        // Get all vehicles
          this.setState({token:val}, ()=> {
            url = config.API_URL + config.GET_PROFILE;
            fetch(url, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'JWT '+this.state.token
              }
            }).then((response)=>response.json())
              .then((jsonResponse)=>{this.setState({showProfile: true, profileContent:jsonResponse.data})})
              .catch((error)=>console.warn('Error sending request ',error));
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

  logout() {
    // console.warn(geolib.getDistance(
    //   {latitude: 28.624248, longitude: 77.434115},
    //   {latitude: 28.624376, longitude: 77.435312}
    //   ));
      AsyncStorage.removeItem('@TokenStore:token')
              .then(()=>{
                this.props.navigation.navigate('Home');
              })
              .catch((error)=>console.warn('Error Removing token', error));  
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.showProfile && this._renderProfileContent()} 
      </View>
    )
  }
}
