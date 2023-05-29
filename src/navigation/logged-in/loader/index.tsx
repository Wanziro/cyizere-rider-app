import {View, Text, StatusBar, ActivityIndicator} from 'react-native';
import React from 'react';
import {APP_COLORS} from '../../../constants/colors';

const Loader = () => {
  return (
    <>
      <StatusBar backgroundColor={APP_COLORS.ORANGE} barStyle="light-content" />
      <View
        style={{
          flex: 1,
          backgroundColor: APP_COLORS.BACKGROUND_COLOR,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
        }}>
        <ActivityIndicator color={APP_COLORS.ORANGE} size={50} />
      </View>
    </>
  );
};

export default Loader;
