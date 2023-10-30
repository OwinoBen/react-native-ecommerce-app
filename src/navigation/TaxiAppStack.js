import React from 'react';
import { useSelector } from 'react-redux';
import {
  Addaddress,
  AddNewRider,
  AuthorizeNet,
  ChooseCarTypeAndTimeTaxi,
  ChooseVechile,
  HomeScreenTaxi, Location, Offers,
  OrderDetail,
  Payfast,
  PaymentOptions,
  PayPhone,
  Paystack,
  Pesapal,
  PickupTaxiOrderDetail,
  PinAddressOnMap,
  RateOrder,
  SkipCash,
  VerifyAccount
} from '../Screens';
import OrderSuccess from '../Screens/OrderSuccess/OrderSuccess';
import DirectPayOnline from '../Screens/PaymentGateways/DirectPayOnline';
import Khalti from '../Screens/PaymentGateways/Khalti';
import BidingDriversList from '../Screens/TaxiApp/BidingDriversList/BidingDriversList';
import navigationStrings from './navigationStrings';

export default function (Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.HOMESCREENTAXI}
        component={HomeScreenTaxi}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.ADDADDRESS}
        component={Addaddress}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.ADD_NEW_RIDER}
        component={AddNewRider}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.PINADDRESSONMAP}
        component={PinAddressOnMap}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.PAYMENT_OPTIONS}
        component={PaymentOptions}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.CHOOSECARTYPEANDTIMETAXI}
        // component={ChooseCarTypeAndTimeTaxi}
        component={ChooseVechile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.OFFERS2}
        component={Offers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.LOCATION}
        component={Location}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PICKUPTAXIORDERDETAILS}
        component={PickupTaxiOrderDetail}
        options={{ headerShown: false, unmountOnBlur: false }}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.ORDERSUCESS}
        component={OrderSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PAYFAST}
        component={Payfast}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PAYPHONE}
        component={PayPhone}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.AuthorizeNet}
        component={AuthorizeNet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PAYSTACK}
        component={Paystack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.DIRECTPAYONLINE}
        component={DirectPayOnline}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.KHALTI}
        component={Khalti}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.SKIP_CASH}
        component={SkipCash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.RATEORDER}
        component={RateOrder}
        options={{
          headerShown: false,
          unmountOnBlur: false,
        }}
      />
      <Stack.Screen
        name={navigationStrings.PESAPAL}
        component={Pesapal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT_TAXI}
        component={VerifyAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.BIDINGDRIVERSLIST}
        component={BidingDriversList}
        options={{ headerShown: false }}
      />
    </>
  );
}
