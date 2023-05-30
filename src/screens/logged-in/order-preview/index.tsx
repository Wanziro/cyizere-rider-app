import {View, Text, ScrollView, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  INavigationPropWithRouteRequired,
  IOrder,
  PAYMENT_STATUS_ENUM,
  orderTypesEnum,
} from '../../../../interfaces';
import {APP_COLORS} from '../../../constants/colors';
import {viewFlexSpace} from '../../../constants/styles';
import Icon from 'react-native-vector-icons/Entypo';
import Item from './item';
import {currencyFormatter} from '../../../helpers';
import {useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import SubmitButton from '../../../components/submit-button';

const OrderPreview = ({
  navigation,
  route,
}: INavigationPropWithRouteRequired) => {
  const {order} = route.params as {order: IOrder};
  const [orderToUse, setOrderToUse] = useState<IOrder | undefined>(undefined);
  const {orders} = useSelector((state: RootState) => state.orders);
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
            <SubmitButton title="Deliver this order" />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderPreview;
