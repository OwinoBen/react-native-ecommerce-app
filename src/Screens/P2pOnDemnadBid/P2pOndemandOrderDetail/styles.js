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
    addressCont: { flexDirection: 'row', marginTop: moderateScaleVertical(14), marginHorizontal: moderateScale(16), },
    addressTxt: { fontFamily: fontFamily?.regular, color: colors.textGreyN, marginLeft: moderateScale(8), fontSize: textScale(13) }
  });
  // export default styles;
  return styles;
};
