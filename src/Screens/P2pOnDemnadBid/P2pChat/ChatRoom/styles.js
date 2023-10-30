import { StyleSheet } from 'react-native';
import colors from '../../../../styles/colors';
import {
    moderateScale,
    moderateScaleVertical,
    textScale,
} from '../../../../styles/responsiveSize';

export default ({ fontFamily, isDarkMode }) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: moderateScale(16)
        },
        borderStyle: {
            // borderBottomWidth: 0.4,
            // borderBottomColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity20,
            marginVertical: moderateScaleVertical(8)
        },
        textDesc: {
            fontSize: textScale(12),
            color: isDarkMode ? colors.white : colors.blackOpacity66,
            fontFamily: fontFamily.medium,
            marginLeft: moderateScale(8),
            lineHeight: moderateScale(18),
            flex: 1
        },
        flexView: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: moderateScaleVertical(8)
        },
        textStyle: {
            color: isDarkMode ? colors.white : colors.black,
            fontFamily: fontFamily.medium,
            fontSize: textScale(14),

        },
        timeStyle: {
            color: isDarkMode ? colors.white : colors.blackOpacity43,
            fontFamily: fontFamily.regular,
            fontSize: textScale(12),

        },
        sahdowStyle: {
            borderRadius: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
            margin: 2,
            padding: moderateScale(8)
        }
    });
    return styles;
};
