import React, { Fragment, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import Elevations from 'react-native-elevation';
import { BlurView } from '@react-native-community/blur';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../styles/theme';
const CustomBottomTabBarFive = ({
  state,
  descriptors,
  navigation,
  bottomTabNotify,

  ...props
}) => {
  const insets = useSafeAreaInsets();
  const { themeColors } = useSelector((state) => state.initBoot);

  const { appStyle } = useSelector((state) => state?.initBoot || {});

  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesData({ fontFamily });
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  return (
    <View
      style={{
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.backgroundGrey,
      }}>
      <View style={[styles.tabBarStyle]}>
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
                // onLongPress={onLongPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  // height: 49,

                  // marginBottom:20
                }}>
                {options.tabBarIcon({
                  focused: isFocused,
                  tintColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : isFocused
                      ? themeColors.primary_color
                      : colors.black,
                })}
                <Text
                  style={{
                    ...props.labelStyle,
                    ...styles.labelStyle,
                    color: isDarkMode
                      ? isFocused
                        ? MyDarkTheme.colors.text
                        : MyDarkTheme.colors.text
                      : isFocused
                        ? themeColors?.primary_color
                        : colors.textGrey,
                    opacity: isFocused ? 1 : 0.6,
                  }}>
                  {label}
                </Text>
              </TouchableOpacity>
            </Fragment>
          );
        })}
      </View>
    </View>
  );
};

export function stylesData({ fontFamily }) {
  const currentTheme = useSelector((state) => state.initBoot);
  const { themeColors } = currentTheme;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const styles = StyleSheet.create({
    tabBarStyle: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.white,
      borderTopLeftRadius: moderateScale(35.5),
      borderTopRightRadius: moderateScale(35.5),
      paddingVertical: moderateScaleVertical(20),

      ...Elevations[15],
    },
    labelStyle: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(11),
    },
  });
  return styles;
}
export default React.memo(CustomBottomTabBarFive);
// Blur Tab bar

// import React, {Fragment, useRef} from 'react';
// import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {useSelector} from 'react-redux';
// import colors from '../styles/colors';
// import {
//   moderateScale,
//   moderateScaleVertical,
//   textScale,
//   width,
// } from '../styles/responsiveSize';
// import Elevations from 'react-native-elevation';
// import {BlurView} from '@react-native-community/blur';

// export default function CustomBottomTabBarTwo({
//   state,
//   descriptors,
//   navigation,
//   bottomTabNotify,

//   ...props
// }) {
//   const viewRef = useRef();
//   const insets = useSafeAreaInsets();

//   const {appStyle} = useSelector((state) => state?.initBoot);

//   const fontFamily = appStyle?.fontSizeData;

//   const styles = stylesData({fontFamily});

//   return (
//     <View ref={viewRef} style={[styles.blurContainer, {alignSelf: 'center'}]}>
//       <BlurView
//         style={styles.absolute}
//         viewRef={viewRef}
//         blurType="light"
//         blurAmount={50}
//       />
//       {state.routes.map((route, index) => {
//         const {options} = descriptors[route.key];
//         const isFocused = state.index === index;
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//             ? options.title
//             : route.name;
//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           }
//         };

//         return (
//           <Fragment key={route.name}>
//             <TouchableOpacity
//               accessibilityRole="button"
//               accessibilityStates={isFocused ? ['selected'] : []}
//               accessibilityLabel={options.tabBarAccessibilityLabel}
//               testID={options.tabBarTestID}
//               onPress={onPress}
//               // onLongPress={onLongPress}
//               style={{
//                 flex: 1,
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 // height: 49,

//                 // marginBottom:20
//               }}>
//               {options.tabBarIcon({focused: isFocused})}
//               <Text
//                 style={{
//                   ...props.labelStyle,
//                   ...styles.labelStyle,
//                   color: isFocused ? colors.black : colors.textGrey,
//                   opacity: isFocused ? 1 : 0.6,
//                 }}>
//                 {label}
//               </Text>
//             </TouchableOpacity>
//           </Fragment>
//         );
//       })}
//     </View>
//   );
// }

// export function stylesData({fontFamily}) {
//   const currentTheme = useSelector((state) => state.initBoot);
//   const {themeColors} = currentTheme;

//   const styles = StyleSheet.create({
//     tabBarStyle: {
//       // height: Platform.OS === 'ios' ? 60 + insets.bottom : 70 + insets.bottom,
//       flexDirection: 'row',
//       borderTopLeftRadius: moderateScale(35.5),
//       borderTopRightRadius: moderateScale(35.5),
//       paddingVertical: moderateScaleVertical(16),
//       overflow: 'hidden',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     labelStyle: {
//       fontFamily: fontFamily.medium,
//       fontSize: textScale(11),
//     },
//     blurContainer: {
//       position: 'absolute',
//       bottom: 0,
//       alignItems: 'center',
//       justifyContent: 'center',
//       // backgroundColor: 'rgba(255,255,255,.35)',
//       borderTopLeftRadius: moderateScaleVertical(35),
//       borderTopRightRadius: moderateScaleVertical(35),
//       height: moderateScaleVertical(75),
//       width: width,
//       overflow: 'hidden',
//       flexDirection: 'row',
//     },
//     txt: {
//       color: colors.white,
//       fontFamily: fontFamily.bold,
//       opacity: 0.9,
//     },
//     absolute: {
//       position: 'absolute',
//       alignItems: 'center',
//       justifyContent: 'center',
//       height: moderateScaleVertical(75),
//       top: 0,
//       left: 0,
//       bottom: 0,
//       right: 0,
//       borderRadius: moderateScaleVertical(15),
//     },
//   });
//   return styles;
// }
