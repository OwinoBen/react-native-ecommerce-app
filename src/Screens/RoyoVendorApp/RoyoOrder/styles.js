import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';

import {
    moderateScale,
    moderateScaleVertical,
    textScale
} from '../../../styles/responsiveSize';
import { customMarginBottom } from '../../../utils/constants/constants';

export default ({ fontFamily, themeColors }) => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: customMarginBottom(),
            flex: 1,
        },
        emptyCartBody: {
            flex: 1,
            justifyContent: 'center',
            height: 400,
            alignItems: 'center',
        },
        textStyle: {
            color: colors.black,
            fontSize: 24,
            fontFamily: fontFamily.bold,
        },
        imageStyle: {
            width: moderateScale(50),
            height: moderateScale(50),
            borderRadius: moderateScale(34),
            marginLeft: moderateScaleVertical(20),
        },
        flexRowCenter: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        font15Bold: {
            fontFamily: fontFamily.bold,
            fontSize: textScale(15),
            textAlign: 'center',
        },
    });
    return styles;
};
