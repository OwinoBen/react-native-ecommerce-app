import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import imagePath from '../../constants/imagePath';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
// import {getTabBarVisibility} from '../../utils/helperFunctions';
import navigationStrings from '../navigationStrings';
import AccountStackVendor from './AccountStackVendor';
import HomeStackVendor from './HomeStackVendor';
import OrderStackVendor from './OrderStackVendor';
import ProductStackVendor from './ProductStackVendor';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import strings from '../../constants/lang';

const Tab = createBottomTabNavigator();
let showBottomBar_ = true;

const getTabBarVisibility = (route, navigation, screen) => {
  if (navigation && navigation.isFocused && navigation.isFocused()) {
    const route_name = getFocusedRouteNameFromRoute(route);
    if (screen.includes(route_name)) {
      showBottomBar_ = false;
      return false;
    }
    showBottomBar_ = true;
    return true;
  }
};

const TabRoutesVendorNewTemplate = ({barColor = colors.themeColor2}) => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
    screenOptions={{headerShown:false}}
      tabBar={(props) => {
        return Platform.OS === 'ios' ? (
          <View style={styles.navigatorContainer}>
            <BottomTabBar
              {...props}
              style={{
                height: moderateScaleVertical(70) + insets.bottom,
                paddingHorizontal: width > 500 ? 100 : 0,
              }}
              //   tabStyle={{backgroundColor: barColor,height: moderateScaleVertical(80) + insets.bottom,}}
              labelPosition="below-icon"
            />
            <View
              style={{
                height: insets.bottom,
                backgroundColor: barColor,
                position: 'absolute',
                bottom: -4,
                right: 0,
                left: 0,
              }}
            />
          </View>
        ) : (
          <BottomTabBar
            {...props}
            style={{height: moderateScaleVertical(75)}}
          />
        );
      }}
      tabBarOptions={{
        tabBarPosition: 'bottom',
        showIcon: true,
        style: {
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: moderateScale(30),
          height: insets.bottom + moderateScale(60),
          position: 'absolute',
          bottom: 0,
        },
        tabStyle: {
          backgroundColor: barColor,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: moderateScale(8),
        },
        labelStyle: {
          fontSize: 14,
          fontFamily: fontFamily.medium,
          paddingVertical: moderateScale(8),
        },
        activeTintColor: colors.white,
        inactiveTintColor: colors.white,

        // keyboardHidesTabBar: true,
      }}>
      <Tab.Screen
        name={navigationStrings.ROYO_VENDOR_HOME}
        component={HomeStackVendor}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? imagePath.homeActiveRoyo
                    : imagePath.homeInactiveRoyo
                }
              />
            );
          },
          tabBarLabel: ({focused}) => {
            return (
              <Text
                style={{
                  color: colors.white,
                  fontSize: 14,
                  fontFamily: focused ? fontFamily.bold : fontFamily.regular,
                  paddingVertical: moderateScale(8),
                }}>
                {strings.HOME}
              </Text>
            );
          },
        }}
      />

      <Tab.Screen
        name={navigationStrings.ROYO_VENDOR_ORDER}
        component={OrderStackVendor}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? imagePath.orderActiveRoyo
                    : imagePath.orderInActiveRoyo
                }
              />
            );
          },
          tabBarLabel: ({focused}) => {
            return (
              <Text
                style={{
                  color: colors.white,
                  fontSize: 14,
                  fontFamily: focused ? fontFamily.bold : fontFamily.regular,
                  paddingVertical: moderateScale(8),
                }}>
                {strings.ORDERS}
              </Text>
            );
          },
        }}
      />

      <Tab.Screen
        name={navigationStrings.ROYO_VENDOR_PRODUCTS}
        component={ProductStackVendor}
        options={({route, navigation}) => ({
          headerShown: false,
          tabBarVisible: getTabBarVisibility(route, navigation, [
            navigationStrings.ROYO_VENDOR_ADD_PRODUCT,
          ]),
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? imagePath.productActiveRoyo
                    : imagePath.productInactiveRoyo
                }
              />
            );
          },
          tabBarLabel: ({focused}) => {
            return (
              <Text
                style={{
                  color: colors.white,
                  fontSize: 14,
                  fontFamily: focused ? fontFamily.bold : fontFamily.regular,
                  paddingVertical: moderateScale(8),
                }}>
                {strings.PRODUCT}
              </Text>
            );
          },
        })}
      />

      <Tab.Screen
        name={navigationStrings.ROYO_VENDOR_ACCOUNT}
        component={AccountStackVendor}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? imagePath.accountActiveRoyo
                    : imagePath.accountInactiveRoyo
                }
              />
            );
          },
          tabBarLabel: ({focused}) => {
            return (
              <Text
                style={{
                  color: colors.white,
                  fontSize: 14,
                  fontFamily: focused ? fontFamily.bold : fontFamily.regular,
                  paddingVertical: moderateScale(8),
                }}>
                {strings.ACCOUNT}
              </Text>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabRoutesVendorNewTemplate;

const styles = StyleSheet.create({
  navigatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    // backgroundColor: 'transparent',
    backgroundColor: colors.themeColor2,
  },

  navigator: {
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    // backgroundColor: colors.zymDetailBgColor,
    elevation: moderateScale(30),
    height: moderateScale(60),
  },

  xFillLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // height: 34,
  },
});

// {
//   moment(item.created_at).fromNow().charAt(0) === 'a'
//     ? moment(item.created_at).fromNow().replace('a', '1')
//     : moment(item.created_at).fromNow();
// }
