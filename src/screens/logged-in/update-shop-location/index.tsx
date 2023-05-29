import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import {viewFlexCenter} from '../../../constants/styles';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {
  INavigationProp,
  IUser,
  TOAST_MESSAGE_TYPES,
} from '../../../../interfaces';
import FullPageLoader from '../../../components/full-page-loader';

import Geolocation from '@react-native-community/geolocation';
import {
  errorHandler,
  normalAlert,
  setHeaders,
  toastMessage,
} from '../../../helpers';
import axios from 'axios';
import {app} from '../../../constants/app';
import {
  setUserEmail,
  setUserNames,
  setUserPhone,
  setUserToken,
} from '../../../actions/user';
import SubmitButton from '../../../components/submit-button';

const initialState = {
  names: '',
  email: '',
  phone: '',
};

interface ICoordinates {
  latitude: number;
  longitude: number;
}

const UpdateShopLocation = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCordinates] = useState<ICoordinates | undefined>(
    undefined,
  );
  const {token} = useSelector((state: RootState) => state.user as IUser);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        setCordinates({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      error => {
        toastMessage(
          TOAST_MESSAGE_TYPES.ERROR,
          'GetCurrentPosition Error: ' + JSON.stringify(error.message),
        );
        Geolocation.requestAuthorization();
      },
      {enableHighAccuracy: true},
    );
  }, []);

  const handleSubmit = () => {
    if (coordinates === undefined) {
      normalAlert({
        message:
          'Can not get your current locaiton. Please make sure that the location is turned on and the try again.',
      });

      return;
    }
    setIsLoading(true);
    axios
      .put(
        app.BACKEND_URL + '/suppliers/location',
        {...coordinates},
        setHeaders(token),
      )
      .then(res => {
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
        navigation.goBack();
      })
      .catch(error => {
        errorHandler(error);
        setIsLoading(false);
      });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: APP_COLORS.WHITE,
          paddingHorizontal: 10,
          paddingVertical: 15,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}>
          <View style={[viewFlexCenter, {flex: 1, flexDirection: 'column'}]}>
            <Text
              style={{
                fontWeight: '700',
                color: APP_COLORS.RED,
                fontSize: 20,
              }}>
              Warning
            </Text>
            <Text
              style={{
                padding: 10,
                textAlign: 'center',
                color: APP_COLORS.BLACK,
              }}>
              Please make sure that you at your shop at the moment of updating
              this information. Because this affects delivery fees and the
              clients can not buy from you when this is inaccurate.
            </Text>
          </View>
        </ScrollView>
        <SubmitButton
          title="Update Location"
          buttonProps={{
            onPress: () =>
              normalAlert({
                message: "Do you want to update your shop's location?",
                hasCancleBtn: true,
                cancelText: 'No',
                cancelHandler: handleBack,
                okHandler: handleSubmit,
                okText: 'yes , update',
              }),
          }}
        />
      </View>
      <FullPageLoader isLoading={isLoading} />
    </KeyboardAvoidingView>
  );
};

export default UpdateShopLocation;
