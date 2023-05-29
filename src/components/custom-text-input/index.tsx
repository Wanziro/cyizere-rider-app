import {TextInput, TextInputProps} from 'react-native';
import React from 'react';
import {commonInput} from '../../constants/styles';
import {APP_COLORS} from '../../constants/colors';

interface ICustomTextInput {
  inputProps?: TextInputProps;
  inputStyles?: any;
  placeHolder: string;
}

const CustomTextInput = ({
  inputProps,
  placeHolder,
  inputStyles,
}: ICustomTextInput) => {
  return (
    <TextInput
      placeholderTextColor={APP_COLORS.GRAY}
      placeholder={placeHolder}
      style={[commonInput, {...inputStyles}]}
      {...inputProps}
    />
  );
};

export default CustomTextInput;
