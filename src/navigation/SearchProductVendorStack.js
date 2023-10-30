import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  ProductList3,
  SearchProductVendorItem,
  SearchProductVendorItem3V2,
  ViewAllSearchItems,
} from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createNativeStackNavigator();
export default function () {
  const { appStyle } = useSelector((state) => state?.initBoot);

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
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={navigationStrings.SEARCH}
        component={checkSearchProductVendorItemLayout()}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={ProductList3}
      />
      <Stack.Screen
        name={navigationStrings.VIEW_ALL_SEARCH_ITEM}
        component={ViewAllSearchItems}
      />
    </Stack.Navigator>
  );
}
