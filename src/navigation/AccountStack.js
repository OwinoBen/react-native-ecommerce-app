import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  AboutUs,
  Account,
  Account2,
  Account3,
  Account4,
  AddMoney,
  AddProduct,
  AllinonePyments,
  BrandProducts,
  BuyProduct,
  ChatRoom,
  ChatRoomForVendor,
  CMSLinks,
  ContactUs,

  Delivery,
  Location,
  Loyalty2,
  //Pyament Screens
  Mobbex,
  MyOrders,
  MyP2pPosts,
  MyProfile,
  MyProfile2,
  MyProfile3,
  Notifications,
  OrderDetail,
  P2pProductDetail,
  Payfast,
  Paylink,
  PickupOrderDetail,
  PrinterConnection,
  PrinterConnectionSunmi,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductListEcom,
  RateOrder,
  ReferAndEarn,
  ReplaceOrder,
  ReturnOrder,
  SavedCards,
  SearchProductVendorItem,
  SearchProductVendorItem3V2,
  SendProduct,
  SendRefferal,
  Settings,
  Subscriptions2,
  TipPaymentOptions,
  TrackDetail,
  Tracking,
  Vendors,
  Vendors2,
  ViewAllSearchItems,
  Wallet,
  WebLinks,
  WebPayment,
  WebviewScreen,
  Wishlist,
  Wishlist2,
  Yoco,
  EcomAccount,
  EcomLangCurrency,
  DeveloperMode,
  P2pOndemandProductDetail
} from '../Screens';

import navigationStrings from './navigationStrings';

