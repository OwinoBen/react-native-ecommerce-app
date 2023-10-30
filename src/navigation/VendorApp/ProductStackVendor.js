import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  OrderDetail,
  ProductDetail,
  ProductDetail2,
  RoyoAddProduct,
  RoyoProducts,
  VendorList,
} from '../../Screens';
import navigationStrings from '../navigationStrings';

const Stack = createNativeStackNavigator();
export default function () {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.VENDOR_PRODUCT}
        component={RoyoProducts}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
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
      <Stack.Screen
        name={navigationStrings.ROYO_VENDOR_ADD_PRODUCT}
        component={RoyoAddProduct}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
