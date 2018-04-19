/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import AuthComponent from './app/components/AuthComponent/AuthComponent';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View>
        <AuthComponent propValue="And make love on linen sheets"/>
      </View>
    );
  }
}