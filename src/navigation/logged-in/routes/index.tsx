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
import {Pressable, View, StatusBar, Text, Easing, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
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
import MarketSubScriptions from '../../../screens/logged-in/market-subscriptions';
import OrderDetails from '../../../screens/logged-in/order-details';
import PaymentDetails from '../../../screens/logged-in/payment-details';
import AddSupplier from '../../../screens/logged-in/add-supplier';
import PaymentProof from '../../../screens/logged-in/payment-proof';
import ChattRoom from '../../../screens/logged-in/chat-room';
import ChattRoomHeader from '../../../screens/logged-in/chat-room/header';
import ViewAndSendSelectedFile from '../../../screens/logged-in/chat-room/view-and-send-selected-file';
import ImagePreview from '../../../screens/logged-in/chat-room/image-preview';
import AccountSettings from '../../../screens/logged-in/account-settings';
import UpdateUserInfo from '../../../screens/logged-in/update-user-info';
import ChangePassword from '../../../screens/logged-in/change-password';
import DeleteAccount from '../../../screens/logged-in/delete-account';
import HelpAndSupport from '../../../screens/logged-in/help-and-support';
import Home from '../../../screens/logged-in/home';
import AddProduct from '../../../screens/logged-in/add-product';
import EditProduct from '../../../screens/logged-in/edit-product';
import ProductPrices from '../../../screens/logged-in/product-prices';
import VisibleProducts from '../../../screens/logged-in/products/visible-products';
import HiddenProducts from '../../../screens/logged-in/products/hiddden-products';
import NotificationsHeader from '../../../screens/logged-in/notifications/header';
import FailedOrders from '../../../screens/logged-in/orders/failed-orders';
import OrderPreview from '../../../screens/logged-in/order-preview';
import UpdateShopLocation from '../../../screens/logged-in/update-shop-location';
import UpdateShopHours from '../../../screens/logged-in/update-shop-hours';
import Gifts from '../../../screens/logged-in/gifts';
import GiftsPackagingOptions from '../../../screens/logged-in/gifts-packaging-options';
import AddPackaging from '../../../screens/logged-in/add-packaging';
import EditPackagingOption from '../../../screens/logged-in/edit-packaging-option';
import AddGift from '../../../screens/logged-in/add-gift';
import EditGift from '../../../screens/logged-in/edit-gift';
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
            tabBarLabel: 'Pending',
          }}
          name="PendingOrders"
          component={PendingOrders}
        />
        <TopTab.Screen
          options={{
            tabBarLabel: 'Failed',
          }}
          name="AcceptedOrders"
          component={FailedOrders}
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

  function GiftsTab() {
    return (
      <TopTab.Navigator
        initialRouteName="GiftsList"
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
            tabBarLabel: 'Gifts List',
          }}
          name="GiftsList"
          component={Gifts}
        />
        <TopTab.Screen
          options={{
            tabBarLabel: 'Packaging Options',
          }}
          name="GiftsPackagingOptions"
          component={GiftsPackagingOptions}
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
    const {shopName, hasGift} = useSelector((state: RootState) => state.user);
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
          component={Home}
          options={({route, navigation}) => ({
            headerShown: true,
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitle: shopName,
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
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
          name="AddProduct"
          component={AddProduct}
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
            headerStyle: {backgroundColor: APP_COLORS.ORANGE},
            tabBarIcon: ({focused, color, size}) => {
              return <Icon5 name="pluscircle" color={color} size={size} />;
            },
          }}
        />

        {hasGift && (
          <Tab.Screen
            name="Gifts"
            component={GiftsTab}
            options={{
              headerShown: true,
              headerTitleAlign: 'center',
              title: 'Shop Gifts',
              headerTintColor: APP_COLORS.WHITE,
              headerStyle: {backgroundColor: APP_COLORS.ORANGE},
              tabBarIcon: ({focused, color, size}) => {
                return <Icon5 name="gift" color={color} size={size} />;
              },
            }}
          />
        )}

        <Tab.Screen
          name="Orders"
          component={OrdersTab}
          options={
            ordersCount > 0
              ? {
                  headerShown: true,
                  headerTitleAlign: 'center',
                  headerTintColor: APP_COLORS.WHITE,
                  headerStyle: {backgroundColor: APP_COLORS.ORANGE},
                  tabBarIcon: ({focused, color, size}) => {
                    return <Icon name="shopping" color={color} size={size} />;
                  },
                  tabBarBadge: ordersCount,
                }
              : {
                  headerShown: true,
                  headerTitleAlign: 'center',
                  headerTintColor: APP_COLORS.WHITE,
                  headerStyle: {backgroundColor: APP_COLORS.ORANGE},
                  tabBarIcon: ({focused, color, size}) => {
                    return <Icon name="shopping" color={color} size={size} />;
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
          name="MarketSubscriptions"
          component={MarketSubScriptions}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Subscribe to markets',
            headerRight: () => (
              <Pressable onPress={() => navigation.replace('HomeTabs')}>
                <View style={{paddingRight: 10}}>
                  <Icon name="home" color={APP_COLORS.WHITE} size={25} />
                </View>
              </Pressable>
            ),
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerShadowVisible: false,
            headerTintColor: APP_COLORS.WHITE,
          })}
        />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetails}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Order Details',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />
        <Stack.Screen
          name="PaymentDetails"
          component={PaymentDetails}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Payment Details for #' + route?.params?.order?.id,
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />
        <Stack.Screen
          name="AddSupplier"
          component={AddSupplier}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Add Supplier to #' + route?.params?.order?.id,
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />
        <Stack.Screen
          name="PaymentProof"
          component={PaymentProof}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Payment Proof for #' + route?.params?.order?.id,
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />

        <Stack.Screen
          name="ChatRoom"
          component={ChattRoom}
          options={({route, navigation}: INavigationProp) => ({
            title: '',
            headerTitle: () => (
              <ChattRoomHeader route={route as any} navigation={navigation} />
            ),
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />

        <Stack.Screen
          name="ImageBeforeSendPreview"
          component={ViewAndSendSelectedFile}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Send File',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />
        <Stack.Screen
          name="ImagePreview"
          component={ImagePreview}
          options={({route, navigation}: INavigationProp) => ({
            title: new Date(route?.params?.message?.createdAt).toUTCString(),
            headerStyle: {
              backgroundColor: APP_COLORS.BLACK,
            },
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
          name="UpdateShopLocation"
          component={UpdateShopLocation}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Update Shop Location',
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'left',
            headerTintColor: APP_COLORS.WHITE,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
        <Stack.Screen
          name="UpdateShopHours"
          component={UpdateShopHours}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Update Shop Working Hours',
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
          name="EditGift"
          component={EditGift}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Editing: ' + route?.params?.gift?.name,
            headerStyle: {
              backgroundColor: APP_COLORS.ORANGE,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default LoggedInRoutes;
