import {View, Text, Dimensions, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import SubmitButton from '../../../components/submit-button';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {IUserReducer} from '../../../reducers/user';
import FullPageLoader from '../../../components/full-page-loader';
import axios from 'axios';
import {app} from '../../../constants/app';
import {errorHandler, setHeaders, toastMessage} from '../../../helpers';
import {TOAST_MESSAGE_TYPES} from '../../../../interfaces';
import {setUserShopClose, setUserShopOpen} from '../../../actions/user';

const {width} = Dimensions.get('window');
const initialState = {
  open: new Date(),
  close: new Date(),
};
const UpdateShopHours = () => {
  const dispatch = useDispatch();
  const {open, close, token} = useSelector(
    (state: RootState) => state.user as IUserReducer,
  );
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const returnDateObj = (timeStr: string) => {
    let timeParts = timeStr.split(':');
    let hours = parseInt(timeParts[0]);
    let minutes = parseInt(timeParts[1].split(' ')[0]);

    if (timeStr.includes('PM') && hours !== 12) {
      hours += 12;
    }

    let dateObj = new Date();
    dateObj.setHours(hours);
    dateObj.setMinutes(minutes);

    return dateObj;
  };

  useEffect(() => {
    setState({open: returnDateObj(open), close: returnDateObj(close)});
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    axios
      .put(
        app.BACKEND_URL + '/suppliers/hours',
        {
          open: new Date(state.open).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          close: new Date(state.close).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
        },
        setHeaders(token),
      )
      .then(res => {
        setIsLoading(false);
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
        dispatch(setUserShopOpen(res.data.open));
        dispatch(setUserShopClose(res.data.close));
      })
      .catch(error => {
        setIsLoading(false);
        errorHandler(error);
      });
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: APP_COLORS.BACKGROUND_COLOR,
        padding: 10,
      }}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <View>
            <Text
              style={{
                color: APP_COLORS.TEXT_GRAY,
                textAlign: 'center',
                fontWeight: '600',
              }}>
              Open From
            </Text>
            <DatePicker
              date={state.open}
              mode="time"
              style={{width: width, marginRight: 5, marginTop: 10}}
              onDateChange={date => setState({...state, open: date})}
            />
          </View>
          <View style={{marginTop: 20}}>
            <Text
              style={{
                color: APP_COLORS.TEXT_GRAY,
                textAlign: 'center',
                fontWeight: '600',
              }}>
              Close From
            </Text>
            <DatePicker
              date={state.close}
              mode="time"
              style={{width: width, marginRight: 5, marginTop: 10}}
              onDateChange={date => setState({...state, close: date})}
            />
          </View>
        </View>
      </ScrollView>
      <SubmitButton
        title="Update"
        buttonProps={{onPress: () => handleSubmit(), disabled: isLoading}}
      />
      <FullPageLoader isLoading={isLoading} />
    </View>
  );
};

export default UpdateShopHours;
