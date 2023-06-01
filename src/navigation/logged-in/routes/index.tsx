import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Pressable, View, StatusBar, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Octicons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import Icon5 from 'react-native-vector-icons/AntDesign';
import {useLoadBasiData} from '../../../helpers';
import {RootState} from '../../../reducers';
import {APP_COLORS} from '../../../constants/colors';
import PendingOrders from '../../../screens/logged-in/orders/pending-orders';
import CompletedOrders from '../../../screens/logged-in/orders/completed-orders';
import {INavigationProp, PAYMENT_STATUS_ENUM} from '../../../../interfaces';
import Profile from '../../../screens/logged-in/profile';
import Notifications from '../../../screens/logged-in/notifications';
import Wallet from '../../../screens/logged-in/wallet';
import {fetchWalletTransactions} from '../../../actions/walletTransactions';
import VerificationDetails from '../../../screens/logged-in/verification-details';
import DocumentPreview from '../../../screens/logged-in/document-preview';
import AccountSettings from '../../../screens/logged-in/account-settings';
import UpdateUserInfo from '../../../screens/logged-in/update-user-info';
import ChangePassword from '../../../screens/logged-in/change-password';
import DeleteAccount from '../../../screens/logged-in/delete-account';
import HelpAndSupport from '../../../screens/logged-in/help-and-support';
import EditProduct from '../../../screens/logged-in/edit-product';
import ProductPrices from '../../../screens/logged-in/product-prices';
import VisibleProducts from '../../../screens/logged-in/products/visible-products';
import HiddenProducts from '../../../screens/logged-in/products/hiddden-products';
import NotificationsHeader from '../../../screens/logged-in/notifications/header';
import OrderPreview from '../../../screens/logged-in/order-preview';
import AddPackaging from '../../../screens/logged-in/add-packaging';
import EditPackagingOption from '../../../screens/logged-in/edit-packaging-option';
import AddGift from '../../../screens/logged-in/add-gift';
import WaitingOrders from '../../../screens/logged-in/orders/waiting-orders';
import ViewRoute from '../../../screens/logged-in/view-route';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

