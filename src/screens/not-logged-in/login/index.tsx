import {
  View,
  Text,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import {
  btnWithBgContainerStyles,
  btnWithBgTextStyles,
  btnWithoutBgContainerStyles,
  btnWithoutBgTextStyles,
  commonInput,
  viewFlexCenter,
  viewFlexSpace,
} from '../../../constants/styles';

import {INavigationProp, TOAST_MESSAGE_TYPES} from '../../../../interfaces';
import {errorHandler, toastMessage} from '../../../helpers';
import axios from 'axios';
import {app} from '../../../constants/app';
import {useDispatch} from 'react-redux';
import {
  setIsUserActive,
  setIsUserDisabled,
  setIsUserVerified,
  setUserEmail,
  setUserHasShop,
  setUserId,
  setUserIdNumber,
  setUserIdNumberDocument,
  setUserNames,
  setUserPhone,
  setUserShopAddress,
  setUserShopCategoryId,
  setUserShopClose,
  setUserShopImage,
  setUserShopLat,
  setUserShopLong,
  setUserShopName,
  setUserShopOpen,
  setUserToken,
  setUserVerificationMessage,
  setUserVerificationStatus,
} from '../../../actions/user';
import SubmitButton from '../../../components/submit-button';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FullPageLoader from '../../../components/full-page-loader';

const initialState = {
  emailOrPhone: '',
  password: '',
};
const Login = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (state.emailOrPhone.trim() === '' || state.password.trim() === '') {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'All fields are required');
      return;
    }
    setIsLoading(true);
    axios
      .post(app.BACKEND_URL + '/suppliers/login/', {...state})
      .then(res => {
        setIsLoading(false);
        const {
          supplierId,
          names,
          idNumber,
          idNumberDocument,
          email,
          phone,
          shopName,
          shopAddress,
          shopCategoryId,
          shopLat,
          shopLong,
          open,
          close,
          shopImage,
          isActive,
          isVerified,
          verificationStatus,
          verificationMessage,
          isDisabled,
          token,
          hasGift,
        } = res.data.supplier;
        dispatch(setUserId(supplierId));
        dispatch(setUserNames(names));
        dispatch(setUserPhone(phone));
        dispatch(setUserShopImage(shopImage));
        dispatch(setUserEmail(email));
        dispatch(setUserIdNumber(idNumber));
        dispatch(setUserIdNumberDocument(idNumberDocument));
        dispatch(setIsUserActive(isActive));
        dispatch(setIsUserDisabled(isDisabled));
        dispatch(setIsUserVerified(isVerified));
        dispatch(setUserVerificationStatus(verificationStatus));
        dispatch(setUserVerificationMessage(verificationMessage));
        //
        dispatch(setUserShopName(shopName));
        dispatch(setUserShopAddress(shopAddress));
        dispatch(setUserShopCategoryId(shopCategoryId));
        dispatch(setUserShopLat(shopLat));
        dispatch(setUserShopLong(shopLong));
        dispatch(setUserShopOpen(open));
        dispatch(setUserShopClose(close));
        dispatch(setUserHasShop(hasGift));
        //
        dispatch(setUserToken(token));
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
      })
      .catch(error => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: APP_COLORS.BACKGROUND_COLOR,
          paddingHorizontal: 15,
        }}>
        <Image
          source={require('../../../assets/logo.png')}
          style={{width: 150, height: 150}}
          resizeMode="contain"
        />
        <View style={{marginTop: 20}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: APP_COLORS.ORANGE,
            }}>
            Supplier App
          </Text>
        </View>
        <View style={{width: '90%', marginTop: 40}}>
          <View style={{marginVertical: 10}}>
            <Text style={{color: APP_COLORS.FOOTER_BODY_TEXT_COLOR}}>
              Email address or phone
            </Text>
            <TextInput
              placeholderTextColor={APP_COLORS.GRAY}
              style={{
                backgroundColor: APP_COLORS.WHITE,
                marginTop: 10,
                borderRadius: 5,
                padding: 10,
                borderWidth: 1,
                borderColor: APP_COLORS.BORDER_COLOR,
              }}
              placeholder="example@gmail.com"
              onChangeText={text => setState({...state, emailOrPhone: text})}
              value={state.emailOrPhone}
            />
          </View>
          <View style={{marginVertical: 10}}>
            <Text style={{color: APP_COLORS.FOOTER_BODY_TEXT_COLOR}}>
              Password
            </Text>
            <TextInput
              placeholderTextColor={APP_COLORS.GRAY}
              style={{
                backgroundColor: APP_COLORS.WHITE,
                marginTop: 10,
                borderRadius: 5,
                padding: 10,
                borderWidth: 1,
                borderColor: APP_COLORS.BORDER_COLOR,
              }}
              secureTextEntry
              placeholder="Enter your password"
              onChangeText={text => setState({...state, password: text})}
              value={state.password}
            />
          </View>
          <SubmitButton
            title="Login"
            buttonProps={{onPress: () => handleSubmit()}}
          />
          <View style={{marginTop: 10}}>
            <Text style={{color: APP_COLORS.BLACK, textAlign: 'center'}}>
              or
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text
                style={{
                  color: APP_COLORS.BLACK,
                  textAlign: 'center',
                  marginTop: 15,
                  textDecorationLine: 'underline',
                }}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <FullPageLoader isLoading={isLoading} />
    </KeyboardAvoidingView>
  );
};

export default Login;
