import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';
import {
    moderateScale,
    moderateScaleVertical,
    textScale,
} from '../../../styles/responsiveSize';
import { width, height } from '../../../styles/responsiveSize';

export default ({ fontFamily, themeColors }) => {
    const styles = StyleSheet.create({

        emptyContainer: {
            height: height / 1.5,
            alignItems: "center",
            justifyContent: "center"
        },
        titleTxt: {
            fontFamily: fontFamily?.medium,
            fontSize: textScale(16),
            color: colors.black,
            marginBottom: moderateScaleVertical(12),
            paddingLeft: moderateScale(16),
        }
    });
    // export default styles;
    return styles;
};
