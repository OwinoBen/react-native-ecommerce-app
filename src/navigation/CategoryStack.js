import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import * as Screens from '../Screens'

import navigationStrings from './navigationStrings';

const Stack = createNativeStackNavigator();
export default function () {
    const { appData, appStyle } = useSelector((state) => state?.initBoot);


    const renderVendorDetailsScreens = () => {
        switch (appStyle?.homePageLayout) {
            case 1:
                return Screens.VendorDetail;
            case 2:
                return Screens.VendorDetail2;
            default:
                return Screens.VendorDetail3;
        }
    };


    const renderProductListScreen = () => {
        switch (appStyle?.homePageLayout) {
            case 1: return Screens.ProductList;
            case 2: return Screens.ProductList2;
            case 10: return Screens.ProductListEcom;
            default: return Screens.ProductList3;
        }
    };



    const renderProductDetailsScreens = () => {
        switch (appStyle?.homePageLayout) {
            case 2:
                return Screens.ProductDetail2;
            default:
                return Screens.ProductDetail;
        }
    };



    const checkSearchProductVendorItemLayout = (layout) => {
        switch (appStyle?.homePageLayout) {
            case 1:
                return Screens.SearchProductVendorItem;
            case 8:
                return Screens.SearchProductVendorItem3V2;
            case 10:
                return Screens.SearchProductVendorItem3V2;
            default:
                return Screens.SearchProductVendorItem3V2;
        }
    };


    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                component={appStyle?.homePageLayout == 10 ? Screens.EcomCategory:  Screens.Category}
                name={navigationStrings.CATEGORY}
            />

            <Stack.Screen
                name={navigationStrings.VENDOR_DETAIL}
                component={renderVendorDetailsScreens()}
            />

            <Stack.Screen
                name={navigationStrings.PRODUCT_LIST}
                component={renderProductListScreen()}
            />

            <Stack.Screen
                name={navigationStrings.PRODUCTDETAIL}
                component={renderProductDetailsScreens()}
            />
            <Stack.Screen
                name={navigationStrings.SEARCHPRODUCTOVENDOR}
                component={checkSearchProductVendorItemLayout()}

            />

            <Stack.Screen
                name={navigationStrings.VIEW_ALL_SEARCH_ITEM}
                component={Screens.ViewAllSearchItems}
            />

        </Stack.Navigator>
    );
}
