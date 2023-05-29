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
  INavigationPropWithRouteRequired,
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
import {
  normalAlert,
  returnErroMessage,
  setHeaders,
  toastMessage,
} from '../../../helpers';
import {app} from '../../../constants/app';
import FullPageLoader from '../../../components/full-page-loader';
import axios from 'axios';
import {setAddOrUpdateProduct} from '../../../actions/products';

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
const EditProduct = ({navigation, route}: INavigationPropWithRouteRequired) => {
  const dispatch = useDispatch();
  const {product} = route.params as {product: IProduct};
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

  useEffect(() => {
    setState(product);
  }, [product]);

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

    normalAlert({
      message: 'Do you want to update this product?',
      hasCancleBtn: true,
      cancelText: 'No',
      okText: 'Yes, Update',
      okHandler: handleSave,
    });
  };

  const handleSave = () => {
    setIsLoading(true);
    const url = app.BACKEND_URL + '/products/';

    axios
      .put(url, {...state}, setHeaders(token))
      .then(res => {
        setIsLoading(false);
        dispatch(setAddOrUpdateProduct(res.data.product));
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
        navigation.goBack();
      })
      .catch(error => {
        setIsLoading(false);
        const err = returnErroMessage(error);
        normalAlert({message: err});
      });
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
            <SubmitButton
              buttonProps={{onPress: () => handleSubmit()}}
              title="Update Product"
            />
          </View>
        )}
      </ScrollView>
      <FullPageLoader isLoading={isLoading} />
    </KeyboardAvoidingView>
  );
};

export default EditProduct;
