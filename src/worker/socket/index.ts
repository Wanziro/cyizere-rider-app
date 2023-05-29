import {io} from 'socket.io-client';
import {
  EVENT_NAMES_ENUM,
  IMessage,
  INotificaton,
  IOrder,
  ISocketData,
  ISubscribedMarketsReducer,
  IUser,
  IWalletTransaction,
  PAYMENT_STATUS_ENUM,
  USER_TYPE_ENUM,
} from '../../../interfaces';
// import {
//   setAddOrUpdateCategory,
//   setDeleteCategory,
// } from '../../actions/categories';
import {setAddOrUpdateMarket, setDeleteMarket} from '../../actions/markets';
import {setAddOrUpdateMessages, setDeleteMessage} from '../../actions/messages';
import {
  setAddOrUpdateNotification,
  setDeleteNotification,
} from '../../actions/notifications';
// import {
//   setAddOrUpdateOrder,
//   setDeleteOrder,
// } from '../../actions/completedOrders';
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
import {setUpdateAgent} from '../../actions/user';
import {updateSupplierPaymentDetails} from '../../actions/suppliersPaymentDetails';

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
  mSocket.on('NtumaEventNames', (data: ISocketData) => {
    // console.log(data);
    if (
      data.type !== undefined &&
      data.data !== undefined &&
      mStore !== undefined
    ) {
      dispatchBasicAppData(data, mStore);
    }
  });
  mSocket.on('NtumaAgentEventNames', (data: {type: string; data: any}) => {
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
  //markets
  if (
    data.type === EVENT_NAMES_ENUM.ADD_MARKET ||
    data.type === EVENT_NAMES_ENUM.UPDATE_MARKET
  ) {
    store.dispatch(setAddOrUpdateMarket(data.data));
  }
  if (data.type === EVENT_NAMES_ENUM.DELETE_MARKET) {
    store.dispatch(setDeleteMarket(data.data));
  }
  //categories
  // if (
  //   data.type === EVENT_NAMES_ENUM.ADD_CATEGORY ||
  //   data.type === EVENT_NAMES_ENUM.UPDATE_CATEGORY
  // ) {
  //   store.dispatch(setAddOrUpdateCategory(data.data));
  // }
  // if (data.type === EVENT_NAMES_ENUM.DELETE_CATEGORY) {
  //   store.dispatch(setDeleteCategory(data.data));
  // }
  //clients
  //

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
  const subscribedMarkets = store.getState() as ISubscribedMarketsReducer;
  const {agentId} = user;
  //messages
  if (
    data.type === EVENT_NAMES_ENUM.ADD_MESSAGE ||
    data.type === EVENT_NAMES_ENUM.UPDATE_MESSAGE
  ) {
    const message = data.data as IMessage;
    if (message?.userId !== undefined && message.agentId == agentId) {
      store.dispatch(setAddOrUpdateMessages(data.data));
    }
  }
  if (data.type === EVENT_NAMES_ENUM.DELETE_MESSAGE) {
    store.dispatch(setDeleteMessage(data.data));
  }
  //notifications
  if (
    data.type === EVENT_NAMES_ENUM.ADD_NOTIFICATON ||
    data.type === EVENT_NAMES_ENUM.UPDATE_NOTIFICATON
  ) {
    const notification = data.data as INotificaton;
    if (
      notification.userId !== undefined &&
      notification.userId == agentId &&
      notification.userType === USER_TYPE_ENUM.AGENT
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
    const valid = subscribedMarkets.markets.find(
      item => item.mId == order.marketId,
    );
    if (
      valid &&
      order.paymentStatus !== undefined &&
      order.paymentStatus == PAYMENT_STATUS_ENUM.SUCCESS &&
      order.riderId != null
    ) {
      // store.dispatch(setAddOrUpdateOrder(data.data));
    }
    if (
      valid &&
      order.paymentStatus !== undefined &&
      order.paymentStatus == PAYMENT_STATUS_ENUM.SUCCESS &&
      order.agentId == null
    ) {
      // store.dispatch(setAddOrUpdatePendingOrder(data.data));
    }
    if (
      valid &&
      order.paymentStatus !== undefined &&
      order.paymentStatus == PAYMENT_STATUS_ENUM.SUCCESS &&
      order.agentId != null &&
      order.riderId == null
    ) {
      // store.dispatch(setAddOrUpdateAcceptedOrder(data.data));
    }
  }
  if (data.type === EVENT_NAMES_ENUM.DELETE_ORDER) {
    // store.dispatch(setDeleteOrder(data.data));
  }
  //wallet transaction
  if (
    data.type === EVENT_NAMES_ENUM.ADD_WALLET ||
    data.type === EVENT_NAMES_ENUM.UPDATE_WALLET
  ) {
    const trans = data.data as IWalletTransaction;
    if (trans.agentId !== undefined && trans.agentId == agentId) {
      store.dispatch(setAddOrdUpdateWalletTransaction(data.data));
    }
  }
  if (data.type === EVENT_NAMES_ENUM.DELETE_WALLET) {
    store.dispatch(setDeleteWalletTransaction(data.data));
  }
  //agents
  // if (
  //   data.type === EVENT_NAMES_ENUM.ADD_AGENT ||
  //   data.type === EVENT_NAMES_ENUM.UPDATE_AGENT
  // ) {
  //   const agent = data.data as IUser;
  //   if (agent.agentId == agentId) store.dispatch(setUpdateAgent(data.data));
  // }
  //suppliers payment details
  if (data.type === EVENT_NAMES_ENUM.UPDATE_SUPPLIERS_PAYMENT_DETAILS) {
    store.dispatch(updateSupplierPaymentDetails(data.data));
  }
};

export const unSubscribeToSocket = () => {
  mSocket !== undefined && mSocket.disconnect();
  console.log('Socket Disconnected');
};

export const emitSocket = (eventName: string, data: any) => {
  mSocket !== undefined && mSocket.emit(eventName, data);
};
