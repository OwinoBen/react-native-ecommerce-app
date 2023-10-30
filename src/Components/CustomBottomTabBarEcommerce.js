import React, { Fragment } from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, width } from '../styles/responsiveSize';


const CustomBottomTabBarEcommerce = ({
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
    <Shadow
      style={{
        height: Platform.OS === 'ios' ? moderateScaleVertical(55) + insets.bottom : moderateScaleVertical(86) + insets.bottom,
        flexDirection: 'row',
        width: width,
        backgroundColor: colors.white,
        borderTopLeftRadius: moderateScale(40),
        borderTopRightRadius: moderateScale(40),
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: moderateScale(25),

      }}>
      {state.routes.map((route, index) => {
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
              style={{
                alignItems: "center",
                justifyContent: "center",

              }}
            >
              {options.tabBarIcon({ focused: isFocused })}
              <Text
                style={{
                  ...props.labelStyle,
                  color: isFocused
                    ? themeColors.primary_color
                    : colors.inactiveText,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          </Fragment>
        );
      })}
    </Shadow>
  );
};
export default React.memo(CustomBottomTabBarEcommerce);
