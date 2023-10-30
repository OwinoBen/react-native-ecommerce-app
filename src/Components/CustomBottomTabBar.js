import React, { Fragment } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { MyDarkTheme } from '../styles/theme';
import { moderateScale } from '../styles/responsiveSize';


const CustomBottomTabBar = ({
  state,
  descriptors,
  navigation,
  bottomTabNotify,
  ...props
}) => {

  const insets = useSafeAreaInsets();
  const { themeColors, themeToggle, themeColor, appStyle } = useSelector((state) => state.initBoot || {});

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;


  const themePrimaryColor = !!themeColors?.primary_color ? themeColors?.primary_color : '	#00FFFF'

  return (
    // <LinearGradient
    //   start={{ x: 0, y: 1 }}
    //   end={{ x: 1, y: 1 }}
    //   style={{
    //     height: Platform.OS === 'ios' ? 45 + insets.bottom : 55 + insets.bottom,
    //     flexDirection: 'row',
    //     paddingBottom: insets.bottom,
    //     // borderTopLeftRadius: 10,
    //     // borderTopRightRadius: 10,
    //     paddingTop: 10,
    //     // style={{marginBottom:Platform.OS === 'ios'?30:10}}
    //   }}
    //   colors={
    //     isDarkMode
    //       ? [MyDarkTheme.colors.lightDark||colors.textGreyLight, MyDarkTheme.colors.lightDark||colors.textGreyLight]
    //       : [themePrimaryColor||colors.themeColor, themePrimaryColor||colors.themeColor]
    //   }

    // >
    <View style={{
      height: Platform.OS === 'ios' ? 55 + insets.bottom : 55 + insets.bottom,
      flexDirection: 'row',
      paddingBottom: insets.bottom,
      // borderTopLeftRadius: 10,
      // borderTopRightRadius: 10,
      paddingTop: 10,
      backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : themePrimaryColor
    }}>


      {
        state.routes.map((route, index) => {
          // console.log(route, 'routesssssss');
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Fragment key={route.name}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityStates={isFocused ? ['selected'] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                // onLongPress={onLongPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 49,

                  // marginBottom:20
                }}>
                {options.tabBarIcon({ focused: isFocused })}
                <Text
                  style={{
                    ...props.labelStyle,
                    color: isFocused
                      ? themeColors.secondary_color
                      : colors.whiteOpacity85,
                    opacity: isFocused ? 1 : 0.6,
                    marginBottom: moderateScale(6)
                  }}>
                  {label}
                </Text>
              </TouchableOpacity>
            </Fragment>
          );
        })
      }
    </View>
    // </LinearGradient >
  );
};
export default React.memo(CustomBottomTabBar);
