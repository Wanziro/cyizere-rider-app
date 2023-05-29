import {View, Text, StatusBar, Image, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import React from 'react';
import {APP_COLORS} from '../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {IUserReducer} from '../../../reducers/user';
import {fetchUserStatus, resetUser} from '../../../actions/user';

const LoadingError = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(resetUser());
  };
  const {loadingError} = useSelector(
    (state: RootState) => state.user,
  ) as IUserReducer;
  const handleRetry = () => {
    dispatch(fetchUserStatus());
  };
  return (
    <>
      <StatusBar backgroundColor={APP_COLORS.ORANGE} barStyle="light-content" />
      <View
        style={{
          flex: 1,
          backgroundColor: APP_COLORS.ORANGE,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
        }}>
        <Text
          style={{textAlign: 'center', color: APP_COLORS.WHITE, marginTop: 10}}>
          {loadingError}
        </Text>
        <Pressable style={{marginTop: 20}} onPress={() => handleRetry()}>
          <View
            style={{
              backgroundColor: APP_COLORS.BLACK,
              padding: 10,
              borderRadius: 10,
            }}>
            <Text style={{color: APP_COLORS.WHITE}}>Try Again Now</Text>
          </View>
        </Pressable>
        <Pressable style={{marginTop: 20}} onPress={() => handleLogout()}>
          <View
            style={{
              backgroundColor: APP_COLORS.BLACK,
              padding: 10,
              borderRadius: 10,
            }}>
            <Text style={{color: APP_COLORS.WHITE}}>Logout</Text>
          </View>
        </Pressable>
      </View>
    </>
  );
};

export default LoadingError;
