import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber, getImageUrl} from '../utils/helperFunctions';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';
import MarketCard3 from './MarketCard3';

const MarketCard2 = ({data = {}, onPress = () => {}, extraStyles = {}}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appStyle,appData} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, extraStyles});
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      // style={styles.mainTouchContainer}
      style={{
        padding: moderateScale(8),
        ...styles.mainTouchContainer,
        backgroundColor:
          !!data?.is_vendor_closed && data?.closed_store_order_scheduled == 0
            ? getColorCodeWithOpactiyNumber(
                colors.textGreyLight.substring(1),
                20,
              )
            : colors.whiteOpacity15,
        
      }}
      >
      <View style={{flex: 0.9}}>
        <Text
          style={
            isDarkMode
              ? [styles.categoryText, {color: MyDarkTheme.colors.text}]
              : styles.categoryText
          }>
          {data.name}
        </Text>
        {data.desc && (
          <View
            style={{
              flexDirection: 'row',
              marginVertical: moderateScaleVertical(4),
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: textScale(12),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyJ,
                fontFamily: fontFamily.regular,
              }}>
              {data.desc}
            </Text>
          </View>
        )}

        <View
          style={{
            width: '90%',
            marginVertical: moderateScaleVertical(8),
          }}>
          <DashedLine
            dashLength={5}
            dashThickness={1}
            dashGap={2}
            dashColor={colors.borderColorD}
          />
        </View>
        {!!appData?.profile?.preferences?.rating_check && data?.product_avg_average_rating && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{tintColor: isDarkMode ? colors.yellowB : colors.black}}
              source={imagePath.star}
            />

            <Text
              style={{
                color: isDarkMode ? MyDarkTheme.colors.text : colors.blackC,
                fontSize: textScale(11),
                fontFamily: fontFamily.medium,
                marginHorizontal: moderateScale(5),
              }}>
              {Number(data?.product_avg_average_rating).toFixed(1)}
            </Text>
          </View>
        )}
      </View>
      <FastImage
        style={{
          height: moderateScaleVertical(95),
          width: moderateScale(95),
          borderRadius: moderateScale(16),
          resizeMode: 'cover',
        }}
        source={{
          uri: getImageUrl(
            data.banner.proxy_url || data.image.proxy_url,
            data.banner.image_path || data.image.image_path,
            '800/400',
          ),
          priority: FastImage.priority.high,
        }}
      />
    </TouchableOpacity>
  );
};

export function stylesFunc({fontFamily, extraStyles}) {
  const styles = StyleSheet.create({
    mainTouchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: moderateScale(5),
      ...extraStyles,
    },
    categoryText: {
      fontSize: textScale(16),
      color: colors.blackC,
      fontFamily: fontFamily.medium,
    },
  });
  return styles;
}
export default React.memo(MarketCard2);
