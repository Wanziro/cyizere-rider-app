import {View, Modal, ViewStyle, Dimensions} from 'react-native';
import React from 'react';
import {APP_COLORS} from '../../constants/colors';

interface ICustomModalProps {
  containerStyles?: ViewStyle;
  children: JSX.Element[] | JSX.Element;
  isVisible: boolean;
}
const {width} = Dimensions.get('window');
const CustomModal = (props: ICustomModalProps) => {
  return (
    <Modal
      transparent
      visible={props.isVisible}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}
      style={{padding: 0, margin: 0}}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}>
        <View
          style={[
            {
              backgroundColor: APP_COLORS.BACKGROUND_COLOR,

              padding: 20,
              borderRadius: 10,
              width: width - 20,
            },
            {...props.containerStyles},
          ]}>
          {props.children}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
