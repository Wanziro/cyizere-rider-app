import {View, Text, ScrollView, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import SubmitButton from '../../../components/submit-button';
import {
  IGift,
  INavigationProp,
  TOAST_MESSAGE_TYPES,
} from '../../../../interfaces';
import {useDispatch, useSelector} from 'react-redux';
import {fetchGifts, setGifts} from '../../../actions/gifts';
import {RootState} from '../../../reducers';
import Loader from './loader';
import NotFound from '../../../components/not-found';
import {viewFlexSpace} from '../../../constants/styles';
import ImageLoader from '../../../components/image-loader';
import {app} from '../../../constants/app';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  normalAlert,
  returnErroMessage,
  setHeaders,
  toastMessage,
} from '../../../helpers';
import FullPageLoader from '../../../components/full-page-loader';
import axios from 'axios';

const Gifts = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {gifts, isLoading} = useSelector((state: RootState) => state.gifts);
  const {token} = useSelector((state: RootState) => state.user);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchGifts());
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
    dispatch(fetchGifts());
  };

  const handleDelete = (gift: IGift) => {
    setIsSubmitting(true);
    axios
      .delete(app.BACKEND_URL + '/gifts/' + gift.id, setHeaders(token))
      .then(res => {
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
        setIsSubmitting(false);
        const updatedGifts = gifts.filter(item => item.id !== gift.id);
        dispatch(setGifts(updatedGifts));
      })
      .catch(error => {
        setIsSubmitting(false);
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
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{flex: 1, padding: 10}}>
          {isLoading && gifts.length === 0 && <Loader />}
          {!isLoading && gifts.length === 0 && (
            <NotFound title="No gifts added yet" />
          )}
          {gifts.length > 0 &&
            gifts.map((item, index) => (
              <View
                key={index}
                style={[
                  viewFlexSpace,
                  {
                    backgroundColor: APP_COLORS.WHITE,
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'flex-start',
                  },
                ]}>
                <View>
                  <ImageLoader
                    url={app.FILE_URL + item.image}
                    height={80}
                    width={80}
                    style={{borderRadius: 5}}
                  />
                </View>
                <View style={{flex: 1, marginLeft: 10}}>
                  <Text
                    style={{
                      color: APP_COLORS.FOOTER_BODY_TEXT_COLOR,
                      fontWeight: '600',
                      textTransform: 'capitalize',
                    }}>
                    {item.name}
                  </Text>
                  <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                    {item.description}
                  </Text>
                  <View>
                    <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                      {item.products.length} Products
                    </Text>
                    <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                      {item.packagingOptions.length} Packaging Options
                    </Text>
                  </View>
                  <View
                    style={[
                      viewFlexSpace,
                      {
                        borderTopColor: APP_COLORS.PRODUCT_CARD_BORDER,
                        borderTopWidth: 1,
                        marginTop: 10,
                        padding: 5,
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('EditGift', {gift: item})
                      }>
                      <Text style={{color: APP_COLORS.BLACK}}>Edit/View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        normalAlert({
                          message: 'Do you want to delete ' + item.name,
                          hasCancleBtn: true,
                          okHandler: () => handleDelete(item),
                          okText: 'Yes, Delete',
                        })
                      }>
                      <Text style={{color: APP_COLORS.RED}}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
      <View style={{padding: 10}}>
        <SubmitButton
          buttonProps={{onPress: () => navigation.navigate('AddGift')}}
          title="Add New Gift"
        />
      </View>
      <FullPageLoader isLoading={isSubmitting} />
    </View>
  );
};

export default Gifts;
