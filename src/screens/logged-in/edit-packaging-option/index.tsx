import {View, Text, ScrollView, KeyboardAvoidingView} from 'react-native';
import React, {useState, useEffect} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import CustomTextInput from '../../../components/custom-text-input';
import {viewFlexSpace} from '../../../constants/styles';
import ImageLoader from '../../../components/image-loader';
import SubmitButton from '../../../components/submit-button';
import {
  normalAlert,
  returnErroMessage,
  setHeaders,
  toastMessage,
} from '../../../helpers';
import {
  INavigationPropWithRouteRequired,
  IPackagingOption,
  TOAST_MESSAGE_TYPES,
} from '../../../../interfaces';
import FullPageLoader from '../../../components/full-page-loader';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {app} from '../../../constants/app';
import {fetchPackagingOptions} from '../../../actions/packagingOptions';
import axios from 'axios';

const initialState = {
  id: '',
  name: '',
  color1: '',
  color2: '',
  color3: '',
  color4: '',
  amount: '',
  image: null as any,
  isActive: true,
};
const EditPackaging = ({
  navigation,
  route,
}: INavigationPropWithRouteRequired) => {
  const dispatch = useDispatch();
  const {option} = route.params as {option: IPackagingOption | undefined};
  const {token} = useSelector((state: RootState) => state.user);
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (option) {
      setState(option as any);
    }
  }, [option]);

  const handleSubmit = () => {
    if (state.name.trim() === '') {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'Please enter packaging name');
      return;
    }
    if (state.amount.toString().trim() === '') {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please enter amount for this packaging',
      );
      return;
    }
    if (state.color1.trim().length === 0) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please specify default color for this packaging',
      );
      return;
    }
    normalAlert({
      message: 'Do you want to update this packaging option?',
      hasCancleBtn: true,
      cancelText: 'No',
      okText: 'Yes, save',
      okHandler: handleSave,
    });
  };

  const handleSave = () => {
    setIsLoading(true);

    axios
      .put(app.BACKEND_URL + '/packagingoptions/', state, setHeaders(token))
      .then(res => {
        setIsLoading(false);
        normalAlert({
          message: res.data.msg,
          okHandler: () => navigation.goBack(),
          cancelHandler: () => navigation.goBack(),
        });
        dispatch(fetchPackagingOptions());
      })
      .catch(error => {
        setIsLoading(false);
        const err = returnErroMessage(error);
        normalAlert({
          message: err,
          hasCancleBtn: true,
          cancelText: 'close',
          okHandler: handleSave,
          okText: 'Try Again',
        });
      });
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: APP_COLORS.BACKGROUND_COLOR}}>
        <ScrollView contentContainerStyle={{flexGrow: 1, padding: 10}}>
          <View style={{marginBottom: 10}}>
            <Text>Packaging Name</Text>
            <CustomTextInput
              placeHolder="Enter Name"
              inputProps={{
                value: state.name,
                onChangeText: text => setState({...state, name: text}),
              }}
            />
          </View>
          <View style={{marginBottom: 10}}>
            <Text>Packaging amount</Text>
            <CustomTextInput
              placeHolder="Enter Amount in FRW"
              inputProps={{
                keyboardType: 'number-pad',
                value: state.amount,
                onChangeText: text => setState({...state, amount: text}),
              }}
            />
          </View>
          <View
            style={{
              marginBottom: 10,
              padding: 10,
              borderColor: APP_COLORS.BORDER_COLOR,
              borderWidth: 1,
              borderRadius: 5,
            }}>
            <Text style={{color: APP_COLORS.OXFORD_BLUE, marginBottom: 10}}>
              Colors
            </Text>
            <View style={[viewFlexSpace, {marginBottom: 10}]}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text
                  style={{
                    color: APP_COLORS.FOOTER_BODY_TEXT_COLOR,
                    textAlign: 'center',
                  }}>
                  Color 1
                </Text>
                <CustomTextInput
                  placeHolder="Color 1 ex: red"
                  inputProps={{
                    keyboardType: 'number-pad',
                    value: state.color1,
                    onChangeText: text => setState({...state, color1: text}),
                  }}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text
                  style={{
                    color: APP_COLORS.FOOTER_BODY_TEXT_COLOR,
                    textAlign: 'center',
                  }}>
                  Color 2 (optional)
                </Text>
                <CustomTextInput
                  placeHolder="Color 2"
                  inputStyles={{flex: 1, marginLeft: 5}}
                  inputProps={{
                    keyboardType: 'number-pad',
                    value: state.color2,
                    onChangeText: text => setState({...state, color2: text}),
                  }}
                />
              </View>
            </View>
            <View style={[viewFlexSpace]}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text
                  style={{
                    color: APP_COLORS.FOOTER_BODY_TEXT_COLOR,
                    textAlign: 'center',
                  }}>
                  Color 3 (optional)
                </Text>
                <CustomTextInput
                  placeHolder="Color 3"
                  inputProps={{
                    keyboardType: 'number-pad',
                    value: state.color3,
                    onChangeText: text => setState({...state, color3: text}),
                  }}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text
                  style={{
                    color: APP_COLORS.FOOTER_BODY_TEXT_COLOR,
                    textAlign: 'center',
                  }}>
                  Color 4 (optional)
                </Text>
                <CustomTextInput
                  placeHolder="Color 4"
                  inputStyles={{flex: 1, marginLeft: 5}}
                  inputProps={{
                    keyboardType: 'number-pad',
                    value: state.color4,
                    onChangeText: text => setState({...state, color4: text}),
                  }}
                />
              </View>
            </View>
          </View>
          <SubmitButton
            title="Update"
            buttonProps={{onPress: () => handleSubmit()}}
          />
        </ScrollView>
      </View>
      <FullPageLoader isLoading={isLoading} />
    </KeyboardAvoidingView>
  );
};

export default EditPackaging;
