import axios from 'axios';
import {IProduct} from '../../interfaces';
import {app} from '../constants/app';
import {errorHandler, setHeaders} from '../helpers';

export const SET_PRODUCTS = 'SET_PRODUCTS';
export const SET_IS_LOADING_PRODUCTS = 'SET_IS_LOADING_PRODUCTS';
export const SET_ADD_OR_UPDATE_PRODUCT = 'SET_ADD_OR_UPDATE_PRODUCT';
export const SET_DELETE_PRODUCT = 'SET_DELETE_PRODUCT';
export const RESET_PRODUCTS = 'RESET_PRODUCTS';

interface IAction {
  type: string;
  payload: any;
}
export const setProducts = (categories: IProduct[]): IAction => ({
  type: SET_PRODUCTS,
  payload: categories,
});
export const setIsLoadingProducts = (value: boolean): IAction => ({
  type: SET_IS_LOADING_PRODUCTS,
  payload: value,
});

export const setAddOrUpdateProduct = (product: IProduct): IAction => ({
  type: SET_ADD_OR_UPDATE_PRODUCT,
  payload: product,
});
export const setDeleteProduct = (product: IProduct): IAction => ({
  type: SET_DELETE_PRODUCT,
  payload: product,
});

export const resetProducts = () => ({type: RESET_PRODUCTS});

export const fetchProducts = (): any => (dispatch: any, getState: any) => {
  const {user} = getState();
  dispatch(setIsLoadingProducts(true));
  axios
    .get(app.BACKEND_URL + '/products/mine', setHeaders(user.token))
    .then(res => {
      dispatch(setIsLoadingProducts(false));
      dispatch({
        type: SET_PRODUCTS,
        payload: res.data.products,
      });
    })
    .catch(error => {
      dispatch(setIsLoadingProducts(false));
      errorHandler(error);
    });
};
