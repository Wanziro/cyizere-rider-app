import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {store, persistor} from './src/store';
import {PersistGate} from 'redux-persist/integration/react';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import Navigation from './src/navigation';
import {subscribeToSocket, unSubscribeToSocket} from './src/worker/socket';
import {saveAppToken, setFbToken} from './src/actions/user';

import Toast, {BaseToast} from 'react-native-toast-message';
import {APP_COLORS} from './src/constants/colors';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// const requestCloudMessagingNotificationPermissionFromUser = async () => {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//     //get tokent
//     const token = await messaging().getToken();
//     console.log({token});
//     if (token) {
//       //subscribe to broadcast topic
//       const subscription = await messaging().subscribeToTopic('broadcast');
//       console.log({subscription});
//       //save token to db
//       store.dispatch(setFbToken(token));
//       store.dispatch(saveAppToken());
//     }
//   }
// };

function App(): JSX.Element {
  // const {user}: any = store.getState();
  // useEffect(() => {
  //   subscribeToSocket(store);
  //   // requestCloudMessagingNotificationPermissionFromUser();

  //   // window.addEventListener("online", handleOnline);
  //   // window.addEventListener("offline", handleOffline);

  //   return () => {
  //     unSubscribeToSocket();
  //     // window.removeEventListener("online", handleOnline);
  //     // window.removeEventListener("offline", handleOffline);
  //   };
  // }, []);
  // useEffect(() => {
  //   let sub = true;
  //   if (sub) {
  //     store.dispatch(saveAppToken());
  //   }
  //   return () => {
  //     sub = false;
  //   };
  // }, [user.fbToken]);

  const toastConfig = {
    success: ({text1, text2, props, ...rest}: any) => (
      <BaseToast
        {...rest}
        style={{backgroundColor: 'green', borderLeftColor: APP_COLORS.ORANGE}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 15,
          fontWeight: '400',
          color: 'white',
        }}
        text1={text1}
        text2={text2}
        text2Style={{color: 'white', fontSize: 14}}
        text2NumberOfLines={10}
      />
    ),
    error: ({text1, text2, props, ...rest}: any) => (
      <BaseToast
        {...rest}
        style={{backgroundColor: 'red', borderLeftColor: 'red'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 15,
          fontWeight: '400',
          color: 'white',
        }}
        text1={text1}
        text2={text2}
        text2Style={{color: 'white', fontSize: 14}}
        text2NumberOfLines={10}
      />
    ),
    info: ({text1, props, ...rest}: any) => (
      <BaseToast
        {...rest}
        style={{backgroundColor: 'pink', borderLeftColor: 'pink'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 15,
          fontWeight: '400',
          color: 'white',
        }}
        text1={text1}
        text2={props.uuid}
        text2Style={{color: 'white', fontSize: 14}}
        text2NumberOfLines={10}
      />
    ),
  };
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
      <Toast config={toastConfig} />
    </>
  );
}

export default App;
