import {View, Text, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import WhiteCard from '../../../../../components/white-card';
import {viewFlexCenter, viewFlexSpace} from '../../../../../constants/styles';
import {INavigationProp, IOrder, IProduct} from '../../../../../../interfaces';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../reducers';
import {app} from '../../../../../constants/app';
import {APP_COLORS} from '../../../../../constants/colors';
import {currencyFormatter} from '../../../../../helpers';
import TimeAgo from '@andordavoti/react-native-timeago';
import Icon from 'react-native-vector-icons/Ionicons';
interface IItemProps extends INavigationProp {
  item: IOrder;
}
const Item = ({item, navigation}: IItemProps) => {
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
  return (
    <Pressable
      onPress={() => navigation.navigate('OrderPreview', {order: item})}>
      <WhiteCard style={{marginBottom: 10}}>
        <View style={[viewFlexSpace, {justifyContent: 'flex-start'}]}>
          <View>
            <Image
              source={{uri: app.FILE_URL + product?.image}}
              style={{width: 100, height: 100}}
              resizeMode="contain"
            />
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
              {product?.name}
            </Text>
            <View style={[viewFlexSpace]}>
              <View style={{flex: 1, paddingRight: 10}}>
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
              <View style={[viewFlexCenter, {paddingRight: 10}]}>
                <Icon name="time" size={25} color={APP_COLORS.GRAY} />
                <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                  <TimeAgo dateTo={new Date(item.createdAt)} />
                </Text>
              </View>
            </View>
          </View>
        </View>
      </WhiteCard>
    </Pressable>
  );
};

export default Item;
