import {View, Text, Pressable, Alert} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import {INavigationProp, IUser} from '../../../../interfaces';
import {resetUser} from '../../../actions/user';
import {viewFlexSpace} from '../../../constants/styles';
import {APP_COLORS} from '../../../constants/colors';
import FullPageLoader from '../../../components/full-page-loader';
import {resetNotifications} from '../../../actions/notifications';
import {resetOrders} from '../../../actions/orders';
import {resetProducts} from '../../../actions/products';
import {resetProductPrices} from '../../../actions/productPrices';

const Profile = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    dispatch(resetUser());
    dispatch(resetOrders());
    dispatch(resetProducts());
    dispatch(resetProductPrices());
    dispatch(resetNotifications());
  };

  const confirmLogout = () => {
    Alert.alert(
      'Confirmation',
      'Do you want to logout from your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'confirm',
          onPress: () => handleLogout(),
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: APP_COLORS.BACKGROUND_COLOR,
        paddingVertical: 10,
      }}>
      <View
        style={{
          marginVertical: 15,
          borderBottomColor: APP_COLORS.BORDER_COLOR,
          borderBottomWidth: 1,
        }}>
        <Pressable onPress={() => navigation.navigate('AccountSettings')}>
          <View
            style={[
              viewFlexSpace,
              {
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderBottomColor: APP_COLORS.BORDER_COLOR,
                borderBottomWidth: 1,
              },
            ]}>
            <Icon2 name="setting" size={25} color={APP_COLORS.BLACK} />
            <Text
              style={{
                color: APP_COLORS.TEXT_GRAY,
                flex: 1,
                marginHorizontal: 10,
              }}>
              Account Settings
            </Text>
            <Icon4
              name="chevron-right"
              size={25}
              color={APP_COLORS.TEXT_GRAY}
            />
          </View>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('VerificationDetails')}>
          <View
            style={[
              viewFlexSpace,
              {
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderBottomColor: APP_COLORS.BORDER_COLOR,
                borderBottomWidth: 1,
              },
            ]}>
            <Icon3 name="account-details" size={25} color={APP_COLORS.BLACK} />
            <Text
              style={{
                color: APP_COLORS.TEXT_GRAY,
                flex: 1,
                marginHorizontal: 10,
              }}>
              Verification Details
            </Text>
            <Icon4
              name="chevron-right"
              size={25}
              color={APP_COLORS.TEXT_GRAY}
            />
          </View>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Wallet')}>
          <View
            style={[
              viewFlexSpace,
              {
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderBottomColor: APP_COLORS.BORDER_COLOR,
                borderBottomWidth: 1,
              },
            ]}>
            <Icon3 name="wallet" size={25} color={APP_COLORS.BLACK} />
            <Text
              style={{
                color: APP_COLORS.TEXT_GRAY,
                flex: 1,
                marginHorizontal: 10,
              }}>
              My Wallet
            </Text>
            <Icon4
              name="chevron-right"
              size={25}
              color={APP_COLORS.TEXT_GRAY}
            />
          </View>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('HelpAndSupport')}>
          <View
            style={[
              viewFlexSpace,
              {
                paddingVertical: 10,
                paddingHorizontal: 20,
              },
            ]}>
            <Icon3
              name="help-circle-outline"
              size={25}
              color={APP_COLORS.BLACK}
            />
            <Text
              style={{
                color: APP_COLORS.TEXT_GRAY,
                flex: 1,
                marginHorizontal: 10,
              }}>
              Help&Support
            </Text>
            <Icon4
              name="chevron-right"
              size={25}
              color={APP_COLORS.TEXT_GRAY}
            />
          </View>
        </Pressable>
      </View>

      <Pressable onPress={() => confirmLogout()}>
        <View
          style={[
            viewFlexSpace,
            {
              paddingVertical: 10,
              paddingHorizontal: 20,
            },
          ]}>
          <Icon3 name="logout" size={25} color={APP_COLORS.ORANGE} />
          <Text style={{flex: 1, marginLeft: 10, color: APP_COLORS.ORANGE}}>
            Signout
          </Text>
        </View>
      </Pressable>
      <FullPageLoader isLoading={isLoading} />
    </View>
  );
};

export default Profile;
