import {IAction, IUser, VerificationStatusEnum} from '../../interfaces';
import {
  SET_USER_NAMES,
  SET_USER_EMAIL,
  SET_USER_TOKEN,
  RESET_USER,
  SET_USER_PHONE,
  SET_USER_ID,
  SET_USER_SHOP_IMAGE,
  SET_USER_ID_NUMBER,
  SET_USER_ID_NUMBER_DOCUMENT,
  SET_USER_IS_ACTIVE,
  SET_USER_IS_DISABLED,
  SET_USER_IS_VERIFIED,
  SET_USER_VERIFICATION_STATUS,
  SET_USER_VERIFICATION_MESSAGE,
  SET_IS_LOADING_USER_VERIFICATION_STATUS,
  SET_IS_LOADING_USER_VERIFICATION_STATUS_ERROR,
  SET_FB_TOKEN,
  SET_UPDATE_SUPPLIER,
  SET_USER_SHOP_NAME,
  SET_USER_SHOP_ADDRESS,
  SET_USER_SHOP_CATEGORY_ID,
  SET_USER_SHOP_CLOSE,
  SET_USER_SHOP_OPEN,
  SET_USER_SHOP_LAT,
  SET_USER_SHOP_LONG,
  SET_USER_HAS_GIFT,
} from '../actions/user';

export interface IUserReducer extends IUser {
  isLoadingStatus: boolean;
  loadingError: string;
}

const initialState: IUserReducer = {
  token: '',
  names: '',
  email: '',
  phone: '',
  fbToken: '',
  walletAmounts: 0,
  shopImage: '',
  shopName: '',
  shopAddress: '',
  shopLat: '',
  shopLong: '',
  shopCategoryId: 0,
  close: '',
  open: '',
  supplierId: 0,
  idNumber: '' as any,
  idNumberDocument: '',
  isActive: false,
  isDisabled: false,
  isVerified: false,
  verificationMessage: '',
  verificationStatus: VerificationStatusEnum.IN_REVIEW,
  isLoadingStatus: false,
  hasGift: false,
  loadingError: '',
};

const user = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_USER_ID:
      return {...state, supplierId: action.payload as number};
    case SET_USER_NAMES:
      return {...state, names: action.payload as string};
    case SET_USER_SHOP_IMAGE:
      return {...state, shopImage: action.payload as string};
    case SET_USER_EMAIL:
      return {...state, email: action.payload as string};
    case SET_USER_PHONE:
      return {...state, phone: action.payload as string};
    case SET_USER_ID_NUMBER:
      return {...state, idNumber: action.payload as number};
    case SET_USER_ID_NUMBER_DOCUMENT:
      return {...state, idNumberDocument: action.payload as number};
    case SET_USER_IS_ACTIVE:
      return {...state, isActive: action.payload as boolean};
    case SET_USER_IS_DISABLED:
      return {...state, isDisabled: action.payload as boolean};
    case SET_USER_IS_VERIFIED:
      return {...state, isVerified: action.payload as boolean};
    case SET_USER_VERIFICATION_STATUS:
      return {...state, verificationStatus: action.payload as string};
    case SET_USER_VERIFICATION_MESSAGE:
      return {...state, verificationMessage: action.payload as string};
    case SET_IS_LOADING_USER_VERIFICATION_STATUS:
      return {...state, isLoadingStatus: action.payload as boolean};
    case SET_IS_LOADING_USER_VERIFICATION_STATUS_ERROR:
      return {...state, loadingError: action.payload as string};
    case SET_USER_HAS_GIFT:
      return {...state, hasGift: action.payload as boolean};
    case SET_USER_TOKEN:
      return {...state, token: action.payload as string};
    case SET_FB_TOKEN:
      return {...state, fbToken: action.payload as string};
    case SET_UPDATE_SUPPLIER:
      return {...state, ...(action.payload as IUser)};
    //
    case SET_USER_SHOP_NAME:
      return {...state, shopName: action.payload as string};
    case SET_USER_SHOP_ADDRESS:
      return {...state, shopAddress: action.payload as string};
    case SET_USER_SHOP_CATEGORY_ID:
      return {...state, shopCategoryId: action.payload as number};
    case SET_USER_SHOP_LAT:
      return {...state, shopLat: action.payload as string};
    case SET_USER_SHOP_LONG:
      return {...state, shopLong: action.payload as string};
    case SET_USER_SHOP_CLOSE:
      return {...state, close: action.payload as string};
    case SET_USER_SHOP_OPEN:
      return {...state, open: action.payload as string};
    //
    case RESET_USER:
      return initialState;
    default:
      return state;
  }
};

export default user;
