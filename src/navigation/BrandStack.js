import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  BrandProducts,
  BrandProducts2,
  Brands,
  Brands2,
  BuyProduct,
  Delivery,
  Filter,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductList3,
  ProductListEcom,
  SearchProductVendorItem,
  SearchProductVendorItem3V2,
  SendProduct,
  Vendors,
  Vendors2,
  ViewAllSearchItems,
} from '../Screens';

import navigationStrings from './navigationStrings';

const Stack = createNativeStackNavigator();
export default function () {
  const { appData, appStyle } = useSelector((state) => state?.initBoot);
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
      case 3:
        return ProductList3
      case 5:
        return ProductList3
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
        component={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? Brands2
            : Brands
        }
        name={navigationStrings.BRANDS}
      />
      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? BrandProducts2
            : BrandProducts
        }
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
        }
      />
      <Stack.Screen name={navigationStrings.FILTER} component={Filter} />

      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={checkSearchProductVendorItemLayout()}
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
        name={navigationStrings.VIEW_ALL_SEARCH_ITEM}
        component={ViewAllSearchItems}
      />

      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={productListView()}
      />
    </Stack.Navigator>
  );
}
