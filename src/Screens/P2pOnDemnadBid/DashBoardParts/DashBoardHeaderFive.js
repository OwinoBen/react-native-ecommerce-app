import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width
} from '../../../styles/responsiveSize';
import { getImageUrl } from '../../../utils/helperFunctions';
import stylesFunc from '../styles';

import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import ButtonImage from '../../../Components/ImageComp';
import { MyDarkTheme } from '../../../styles/theme';

export default function DashBoardHeaderFive({
  // navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
  isLoading = false,
  isLoadingB = false,
  _onVoiceListen = () => { },
  isVoiceRecord = false,
  onPressCenterIcon = () => { },
  _onVoiceStop = () => { },
  showAboveView = true,
  currentLocation,
  nearestLoc,
  currentLoc,
}) {
  const navigation = useNavigation();
  const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector(
    state => state?.initBoot,
  );

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });

  const imageURI = getImageUrl(
    isDarkMode
      ? profileInfo?.dark_logo?.image_fit
      : profileInfo?.logo?.image_fit,
    isDarkMode
      ? profileInfo?.dark_logo?.image_path
      : profileInfo?.logo?.image_path,
    '200/400',
  );


  return (
    <View
      style={{
        paddingHorizontal: moderateScale(16),

      }}>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {!!(
          profileInfo &&
          (profileInfo?.logo || profileInfo?.dark_logo)
        ) ? (
          <FastImage
            style={{
              width: moderateScale(width / 6),
              height: moderateScale(40),
            }}
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: imageURI,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
          />
        ) : null}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(navigationStrings.LOCATION, {
              type: 'Home1',
            })
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',

          }}>
          <Image
            style={styles.locationIcon}
            source={imagePath.ic_map}
            resizeMode="contain"
          />
          <Text
            numberOfLines={1}
            style={

              {
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.black,
                fontFamily: fontFamily.medium,
                maxWidth: moderateScale(180)
              }
            }>
            {currentLocation?.address || location?.address}

            {/* {!!nearestLoc  ? currentLocation?.address : nearestLoc?.address || location?.address} */}
          </Text>

          <Image source={imagePath.ic_down_arrow} />
        </TouchableOpacity>

        <ButtonImage
          onPress={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }
          image={imagePath.icSearchNew}
          imgStyle={{ tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black }}
        />
      </View>

      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            height: moderateScale(48),
            borderRadius: moderateScale(8),
            backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.white,
            borderWidth: moderateScale(1),
            borderColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.borderColor
          }}>
          <TouchableOpacity
            style={{ marginHorizontal: moderateScale(8) }}
            onPress={() =>
              navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
            }>
            <Image
              style={{
                tintColor: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.textGreyH,
              }}
              source={imagePath.icSearchNew}
            />
          </TouchableOpacity>
        </View>
        <ButtonImage
          image={imagePath.filter}
          btnStyle={{ marginLeft: moderateScale(8) }}
          imgStyle={{
            tintColor: themeColors?.primary_color
          }}
        />
      </View> */}
    </View>
  );
}
