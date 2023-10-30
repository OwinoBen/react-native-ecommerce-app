import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import HTMLView from 'react-native-htmlview';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {moderateScale, textScale, width} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {tokenConverterPlusCurrencyNumberFormater} from '../utils/commonFunction';
import {getImageUrl} from '../utils/helperFunctions';

const ProductCartListView = ({
  data = {},
  onPress = () => {},
  cardWidth,
  cardStyle = {},
  onAddtoWishlist,
  addToCart = () => {},
  activeOpacity = 1,
}) => {
  const currentTheme = useSelector((state) => state?.appTheme);
  const {currencies, appStyle, appData} = useSelector(
    (state) => state?.initBoot,
  );
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {themeColors, themeLayouts} = currentTheme;
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});
  const cardWidthNew = cardWidth ? cardWidth : width - 21.5;
  const url1 = data?.media[0]?.image?.path.image_fit;
  const url2 = data?.media[0]?.image?.path.image_path;

  const getImage = getImageUrl(url1, url2, '500/500');

  const productPrice =
    data?.variant[0]?.price *
    (data?.variant[0]?.multiplier ? data?.variant[0]?.multiplier : 1);

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={
        isDarkMode
          ? {
              width: cardWidthNew,
              ...commonStyles.shadowStyle,
              borderRadius: 10,
              alignSelf: 'center',
              padding: 10,
              backgroundColor: MyDarkTheme.colors.lightDark,
              // paddingTop: moderateScaleVertical(14),
              ...cardStyle,
            }
          : {
              width: cardWidthNew,
              ...commonStyles.shadowStyle,
              borderRadius: 10,
              alignSelf: 'center',
              padding: 10,
              // paddingTop: moderateScaleVertical(14),
              ...cardStyle,
            }
      }>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 0.3}}>
          <FastImage
            source={{
              uri: url1 && url2 ? getImage : '',
              priority: FastImage.priority.high,
            }}
            style={{
              height: cardWidthNew / 5,
              width: cardWidthNew / 5,
              borderRadius: 10,
              // marginHorizontal: ,
              // alignSelf: 'center',
            }}
            resizeMode="cover"
          />
        </View>

        <View style={{flex: 0.8}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 0.6}}>
              <Text
                numberOfLines={1}
                style={{
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyI,
                  fontSize: textScale(14),
                  fontFamily: fontFamily.bold,
                }}>
                {data?.translation[0]?.title}
              </Text>
            </View>
            <View style={{flex: 0.4, alignItems: 'flex-end'}}>
              <Text
                style={{
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyI,
                  fontSize: textScale(16),
                  fontFamily: fontFamily.bold,
                }}>
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(data.variant[0].multiplier) *
                    Number(data.variant[0].price),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
              </Text>
            </View>
          </View>
          {data?.translation[0]?.body_html != null ? (
            <View style={{marginTop: moderateScale(10)}}>
              <Text
                numberOfLines={2}
                style={{
                  color: colors.textGreyI,
                  fontSize: textScale(12),
                  fontFamily: fontFamily.circularRegular,
                  opacity: 0.6,
                }}>
                {/* {data?.translation[0]?.title} */}
                <HTMLView
                  value={data?.translation[0]?.body_html}
                  // textComponentProps={{
                  //   numberOfLines: 2,
                  // }}
                  // nodeComponentProps={{numberOfLines: 2}}
                />
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default React.memo(ProductCartListView);
