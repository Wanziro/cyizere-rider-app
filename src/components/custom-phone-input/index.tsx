import {View, Text, TextInput, ViewStyle} from 'react-native';
import React from 'react';
import {viewFlexSpace} from '../../constants/styles';
import {APP_COLORS} from '../../constants/colors';

interface ICustomPhoneInputProps {
  onChangeText?: any;
  placeHolder?: string;
  containerStyle?: ViewStyle;
  value?: string;
}
const CustomPhoneInput = ({
  placeHolder,
  containerStyle,
  onChangeText,
  value,
}: ICustomPhoneInputProps) => {
  return (
    <View
      style={[
        viewFlexSpace,
        {
          backgroundColor: APP_COLORS.WHITE,
          marginTop: 5,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: APP_COLORS.BORDER_COLOR,
        },
        {...containerStyle},
      ]}>
      <Text
        style={{
          padding: 10,
          borderRightColor: APP_COLORS.BORDER_COLOR,
          borderRightWidth: 1,
        }}>
        +250
      </Text>
      <TextInput
        placeholderTextColor={APP_COLORS.GRAY}
        placeholder={
          placeHolder !== undefined ? placeHolder : 'Enter phone number'
        }
        style={{
          flex: 1,
          marginLeft: 10,
          padding: 10,
          color: APP_COLORS.BLACK,
        }}
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
      />
    </View>
  );
};

export default CustomPhoneInput;
