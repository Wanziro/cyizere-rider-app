import axios from 'axios';
import {app} from '../constants/app';
import {errorHandler, setHeaders} from '../helpers';
import {IUser, USER_TYPE_ENUM} from '../../interfaces';

export const SET_USER = 'SET_USER';

export const SET_IS_LOADING_USER_VERIFICATION_STATUS =
  'SET_IS_LOADING_USER_VERIFICATION_STATUS';
export const SET_IS_LOADING_USER_VERIFICATION_STATUS_ERROR =
  'SET_IS_LOADING_USER_VERIFICATION_STATUS_ERROR';
export const RESET_USER = 'RESET_USER';

interface IAction {
  type: string;
  payload: any;
}
export const setUser = (user: IUser): IAction => ({
  type: SET_USER,
  payload: user,
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
    .get(app.BACKEND_URL + '/riders/verification', setHeaders(user.token))
    .then(res => {
      console.log({res: res.data});
      const {
        isVerified,
        isDisabled,
        isActive,
        verificationStatus,
        verificationMessage,
      } = res.data.info;
      dispatch(
        setUser({
          ...user,
          isVerified,
          isDisabled,
          isActive,
          verificationStatus,
          verificationMessage,
        }),
      );
      dispatch(setIsLoadingUserVerificationStatusError(''));
      dispatch(setIsLoadingUserVerificationStatus(false));
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
        dispatch(
          setUser({
            ...user,
            isVerified,
            isDisabled,
            isActive,
            verificationStatus,
            verificationMessage,
          }),
        );
        dispatch(setIsLoadingUserVerificationStatusError(''));
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
