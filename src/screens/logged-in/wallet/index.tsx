import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {
  addNewTransaction,
  fetchWalletTransactions,
  setIsLoadingWalletTransactions,
} from '../../../actions/walletTransactions';
import {APP_COLORS} from '../../../constants/colors';
import {
  currencyFormatter,
  returnErroMessage,
  setHeaders,
} from '../../../helpers';
import {viewFlexCenter, viewFlexSpace} from '../../../constants/styles';
import FullPageLoader from '../../../components/full-page-loader';
import CustomAlert from '../../../components/custom-alert';
import FastImage from 'react-native-fast-image';
import WithdrawRequest from './withdraw-request';
import axios from 'axios';
import {app} from '../../../constants/app';
import CustomErrorAlert from '../../../components/custom-error-alert';
const {height} = Dimensions.get('window');

const Wallet = () => {
  const dispatch = useDispatch();
  const {walletAmounts, token} = useSelector((state: RootState) => state.user);
  const {isLoading, transactions, loadingError} = useSelector(
    (state: RootState) => state.walletTransactions,
  );
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    dispatch(fetchWalletTransactions());
  }, []);

  useEffect(() => {
    let sub = true;
    if (sub) {
      loadingError.trim().length > 0 &&
        transactions.length === 0 &&
        setShowAlert(true);
    }
    return () => {
      sub = false;
    };
  }, [loadingError]);

  const alertCallBack = () => {
    setShowAlert(false);
    dispatch(fetchWalletTransactions());
  };

  const handleWithdraw = (amount: number) => {
    setShowModal(false);
    dispatch(setIsLoadingWalletTransactions(true));
    axios
      .put(app.BACKEND_URL + '/agentswallet/', {amount}, setHeaders(token))
      .then(res => {
        dispatch(setIsLoadingWalletTransactions(false));
        dispatch(addNewTransaction(res.data.transaction));
        setSuccessMessage(res.data.msg);
        setShowSuccessAlert(true);
      })
      .catch(error => {
        const err = returnErroMessage(error);
        dispatch(setIsLoadingWalletTransactions(false));
        setErrorMessage(err);
        setShowErrorAlert(true);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: APP_COLORS.WHITE}}>
      <View style={{height: height / 4, position: 'relative'}}>
        <View
          style={{
            backgroundColor: APP_COLORS.ORANGE,
            height: 100,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
          }}></View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            top: 0,
            marginHorizontal: 20,
          }}>
          <ImageBackground
            source={require('../../../assets/wallet.png')}
            resizeMode="stretch">
            <View style={{height: 170, padding: 25}}>
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginTop: 25,
                }}>
                <Pressable onPress={() => setShowModal(true)}>
                  <View style={[viewFlexCenter, {flexDirection: 'row'}]}>
                    <Icon3
                      name="hand-holding-usd"
                      size={20}
                      color={APP_COLORS.WHITE}
                    />
                    <Text style={{color: APP_COLORS.WHITE, marginLeft: 10}}>
                      Withdraw
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
          position: 'relative',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingBottom: 50}}>
            <Text
              style={{
                fontSize: 18,
                color: APP_COLORS.BLACK,
                fontWeight: '600',
              }}>
              Wallet Transactions
            </Text>
            {transactions.map((item, index) => (
              <View
                key={index}
                style={[
                  viewFlexSpace,
                  {
                    marginVertical: 10,
                    borderBottomColor: APP_COLORS.BORDER_COLOR,
                    borderBottomWidth: 1,
                    paddingBottom: 5,
                  },
                ]}>
                <View>
                  <Icon2
                    size={25}
                    name="layers-triple-outline"
                    color={APP_COLORS.TEXT_GRAY}
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
                    {item.transactionType === 'deposit'
                      ? 'EARNED'
                      : item.transactionType.toUpperCase()}
                  </Text>
                  <Text style={{color: APP_COLORS.TEXT_GRAY}}>
                    {new Date(item.createdAt).toUTCString()}
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
      <WithdrawRequest
        showModal={showModal}
        setShowModal={setShowModal}
        handleWithdraw={handleWithdraw}
      />
      <FullPageLoader isLoading={isLoading} />
      <CustomAlert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        confirmationTitle="Try Again"
        callBack={alertCallBack}>
        <View style={[viewFlexCenter]}>
          <FastImage
            source={require('../../../assets/error-black.gif')}
            style={{width: 120, height: 120}}
          />
          <Text
            style={{
              color: APP_COLORS.ORANGE,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Something Went Wrong
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>{loadingError}</Text>
        </View>
      </CustomAlert>
      <CustomAlert
        setShowAlert={setShowSuccessAlert}
        showAlert={showSuccessAlert}>
        <View style={[viewFlexCenter]}>
          <FastImage
            source={require('../../../assets/success.gif')}
            style={{width: 120, height: 120}}
          />
          <Text style={{color: APP_COLORS.BLACK}}>{successMessage}</Text>
        </View>
      </CustomAlert>
      <CustomErrorAlert
        setShowAlert={setShowErrorAlert}
        showAlert={showErrorAlert}>
        <Text style={{color: APP_COLORS.BLACK}}>{errorMessage}</Text>
      </CustomErrorAlert>
    </View>
  );
};

export default Wallet;
