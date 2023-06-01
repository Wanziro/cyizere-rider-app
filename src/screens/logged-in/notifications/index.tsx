import {View, Text, ScrollView, RefreshControl, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import NotFound from '../../../components/not-found';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {
  fetchNotifications,
  fetchNotifications2,
  resetNotifications,
  setIsHardReloadingNotifications,
  setShowClearAllNotificatonsConfirmation,
} from '../../../actions/notifications';
import {viewFlexSpace} from '../../../constants/styles';
import TimeAgo from '@andordavoti/react-native-timeago';
import FullPageLoader from '../../../components/full-page-loader';
import axios from 'axios';
import {app} from '../../../constants/app';
import {errorHandler, normalAlert, setHeaders} from '../../../helpers';
import Loader from './loader';

const Notifications = () => {
  const dispatch = useDispatch();
  const {
    isLoading,
    loadingError,
    hardReloading,
    notifications,
    showConfirmation,
  } = useSelector((state: RootState) => state.notifications);
  const {token} = useSelector((state: RootState) => state.user);

  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications2());
  }, []);

  useEffect(() => {
    let sub = true;
    if (sub) {
      loadingError.trim().length > 0 &&
        notifications.length === 0 &&
        normalAlert({
          message: loadingError,
          hasCancleBtn: true,
          cancelText: 'close',
          okHandler: alertCallBack,
          okText: 'Try Again',
        });
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

  useEffect(() => {
    let sub = true;
    if (sub) {
      if (showConfirmation) {
        normalAlert({
          message: 'Do you want to delete all notifications?',
          cancelText: 'No',
          hasCancleBtn: true,
          okHandler: handleClearAll,
          cancelHandler: handleConfirmationClose,
          okText: 'yes, clear all',
        });
      }
    }
    return () => {
      sub = false;
    };
  }, [showConfirmation]);

  const handleConfirmationClose = () => {
    dispatch(setShowClearAllNotificatonsConfirmation(false));
  };

  const alertCallBack = () => {
    setShowErrorAlert(false);
    dispatch(setIsHardReloadingNotifications(true));
    dispatch(fetchNotifications());
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(setIsHardReloadingNotifications(true));
    dispatch(fetchNotifications());
  };

  const handleClearAll = () => {
    dispatch(setShowClearAllNotificatonsConfirmation(false));
    setIsSubmitting(true);
    axios
      .delete(app.BACKEND_URL + '/notifications/riders', setHeaders(token))
      .then(res => {
        setIsSubmitting(false);
        dispatch(resetNotifications());
      })
      .catch(error => {
        setIsSubmitting(false);
        errorHandler(error);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: APP_COLORS.BACKGROUND_COLOR}}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        {hardReloading ? (
          <Loader />
        ) : isLoading && notifications.length === 0 ? (
          <Loader />
        ) : notifications.length === 0 ? (
          <NotFound title="No data found" />
        ) : (
          notifications.map((item, index) => (
            <View
              style={{
                borderBottomColor: APP_COLORS.PRODUCT_CARD_BORDER,
                borderBottomWidth: 1,
              }}
              key={index}>
              <View
                style={[
                  viewFlexSpace,
                  {
                    padding: 10,
                    backgroundColor: APP_COLORS.WHITE,
                    alignItems: 'flex-start',
                  },
                ]}>
                <View
                  style={{
                    borderRadius: 100,
                    borderColor: APP_COLORS.PRODUCT_CARD_BORDER,
                    borderWidth: 1,
                  }}>
                  <Image
                    source={require('../../../assets/logo.png')}
                    style={{width: 50, height: 50, borderRadius: 100}}
                    resizeMode="contain"
                  />
                </View>
                <View style={{flex: 1, marginLeft: 10}}>
                  {item.title !== '-' && (
                    <Text
                      style={{
                        color: APP_COLORS.BLACK,
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}>
                      {item.title}
                    </Text>
                  )}
                  <Text style={{color: APP_COLORS.BLACK}}>{item.message}</Text>
                  <TimeAgo
                    dateTo={new Date(item.createdAt)}
                    style={{color: APP_COLORS.TEXT_GRAY}}
                  />
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <FullPageLoader isLoading={isSubmitting} />
    </View>
  );
};

export default Notifications;
