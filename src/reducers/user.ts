import {IAction, IUser, VerificationStatusEnum} from '../../interfaces';
import {
  SET_USER,
  RESET_USER,
  SET_IS_LOADING_USER_VERIFICATION_STATUS,
  SET_IS_LOADING_USER_VERIFICATION_STATUS_ERROR,
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
  riderId: 0,
  idNumber: '' as any,
  idNumberDocument: '',
  isActive: false,
  isDisabled: false,
  isVerified: false,
  verificationMessage: '',
  verificationStatus: VerificationStatusEnum.IN_REVIEW,
  isLoadingStatus: false,
  loadingError: '',
  lat: '',
  lng: '',
};

const user = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_USER:
      return {...state, ...(action.payload as IUserReducer)};
    case SET_IS_LOADING_USER_VERIFICATION_STATUS:
      return {...state, isLoadingStatus: action.payload as boolean};
    case SET_IS_LOADING_USER_VERIFICATION_STATUS_ERROR:
      return {...state, loadingError: action.payload as string};

    case RESET_USER:
      return initialState;
    default:
      return state;
  }
};

export default user;
