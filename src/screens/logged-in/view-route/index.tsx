import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  INavigationPropWithRouteRequired,
  IOrder,
  TOAST_MESSAGE_TYPES,
} from '../../../../interfaces';
import {APP_COLORS} from '../../../constants/colors';
import {toastMessage} from '../../../helpers';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import MapView, {Marker} from 'react-native-maps';
import {app} from '../../../constants/app';

const Loader = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size={50} color={APP_COLORS.ORANGE} />
    </View>
  );
};

const {width, height} = Dimensions.get('window');
const ViewRoute = ({route, navigation}: INavigationPropWithRouteRequired) => {
  const {order} = route.params as {order: IOrder};
  const [origin, setorigin] = useState<any | undefined>(undefined);
  const [destination, setDestination] = useState<any | undefined>(undefined);
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  useEffect(() => {
    try {
      const address = order.deliveryAddress;
      const location = address?.details?.geometry?.location;
      if (location !== undefined) {
        setDestination({
          latitude: location.lat,
          longitude: location.lng,
        });
      } else {
        setDestination(address.data.description);
      }
    } catch (error: any) {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, error.message);
    }
  }, [order]);

  useEffect(() => {
    const timer = setInterval(() => {
      getCurrentLoaction();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getCurrentLoaction = () => {
    Geolocation.getCurrentPosition(
      info => {
        setorigin({
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
  };

  const handleError = (error: any) => {
    toastMessage(TOAST_MESSAGE_TYPES.ERROR, error);
  };
  return (
    <View style={{flex: 1, backgroundColor: APP_COLORS.WHITE}}>
      <StatusBar translucent backgroundColor="transparent" />
      {origin === undefined || destination === undefined ? (
        <Loader />
      ) : (
        <MapView
          style={{flex: 1, width}}
          initialRegion={{
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={app.GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor={APP_COLORS.ORANGE}
            mode="DRIVING"
            onError={errorMessage => {
              handleError(errorMessage);
            }}
          />
          <Marker pinColor="green" coordinate={origin} />
          <Marker coordinate={destination} />
        </MapView>
      )}
    </View>
  );
};

export default ViewRoute;
