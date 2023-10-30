import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  RoyoAccounts,
  RoyoPaymentSetting,
  RoyoTransactions,
  VendorList,
} from '../../Screens';
import navigationStrings from '../navigationStrings';

const Stack = createNativeStackNavigator();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.ROYO_VENDOR_ACCOUNT}
        component={RoyoAccounts}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VENDORLIST}
        component={VendorList}
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
    </Stack.Navigator>
  );
}
