import {View, Text, Pressable, ScrollView, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  ICartItem,
  IOrder,
  IProduct,
  IProductPrice,
  TOAST_MESSAGE_TYPES,
} from '../../../../../interfaces';
import Modal from 'react-native-modal';
import {APP_COLORS} from '../../../../constants/colors';
import {
  btnWithBgContainerStyles,
  btnWithBgTextStyles,
  viewFlexSpace,
} from '../../../../constants/styles';
import Icon from 'react-native-vector-icons/AntDesign';
import {Dimensions} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import {currencyFormatter, toastMessage} from '../../../../helpers';
import Icon2 from 'react-native-vector-icons/Feather';
import {IAddSupplierState} from '..';

interface IProductsProps {
  order: IOrder;
  showModal: boolean;
  setShowModal: any;
  setState: any;
  state: IAddSupplierState;
}
const {width, height} = Dimensions.get('window');

const ProductItem = ({
  item,
  selectedProducts,
  setSelectedProducts,
}: {
  item: ICartItem;
  selectedProducts: ICartItem[];
  setSelectedProducts: any;
}) => {
  const {products} = useSelector((state: RootState) => state.products);
  const {prices} = useSelector((state: RootState) => state.productPrices);
  const [product, setProduct] = useState<IProduct | undefined>(undefined);
  const [productPrice, setProductPrice] = useState<IProductPrice | undefined>(
    undefined,
  );
  const [isSelected, setIsSelected] = useState<boolean>(false);
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

  useEffect(() => {
    const exists = selectedProducts.find(
      prod => prod.productId === item.productId,
    );
    if (exists) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedProducts]);
  const handleSelect = () => {
    if (isSelected) {
      setSelectedProducts(
        selectedProducts.filter(prod => prod.productId !== item.productId),
      );
    } else {
      setSelectedProducts([...selectedProducts, item]);
    }
  };
  return (
    <Pressable style={{marginBottom: 10}} onPress={() => handleSelect()}>
      <View style={[viewFlexSpace]}>
        <View>
          <Text style={{color: APP_COLORS.BLACK}}>{product?.name}</Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {productPrice?.name !== undefined && productPrice.name + ' '}
            {item.quantity} x {currencyFormatter(item.price)} ={' '}
            {currencyFormatter(item.quantity * item.price)} RWF
          </Text>
        </View>
        <View>
          {isSelected ? (
            <Icon2 name="check-square" size={30} color={APP_COLORS.BLACK} />
          ) : (
            <Icon2 name="square" size={30} color={APP_COLORS.BLACK} />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const Products = ({
  order,
  showModal,
  setShowModal,
  setState,
  state,
}: IProductsProps) => {
  const {paymentDetails} = useSelector(
    (state: RootState) => state.suppliersPaymentDetails,
  );

  const [remainingProducts, setRemainingProducts] = useState<ICartItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ICartItem[]>([]);

  const handleSelectAll = () => {
    if (remainingProducts.length > 0) {
      if (selectedProducts.length === remainingProducts.length) {
        setSelectedProducts([]);
      } else {
        setSelectedProducts(remainingProducts);
      }
    }
  };

  useEffect(() => {
    if (showModal) {
      setSelectedProducts(state.productsList);
    }
  }, [showModal]);

  useEffect(() => {
    const allDetails = paymentDetails.filter(item => item.orderId === order.id);
    let doneProducts: ICartItem[] = [];
    const remaining = [];

    for (let i = 0; i < allDetails.length; i++) {
      const newArray = doneProducts.concat(allDetails[i].productsList);
      doneProducts = newArray;
    }

    for (let i = 0; i < order.cartItems.length; i++) {
      const exists = doneProducts.find(
        item => item.productId == order.cartItems[i].productId,
      );
      if (!exists) {
        remaining.push(order.cartItems[i]);
      }
    }

    setRemainingProducts(remaining);
  }, [order]);

  const handleContinue = () => {
    if (selectedProducts.length === 0) {
      Alert.alert(
        'Warning',
        'Please select all products from the supplier that you are going to add.',
        [
          {
            text: 'Close',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      setState({...state, productsList: selectedProducts});
      setShowModal(false);
      toastMessage(
        TOAST_MESSAGE_TYPES.SUCCESS,
        selectedProducts.length + ' Product(s) Selected!',
      );
    }
  };

  return (
    <Modal
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      animationOutTiming={700}
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      style={{padding: 0, margin: 0}}>
      <View
        style={{
          backgroundColor: APP_COLORS.WHITE,
          padding: 20,
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          width,
          height,
        }}>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              paddingBottom: 10,
              marginBottom: 20,
            },
          ]}>
          <Text style={{flex: 1, color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Choose Products
          </Text>
          <Pressable onPress={() => setShowModal(false)}>
            <View>
              <Icon name="close" size={25} color={APP_COLORS.BLACK} />
            </View>
          </Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Pressable
            style={{marginBottom: 10}}
            onPress={() => handleSelectAll()}>
            <View style={[viewFlexSpace]}>
              <View>
                <Text style={{color: APP_COLORS.BLACK}}>Select All</Text>
              </View>
              <View>
                {selectedProducts.length === remainingProducts.length ? (
                  <Icon2
                    name="check-square"
                    size={30}
                    color={APP_COLORS.BLACK}
                  />
                ) : (
                  <Icon2 name="square" size={30} color={APP_COLORS.BLACK} />
                )}
              </View>
            </View>
          </Pressable>
          {remainingProducts.map((item, index) => (
            <ProductItem
              item={item}
              key={index}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />
          ))}
        </ScrollView>
        <View style={{marginVertical: 10}}>
          <Pressable onPress={() => handleContinue()}>
            <View style={[btnWithBgContainerStyles]}>
              <Text style={[btnWithBgTextStyles]}>Apply & Continue</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default Products;
