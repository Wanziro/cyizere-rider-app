import {View, Text, Switch, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import {viewFlexSpace} from '../../../../constants/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {APP_COLORS} from '../../../../constants/colors';
import {IMarket} from '../../../../../interfaces';
import axios from 'axios';
import {app} from '../../../../constants/app';
import {errorHandler, setHeaders} from '../../../../helpers';
import {useDispatch, useSelector} from 'react-redux';
import {addOrRemoveSubscribedMarket} from '../../../../actions/markets';
import {RootState} from '../../../../reducers';

interface IMarketItemProps {
  item: IMarket;
  token: string;
}
const MarketItem = ({item, token}: IMarketItemProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {markets} = useSelector((state: RootState) => state.subscribedMarkets);
  const toggleSwitch = () => {
    if (!isEnabled) {
      setIsLoading(true);
      axios
        .post(
          app.BACKEND_URL + '/agents/subscriptions/',
          {marketId: item.mId},
          setHeaders(token),
        )
        .then(res => {
          setIsLoading(false);
          dispatch(addOrRemoveSubscribedMarket(res.data.market));
          setIsEnabled(previousState => !previousState);
        })
        .catch(error => {
          setIsLoading(false);
          errorHandler(error);
        });
    } else {
      setIsLoading(true);
      axios
        .delete(
          app.BACKEND_URL + '/agents/subscriptions/' + item.mId,
          setHeaders(token),
        )
        .then(res => {
          setIsLoading(false);
          dispatch(addOrRemoveSubscribedMarket(res.data.market));
          setIsEnabled(previousState => !previousState);
        })
        .catch(error => {
          setIsLoading(false);
          errorHandler(error);
        });
    }
  };
  useEffect(() => {
    let sub = true;
    if (sub) {
      const exists = markets.find(i => i.mId === item.mId);
      if (exists) {
        setIsEnabled(true);
      }
    }
    return () => {
      sub = false;
    };
  }, [markets]);

  return (
    <View
      style={[
        viewFlexSpace,
        {
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: APP_COLORS.BORDER_COLOR,
        },
      ]}>
      <Icon
        name="shopping"
        size={25}
        color={isEnabled ? APP_COLORS.ORANGE : APP_COLORS.BLACK}
      />
      <Text
        style={{
          flex: 1,
          marginHorizontal: 10,
          color: isEnabled ? APP_COLORS.ORANGE : APP_COLORS.BLACK,
        }}>
        {item.name}
      </Text>
      {isLoading ? (
        <ActivityIndicator color={APP_COLORS.ORANGE} size={25} />
      ) : (
        <Switch
          trackColor={{false: '#767577', true: APP_COLORS.ORANGE}}
          thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      )}
    </View>
  );
};

export default MarketItem;