const Stack = createNativeStackNavigator();
export default function ({ navigation }) {
  const { appData, appStyle } = useSelector((state) => state?.initBoot);

  const checkAccountsLayout = (inx) => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return Account;
      case 2:
        return Account2;
      case 4:
        return Account4;
      case 10:
        return EcomAccount;
      default:
        return Account3;
    }
  };
  const checkProfileLayout = (layout) => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return MyProfile;
      case 2:
        return MyProfile2;
      default:
        return MyProfile3;
    }
  };

  const checkSearchProductVendorItemLayout = (layout) => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return SearchProductVendorItem;
      case 8:
        return SearchProductVendorItem3V2;
      default:
        return SearchProductVendorItem3V2;
    }
  };

  const productListView = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return ProductList2
      case 10:
        return ProductListEcom
      default:
        return ProductList
    }
  }



  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        component={checkAccountsLayout()}
        name={navigationStrings.ACCOUNTS}
      />
      <Stack.Screen
        name={navigationStrings.MY_PROFILE}
        component={checkProfileLayout()}
      />
      <Stack.Screen name={navigationStrings.MY_ORDERS} component={MyOrders} />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
      />

      <Stack.Screen
        name={navigationStrings.NOTIFICATION}
        component={Notifications}
      />
      <Stack.Screen name={navigationStrings.ABOUT_US} component={AboutUs} />
      <Stack.Screen name={navigationStrings.CONTACT_US} component={ContactUs} />
      <Stack.Screen name={navigationStrings.SETTIGS} component={Settings} />
      <Stack.Screen
        name={navigationStrings.ATTACH_PRINTER}
        component={PrinterConnection}
      />
      <Stack.Screen
        name={navigationStrings.ATTACH_PRINTER + 'sunmi'}
        component={PrinterConnectionSunmi}
      />
      <Stack.Screen name={navigationStrings.WALLET} component={Wallet} />
      <Stack.Screen name={navigationStrings.ADD_MONEY} component={AddMoney} />
      <Stack.Screen
        name={navigationStrings.WISHLIST}
        component={
          appStyle?.homePageLayout === 3 ||
            appStyle?.homePageLayout === 5 ||
            appStyle?.homePageLayout === 8
            ? Wishlist2
            : Wishlist
        }
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
        }
        options={{ headerShown: false }}
      />
      <Stack.Screen name={navigationStrings.TRACKING} component={Tracking} />
      <Stack.Screen
        name={navigationStrings.TRACKDETAIL}
        component={TrackDetail}
      />
      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={checkSearchProductVendorItemLayout()}
      />
      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={BrandProducts}
      />
      <Stack.Screen
        name={navigationStrings.SEND_PRODUCT}
        component={SendProduct}
      />
      <Stack.Screen
        name={navigationStrings.BUY_PRODUCT}
        component={BuyProduct}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR}
        component={appStyle?.homePageLayout === 2 ? Vendors2 : Vendors}
      />
      <Stack.Screen name={navigationStrings.DELIVERY} component={Delivery} />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={productListView()}
      />
      <Stack.Screen name={navigationStrings.RATEORDER} component={RateOrder} />
      <Stack.Screen
        name={navigationStrings.SENDREFFERAL}
        component={SendRefferal}
      />
      <Stack.Screen name={navigationStrings.CMSLINKS} component={CMSLinks} />
      <Stack.Screen name={navigationStrings.WEBLINKS} component={WebLinks} />
      <Stack.Screen name={navigationStrings.LOCATION} component={Location} />

      <Stack.Screen
        name={navigationStrings.WEBPAYMENTS}
        component={WebPayment}
      />
      <Stack.Screen name={navigationStrings.TRACKORDER} component={MyOrders} />
      <Stack.Screen
        name={navigationStrings.PICKUPORDERDETAIL}
        component={PickupOrderDetail}
        options={{ tabBarVisible: false }}
      />
      <Stack.Screen
        name={navigationStrings.WEBVIEWSCREEN}
        component={WebviewScreen}
      />
      <Stack.Screen
        name={navigationStrings.SUBSCRIPTION}
        component={Subscriptions2}
      />
      <Stack.Screen name={navigationStrings.LOYALTY} component={Loyalty2} />
      <Stack.Screen
        name={navigationStrings.RETURNORDER}
        component={ReturnOrder}
      />
      <Stack.Screen
        name={navigationStrings.TIP_PAYMENT_OPTIONS}
        component={TipPaymentOptions}
      />
      <Stack.Screen name={navigationStrings.MOBBEX} component={Mobbex} />
      <Stack.Screen name={navigationStrings.PAYFAST} component={Payfast} />
      <Stack.Screen name={navigationStrings.YOCO} component={Yoco} />
      <Stack.Screen name={navigationStrings.PAYLINK} component={Paylink} />
      <Stack.Screen
        name={navigationStrings.ALL_IN_ONE_PAYMENTS}
        component={AllinonePyments}
      />

      <Stack.Screen
        name={navigationStrings.ADD_PRODUCT}
        component={AddProduct}
      />

      <Stack.Screen name={navigationStrings.CHAT_ROOM} component={ChatRoom} />
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM_FOR_VENDOR}
        component={ChatRoomForVendor}
      />
      <Stack.Screen
        name={navigationStrings.REPLACE_ORDER}
        component={ReplaceOrder}
      />
      <Stack.Screen
        name={navigationStrings.P2P_PRODUCT_DETAIL}
        component={!!appData?.profile?.preferences?.is_rental_weekly_monthly_price ? P2pOndemandProductDetail : P2pProductDetail}
      />
      <Stack.Screen name={navigationStrings.MY_POSTS} component={MyP2pPosts} />
      <Stack.Screen
        name={navigationStrings.REFER_AND_EARN}
        component={ReferAndEarn}
      />
      <Stack.Screen name={navigationStrings.SAVEDCARDS} component={SavedCards} />
      <Stack.Screen
        name={navigationStrings.VIEW_ALL_SEARCH_ITEM}
        component={ViewAllSearchItems}
      />
      <Stack.Screen
        name={navigationStrings.ECOM_LANG_CURRENCY}
        component={EcomLangCurrency}
      />
      <Stack.Screen
        name={navigationStrings.DEVELOPER_MODE}
        component={DeveloperMode}
      />
    </Stack.Navigator>
  );
}
