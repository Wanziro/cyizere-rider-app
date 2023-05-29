import axios from 'axios';
import {IPackagingOption} from '../../interfaces';
import {app} from '../constants/app';
import {errorHandler, returnErroMessage, setHeaders} from '../helpers';

export const SET_PACKAGING_OPTIONS = 'SET_PACKAGING_OPTIONS';
export const SET_IS_LOADING_PACKAGING_OPTIONS =
  'SET_IS_LOADING_PACKAGING_OPTIONS';
export const SET_IS_HARD_RELOADING_PACKAGING_OPTIONS =
  'SET_IS_HARD_RELOADING_PACKAGING_OPTIONS';
export const SET_LOADING_PACKAGING_OPTIONS_ERROR =
  'SET_LOADING_PACKAGING_OPTIONS_ERROR';
export const RESET_PACKAGING_OPTIONS = 'RESET_PACKAGING_OPTIONS';
export const SET_ADD_OR_UPDATE_PACKAGING_OPTION =
  'SET_ADD_OR_UPDATE_PACKAGING_OPTION';
export const SET_DELETE_PACKAGING_OPTION = 'SET_DELETE_PACKAGING_OPTION';

interface IAction {
  type: string;
  payload: any;
}
export const setPackagingOptions = (options: IPackagingOption[]): IAction => ({
  type: SET_PACKAGING_OPTIONS,
  payload: options,
});
export const setIsLoadingPackagingOptions = (value: boolean): IAction => ({
  type: SET_IS_LOADING_PACKAGING_OPTIONS,
  payload: value,
});
export const setIsHardReLoadingPackagingOptions = (
  value: boolean,
): IAction => ({
  type: SET_IS_HARD_RELOADING_PACKAGING_OPTIONS,
  payload: value,
});

export const setAddOrUpdatePackagingOption = (
  option: IPackagingOption,
): IAction => ({
  type: SET_ADD_OR_UPDATE_PACKAGING_OPTION,
  payload: option,
});
export const setDeletePackagingOption = (
  option: IPackagingOption,
): IAction => ({
  type: SET_DELETE_PACKAGING_OPTION,
  payload: option,
});

export const setLoadingPackagingOptionsError = (error: string): IAction => ({
  type: SET_LOADING_PACKAGING_OPTIONS_ERROR,
  payload: error,
});

export const resetPackagingOptions = () => ({type: RESET_PACKAGING_OPTIONS});

export const fetchPackagingOptions =
  (): any => (dispatch: any, getState: any) => {
    const {user} = getState();
    dispatch(setIsLoadingPackagingOptions(true));
    dispatch(setLoadingPackagingOptionsError(''));
    axios
      .get(app.BACKEND_URL + '/packagingoptions/' + user.supplierId)
      .then(res => {
        dispatch(setIsLoadingPackagingOptions(false));
        dispatch(setPackagingOptions(res.data.options));
      })
      .catch(error => {
        const err = returnErroMessage(error);
        dispatch(setIsLoadingPackagingOptions(false));
        dispatch(setIsHardReLoadingPackagingOptions(false));
        // errorHandler(error);
        dispatch(setLoadingPackagingOptionsError(err));
      });
  };
