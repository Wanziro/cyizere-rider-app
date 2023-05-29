import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import React from 'react';
import {APP_COLORS} from '../../../../constants/colors';
import {commonInput, viewFlexSpace} from '../../../../constants/styles';
import CustomPhoneInput from '../../../../components/custom-phone-input';
import {Picker} from '@react-native-picker/picker';
import {REGISTER_STEPS_ENUM} from '..';
import CustomTextInput from '../../../../components/custom-text-input';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import DatePicker from 'react-native-date-picker';

interface IInputsProps {
  state: any;
  setState: any;
  handleDocumentSelect: any;
  navigation: any;
  isLoading: boolean;
  activeStep: REGISTER_STEPS_ENUM;
}
const {width} = Dimensions.get('window');
const Inputs = ({
  state,
  setState,
  handleDocumentSelect,
  activeStep,
}: IInputsProps) => {
  const {categories} = useSelector((state: RootState) => state.shopCategories);
  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <ScrollView>
        <View style={{padding: 10, flex: 1, height: '100%'}}>
          {activeStep === REGISTER_STEPS_ENUM.PERSONAL_INFO && (
            <>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: APP_COLORS.TEXT_GRAY,
                    fontWeight: '600',
                  }}>
                  Full Name
                </Text>
                <CustomTextInput
                  placeHolder="Enter your names"
                  inputProps={{
                    onChangeText: text => setState({...state, names: text}),
                    value: state.names,
                  }}
                />
              </View>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: APP_COLORS.TEXT_GRAY,
                    fontWeight: '600',
                  }}>
                  Email address
                </Text>
                <CustomTextInput
                  placeHolder="Enter your email"
                  inputProps={{
                    onChangeText: text => setState({...state, email: text}),
                    value: state.email,
                    keyboardType: 'email-address',
                  }}
                />
              </View>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: APP_COLORS.TEXT_GRAY,
                    fontWeight: '600',
                  }}>
                  Phone Number
                </Text>
                <CustomPhoneInput
                  placeHolder="Enter your phone number"
                  onChangeText={(text: string) =>
                    setState({...state, phone: text})
                  }
                  value={state.phone}
                />
              </View>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: APP_COLORS.TEXT_GRAY,
                    fontWeight: '600',
                  }}>
                  ID/Passport Number
                </Text>
                <CustomTextInput
                  placeHolder="Enter your ID Number"
                  inputProps={{
                    onChangeText: text => setState({...state, idNumber: text}),
                    value: state.idNumber,
                    keyboardType: 'number-pad',
                  }}
                />
              </View>
              <Pressable
                style={{marginVertical: 10}}
                onPress={() => handleDocumentSelect()}>
                <View
                  style={{
                    ...commonInput,
                    backgroundColor: APP_COLORS.GREY_BUNKER,
                  }}>
                  <Text
                    style={{
                      color: APP_COLORS.WHITE,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                    {state.idNumberDocument === undefined
                      ? 'Upload ID/Passport Document (image or pdf)'
                      : 'Click to update selected ID/Passport Document'}
                  </Text>
                </View>
              </Pressable>
            </>
          )}
          {activeStep === REGISTER_STEPS_ENUM.SHOP_INFO && (
            <>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: APP_COLORS.TEXT_GRAY,
                    fontWeight: '600',
                  }}>
                  Shop name
                </Text>
                <CustomTextInput
                  placeHolder="Enter shop name"
                  inputProps={{
                    onChangeText: text => setState({...state, shopName: text}),
                    value: state.shopName,
                  }}
                />
              </View>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: APP_COLORS.TEXT_GRAY,
                    fontWeight: '600',
                  }}>
                  Shop address
                </Text>
                <CustomTextInput
                  placeHolder="Enter shop name"
                  inputProps={{
                    onChangeText: text =>
                      setState({...state, shopAddress: text}),
                    value: state.shopAddress,
                  }}
                />
              </View>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: APP_COLORS.TEXT_GRAY,
                    fontWeight: '600',
                  }}>
                  Shop category
                </Text>
                <Picker
                  selectedValue={state.shopCategoryId}
                  onValueChange={(itemValue, itemIndex) =>
                    setState({...state, shopCategoryId: itemValue})
                  }
                  style={commonInput}>
                  {[{name: 'Choose category', id: ''}, ...categories].map(
                    (category, i) => (
                      <Picker.Item
                        key={i}
                        label={category.name}
                        value={category.id}
                      />
                    ),
                  )}
                </Picker>
              </View>
              <View style={{marginVertical: 10}}>
                <View style={[viewFlexSpace]}>
                  <View>
                    <Text
                      style={{
                        color: APP_COLORS.TEXT_GRAY,
                        textAlign: 'center',
                        fontWeight: '600',
                      }}>
                      Open From
                    </Text>
                    <DatePicker
                      date={state.open}
                      mode="time"
                      style={{width: width / 2, marginRight: 5, marginTop: 10}}
                      onDateChange={date => setState({...state, open: date})}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: APP_COLORS.TEXT_GRAY,
                        textAlign: 'center',
                        fontWeight: '600',
                      }}>
                      Close From
                    </Text>
                    <DatePicker
                      date={state.close}
                      mode="time"
                      onDateChange={date => setState({...state, close: date})}
                      style={{width: width / 2, marginLeft: 5, marginTop: 10}}
                    />
                  </View>
                </View>
              </View>
            </>
          )}
          {activeStep === REGISTER_STEPS_ENUM.CREDENTIALS_INFO && (
            <>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: APP_COLORS.TEXT_GRAY,
                    fontWeight: '600',
                  }}>
                  Password
                </Text>
                <CustomTextInput
                  placeHolder="Enter your password"
                  inputProps={{
                    onChangeText: text => setState({...state, password: text}),
                    value: state.password,
                    secureTextEntry: true,
                  }}
                />
              </View>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: APP_COLORS.TEXT_GRAY,
                    fontWeight: '600',
                  }}>
                  Confirm Password
                </Text>
                <CustomTextInput
                  placeHolder="Re-enter your password"
                  inputProps={{
                    onChangeText: text =>
                      setState({...state, confirmPassword: text}),
                    value: state.confirmPassword,
                    secureTextEntry: true,
                  }}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Inputs;
