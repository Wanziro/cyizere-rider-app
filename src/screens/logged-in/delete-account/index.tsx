import {View, Text, TextInput, ScrollView, Pressable} from 'react-native';
import React, {useState} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import {commonInput} from '../../../constants/styles';
import {
  normalAlert,
  returnErroMessage,
  setHeaders,
  toastMessage,
} from '../../../helpers';
import {TOAST_MESSAGE_TYPES} from '../../../../interfaces';
import axios from 'axios';
import {app} from '../../../constants/app';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {resetNotifications} from '../../../actions/notifications';
import {resetMessages} from '../../../actions/messages';
import {resetUser} from '../../../actions/user';
import FullPageLoader from '../../../components/full-page-loader';
import CustomModal from '../../../components/custom-modal';
import SubmitButton from '../../../components/submit-button';

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const {token} = useSelector((state: RootState) => state.user);
  const [reason, setReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErroMessage] = useState('');
  const [showErrorModal, setShowErroModal] = useState(false);

  const handleOpen = () => {
    if (reason.trim() === '') {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please give us a feedback so that you can be able to delete your accountz.',
      );
    } else {
      setShowModal(true);
    }
  };

  const handleSubmit = () => {
    if (password === '') {
      toastMessage(TOAST_MESSAGE_TYPES.INFO, 'Please enter your password');
      return;
    }
    setShowModal(false);
    setIsLoading(false);
    setErroMessage('');
    axios
      .post(
        app.BACKEND_URL + '/users/delete',
        {password, reason},
        setHeaders(token),
      )
      .then(res => {
        setIsLoading(false);
        dispatch(resetNotifications());
        dispatch(resetMessages());
        dispatch(resetUser());
      })
      .catch(error => {
        const err = returnErroMessage(error);
        setIsLoading(false);
        setErroMessage(err);
        setShowErroModal(true);
        normalAlert({message: err});
      });
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: APP_COLORS.WHITE, padding: 10}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <Text style={{color: APP_COLORS.BLACK}}>
            Please answer this question? why do you want to delete your account?
          </Text>
          <TextInput
            placeholderTextColor={APP_COLORS.GRAY}
            style={[
              {
                padding: 5,
                color: APP_COLORS.BLACK,
                maxHeight: 200,
                height: 100,
                textAlignVertical: 'top',
              },
              commonInput,
            ]}
            placeholder="Why do you want to delete this account?"
            multiline={true}
            onChangeText={text => setReason(text)}
            value={reason}
          />
          <Text style={{color: APP_COLORS.RED, marginVertical: 10}}>
            NB: There will be no way to undo this action. Please make sure that
            your are sure about this.
          </Text>
        </ScrollView>
        <SubmitButton
          title="Continue"
          buttonProps={{onPress: () => handleOpen()}}
        />
      </View>
      <CustomModal isVisible={showModal}>
        <Text
          style={{
            color: APP_COLORS.ORANGE,
            textAlign: 'center',
            fontWeight: '600',
            fontSize: 20,
          }}>
          Confirmation
        </Text>
        <View style={{marginTop: 10}}>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            Enter your password to confirm account deletion
          </Text>
          <TextInput
            placeholderTextColor={APP_COLORS.GRAY}
            style={[commonInput]}
            placeholder="Enter your password"
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
            value={password}
          />
          <SubmitButton
            title="Delete Account"
            buttonProps={{onPress: () => handleSubmit()}}
          />
          <SubmitButton
            title="Cancel"
            buttonProps={{onPress: () => setShowModal(false)}}
          />
        </View>
      </CustomModal>
      <FullPageLoader isLoading={isLoading} />
    </>
  );
};

export default DeleteAccount;
