import axios from 'axios';
import {IGift} from '../../interfaces';
import {app} from '../constants/app';
import {errorHandler, setHeaders} from '../helpers';

export const SET_GIFTS = 'SET_GIFTS';
export const SET_IS_LOADING_GIFTS = 'SET_IS_LOADING_GIFTS';
export const RESET_GIFTS = 'RESET_GIFTS';

interface IAction {
  type: string;
  payload: any;
}
export const setGifts = (gifts: IGift[]): IAction => ({
  type: SET_GIFTS,
  payload: gifts,
});

export const setIsLoadingGifts = (value: boolean): IAction => ({
  type: SET_IS_LOADING_GIFTS,
  payload: value,
});

export const resetGifts = () => ({type: RESET_GIFTS});

export const fetchGifts = (): any => (dispatch: any, getState: any) => {
  const {user} = getState();
  dispatch(setIsLoadingGifts(true));
  axios
    .get(app.BACKEND_URL + '/gifts/mine', setHeaders(user.token))
    .then(res => {
      dispatch(setIsLoadingGifts(false));
      dispatch({
        type: SET_GIFTS,
        payload: res.data.gifts,
      });
    })
    .catch(error => {
      dispatch(setIsLoadingGifts(false));
      errorHandler(error);
    });
};
