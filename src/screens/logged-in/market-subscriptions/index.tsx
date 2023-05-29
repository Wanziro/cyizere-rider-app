import {View, Text, StatusBar, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import axios from 'axios';
import {app} from '../../../constants/app';
import {IMarket} from '../../../../interfaces';
import {returnErroMessage} from '../../../helpers';
import Icon from 'react-native-vector-icons/Foundation';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import {viewFlexCenter, viewFlexSpace} from '../../../constants/styles';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSubscribedMarketsSilent} from '../../../actions/markets';
import {RootState} from '../../../reducers';
import MarketItem from './market-item';
import Loader from './loader';
import CustomAlert from '../../../components/custom-alert';
import FastImage from 'react-native-fast-image';

const MarketSubScriptions = () => {
  const dispatch = useDispatch();
  const [isLoadingMarkets, setIsLoadingMarkets] = useState<boolean>(false);
  const [erroMessage, setErroMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);
  const [allMarkets, setAllMarkets] = useState<IMarket[]>([]);
  const {token} = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchSubscribedMarketsSilent());
    fetchMarkets();
  }, []);

  const fetchMarkets = () => {
    setShowAlert(false);
    setIsLoadingMarkets(true);
    setErroMessage('');
    axios
      .get(app.BACKEND_URL + '/markets/')
      .then(res => {
        setIsLoadingMarkets(false);
        setAllMarkets(res.data.markets);
      })
      .catch(error => {
        setIsLoadingMarkets(false);
        setErroMessage(returnErroMessage(error));
        setShowAlert(true);
      });
  };

  return (
    <>
      <StatusBar backgroundColor={APP_COLORS.ORANGE} barStyle="light-content" />

      <View style={{flex: 1, backgroundColor: APP_COLORS.WHITE}}>
        <View
          style={[
            viewFlexSpace,
            {
              backgroundColor: 'rgba(128, 0, 0, 0.5)',
              padding: 10,
              margin: 10,
              borderRadius: 5,
            },
          ]}>
          <Icon name="pricetag-multiple" color={APP_COLORS.WHITE} size={25} />
          <Text
            style={{
              color: APP_COLORS.WHITE,
              fontSize: 16,
              textTransform: 'uppercase',
              fontWeight: '600',
              flex: 1,
              marginLeft: 10,
            }}>
            Subscribe to markets to get started
          </Text>
        </View>
        <View style={[viewFlexSpace, {margin: 10, alignItems: 'flex-start'}]}>
          <Icon2 name="exclamation" color={APP_COLORS.TEXT_GRAY} size={16} />
          <Text style={{flex: 1, marginLeft: 10, color: APP_COLORS.TEXT_GRAY}}>
            Turn on the switch to subscribe and turn it off to unsubscribe.
          </Text>
        </View>
        {isLoadingMarkets ? (
          <Loader />
        ) : (
          <View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {allMarkets.map((item, index) => (
                <MarketItem key={index} item={item} token={token} />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      <CustomAlert
        setShowAlert={setShowAlert}
        showAlert={showAlert}
        hasCloseButton={false}
        disableBackButtonPress={true}
        confirmationTitle="Try Again"
        callBack={() => fetchMarkets()}>
        <View style={[viewFlexCenter]}>
          <FastImage
            source={require('../../../assets/error-black.gif')}
            style={{width: 150, height: 150}}
          />
          <Text
            style={{
              color: APP_COLORS.ORANGE,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Error
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>{erroMessage}</Text>
        </View>
      </CustomAlert>
    </>
  );
};

export default MarketSubScriptions;
