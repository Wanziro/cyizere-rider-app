import {View, Dimensions, StatusBar} from 'react-native';
import React, {useState, useEffect} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import {
  btnWithBgContainerStyles,
  btnWithBgTextStyles,
  btnWithoutBgContainerStyles,
  btnWithoutBgTextStyles,
  commonInput,
  viewFlexSpace,
} from '../../../constants/styles';

import {INavigationProp, TOAST_MESSAGE_TYPES} from '../../../../interfaces';
import {toastMessage} from '../../../helpers';
import {app} from '../../../constants/app';
import DocumentPicker from 'react-native-document-picker';
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
import {useDispatch} from 'react-redux';
import FullPageLoader from '../../../components/full-page-loader';
import Inputs from './inputs/inputs';
import StepsHeader from './steps-header';
import StepsFooter from './steps-footer';
import {fetchShopCategories} from '../../../actions/shopCategories';

export enum REGISTER_STEPS_ENUM {
  PERSONAL_INFO = 'PERSONAL_INFO',
  SHOP_INFO = 'SHOP_INFO',
  CREDENTIALS_INFO = 'CREDENTIALS_INFO',
}

interface IState {
  names: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  idNumber: string;
  idNumberDocument: any;
  shopName: string;
  shopAddress: string;
  shopCategoryId: string;
  open: any;
  close: any;
}

const {width} = Dimensions.get('window');
const initialState = {
  names: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  idNumber: '',
  idNumberDocument: undefined,
  //
  shopName: '',
  shopAddress: '',
  shopCategoryId: '',
  open: new Date(),
  close: new Date(),
};
const Register = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const [state, setState] = useState<IState>(initialState);
  const [activeStep, setActiveStep] = useState<REGISTER_STEPS_ENUM>(
    REGISTER_STEPS_ENUM.PERSONAL_INFO,
  );
  const [isLoading, setIsLoading] = useState(false);
  const validPhoneCode = ['8', '9', '2', '3'];
  const handleSubmit = () => {
    if (state.password.length <= 4) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Password must be greater than 4 characters.',
      );
      return;
    }
    if (state.password !== state.confirmPassword) {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'Passwords do not match');
      return;
    }
    const doc: any = {
      uri: state.idNumberDocument?.uri,
      type: state.idNumberDocument?.type,
      name: state.idNumberDocument?.name,
    };
    const formData = new FormData();
    formData.append('file', doc);
    formData.append('names', state.names);
    formData.append('email', state.email);
    formData.append('phone', '0' + state.phone);
    formData.append('password', state.password);
    formData.append('idNumber', state.idNumber);
    formData.append('shopName', state.shopName);
    formData.append('shopAddress', state.shopAddress);
    formData.append('shopCategoryId', state.shopCategoryId);
    formData.append(
      'open',
      new Date(state.open).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    );
    formData.append(
      'close',
      new Date(state.close).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    );
    setIsLoading(true);
    const url = app.BACKEND_URL + '/suppliers/register/';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = function () {
      setIsLoading(false);
      try {
        const response = JSON.parse(xhr.response);
        if (xhr.status === 201) {
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
            hasGift,
            token,
          } = response.supplier;
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
          toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, response.msg);
        } else {
          toastMessage(TOAST_MESSAGE_TYPES.ERROR, response.msg);
        }
      } catch (error) {
        toastMessage(TOAST_MESSAGE_TYPES.ERROR, xhr.response);
      }
    };
    xhr.send(formData);
  };

  const handleDocumentSelect = async () => {
    try {
      const results = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });
      setState({...state, idNumberDocument: results as any});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  useEffect(() => {
    dispatch(fetchShopCategories());
  }, []);

  const handleStepOneNext = () => {
    if (
      state.names.trim() === '' ||
      state.email.trim() === '' ||
      state.phone.trim() === ''
    ) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'All information on this step are required.',
      );
      return;
    }
    if (
      !validPhoneCode.includes(state.phone[1]) ||
      state.phone[0] !== '7' ||
      state.phone.length !== 9
    ) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Invalid phone number. please provide a valid MTN or AIRTEL-TIGO phone number.',
      );
      return;
    }
    if (state.idNumber.trim() === '' || state.idNumber.length < 16) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please enter a valid ID/Passport Number',
      );
      return;
    }
    if (state.idNumberDocument === undefined) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please upload your ID/Passport document so that we can be able to verify your identity',
      );
      return;
    }
    setActiveStep(REGISTER_STEPS_ENUM.SHOP_INFO);
  };

  const handleStepTwoNext = () => {
    if (
      state.shopName.trim() === '' ||
      state.shopAddress.trim() === '' ||
      state.shopCategoryId === ''
    ) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'All information on this step are required.',
      );
      return;
    }
    if (state.open == state.close) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please provide correct opening and closing hours.',
      );
      return;
    }
    setActiveStep(REGISTER_STEPS_ENUM.CREDENTIALS_INFO);
  };

  return (
    <View
      style={[
        viewFlexSpace,
        {
          flex: 1,
          backgroundColor: APP_COLORS.BACKGROUND_COLOR,
          flexDirection: 'column',
        },
      ]}>
      <StatusBar barStyle="light-content" />
      <StepsHeader activeStep={activeStep} />
      <View style={{flex: 1, width}}>
        <Inputs
          handleDocumentSelect={handleDocumentSelect}
          isLoading={isLoading}
          navigation={navigation}
          setState={setState}
          state={state}
          activeStep={activeStep}
        />
      </View>
      <StepsFooter
        handleStepTwoNext={handleStepTwoNext}
        handleStepOneNext={handleStepOneNext}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        handleSubmit={handleSubmit}
      />
      <FullPageLoader isLoading={isLoading} />
    </View>
  );
};

export default Register;
