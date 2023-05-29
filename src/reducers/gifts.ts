import {IAction, IGfitsReducer, IGift} from '../../interfaces';
import {SET_GIFTS, SET_IS_LOADING_GIFTS, RESET_GIFTS} from '../actions/gifts';

const initialState: IGfitsReducer = {
  gifts: [],
  isLoading: false,
};

const dishRed = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_GIFTS:
      return {...state, gifts: action.payload as IGift[]};
    case SET_IS_LOADING_GIFTS:
      return {...state, isLoading: action.payload as boolean};
    case RESET_GIFTS:
      return initialState;
    default:
      return state;
  }
};

export default dishRed;
