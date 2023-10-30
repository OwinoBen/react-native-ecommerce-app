//import liraries

import { StyleSheet, Text, View } from 'react-native'
import { moderateScale, moderateScaleVertical, textScale } from '../../../styles/responsiveSize'
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';

// define your styles
const styles = StyleSheet.create({

    firstView: {
        marginHorizontal: moderateScale(24),
        marginVertical: moderateScaleVertical(26)
    },
    firstViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nameView: {
        flexDirection: 'column',
        marginTop: moderateScale(8)
    },
    nameStyle: {
        fontSize: moderateScale(19),
        fontFamily: fontFamily.semiBold,
        marginTop: moderateScaleVertical(4)
    },
    nameText: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.regular,
        color: colors.lightTextGrey,
        marginTop: moderateScaleVertical(4)
    },
    viewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingStyle: {
        fontSize: moderateScale(19),
        fontFamily: fontFamily.semiBold
    },
    firstLine: {
        height: moderateScaleVertical(84),
        width: moderateScale(84),
        borderRadius: moderateScale(42),
        // backgroundColor: 'grey'
    },
    alarmView: {
        flexDirection: 'row',
        marginTop: moderateScale(24),
        alignItems: 'center'
    },
    alarmStyle: {
        height: moderateScaleVertical(36),
        width: moderateScale(36),
        borderRadius: moderateScale(9),
        backgroundColor: colors.green,
        alignItems: 'center', justifyContent: 'center'
    },
    textStyle: {
        fontSize: textScale(12),
        color: colors.grayText
    },
    lineStyle: {
        borderWidth: 0.5,
        marginTop: moderateScaleVertical(34),
        borderColor: colors.lightTextGrey
    },
    techStyle: {
        marginTop: moderateScaleVertical(24),
        fontSize: textScale(12),
        fontFamily: fontFamily.regular
    },
    degView: {
        height: moderateScale(30),
        width: moderateScale(100),
        borderRadius: moderateScale(18),
        borderWidth: 0.5, marginTop: moderateScaleVertical(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.greyA
    },
    degText: {
        fontFamily: fontFamily.regular,
        color: colors.grayText
    },
    secLine: {
        borderWidth: 0.5,
        marginTop: moderateScaleVertical(24),
        borderColor: colors.lightTextGrey
    },
    callStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: moderateScale(12),
        backgroundColor: colors.lightGreen,
        marginTop: moderateScale(22),
        justifyContent: 'center',
        height: moderateScaleVertical(52)
    },
    callText: {
        color: colors.greenD,
        fontSize: textScale(14),
        marginLeft: moderateScale(4)
    },
    revText: {
        fontSize: textScale(10),
        color: colors.grayText
    },
    ratingText: {
        marginLeft: moderateScale(4),
        fontFamily: fontFamily.bold, fontSize: textScale(11)
    },
    commentText: {
        marginTop: moderateScaleVertical(8),
        fontSize: textScale(13),
        fontFamily: fontFamily.regular,
        color: colors.lightTextGrey
    },
    dateText: {
        fontSize: textScale(12),
        color: colors.lightTextGrey,
        marginTop: moderateScaleVertical(2),
        fontFamily: fontFamily.regular
    },
    imgStyle: {
        height: moderateScaleVertical(14),
        width: moderateScale(15),
        tintColor: 'green'
    },
    nameTextStyle: {
        fontSize: textScale(13),
        marginTop: moderateScaleVertical(10),
        fontFamily: fontFamily.regular
    },
});

//make this component available to the app
export default styles;
