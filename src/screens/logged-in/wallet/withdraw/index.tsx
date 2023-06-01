import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

import {APP_COLORS} from '../../../../constants/colors';
import {viewFlexSpace} from '../../../../constants/styles';
import axios from 'axios';
import {app} from '../../../../constants/app';
import {
  errorHandler,
  normalAlert,
  returnErroMessage,
  setHeaders,
  toastMessage,
} from '../../../../helpers';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import {TOAST_MESSAGE_TYPES} from '../../../../../interfaces';
import {addNewTransaction} from '../../../../actions/walletTransactions';
import CustomModal from '../../../../components/custom-modal';
import CustomTextInput from '../../../../components/custom-text-input';
import CustomPhoneInput from '../../../../components/custom-phone-input';
import SubmitButton from '../../../../components/submit-button';
import FullPageLoader from '../../../../components/full-page-loader';

interface IDepositProps {
  showModal: boolean;
  setShowModal: any;
}
const initialState = {amount: ''};
const Withdraw = ({showModal, setShowModal}: IDepositProps) => {
  const dispatch = useDispatch();
  const {token} = useSelector((state: RootState) => state.user);
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    const phoneRegex = /^7[8,2,3,9][0-9]{7}$/;
    if (state.amount.trim() === '') {
      normalAlert({message: 'Please enter amount you want to deposit'});
      return;
    }
    setIsSubmitting(true);

    axios
      .put(app.BACKEND_URL + '/riderswallet/', state, setHeaders(token))
      .then(res => {
        setIsSubmitting(false);
        setShowModal(false);
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
        normalAlert({message: res.data.msg});
      })
      .catch(error => {
        const err = returnErroMessage(error);
        setIsSubmitting(false);
        normalAlert({message: err, okText: 'close'});
      });
  };

  return (
    <CustomModal isVisible={showModal}>
      <View>
        <View style={[viewFlexSpace]}>
          <Text
            style={{
              fontWeight: '700',
              marginBottom: 10,
              color: APP_COLORS.BLACK,
              fontSize: 16,
            }}>
            Withdraw
          </Text>
          <View>
            <Pressable
              onPress={() => setShowModal(false)}
              disabled={isSubmitting}>
              <Icon name="close" size={25} color={APP_COLORS.BLACK} />
            </Pressable>
          </View>
        </View>
        <View style={{marginTop: 5}}>
          <View
            style={{
              marginBottom: 10,
              backgroundColor: APP_COLORS.GREY_BUNKER,
              opacity: 0.5,
              padding: 5,
            }}>
            <Text style={{color: APP_COLORS.WHITE}}>
              Amounts will be credited to your phone number/momo code
            </Text>
          </View>
          <View style={{marginBottom: 10}}>
            <Text style={{color: APP_COLORS.TEXT_GRAY}}>Amount</Text>
            <CustomTextInput
              placeHolder="Enter amount"
              inputProps={{
                onChangeText: (text: string) =>
                  setState({...state, amount: text}),
                value: state.amount,
              }}
            />
            {errors.amount.trim() !== '' && (
              <Text style={{color: 'red'}}>{errors.amount}</Text>
            )}
          </View>
          <SubmitButton
            title="Withdraw"
            buttonProps={{onPress: () => handleSubmit()}}
          />
        </View>
        <FullPageLoader isLoading={isSubmitting} />
      </View>
    </CustomModal>
  );
};

export default Withdraw;
