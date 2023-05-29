import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import {APP_COLORS} from '../../../../constants/colors';
import {REGISTER_STEPS_ENUM} from '..';
import SubmitButton from '../../../../components/submit-button';
import Icon from 'react-native-vector-icons/Entypo';
import {viewFlexCenter, viewFlexSpace} from '../../../../constants/styles';

const {width} = Dimensions.get('window');
interface IStepsFooterProps {
  activeStep: string;
  setActiveStep: any;
  handleStepOneNext: any;
  handleSubmit: any;
}
const StepsFooter = ({
  activeStep,
  handleStepOneNext,
  setActiveStep,
  handleSubmit,
}: IStepsFooterProps) => {
  return (
    <View style={{padding: 10, backgroundColor: APP_COLORS.WHITE, width}}>
      {activeStep === REGISTER_STEPS_ENUM.PERSONAL_INFO && (
        <SubmitButton
          buttonProps={{onPress: () => handleStepOneNext()}}
          titleComponent={
            <View style={[viewFlexCenter, {flexDirection: 'row'}]}>
              <Text style={{color: APP_COLORS.WHITE}}>Continue </Text>
              <Icon name="chevron-right" size={20} color={APP_COLORS.WHITE} />
            </View>
          }
        />
      )}
      {activeStep === REGISTER_STEPS_ENUM.CREDENTIALS_INFO && (
        <View style={[viewFlexSpace]}>
          <SubmitButton
            buttonProps={{
              onPress: () => setActiveStep(REGISTER_STEPS_ENUM.PERSONAL_INFO),
            }}
            containerStyle={{backgroundColor: APP_COLORS.GRAY}}
            titleComponent={
              <View style={[viewFlexCenter, {flexDirection: 'row'}]}>
                <Icon name="chevron-left" size={20} color={APP_COLORS.WHITE} />
                <Text style={{color: APP_COLORS.WHITE}}>Back </Text>
              </View>
            }
          />
          <SubmitButton
            buttonProps={{
              onPress: () => handleSubmit(),
              style: {flex: 1, marginLeft: 10},
            }}
            titleComponent={
              <View style={[viewFlexCenter, {flexDirection: 'row'}]}>
                <Text style={{color: APP_COLORS.WHITE}}>Submit </Text>
                <Icon name="check" size={20} color={APP_COLORS.WHITE} />
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

export default StepsFooter;
