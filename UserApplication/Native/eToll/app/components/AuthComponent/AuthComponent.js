import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppRegistry
} from 'react-native';

export default class AuthComponent extends Component {

  constructor(props) {
  	super(props);
  	this.state = {
  		localPropValue: this.props.propValue
  	}
  }
  render() {
  	console.log('From Auth Component');
    return (
      <View>
        <Text>
          {this.state.localPropValue}
        </Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('AuthComponent', () => AuthComponent)