import {
  View,
  Text,
  RefreshControl,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  INavigationProp,
  INavigationPropWithRouteRequired,
  IOrder,
  ISupplierPaymentDetail,
  PAYMENT_STATUS_ENUM,
  TOAST_MESSAGE_TYPES,
} from '../../../../interfaces';
import {APP_COLORS} from '../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {
  fetchSuppliersPaymentDetails,
  setIsHardReloadingSuppliersPaymentDetails,
} from '../../../actions/suppliersPaymentDetails';
import CustomAlert from '../../../components/custom-alert';
import {
  btnWithBgContainerStyles,
  btnWithBgTextStyles,
  viewFlexCenter,
  viewFlexSpace,
} from '../../../constants/styles';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {
  currencyFormatter,
  returnErroMessage,
  setHeaders,
  toastMessage,
} from '../../../helpers';
import FullPageLoader from '../../../components/full-page-loader';
import axios from 'axios';
import {app} from '../../../constants/app';
import CustomErrorAlert from '../../../components/custom-error-alert';
import Loader from '../orders/loader';

interface IPaymentItemProps extends INavigationProp {
  item: ISupplierPaymentDetail;
  order: IOrder;
  handleDelete: any;
}
const PaymentItem = ({
  item,
  handleDelete,
  navigation,
  order,
}: IPaymentItemProps) => {
  return (
    <View
      style={{
        borderBottomColor: APP_COLORS.BORDER_COLOR,
        borderBottomWidth: 1,
        padding: 10,
      }}>
      <View style={[viewFlexSpace]}>
        <View style={{flex: 1}}>
          <Text
            style={{
              color: APP_COLORS.BLACK,
              textTransform: 'uppercase',
              fontWeight: '600',
            }}>
            {item.supplierNames} - CODE:{item.supplierMOMOCode}
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            Amount: {currencyFormatter(item.totalAmount)} RWF
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            Status: {item.paymentStatus}
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {new Date(item.updatedAt).toUTCString()}
          </Text>
          {item.paymentStatus === PAYMENT_STATUS_ENUM.FAILED && (
            <>
              <Text style={{color: APP_COLORS.BLACK}}>Failure Reason:</Text>
              <Text
                style={{
                  color: APP_COLORS.ORANGE,
                  textDecorationColor: APP_COLORS.ORANGE,
                }}>
                {item.failureReason}
              </Text>
            </>
          )}
          {item.paymentStatus === PAYMENT_STATUS_ENUM.SUCCESS && (
            <Pressable
              style={{marginTop: 10}}
              onPress={() =>
                navigation.navigate('PaymentProof', {
                  order,
                  paymentDetails: item,
                })
              }>
              <View>
                <Text
                  style={{
                    color: APP_COLORS.ORANGE,
                    textDecorationStyle: 'solid',
                    textDecorationColor: APP_COLORS.ORANGE,
                    textDecorationLine: 'underline',
                  }}>
                  View Payment Proof
                </Text>
              </View>
            </Pressable>
          )}
          {item.paymentStatus === PAYMENT_STATUS_ENUM.FAILED && (
            <Pressable
              style={{marginTop: 10}}
              onPress={() => handleDelete(item)}>
              <View>
                <Text
                  style={{
                    color: APP_COLORS.ORANGE,
                    textDecorationStyle: 'solid',
                    textDecorationColor: APP_COLORS.ORANGE,
                    textDecorationLine: 'underline',
                  }}>
                  Delete & Add Correct Supplier
                </Text>
              </View>
            </Pressable>
          )}
        </View>
        <View>
          {item.paymentStatus === PAYMENT_STATUS_ENUM.PENDING && (
            <ActivityIndicator size={30} color={APP_COLORS.ORANGE} />
          )}
          {item.paymentStatus === PAYMENT_STATUS_ENUM.FAILED && (
            <Icon2 name="sms-failed" color={APP_COLORS.ORANGE} size={30} />
          )}
          {item.paymentStatus === PAYMENT_STATUS_ENUM.SUCCESS && (
            <Icon name="checkcircle" color={APP_COLORS.ORANGE} size={30} />
          )}
        </View>
      </View>
    </View>
  );
};

const PaymentDetails = ({
  navigation,
  route,
}: INavigationPropWithRouteRequired) => {
  const dispatch = useDispatch();
  const {order} = route.params as {order: IOrder};
  const {paymentDetails, isLoading, hardReloading, loadingError} = useSelector(
    (state: RootState) => state.suppliersPaymentDetails,
  );
  const {token} = useSelector((state: RootState) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showErrorAlert, setErrorShowAlert] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const alertCallBack = () => {
    setShowAlert(false);
    dispatch(fetchSuppliersPaymentDetails());
  };

  useEffect(() => {
    dispatch(fetchSuppliersPaymentDetails());
  }, []);

  useEffect(() => {
    let sub = true;
    if (sub) {
      loadingError.trim().length > 0 &&
        paymentDetails.length === 0 &&
        setShowAlert(true);
    }
    return () => {
      sub = false;
    };
  }, [loadingError]);

  useEffect(() => {
    let sub = true;
    if (sub) {
      !isLoading && refreshing && setRefreshing(false);
    }
    return () => {
      sub = false;
    };
  }, [isLoading]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(setIsHardReloadingSuppliersPaymentDetails(true));
    dispatch(fetchSuppliersPaymentDetails());
  };

  const handleDelete = (details: ISupplierPaymentDetail) => {
    setIsSubmitting(true);
    axios
      .delete(app.BACKEND_URL + '/suppliers/' + details.id, setHeaders(token))
      .then(res => {
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
        dispatch(fetchSuppliersPaymentDetails());
        setTimeout(() => {
          setIsSubmitting(false);
          navigation.navigate('AddSupplier', {order});
        }, 1000);
      })
      .catch(error => {
        const err = returnErroMessage(error);
        setIsSubmitting(false);
        setErrorMessage(err);
        setErrorShowAlert(false);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: APP_COLORS.WHITE, padding: 10}}>
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}>
          {paymentDetails
            .filter(item => item.orderId == order.id)
            .map((item, index) => (
              <PaymentItem
                key={index}
                item={item}
                handleDelete={handleDelete}
                navigation={navigation}
                order={order}
              />
            ))}
          {!order.areAllSuppliersPaid && (
            <View style={{marginHorizontal: 80, marginVertical: 15}}>
              <Pressable
                onPress={() => navigation.navigate('AddSupplier', {order})}>
                <View style={[btnWithBgContainerStyles]}>
                  <Text style={[btnWithBgTextStyles]}>
                    <Icon name="plus" color={APP_COLORS.WHITE} size={20} />
                    Add Supplier
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
        </ScrollView>
      )}

      <CustomAlert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        confirmationTitle="Try Again"
        hasCloseButton={false}
        callBack={alertCallBack}>
        <View style={[viewFlexCenter]}>
          <FastImage
            source={require('../../../assets/error-black.gif')}
            style={{width: 120, height: 120}}
          />
          <Text
            style={{
              color: APP_COLORS.ORANGE,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Something Went Wrong
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>{loadingError}</Text>
        </View>
      </CustomAlert>
      <CustomErrorAlert
        showAlert={showErrorAlert}
        setShowAlert={setErrorShowAlert}>
        <Text style={{color: APP_COLORS.ORANGE, textAlign: 'center'}}>
          {errorMessage}
        </Text>
      </CustomErrorAlert>
      <FullPageLoader isLoading={isSubmitting} />
    </View>
  );
};

export default PaymentDetails;
