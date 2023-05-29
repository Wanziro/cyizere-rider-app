import {View, Text, Dimensions, Pressable, StatusBar} from 'react-native';
import React from 'react';
import {APP_COLORS} from '../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {resetUser} from '../../../actions/user';

const {width} = Dimensions.get('window');

const DisabledAccount = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(resetUser());
  };
  return (
    <>
      <StatusBar backgroundColor={APP_COLORS.ORANGE} barStyle="light-content" />
      <View
        style={{
          backgroundColor: APP_COLORS.ORANGE,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
        }}>
        <Icon
          name="circle-off-outline"
          size={width / 2}
          color={APP_COLORS.WHITE}
        />
        <Text style={{color: APP_COLORS.WHITE, textAlign: 'center'}}>
          Your account has been disabled. Contact Cyizere App Admin for further
          help. 0788712248
        </Text>
        <Pressable style={{width: width / 2}} onPress={() => handleLogout()}>
          <View
            style={{
              backgroundColor: APP_COLORS.BLACK,
              padding: 10,
              borderRadius: 10,
              marginTop: 20,
            }}>
            <Text style={{textAlign: 'center', color: APP_COLORS.WHITE}}>
              Logout
            </Text>
          </View>
        </Pressable>
      </View>
    </>
  );
};

export default DisabledAccount;
