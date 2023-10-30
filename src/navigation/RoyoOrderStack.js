import React from 'react';
import {RoyoAddProduct, RoyoOrderDetail, RoyoPaymentSetting, RoyoTransactions} from '../Screens';
import navigationStrings from './navigationStrings';
import RoyoVendroAppTabRoute from './RoyoVendroAppTabRoute';

const RoyoOrderStack = (Stack) => {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.ROYO_VENDOR_BOTTOMTAB}
        component={RoyoVendroAppTabRoute}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ROYO_VENDOR_TRANSACTIONS}
        component={RoyoTransactions}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ROYO_VENDOR_PAYMENT_SETTINGS}
        component={RoyoPaymentSetting}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ROYO_VENDOR_ORDER_DETAIL}
        component={RoyoOrderDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ROYO_VENDOR_ADD_PRODUCT}
        component={RoyoAddProduct}
        options={{headerShown: false}}
      />
    </>
  );
};

export default RoyoOrderStack;
