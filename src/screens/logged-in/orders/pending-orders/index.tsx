import {View, ScrollView, RefreshControl, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APP_COLORS} from '../../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import Loader from '../loader';
import {
  DELIVERY_STATUS_ENUM,
  INavigationProp,
  IOrder,
} from '../../../../../interfaces';
import NotFound from '../../../../components/not-found';
import Item from './item';
import {fetchOrders} from '../../../../actions/orders';
import CustomModal from '../../../../components/custom-modal';
import {viewFlexCenter, viewFlexSpace} from '../../../../constants/styles';
import CustomTextInput from '../../../../components/custom-text-input';
import SubmitButton from '../../../../components/submit-button';
import Icon from 'react-native-vector-icons/AntDesign';
import {normalAlert, returnErroMessage, setHeaders} from '../../../../helpers';
import FullPageLoader from '../../../../components/full-page-loader';
import axios from 'axios';
import {app} from '../../../../constants/app';
import {fetchNotifications} from '../../../../actions/notifications';
import {fetchProductPrices} from '../../../../actions/productPrices';
import {fetchProducts} from '../../../../actions/products';
import NotVerified from '../../../../components/not-verified';

const PendingOrders = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const {riderId, token, isVerified} = useSelector(
    (state: RootState) => state.user,
  );
  const {orders, isLoading} = useSelector((state: RootState) => state.orders);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedItem, setSelectedItem] = useState<IOrder | undefined>(
    undefined,
  );
  const [showCodeModel, setShowCodeModel] = useState(false);
  const [deliveryCode, setDeliveryCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isVerified) {
      dispatch(fetchOrders());
      dispatch(fetchProductPrices());
      dispatch(fetchProducts());
    }
  }, []);

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
    dispatch(fetchOrders());
    dispatch(fetchProductPrices());
    dispatch(fetchProducts());
  };

  const handleFinishOrder = () => {
    if (selectedItem === undefined) {
      return;
    }
    if (deliveryCode.trim().length === 0) {
      normalAlert({message: 'Please provide delivery code.'});
      return;
    }
    setShowCodeModel(false);
    setIsSubmitting(true);
    axios
      .post(
        app.BACKEND_URL + '/orders/riders/finish',
        {orderId: selectedItem.id, deliveryCode},
        setHeaders(token),
      )
      .then(res => {
        setIsSubmitting(false);
        normalAlert({message: res.data.msg});
        dispatch(fetchOrders());
        dispatch(fetchNotifications());
      })
      .catch(error => {
        const msg = returnErroMessage(error);
        setIsSubmitting(false);
        setShowCodeModel(true);
        normalAlert({
          message: msg,
          hasCancleBtn: true,
          cancelText: 'close',
          cancelHandler: () => {
            setSelectedItem(undefined);
            setShowCodeModel(false);
            setDeliveryCode('');
          },
          okHandler: handleFinishOrder,
          okText: 'Try Again',
        });
      });
  };

  return (
    <>
      {!isVerified ? (
        <NotVerified navigation={navigation} />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: APP_COLORS.BACKGROUND_COLOR,
            paddingHorizontal: 10,
            paddingVertical: 20,
          }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={{flex: 1}}>
              {isLoading && orders.length === 0 ? (
                <Loader />
              ) : orders.filter(
                  item =>
                    item.deliveryStatus === DELIVERY_STATUS_ENUM.PENDING &&
                    item.riderId === riderId,
                ).length > 0 ? (
                orders
                  .filter(
                    item =>
                      item.deliveryStatus === DELIVERY_STATUS_ENUM.PENDING &&
                      item.riderId === riderId,
                  )
                  .map((item, index) => (
                    <Item
                      item={item}
                      key={index}
                      navigation={navigation}
                      setSelectedItem={setSelectedItem}
                      setShowCodeModel={setShowCodeModel}
                    />
                  ))
              ) : (
                <NotFound title="You don't have any pending order" />
              )}
              <CustomModal isVisible={showCodeModel}>
                <View style={[viewFlexCenter]}>
                  <Text
                    style={{
                      color: APP_COLORS.ORANGE,
                      fontWeight: '600',
                      fontSize: 16,
                    }}>
                    Finish Delivery for order #{selectedItem?.id}
                  </Text>
                  <View style={{width: '100%', marginVertical: 20}}>
                    <View
                      style={[
                        viewFlexSpace,
                        {
                          backgroundColor: APP_COLORS.GREY_BUNKER,
                          padding: 10,
                          marginBottom: 10,
                          opacity: 0.7,
                        },
                      ]}>
                      <Icon
                        name="exclamationcircle"
                        size={20}
                        color={APP_COLORS.WHITE}
                      />
                      <Text
                        style={{
                          color: APP_COLORS.WHITE,
                          flex: 1,
                          marginLeft: 10,
                        }}>
                        Please ask {selectedItem?.client.names} to provide
                        delivery code
                      </Text>
                    </View>
                    <Text style={{color: APP_COLORS.BLACK}}>
                      Delivery Code:
                    </Text>
                    <CustomTextInput
                      placeHolder="Enter delivery code"
                      inputProps={{
                        value: deliveryCode,
                        onChangeText: txt => setDeliveryCode(txt),
                      }}
                    />
                  </View>
                  <View style={{width: '100%'}}>
                    <SubmitButton
                      title="Finish"
                      buttonProps={{
                        onPress: () =>
                          normalAlert({
                            message:
                              'Do you want to finish delivery process for this order?',
                            cancelText: 'No',
                            cancelHandler: () => {
                              setShowCodeModel(false);
                              setSelectedItem(undefined);
                              setDeliveryCode('');
                            },
                            hasCancleBtn: true,
                            okText: 'Yes, FInish',
                            okHandler: handleFinishOrder,
                          }),
                      }}
                    />
                    <SubmitButton
                      title="Close"
                      containerStyle={{backgroundColor: APP_COLORS.OXFORD_BLUE}}
                      buttonProps={{
                        onPress: () => {
                          setShowCodeModel(false);
                          setSelectedItem(undefined);
                          setDeliveryCode('');
                        },
                      }}
                    />
                  </View>
                </View>
              </CustomModal>
              <FullPageLoader isLoading={isSubmitting} />
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default PendingOrders;
