import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import { height, moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import { getImageUrl } from '../utils/helperFunctions';


const ProductCardEcomSection = ({
    data = {},
    onPress = () => { },
    btnLoader,
    section = {},
}) => {

    const theme = useSelector((state) => state?.initBoot?.themeColor);

    const isDarkMode = theme;
    const currencies = useSelector((state) => state?.initBoot?.currencies);
    const { appStyle, themeColors, appData } = useSelector((state) => state?.initBoot || {});
    const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences || {};

    const fontFamily = appStyle?.fontSizeData;
    const styles = styleData({ themeColors, fontFamily });

    const commonStyles = commonStylesFunc({ fontFamily });

    const url1 = !isEmpty(data?.media) && data?.media[0]?.image?.path.image_fit;
    const url2 = !isEmpty(data?.media) && data?.media[0]?.image?.path.image_path;

    const getImage = (quality) => getImageUrl(url1, url2, quality);



    return (
        <TouchableOpacity
            disabled={btnLoader}
            activeOpacity={0.6}
            //   onPress={onPress}
            style={{
                ...commonStyles.shadowStyle,
                height: moderateScale(200),
                margin: 4,
                backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.white,
                flexDirection:'row'

            }}>


            <View style={{flex:0.4}}>
            {!!url1 ? (
                <FastImage
                    style={{
                        ...styles.imgStyle,
                        backgroundColor: isDarkMode
                            ? colors.whiteOpacity15
                            : colors.white,

                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    source={{
                        uri: getImage('300/300'),
                        cache: FastImage.cacheControl.immutable,
                        priority: FastImage.priority.high,
                    }}
                />

            ) :
                <View
                    style={{
                        ...styles.imgStyle,
                        backgroundColor: isDarkMode
                            ? colors.whiteOpacity15
                            : colors.greyColor,
                   
                    }}

                />
            }
            </View>
            <View style={{flex:0.6, paddingVertical:moderateScaleVertical(12),paddingHorizontal:moderateScale(8)}}>
                    <Text
                        style={{
                            ...commonStyles.futuraBtHeavyFont14,
                            color: isDarkMode ? colors.white : colors.black,
                            fontFamily: fontFamily.regular,
                            fontSize: textScale(12),
                        }}>
                        {!isEmpty(data?.translation) ? data?.translation[0]?.title : data?.title || data?.sku}
                    </Text>

                    {data?.vendor?.name && (
                        <Text
                            style={{
                                fontSize: textScale(9),
                                color: isDarkMode ? colors.white : colors.grayOpacity51,
                                marginVertical: moderateScaleVertical(4),
                                textAlign: 'left',
                            }}>
                            {data?.vendor?.name}
                        </Text>
                    )}
                    {!!section?.title ? (
                        <Text
                            numberOfLines={1}
                            style={{
                                ...styles.inTextStyle,
                                color: isDarkMode
                                    ? colors.white
                                    : colors.blackOpacity40,
                            }}>
                            {strings.IN}
                            {` ${data?.title}`}
                        </Text>
                    ) : null}
               

                {!!data?.averageRating && (
                    <View
                        style={{
                            borderWidth: 0.5,
                            padding: 2,
                            borderRadius: 2,
                            marginVertical: moderateScaleVertical(4),
                            borderColor: colors.yellowB,
                            backgroundColor: colors.yellowOpacity10,
                            alignSelf:'flex-start'
                        }}>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={Number(parseInt(data?.averageRating).toFixed(1))}
                            fullStarColor={colors.yellowB}
                            starSize={8}
                            containerStyle={{ width: width / 9 }}
                        />
                    </View>
                )}

                {/* Price view */}
                <View
                    style={{
                        paddingTop: moderateScale(5),
                        paddingBottom: moderateScale(5),
                        flexDirection: 'row',
                    }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            ...commonStyles.mediumFont14,
                            color: isDarkMode ? colors.white : colors.black,
                            fontSize: textScale(12),
                            fontFamily: fontFamily.regular,
                        }}>
                        {tokenConverterPlusCurrencyNumberFormater(
                            Number(data?.variant[0]?.price) * Number(data?.variant[0]?.multiplier || 1),
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol,
                        )}
                    </Text>

                    {Number(data?.variant[0]?.compare_at_price) >
                        Number(data?.variant[0]?.price) && (
                            <Text
                                numberOfLines={1}
                                style={{
                                    ...commonStyles.mediumFont14,
                                    color: isDarkMode ? colors.white : colors.redB,
                                    fontSize: textScale(12),
                                    fontFamily: fontFamily.regular,
                                    textDecorationLine: 'line-through',
                                    marginHorizontal: moderateScale(8),
                                }}>
                                {/* { currencies?.primary_currency?.symbol} */}
                                {tokenConverterPlusCurrencyNumberFormater(
                                    data?.variant[0]?.compare_at_price * data?.variant[0]?.multiplier,
                                    digit_after_decimal,
                                    additional_preferences,
                                    currencies?.primary_currency?.symbol,
                                )}
                            </Text>
                        )}

                    {!!data?.is_recurring_booking &&
                        <TouchableOpacity
                            style={{
                                color: isDarkMode ? MyDarkTheme.colors.text : colors.redB,
                                marginHorizontal: moderateScale(8),
                            }}
                            onPress={onPress}
                            activeOpacity={0.8}>
                            <Image
                                style={{
                                    tintColor: isDarkMode
                                        ? colors.white
                                        : themeColors.primary_color,
                                }}
                                source={imagePath.ic_calendar}
                            />
                        </TouchableOpacity>
                    }
                </View>

                <View style={{}}>
          {!!data?.translation_description ||
            !!data?.translation[0]?.translation_description ? (
            <View style={{}}>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: textScale(10),
                  fontFamily: fontFamily.regular,
                  lineHeight: moderateScale(14),
                  color: isDarkMode
                    ? colors.white
                    : colors.blackOpacity66,
                  textAlign: 'left',
                }}>
                {!!data?.translation_description
                  ? data?.translation_description.toString()
                  : !!data?.translation[0]?.translation_description
                    ? data?.translation[0]?.translation_description
                    : ''}
              </Text>
            </View>
          ) : null}
        </View>
            </View>
        </TouchableOpacity>

    );
};