function LoggedInRoutes() {
  const dispatch = useDispatch();
  const loadData = useLoadBasiData();
  const [initialRoute, setInitialRoute] = useState('');

  function OrdersTab() {
    return (
      <TopTab.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          tabBarActiveTintColor: APP_COLORS.WHITE,
          tabBarInactiveTintColor: APP_COLORS.WHITE,
          tabBarIndicatorContainerStyle: {backgroundColor: APP_COLORS.ORANGE},
          tabBarIndicatorStyle: {
            backgroundColor: 'white',
            height: 5,
          },
          tabBarLabelStyle: {textTransform: 'capitalize'},
        }}>
        <TopTab.Screen
          options={{
            tabBarLabel: 'Waiting',
          }}
          name="WaitingOrders"
          component={WaitingOrders}
        />
        <TopTab.Screen
          options={{
            tabBarLabel: 'Pending',
          }}
          name="PendingOrders"
          component={PendingOrders}
        />
        <TopTab.Screen
          options={{
            tabBarLabel: 'Completed',
          }}
          name="CompletedOrders"
          component={CompletedOrders}
        />
      </TopTab.Navigator>
    );
  }

  function ProductsTab() {
    return (
      <TopTab.Navigator
        initialRouteName="VisibleProducts"
        screenOptions={{
          tabBarActiveTintColor: APP_COLORS.WHITE,
          tabBarInactiveTintColor: APP_COLORS.WHITE,
          tabBarIndicatorContainerStyle: {backgroundColor: APP_COLORS.ORANGE},
          tabBarIndicatorStyle: {
            backgroundColor: 'white',
            height: 5,
          },
          tabBarLabelStyle: {textTransform: 'capitalize'},
        }}>
        <TopTab.Screen
          options={{
            tabBarLabel: 'Visible',
          }}
          name="VisibleProducts"
          component={VisibleProducts}
        />
        <TopTab.Screen
          options={{
            tabBarLabel: 'Hidden',
          }}
          name="HiddenProducts"
          component={HiddenProducts}
        />
      </TopTab.Navigator>
    );
  }

  const HomeTabs = ({navigation}: INavigationProp) => {
    const [activeColor, setActiveColor] = useState(APP_COLORS.WHITE);
    const [inactiveColor, setInactiveColor] = useState('rgba(255,255,255,0.6)');
    const {notifications} = useSelector(
      (state: RootState) => state.notifications,
    );
    const {orders} = useSelector((state: RootState) => state.orders);
    const [notificationsCount, setNotificationsCount] = useState<number>(0);
    const [ordersCount, setOrdersCount] = useState<number>(0);

    useEffect(() => {
      let sub = true;
      if (sub) {
        const count = notifications.filter(item => !item.isViewed).length;
        setNotificationsCount(count);
        const count2 = orders.filter(
          item => item.paymentStatus === PAYMENT_STATUS_ENUM.PENDING,
        ).length;
        setOrdersCount(count2);
      }
      return () => {
        sub = false;
      };
    }, [notifications]);

    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: APP_COLORS.ORANGE,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={OrdersTab}
          options={({route, navigation}) => ({
            headerShown: true,
            headerStyle: {backgroundColor: APP_COLORS.ORANGE},
            headerTintColor: APP_COLORS.WHITE,
            headerTitleAlign: 'center',
            title: 'Orders',
            tabBarIcon: ({focused, color, size}) => {
              return <Icon name="home" color={color} size={size} />;
            },
          })}
        />
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={
            notificationsCount > 0
              ? {
                  headerShown: true,
                  headerTitleAlign: 'center',
                  headerTintColor: APP_COLORS.WHITE,
                  headerStyle: {backgroundColor: APP_COLORS.ORANGE},
                  headerRight: () => <NotificationsHeader />,
                  tabBarIcon: ({focused, color, size}) => {
                    return <Icon3 name="bell-fill" color={color} size={size} />;
                  },
                  tabBarBadge: notificationsCount,
                }
              : {
                  headerShown: true,
                  headerTitleAlign: 'center',
                  headerTintColor: APP_COLORS.WHITE,
                  headerStyle: {backgroundColor: APP_COLORS.ORANGE},
                  headerRight: () => <NotificationsHeader />,
                  tabBarIcon: ({focused, color, size}) => {
                    return <Icon3 name="bell-fill" color={color} size={size} />;
                  },
                }
          }
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
            headerStyle: {backgroundColor: APP_COLORS.ORANGE},
            tabBarIcon: ({focused, color, size}) => {
              return <Icon4 name="user-alt" color={color} size={size} />;
            },
          }}
        />
      </Tab.Navigator>
    );
  };
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={APP_COLORS.ORANGE} barStyle="light-content" />
      <Stack.Navigator
        initialRouteName="HomeTabs"
        screenOptions={{
          // headerMode: 'float',
          // gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="VerificationDetails"
          component={VerificationDetails}
          options={{
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            title: 'Verification Details',
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          }}
        />

        <Stack.Screen
          name="DocumentPreview"
          component={DocumentPreview}
          options={{
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            title: 'Preview',
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          }}
        />

        <Stack.Screen
          name="Wallet"
          component={Wallet}
          options={({route, navigation}: INavigationProp) => ({
            title: 'My Wallet',
            headerRight: () => (
              <Pressable onPress={() => dispatch(fetchWalletTransactions())}>
                <View style={{paddingRight: 10}}>
                  <Icon5 name="reload1" size={25} color={APP_COLORS.WHITE} />
                </View>
              </Pressable>
            ),
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerShadowVisible: false,
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />

        <Stack.Screen
          name="AccountSettings"
          component={AccountSettings}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Account Settings',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />
        <Stack.Screen
          name="UpdateUserInfo"
          component={UpdateUserInfo}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Update Personal Information',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={({route, navigation}: INavigationProp) => ({
            title: 'ChangePassword',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />
        <Stack.Screen
          name="DeleteAccount"
          component={DeleteAccount}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Delete Account',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
        <Stack.Screen
          name="HelpAndSupport"
          component={HelpAndSupport}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Help & Support',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
        <Stack.Screen
          name="Products"
          component={ProductsTab}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Products',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerRight: () => (
              <Pressable
                style={{marginRight: 10}}
                onPress={() => navigation.navigate('AddProduct')}>
                <Text style={{color: APP_COLORS.WHITE}}>Add New</Text>
              </Pressable>
            ),
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
        <Stack.Screen
          name="EditProduct"
          component={EditProduct}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Editing ' + route?.params?.product?.name,
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
        <Stack.Screen
          name="ProductPrices"
          component={ProductPrices}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Prices for ' + route?.params?.product?.name,
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />

        <Stack.Screen
          name="OrderPreview"
          component={OrderPreview}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Order Details',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'left',
            headerTintColor: APP_COLORS.WHITE,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
        <Stack.Screen
          name="AddPackaging"
          component={AddPackaging}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Add Packaging Option',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'left',
            headerTintColor: APP_COLORS.WHITE,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
        <Stack.Screen
          name="EditPackagingOption"
          component={EditPackagingOption}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Editing ' + route?.params?.option?.name,
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
        <Stack.Screen
          name="AddGift"
          component={AddGift}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Add gift',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
        <Stack.Screen
          name="ViewRoute"
          component={ViewRoute}
          options={({route, navigation}: INavigationProp) => ({
            title: '',
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default LoggedInRoutes;
