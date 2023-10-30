import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  ProductDetail,
  ProductDetail2,
  RoyoOrder,
  RoyoOrderDetail,
  VendorList,
} from '../../Screens';
import navigationStrings from '../navigationStrings';

const Stack = createNativeStackNavigator();
export default function () {
  const {appStyle} = useSelector((state) => state?.initBoot);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.VENDOR_ORDER}
        component={RoyoOrder}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={RoyoOrderDetail}
        // component={OrderDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VENDORLIST}
        component={VendorList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
        }
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
