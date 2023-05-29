import axios from 'axios';
import {IMarket} from '../../interfaces';
import {app} from '../constants/app';
import {errorHandler, setHeaders} from '../helpers';

export const SET_SUBSCRIBED_MARKETS = 'SET_SUBSCRIBED_MARKETS';
export const SET_IS_LOADING_SUBSCRIBED_MARKETS =
  'SET_IS_LOADING_SUBSCRIBED_MARKETS';
export const ADD_OR_REMOVE_SUBSCRIBED_MARKET =
  'ADD_OR_REMOVE_SUBSCRIBED_MARKET';
export const RESET_SUBSCRIBED_MARKETS = 'RESET_SUBSCRIBED_MARKETS';
export const SET_ADD_OR_UPDATE_MARKET = 'SET_ADD_OR_UPDATE_MARKET';
export const SET_DELETE_MARKET = 'SET_DELETE_MARKET';

interface IAction {
  type: string;
  payload: any;
}
export const setSubscribedMarkets = (markets: IMarket[]): IAction => ({
  type: SET_SUBSCRIBED_MARKETS,
  payload: markets,
});
export const addOrRemoveSubscribedMarket = (market: IMarket): IAction => ({
  type: ADD_OR_REMOVE_SUBSCRIBED_MARKET,
  payload: market,
});
export const setIsLoadingSubscribedMarkets = (value: boolean): IAction => ({
  type: SET_IS_LOADING_SUBSCRIBED_MARKETS,
  payload: value,
});

export const setAddOrUpdateMarket = (market: IMarket): IAction => ({
  type: SET_ADD_OR_UPDATE_MARKET,
  payload: market,
});
export const setDeleteMarket = (market: IMarket): IAction => ({
  type: SET_DELETE_MARKET,
  payload: market,
});

export const resetSubscribedMarkets = () => ({type: RESET_SUBSCRIBED_MARKETS});

export const fetchSubscribedMarkets =
  (): any => (dispatch: any, getState: any) => {
    const {user} = getState();
    dispatch(setIsLoadingSubscribedMarkets(true));
    axios
      .get(app.BACKEND_URL + '/agents/subscriptions/', setHeaders(user.token))
      .then(res => {
        dispatch(setIsLoadingSubscribedMarkets(false));
        dispatch(setSubscribedMarkets(res.data.subscriptions));
      })
      .catch(error => {
        dispatch(setIsLoadingSubscribedMarkets(false));
        errorHandler(error);
      });
  };

export const fetchSubscribedMarketsSilent =
  (): any => (dispatch: any, getState: any) => {
    const {user} = getState();
    axios
      .get(app.BACKEND_URL + '/agents/subscriptions/', setHeaders(user.token))
      .then(res => {
        dispatch(setIsLoadingSubscribedMarkets(false));
        dispatch(setSubscribedMarkets(res.data.subscriptions));
      })
      .catch(error => {
        // errorHandler(error);
      });
  };
