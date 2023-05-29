import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import {APP_COLORS} from '../../../../constants/colors';
import {REGISTER_STEPS_ENUM} from '..';
import {viewFlexSpace} from '../../../../constants/styles';

interface IStepsHeaderProps {
  activeStep: string;
}
const {width} = Dimensions.get('window');
const StepsHeader = ({activeStep}: IStepsHeaderProps) => {
  return (
    <View style={{backgroundColor: APP_COLORS.ORANGE, padding: 10, width}}>
      {activeStep === REGISTER_STEPS_ENUM.PERSONAL_INFO && (
        <View style={[viewFlexSpace]}>
          <Text style={{color: APP_COLORS.WHITE}}>Rider Personal info</Text>
          <Text style={{color: APP_COLORS.WHITE}}>Step 1/2</Text>
        </View>
      )}
      {activeStep === REGISTER_STEPS_ENUM.CREDENTIALS_INFO && (
        <View style={[viewFlexSpace]}>
          <Text style={{color: APP_COLORS.WHITE}}>Login Credentials</Text>
          <Text style={{color: APP_COLORS.WHITE}}>Step 2/2</Text>
        </View>
      )}
    </View>
  );
};

export default StepsHeader;
