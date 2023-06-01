import {View, Text, Image, Pressable, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import WhiteCard from '../../../../../components/white-card';
import {viewFlexSpace} from '../../../../../constants/styles';
import {
  INavigationProp,
  IOrder,
  IProduct,
  TOAST_MESSAGE_TYPES,
} from '../../../../../../interfaces';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../reducers';
import {app} from '../../../../../constants/app';
import {APP_COLORS} from '../../../../../constants/colors';
import {currencyFormatter, toastMessage} from '../../../../../helpers';
interface IItemProps extends INavigationProp {
  item: IOrder;
  setShowCodeModel: any;
  setSelectedItem: any;
}
const Item = ({
  item,
  navigation,
  setSelectedItem,
  setShowCodeModel,
}: IItemProps) => {
  const {products} = useSelector((state: RootState) => state.products);
  const [product, setProduct] = useState<IProduct | undefined>(undefined);
  useEffect(() => {
    if (item.cartItems.length > 0) {
      const prod = products.find(i => i.pId === item.cartItems[0].productId);
      if (prod) {
        setProduct(prod);
      }
    }
  }, [item]);

  const handleCall = () => {
    if (item.client.phone) {
      Linking.openURL(`tel:${item.client.phone}`);
    } else {
      toastMessage(
        TOAST_MESSAGE_TYPES.INFO,
        "Something went wrong, can't call client",
      );
    }
  };
  return (
    <WhiteCard style={{marginBottom: 10}}>
      <View style={[viewFlexSpace]}>
        <View>
          <Image
            source={{uri: app.FILE_URL + product?.image}}
            style={{width: 100, height: 100}}
            resizeMode="contain"
          />
        </View>
        <View style={{flex: 1, padding: 10}}>
          <View style={[viewFlexSpace, {alignItems: 'flex-start'}]}>
            <Text
              style={{
                color: APP_COLORS.BLACK,
                fontWeight: '600',
                flex: 1,
                marginRight: 5,
              }}>
              {product?.name}
            </Text>
            <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
              Order Id: #{item.id}
            </Text>
          </View>
          <View style={[viewFlexSpace, {alignItems: 'flex-start'}]}>
            <View>
              <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                {item.cartItems.length} Items
              </Text>
              <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                {currencyFormatter(
                  Number(item.cartTotalAmount) +
                    Number(item.deliveryFees) +
                    Number(item.packagingFees) +
                    Number(item.systemFees),
                )}{' '}
                RWF
              </Text>
            </View>
            <Text
              style={{
                color: APP_COLORS.TEXT_GRAY,
                width: '50%',
                textAlign: 'right',
              }}>
              {new Date(item.createdAt).toUTCString()}
            </Text>
          </View>
          <View style={[viewFlexSpace, {alignItems: 'flex-start'}]}>
            <View style={{flex: 1}}>
              <Text style={{color: APP_COLORS.BLACK, fontWeight: 'bold'}}>
                Delivery Status:
              </Text>
            </View>
            <Text>{item.deliveryStatus}</Text>
          </View>
        </View>
      </View>
      <View
        style={[
          viewFlexSpace,
          {
            padding: 10,
            borderTopColor: APP_COLORS.BORDER_COLOR,
            borderTopWidth: 1,
          },
        ]}>
        <Pressable
          onPress={() => navigation.navigate('OrderPreview', {order: item})}>
          <Text style={{color: APP_COLORS.BLACK}}>View Order</Text>
        </Pressable>
        <Pressable onPress={() => handleCall()}>
          <Text style={{color: APP_COLORS.BLACK}}>Call Client</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('ViewRoute', {order: item})}>
          <Text style={{color: APP_COLORS.BLACK}}>View Route</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setSelectedItem(item);
            setShowCodeModel(true);
          }}>
          <Text style={{color: APP_COLORS.ORANGE}}>Finish</Text>
        </Pressable>
      </View>
    </WhiteCard>
  );
};

export default Item;
