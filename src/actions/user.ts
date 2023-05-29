import axios from 'axios';
import {app} from '../constants/app';
import {errorHandler, setHeaders} from '../helpers';
import {IUser, USER_TYPE_ENUM} from '../../interfaces';

export const SET_FB_TOKEN = 'SET_FB_TOKEN';
export const SET_USER_NAMES = 'SET_USER_NAMES';
export const SET_USER_EMAIL = 'SET_USER_EMAIL';
export const SET_USER_PHONE = 'SET_USER_PHONE';
export const SET_USER_TOKEN = 'SET_USER_TOKEN';
export const SET_USER_SHOP_IMAGE = 'SET_USER_SHOP_IMAGE';
export const SET_UPDATE_SUPPLIER = 'SET_UPDATE_SUPPLIER';
export const SET_USER_ID = 'SET_USER_ID';
export const SET_USER_IS_ACTIVE = 'SET_USER_IS_ACTIVE';
export const SET_USER_IS_DISABLED = 'SET_USER_IS_DISABLED';
export const SET_USER_IS_VERIFIED = 'SET_USER_IS_VERIFIED';
export const SET_USER_ID_NUMBER = 'SET_USER_ID_NUMBER';
export const SET_USER_ID_NUMBER_DOCUMENT = 'SET_USER_ID_NUMBER_DOCUMENT';
export const SET_USER_VERIFICATION_STATUS = 'SET_USER_VERIFICATION_STATUS';
export const SET_USER_VERIFICATION_MESSAGE = 'SET_USER_VERIFICATION_MESSAGE';
//
export const SET_USER_SHOP_NAME = 'SET_USER_SHOP_NAME';
export const SET_USER_SHOP_ADDRESS = 'SET_USER_SHOP_ADDRESS';
export const SET_USER_SHOP_CATEGORY_ID = 'SET_USER_SHOP_CATEGORY_ID';
export const SET_USER_SHOP_LAT = 'SET_USER_SHOP_LAT';
export const SET_USER_SHOP_LONG = 'SET_USER_SHOP_LONG';
export const SET_USER_SHOP_OPEN = 'SET_USER_SHOP_OPEN';
export const SET_USER_SHOP_CLOSE = 'SET_USER_SHOP_CLOSE';
export const SET_USER_HAS_GIFT = 'SET_USER_HAS_GIFT';
//
export const SET_IS_LOADING_USER_VERIFICATION_STATUS =
  'SET_IS_LOADING_USER_VERIFICATION_STATUS';
export const SET_IS_LOADING_USER_VERIFICATION_STATUS_ERROR =
  'SET_IS_LOADING_USER_VERIFICATION_STATUS_ERROR';
export const RESET_USER = 'RESET_USER';

interface IAction {
  type: string;
  payload: any;
}
export const setUserNames = (names: string): IAction => ({
  type: SET_USER_NAMES,
  payload: names,
});

export const setUserShopName = (names: string): IAction => ({
  type: SET_USER_SHOP_NAME,
  payload: names,
});

export const setUserShopAddress = (names: string): IAction => ({
  type: SET_USER_SHOP_ADDRESS,
  payload: names,
});
export const setUserShopCategoryId = (names: string): IAction => ({
  type: SET_USER_SHOP_CATEGORY_ID,
  payload: names,
});
export const setUserShopLat = (names: string): IAction => ({
  type: SET_USER_SHOP_LAT,
  payload: names,
});
export const setUserShopLong = (names: string): IAction => ({
  type: SET_USER_SHOP_LONG,
  payload: names,
});
export const setUserShopOpen = (names: string): IAction => ({
  type: SET_USER_SHOP_OPEN,
  payload: names,
});
export const setUserShopClose = (names: string): IAction => ({
  type: SET_USER_SHOP_CLOSE,
  payload: names,
});
export const setUserShopImage = (image: string): IAction => ({
  type: SET_USER_SHOP_IMAGE,
  payload: image,
});
export const setUserEmail = (value: string): IAction => ({
  type: SET_USER_EMAIL,
  payload: value,
});

export const setUpdateAgent = (value: IUser): IAction => ({
  type: SET_UPDATE_SUPPLIER,
  payload: value,
});

export const setUserPhone = (value: string): IAction => ({
  type: SET_USER_PHONE,
  payload: value,
});

export const setFbToken = (token: string): IAction => ({
  type: SET_FB_TOKEN,
  payload: token,
});

export const setIsUserVerified = (value: boolean): IAction => ({
  type: SET_USER_IS_VERIFIED,
  payload: value,
});

