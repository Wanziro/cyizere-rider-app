import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React from 'react';
import {APP_COLORS} from '../../constants/colors';

interface ISubmitButtonProps {
  buttonProps?: TouchableOpacityProps;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  title?: string;
  titleComponent?: any;
}

const SubmitButton = ({
  buttonProps,
  textStyle,
  containerStyle,
  title,
  titleComponent,
}: ISubmitButtonProps) => {
  return (
    <TouchableOpacity {...buttonProps}>
      <View
        style={[
          {
            backgroundColor: APP_COLORS.ORANGE,
            padding: 15,
            borderRadius: 25,
            marginTop: 10,
          },
          {...containerStyle},
        ]}>
        {titleComponent === undefined ? (
          <Text
            style={[
              {
                color: APP_COLORS.WHITE,
                textAlign: 'center',
              },
              {...textStyle},
            ]}>
            {title}
          </Text>
        ) : (
          titleComponent
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SubmitButton;
