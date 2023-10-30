import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import CustomBottomTabBar from '../Components/CustomBottomTabBar';
import CustomBottomTabBarTwo from '../Components/CustomBottomTabBarTwo';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {moderateScale, textScale} from '../styles/responsiveSize';
import navigationStrings from './navigationStrings';
import VendorOrderStack from './VendorOrderStack';
import VendorProductStack from './VendorProductStack';
import VendorRevenueStack from './VendorRevenueStack';
const Tab = createBottomTabNavigator();

export default function TabRoutesVendor(props) {
  return (
    <Tab.Navigator
      backBehavior={'initialRoute'}
      screenOptions={{
        headerShown:false,
        tabBarLabelStyle:{
          textTransform: 'capitalize',
          fontFamily: fontFamily.medium,
          fontSize: textScale(12),
          color: colors.white,
        }
      }}
      tabBar={(props) => {
        // return <CustomBottomTabBarTwo {...props} />;
        return <CustomBottomTabBar {...props} />;
      }}
>
      <Tab.Screen
        component={VendorOrderStack}
        name={navigationStrings.VENDOR_ORDER}
        options={{
          tabBarLabel: strings.ORDERS,
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? imagePath.icoSelectOrderActive
                  : imagePath.icoSelectOrderInactive
              }
            />
          ),
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        component={VendorProductStack}
        name={navigationStrings.PRODUCTS}
        options={{
          tabBarLabel: strings.PRODUCTS,
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? imagePath.icoSelectProductActive
                  : imagePath.icoSelectProductInActive
              }
            />
          ),
          unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        component={VendorRevenueStack}
        name={navigationStrings.REVENUE}
        options={{
          tabBarLabel: strings.REVENUE,
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? imagePath.icoRevenueSelected
                  : imagePath.icoRevenueNonSelected
              }
            />
          ),
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  cartItemCountView: {
    position: 'absolute',
    zIndex: 100,
    top: -5,
    right: -5,
    backgroundColor: colors.cartItemPrice,
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemCountNumber: {
    fontFamily: fontFamily.futuraBtHeavy,
    color: colors.white,
    fontSize: textScale(8),
  },
});
