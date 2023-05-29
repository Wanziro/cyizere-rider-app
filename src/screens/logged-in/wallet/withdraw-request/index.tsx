import {View, Text, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

import Modal from 'react-native-modal';
import {APP_COLORS} from '../../../../constants/colors';
import {
  btnWithBgContainerStyles,
  btnWithBgTextStyles,
  viewFlexCenter,
  viewFlexSpace,
} from '../../../../constants/styles';
import DisabledInput from '../../../../components/disabled-input';
interface IDepositProps {
  showModal: boolean;
  setShowModal: any;
  handleWithdraw: any;
}
const initialState = {amount: ''};
const WithdrawRequest = ({
  showModal,
  setShowModal,
  handleWithdraw,
}: IDepositProps) => {
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState(initialState);

  const handleSubmit = () => {
    if (state.amount.trim() === '') {
      setErrors({
        ...errors,
        amount: 'Please enter amount you want to withdraw',
      });
      return;
    } else {
      setErrors({...errors, amount: ''});
    }
    handleWithdraw(Number(state.amount));
  };

  useEffect(() => {
    if (showModal) {
      setState(initialState);
      setErrors(initialState);
    }
  }, [showModal]);

  return (
    <Modal
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.5}
      animationOutTiming={700}
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      style={{padding: 0, margin: 0}}>
      <View
        style={{
          backgroundColor: APP_COLORS.WHITE,
          marginRight: 20,
          marginLeft: 20,
          padding: 20,
          borderRadius: 10,
        }}>
        <View style={[viewFlexSpace]}>
          <Text
            style={{
              fontWeight: '700',
              marginBottom: 10,
              color: APP_COLORS.BLACK,
              fontSize: 16,
            }}>
            Withdraw Money
          </Text>
          <View>
            <Pressable onPress={() => setShowModal(false)}>
              <Icon name="close" size={25} color={APP_COLORS.BLACK} />
            </Pressable>
          </View>
        </View>
        <View>
          <Text style={{color: APP_COLORS.BLACK}}>
            NB:1. Withdrawed amount will be credited to your account's phone
            number
          </Text>
          <Text style={{color: APP_COLORS.BLACK, marginTop: 5}}>
            2. If Withdrawal request failed, you will get a notification for
            more details about the cause.
          </Text>
        </View>
        <View style={{marginTop: 10}}>
          <View style={{marginBottom: 10}}>
            <Text style={{color: APP_COLORS.TEXT_GRAY}}>
              Amount to withdraw
            </Text>
            <DisabledInput
              onChangeText={(text: string) =>
                setState({...state, amount: text})
              }
              value={state.amount}
              placeholder="Enter amount you want to withdraw"
              style={{borderColor: APP_COLORS.PRODUCT_CARD_BORDER}}
            />
            {errors.amount.trim() !== '' && (
              <Text style={{color: 'red'}}>{errors.amount}</Text>
            )}
          </View>
          <Pressable
            onPress={() => handleSubmit()}
            style={{marginBottom: 10, marginTop: 10}}>
            <View style={[btnWithBgContainerStyles, viewFlexCenter]}>
              <Text style={[btnWithBgTextStyles]}>Withdraw</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default WithdrawRequest;
