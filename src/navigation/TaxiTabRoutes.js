import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {getBundleId} from 'react-native-device-info';
import {useSelector} from 'react-redux';
import CustomBottomTabBar from '../Components/CustomBottomTabBar';
import CustomBottomTabBarFive from '../Components/CustomBottomTabBarFive';
import CustomBottomTabBarFour from '../Components/CustomBottomTabBarFour';
import CustomBottomTabBarThree from '../Components/CustomBottomTabBarThree';
import CustomBottomTabBarTwo from '../Components/CustomBottomTabBarTwo';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import {MyOrders} from '../Screens';
import colors from '../styles/colors';
import {moderateScale, textScale} from '../styles/responsiveSize';
import {appIds} from '../utils/constants/DynamicAppKeys';
import AccountStack from './AccountStack';
import HomeStack from './HomeStack';
import navigationStrings from './navigationStrings';

const Tab = createBottomTabNavigator();

export default function TaxiTabRoutes(props) {
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;

  const getImgStyle = (focused) => {
    if (appStyle?.tabBarLayout == 4) {
      return {
        tintColor: focused ? themeColors?.primary_color : colors.black,
        height: 20,
        width: 20,
      };
    } else if (
      appStyle?.tabBarLayout == 1 ||
      appStyle?.tabBarLayout == 2 ||
      appStyle?.tabBarLayout == 3
    ) {
      return {
        tintColor: focused ? colors.white : colors.whiteOpacity85,
        height: 25,
        width: 25,
      };
    } else {
    }
  };

  return (
    <Tab.Navigator
      backBehavior={'initialRoute'}
      screenOptions={{
        headerShown:false,
        tabBarLabelStyle:{
          textTransform: 'capitalize',
          fontFamily: fontFamily?.medium,
          fontSize: textScale(12),
          color: colors.white,
        }
      }}
      tabBar={(props) => {
        switch (appStyle?.tabBarLayout) {
          case 1:
            return <CustomBottomTabBar {...props} />;
          case 2:
            return <CustomBottomTabBarTwo {...props} />;
          case 3:
            return <CustomBottomTabBarThree {...props} />;
          case 4:
            return <CustomBottomTabBarFour {...props} />;
          case 5:
            return <CustomBottomTabBarFive {...props} />;
        }
      }}>
      <Tab.Screen
        component={HomeStack}
        name={navigationStrings.HOMESTACK}
        options={{
          tabBarLabel: strings.HOME,
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              style={getImgStyle(focused)}
              source={
                appStyle?.tabBarLayout === 5
                  ? focused
                    ? imagePath.homeActive
                    : imagePath.homeInActive
                  : appStyle?.tabBarLayout === 4
                  ? focused
                    ? imagePath.homeRedActive
                    : imagePath.homeRedInActive
                  : focused
                  ? imagePath.tabAActive
                  : imagePath.tabAInActive
              }
            />
          ),
          // unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        component={MyOrders}
        name={navigationStrings.MY_ORDERS}
        options={{
          tabBarLabel:
            appStyle?.tabBarLayout === 6
              ? strings.SERVICES
              : appIds.mml == getBundleId()
              ? strings.MYDELIERIES
              : appIds.jiffex == getBundleId()
              ? strings.MY_ORDERS
              : strings.MYRIDES,
          tabBarIcon: ({focused, tintColor}) => {
            return (
              <Image
                style={getImgStyle(focused)}
                resizeMode="contain"
                source={
                  appStyle?.tabBarLayout === 6
                    ? focused
                      ? imagePath.settings_red_icon
                      : imagePath.settings_icon
                    : appStyle?.tabBarLayout === 5
                    ? focused
                      ? appIds.mml == getBundleId()
                        ? imagePath?.activeTruck
                        : imagePath.icMyRideActive
                      : appIds.mml == getBundleId()
                      ? imagePath?.inactiveTruck
                      : imagePath.icMyRideInActive
                    : focused
                    ? appIds.mml == getBundleId()
                      ? imagePath?.activeTruck
                      : imagePath.rideFilled
                    : appIds.mml == getBundleId()
                    ? imagePath?.inactiveTruck
                    : imagePath.ride
                }
              />
            );
          },
          // unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        component={AccountStack}
        name={navigationStrings.ACCOUNTS}
        options={{
          tabBarLabel: strings.ACCOUNTS,
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              style={getImgStyle(focused)}
              source={
                appStyle?.tabBarLayout === 5
                  ? focused
                    ? imagePath.profileActive
                    : imagePath.profileInActive
                  : appStyle?.tabBarLayout === 4
                  ? focused
                    ? imagePath.accountRedActive
                    : imagePath.accountRedInActive
                  : focused
                  ? imagePath.tabEActive
                  : imagePath.tabEInActive
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function stylesData(params) {
  const {appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;

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
      fontFamily: fontFamily?.bold,
      color: colors.white,
      fontSize: textScale(8),
    },
  });
  return styles;
}
