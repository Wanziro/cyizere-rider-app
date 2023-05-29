import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchProductPrices,
  setAddOrUpdateProductPrice,
  setDeleteProductPrice,
} from '../../../actions/productPrices';
import {RootState} from '../../../reducers';
import {
  INavigationPropWithRouteRequired,
  IProduct,
  IProductPrice,
  TOAST_MESSAGE_TYPES,
} from '../../../../interfaces';
import {viewFlexCenter, viewFlexSpace} from '../../../constants/styles';
import SubmitButton from '../../../components/submit-button';
import CustomModal from '../../../components/custom-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import DisabledInput from '../../../components/disabled-input';
import {
  currencyFormatter,
  normalAlert,
  returnErroMessage,
  setHeaders,
  toastMessage,
} from '../../../helpers';
import FullPageLoader from '../../../components/full-page-loader';
import axios from 'axios';
import {app} from '../../../constants/app';

const initialState = {
  name: '',
  amount: '',
};
const ProductPrices = ({
  navigation,
  route,
}: INavigationPropWithRouteRequired) => {
  const dispatch = useDispatch();
  const {product} = route.params as {product: IProduct};
  const {prices} = useSelector((state: RootState) => state.productPrices);
  const {token} = useSelector((state: RootState) => state.user);
  const [productPrices, setProductPrices] = useState<IProductPrice[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProductPrices());
  }, []);

  useEffect(() => {
    let sub = true;
    if (sub) {
      setProductPrices(prices.filter(item => item.productId === product?.pId));
    }
    return () => {
      sub = false;
    };
  }, [prices, product]);

  const handleSave = () => {
    if (state.name.trim() === '') {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please provide name for your price',
      );
      return;
    }
    if (state.name.trim() === '') {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please provide amount your specified price name',
      );
      return;
    }
    setIsSubmitting(true);
    axios
      .post(
        app.BACKEND_URL + '/products/prices',
        {
          ...state,
          productId: product.pId,
        },
        setHeaders(token),
      )
      .then(res => {
        setState(initialState);
        setIsSubmitting(false);
        setShowModal(false);
        dispatch(setAddOrUpdateProductPrice(res.data.price));
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
      })
      .catch(error => {
        setIsSubmitting(false);
        const err = returnErroMessage(error);
        normalAlert({message: err});
      });
  };

  const handleDeletePrice = (price: IProductPrice) => {
    setIsLoading(true);
    axios
      .delete(
        app.BACKEND_URL + '/products/prices/' + price.ppId,
        setHeaders(token),
      )
      .then(res => {
        setState(initialState);
        setIsLoading(false);
        dispatch(setDeleteProductPrice({...price}));
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
      })
      .catch(error => {
        setIsLoading(false);
        const err = returnErroMessage(error);
        normalAlert({message: err});
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: APP_COLORS.BACKGROUND_COLOR,
      }}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View>
          {productPrices.length === 0 && (
            <Text
              style={{color: APP_COLORS.FOOTER_BODY_TEXT_COLOR, padding: 10}}>
              No prices added yet. because of this reason, clients can not be
              able to buy this product from your shop right now.
            </Text>
          )}
          {productPrices.map((item, position) => (
            <View
              style={[
                viewFlexSpace,
                {
                  padding: 10,
                  borderBottomColor: APP_COLORS.BORDER_COLOR,
                  borderBottomWidth: 1,
                },
              ]}
              key={position}>
              <View>
                <Text style={{color: APP_COLORS.BLACK}}>{item.name}</Text>
                <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                  {currencyFormatter(item.amount)} RWF
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  normalAlert({
                    message: 'Do you want to delete this price? ' + item.name,
                    cancelText: 'No',
                    hasCancleBtn: true,
                    okHandler: () => handleDeletePrice(item),
                    okText: 'Yes , Delete',
                  })
                }>
                <Icon name="close" size={25} color={APP_COLORS.BLACK} />
              </TouchableOpacity>
            </View>
          ))}

          <View style={[viewFlexCenter, {marginTop: 15}]}>
            <SubmitButton
              title="Add Price"
              buttonProps={{onPress: () => setShowModal(true)}}
            />
          </View>
        </View>
      </ScrollView>
      <CustomModal isVisible={showModal}>
        <View style={[viewFlexSpace, {marginBottom: 10}]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Add New Price
          </Text>
          {!isSubmitting && (
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Icon name="close" size={25} color={APP_COLORS.BLACK} />
            </TouchableOpacity>
          )}
        </View>
        <DisabledInput
          value={state.name}
          onChangeText={(text: string) => {
            setState({...state, name: text});
          }}
          placeholder="Price Name ex: kg"
        />
        <View style={{marginVertical: 10}}>
          <DisabledInput
            value={state.amount}
            onChangeText={(text: string) => {
              setState({...state, amount: text});
            }}
            placeholder="Enter Amount"
            inputProps={{keyboardType: 'number-pad'}}
          />
        </View>
        <SubmitButton
          buttonProps={{
            onPress: () =>
              normalAlert({
                message: 'Save this price?',
                hasCancleBtn: true,
                cancelText: 'No',
                okText: 'yes , Save',
                okHandler: handleSave,
              }),
          }}
          titleComponent={
            <View style={[viewFlexCenter]}>
              {isSubmitting && (
                <ActivityIndicator size={20} color={APP_COLORS.WHITE} />
              )}
              <Text style={{color: APP_COLORS.WHITE}}>Submit</Text>
            </View>
          }
        />
      </CustomModal>
      <FullPageLoader isLoading={isLoading} />
    </View>
  );
};

export default ProductPrices;
