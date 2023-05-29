import {View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APP_COLORS} from '../../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import {fetchProducts} from '../../../../actions/products';
import LoaderComponent from '../../../../components/loader-component';
import {INavigationProp} from '../../../../../interfaces';
import FullPageLoader from '../../../../components/full-page-loader';
import ProductItem from '../product-item';
import NotFound from '../../../../components/not-found';

const HiddenProducts = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const {products, isLoading} = useSelector(
    (state: RootState) => state.products,
  );
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: APP_COLORS.BACKGROUND_COLOR,
            padding: 10,
          }}>
          {isLoading && products.length === 0 ? (
            <LoaderComponent />
          ) : (
            products
              .filter(item => !item.isActive)
              .map((item, index) => (
                <ProductItem
                  key={index}
                  item={item}
                  navigation={navigation}
                  setShowLoader={setShowLoader}
                />
              ))
          )}
          {products.filter(item => !item.isActive).length === 0 && (
            <NotFound title="No hidden products found" />
          )}
        </View>
      </ScrollView>
      <FullPageLoader isLoading={showLoader} />
    </View>
  );
};

export default HiddenProducts;
