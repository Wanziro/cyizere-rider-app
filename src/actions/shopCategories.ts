import axios from 'axios';
import {IShopCategoriesReducer} from '../../interfaces';
import {app} from '../constants/app';
import {errorHandler, returnErroMessage} from '../helpers';

export const SET_SHOP_CATEGORIES = 'SET_SHOP_CATEGORIES';
export const SET_IS_LOADING_SHOP_CATEGORIES = 'SET_IS_LOADING_SHOP_CATEGORIES';
export const SET_SELECTED_SHOP_CATEGORY = 'SET_SELECTED_SHOP_CATEGORY';
export const RESET_SHOP_CATEGORIES = 'RESET_SHOP_CATEGORIES';
export const SET_ADD_OR_UPDATE_SHOP_CATEGORY =
  'SET_ADD_OR_UPDATE_SHOP_CATEGORY';
export const SET_DELETE_SHOP_CATEGORY = 'SET_DELETE_SHOP_CATEGORY';
export const SET_LOADING_SHOP_CATEGORIES_ERROR =
  'SET_LOADING_SHOP_CATEGORIES_ERROR';
export const SET_IS_HARD_RELOADING_SHOP_CATEGORIES =
  'SET_IS_HARD_RELOADING_SHOP_CATEGORIES';

interface IAction {
  type: string;
  payload: any;
}
export const setShopCategories = (
  categories: IShopCategoriesReducer[],
): IAction => ({
  type: SET_SHOP_CATEGORIES,
  payload: categories,
});
export const setAddOrUpdateShopCategory = (
  category: IShopCategoriesReducer,
): IAction => ({
  type: SET_ADD_OR_UPDATE_SHOP_CATEGORY,
  payload: category,
});
export const setDeleteShopCategory = (
  category: IShopCategoriesReducer,
): IAction => ({
  type: SET_DELETE_SHOP_CATEGORY,
  payload: category,
});
export const setSelectedShopCategory = (
  category: IShopCategoriesReducer,
): IAction => ({
  type: SET_SELECTED_SHOP_CATEGORY,
  payload: category,
});
export const setIsLoadingShopCategories = (value: boolean): IAction => ({
  type: SET_IS_LOADING_SHOP_CATEGORIES,
  payload: value,
});
export const setIsHardReLoadingShopCategories = (value: boolean): IAction => ({
  type: SET_IS_HARD_RELOADING_SHOP_CATEGORIES,
  payload: value,
});
export const setLoadingShopCategoriesError = (value: string): IAction => ({
  type: SET_LOADING_SHOP_CATEGORIES_ERROR,
  payload: value,
});
export const resetShopCategories = () => ({type: RESET_SHOP_CATEGORIES});

export const fetchShopCategories =
  (): any => (dispatch: any, getState: any) => {
    dispatch(setIsLoadingShopCategories(true));
    dispatch(setLoadingShopCategoriesError(''));
    axios
      .get(app.BACKEND_URL + '/shopcategories/')
      .then(res => {
        dispatch(setIsLoadingShopCategories(false));
        dispatch(setIsHardReLoadingShopCategories(false));
        dispatch({
          type: SET_SHOP_CATEGORIES,
          payload: res.data.categories,
        });
      })
      .catch(error => {
        const err = returnErroMessage(error);
        dispatch(setIsLoadingShopCategories(false));
        dispatch(setIsHardReLoadingShopCategories(false));
        // errorHandler(error);
        dispatch(setLoadingShopCategoriesError(err));
      });
  };
