/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  AppRegistry
} from 'react-native';
import { NavigationComponent } from 'react-native-material-bottom-navigation';
import { TabNavigator, SwitchNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import TransactionComponent from './app/components/TransactionComponent/TransactionComponent';
import VehiclesComponent from './app/components/VehiclesComponent/VehiclesComponent';
import ProfileComponent from './app/components/ProfileComponent/ProfileComponent';
import HomeComponent from './app/components/HomeComponent/HomeComponent';
import SignupInitComponent from './app/components/SignupInitComponent/SignupInitComponent';
import SignupVerifyComponent from './app/components/SignupVerifyComponent/SignupVerifyComponent';
import SignupFinalComponent from './app/components/SignupFinalComponent/SignupFinalComponent';
import SplashComponent from './app/components/SplashComponent/SplashComponent';


export default SwitchNavigator({
  Splash: { screen: SplashComponent },
  Home: {screen: HomeComponent},
  Signup: {screen: StackNavigator({
              Init: { screen: SignupInitComponent },
              Verify: { screen: SignupVerifyComponent },
              Final: { screen: SignupFinalComponent },
            })
          },
  Main: {screen: TabNavigator({
                        Profile: { screen: ProfileComponent },
                        Transaction: { screen: TransactionComponent },
                        Vehicles: { screen: VehiclesComponent },
                        },
                        {
                        shifting: true,
                        tabBarComponent: NavigationComponent,
                        tabBarPosition: 'bottom',
                        tabBarOptions: {
                            bottomNavigationOptions: {
                              labelColor: 'white',
                              rippleColor: 'white',
                              tabs: {
                                Profile: {barBackgroundColor: '#5D4037'},
                                Transaction: {barBackgroundColor: '#37474F'},
                                Vehicles: {barBackgroundColor: '#00796B'},              
                                }
                            }
                          }
                        })
          }
})
