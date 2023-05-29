import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import {RootState} from '../../../reducers';
import {
  INavigationProp,
  IProduct,
  IUser,
  PRICE_TYPE_ENUM,
  TOAST_MESSAGE_TYPES,
} from '../../../../interfaces';
import NotVerified from '../../../components/not-verified';
import {fetchUserStatusSilent} from '../../../actions/user';
import {APP_COLORS} from '../../../constants/colors';
import CustomTextInput from '../../../components/custom-text-input';
import {Picker} from '@react-native-picker/picker';
import {
  commonInput,
  viewFlexCenter,
  viewFlexSpace,
} from '../../../constants/styles';
import {fetchProductCategories} from '../../../actions/productCategories';
import Icon from 'react-native-vector-icons/FontAwesome';
import SubmitButton from '../../../components/submit-button';
import ImageLoader from '../../../components/image-loader';
import {normalAlert, toastMessage} from '../../../helpers';
import {app} from '../../../constants/app';
import FullPageLoader from '../../../components/full-page-loader';
import {fetchProducts} from '../../../actions/products';

interface IState {
  pId: number;
  supplierId: number;
  categoryId: number;
  name: string;
  description: string;
  priceType: PRICE_TYPE_ENUM;
  singlePrice: number;
  image: any;
  isActive: boolean;
}
const initialState: IState = {
  pId: 0,
  supplierId: '' as any,
  categoryId: '' as any,
  name: '',
  description: '',
  priceType: '' as any,
  singlePrice: '' as any,
  image: null as any,
  isActive: true,
};
const AddProduct = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const {isVerified, shopCategoryId, token} = useSelector(
    (state: RootState) => state.user as IUser,
  );
  const {categories} = useSelector(
    (state: RootState) => state.productCategories,
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [state, setState] = useState<IState>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchUserStatusSilent());
    dispatch(fetchProductCategories());
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    dispatch(fetchProductCategories());
  }, []);

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
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'Please enter product name');
      return;
    }
    if (state.categoryId.toString().trim() === '') {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'Please choose product category');
      return;
    }
    if (state.description.toString().trim().length < 10) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Product description must be atleast 10 characters',
      );
      return;
    }
    if (state.priceType.toString().trim().length === 0) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please choose price type of this product',
      );
      return;
    }
    if (
      state.priceType === PRICE_TYPE_ENUM.SINGLE &&
      (state.singlePrice.toString().trim() === '' || state.singlePrice == 0)
    ) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please enter price of this product',
      );
      return;
    }
    if (state.priceType === PRICE_TYPE_ENUM.MANY) {
      setState({...state, singlePrice: 0});
    }
    if (state.image === null) {
      toastMessage(
        TOAST_MESSAGE_TYPES.ERROR,
        'Please choose image of this product',
      );
      return;
    }
    normalAlert({
      message: 'Do you want to save this product?',
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
    formData.append('categoryId', state.categoryId);
    formData.append('name', state.name);
    formData.append('description', state.description);
    formData.append('priceType', state.priceType);
    formData.append('singlePrice', state.singlePrice);

    setIsLoading(true);
    const url = app.BACKEND_URL + '/products/';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = function () {
      setIsLoading(false);
      try {
        const response = JSON.parse(xhr.response);
        if (xhr.status === 201) {
          normalAlert({message: response.msg});
          setState(initialState);
          dispatch(fetchProducts());
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
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {!isVerified ? (
          <NotVerified navigation={navigation} />
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: APP_COLORS.BACKGROUND_COLOR,
              padding: 10,
            }}>
            <View style={{marginBottom: 5}}>
              <Text
                style={{
                  color: APP_COLORS.FOOTER_BODY_TEXT_COLOR,
                  marginTop: 10,
                }}>
                Product Name
              </Text>
              <CustomTextInput
                placeHolder="Product Name"
                inputProps={{
                  value: state.name,
                  onChangeText: (text: string) =>
                    setState({...state, name: text}),
                }}
              />
            </View>
            <View style={{marginBottom: 5}}>
              <Picker
                selectedValue={state.categoryId}
                onValueChange={(itemValue, itemIndex) =>
                  setState({...state, categoryId: itemValue})
                }
                style={commonInput}>
                {[
                  {name: 'Choose category', id: ''},
                  ...categories.filter(
                    item => item.shopCategoryId === shopCategoryId,
                  ),
                ].map((category, i) => (
                  <Picker.Item
                    key={i}
                    label={category.name}
                    value={category.id}
                  />
                ))}
              </Picker>
            </View>
            <View style={{marginBottom: 5}}>
              <Text
                style={{
                  color: APP_COLORS.FOOTER_BODY_TEXT_COLOR,
                  marginTop: 10,
                }}>
                Description
              </Text>
              <TextInput
                placeholderTextColor={APP_COLORS.GRAY}
                style={[
                  {
                    padding: 5,
                    color: APP_COLORS.BLACK,
                    maxHeight: 250,
                    minHeight: 100,
                    textAlignVertical: 'top',
                  },
                  commonInput,
                ]}
                placeholder="Product description"
                multiline={true}
                onChangeText={text => setState({...state, description: text})}
                value={state.description}
              />
            </View>
            <View
              style={{
                marginBottom: 5,
                padding: 10,
                borderColor: APP_COLORS.BORDER_COLOR,
                borderWidth: 1,
              }}>
              <View style={[viewFlexSpace]}>
                <Text style={{color: APP_COLORS.BLACK}}>Price Type:</Text>
                <Pressable
                  onPress={() =>
                    setState({...state, priceType: PRICE_TYPE_ENUM.SINGLE})
                  }>
                  <View style={[viewFlexCenter]}>
                    <Icon
                      name={
                        state.priceType === PRICE_TYPE_ENUM.SINGLE
                          ? 'check-circle-o'
                          : 'circle-o'
                      }
                      size={25}
                      color={APP_COLORS.BLACK}
                    />
                    <Text style={{color: APP_COLORS.BLACK}}>Single</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() =>
                    setState({...state, priceType: PRICE_TYPE_ENUM.MANY})
                  }>
                  <View style={[viewFlexCenter]}>
                    <Icon
                      name={
                        state.priceType === PRICE_TYPE_ENUM.MANY
                          ? 'check-circle-o'
                          : 'circle-o'
                      }
                      size={25}
                      color={APP_COLORS.BLACK}
                    />
                    <Text style={{color: APP_COLORS.BLACK}}>Many</Text>
                  </View>
                </Pressable>
              </View>
            </View>
            {state.priceType === PRICE_TYPE_ENUM.SINGLE && (
              <View style={{marginBottom: 5}}>
                <CustomTextInput
                  placeHolder="Enter price in RWF"
                  inputProps={{
                    onChangeText: (text: string) =>
                      setState({...state, singlePrice: text as any}),
                    value: String(state.singlePrice),
                    keyboardType: 'number-pad',
                  }}
                />
              </View>
            )}
            <View style={[viewFlexSpace, {marginBottom: 5}]}>
              {state.image != null && (
                <View style={{marginTop: 10}}>
                  <Text style={{color: APP_COLORS.BLACK}}>Product Image</Text>
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
              buttonProps={{onPress: () => handleSubmit()}}
              title="Save product"
            />
          </View>
        )}
      </ScrollView>
      <FullPageLoader isLoading={isLoading} />
    </KeyboardAvoidingView>
  );
};

export default AddProduct;
