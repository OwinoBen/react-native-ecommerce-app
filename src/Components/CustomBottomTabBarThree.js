import React, {Fragment, useState} from 'react';
import {
  Animated,
  FlatList,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import staticStrings from '../constants/staticStrings';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
} from '../utils/helperFunctions';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';

const CustomBottomTabBarThree = ({
  state,
  descriptors,
  navigation,
  bottomTabNotify,

  ...props
}) => {
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);
  const userData = useSelector((state) => state?.auth?.userData);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});

  const [tabThreeStyle, settabThreeStyle] = useState({
    minHeight: height * 0.095,
    minWidth: width * 0.9,
    deviceHeight: height - moderateScaleVertical(90),
    deviceWidth: width,
    bottom: 30,
  });
  const {appMainData} = useSelector((state) => state?.home);

  const {minHeight, minWidth, deviceHeight} = tabThreeStyle;
  const updateState = (data) =>
    settabThreeStyle((tabThreeStyle) => ({...tabThreeStyle, ...data}));

  const _panResponder = PanResponder.create({
    onMoveShouldSetResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderMove: (e, gestureState) => {
      updateState({
        minHeight: deviceHeight - gestureState.moveY,
        minWidth: width * 0.9 + (minHeight / height) * 100,
      });
    },
  });
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const onPressCategory = (item) => {
    updateState({
      minHeight: height * 0.095,
      minWidth: width * 0.9,
    });
    if (item.redirect_to == staticStrings.VENDOR) {
      moveToNewScreen(navigationStrings.VENDOR, item)();
    } else if (
      item.redirect_to == staticStrings.PRODUCT ||
      item.redirect_to == staticStrings.CATEGORY
    ) {
      navigation.push(navigationStrings.PRODUCT_LIST, {data: item});
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
    } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (item?.warning_page_id == 2) {
          moveToNewScreen(navigationStrings.DELIVERY, item)();
        } else {
          moveToNewScreen(navigationStrings.HOMESCREENCOURIER, item)();
        }
      } else {
        actions.setAppSessionData('on_login');
      }
    } else if (item.redirect_to == staticStrings.DISPATCHER) {
      // moveToNewScreen(navigationStrings.DELIVERY, item)();
    } else if (item.redirect_to == staticStrings.CELEBRITY) {
      moveToNewScreen(navigationStrings.CELEBRITY)();
    } else if (item.redirect_to == staticStrings.BRAND) {
      moveToNewScreen(navigationStrings.BRANDS)();
    } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  const _renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => onPressCategory(item)}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{marginHorizontal: moderateScale(10)}}>
          <FastImage
            style={styles.itemImage}
            source={{
              uri: getImageUrl(
                item.image.proxy_url,
                item.image.image_path,
                '600/360',
              ),
              priority: FastImage.priority.high,
            }}
          />
        </View>
        <Text
          style={{
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            opacity: 0.6,
          }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={[
        // styles.resizableTabBar,
        minHeight > height * 0.095
          ? [
              styles.resizedTabBar,
              {
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : colors.backgroundGreyC,
              },
            ]
          : styles.resizableTabBar,
        {
          height: minHeight,
          width: minWidth,
          overflow: 'hidden',
        },
      ]}>
      <View
        style={{
          width: '100%',
          height: height * 0.095,
          backgroundColor:
            minHeight > height * 0.095
              ? isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.backgroundGreyC
              : isDarkMode
              ? MyDarkTheme.colors.lightDark
              : themeColors.primary_color,
        }}
        {..._panResponder.panHandlers}>
        <View
          style={[
            styles.handleView,
            {
              backgroundColor:
                minHeight > height * 0.095
                  ? colors.greyLight
                  : colors.whiteOpacity5,
            },
          ]}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: moderateScale(15),
          }}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
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
                    flex: 1,
                    height: height * 0.095,
                    alignItems: 'center',
                  }}>
                  {minHeight > height * 0.095
                    ? options.tabBarIcon({
                        focused: isFocused,
                        tintColor: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                      })
                    : options.tabBarIcon({
                        tintColor: colors.whiteOpacity77,
                        focused: isFocused,
                      })}
                  <Text
                    style={
                      minHeight > height * 0.095
                        ? {
                            ...props.labelStyle,
                            // ...styles.labelStyle,
                            color: isDarkMode
                              ? MyDarkTheme.colors.text
                              : colors.black,
                            opacity: 0.6,
                            fontSize: textScale(11),
                          }
                        : {
                            ...props.labelStyle,
                            // ...styles.labelStyle,
                            color: isFocused
                              ? themeColors.secondary_color
                              : colors.white,
                            opacity: isFocused ? 1 : 0.6,
                            fontSize: textScale(11),
                          }
                    }>
                    {label}
                  </Text>
                </TouchableOpacity>
              </Fragment>
            );
          })}
        </View>
      </View>
      {minHeight > moderateScaleVertical(100) && (
        <View
          style={{
            height: minHeight,
            marginHorizontal: moderateScale(40),
            marginTop: moderateScaleVertical(20),
            paddingBottom: moderateScaleVertical(120),
          }}>
          <FlatList
            data={
              appMainData &&
              appMainData?.categories &&
              appMainData?.categories.length &&
              appMainData?.categories
            }
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => {
              return <View style={{height: moderateScaleVertical(20)}}></View>;
            }}
            renderItem={_renderItem}
          />
        </View>
      )}
    </Animated.View>
  );
};

export function stylesFunc({fontFamily, themeColors}) {
  const styles = StyleSheet.create({
    resizableTabBar: {
      minHeight: height * 0.095,
      minWidth: width * moderateScale(0.75),
      alignSelf: 'center',
      position: 'absolute',
      borderRadius: moderateScale(40),
      bottom: Platform.OS === 'ios' ? moderateScale(15) : moderateScale(3),
      backgroundColor: themeColors.primary_color,
    },
    resizedTabBar: {
      minHeight: height * 0.095,
      minWidth: width * moderateScale(0.75),
      alignSelf: 'center',
      position: 'absolute',
      borderRadius: moderateScale(40),
      bottom: Platform.OS === 'ios' ? moderateScale(15) : moderateScale(3),
      justifyContent: 'flex-start',
      backgroundColor: colors.backgroundGreyC,
    },
    labelStyle: {
      fontFamily: fontFamily.circularMedium,
      fontSize: textScale(9),
    },
    handleView: {
      height: moderateScaleVertical(5),
      width: moderateScale(40),
      alignSelf: 'center',
      borderRadius: moderateScale(3),
      marginTop: moderateScaleVertical(6),
      marginBottom: moderateScaleVertical(10),
    },
    itemImage: {
      height: moderateScale(50),
      width: moderateScale(50),
      borderRadius: 50,
    },
  });
  return styles;
}
export default React.memo(CustomBottomTabBarThree);
