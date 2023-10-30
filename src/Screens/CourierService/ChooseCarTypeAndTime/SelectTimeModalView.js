import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useSelector} from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../../styles/theme';

export default function SelectTimeModalView({
  isLoading = false,
  availAbleTimes = [],
  date = new Date(),
  onPressBack,
  selectedAvailableTimeOption = null,
  selectAvailAbleTime,
  _selectTime,
  _onDateChange,
  showBottomButton,
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;

  const onDateChange = (value) => {
    console.log(value, 'value');
    _onDateChange(value);
  };

  return (
    <View
      style={
        isDarkMode
          ? [
              styles.bottomView,
              {width: width, backgroundColor: MyDarkTheme.colors.background},
            ]
          : [styles.bottomView, {width: width}]
      }>
      <View style={{marginBottom: moderateScale(20)}}>
        <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingTop: moderateScale(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity style={{flex: 0.2}} onPress={onPressBack}>
            <Image
              style={isDarkMode && {tintColor: MyDarkTheme.colors.text}}
              source={imagePath.backArrowCourier}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 0.6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={
                isDarkMode
                  ? [styles.carType, {color: MyDarkTheme.colors.text}]
                  : styles.carType
              }>
              {strings.SELECTTIME}
            </Text>
          </View>
          <View style={{flex: 0.2}}></View>
        </View>
        <ScrollView
          horizontal={true}
          style={{
            paddingHorizontal: moderateScale(10),
            paddingTop: moderateScale(20),
          }}>
          {/* {availAbleTimes.map((i, inx) => {
            return (
              <TouchableOpacity
                onPress={() => selectAvailAbleTime(i)}
                style={{
                  marginLeft: 10,
                  width: width / 3.5,
                  borderWidth: 1,
                  backgroundColor:
                    selectedAvailableTimeOption?.id == i?.id
                      ? colors.lightBlueBackground
                      : colors.white,
                  borderColor:
                    selectedAvailableTimeOption?.id == i?.id
                      ? 'transparent'
                      : colors.lightGreyBorder,
                  paddingHorizontal: moderateScale(5),
                  paddingVertical: moderateScaleVertical(15),
                  borderRadius: moderateScale(12),
                  marginBottom: moderateScaleVertical(20),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.carType,
                    {
                      fontFamily: fontFamily.regular,
                      fontSize: textScale(14),
                    },
                  ]}>
                  {i.label}
                </Text>
              </TouchableOpacity>
            );
          })} */}
        </ScrollView>
        <View style={{alignItems: 'center', height: height / 3.5}}>
          <DatePicker
            date={date}
            mode="datetime"
            textColor={isDarkMode ? '#fff' : colors.blackB}
            minimumDate={new Date()}
            style={{width: width - 20, height: height / 3.5}}
            // onDateChange={setDate}
            onDateChange={(value) => onDateChange(value)}
          />
        </View>

        <View
          style={{
            marginVertical: moderateScaleVertical(20),
            marginHorizontal: moderateScale(20),
          }}>
          <GradientButton
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{textTransform: 'none', fontSize: textScale(16)}}
            onPress={_selectTime}
            marginTop={moderateScaleVertical(10)}
            marginBottom={moderateScaleVertical(10)}
            btnText={strings.CONFRIMPICKUPTIME}
          />
        </View>
      </View>
    </View>
  );
}
