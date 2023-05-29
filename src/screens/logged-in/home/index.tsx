import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {IUserReducer} from '../../../reducers/user';
import ShopImage from './shop-image';
import FullPageLoader from '../../../components/full-page-loader';
import {viewFlexCenter, viewFlexSpace} from '../../../constants/styles';
import OrdersGraph from './orders-graph';
import {INavigationProp} from '../../../../interfaces';
import {fetchOrders} from '../../../actions/orders';

const {width} = Dimensions.get('window');
const Home = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const {shopImage, token, open, close} = useSelector(
    (state: RootState) => state.user as IUserReducer,
  );
  const {products} = useSelector((state: RootState) => state.products);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: APP_COLORS.BACKGROUND_COLOR,
      }}>
      <View style={{backgroundColor: APP_COLORS.ORANGE, paddingBottom: 5}}>
        <Text style={{color: APP_COLORS.WHITE, textAlign: 'center'}}>
          Open From {open} Until {close}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsHorizontalScrollIndicator={false}>
        <ShopImage
          setIsLoading={setIsLoading}
          shopImage={shopImage}
          token={token}
        />
        <View style={{paddingHorizontal: 10, paddingVertical: 15}}>
          <Text
            style={{fontWeight: '600', fontSize: 16, color: APP_COLORS.BLACK}}>
            My Products
          </Text>
          <View style={[viewFlexSpace, {marginTop: 10}]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Products')}
              style={{width: width / 2 - 15}}>
              <View
                style={[
                  viewFlexCenter,
                  {
                    backgroundColor: APP_COLORS.WHITE,
                    borderRadius: 5,
                    padding: 15,
                    flex: 1,
                  },
                ]}>
                <Text style={{color: APP_COLORS.BLACK, fontWeight: 'bold'}}>
                  {products.filter(item => item.isActive).length}
                </Text>
                <Text style={{color: APP_COLORS.TEXT_GRAY, marginTop: 10}}>
                  Visible
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{width: width / 2 - 15}}
              onPress={() =>
                navigation.navigate('Products', {screen: 'HiddenProducts'})
              }>
              <View
                style={[
                  viewFlexCenter,
                  {
                    backgroundColor: APP_COLORS.WHITE,
                    borderRadius: 5,
                    padding: 15,
                    flex: 1,
                  },
                ]}>
                <Text style={{color: APP_COLORS.BLACK, fontWeight: 'bold'}}>
                  {products.filter(item => !item.isActive).length}
                </Text>
                <Text style={{color: APP_COLORS.TEXT_GRAY, marginTop: 10}}>
                  Hidden
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <OrdersGraph />
      <FullPageLoader isLoading={isLoading} />
    </View>
  );
};

export default Home;
