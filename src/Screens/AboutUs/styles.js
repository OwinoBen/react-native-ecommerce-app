import {StyleSheet} from 'react-native';
import store from '../../redux/store';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {moderateScaleVertical, textScale} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    titleAbout: {
      ...commonStyles.futuraBtHeavyFont14,
      color: colors.textGrey,
      textAlign: 'justify',
    },
    contentAbout: {
      fontSize: textScale(14),
      color: colors.textGreyB,
      fontFamily: fontFamily.medium,
      lineHeight: moderateScaleVertical(20),
      textAlign: 'justify',
    },
  });
  return styles;
};
