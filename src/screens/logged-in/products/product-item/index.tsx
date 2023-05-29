import {View, Text, TouchableOpacity, Pressable} from 'react-native';
import React from 'react';
import {
  INavigationProp,
  IProduct,
  PRICE_TYPE_ENUM,
  TOAST_MESSAGE_TYPES,
} from '../../../../../interfaces';
import ImageLoader from '../../../../components/image-loader';
import {viewFlexSpace} from '../../../../constants/styles';
import {APP_COLORS} from '../../../../constants/colors';
import {
  currencyFormatter,
  normalAlert,
  returnErroMessage,
  setHeaders,
  toastMessage,
} from '../../../../helpers';
import DocumentPicker from 'react-native-document-picker';
import {app} from '../../../../constants/app';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import {IUserReducer} from '../../../../reducers/user';
import {setAddOrUpdateProduct} from '../../../../actions/products';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
interface IProductItemProps extends INavigationProp {
  item: IProduct;
  setShowLoader: any;
}
const ProductItem = ({item, setShowLoader, navigation}: IProductItemProps) => {
  const dispatch = useDispatch();
  const {token} = useSelector((state: RootState) => state.user as IUserReducer);
  const {prices} = useSelector((state: RootState) => state.productPrices);

  const handleDocumentSelect = async () => {
    try {
      const results = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        allowMultiSelection: false,
      });

      normalAlert({
        message: 'Do you want to upload selected image?',
        hasCancleBtn: true,
        cancelText: 'NO',
        okText: 'Yes, UPload',
        okHandler: () => handleUpload(results),
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const handleUpload = (image: any) => {
    const doc: any = {
      uri: image?.uri,
      type: image?.type,
      name: image?.name,
    };
    const formData = new FormData();
    formData.append('file', doc);
    formData.append('pId', item.pId);

    setShowLoader(true);
    const url = app.BACKEND_URL + '/products/image';
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.onload = function () {
      setShowLoader(false);
      try {
        const response = JSON.parse(xhr.response);
        if (xhr.status === 201) {
          dispatch(setAddOrUpdateProduct(response.product));
          //   normalAlert({message: response.msg});
        } else {
          normalAlert({
            message: response.msg,
          });
        }
      } catch (error) {
        normalAlert({message: xhr.response});
        normalAlert({
          message: xhr.response,
        });
      }
    };
    xhr.setRequestHeader('token', token);
    xhr.send(formData);
  };

  const handleHideProduct = () => {
    setShowLoader(true);
    axios
      .put(app.BACKEND_URL + '/products/status', {...item}, setHeaders(token))
      .then(res => {
        setShowLoader(false);
        dispatch(setAddOrUpdateProduct(res.data.product));
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
      })
      .catch(error => {
        setShowLoader(false);
        const err = returnErroMessage(error);
        normalAlert({message: err});
      });
  };

  return (
    <View
      style={[
        {
          padding: 10,
          borderRadius: 10,
          backgroundColor: APP_COLORS.WHITE,
          marginBottom: 10,
        },
      ]}>
      <View
        style={[
          viewFlexSpace,
          {
            alignItems: 'flex-start',
            paddingBottom: 10,
          },
        ]}>
        <ImageLoader width={50} height={50} url={app.FILE_URL + item.image} />
        <View style={{flex: 1, marginLeft: 10}}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '500'}}>
            {item.name}
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}} numberOfLines={2}>
            {item.description}
          </Text>
          {item.priceType === PRICE_TYPE_ENUM.SINGLE && (
            <Text style={{color: APP_COLORS.ORANGE}}>
              Price: {currencyFormatter(item.singlePrice)} RWF
            </Text>
          )}
          {item.priceType === PRICE_TYPE_ENUM.MANY && (
            <Pressable
              onPress={() =>
                navigation.navigate('ProductPrices', {product: item})
              }>
              <Text style={{color: APP_COLORS.ORANGE}}>
                View all pricing options
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      {item.priceType === PRICE_TYPE_ENUM.MANY &&
        prices.filter(it => it.productId === item.pId).length === 0 && (
          <View
            style={[
              viewFlexSpace,
              {backgroundColor: APP_COLORS.RED, padding: 10},
            ]}>
            <Icon name="warning" color={APP_COLORS.WHITE} size={20} />
            <Text style={{color: APP_COLORS.WHITE, flex: 1, marginLeft: 10}}>
              This product can not be sold unless you add its pricing categories
            </Text>
          </View>
        )}
      <View
        style={[
          viewFlexSpace,
          {
            borderTopColor: APP_COLORS.BORDER_COLOR,
            borderTopWidth: 1,
            paddingTop: 10,
          },
        ]}>
        <TouchableOpacity onPress={() => handleDocumentSelect()}>
          <Text style={{color: APP_COLORS.BLACK}}>Update Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            normalAlert({
              message: `Do you want to update status of this ${item.name}`,
              hasCancleBtn: true,
              cancelText: 'No',
              okText: 'Yes, update',
              okHandler: handleHideProduct,
            })
          }>
          <Text style={{color: APP_COLORS.BLACK}}>
            {item.isActive ? 'Hide Product' : 'UnHide Product'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProduct', {product: item})}>
          <Text style={{color: APP_COLORS.BLACK}}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductItem;
