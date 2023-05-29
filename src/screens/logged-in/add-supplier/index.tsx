import {View, Text, KeyboardAvoidingView, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import {
  ICartItem,
  INavigationPropWithRouteRequired,
  IOrder,
} from '../../../../interfaces';
import FullPageLoader from '../../../components/full-page-loader';
import {TextInput} from 'react-native';
import {
  btnWithBgContainerStyles,
  btnWithBgTextStyles,
  commonInput,
  viewFlexCenter,
} from '../../../constants/styles';
import Products from './products';
import {
  currencyFormatter,
  returnErroMessage,
  setHeaders,
} from '../../../helpers';
import CustomErrorAlert from '../../../components/custom-error-alert';
import CustomAlert from '../../../components/custom-alert';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {app} from '../../../constants/app';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import FastImage from 'react-native-fast-image';
import {fetchSuppliersPaymentDetails} from '../../../actions/suppliersPaymentDetails';

export interface IAddSupplierState {
  marketId: number;
  orderId: number;
  productsList: ICartItem[];
  supplierMOMOCode: any;
  supplierNames: string;
}
const initialState: IAddSupplierState = {
  marketId: '' as any,
  orderId: '' as any,
  productsList: [],
  supplierMOMOCode: '',
  supplierNames: '',
};
const AddSupplier = ({navigation, route}: INavigationPropWithRouteRequired) => {
  const dispatch = useDispatch();
  const {token} = useSelector((state: RootState) => state.user);
  const suppliersPaymentDetails = useSelector(
    (state: RootState) => state.suppliersPaymentDetails,
  );
  const {order} = route.params as {order: IOrder};
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [state, setState] = useState<IAddSupplierState>(initialState);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [showComfirmAlert, setShowComfirmAlert] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (successMessage.trim() === '') {
      if (isLoading) {
        setIsLoading(true);
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }
  }, [suppliersPaymentDetails.isLoading]);

  useEffect(() => {
    if (state.productsList.length === 0) {
      setTotalAmount(0);
    } else {
      let sum = 0;
      for (let i = 0; i < state.productsList.length; i++) {
        sum += state.productsList[i].price * state.productsList[i].quantity;
      }
      setTotalAmount(sum);
    }
  }, [state.productsList]);

  const handleSubmit = () => {
    if (state.supplierNames.trim() === '') {
      setErrorMessage(
        'Please provide the name of the supplier. NB: Make sure that the name you write matches the on registered on MOMO code.',
      );
      setShowErrorAlert(true);
      return;
    }
    if (state.supplierMOMOCode.trim() === '') {
      setErrorMessage('Please provide MOMO code for this supplier.');
      setShowErrorAlert(true);
      return;
    }
    if (state.productsList.length === 0) {
      setErrorMessage(
        'Please select products that you are going to buy from ' +
          state.supplierNames,
      );
      setShowErrorAlert(true);
      return;
    }
    setShowComfirmAlert(true);
  };

  const callBack = () => {
    setShowComfirmAlert(false);
    setIsLoading(true);
    axios
      .post(
        app.BACKEND_URL + '/suppliers',
        {...state, marketId: order.marketId, orderId: order.id},
        setHeaders(token),
      )
      .then(res => {
        setTimeout(() => {
          setIsLoading(false);
          setSuccessMessage(res.data.msg);
          setShowSuccessAlert(true);
        }, 1000);
      })
      .catch(error => {
        setTimeout(() => {
          const erro = returnErroMessage(error);
          setIsLoading(false);
          setErrorMessage(erro);
          setShowErrorAlert(true);
        }, 1000);
      });
  };

  const handleContinue = () => {
    setShowSuccessAlert(false);
    dispatch(fetchSuppliersPaymentDetails());
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: APP_COLORS.WHITE, padding: 10}}>
        <View style={{marginVertical: 10}}>
          <Text style={{color: APP_COLORS.BLACK}}>
            Supplier Names (Registered MOMO code names)
          </Text>
          <TextInput
            placeholderTextColor={APP_COLORS.GRAY}
            onChangeText={(text: string) =>
              setState({...state, supplierNames: text})
            }
            value={state.supplierNames}
            placeholder="Enter supplier names"
            style={commonInput}
          />
        </View>
        <View style={{marginVertical: 10}}>
          <Text style={{color: APP_COLORS.BLACK}}>MOMO CODE</Text>
          <TextInput
            placeholderTextColor={APP_COLORS.GRAY}
            onChangeText={(text: string) =>
              setState({...state, supplierMOMOCode: text})
            }
            value={state.supplierMOMOCode}
            placeholder="Enter supplier's MOMO Code ex: 123456"
            style={commonInput}
            keyboardType="number-pad"
          />
        </View>
        <View style={{marginVertical: 10}}>
          <Pressable onPress={() => setShowModal(true)}>
            <View
              style={{
                backgroundColor: APP_COLORS.BORDER_COLOR,
                padding: 15,
                borderRadius: 5,
                borderColor: APP_COLORS.ORANGE,
                borderWidth: 1,
              }}>
              <Text style={{color: APP_COLORS.BLACK, textAlign: 'center'}}>
                {state.productsList.length > 0
                  ? 'Check/Modify Selected Products'
                  : 'Select Products From This Supplier'}
              </Text>
            </View>
          </Pressable>
        </View>
        <View style={{marginVertical: 10}}>
          <Text style={{color: APP_COLORS.BLACK, textAlign: 'center'}}>
            Selected Products: {state.productsList.length}
          </Text>
          <Text
            style={{
              color: APP_COLORS.BLACK,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            Total Amount: {currencyFormatter(totalAmount)} RWF
          </Text>
        </View>
        <View style={{marginVertical: 10}}>
          <Pressable onPress={() => handleSubmit()}>
            <View style={[btnWithBgContainerStyles]}>
              <Text style={[btnWithBgTextStyles]}>Initiate Payment</Text>
            </View>
          </Pressable>
        </View>
        <CustomErrorAlert
          showAlert={showErrorAlert}
          setShowAlert={setShowErrorAlert}>
          <Text style={{color: APP_COLORS.ORANGE, textAlign: 'center'}}>
            {errorMessage}
          </Text>
        </CustomErrorAlert>
        <CustomAlert
          setShowAlert={setShowComfirmAlert}
          showAlert={showComfirmAlert}
          confirmationTitle="Yes, Pay"
          callBack={callBack}>
          <View style={[viewFlexCenter]}>
            <Icon name="infocirlce" size={50} color={APP_COLORS.ORANGE} />
            <Text
              style={{
                marginTop: 10,
                textAlign: 'center',
                color: APP_COLORS.ORANGE,
                fontWeight: '600',
              }}>
              Are you sure that you want to initiate a payment of{' '}
              {currencyFormatter(totalAmount)} RWF to {state.supplierNames}?
            </Text>
            <Text
              style={{
                color: APP_COLORS.TEXT_GRAY,
                marginTop: 10,
                textAlign: 'center',
              }}>
              Please , make sure that you have double checked and selected all
              the products that you are going to buy from this supplier.
            </Text>
          </View>
        </CustomAlert>
        <CustomAlert
          setShowAlert={setShowSuccessAlert}
          showAlert={showSuccessAlert}
          hasCloseButton={false}
          confirmationTitle="Continue"
          callBack={handleContinue}>
          <View style={[viewFlexCenter]}>
            <FastImage
              source={require('../../../assets/success.gif')}
              style={{width: 120, height: 120}}
            />
            <Text style={{color: APP_COLORS.BLACK}}>{successMessage}</Text>
          </View>
        </CustomAlert>
        <FullPageLoader isLoading={isLoading} />
        <Products
          setShowModal={setShowModal}
          showModal={showModal}
          state={state}
          setState={setState}
          order={order}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddSupplier;
