import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button } from 'react-native';
import { NavigationComponent } from 'react-native-material-bottom-navigation';

export default class TransactionComponent extends Component {
  static navigationOptions = {
    tabBarLabel: 'Transactions',
    tabBarIcon: () => <Icon size={24} name="ondemand-video" color="white" />
  }

  render() {
    return (
      <View>
        <Text>TransactionComponent Content Goes Here</Text>
      </View>
    )
  }
}

//AppRegistry.registerComponent('TransactionComponent', () => TransactionComponent);