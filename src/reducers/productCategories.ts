import {
  IAction,
  IProductCategoriesReducer,
  IProductCategory,
} from '../../interfaces';
import {
  SET_PRODUCT_CATEGORIES,
  SET_IS_LOADING_PRODUCT_CATEGORIES,
  RESET_PRODUCT_CATEGORIES,
  SET_SELECTED_PRODUCT_CATEGORY,
  SET_IS_HARD_RELOADING_PRODUCT_CATEGORIES,
  SET_LOADING_PRODUCT_CATEGORIES_ERROR,
  SET_ADD_OR_UPDATE_PRODUCT_CATEGORY,
  SET_DELETE_PRODUCT_CATEGORY,
} from '../actions/productCategories';

const initialState: IProductCategoriesReducer = {
  categories: [],
  selectedCategory: undefined,
  isLoading: false,
  hardReloading: false,
  loadingError: '',
};

const productCategoriesReducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_PRODUCT_CATEGORIES:
      return {...state, categories: action.payload as IProductCategory[]};
    case SET_ADD_OR_UPDATE_PRODUCT_CATEGORY: {
      const newState = state.categories;
      const index = newState.findIndex(item => item.id == action.payload.id);
      if (index >= 0) {
        newState[index] = action.payload;
        return {
          ...state,
          categories: newState as IProductCategory[],
        };
      } else {
        return {
          ...state,
          categories: [action.payload, ...newState] as IProductCategory[],
        };
      }
    }
    case SET_DELETE_PRODUCT_CATEGORY: {
      const newState = state.categories.filter(
        item => item.id != action.payload.id,
      );
      return {
        ...state,
        categories: newState as IProductCategory[],
      };
    }
    case SET_SELECTED_PRODUCT_CATEGORY:
      return {...state, selectedCategory: action.payload as IProductCategory};
    case SET_IS_LOADING_PRODUCT_CATEGORIES:
      return {...state, isLoading: action.payload as boolean};
    case SET_IS_HARD_RELOADING_PRODUCT_CATEGORIES:
      return {...state, hardReloading: action.payload as boolean};
    case SET_LOADING_PRODUCT_CATEGORIES_ERROR:
      return {...state, loadingError: action.payload as string};
    case RESET_PRODUCT_CATEGORIES:
      return initialState;
    default:
      return state;
  }
};

export default productCategoriesReducer;
