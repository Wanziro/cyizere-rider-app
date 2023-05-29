import {
  View,
  ActivityIndicator,
  Image,
  ImageStyle,
  ImageProps,
} from 'react-native';
import React, {useState} from 'react';
import {viewFlexCenter} from '../../constants/styles';

interface IImageLoaderProps {
  url: string;
  width: number;
  height: number;
  style?: ImageStyle;
  imageProps?: ImageProps;
  isBanner?: boolean;
  showLoader?: true;
  loaderWidth?: number;
  loaderStyle?: any;
}
const ImageLoader = ({
  url,
  width,
  height,
  style,
  isBanner,
  showLoader,
  loaderWidth,
  loaderStyle,
  imageProps,
}: IImageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={{width, height, position: 'relative'}}>
      {isLoading && (
        <View style={{width, height, position: 'absolute', top: 0, zIndex: 2}}>
          {showLoader ? (
            <View style={[viewFlexCenter, {flex: 1}]}>
              <ActivityIndicator
                size={loaderWidth !== undefined ? loaderWidth : 50}
                style={loaderStyle !== undefined ? loaderStyle : {}}
              />
            </View>
          ) : isBanner ? (
            <Image
              source={require('../../assets/placeholder_banner.jpg')}
              style={[{width, height}, {...style}]}
              {...imageProps}
            />
          ) : (
            <Image
              source={require('../../assets/placeholder_image.jpg')}
              style={[{width, height}, {...style}]}
              {...imageProps}
            />
          )}
        </View>
      )}
      <Image
        source={{uri: url}}
        style={[{width, height, zIndex: 1}, {...style}]}
        {...imageProps}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
    </View>
  );
};

export default ImageLoader;
