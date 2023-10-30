import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { getImageUrl } from '../utils/helperFunctions';
import { SvgUri } from 'react-native-svg';
import Elevations from 'react-native-elevation';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../styles/theme';
import { getBundleId } from 'react-native-device-info';
import { appIds } from '../utils/constants/DynamicAppKeys';

const HomeCategoryCard2 = ({
  data = {},
  onPress = () => { },
  isLoading = false,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appStyle } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '160/160',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  const onLoad = (evl) => { };

  let imgHeight =
    appStyle?.homePageLayout === 5
      ? moderateScale(60)
      : getBundleId() === appIds.onTheWheel || getBundleId() === appIds.ping
        ? moderateScale(70)
        : moderateScale(50);
  let imgWidth =
    appStyle?.homePageLayout === 5
      ? moderateScale(60)
      : getBundleId() === appIds.onTheWheel || getBundleId() === appIds.ping
        ? moderateScale(70)
        : moderateScale(50);
  let imgRadius =
    appStyle?.homePageLayout === 5
      ? moderateScale(30)
      : getBundleId() === appIds.onTheWheel || getBundleId() === appIds.ping
        ? moderateScale(35)
        : moderateScale(25);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        // width: (width - moderateScale(16)) / 4,
        marginVertical: moderateScale(1),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          flex: 0.8,
          borderRadius: moderateScale(40),
          width: moderateScale(80),
          height: moderateScale(80),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {isSVG ? (
          <SvgUri
            height={imgHeight}
            width={imgWidth}
            uri={imageURI}
            style={{}}
          />
        ) : (
          <View>
            <FastImage
              style={{
                height: imgHeight,
                width: imgWidth,
                borderRadius: imgRadius,
              }}
              source={{
                uri: imageURI,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              resizeMode="cover"
              onLoad={onLoad}
            />
          </View>
        )}
      </View>
      <View style={{ flex: 0.2 }}>
        <Text
          // numberOfLines={1}
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity70,
            fontFamily: fontFamily.regular,
            fontSize: textScale(9),
            textAlign: 'center',
            marginTop: moderateScaleVertical(4),
          }}>
          {data?.name || (data?.translation && data?.translation[0]?.name)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default React.memo(HomeCategoryCard2);
const styles = StyleSheet.create({});
