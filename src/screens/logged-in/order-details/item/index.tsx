import {View, Text, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import WhiteCard from '../../../../components/white-card';
import {viewFlexSpace} from '../../../../constants/styles';
import {
  ICartItem,
  INavigationProp,
  IOrder,
  IProduct,
  IProductPrice,
} from '../../../../../interfaces';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import {app} from '../../../../constants/app';
import {APP_COLORS} from '../../../../constants/colors';
import {currencyFormatter} from '../../../../helpers';
import ImageLoader from '../../../../components/image-loader';
interface IItemProps {
  item: ICartItem;
}
const Item = ({item}: IItemProps) => {
  const {products} = useSelector((state: RootState) => state.products);
  const {prices} = useSelector((state: RootState) => state.productPrices);
  const [product, setProduct] = useState<IProduct | undefined>(undefined);
  const [productPrice, setProductPrice] = useState<IProductPrice | undefined>(
    undefined,
  );
  useEffect(() => {
    if (item) {
      const prod = products.find(i => i.pId === item.productId);
      const price = prices.find(i => i.ppId === item.ppId);
      if (prod) {
        setProduct(prod);
      }
      if (price) {
        setProductPrice(price);
      }
    }
  }, [item]);
  return (
    <View style={[viewFlexSpace, {alignItems: 'flex-start'}]}>
      <View>
        <ImageLoader
          url={app.FILE_URL + product?.image}
          width={50}
          height={50}
          style={{borderRadius: 100}}
        />
      </View>
      <View style={{flex: 1, padding: 10}}>
        <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
          {product?.name}
        </Text>
        <View>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {productPrice?.name !== undefined && productPrice.name + ' '}
            {item.quantity} x {currencyFormatter(item.price)} ={' '}
            {currencyFormatter(item.quantity * item.price)} RWF
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Item;
