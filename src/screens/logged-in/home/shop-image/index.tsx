import {View, Image, Alert, Dimensions, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {APP_COLORS} from '../../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import {app} from '../../../../constants/app';
import {toastMessage} from '../../../../helpers';
import {TOAST_MESSAGE_TYPES} from '../../../../../interfaces';
import {useDispatch} from 'react-redux';
import {setUserShopImage} from '../../../../actions/user';
import ImageLoader from '../../../../components/image-loader';

interface IShopImageProps {
  shopImage: string;
  token: string;
  setIsLoading: any;
}
const {width} = Dimensions.get('window');
const ShopImage = ({shopImage, token, setIsLoading}: IShopImageProps) => {
  const dispatch = useDispatch();

  const handleComfirm = () => {
    Alert.alert(
      'Cyizere',
      'Do you want to update your shop image?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => handleDocumentSelect(),
        },
      ],
      {cancelable: true},
    );
  };

  const handleDocumentSelect = async () => {
    try {
      const results = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });
      const doc = {
        uri: results?.uri,
        type: results?.type,
        name: results?.name,
      };
      const formData = new FormData();
      formData.append('file', doc);
      setIsLoading(true);
      const url = app.BACKEND_URL + '/suppliers/image/';
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.onload = function () {
        setIsLoading(false);
        try {
          const response = JSON.parse(xhr.response);
          if (xhr.status === 200) {
            const {image} = response;
            dispatch(setUserShopImage(image));
          } else {
            toastMessage(TOAST_MESSAGE_TYPES.ERROR, response.msg);
          }
        } catch (error) {
          toastMessage(TOAST_MESSAGE_TYPES.ERROR, xhr.response);
        }
      };
      xhr.setRequestHeader('token', token);
      xhr.send(formData);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  return (
    <View style={{position: 'relative', height: 150}}>
      {shopImage.trim() === '' ? (
        <Image
          source={require('../../../../assets/placeholder_banner.jpg')}
          style={{height: 150, width}}
        />
      ) : (
        <ImageLoader
          height={150}
          width={width}
          url={app.FILE_URL + shopImage}
          isBanner={true}
          imageProps={{resizeMode: 'cover'}}
        />
      )}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          padding: 10,
          zIndex: 3,
        }}>
        <TouchableOpacity onPress={() => handleComfirm()}>
          <View
            style={{
              backgroundColor: APP_COLORS.ORANGE,
              borderRadius: 10,
              padding: 5,
            }}>
            <Icon
              name="square-edit-outline"
              size={30}
              color={APP_COLORS.WHITE}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShopImage;
