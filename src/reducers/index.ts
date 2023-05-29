import {combineReducers} from 'redux';
import user from './user';
import subscribedMarkets from './markets';
import shopCategories from './shopCategories';
import productCategories from './productCategories';
import products from './products';
import productPrices from './productPrices';
import cart from './cart';
import favourites from './favorites';
import locations from './locations';
import deliveryFees from './deliveryFees';
import walletTransactions from './walletTransactions';
import dishes from './dishes';
import suppliersPaymentDetails from './suppliersPaymentDetails';
import clients from './clients';
import orders from './orders';
import messages from './messages';
import notifications from './notifications';
import packagingOptions from './packagingOptions';
import gifts from './gifts';
const rootReducer = combineReducers({
  user,
  subscribedMarkets,
  productCategories,
  shopCategories,
  products,
  productPrices,
  cart,
  favourites,
  locations,
  deliveryFees,
  walletTransactions,
  dishes,
  suppliersPaymentDetails,
  clients,
  messages,
  notifications,
  orders,
  packagingOptions,
  gifts,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
