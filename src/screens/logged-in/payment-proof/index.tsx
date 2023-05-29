import {View} from 'react-native';
import React from 'react';
import {app} from '../../../constants/app';
import {Dimensions} from 'react-native';
import {APP_COLORS} from '../../../constants/colors';
import {
  INavigationPropWithRouteRequired,
  ISupplierPaymentDetail,
} from '../../../../interfaces';
import ImageLoader from '../../../components/image-loader';
const {width, height} = Dimensions.get('window');
const PaymentProof = ({route}: INavigationPropWithRouteRequired) => {
  const {paymentDetails} = route.params as {
    paymentDetails: ISupplierPaymentDetail;
  };
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ImageLoader
        url={app.FILE_URL + paymentDetails.payementProof}
        height={height}
        width={width}
        showLoader={true}
        loaderStyle={{color: APP_COLORS.ORANGE}}
      />
    </View>
  );
};

export default PaymentProof;
