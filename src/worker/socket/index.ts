import {io} from 'socket.io-client';
import {
  EVENT_NAMES_ENUM,
  INotificaton,
  IOrder,
  ISocketData,
  IUser,
  IWalletTransaction,
  PAYMENT_STATUS_ENUM,
  USER_TYPE_ENUM,
} from '../../../interfaces';
import {setAddOrUpdateMarket, setDeleteMarket} from '../../actions/markets';
import {
  setAddOrUpdateNotification,
  setDeleteNotification,
} from '../../actions/notifications';
import {
  setAddOrUpdateProductPrice,
  setDeleteProductPrice,
} from '../../actions/productPrices';
import {setAddOrUpdateProduct, setDeleteProduct} from '../../actions/products';
import {
  setAddOrdUpdateWalletTransaction,
  setDeleteWalletTransaction,
} from '../../actions/walletTransactions';
import {app} from '../../constants/app';
import {setAddOrUpdateOrder, setDeleteOrder} from '../../actions/orders';
import {setUser} from '../../actions/user';

let mSocket: any = undefined;
let mStore: any = undefined;

export const subscribeToSocket = (store: any) => {
  mStore = store;
  if (mSocket !== undefined) {
    return;
  }

  const {user} = mStore.getState();

  mSocket = io(app.SOCKET_URL);
  mSocket.on('connect', () => {
    console.log('connected to socket');
  });
  emitSocket('addUser', {userType: 'client', userId: user.userId});
  mSocket.on('CyizereEventNames', (data: ISocketData) => {
    // console.log(data);
    if (
      data.type !== undefined &&
      data.data !== undefined &&
      mStore !== undefined
    ) {
      dispatchBasicAppData(data, mStore);
    }
  });
  mSocket.on('CyizereRiderEventNames', (data: {type: string; data: any}) => {
    // console.log(data);
    if (
      data.type !== undefined &&
      data.data !== undefined &&
      mStore !== undefined
    ) {
      dispatchUserData(data, mStore);
    }
  });

  mSocket.on('disconnect', () => {
    console.log('disconnected from socket');
  });
  mSocket.on('connect_error', (err: any) => {
    // console.log(`socket connect_error due to ${err.message}`);
    // console.log(JSON.stringify(err));
  });
};

const dispatchBasicAppData = (data: ISocketData, store: any) => {
  //notifications
  if (
    data.type === EVENT_NAMES_ENUM.ADD_NOTIFICATON ||
    data.type === EVENT_NAMES_ENUM.UPDATE_NOTIFICATON
  ) {
    store.dispatch(setAddOrUpdateNotification(data.data));
  }
  if (data.type === EVENT_NAMES_ENUM.DELETE_NOTIFICATON) {
    store.dispatch(setDeleteNotification(data.data));
  }
  //product prices
  if (
    data.type === EVENT_NAMES_ENUM.ADD_PRODUCT_PRICE ||
    data.type === EVENT_NAMES_ENUM.UPDATE_PRODUCT_PRICE
  ) {
    store.dispatch(setAddOrUpdateProductPrice(data.data));
  }
  if (data.type === EVENT_NAMES_ENUM.DELETE_NOTIFICATON) {
    store.dispatch(setDeleteProductPrice(data.data));
  }
  //products
  if (
    data.type === EVENT_NAMES_ENUM.ADD_PRODUCT ||
    data.type === EVENT_NAMES_ENUM.UPDATE_PRODUCT
  ) {
    store.dispatch(setAddOrUpdateProduct(data.data));
  }
  if (data.type === EVENT_NAMES_ENUM.DELETE_PRODUCT) {
    store.dispatch(setDeleteProduct(data.data));
  }
};

const dispatchUserData = (data: ISocketData, store: any) => {
  const {user} = store.getState();
  const {riderId} = user;
  //notifications
  if (
    data.type === EVENT_NAMES_ENUM.ADD_NOTIFICATON ||
    data.type === EVENT_NAMES_ENUM.UPDATE_NOTIFICATON
  ) {
    const notification = data.data as INotificaton;
    if (
      notification.userId !== undefined &&
      notification.userId == riderId &&
      notification.userType === USER_TYPE_ENUM.RIDER
    ) {
      store.dispatch(setAddOrUpdateNotification(data.data));
    }
  }
  if (data.type === EVENT_NAMES_ENUM.DELETE_NOTIFICATON) {
    store.dispatch(setDeleteNotification(data.data));
  }
  //orders
  if (
    data.type === EVENT_NAMES_ENUM.ADD_ORDER ||
    data.type === EVENT_NAMES_ENUM.UPDATE_ORDER
  ) {
    const order = data.data as IOrder;

    if (
      order.paymentStatus !== undefined &&
      order.paymentStatus == PAYMENT_STATUS_ENUM.SUCCESS
    ) {
      store.dispatch(setAddOrUpdateOrder(data.data));
    }
  }
  if (data.type === EVENT_NAMES_ENUM.DELETE_ORDER) {
    store.dispatch(setDeleteOrder(data.data));
  }
  //wallet transaction
  if (
    data.type === EVENT_NAMES_ENUM.ADD_WALLET ||
    data.type === EVENT_NAMES_ENUM.UPDATE_WALLET
  ) {
    const trans = data.data as IWalletTransaction;
    if (trans.riderId !== undefined && trans.riderId == riderId) {
      store.dispatch(setAddOrdUpdateWalletTransaction(data.data));
    }
  }
  if (data.type === EVENT_NAMES_ENUM.DELETE_WALLET) {
    store.dispatch(setDeleteWalletTransaction(data.data));
  }
  //riders
  if (
    data.type === EVENT_NAMES_ENUM.ADD_RIDER ||
    data.type === EVENT_NAMES_ENUM.UPDATE_RIDER
  ) {
    const rider = data.data as IUser;
    if (rider.riderId == riderId)
      store.dispatch(setUser({...user, ...data.data}));
  }
};

export const unSubscribeToSocket = () => {
  mSocket !== undefined && mSocket.disconnect();
  console.log('Socket Disconnected');
};

export const emitSocket = (eventName: string, data: any) => {
  mSocket !== undefined && mSocket.emit(eventName, data);
};
