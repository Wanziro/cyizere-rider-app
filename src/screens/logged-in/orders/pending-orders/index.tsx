import {View, ScrollView, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APP_COLORS} from '../../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import Loader from '../loader';
import {DELIVERY_STATUS_ENUM, INavigationProp} from '../../../../../interfaces';
import NotFound from '../../../../components/not-found';
import Item from './item';
import {fetchOrders} from '../../../../actions/orders';

const PendingOrders = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const {riderId} = useSelector((state: RootState) => state.user);
  const {orders, isLoading} = useSelector((state: RootState) => state.orders);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
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
  };

  return (
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
              <Item item={item} key={index} navigation={navigation} />
            ))
        ) : (
          <NotFound title="You don't have any pending order" />
        )}
      </ScrollView>
    </View>
  );
};

export default PendingOrders;
