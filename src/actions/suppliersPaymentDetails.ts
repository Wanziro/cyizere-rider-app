import axios from 'axios';
import {IOrder, ISupplierPaymentDetail} from '../../interfaces';
import {app} from '../constants/app';
import {returnErroMessage, setHeaders} from '../helpers';

export const SET_SUPPLIERS_PAYMENT_DETAILS = 'SET_SUPPLIERS_PAYMENT_DETAILS';
export const SET_IS_LOADING_SUPPLIERS_PAYMENT_DETAILS =
  'SET_IS_LOADING_SUPPLIERS_PAYMENT_DETAILS';
export const SET_LOADING_SUPPLIERS_PAYMENT_DETAILS_ERROR =
  'SET_LOADING_SUPPLIERS_PAYMENT_DETAILS_ERROR';
export const SET_UPDATE_SUPPLIER_PAYMENT_DETAILS =
  'SET_UPDATE_SUPPLIER_PAYMENT_DETAILS';
export const SET_IS_HARD_RELOADING_SUPPLIERS_PAYMENT_DETAILS =
  'SET_IS_HARD_RELOADING_SUPPLIERS_PAYMENT_DETAILS';
export const RESET_SUPPLIERS_PAYMENT_DETAILS =
  'RESET_SUPPLIERS_PAYMENT_DETAILS';

interface IAction {
  type: string;
  payload: any;
}
export const setSuppliersPaymentDetails = (
  details: ISupplierPaymentDetail[],
): IAction => ({
  type: SET_SUPPLIERS_PAYMENT_DETAILS,
  payload: details,
});
export const updateSupplierPaymentDetails = (
  details: ISupplierPaymentDetail,
): IAction => ({
  type: SET_UPDATE_SUPPLIER_PAYMENT_DETAILS,
  payload: details,
});
export const setIsLoadingSuppliersPaymentDetails = (
  value: boolean,
): IAction => ({
  type: SET_IS_LOADING_SUPPLIERS_PAYMENT_DETAILS,
  payload: value,
});

export const setIsHardReloadingSuppliersPaymentDetails = (
  value: boolean,
): IAction => ({
  type: SET_IS_HARD_RELOADING_SUPPLIERS_PAYMENT_DETAILS,
  payload: value,
});

export const setLoadingSuppliersPaymentDetailsError = (
  value: string,
): IAction => ({
  type: SET_LOADING_SUPPLIERS_PAYMENT_DETAILS_ERROR,
  payload: value,
});

export const resetSuppliersPaymentDetails = () => ({
  type: RESET_SUPPLIERS_PAYMENT_DETAILS,
});

export const fetchSuppliersPaymentDetails =
  (): any => (dispatch: any, getState: any) => {
    dispatch(setIsLoadingSuppliersPaymentDetails(true));
    dispatch(setLoadingSuppliersPaymentDetailsError(''));
    const {user} = getState();
    axios
      .get(app.BACKEND_URL + '/suppliers/', setHeaders(user.token))
      .then(res => {
        dispatch(setIsLoadingSuppliersPaymentDetails(false));
        dispatch(setIsHardReloadingSuppliersPaymentDetails(false));
        dispatch(setSuppliersPaymentDetails(res.data.paymentDetails));
      })
      .catch(error => {
        const err = returnErroMessage(error);
        dispatch(setIsLoadingSuppliersPaymentDetails(false));
        dispatch(setIsHardReloadingSuppliersPaymentDetails(false));
        dispatch(setLoadingSuppliersPaymentDetailsError(err));
      });
  };
