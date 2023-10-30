import { StyleSheet } from "react-native";
import colors from "../../styles/colors";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../styles/responsiveSize";

export default ({ fontFamily, themeColors }) => {
  const styles = StyleSheet.create({
    containerStyle: {
      paddingVertical: 0,
      height: moderateScaleVertical(58),
      alignItems: "center",
      borderBottomColor: colors.lightGreyBorder,
      borderBottomWidth: 0.7,
    },
    userProfileView: {
      alignSelf: "center",
      borderColor: colors.white,
      marginTop: moderateScale(30),
    },
    cameraView: {
      position: "absolute",
      right: -20,
    },
    userName: {
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      lineHeight: moderateScaleVertical(20),
    },
    userEmail: {
      marginTop: moderateScaleVertical(5),
      fontSize: textScale(15),
      color: colors.textGrey,
      lineHeight: moderateScaleVertical(20),
      fontFamily: fontFamily.medium,
      opacity: 0.5,
    },
    borderRoundBotton: {
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      height: moderateScaleVertical(30),
    },
    bottomSection: {
      flex: 0.8,
      marginBottom: moderateScaleVertical(78),
    },
    topSection: {
      flex: 0.2,
      justifyContent:'center'
    },

    address: {
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily.medium,
      opacity: 0.7,
    },
    textStyle: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      // opacity: 0.6,
    },
    labelStyle: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    viewDetailBottomView: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
      bottom: height / 4,
      left: 0,
      right: 20,
    },
    viewDetail: {
      color: themeColors.primary_color,
      fontFamily: fontFamily.bold,
      fontSize: textScale(16),
    },
  });
  return styles;
};
