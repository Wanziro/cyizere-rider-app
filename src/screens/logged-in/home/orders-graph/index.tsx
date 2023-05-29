import {View, Text, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ProgressChart} from 'react-native-chart-kit';
import {viewFlexSpace} from '../../../../constants/styles';
import {APP_COLORS} from '../../../../constants/colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import {PAYMENT_STATUS_ENUM} from '../../../../../interfaces';
const {width} = Dimensions.get('window');
const OrdersGraph = () => {
  const {orders} = useSelector((state: RootState) => state.orders);
  const [data, setData] = useState({
    labels: ['Pending', 'Failed', 'Success'],
    data: [0.4, 0.6, 0.8],
  });
  const chartConfig = {
    backgroundColor: APP_COLORS.OXFORD_BLUE,
    backgroundGradientFrom: APP_COLORS.OXFORD_BLUE,
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  useEffect(() => {
    let sub = true;
    if (sub) {
      let pendingNum = 0;
      let failedNum = 0;
      let successNum = 0;
      const pending = orders.filter(
        item => item.paymentStatus === PAYMENT_STATUS_ENUM.PENDING,
      ).length;
      const failed = orders.filter(
        item => item.paymentStatus === PAYMENT_STATUS_ENUM.FAILED,
      ).length;
      const success = orders.filter(
        item => item.paymentStatus === PAYMENT_STATUS_ENUM.SUCCESS,
      ).length;
      if (pending > 0) {
        pendingNum = (pending * 100) / orders.length / 100;
      }
      if (failed > 0) {
        failedNum = (failed * 100) / orders.length / 100;
      }
      if (success > 0) {
        successNum = (success * 100) / orders.length / 100;
      }

      setData({
        labels: ['Pending', 'Failed', 'Success'],
        data: [
          Number(pendingNum.toFixed(2)),
          Number(failedNum.toFixed(2)),
          Number(successNum.toFixed(2)),
        ],
      });
    }
    return () => {
      sub = false;
    };
  }, [orders]);
  return (
    <View style={{paddingTop: 10}}>
      <View style={[viewFlexSpace, {padding: 10}]}>
        <Text
          style={{
            fontWeight: 'bold',
            color: APP_COLORS.BLACK,
            fontSize: 16,
          }}>
          Order Statistics
        </Text>
      </View>

      <ProgressChart
        data={data} //   style={graphStyle}
        width={width}
        height={250}
        strokeWidth={16}
        radius={32}
        chartConfig={chartConfig}
        hideLegend={false}
      />
    </View>
  );
};

export default OrdersGraph;
