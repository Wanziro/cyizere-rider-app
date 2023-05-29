import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserStatus} from '../../actions/user';
import {RootState} from '../../reducers';
import {IUserReducer} from '../../reducers/user';
import DisabledAccount from '../../screens/logged-in/disabled';
import Loader from './loader';
import LoadingError from './loading-error';
import LoggedInLoutes from './routes';

const LoggedIn = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserStatus());
  }, []);

  const {isDisabled, isLoadingStatus, loadingError} = useSelector(
    (state: RootState) => state.user,
  ) as IUserReducer;
  return (
    <>
      {isDisabled ? (
        <DisabledAccount />
      ) : isLoadingStatus ? (
        <Loader />
      ) : loadingError.trim().length !== 0 ? (
        <LoadingError />
      ) : (
        <LoggedInLoutes />
      )}
    </>
  );
};

export default LoggedIn;
