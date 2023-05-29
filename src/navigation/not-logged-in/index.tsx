import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {Pressable, View, StatusBar, Text, Easing} from 'react-native';

import {INavigationProp} from '../../../interfaces';
import {APP_COLORS} from '../../constants/colors';
import Login from '../../screens/not-logged-in/login';
import Register from '../../screens/not-logged-in/register';

const Stack = createStackNavigator();

function NotLoggedIn() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{
          // headerMode: 'float',
          // gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={({route, navigation}: INavigationProp) => ({
            headerShown: false,
            headerShadowVisible: false,
          })}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Cyizere supplier registration',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NotLoggedIn;
