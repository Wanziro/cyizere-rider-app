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
import {fetchProducts} from '../../../../actions/products';
import NotVerified from '../../../../components/not-verified';
import {fetchProductPrices} from '../../../../actions/productPrices';

const WaitingOrders = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const {orders, isLoading} = useSelector((state: RootState) => state.orders);
  const {isVerified} = useSelector((state: RootState) => state.user);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isVerified) {
      dispatch(fetchProducts());
      dispatch(fetchProductPrices());
      dispatch(fetchOrders());
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
    dispatch(fetchOrders());
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
            {isLoading && orders.length === 0 ? (
              <Loader />
            ) : orders.filter(item => item.riderId === null).length > 0 ? (
              orders
                .filter(item => item.riderId === null)
                .map((item, index) => (
                  <Item item={item} key={index} navigation={navigation} />
                ))
            ) : (
              <NotFound title={'There is no order waiting for delivery now'} />
            )}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default WaitingOrders;
