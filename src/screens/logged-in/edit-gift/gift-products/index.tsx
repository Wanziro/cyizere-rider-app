import {
  View,
  Text,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {viewFlexCenter, viewFlexSpace} from '../../../../constants/styles';
import SubmitButton from '../../../../components/submit-button';
import {APP_COLORS} from '../../../../constants/colors';
import {ADD_GIFT_STEPS_ENUM, IGiftState} from '..';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import {IProduct, TOAST_MESSAGE_TYPES} from '../../../../../interfaces';
import NotFound from '../../../../components/not-found';
import ImageLoader from '../../../../components/image-loader';
import {app} from '../../../../constants/app';
import Icon from 'react-native-vector-icons/Feather';
import {toastMessage} from '../../../../helpers';

const {width} = Dimensions.get('window');
interface IstepProps {
  setActiveStep: any;
  state: IGiftState;
  setState: any;
}

interface IProductItemProps extends IstepProps {
  item: IProduct;
  index: number;
}
const ProductItem = ({item, index, state, setState}: IProductItemProps) => {
  const [exists, setExists] = useState(false);
  const handleAddOrRemoveProduct = () => {
    let products = state.products;
    const prod = products.find(p => p.pId === item.pId);
    if (prod) {
      products = products.filter(prod => prod.pId !== item.pId);
    } else {
      products.push(item);
    }
    setState({...state, products});
  };

  useEffect(() => {
    let sub = true;
    if (sub) {
      let products = state.products;
      const prod = products.find(p => p.pId === item.pId);
      if (prod) {
        setExists(true);
      } else {
        setExists(false);
      }
    }
    return () => {
      sub = false;
    };
  }, [state]);
  return (
    <View
      style={{
        width: width / 2 - 10,
        position: 'relative',
        marginRight: index % 2 === 0 ? 5 : 0,
        marginLeft: index % 2 !== 0 ? 5 : 0,
        marginBottom: 10,
        backgroundColor: APP_COLORS.WHITE,
        borderRadius: 10,
      }}>
      <TouchableOpacity onPress={() => handleAddOrRemoveProduct()}>
        <ImageLoader
          url={app.FILE_URL + item.image}
          width={width / 2 - 10}
          height={150}
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        />
      </TouchableOpacity>
      <View style={{padding: 10}}>
        <Text
          style={{color: APP_COLORS.FOOTER_BODY_TEXT_COLOR}}
          numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1,
        }}>
        <TouchableOpacity onPress={() => handleAddOrRemoveProduct()}>
          <View
            style={[
              viewFlexCenter,
              {
                backgroundColor: 'rgba(255,255,255,0.5)',
                padding: 20,
                borderRadius: 100,
              },
            ]}>
            <Icon
              name={exists ? 'check-circle' : 'circle'}
              size={40}
              color={APP_COLORS.BLACK}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const GiftProducts = ({setActiveStep, state, setState}: IstepProps) => {
  const {products} = useSelector((state: RootState) => state.products);

  const handleContinue = () => {
    if (state.products.length === 0) {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'Please select products');
      return;
    }
    setActiveStep(ADD_GIFT_STEPS_ENUM.GIFT_PACKAGING_OPTIONS);
  };
  return (
    <View style={[viewFlexSpace, {flex: 1, flexDirection: 'column'}]}>
      <View style={{flex: 1, width, paddingHorizontal: 10, marginTop: 10}}>
        <FlatList
          data={products}
          showsVerticalScrollIndicator={false}
          renderItem={info => (
            <ProductItem
              item={info.item}
              key={info.index}
              index={info.index}
              setActiveStep={setActiveStep}
              state={state}
              setState={setState}
            />
          )}
          numColumns={2}
          refreshing={false}
        />
        {products.length === 0 && <NotFound title="No products found" />}
      </View>
      <View
        style={{
          width,
          padding: 10,
          borderTopColor: APP_COLORS.PRODUCT_CARD_BORDER,
          borderTopWidth: 1,
        }}>
        <SubmitButton
          title={`Selected (${state.products.length}), Continue`}
          buttonProps={{onPress: () => handleContinue()}}
        />
      </View>
    </View>
  );
};

export default GiftProducts;
