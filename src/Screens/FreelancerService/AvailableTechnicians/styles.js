//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import { moderateScale, moderateScaleVertical, textScale } from '../../../styles/responsiveSize';

export default ({ themeColors, isDarkMode }) =>
    StyleSheet.create({
        container: {
            marginHorizontal: moderateScale(24),
            flex: 0.98,
        },
        textView: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: moderateScaleVertical(26)
        },
        sortView: {
            height: moderateScale(32),
            // width: moderateScale(74),
            borderWidth: 0.5,
            borderColor: colors.greyA,
            paddingHorizontal: moderateScale(18),
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: moderateScale(4)
        },
        sortTextStyle: {
            marginRight: moderateScale(8),
        },
        timeServiceStyle: { fontSize: textScale(12), fontFamily: fontFamily.regular, color: color.lightGray },
        renderView: {
            height: moderateScaleVertical(74),
            backgroundColor: colors.lightGray,
            // width: moderateScale(339),
            borderRadius: moderateScale(4),
            flexDirection: 'row',
            padding: moderateScale(14),
        },
        nameStyle: {
            fontSize: textScale(13),
            fontFamily: fontFamily.semiBold
        },
        jobPercentage: {
            fontSize: textScale(12),
            fontFamily: fontFamily.circularRegular,
            color: colors.lightTextGrey,
            marginTop: moderateScaleVertical(2)
        },
        priceStyle: {
            fontSize: textScale(14),
            fontFamily: fontFamily.bold,
            marginTop: moderateScaleVertical(2)

        },
        imgStyle: {
            height: moderateScale(40),
            width: moderateScale(40),
            backgroundColor: 'pink',
            borderRadius: moderateScale(3)
        },
        pickerView: {
            width: moderateScale(80),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: moderateScale(4),
            borderWidth: 0.5,
            borderColor: colors.textGreyB,
            padding: moderateScale(6),
        },
        textStyleTime: {
            fontSize: textScale(12),
            marginHorizontal: moderateScale(5),
            fontFamily: fontFamily.medium,
            color: colors.black,
        },
        imageStyle: {
            height: moderateScaleVertical(12),
            width: moderateScale(12),
            tintColor: themeColors.primary_color,
        },
        imageStyle2: {
            height: moderateScaleVertical(16),
            width: moderateScale(16),
            tintColor: themeColors.primary_color,
        },
        borderOption: {
            borderBottomWidth: 1,
            borderBottomColor: colors.greyColor,
        }
    })