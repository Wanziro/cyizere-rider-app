import {View, Text, ScrollView, KeyboardAvoidingView} from 'react-native';
import React, {useState} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import CustomTextInput from '../../../components/custom-text-input';
import {viewFlexSpace} from '../../../constants/styles';
import ImageLoader from '../../../components/image-loader';
import DocumentPicker from 'react-native-document-picker';
import SubmitButton from '../../../components/submit-button';
import {normalAlert, toastMessage} from '../../../helpers';
import {INavigationProp, TOAST_MESSAGE_TYPES} from '../../../../interfaces';
import FullPageLoader from '../../../components/full-page-loader';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {app} from '../../../constants/app';
import {fetchPackagingOptions} from '../../../actions/packagingOptions';

const initialState = {
  name: '',
  color1: '',
  color2: '',
  color3: '',
  color4: '',
  amount: '',
  image: null as any,
  isActive: true,
};
const AddPackaging = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const {token} = useSelector((state: RootState) => state.user);
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDocumentSelect = async () => {
    try {
      const results = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        allowMultiSelection: false,
      });
      setState({...state, image: results as any});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

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
    if (state.image === null) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please choose image of this  packaging',
      );
      return;
    }
    normalAlert({
      message: 'Do you want to save this packaging option?',
      hasCancleBtn: true,
      cancelText: 'No',
      okText: 'Yes, save',
      okHandler: handleSave,
    });
  };

  const handleSave = () => {
    const doc: any = {
      uri: state.image?.uri,
      type: state.image?.type,
      name: state.image?.name,
    };
    const formData = new FormData();
    formData.append('file', doc);
    formData.append('name', state.name);
    formData.append('amount', state.amount);
    formData.append('color1', state.color1);
    formData.append('color2', state.color2);
    formData.append('color3', state.color3);
    formData.append('color4', state.color4);

    setIsLoading(true);
    const url = app.BACKEND_URL + '/packagingoptions/';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = function () {
      setIsLoading(false);
      try {
        const response = JSON.parse(xhr.response);
        if (xhr.status === 201) {
          normalAlert({message: response.msg});
          setState(initialState);
          dispatch(fetchPackagingOptions());
          navigation.goBack();
        } else {
          normalAlert({
            message: response.msg,
            hasCancleBtn: true,
            cancelText: 'close',
            okHandler: handleSave,
            okText: 'Try Again',
          });
        }
      } catch (error) {
        normalAlert({
          message: xhr.response,
          hasCancleBtn: true,
          cancelText: 'close',
          okHandler: handleSave,
          okText: 'Try Again',
        });
      }
    };
    xhr.setRequestHeader('token', token);
    xhr.send(formData);
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
          <View style={[viewFlexSpace, {marginBottom: 5}]}>
            {state.image != null && (
              <View style={{marginTop: 10}}>
                <Text style={{color: APP_COLORS.BLACK}}>Packaging Image</Text>
                <ImageLoader
                  height={100}
                  width={100}
                  url={state.image?.uri}
                  showLoader
                  imageProps={{
                    style: {borderRadius: 10, width: 100, height: 100},
                    resizeMode: 'contain',
                  }}
                />
              </View>
            )}
            <SubmitButton
              buttonProps={{onPress: () => handleDocumentSelect()}}
              title={state.image === null ? 'Choose image' : 'Change image'}
              containerStyle={{backgroundColor: APP_COLORS.CARD_SHADOW_COLOR}}
            />
          </View>
          <SubmitButton
            title="Save"
            buttonProps={{onPress: () => handleSubmit()}}
          />
        </ScrollView>
      </View>
      <FullPageLoader isLoading={isLoading} />
    </KeyboardAvoidingView>
  );
};

export default AddPackaging;
