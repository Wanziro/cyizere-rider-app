import {
  IAction,
  IPackagingOptionsReducer,
  IPackagingOption,
} from '../../interfaces';
import {
  SET_PACKAGING_OPTIONS,
  SET_IS_LOADING_PACKAGING_OPTIONS,
  RESET_PACKAGING_OPTIONS,
  SET_IS_HARD_RELOADING_PACKAGING_OPTIONS,
  SET_LOADING_PACKAGING_OPTIONS_ERROR,
  SET_ADD_OR_UPDATE_PACKAGING_OPTION,
  SET_DELETE_PACKAGING_OPTION,
} from '../actions/packagingOptions';

const initialState: IPackagingOptionsReducer = {
  options: [],
  isLoading: false,
  hardReloading: false,
  loadingError: '',
};

const packagingOptionsRed = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_PACKAGING_OPTIONS:
      return {...state, options: action.payload as IPackagingOption[]};
    case SET_ADD_OR_UPDATE_PACKAGING_OPTION: {
      const newState = state.options;
      const index = newState.findIndex(item => item.id == action.payload.id);
      if (index >= 0) {
        newState[index] = action.payload;
        return {
          ...state,
          options: newState as IPackagingOption[],
        };
      } else {
        return {
          ...state,
          options: [action.payload, ...newState] as IPackagingOption[],
        };
      }
    }
    case SET_DELETE_PACKAGING_OPTION: {
      const newState = state.options.filter(
        item => item.id != action.payload.id,
      );
      return {
        ...state,
        options: newState as IPackagingOption[],
      };
    }
    case SET_IS_LOADING_PACKAGING_OPTIONS:
      return {...state, isLoading: action.payload as boolean};
    case SET_IS_HARD_RELOADING_PACKAGING_OPTIONS:
      return {...state, hardReloading: action.payload as boolean};
    case SET_LOADING_PACKAGING_OPTIONS_ERROR:
      return {...state, loadingError: action.payload as string};
    case RESET_PACKAGING_OPTIONS:
      return initialState;
    default:
      return state;
  }
};

export default packagingOptionsRed;
