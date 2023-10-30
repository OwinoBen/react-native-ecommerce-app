import { isEmpty } from 'lodash';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Pressable, TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import { height, moderateScale, moderateScaleVertical, scale, textScale, width } from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import { getImageUrl } from '../utils/helperFunctions';

const ProductCardEcom = ({
    data = {},
    onPress = () => { },
    btnLoader,
    section = {},
    onAddtoWishlist = () => { }
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
        <Pressable
            disabled={btnLoader}
            activeOpacity={0.6}
            // unstable_pressDelay={5000}
            // cancelable={false}
            onPress={onPress}
            style={{
                ...commonStyles.shadowStyle,
                minHeight: height / 3,
                margin: 4,
                backgroundColor: isDarkMode
                    ? colors.whiteOpacity15
                    : colors.white,
                width: width / 2.1
            }}>

            {!!url1 ? (
                <>
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
                    <View style={{ width: '100%', position: 'absolute', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: moderateScale(5), paddingHorizontal: moderateScale(10) }}>
                  
                        <View></View>
                        <TouchableWithoutFeedback 
                        onPress={onAddtoWishlist} 
                        style={{ backgroundColor: colors.grey1, 
                        borderRadius: 16, 
                        padding: moderateScale(4), 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        marginTop: moderateScale(8),

                         }}>
                            <FastImage
                                style={{
                                    height: 20,
                                    width: 20,

                                }}
                                source={!!data?.inwishlist ? imagePath.whiteFilledHeart : imagePath.heart2}
                                tintColor={isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : themeColors.primary_color}
                                resizeMode={FastImage.resizeMode.contain}
                            />

                        </TouchableWithoutFeedback>
                    </View>

                </>

            ) :
                <View
                    style={{
                        ...styles.imgStyle,
                        backgroundColor: isDarkMode
                            ? colors.whiteOpacity15
                            : colors.greyColor,
                        borderRadius: moderateScale(7),
                    }}

                />
            }
            <View style={{ paddingVertical: moderateScaleVertical(8), paddingHorizontal: moderateScale(8) }}>
                <View style={{}}>
                    <Text
                        numberOfLines={1}
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
                </View>



                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: moderateScaleVertical(8) }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            ...commonStyles.mediumFont14,
                            color: isDarkMode ? colors.white : colors.black,
                            fontSize: textScale(12),
                            fontFamily: fontFamily.medium,
                            marginRight: moderateScale(6)
                        }}>
                        {tokenConverterPlusCurrencyNumberFormater(
                            Number(data?.variant[0]?.price) * Number(data?.variant[0]?.multiplier || 1),
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol,
                        )}
                    </Text>
                    {
                        !!Number(data?.variant[0]?.compare_at_price) ? (
                            <>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        ...commonStyles.mediumFont14,
                                        color: isDarkMode ? colors.white : colors.grayOpacity51,
                                        fontSize: textScale(12),
                                        fontFamily: fontFamily.regular,
                                        textDecorationLine: 'line-through',
                                        // marginHorizontal: moderateScale(8),
                                    }}>
                                    {tokenConverterPlusCurrencyNumberFormater(
                                        Number(data?.variant[0]?.compare_at_price) * Number(data?.variant[0]?.multiplier || 1),
                                        digit_after_decimal,
                                        additional_preferences,
                                        currencies?.primary_currency?.symbol,
                                    )}
                                </Text>
                            </>
                        ) : null}

                </View>
                {
                    !!Number(data?.variant[0]?.compare_at_price) ?
                        <Text style={{
                            fontSize: textScale(12),
                            color: colors.green,
                            fontFamily: fontFamily.regular
                        }}>{parseInt(((data.variant[0].compare_at_price - data?.variant[0]?.price) / data?.variant[0]?.price * 100).toFixed(3))}% OFF</Text>
                        : null
                }
            </View>
        </Pressable>

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
            height: height / 4,
            width: '100%',

            // flex: 1
        },
        ratingView: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.green,
            borderRadius: scale(8),
            paddingHorizontal: moderateScaleVertical(4),
            marginTop: moderateScaleVertical(4),
            paddingVertical: moderateScaleVertical(2)
        }
    });
    return styles;
}
export default React.memo(ProductCardEcom);
