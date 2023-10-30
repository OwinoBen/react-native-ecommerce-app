import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {moderateScaleVertical, textScale} from '../../styles/responsiveSize';

export default StyleSheet.create({
  enterShortCode: {
    color: colors.black,
    textAlign: 'center',
    fontFamily: fontFamily.circularBold,
    fontSize:textScale(18),
  },
  enterShortCode2: {
    color: colors.lightGreyBgColor,
    textAlign: 'center',
    fontFamily: fontFamily.circularMedium,
    fontSize:textScale(14),
  },
  guestBtn: {
    marginTop: moderateScaleVertical(20),
    // backgroundColor: colors.white,
    borderWidth: 0,
  },
  splashStyle: {
    flex: 1,
    position: "absolute",
    zIndex: 99,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  videoView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  videoStyle:{
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});
