import React, {useState} from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import ScaledImage from 'react-native-scalable-image';
import {useSelector} from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {getImageUrl} from '../../../utils/helperFunctions';

export default function DashBoardHeaderTwo({
  navigation = {},
  location = [],
  handleRefresh = () => {},
  isLoading = true,
  isRefreshing = false,
}) {
  const [state, setState] = useState({
    mainViewHeight: 0,
  });
  const darkthemeusingDevice = useDarkMode();

  const {appData, appStyle, themeColors, themeToggle, themeColor} = useSelector(
    (state) => state?.initBoot,
  );
  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const {mainViewHeight} = state;
  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  return (
    <>
      <View
        style={{
          width: width,
          height: width / 2,
        }}>
        <View
          style={{
            borderRadius: width,
            width: width * 2,
            height: width * 2,
            marginLeft: -(width / 2),
            position: 'absolute',
            bottom: moderateScaleVertical(50),
            backgroundColor: themeColors.primary_color,
          }}></View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: moderateScaleVertical(5),
            alignSelf: 'center',
            width: '85%',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image source={imagePath.drawerMenuIcon} />
          </TouchableOpacity>
          <ScaledImage
            width={width / 9}
            source={
              profileInfo && profileInfo.logo
                ? {
                    uri: getImageUrl(
                      isDarkMode
                        ? profileInfo.dark_logo.image_fit
                        : profileInfo.logo.image_fit,
                      isDarkMode
                        ? profileInfo.dark_logo.image_path
                        : profileInfo.logo.image_path,
                      '1000/1000',
                    ),
                  }
                : imagePath.logo
            }
          />

          <TouchableOpacity
            onPress={() => navigation.navigate(navigationStrings.ACCOUNTS)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image source={imagePath.profileSettingIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.searchView}
          activeOpacity={1}
          onPress={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }>
          <Image source={imagePath.searchIcon} />
          <View>
            <Text style={styles.searchTextStyle}>{'Search product...'}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: height / 5,
          width: '100%',
          position: 'absolute',
          top: moderateScaleVertical(140),
        }}>
        <ScrollView
          refreshing={isRefreshing}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
          }}
        />
      </View>
    </>
  );
}

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    searchView: {
      marginHorizontal: moderateScale(30),
      borderColor: colors.white,
      borderWidth: moderateScale(2),
      height: moderateScaleVertical(35),
      borderRadius: moderateScale(35),
      flexDirection: 'row',
      paddingHorizontal: moderateScale(10),
      marginVertical: moderateScaleVertical(10),
      alignItems: 'center',
      backgroundColor: colors.navyBlue,
    },
    searchTextStyle: {
      paddingLeft: moderateScale(10),
      color: colors.white,
      fontSize: textScale(12),
      fontFamily: fontFamily.bold,
    },
    headerLableTitle: {
      // paddingLeft: moderateScale(10),
      textAlign: 'center',
      color: colors.white,
      fontSize: textScale(16),
      fontFamily: fontFamily.bold,
    },
    headerLableViewStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: moderateScale(20),
    },
  });
  return styles;
}

// import React from 'react';
// import {StyleSheet, Text, View} from 'react-native';
// import {height, width} from '../../../styles/responsiveSize';
// import {Circle} from 'react-native-svg';

// export default function DashBoardHeaderTwo() {
//   return (
//     <View
//       style={{
//         alignSelf: 'center',
//         width: width,
//         overflow: 'hidden',
//         height: width / 2.5,
//       }}>
//       <View
//         style={{
//           borderRadius: width,
//           width: width * 2,
//           height: width * 2,
//           marginLeft: -(width / 2),
//           position: 'absolute',
//           bottom: 0,
//           overflow: 'hidden',
//           backgroundColor: 'green',
//         }}></View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({});