export const setUserHasShop = (value: boolean): IAction => ({
  type: SET_USER_HAS_GIFT,
  payload: value,
});

export const setUserVerificationStatus = (value: string): IAction => ({
  type: SET_USER_VERIFICATION_STATUS,
  payload: value,
});

export const setUserVerificationMessage = (value: string): IAction => ({
  type: SET_USER_VERIFICATION_MESSAGE,
  payload: value,
});

export const setIsUserDisabled = (value: boolean): IAction => ({
  type: SET_USER_IS_DISABLED,
  payload: value,
});

export const setIsUserActive = (value: boolean): IAction => ({
  type: SET_USER_IS_ACTIVE,
  payload: value,
});

export const setUserId = (value: number): IAction => ({
  type: SET_USER_ID,
  payload: value,
});

export const setUserIdNumber = (value: number): IAction => ({
  type: SET_USER_ID_NUMBER,
  payload: value,
});

export const setUserIdNumberDocument = (value: string): IAction => ({
  type: SET_USER_ID_NUMBER_DOCUMENT,
  payload: value,
});

export const setUserToken = (value: string): IAction => ({
  type: SET_USER_TOKEN,
  payload: value,
});

export const setIsLoadingUserVerificationStatusError = (
  value: string,
): IAction => ({
  type: SET_IS_LOADING_USER_VERIFICATION_STATUS_ERROR,
  payload: value,
});

export const setIsLoadingUserVerificationStatus = (
  value: boolean,
): IAction => ({
  type: SET_IS_LOADING_USER_VERIFICATION_STATUS,
  payload: value,
});

export const resetUser = () => ({type: RESET_USER});

export const fetchUserStatus = (): any => (dispatch: any, getState: any) => {
  const {user} = getState();
  dispatch(setIsLoadingUserVerificationStatus(true));
  dispatch(setIsLoadingUserVerificationStatusError(''));
  axios
    .get(app.BACKEND_URL + '/suppliers/verification', setHeaders(user.token))
    .then(res => {
      console.log({res: res.data});
      const {
        isVerified,
        isDisabled,
        isActive,
        verificationStatus,
        verificationMessage,
        hasGift,
      } = res.data.info;
      dispatch(setIsUserVerified(isVerified));
      dispatch(setIsUserDisabled(isDisabled));
      dispatch(setIsUserActive(isActive));
      dispatch(setUserVerificationMessage(verificationMessage));
      dispatch(setUserVerificationStatus(verificationStatus));
      dispatch(setIsLoadingUserVerificationStatusError(''));
      dispatch(setIsLoadingUserVerificationStatus(false));
      dispatch(setUserHasShop(hasGift));
    })
    .catch(error => {
      dispatch(setIsLoadingUserVerificationStatus(false));
      //errorHandler(error);
      if (error?.response?.data?.msg) {
        dispatch(
          setIsLoadingUserVerificationStatusError(error.response.data.msg),
        );
      } else if (error.message) {
        dispatch(setIsLoadingUserVerificationStatusError(error.message));
      } else {
        dispatch(setIsLoadingUserVerificationStatusError(error));
      }
    });
};

export const fetchUserStatusSilent =
  (): any => (dispatch: any, getState: any) => {
    const {user} = getState();
    axios
      .get(app.BACKEND_URL + '/suppliers/verification', setHeaders(user.token))
      .then(res => {
        dispatch(setIsLoadingUserVerificationStatus(false));
        const {
          isVerified,
          isDisabled,
          isActive,
          verificationStatus,
          verificationMessage,
          hasGift,
        } = res.data.info;
        dispatch(setIsUserVerified(isVerified));
        dispatch(setIsUserDisabled(isDisabled));
        dispatch(setIsUserActive(isActive));
        dispatch(setUserVerificationMessage(verificationMessage));
        dispatch(setUserVerificationStatus(verificationStatus));
        dispatch(setIsLoadingUserVerificationStatusError(''));
        dispatch(setUserHasShop(hasGift));
      })
      .catch(error => {
        //
      });
  };

export const saveAppToken = (): any => (dispatch: any, getState: any) => {
  const {user} = getState();
  try {
    if (user.fbToken.trim() === '') {
      return;
    }
    axios
      .post(app.BACKEND_URL + '/apptokens/', {
        userId: user.agentId,
        fbToken: user.fbToken,
        appType: USER_TYPE_ENUM.AGENT,
      })
      .then(res => {
        // console.log({res});
      })
      .catch(error => {
        // console.log({error});
      });
  } catch (error) {}
};
