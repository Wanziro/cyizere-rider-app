import {IAction, IProductsReducer, IProduct} from '../../interfaces';
import {
  SET_PRODUCTS,
  SET_IS_LOADING_PRODUCTS,
  RESET_PRODUCTS,
  SET_ADD_OR_UPDATE_PRODUCT,
  SET_DELETE_PRODUCT,
} from '../actions/products';

const initialState: IProductsReducer = {
  products: [],
  isLoading: false,
};

const productReducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {...state, products: action.payload as IProduct[]};
    case SET_ADD_OR_UPDATE_PRODUCT: {
      const newState = state.products;
      const index = newState.findIndex(item => item.pId == action.payload.pId);
      if (index >= 0) {
        newState[index] = action.payload;
        return {
          ...state,
          products: newState as IProduct[],
        };
      } else {
        return {
          ...state,
          products: [action.payload, ...newState] as IProduct[],
        };
      }
    }
    case SET_DELETE_PRODUCT: {
      const newState = state.products.filter(
        item => item.pId != action.payload.pId,
      );
      return {
        ...state,
        products: newState as IProduct[],
      };
    }
    case SET_IS_LOADING_PRODUCTS:
      return {...state, isLoading: action.payload as boolean};
    case RESET_PRODUCTS:
      return initialState;
    default:
      return state;
  }
};

export default productReducer;
