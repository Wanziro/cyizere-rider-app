import {IAction, IShopCategoriesReducer, IShopCategory} from '../../interfaces';
import {
  SET_SHOP_CATEGORIES,
  SET_IS_LOADING_SHOP_CATEGORIES,
  RESET_SHOP_CATEGORIES,
  SET_SELECTED_SHOP_CATEGORY,
  SET_IS_HARD_RELOADING_SHOP_CATEGORIES,
  SET_LOADING_SHOP_CATEGORIES_ERROR,
  SET_ADD_OR_UPDATE_SHOP_CATEGORY,
  SET_DELETE_SHOP_CATEGORY,
} from '../actions/shopCategories';

const initialState: IShopCategoriesReducer = {
  categories: [],
  selectedCategory: undefined,
  isLoading: false,
  hardReloading: false,
  loadingError: '',
};

const shopCategoriesReducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_SHOP_CATEGORIES:
      return {...state, categories: action.payload as IShopCategory[]};
    case SET_ADD_OR_UPDATE_SHOP_CATEGORY: {
      const newState = state.categories;
      const index = newState.findIndex(item => item.id == action.payload.id);
      if (index >= 0) {
        newState[index] = action.payload;
        return {
          ...state,
          categories: newState as IShopCategory[],
        };
      } else {
        return {
          ...state,
          categories: [action.payload, ...newState] as IShopCategory[],
        };
      }
    }
    case SET_DELETE_SHOP_CATEGORY: {
      const newState = state.categories.filter(
        item => item.id != action.payload.id,
      );
      return {
        ...state,
        categories: newState as IShopCategory[],
      };
    }
    case SET_SELECTED_SHOP_CATEGORY:
      return {...state, selectedCategory: action.payload as IShopCategory};
    case SET_IS_LOADING_SHOP_CATEGORIES:
      return {...state, isLoading: action.payload as boolean};
    case SET_IS_HARD_RELOADING_SHOP_CATEGORIES:
      return {...state, hardReloading: action.payload as boolean};
    case SET_LOADING_SHOP_CATEGORIES_ERROR:
      return {...state, loadingError: action.payload as string};
    case RESET_SHOP_CATEGORIES:
      return initialState;
    default:
      return state;
  }
};

export default shopCategoriesReducer;
