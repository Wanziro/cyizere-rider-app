import axios from 'axios';
import {IProductCategory} from '../../interfaces';
import {app} from '../constants/app';
import {errorHandler, returnErroMessage} from '../helpers';

export const SET_PRODUCT_CATEGORIES = 'SET_PRODUCT_CATEGORIES';
export const SET_IS_LOADING_PRODUCT_CATEGORIES =
  'SET_IS_LOADING_PRODUCT_CATEGORIES';
export const SET_SELECTED_PRODUCT_CATEGORY = 'SET_SELECTED_PRODUCT_CATEGORY';
export const RESET_PRODUCT_CATEGORIES = 'RESET_PRODUCT_CATEGORIES';
export const SET_ADD_OR_UPDATE_PRODUCT_CATEGORY =
  'SET_ADD_OR_UPDATE_PRODUCT_CATEGORY';
export const SET_DELETE_PRODUCT_CATEGORY = 'SET_DELETE_PRODUCT_CATEGORY';
export const SET_LOADING_PRODUCT_CATEGORIES_ERROR =
  'SET_LOADING_PRODUCT_CATEGORIES_ERROR';
export const SET_IS_HARD_RELOADING_PRODUCT_CATEGORIES =
  'SET_IS_HARD_RELOADING_PRODUCT_CATEGORIES';

interface IAction {
  type: string;
  payload: any;
}
export const setProductCategories = (
  categories: IProductCategory[],
): IAction => ({
  type: SET_PRODUCT_CATEGORIES,
  payload: categories,
});
export const setAddOrUpdateProductCategory = (
  category: IProductCategory,
): IAction => ({
  type: SET_ADD_OR_UPDATE_PRODUCT_CATEGORY,
  payload: category,
});
export const setDeleteProductCategory = (
  category: IProductCategory,
): IAction => ({
  type: SET_DELETE_PRODUCT_CATEGORY,
  payload: category,
});
export const setSelectedProductCategory = (
  category: IProductCategory,
): IAction => ({
  type: SET_SELECTED_PRODUCT_CATEGORY,
  payload: category,
});
export const setIsLoadingProductCategories = (value: boolean): IAction => ({
  type: SET_IS_LOADING_PRODUCT_CATEGORIES,
  payload: value,
});
export const setIsHardReLoadingProductCategories = (
  value: boolean,
): IAction => ({
  type: SET_IS_HARD_RELOADING_PRODUCT_CATEGORIES,
  payload: value,
});
export const setLoadingProductCategoriesError = (value: string): IAction => ({
  type: SET_LOADING_PRODUCT_CATEGORIES_ERROR,
  payload: value,
});
export const resetProductCategories = () => ({type: RESET_PRODUCT_CATEGORIES});

export const fetchProductCategories =
  (): any => (dispatch: any, getState: any) => {
    dispatch(setIsLoadingProductCategories(true));
    dispatch(setLoadingProductCategoriesError(''));
    axios
      .get(app.BACKEND_URL + '/productcategories/')
      .then(res => {
        dispatch(setIsLoadingProductCategories(false));
        dispatch(setIsHardReLoadingProductCategories(false));
        dispatch({
          type: SET_PRODUCT_CATEGORIES,
          payload: res.data.categories,
        });
      })
      .catch(error => {
        const err = returnErroMessage(error);
        dispatch(setIsLoadingProductCategories(false));
        dispatch(setIsHardReLoadingProductCategories(false));
        // errorHandler(error);
        dispatch(setLoadingProductCategoriesError(err));
      });
  };
