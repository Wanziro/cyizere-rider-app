import {View, ScrollView, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APP_COLORS} from '../../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import Loader from '../loader';
import {INavigationProp, PAYMENT_STATUS_ENUM} from '../../../../../interfaces';
import NotFound from '../../../../components/not-found';
import {fetchOrders} from '../../../../actions/orders';
import Item from './item';
import {normalAlert} from '../../../../helpers';

const PendingOrders = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const {orders, isLoading, loadingError} = useSelector(
    (state: RootState) => state.orders,
  );

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
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

  useEffect(() => {
    let sub = true;
    if (sub) {
      loadingError.trim().length > 0 &&
        orders.length === 0 &&
        normalAlert({
          message: loadingError,
          hasCancleBtn: true,
          cancelText: 'close',
          okHandler: fetchData,
          okText: 'Try Again',
        });
    }
    return () => {
      sub = false;
    };
  }, [loadingError]);

  const fetchData = () => {
    dispatch(fetchOrders());
  };

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
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {isLoading && orders.length === 0 ? (
          <Loader />
        ) : orders.filter(
            item => item.paymentStatus === PAYMENT_STATUS_ENUM.PENDING,
          ).length > 0 ? (
          orders
            .filter(item => item.paymentStatus === PAYMENT_STATUS_ENUM.PENDING)
            .map((item, index) => (
              <Item item={item} key={index} navigation={navigation} />
            ))
        ) : (
          <NotFound title={'You do not have any pending order'} />
        )}
      </ScrollView>
    </View>
  );
};

export default PendingOrders;
