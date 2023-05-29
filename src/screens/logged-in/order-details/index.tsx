import {View, Text, ScrollView, Pressable, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  DELIVERED_STATUS,
  INavigationPropWithRouteRequired,
  IOrder,
} from '../../../../interfaces';
import {APP_COLORS} from '../../../constants/colors';
import {
  btnWithBgContainerStyles,
  btnWithBgTextStyles,
  btnWithoutBgContainerStyles,
  btnWithoutBgTextStyles,
  commonInput,
  viewFlexCenter,
  viewFlexSpace,
} from '../../../constants/styles';
import Icon from 'react-native-vector-icons/Entypo';
import Item from './item';
import {
  currencyFormatter,
  returnErroMessage,
  setHeaders,
} from '../../../helpers';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import Icon4 from 'react-native-vector-icons/Ionicons';
import CustomAlert from '../../../components/custom-alert';
import FastImage from 'react-native-fast-image';
import CustomErrorAlert from '../../../components/custom-error-alert';
import FullPageLoader from '../../../components/full-page-loader';
import axios from 'axios';
import {app} from '../../../constants/app';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {fetchClients} from '../../../actions/clients';
import TimeAgo from '@andordavoti/react-native-timeago';
import {fetchOrders} from '../../../actions/orders';

const OrderDetails = ({
  navigation,
  route,
}: INavigationPropWithRouteRequired) => {
  const dispatch = useDispatch();
  const {orders} = useSelector((state: RootState) => state.orders);
  const {order} = route.params as {order: IOrder};
  const [orderToUse, setOrderToUse] = useState<IOrder | undefined>(undefined);
  const {token, agentId} = useSelector((state: RootState) => state.user);
  const {markets} = useSelector((state: RootState) => state.subscribedMarkets);
  const [expandProducts, setExpandProducts] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [showSendOrderAlert, setShowSendOrderAlert] = useState(false);
  const [showConfirmSendOrderAlert, setShowConfirmSendOrderAlert] =
    useState(false);
  const [riderId, setRiderId] = useState<string>('');
  const [marketName, setMarketName] = useState('');

  const handleContinue = () => {
    setShowAlert(false);
    navigation.navigate('AcceptedOrders');
  };

  useEffect(() => {
    let sub = true;
    if (sub) {
      const od = orders.find(item => item.id == order.id);
      if (od) {
        setOrderToUse(od);
      } else {
        setOrderToUse(order);
      }
    }
    return () => {
      sub = false;
    };
  }, [orders]);

  const handleSubmit = () => {
    setShowAlert(false);
    setShowAlert2(false);
    setIsLoading(true);
    axios
      .post(
        app.BACKEND_URL + '/orders/accept/',
        {orderId: order.id},
        setHeaders(token),
      )
      .then(res => {
        setIsLoading(false);
        setSuccessMessage(res.data.msg);
        // dispatch(removePendingOrder(order));
        // dispatch(fetchAcceptedOrders());
        setShowAlert(true);
      })
      .catch(error => {
        const msg = returnErroMessage(error);
        setIsLoading(false);
        setErrorMessage(msg);
        setShowAlert2(true);
      });
  };

  useEffect(() => {
    dispatch(fetchClients());
    getMarketName();
  }, []);

  const getMarketName = () => {
    const m = markets.find(item => item.mId === order.marketId);
    if (m) {
      setMarketName(m.name);
    } else {
      setMarketName('-');
    }
  };

  const handleSendRiderVerificationsDetails = () => {
    setShowAlert(false);
    setShowAlert2(false);
    setShowSendOrderAlert(false);
    setIsLoading(true);
    axios
      .post(
        app.BACKEND_URL + '/agents/verify/',
        {riderId, orderId: order.id},
        setHeaders(token),
      )
      .then(res => {
        setIsLoading(false);
        setSuccessMessage(res.data.msg);
        setShowConfirmSendOrderAlert(true);
      })
      .catch(error => {
        const msg = returnErroMessage(error);
        setIsLoading(false);
        setErrorMessage(msg);
        setShowAlert2(true);
      });
  };

  const handleSendOrder = () => {
    setShowAlert(false);
    setShowAlert2(false);
    setShowSendOrderAlert(false);
    setShowConfirmSendOrderAlert(false);
    setIsLoading(true);
    axios
      .post(
        app.BACKEND_URL + '/orders/sendorder',
        {riderId, orderId: order.id},
        setHeaders(token),
      )
      .then(res => {
        setIsLoading(false);
        setSuccessMessage(res.data.msg);
        // dispatch(removeAcceptedOrder(order));
        dispatch(fetchOrders());
        setShowAlert(true);
      })
      .catch(error => {
        const msg = returnErroMessage(error);
        setIsLoading(false);
        setErrorMessage(msg);
        setShowAlert2(true);
      });
  };

  return (
    <View
      style={{backgroundColor: APP_COLORS.WHITE, paddingVertical: 10, flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Order ID:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>{orderToUse?.id}</Text>
        </View>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Market
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>{marketName}</Text>
        </View>
        <View
          style={{
            borderBottomColor: APP_COLORS.BORDER_COLOR,
            borderBottomWidth: 1,
            padding: 10,
          }}>
          <Pressable onPress={() => setExpandProducts(!expandProducts)}>
            <View style={[viewFlexSpace]}>
              <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
                {orderToUse?.cartItems.length} Product Items
              </Text>
              {expandProducts ? (
                <Icon
                  name="chevron-small-up"
                  size={25}
                  color={APP_COLORS.BLACK}
                />
              ) : (
                <Icon
                  name="chevron-small-down"
                  size={25}
                  color={APP_COLORS.BLACK}
                />
              )}
            </View>
          </Pressable>
          {expandProducts && (
            <View>
              {orderToUse?.cartItems.map((item, index) => (
                <Item key={index} item={item} />
              ))}
            </View>
          )}
        </View>
        <View
          style={{
            borderBottomColor: APP_COLORS.BORDER_COLOR,
            borderBottomWidth: 1,
            padding: 10,
          }}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Delivery Address:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {orderToUse?.deliveryAddress.name}
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            House No: {orderToUse?.deliveryAddress.houseNumber}
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {orderToUse?.deliveryAddress.description}
          </Text>
        </View>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Delivery Vehicle:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {orderToUse?.deliveryVehicle.vehicleType}
          </Text>
        </View>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Delivery Status:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {orderToUse?.deliveryStatus}
          </Text>
        </View>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Cart Total:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {currencyFormatter(orderToUse?.cartTotalAmount)} RWF
          </Text>
        </View>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Your Earnings:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {currencyFormatter(orderToUse?.agentFees)} RWF
          </Text>
        </View>
        <View
          style={[
            viewFlexSpace,
            {
              borderBottomColor: APP_COLORS.BORDER_COLOR,
              borderBottomWidth: 1,
              padding: 10,
            },
          ]}>
          <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
            Placed Within:
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>
            {orderToUse && (
              <TimeAgo dateTo={new Date(orderToUse?.createdAt as any)} />
            )}
          </Text>
        </View>
        {orderToUse?.agentId === agentId && (
          <>
            <View
              style={[
                viewFlexSpace,
                {
                  borderBottomColor: APP_COLORS.BORDER_COLOR,
                  borderBottomWidth: 1,
                  padding: 10,
                },
              ]}>
              <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
                Processed Within:
              </Text>
              {orderToUse?.riderId == null ? (
                <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                  {orderToUse && (
                    <TimeAgo dateTo={new Date(orderToUse?.acceptedAt as any)} />
                  )}
                </Text>
              ) : (
                <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                  {orderToUse && (
                    <TimeAgo
                      dateFrom={new Date(orderToUse?.acceptedAt)}
                      dateTo={new Date(orderToUse?.sentAt)}
                    />
                  )}
                </Text>
              )}
            </View>
            {orderToUse?.riderId != null && (
              <View
                style={[
                  viewFlexSpace,
                  {
                    borderBottomColor: APP_COLORS.BORDER_COLOR,
                    borderBottomWidth: 1,
                    padding: 10,
                  },
                ]}>
                <Text style={{color: APP_COLORS.BLACK, fontWeight: '600'}}>
                  Delivery time elapsed:
                </Text>
                {orderToUse?.deliveredAt == null ? (
                  <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                    {orderToUse && (
                      <TimeAgo dateTo={new Date(orderToUse?.sentAt)} />
                    )}
                  </Text>
                ) : (
                  <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                    {orderToUse && (
                      <TimeAgo
                        dateFrom={new Date(orderToUse?.sentAt)}
                        dateTo={new Date(orderToUse?.deliveredAt)}
                      />
                    )}
                  </Text>
                )}
              </View>
            )}
          </>
        )}
        <View style={{marginHorizontal: 10, marginVertical: 20}}>
          {orderToUse?.agentId == null && (
            <Pressable onPress={() => handleSubmit()}>
              <View style={[btnWithBgContainerStyles]}>
                <Text style={[btnWithBgTextStyles]}>
                  Accept Order{' '}
                  <Icon2 name="check" color={APP_COLORS.WHITE} size={20} />
                </Text>
              </View>
            </Pressable>
          )}
          {orderToUse?.agentId === agentId && (
            <>
              {orderToUse?.deliveryStatus !== DELIVERED_STATUS.COMPLETED && (
                <Pressable
                  onPress={() =>
                    navigation.navigate('ChatRoom', {
                      clientId: orderToUse?.userId,
                    })
                  }>
                  <View
                    style={[btnWithoutBgContainerStyles, {marginBottom: 10}]}>
                    <Text
                      style={[
                        btnWithoutBgTextStyles,
                        {color: APP_COLORS.ORANGE},
                      ]}>
                      <Icon4
                        name="chatbubble-ellipses-sharp"
                        color={APP_COLORS.ORANGE}
                        size={20}
                      />{' '}
                      Chat With Client
                    </Text>
                  </View>
                </Pressable>
              )}
              <Pressable
                onPress={() => navigation.navigate('PaymentDetails', {order})}>
                <View style={[btnWithBgContainerStyles]}>
                  <Text style={[btnWithBgTextStyles]}>
                    <Icon3
                      name="exchange-alt"
                      color={APP_COLORS.WHITE}
                      size={20}
                    />{' '}
                    {orderToUse?.areAllSuppliersPaid
                      ? 'View Payment Details'
                      : 'Make Payment'}
                  </Text>
                </View>
              </Pressable>
              {orderToUse?.areAllSuppliersPaid &&
                orderToUse?.riderId == null && (
                  <Pressable
                    style={{marginTop: 10}}
                    onPress={() => setShowSendOrderAlert(true)}>
                    <View style={[btnWithBgContainerStyles]}>
                      <Text style={[btnWithBgTextStyles]}>
                        <Icon4 name="send" color={APP_COLORS.WHITE} size={20} />{' '}
                        Send Order
                      </Text>
                    </View>
                  </Pressable>
                )}
            </>
          )}
        </View>
      </ScrollView>
      <CustomAlert
        setShowAlert={setShowAlert}
        showAlert={showAlert}
        hasCloseButton={false}
        confirmationTitle="Continue"
        callBack={handleContinue}>
        <View style={[viewFlexCenter]}>
          <FastImage
            source={require('../../../assets/success.gif')}
            style={{width: 120, height: 120}}
          />
          <Text style={{color: APP_COLORS.BLACK}}>{successMessage}</Text>
        </View>
      </CustomAlert>
      <CustomAlert
        setShowAlert={setShowSendOrderAlert}
        showAlert={showSendOrderAlert}
        confirmationTitle="Submit"
        callBack={handleSendRiderVerificationsDetails}>
        <View style={[viewFlexCenter]}>
          <Text
            style={{
              color: APP_COLORS.ORANGE,
              textAlign: 'center',
              fontWeight: '600',
            }}>
            Provide Driver ID of driver
          </Text>
          <Text
            style={{
              color: APP_COLORS.ORANGE,
              textAlign: 'center',
              fontWeight: '600',
            }}>
            who is going to deliver this order.
          </Text>
          <TextInput
            placeholderTextColor={APP_COLORS.GRAY}
            placeholder="Enter Driver ID"
            style={[commonInput, {width: '100%', marginTop: 10}]}
            keyboardType="number-pad"
            onChangeText={text => setRiderId(text)}
            value={riderId}
          />
        </View>
      </CustomAlert>
      <CustomAlert
        setShowAlert={setShowConfirmSendOrderAlert}
        showAlert={showConfirmSendOrderAlert}
        confirmationTitle="Comfirm"
        callBack={handleSendOrder}>
        <View style={[viewFlexCenter]}>
          <Text
            style={{
              color: APP_COLORS.ORANGE,
              textAlign: 'center',
              fontWeight: '600',
            }}>
            Confirmation
          </Text>
          <Text
            style={{
              color: APP_COLORS.BLACK,
              marginTop: 5,
              textAlign: 'center',
            }}>
            {successMessage}
          </Text>
        </View>
      </CustomAlert>
      <CustomErrorAlert setShowAlert={setShowAlert2} showAlert={showAlert2}>
        <Text style={{color: APP_COLORS.BLACK, textAlign: 'center'}}>
          {errorMessage}
        </Text>
      </CustomErrorAlert>
      <FullPageLoader isLoading={isLoading} />
    </View>
  );
};

export default OrderDetails;
