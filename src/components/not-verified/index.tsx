import {View, Text, Pressable} from 'react-native';
import React from 'react';
import {INavigationProp} from '../../../interfaces';
import {APP_COLORS} from '../../constants/colors';
const NotVerified = ({navigation}: INavigationProp) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
      }}>
      <Text
        style={{
          color: APP_COLORS.ORANGE,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 16,
        }}>
        Your account is not yet verified.
      </Text>
      <Pressable
        style={{marginTop: 20}}
        onPress={() => navigation.navigate('VerificationDetails')}>
        <View
          style={{
            backgroundColor: APP_COLORS.ORANGE,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
          }}>
          <Text style={{color: APP_COLORS.WHITE}}>
            Check Verification Details
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default NotVerified;
