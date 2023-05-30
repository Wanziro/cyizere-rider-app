import {View, Text, Dimensions, ScrollView, TextInput} from 'react-native';
import React from 'react';
import {commonInput, viewFlexSpace} from '../../../../constants/styles';
import SubmitButton from '../../../../components/submit-button';
import {APP_COLORS} from '../../../../constants/colors';
import CustomTextInput from '../../../../components/custom-text-input';
import DocumentPicker from 'react-native-document-picker';
import {ADD_GIFT_STEPS_ENUM, IGiftState} from '..';
import ImageLoader from '../../../../components/image-loader';
import {toastMessage} from '../../../../helpers';
import {TOAST_MESSAGE_TYPES} from '../../../../../interfaces';

const {width} = Dimensions.get('window');
interface IstepProps {
  setActiveStep: any;
  state: IGiftState;
  setState: any;
}
const GiftDetails = ({setActiveStep, state, setState}: IstepProps) => {
  const handleContinue = () => {
    if (state.name.trim() === '' || state.description.trim() === '') {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'All fields are required');
      return;
    }
    if (state.image === null) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please choose image of this gift',
      );
      return;
    }
    setActiveStep(ADD_GIFT_STEPS_ENUM.GIFT_PRODUCTS);
  };
  return (
    <View style={[viewFlexSpace, {flex: 1, flexDirection: 'column'}]}>
      <View style={{flex: 1, width, paddingHorizontal: 10, marginTop: 10}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginBottom: 10}}>
            <Text
              style={{
                color: APP_COLORS.FOOTER_BODY_TEXT_COLOR,
              }}>
              Name/Title
            </Text>
            <CustomTextInput
              placeHolder="Enter gift Name"
              inputProps={{
                onChangeText: text => setState({...state, name: text}),
                value: state.name,
              }}
            />
          </View>
          <View>
            <Text
              style={{
                color: APP_COLORS.FOOTER_BODY_TEXT_COLOR,
              }}>
              Description
            </Text>
            <TextInput
              placeholderTextColor={APP_COLORS.GRAY}
              style={[
                {
                  padding: 5,
                  color: APP_COLORS.BLACK,
                  maxHeight: 250,
                  minHeight: 100,
                  textAlignVertical: 'top',
                },
                commonInput,
              ]}
              placeholder="Product description"
              multiline={true}
              onChangeText={text => setState({...state, description: text})}
              value={state.description}
            />
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          width,
          padding: 10,
          borderTopColor: APP_COLORS.PRODUCT_CARD_BORDER,
          borderTopWidth: 1,
        }}>
        <SubmitButton
          title="Continue"
          buttonProps={{onPress: () => handleContinue()}}
        />
      </View>
    </View>
  );
};

export default GiftDetails;