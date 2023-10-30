import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  OrderDetail,
  ProductDetail,
  ProductDetail2,
  VendorList,
  VendorOrders,
} from '../Screens';
import {shortCodes} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

const Stack = createNativeStackNavigator();
export default function () {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={navigationStrings.VENDOR_ORDER}
        component={VendorOrders}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
      />
      <Stack.Screen
        name={navigationStrings.VENDORLIST}
        component={VendorList}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
        }
      />
    </Stack.Navigator>
  );
}
