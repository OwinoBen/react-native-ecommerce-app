import {Platform, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeight,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({themeColors, fontFamily, isDarkMode, MyDarkTheme}) =>
  StyleSheet.create({
    topHeaderView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 1000,
      width: width - moderateScale(20),
      top: height > 700 ? 50 : 30,
      alignItems: 'center',
      marginTop: moderateScaleVertical(16),
    },
    leftRightHeaderIconStyle: {
      // backgroundColor: colors.white,
      // height: 45,
      // width: 45,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: moderateScale(11),
      elevation: 2,
    },

    bottomHeaderView: {
      flexDirection: 'row',
      position: 'absolute',
      zIndex: 1000,
      width: width - moderateScale(40),
      top: width * 0.4,
      alignSelf: 'center',
      backgroundColor: 'white',
      borderRadius: moderateScale(12),
      paddingVertical: moderateScale(20),
      paddingLeft: moderateScale(20),
      borderRadius: 13,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    rateViewStyle: {
      backgroundColor: colors.yellowB,
      padding: 8,
      flexDirection: 'row',
      alignItems: 'center',
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      minWidth: moderateScale(50),
      height: moderateScale(30),
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    openCloseStatus: {
      fontFamily: fontFamily.bold,
      color: colors.green,
      fontSize: textScale(12),
      paddingTop: moderateScaleVertical(10),
    },
    distanceAndTimeView: {
      color: colors.black,
      opacity: 0.48,
      fontSize: textScale(12),
      paddingTop: moderateScaleVertical(10),
    },

    MainContainer: {
      flex: 1,
      // backgroundColor: 'white'
    },

    headerStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: moderateScale(8),
      // height: 42,
      marginTop: Platform.OS === 'ios' ? StatusBarHeight : 5,
    },

    HeaderInsideTextStyle: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
    },

    TextViewStyle: {
      textAlign: 'center',
      color: '#000',
      fontSize: 18,
      margin: 5,
      padding: 7,
      backgroundColor: '#ECEFF1',
    },
    loaderHeader: {
      marginTop: moderateScaleVertical(16),
      marginHorizontal: moderateScale(12),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: moderateScale(42),
    },
    hitSlopProp: {
      top: 100,
      right: 100,
      left: 100,
      bottom: 100,
    },
    header2: {height: height * 0.3},
    imageBackgroundHdr: {width: width, height: '100%'},
    linearGradientHdr: {
      height: '100%',
      width: width,
      paddingVertical: moderateScale(30),
    },
    hdrCompHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: width - moderateScale(20),
    },
    hdrCompRoundImg: {
      height: moderateScale(70),
      width: moderateScale(70),
      borderRadius: 35,
    },
    rightViewOfShareSearch: {
      flexDirection: 'row',
      flex: 0.2,
    },
    hdrAbsoluteView: {
      marginHorizontal: moderateScale(15),
      position: 'absolute',
      width: width - moderateScale(30),
      // minHeight: moderateScale(90),
      shadowOpacity: 0.3,
      shadowColor: '#000',
      shadowOffset: {height: 0, width: 0},
      borderRadius: moderateScale(12),
      paddingVertical: moderateScale(12),
      paddingLeft: moderateScale(15),
      justifyContent: 'center',
      elevation: 0.9,
      // alignItems:'center'
    },
    hdrNameRatingView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    hdrTitleTxt: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(16),
      flex: 0.9,
      textAlign: 'left',
    },
    hdrRatingTxtView: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.green,
      borderTopLeftRadius: moderateScale(4),
      borderBottomLeftRadius: moderateScale(4),
      paddingVertical: moderateScale(2),
      paddingHorizontal: moderateScale(10),
    },
    ratingTxt: {
      // color: colors.yellowC,
      // fontSize: textScale(11),
      fontFamily: fontFamily.medium,
      textAlign: 'left',
      color: colors.white,
      fontSize: textScale(9),
    },
    starImg: {
      tintColor: colors.white,
      marginLeft: 2,
      width: 9,
      height: 9,
    },
    milesView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    milesTxt: {
      color: colors.black,
      opacity: 0.4,
      marginLeft: moderateScale(5),
      textAlign: 'left',
    },
    categoryStyle: {
      paddingLeft: moderateScale(8),
      paddingRight: moderateScale(8),
      marginTop: moderateScaleVertical(5),
    },

    ///section list style
    tabBar: {
      backgroundColor: '#fff',
      borderBottomColor: '#f4f4f4',
      borderBottomWidth: 1,
    },
    tabContainer: {
      borderBottomColor: '#090909',
    },
    tabText: {
      padding: 15,
      color: '#9e9e9e',
      fontSize: 18,
      fontWeight: '500',
    },
    separator: {
      height: 0.5,
      width: '96%',
      alignSelf: 'flex-end',
      backgroundColor: '#eaeaea',
    },
    sectionHeaderContainer: {
      height: 10,
      backgroundColor: '#f6f6f6',
      borderTopColor: '#f4f4f4',
      borderTopWidth: 1,
      borderBottomColor: '#f4f4f4',
      borderBottomWidth: 1,
    },
    sectionHeaderText: {
      color: '#010101',
      backgroundColor: '#fff',
      fontSize: 23,
      fontWeight: 'bold',
      paddingTop: 25,
      paddingBottom: 5,
      paddingHorizontal: 15,
    },
    itemContainer: {
      paddingVertical: 20,
      paddingHorizontal: 15,
      backgroundColor: '#fff',
    },
    itemTitle: {
      flex: 1,
      fontSize: 20,
      color: '#131313',
    },
    itemPrice: {
      fontSize: 18,
      color: '#131313',
    },
    itemDescription: {
      marginTop: 10,
      color: '#b6b6b6',
      fontSize: 16,
    },
    itemRow: {
      flexDirection: 'row',
    },
    locTimeIcon: {
      tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.grayOpacity51,
    },
    horizontalLine: {
      width: '100%',
      borderBottomWidth: 0.5,
      borderBottomColor: isDarkMode
        ? colors.whiteOpacity22
        : colors.lightGreyBg,
    },
  });
