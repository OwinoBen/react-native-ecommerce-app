import React from 'react';
import {
  HomeScreenCourier,
  PickupLocation,
  SetLocationInMap,
  ChooseCarTypeAndTime,
  CabDriverLocationTrackAndDetail,
  MultipleDropOffSelection,
  PickupOrderDetail,
  Offers,
  MyOrders,
  VerifyAccount,
} from '../Screens';
import VerifyAccountSecond from '../Screens/VerifyAccountSecond/VerifyAccount';
import navigationStrings from './navigationStrings';

export default function (Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.HOMESCREENCOURIER}
        component={HomeScreenCourier}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PICKUPLOCATION}
        component={PickupLocation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SETLOACTIONMAP}
        component={SetLocationInMap}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CHOOSECARTYPEANDTIME}
        component={ChooseCarTypeAndTime}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CABDRIVERLOCATIONANDDETAIL}
        component={CabDriverLocationTrackAndDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.MULTISELECTCATEGORY}
        component={MultipleDropOffSelection}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PICKUPORDERDETAIL}
        component={PickupOrderDetail}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT_SECOND}
        component={VerifyAccountSecond}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.MY_ORDERS}
        component={MyOrders}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.OFFERS}
        component={Offers}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT_COURIER}
        component={VerifyAccount}
        options={{headerShown: false}}
      />
    </>
  );
}
