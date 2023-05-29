import React from 'react';
import {View, Modal, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
function FullPageLoader({isLoading}: {isLoading: boolean}) {
  return (
    <Modal
      transparent
      presentationStyle="overFullScreen"
      style={{padding: 0, margin: 0}}
      statusBarTranslucent={true}
      visible={isLoading}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}>
        <FastImage
          source={require('../../assets/loader.gif')}
          style={{width: 100, height: 100}}
        />
      </View>
    </Modal>
  );
}

export default FullPageLoader;
