import {View, Text, ScrollView, Pressable} from 'react-native';
import React, {useState} from 'react';
import {
  INavigationPropWithRouteRequired,
  IOrder,
  PAYMENT_STATUS_ENUM,
} from '../../../../interfaces';
import {APP_COLORS} from '../../../constants/colors';
import {viewFlexSpace} from '../../../constants/styles';
import Icon from 'react-native-vector-icons/Entypo';
import Item from './item';
import {currencyFormatter} from '../../../helpers';

const OrderPreview = ({
  navigation,
  route,
}: INavigationPropWithRouteRequired) => {
  const {order} = route.params as {order: IOrder};
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
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>#{order.id}</Text>
        </View>
        <View
          style={{
            borderBottomColor: APP_COLORS.BORDER_COLOR,
            borderBottomWidth: 1,
            padding: 10,
          }}>
          <View style={[viewFlexSpace]}>
            <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
              {order.cartItems.length} Product Items
            </Text>
          </View>
          <ScrollView horizontal>
            {order.cartItems.map((item, index) => (
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
            {currencyFormatter(order.cartTotalAmount)} RWF
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
            Payment Method:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {order.paymentMethod}
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
            Payment Phone No:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {order.paymentPhoneNumber}
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
            {order.paymentStatus}
          </Text>
        </View>
        {order.paymentStatus === PAYMENT_STATUS_ENUM.SUCCESS && (
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
              {order.deliveryStatus}
            </Text>
          </View>
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
            {new Date(order.createdAt).toUTCString()}
          </Text>
        </View>
        {order.paymentStatus === PAYMENT_STATUS_ENUM.FAILED && (
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
              {order.failureReason}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderPreview;
