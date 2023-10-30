import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';
import {
    moderateScale,
    moderateScaleVertical
} from '../../../styles/responsiveSize';

export default ({ themeColors, fontFamily }) => {
    const styles = StyleSheet.create({
        container: {
            borderRadius: moderateScale(16),
            height: moderateScaleVertical(149),
            width: moderateScale(166),
            backgroundColor: colors.green,
            marginLeft: moderateScale(16),

        }
    });

    return styles;
};
