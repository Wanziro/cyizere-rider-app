import {IAction, IMarket, ISubscribedMarketsReducer} from '../../interfaces';
import {
  SET_SUBSCRIBED_MARKETS,
  SET_IS_LOADING_SUBSCRIBED_MARKETS,
  ADD_OR_REMOVE_SUBSCRIBED_MARKET,
  RESET_SUBSCRIBED_MARKETS,
} from '../actions/markets';

const initialState: ISubscribedMarketsReducer = {
  markets: [],
  isLoading: false,
};

const marketsReducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_SUBSCRIBED_MARKETS:
      return {...state, markets: action.payload as IMarket[]};
    case ADD_OR_REMOVE_SUBSCRIBED_MARKET: {
      const market = action.payload as IMarket;
      let newState = state.markets;

      const exists = newState.find(item => item.mId === market.mId);
      if (exists) {
        return {
          ...state,
          markets: newState.filter(item => item.mId != market.mId) as IMarket[],
        };
      } else {
        // newState.push(market);
        return {...state, markets: [...newState, market] as IMarket[]};
      }
    }
    case SET_IS_LOADING_SUBSCRIBED_MARKETS:
      return {...state, isLoading: action.payload as boolean};
    case RESET_SUBSCRIBED_MARKETS:
      return initialState;
    default:
      return state;
  }
};

export default marketsReducer;
