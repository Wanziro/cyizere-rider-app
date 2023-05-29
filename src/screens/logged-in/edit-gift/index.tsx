import {View, KeyboardAvoidingView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import StepIndicator from 'react-native-step-indicator';
import GiftDetails from './gift-details';
import GiftProducts from './gift-products';
import PackagingOptions from './packaging-options';
import {
  IGift,
  INavigationProp,
  INavigationPropWithRouteRequired,
  IPackagingOption,
  IProduct,
  TOAST_MESSAGE_TYPES,
} from '../../../../interfaces';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProducts} from '../../../actions/products';
import {fetchPackagingOptions} from '../../../actions/packagingOptions';
import {
  normalAlert,
  returnErroMessage,
  setHeaders,
  toastMessage,
} from '../../../helpers';
import {app} from '../../../constants/app';
import {RootState} from '../../../reducers';
import FullPageLoader from '../../../components/full-page-loader';
import {fetchGifts} from '../../../actions/gifts';
import axios from 'axios';

export enum ADD_GIFT_STEPS_ENUM {
  GIFT_DETAILS = 'GIFT_DETAILS',
  GIFT_PRODUCTS = 'GIFT_PRODUCTS',
  GIFT_PACKAGING_OPTIONS = 'GIFT_PACKAGING_OPTIONS',
}

export interface IGiftState {
  name: string;
  description: string;
  packagingOptions: IPackagingOption[];
  products: IProduct[];
  image: any;
}

const initialState: IGiftState = {
  name: '',
  description: '',
  packagingOptions: [],
  products: [],
  image: null,
};
const EditGift = ({navigation, route}: INavigationPropWithRouteRequired) => {
  const dispatch = useDispatch();
  const {token} = useSelector((state: RootState) => state.user);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [activeStep, setActiveStep] = useState(
    ADD_GIFT_STEPS_ENUM.GIFT_DETAILS,
  );
  const [state, setState] = useState<IGiftState>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {gift} = route.params as {gift: IGift};

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchPackagingOptions());

    if (gift) {
      setState(gift as any);
    }
  }, []);

  useEffect(() => {
    if (activeStep === ADD_GIFT_STEPS_ENUM.GIFT_DETAILS) {
      setCurrentPosition(0);
      return;
    }
    if (activeStep === ADD_GIFT_STEPS_ENUM.GIFT_PRODUCTS) {
      setCurrentPosition(1);
      return;
    }
    if (activeStep === ADD_GIFT_STEPS_ENUM.GIFT_PACKAGING_OPTIONS) {
      setCurrentPosition(2);
      return;
    }
  }, [activeStep]);

  const handleStepPress = (position: number) => {
    if (position < currentPosition) {
      if (position === 0) {
        setActiveStep(ADD_GIFT_STEPS_ENUM.GIFT_DETAILS);
        return;
      }
      if (position === 1) {
        setActiveStep(ADD_GIFT_STEPS_ENUM.GIFT_PRODUCTS);
        return;
      }
    }
  };

  const handleSubmit = () => {
    if (state.name.trim() === '') {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'Please provide gift name');
      return;
    }
    if (state.description.trim() === '') {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please provide gift description',
      );
      return;
    }
    if (state.image === null) {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'Please provide gift image');
      return;
    }
    if (state.products.length === 0) {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'Please specify gift products');
      return;
    }
    if (state.packagingOptions.length === 0) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please specify gift packaging options',
      );
      return;
    }
    normalAlert({
      message:
        'Do you want to update this gift? Please make sure that you have checked each step details',
      hasCancleBtn: true,
      cancelText: 'No',
      okText: 'Yes, Update',
      okHandler: handleSave,
    });
  };

  const handleSave = () => {
    const doc: any = {
      uri: state.image?.uri,
      type: state.image?.type,
      name: state.image?.name,
    };

    const packagingOptions = state.packagingOptions.map(item => ({
      id: item.id,
      supplierId: item.supplierId,
    }));

    const products = state.products.map(item => ({
      pId: item.pId,
      supplierId: item.supplierId,
    }));

    setIsLoading(true);
    axios
      .put(
        app.BACKEND_URL + '/gifts/',
        {
          ...state,
          packagingOptions: JSON.stringify(packagingOptions),
          products: JSON.stringify(products),
        },
        setHeaders(token),
      )
      .then(res => {
        setIsLoading(false);
        normalAlert({
          message: res.data.msg,
          okHandler: () => navigation.goBack(),
          cancelHandler: () => navigation.goBack(),
        });
      })
      .catch(error => {
        setIsLoading(false);
        const err = returnErroMessage(error);
        normalAlert({
          message: err,
          hasCancleBtn: true,
          cancelText: 'close',
          okHandler: handleSave,
          okText: 'Try Again',
        });
      });
  };

  const labels = ['Gift Details', 'Gift Products', 'Packaging Options'];
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013',
  };
  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: APP_COLORS.BACKGROUND_COLOR,
          paddingHorizontal: 10,
          paddingTop: 10,
        }}>
        <StepIndicator
          customStyles={{...customStyles}}
          currentPosition={currentPosition}
          labels={labels}
          stepCount={3}
          onPress={position => handleStepPress(position)}
        />
        {activeStep === ADD_GIFT_STEPS_ENUM.GIFT_DETAILS && (
          <GiftDetails
            setActiveStep={setActiveStep}
            state={state}
            setState={setState}
          />
        )}
        {activeStep === ADD_GIFT_STEPS_ENUM.GIFT_PRODUCTS && (
          <GiftProducts
            setActiveStep={setActiveStep}
            state={state}
            setState={setState}
          />
        )}
        {activeStep === ADD_GIFT_STEPS_ENUM.GIFT_PACKAGING_OPTIONS && (
          <PackagingOptions
            setActiveStep={setActiveStep}
            state={state}
            setState={setState}
            handleSubmit={handleSubmit}
          />
        )}
      </View>
      <FullPageLoader isLoading={isLoading} />
    </KeyboardAvoidingView>
  );
};

export default EditGift;
