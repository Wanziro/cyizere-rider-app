import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

import Modal from 'react-native-modal';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import {APP_COLORS} from '../../../../constants/colors';
import {
  btnWithBgContainerStyles,
  btnWithBgTextStyles,
  viewFlexCenter,
  viewFlexSpace,
} from '../../../../constants/styles';
import DisabledInput from '../../../../components/disabled-input';
import {errorHandler, setHeaders, toastMessage} from '../../../../helpers';
import {app} from '../../../../constants/app';
import {TOAST_MESSAGE_TYPES} from '../../../../../interfaces';
import {setUserIdNumber} from '../../../../actions/user';
import CustomModal from '../../../../components/custom-modal';
import SubmitButton from '../../../../components/submit-button';

interface IDepositProps {
  showModal: boolean;
  setShowModal: any;
}
const initialErrorState = {idNumber: ''};
const UpdateIDNo = ({showModal, setShowModal}: IDepositProps) => {
  const dispatch = useDispatch();
  const {token, idNumber} = useSelector((state: RootState) => state.user);
  const initialState = {idNumber} as any;
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState(initialErrorState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setErrors(initialErrorState);
    if (state.idNumber.trim() === '' || state.idNumber.length < 16) {
      setErrors({
        ...errors,
        idNumber: 'Please enter a valid ID/Passport Number',
      });
      return;
    }
    setIsSubmitting(true);

    axios
      .put(app.BACKEND_URL + '/suppliers/idno/', state, setHeaders(token))
      .then(res => {
        setShowModal(false);
        setIsSubmitting(false);
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
        dispatch(setUserIdNumber(res.data.idNumber));
      })
      .catch(error => {
        setIsSubmitting(false);
        errorHandler(error);
      });
  };

  useEffect(() => {
    setErrors(initialErrorState);
    setState({...state, idNumber: idNumber});
  }, [showModal]);

  return (
    <CustomModal isVisible={showModal}>
      <View style={[viewFlexSpace]}>
        <Text
          style={{
            fontWeight: '700',
            marginBottom: 10,
            color: APP_COLORS.BLACK,
            fontSize: 16,
          }}>
          Update ID/Passport Number
        </Text>
        <View>
          <Pressable
            onPress={() => setShowModal(false)}
            disabled={isSubmitting}>
            <Icon name="close" size={25} color={APP_COLORS.BLACK} />
          </Pressable>
        </View>
      </View>
      <View style={{marginTop: 15}}>
        <View style={{marginBottom: 10}}>
          <DisabledInput
            onChangeText={(text: string) =>
              setState({...state, idNumber: text})
            }
            value={state.idNumber}
            placeholder="Enter your ID/Passport Number"
            style={{borderColor: APP_COLORS.PRODUCT_CARD_BORDER}}
            disabled={isSubmitting}
            maxLength={16}
          />
          {errors.idNumber.trim() !== '' && (
            <Text style={{color: 'red'}}>{errors.idNumber}</Text>
          )}
        </View>
        <SubmitButton
          title="Submit"
          containerStyle={{marginBottom: 5}}
          titleComponent={
            <View style={[viewFlexCenter]}>
              {isSubmitting && (
                <ActivityIndicator
                  color={APP_COLORS.WHITE}
                  style={{marginRight: 5}}
                />
              )}
              <Text style={[btnWithBgTextStyles]}>Submit</Text>
            </View>
          }
          buttonProps={{onPress: () => handleSubmit()}}
        />
      </View>
    </CustomModal>
  );
};

export default UpdateIDNo;
