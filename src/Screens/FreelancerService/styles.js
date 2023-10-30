
import { StyleSheet, Text, View } from 'react-native'
import { moderateScale, moderateScaleVertical, textScale } from '../../styles/responsiveSize'
import colors from '../../styles/colors';


export default ({ themeColors, fontFamily, isDarkMode }) =>
      StyleSheet.create({
            mainView: {
                  marginTop: moderateScale(30),
                  paddingHorizontal: moderateScale(24),
                  marginBottom: moderateScaleVertical(9),
                  flexDirection: 'row'
            },
            timeView: {

                  marginBottom: moderateScaleVertical(16),
                  flexDirection: 'row'
            },
            dateView: {
                  backgroundColor: colors.lightGray
                  , padding: moderateScale(24),
                  marginHorizontal: moderateScale(24),
                  marginTop: moderateScaleVertical(18)
            },
            datePickerView: {
                  backgroundColor: colors.lightGray,
                  paddingLeft: moderateScale(24),
                  paddingRight: moderateScale(10),
                  paddingVertical: moderateScale(14),
                  paddingHorizontal: moderateScale(24),
                  marginHorizontal: moderateScale(24),
                  marginTop: moderateScaleVertical(18)
            },
            pickerStyle: {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
            },
            pickerView: {
                  width: moderateScale(180),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: moderateScale(4),
                  borderWidth: 0.5,
                  borderColor: colors.textGreyB,
                  padding: moderateScale(6),
            },
            secondPicker: {
                  borderColor: colors.black,
                  height: moderateScaleVertical(38),
                  width: moderateScale(116),
                  borderWidth: 0.3,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  justifyContent: 'space-evenly'
            },
            birthText: {
                  marginLeft: textScale(12)
            },
            timePickerView: {
                  flexDirection: 'row',

                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: moderateScale(14)
            },
            btnStyle: {
                  marginHorizontal: moderateScale(24),
                  marginTop: moderateScale(20),
                  marginBottom: moderateScale(5)
            },
            calenderView: {
                  flex: 1,
                  backgroundColor: colors.white,
                  padding: 32,
                  paddingHorizontal: moderateScale(20),
            },
            selectDate: {

                  width: moderateScale(32),
                  height: moderateScale(32),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: moderateScale(16),
            },
            monthView: {
                  justifyContent: 'center',
                  alignItems: 'center'
            },
            yearView: {
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(14),
                  color: colors.black,
            },
            calenderBtn: {
                  marginTop: moderateScale(24)
            },
            addressStyle: {
                  borderColor: colors.black,
                  flex: 0.6,
                  height: moderateScaleVertical(38),
                  borderWidth: 0.5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  justifyContent: 'space-evenly'
            },
            addressView: {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: moderateScale(14)
            },
            timeStyle: {
                  borderColor: colors.black,
                  height: moderateScaleVertical(38),
                  width: moderateScale(90),
                  borderWidth: 0.5,
                  flexDirection: 'row',

                  alignItems: 'center',
                  justifyContent: 'center',
                  justifyContent: 'space-evenly',
                  flexDirection: 'row'
            },
            textStyleTime: {
                  fontSize: textScale(12),
                  marginHorizontal: moderateScale(5),
                  fontFamily: fontFamily.medium,
                  color: colors.black,
            },
            imageStyle: {
                  height: moderateScaleVertical(12),
                  width: moderateScale(12),
                  tintColor: themeColors.primary_color,
            }
      })
