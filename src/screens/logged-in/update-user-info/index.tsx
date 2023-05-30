import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import {commonInput} from '../../../constants/styles';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {
  INavigationProp,
  IUser,
  TOAST_MESSAGE_TYPES,
} from '../../../../interfaces';
import FullPageLoader from '../../../components/full-page-loader';
import {errorHandler, setHeaders, toastMessage} from '../../../helpers';
import axios from 'axios';
import {app} from '../../../constants/app';
import SubmitButton from '../../../components/submit-button';
import {setUser} from '../../../actions/user';

const initialState = {
  names: '',
  email: '',
  phone: '',
};
const UpdateUserInfo = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const userReducer = useSelector((state: RootState) => state.user as IUser);

  useEffect(() => {
    setState({
      names: userReducer.names,
      email: userReducer.email,
      phone: userReducer.phone,
    });
  }, []);

  const handleSubmit = () => {
    const phoneRegex = /^07[8,2,3,9][0-9]{7}$/;
    if (
      state.email.trim() === '' ||
      state.names.trim() === '' ||
      state.phone.trim() === ''
    ) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'All fields are required please fill them carefully.',
      );
      return;
    }
    if (!phoneRegex.test(state.phone)) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Invalid phone number, Please enter a valid MTN OR AIRTEL TIGO Phone number',
      );
      return;
    }
    setIsLoading(true);
    axios
      .put(
        app.BACKEND_URL + '/suppliers/info',
        state,
        setHeaders(userReducer.token),
      )
      .then(res => {
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
        setUser({
          ...userReducer,
          names: state.names,
          phone: state.phone,
          email: state.email,
        });
        setIsLoading(false);
        navigation.goBack();
      })
      .catch(error => {
        errorHandler(error);
        setIsLoading(false);
      });
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginVertical: 5}}>
            <Text style={{color: APP_COLORS.TEXT_GRAY}}>Name</Text>
            <TextInput
              placeholderTextColor={APP_COLORS.GRAY}
              style={[commonInput]}
              placeholder="Enter your name"
              value={state.names}
              onChangeText={text => setState({...state, names: text})}
            />
          </View>
          <View style={{marginVertical: 5}}>
            <Text style={{color: APP_COLORS.TEXT_GRAY}}>Email Address</Text>
            <TextInput
              placeholderTextColor={APP_COLORS.GRAY}
              style={[commonInput]}
              placeholder="Enter your email"
              value={state.email}
              onChangeText={text => setState({...state, email: text})}
            />
          </View>
          <View style={{marginVertical: 5}}>
            <Text style={{color: APP_COLORS.TEXT_GRAY}}>Phone Number</Text>
            <TextInput
              placeholderTextColor={APP_COLORS.GRAY}
              style={[commonInput]}
              placeholder="Enter your phone number"
              value={state.phone}
              onChangeText={text => setState({...state, phone: text})}
            />
          </View>
        </ScrollView>
        <SubmitButton
          title="Submit"
          buttonProps={{onPress: () => handleSubmit()}}
        />
      </View>
      <FullPageLoader isLoading={isLoading} />
    </KeyboardAvoidingView>
  );
};

export default UpdateUserInfo;
