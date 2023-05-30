import {View, Text, Switch, ActivityIndicator, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import {viewFlexSpace} from '../../../constants/styles';
import Icon from 'react-native-vector-icons/Entypo';
import {INavigationProp, IUser} from '../../../../interfaces';
import axios from 'axios';
import {app} from '../../../constants/app';
import {errorHandler, setHeaders} from '../../../helpers';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {setUser} from '../../../actions/user';

const AccountSettings = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const userReducer = useSelector((state: RootState) => state.user as IUser);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSwitch = () => {
    setIsLoading(true);
    axios
      .put(
        app.BACKEND_URL + '/riders/status',
        {status: !isEnabled ? true : false},
        setHeaders(userReducer.token),
      )
      .then(res => {
        setIsLoading(false);
        dispatch(setUser({...userReducer, isActive: res.data.status}));
        setIsEnabled(previousState => !previousState);
      })
      .catch(error => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  useEffect(() => {
    setIsEnabled(userReducer.isActive);
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: APP_COLORS.BACKGROUND_COLOR}}>
      <View
        style={[
          viewFlexSpace,
          {
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: APP_COLORS.BORDER_COLOR,
          },
        ]}>
        <Text
          style={{
            flex: 1,
            marginHorizontal: 10,
            color: APP_COLORS.BLACK,
          }}>
          Available
        </Text>
        {isLoading ? (
          <ActivityIndicator color={APP_COLORS.ORANGE} size={25} />
        ) : (
          <Switch
            trackColor={{false: '#767577', true: APP_COLORS.ORANGE}}
            thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        )}
      </View>
      <Pressable onPress={() => navigation.navigate('UpdateUserInfo')}>
        <View
          style={[
            viewFlexSpace,
            {
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: APP_COLORS.BORDER_COLOR,
            },
          ]}>
          <Text
            style={{
              flex: 1,
              marginHorizontal: 10,
              color: APP_COLORS.BLACK,
            }}>
            Update Personal Information
          </Text>
          <Icon name="chevron-right" size={25} color={APP_COLORS.TEXT_GRAY} />
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('ChangePassword')}>
        <View
          style={[
            viewFlexSpace,
            {
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: APP_COLORS.BORDER_COLOR,
            },
          ]}>
          <Text
            style={{
              flex: 1,
              marginHorizontal: 10,
              color: APP_COLORS.BLACK,
            }}>
            Change Password
          </Text>
          <Icon name="chevron-right" size={25} color={APP_COLORS.TEXT_GRAY} />
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('DeleteAccount')}>
        <View
          style={[
            viewFlexSpace,
            {
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: APP_COLORS.BORDER_COLOR,
            },
          ]}>
          <Text
            style={{
              flex: 1,
              marginHorizontal: 10,
              color: APP_COLORS.BLACK,
            }}>
            Delete Account
          </Text>
          <Icon name="chevron-right" size={25} color={APP_COLORS.TEXT_GRAY} />
        </View>
      </Pressable>
    </View>
  );
};

export default AccountSettings;
