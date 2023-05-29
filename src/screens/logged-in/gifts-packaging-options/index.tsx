import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import SubmitButton from '../../../components/submit-button';
import {
  INavigationProp,
  IPackagingOption,
  TOAST_MESSAGE_TYPES,
} from '../../../../interfaces';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {
  fetchPackagingOptions,
  setPackagingOptions,
} from '../../../actions/packagingOptions';
import {viewFlexSpace} from '../../../constants/styles';
import ImageLoader from '../../../components/image-loader';
import {app} from '../../../constants/app';
import {
  currencyFormatter,
  normalAlert,
  returnErroMessage,
  setHeaders,
  toastMessage,
} from '../../../helpers';
import NotFound from '../../../components/not-found';
import Loader from '../orders/loader';
import FullPageLoader from '../../../components/full-page-loader';
import axios from 'axios';

const GiftsPackagingOptions = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const {options, isLoading} = useSelector(
    (state: RootState) => state.packagingOptions,
  );
  const {token} = useSelector((state: RootState) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPackagingOptions());
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
    dispatch(fetchPackagingOptions());
  };

  const handleDelete = (item: IPackagingOption) => {
    setIsSubmitting(true);

    axios
      .delete(
        app.BACKEND_URL + '/packagingoptions/' + item.id,
        setHeaders(token),
      )
      .then(res => {
        setIsSubmitting(false);
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
        dispatch(
          setPackagingOptions(options.filter(opt => opt.id !== item.id)),
        );
      })
      .catch(error => {
        setIsSubmitting(false);
        const err = returnErroMessage(error);
        normalAlert({
          message: err,
        });
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
          {isLoading && options.length === 0 && <Loader />}
          {options.length === 0 && !isLoading && (
            <NotFound title="No packaging options found" />
          )}
          {options.map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: APP_COLORS.WHITE,
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}>
              <View style={[viewFlexSpace]}>
                <ImageLoader
                  url={app.FILE_URL + item.image}
                  height={100}
                  width={100}
                  style={{borderRadius: 5}}
                />
                <View style={{flex: 1, marginLeft: 10}}>
                  <Text style={{color: APP_COLORS.BLACK}}>{item.name}</Text>
                  <Text style={{color: APP_COLORS.BLACK}}>colors:</Text>
                  <Text style={{color: APP_COLORS.FOOTER_BODY_TEXT_COLOR}}>
                    {item.color1},{item.color2},{item.color3},{item.color4}
                  </Text>
                  <Text style={{color: APP_COLORS.ORANGE}}>
                    {currencyFormatter(item.amount)} RWF
                  </Text>
                  <View
                    style={[
                      viewFlexSpace,
                      {
                        marginTop: 5,
                        borderTopColor: APP_COLORS.BORDER_COLOR,
                        borderTopWidth: 1,
                        paddingTop: 5,
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('EditPackagingOption', {
                          option: item,
                        })
                      }>
                      <Text style={{color: APP_COLORS.OXFORD_BLUE}}>
                        Edit Option
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        normalAlert({
                          message: `Do you want to delete ${item.name}?`,
                          hasCancleBtn: true,
                          cancelText: 'No',
                          okText: 'Yes, Delete',
                          okHandler: () => handleDelete(item),
                        })
                      }>
                      <Text style={{color: APP_COLORS.RED}}>Delete Option</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={{padding: 10}}>
        <SubmitButton
          title="Add New Packaging"
          buttonProps={{onPress: () => navigation.navigate('AddPackaging')}}
        />
      </View>
      <FullPageLoader isLoading={isSubmitting} />
    </View>
  );
};

export default GiftsPackagingOptions;
