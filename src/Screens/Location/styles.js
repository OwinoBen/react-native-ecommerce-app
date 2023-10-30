import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const styles = StyleSheet.create({
    detectLocation: {
      color: colors.black,
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(13),
      // textAlign: 'center',
      opacity: 0.8,
    },
    listView: {
      position: 'absolute',
      backgroundColor: colors.white,
      zIndex: 1000, //Forcing it to front
      marginTop: moderateScaleVertical(40),
      marginHorizontal: moderateScale(10),
    },
    textInputContainer: {
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScaleVertical(10),
      height: moderateScaleVertical(40),
      backgroundColor: colors.red,
    },
    predefinedPlacesDescription: {
      color: colors.themeColor,
    },
    textInput: {
      color: '#5d5d5d',
      fontSize: 16,
      fontFamily: fontFamily.medium,
      color: colors.textGreyOpcaity7,
    },
    useCurrentLocationView: {
      backgroundColor: 'transparent',
      alignItems: 'center',
      flexDirection: 'row',
      marginHorizontal: moderateScale(15),
      marginTop: moderateScaleVertical(70),
    },
    savedAddressView: {
      flexDirection: 'row',
      marginBottom: moderateScaleVertical(8),
      alignItems: 'center'
    },
    addresssLableName: {
      fontSize: textScale(12),
      color: colors.black,
      fontFamily: fontFamily.medium,

      marginLeft: moderateScale(6),
    },
    addressViewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: moderateScale(10),
      borderBottomWidth: 0.5,
      marginBottom: moderateScaleVertical(4),
    }
  });
  return styles;
};
