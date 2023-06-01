import {View, Text, ScrollView, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  DELIVERY_STATUS_ENUM,
  INavigationPropWithRouteRequired,
  IOrder,
  PAYMENT_STATUS_ENUM,
  orderTypesEnum,
} from '../../../../interfaces';
import {APP_COLORS} from '../../../constants/colors';
import {viewFlexCenter, viewFlexSpace} from '../../../constants/styles';
import Icon from 'react-native-vector-icons/Entypo';
import Item from './item';
import {
  currencyFormatter,
  normalAlert,
  returnErroMessage,
  setHeaders,
} from '../../../helpers';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import SubmitButton from '../../../components/submit-button';
import CustomModal from '../../../components/custom-modal';
import axios from 'axios';
import {app} from '../../../constants/app';
import {fetchNotifications} from '../../../actions/notifications';
import FullPageLoader from '../../../components/full-page-loader';

const OrderPreview = ({
  navigation,
  route,
}: INavigationPropWithRouteRequired) => {
  const dispatch = useDispatch();
  const {order} = route.params as {order: IOrder};
  const [orderToUse, setOrderToUse] = useState<IOrder | undefined>(undefined);
  const {orders} = useSelector((state: RootState) => state.orders);
  const {token, riderId} = useSelector((state: RootState) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [showAcceptOrder, setShowAcceptOrder] = useState(false);

  useEffect(() => {
    let sub = true;
    if (sub) {
      const od = orders.find(item => item.id == order.id);
      if (od) {
        setOrderToUse(od);
      } else {
        setOrderToUse(order);
      }
    }
    return () => {
      sub = false;
    };
  }, [orders]);

  const handleAcceptRequest = () => {
    setShowAcceptOrder(false);
    setIsLoading(true);
    axios
      .post(
        app.BACKEND_URL + '/orders/riders/accept/',
        {orderId: order.id},
        setHeaders(token),
      )
      .then(res => {
        setIsLoading(false);
        dispatch(fetchNotifications());
        normalAlert({
          message: res.data.msg,
          okHandler: () => navigation.goBack(),
          cancelHandler: () => navigation.goBack(),
        });
      })
      .catch(error => {
        setIsLoading(false);
        const msg = returnErroMessage(error);
        normalAlert({
          message: msg,
          hasCancleBtn: true,
          cancelText: 'Close',
          okText: 'Try agin',
          okHandler: handleAcceptRequest,
        });
      });
  };

  return (
    <View
      style={{backgroundColor: APP_COLORS.WHITE, paddingVertical: 10, flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Order ID:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>#{orderToUse?.id}</Text>
        </View>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Order Type:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {orderToUse?.gift ? orderTypesEnum.GIFT : orderTypesEnum.NORMAL}
          </Text>
        </View>
        {orderToUse?.gift !== null && (
          <>
            <View
              style={[
                viewFlexSpace,
                {
                  borderBottomColor: APP_COLORS.BORDER_COLOR,
                  borderBottomWidth: 1,
                  padding: 10,
                },
              ]}>
              <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
                Gift Name:
              </Text>
              <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                {orderToUse?.gift?.name}
              </Text>
            </View>
            <View
              style={[
                viewFlexSpace,
                {
                  borderBottomColor: APP_COLORS.BORDER_COLOR,
                  borderBottomWidth: 1,
                  padding: 10,
                },
              ]}>
              <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
                Packaging Color:
              </Text>
              <View style={[viewFlexCenter, {flexDirection: 'row'}]}>
                <View
                  style={{
                    backgroundColor: orderToUse?.packagingColor as any,
                    width: 20,
                    height: 20,
                  }}></View>
                <Text
                  style={{
                    color: APP_COLORS.TEXT_GRAY,
                    marginLeft: 10,
                    textTransform: 'uppercase',
                  }}>
                  {orderToUse?.packagingColor}
                </Text>
              </View>
            </View>
          </>
        )}
        <View
          style={{
            borderBottomColor: APP_COLORS.BORDER_COLOR,
            borderBottomWidth: 1,
            padding: 10,
          }}>
          <View style={[viewFlexSpace]}>
            <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
              {orderToUse?.cartItems.length} Product Items
            </Text>
          </View>
          <ScrollView horizontal>
            {orderToUse?.cartItems.map((item, index) => (
              <Item key={index} item={item} />
            ))}
          </ScrollView>
        </View>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Cart Total:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {currencyFormatter(orderToUse?.cartTotalAmount)} RWF
          </Text>
        </View>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Payment Status:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {orderToUse?.paymentStatus}
          </Text>
        </View>
        {orderToUse?.paymentStatus === PAYMENT_STATUS_ENUM.SUCCESS && (
          <>
            <View
              style={[
                {
                  borderBottomColor: APP_COLORS.BORDER_COLOR,
                  borderBottomWidth: 1,
                  padding: 10,
                },
              ]}>
              <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
                Delivery Address:
              </Text>
              <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                {orderToUse?.deliveryAddress.name}
              </Text>
              <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                {orderToUse?.deliveryAddress.description}
              </Text>
            </View>
            <View
              style={[
                viewFlexSpace,
                {
                  borderBottomColor: APP_COLORS.BORDER_COLOR,
                  borderBottomWidth: 1,
                  padding: 10,
                },
              ]}>
              <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
                Distance:
              </Text>
              <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                {orderToUse.distance} KM
              </Text>
            </View>
            <View
              style={[
                viewFlexSpace,
                {
                  borderBottomColor: APP_COLORS.BORDER_COLOR,
                  borderBottomWidth: 1,
                  padding: 10,
                },
              ]}>
              <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
                Delivery Fees:
              </Text>
              <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                {currencyFormatter(orderToUse?.deliveryFees)} RWF
              </Text>
            </View>
            <View
              style={[
                viewFlexSpace,
                {
                  borderBottomColor: APP_COLORS.BORDER_COLOR,
                  borderBottomWidth: 1,
                  padding: 10,
                },
              ]}>
              <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
                Delivery Status:
              </Text>
              <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                {orderToUse?.deliveryStatus}
              </Text>
            </View>
          </>
        )}
        {orderToUse?.riderId === riderId &&
          order.deliveryStatus === DELIVERY_STATUS_ENUM.PENDING && (
            <>
              <View
                style={[
                  viewFlexSpace,
                  {
                    borderBottomColor: APP_COLORS.BORDER_COLOR,
                    borderBottomWidth: 1,
                    padding: 10,
                  },
                ]}>
                <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
                  Client Name:
                </Text>
                <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                  {orderToUse?.client.names}
                </Text>
              </View>
              <View
                style={[
                  viewFlexSpace,
                  {
                    borderBottomColor: APP_COLORS.BORDER_COLOR,
                    borderBottomWidth: 1,
                    padding: 10,
                  },
                ]}>
                <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
                  Client Phone:
                </Text>
                <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                  {orderToUse?.client.phone}
                </Text>
              </View>
            </>
          )}
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Date:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {orderToUse && new Date(orderToUse.createdAt).toUTCString()}
          </Text>
        </View>
        {orderToUse?.paymentStatus === PAYMENT_STATUS_ENUM.FAILED && (
          <View
            style={{
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            }}>
            <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
              Failure Reason:
            </Text>
            <Text style={{color: APP_COLORS.TEXT_GRAY}}>
              {orderToUse?.failureReason}
            </Text>
          </View>
        )}
        <View style={{marginHorizontal: 10, marginVertical: 20}}>
          {orderToUse?.riderId === null && (
            <SubmitButton
              title="Deliver this order"
              buttonProps={{onPress: () => setShowAcceptOrder(true)}}
            />
          )}
        </View>
      </ScrollView>
      <CustomModal isVisible={showAcceptOrder}>
        <View style={[viewFlexCenter]}>
          <Text style={{color: APP_COLORS.ORANGE, fontWeight: '600'}}>
            Confirmation
          </Text>
          <Text style={{color: APP_COLORS.BLACK, marginTop: 10}}>
            Do you want to start delivering this order?
          </Text>
          <View style={{width: '100%', marginTop: 10}}>
            <SubmitButton
              title="Yes, I confirm"
              buttonProps={{onPress: () => handleAcceptRequest()}}
            />
            <SubmitButton
              buttonProps={{onPress: () => setShowAcceptOrder(false)}}
              title="Close"
              containerStyle={{backgroundColor: APP_COLORS.OXFORD_BLUE}}
            />
          </View>
        </View>
      </CustomModal>
      <FullPageLoader isLoading={isLoading} />
    </View>
  );
};

export default OrderPreview;