function styleData({ themeColors, fontFamily }) {
    const styles = StyleSheet.create({
        outOfStock: {
            color: colors.orangeB,
            fontSize: textScale(10),
            lineHeight: 20,
            fontFamily: fontFamily.medium,
        },
        customTextStyle: {
            fontSize: textScale(8),
            color: themeColors.primary_color,
            fontFamily: fontFamily.medium,
            marginTop: moderateScaleVertical(4),
            color: colors.yellowC,
        },
        addStyleText: {
            fontSize: textScale(10),
            color: themeColors.primary_color,
            fontFamily: fontFamily.bold,
            marginHorizontal: moderateScale(16),
        },
        addBtnStyle: {
            borderWidth: 1,
            // paddingVertical: moderateScaleVertical(6),
            borderRadius: moderateScale(8),
            borderColor: themeColors.primary_color,
            justifyContent: 'center',
            alignItems: 'center',
            // width: moderateScale(100),
            // minHeight: moderateScaleVertical(35),
            // flexDirection:"row"
            // width: moderateScale(80),
        },
        inTextStyle: {
            width: moderateScaleVertical(220),
            fontFamily: fontFamily.regular,
            fontSize: textScale(9),
            width: width / 3,
            textAlign: 'left',
            marginTop: moderateScaleVertical(6),
            marginBottom: moderateScaleVertical(4),
        },
        imgStyle: {
            height: moderateScale(180),
            width: '100%',

            // flex: 1
        },
    });
    return styles;
}
export default React.memo(ProductCardEcomSection);
