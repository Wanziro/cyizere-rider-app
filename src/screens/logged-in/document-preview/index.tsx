import {ActivityIndicator, Image, Text, View} from 'react-native';
import React, {useState} from 'react';
import Pdf from 'react-native-pdf';
import {useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {IUserReducer} from '../../../reducers/user';
import {app} from '../../../constants/app';
import {Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {APP_COLORS} from '../../../constants/colors';
import ImageLoader from '../../../components/image-loader';
const {width, height} = Dimensions.get('window');
const DocumentPreview = () => {
  const {idNumberDocument} = useSelector(
    (state: RootState) => state.user,
  ) as IUserReducer;
  const isImageFile = (filePath: any) => {
    const extension = filePath.split('.').pop().toLowerCase();
    return (
      extension === 'jpg' ||
      extension === 'jpeg' ||
      extension === 'png' ||
      extension === 'gif'
    );
  };
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {isImageFile(idNumberDocument) ? (
        <ImageLoader
          url={app.FILE_URL + idNumberDocument}
          width={width}
          height={height - 100}
        />
      ) : (
        <Pdf
          source={{
            uri: app.FILE_URL + idNumberDocument,
          }}
          style={{flex: 1, width}}
        />
      )}
    </View>
  );
};

export default DocumentPreview;
