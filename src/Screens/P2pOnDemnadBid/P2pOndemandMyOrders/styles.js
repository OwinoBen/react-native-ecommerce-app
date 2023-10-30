import { Platform, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { getColorCodeWithOpactiyNumber } from '../../utils/helperFunctions';

export default ({ fontFamily, themeColors }) => {
  const commonStyles = commonStylesFun({ fontFamily });
  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(16),
      marginBottom: moderateScaleVertical(12),
    },
    emptyContainer: {
      height: height / 1.5,
      alignItems: "center",
      justifyContent: "center"
    },
    leftText: {
      fontFamily: fontFamily?.medium,
      fontSize: textScale(16),
      color: colors.black,
    },
    rightTxt: {
      fontFamily: fontFamily?.regular,
      fontSize: textScale(12),
      color: themeColors?.primary_color,
    },

  });
  return styles;
};
