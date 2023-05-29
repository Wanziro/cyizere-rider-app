import {
  IAction,
  ISupplierPaymentDetail,
  ISuppliersPaymentDetailsReducer,
} from '../../interfaces';
import {
  SET_SUPPLIERS_PAYMENT_DETAILS,
  SET_IS_LOADING_SUPPLIERS_PAYMENT_DETAILS,
  SET_LOADING_SUPPLIERS_PAYMENT_DETAILS_ERROR,
  SET_UPDATE_SUPPLIER_PAYMENT_DETAILS,
  RESET_SUPPLIERS_PAYMENT_DETAILS,
  SET_IS_HARD_RELOADING_SUPPLIERS_PAYMENT_DETAILS,
} from '../actions/suppliersPaymentDetails';

const initialState: ISuppliersPaymentDetailsReducer = {
  paymentDetails: [],
  isLoading: false,
  hardReloading: false,
  loadingError: '',
};

const paymentDetailsReducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_SUPPLIERS_PAYMENT_DETAILS:
      return {
        ...state,
        paymentDetails: action.payload as ISupplierPaymentDetail[],
      };
    case SET_UPDATE_SUPPLIER_PAYMENT_DETAILS: {
      const newState = state.paymentDetails;
      const index = newState.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        newState[index] = action.payload;
        return {
          ...state,
          paymentDetails: newState as ISupplierPaymentDetail[],
        };
      } else {
        return {
          ...state,
          paymentDetails: newState as ISupplierPaymentDetail[],
        };
      }
    }
    case SET_IS_LOADING_SUPPLIERS_PAYMENT_DETAILS:
      return {...state, isLoading: action.payload as boolean};
    case SET_IS_HARD_RELOADING_SUPPLIERS_PAYMENT_DETAILS:
      return {...state, hardReloading: action.payload as boolean};
    case SET_LOADING_SUPPLIERS_PAYMENT_DETAILS_ERROR:
      return {...state, loadingError: action.payload as string};
    case RESET_SUPPLIERS_PAYMENT_DETAILS:
      return initialState;
    default:
      return state;
  }
};

export default paymentDetailsReducer;
