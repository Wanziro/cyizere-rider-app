import {View, Text, Dimensions, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {RootState} from '../../../reducers';
import {fetchWalletTransactions} from '../../../actions/walletTransactions';
import {APP_COLORS} from '../../../constants/colors';
import {currencyFormatter} from '../../../helpers';
import SubmitButton from '../../../components/submit-button';
import {viewFlexCenter, viewFlexSpace} from '../../../constants/styles';
import FullPageLoader from '../../../components/full-page-loader';
import Withdraw from './withdraw';
const {height, width} = Dimensions.get('window');

const Wallet = () => {
  const dispatch = useDispatch();
  const {walletAmounts} = useSelector((state: RootState) => state.user);
  const {isLoading, transactions} = useSelector(
    (state: RootState) => state.walletTransactions,
  );
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    dispatch(fetchWalletTransactions());
  }, []);

  return (
    <LinearGradient
      colors={[
        APP_COLORS.ORANGE,
        '#3b5998',
        APP_COLORS.BLUE,
        APP_COLORS.OXFORD_BLUE,
      ]}
      style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={{height: height / 5}}>
          <View style={{padding: 25}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: APP_COLORS.WHITE,
              }}>
              Available Balance
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: APP_COLORS.WHITE,
                marginTop: 20,
              }}>
              {currencyFormatter(walletAmounts)} Rwf
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 10,
            position: 'relative',
            backgroundColor: APP_COLORS.WHITE,
            borderTopEndRadius: 25,
            borderTopStartRadius: 25,
          }}>
          <View style={{position: 'absolute', top: -30, width}}>
            <View
              style={{
                backgroundColor: APP_COLORS.WHITE,
                marginHorizontal: 40,
                borderRadius: 30,
                padding: 5,
              }}>
              <SubmitButton
                titleComponent={
                  <View style={[viewFlexCenter, {flexDirection: 'row'}]}>
                    <Icon name="minus" size={20} color={APP_COLORS.WHITE} />
                    <Text style={{color: APP_COLORS.WHITE, marginLeft: 10}}>
                      Withdraw
                    </Text>
                  </View>
                }
                buttonProps={{
                  onPress: () => setShowModal(true),
                }}
                containerStyle={{
                  borderRadius: 30,
                  marginTop: 0,
                }}
              />
            </View>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            <View style={{paddingBottom: 10, paddingTop: 30}}>
              <Text
                style={{
                  fontSize: 18,
                  color: APP_COLORS.BLACK,
                  fontWeight: '600',
                }}>
                Transactions
              </Text>
              {transactions.map((item, index) => (
                <View
                  key={index}
                  style={[
                    viewFlexSpace,
                    {
                      marginVertical: 10,
                      paddingBottom: 5,
                    },
                  ]}>
                  <View
                    style={[
                      viewFlexCenter,
                      {
                        backgroundColor: APP_COLORS.ORANGE,
                        borderRadius: 100,
                        padding: 10,
                      },
                    ]}>
                    <Icon
                      size={25}
                      name={
                        item.transactionType === 'deposit'
                          ? 'export2'
                          : 'export'
                      }
                      color={APP_COLORS.WHITE}
                    />
                  </View>
                  <View style={{flex: 1, marginHorizontal: 10}}>
                    <Text
                      style={{
                        color:
                          item.transactionType === 'deposit'
                            ? APP_COLORS.GREEN
                            : APP_COLORS.RED,
                      }}>
                      {item.transactionType.toUpperCase()}
                    </Text>
                    <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        textAlign: 'right',
                        color:
                          item.paymentStatus === 'SUCCESS'
                            ? APP_COLORS.GREEN
                            : item.paymentStatus === 'PENDING'
                            ? APP_COLORS.WARNING
                            : APP_COLORS.RED,
                      }}>
                      {currencyFormatter(item.amount)} Rwf
                    </Text>
                    <Text
                      style={{
                        textAlign: 'right',
                        color:
                          item.paymentStatus === 'SUCCESS'
                            ? APP_COLORS.GREEN
                            : item.paymentStatus === 'PENDING'
                            ? APP_COLORS.WARNING
                            : APP_COLORS.RED,
                      }}>
                      {item.paymentStatus}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        <Withdraw showModal={showModal} setShowModal={setShowModal} />
        <FullPageLoader isLoading={isLoading} />
      </View>
    </LinearGradient>
  );
};

export default Wallet;
