import moment from 'moment';
import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
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
import TextInputWithUnderlineAndLabel from '../../../Components/TextInputWithUnderlineAndLabel';
import {getColorCodeWithOpactiyNumber} from '../../../utils/helperFunctions';
import ModalView from '../../../Components/Modal';
import {CalendarList} from 'react-native-calendars';
import {Platform} from 'react-native';

export default function SelectTimeModalView({
  isLoading = false,
  availAbleTimes = [],
  date = new Date(),
  onPressBack,
  selectedAvailableTimeOption = null,
  selectAvailAbleTime,
  _selectTime,
  _onDateChange,
  isTimerPickerModal,
  formatedTime,
  isDatePickerModal,
  pickedUpTime,
  selectedDate,
  pickedUpDate,
  _pickerOpen = () => {},
  _modalOkPress = () => {},
  _pickerCancel = () => {},
  _onDayPress = () => {},
  scheduleDate,
  scheduleTime,
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
    console.log(value, 'OnDate');
    _onDateChange(value);
  };

  const pickerOpen = (value) => {
    _pickerOpen(value);
  };

  const pickerCancel = (value) => {
    _pickerCancel(value);
  };

  const _renderArrow = (direction) => {
    if (direction == 'left') {
      return (
        <Image
          source={imagePath.icgo3}
          style={{
            height: 25,
            width: 25,
            tintColor: themeColors.primary_color,
            transform: [{scaleX: -1}],
          }}
        />
      );
    } else {
      return (
        <Image
          source={imagePath.icgo3}
          style={{height: 25, width: 25, tintColor: themeColors.primary_color}}
        />
      );
    }
  };

  const onDayPress = (value) => {
    _onDayPress(value);
  };

  const modalOkPress = (value1, value2) => {
    _modalOkPress(value1, value2);
  };

  // console.log(moment().format('hh:mm A'), formatedTime, 'kdjhfjkhdsjh');

  const _calendarModalMainView = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.lightDark
          : colors.white,
      }}>
      <View
        style={{
          backgroundColor: themeColors.primary_color,
          paddingVertical: moderateScaleVertical(17),
        }}>
        <Text
          style={{
            textAlign: 'left',
            fontSize: textScale(18),
            color: colors.white,
            marginHorizontal: moderateScale(25),
          }}>
          {`${moment(selectedDate).format('ddd')} ${moment(selectedDate).format(
            'DD',
          )} ${moment(selectedDate).format('MMM')}`}
        </Text>
      </View>

      <CalendarList
        horizontal={true}
        pagingEnabled={true}
        calendarWidth={width - moderateScale(40)}
        calendarHeight={height / 2.6}
        renderArrow={_renderArrow}
        hideArrows={false}
        onDayPress={(value) => onDayPress(value)}
        minDate={new Date()}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: themeColors.primary_color,
          },
        }}
        theme={{
          calendarBackground: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : colors.white,
          dayTextColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          monthTextColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          textDisabledColor: isDarkMode ? colors.whiteOpacity22 : colors.greyA,
        }}
      />
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : colors.white,
          overflow: 'hidden',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => pickerCancel('isDatePickerModal')}>
          <Text
            style={{
              marginHorizontal: moderateScale(20),
              fontSize: textScale(14),
              color: isDarkMode ? colors.white : colors.black,
            }}>
            {strings.CANCEL}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => modalOkPress('isDatePickerModal', 'pickedUpDate')}
          style={{
            paddingHorizontal: moderateScale(23),
            paddingVertical: moderateScaleVertical(10),
            backgroundColor: themeColors.primary_color,
            marginHorizontal: moderateScale(20),
            borderRadius: 4,
          }}>
          <Text style={{color: colors.white, fontSize: textScale(14)}}>
            {strings.OK}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const _timeModalMainView = () => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        backgroundColor: getColorCodeWithOpactiyNumber(
          colors.black.substr(1),
          50,
        ),
      }}>
      <View
        style={{
          backgroundColor: themeColors.primary_color,
          paddingTop: moderateScaleVertical(20),
          overflow: 'hidden',
          borderRadius: 12,
        }}>
        <View style={{marginBottom: moderateScaleVertical(20)}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: textScale(18),
              color: colors.white,
            }}>
            {formatedTime}
          </Text>
        </View>

        <DatePicker
          date={Platform.OS === 'android' ? (date ? date : new Date()) : null}
          mode="time"
          textColor={isDarkMode ? colors.white : colors.blackB}
          // minimumDate={new Date()}
          style={{
            width: width / 1.1,
            height: height / 2.6,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
            alignSelf: 'center',
          }}
          onDateChange={(value) => onDateChange(value)}
        />
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
            paddingBottom: moderateScaleVertical(20),
            overflow: 'hidden',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => pickerCancel('isTimerPickerModal')}>
            <Text
              style={{
                marginHorizontal: moderateScale(20),
                fontSize: textScale(14),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.CANCEL}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => modalOkPress('isTimerPickerModal', 'pickedUpTime')}
            style={{
              paddingHorizontal: moderateScale(23),
              paddingVertical: moderateScaleVertical(10),
              backgroundColor: themeColors.primary_color,
              marginHorizontal: moderateScale(20),
              borderRadius: 4,
            }}>
            <Text style={{color: colors.white, fontSize: textScale(14)}}>
              {strings.OK}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
      <ScrollView showsVerticalScrollIndicator={false}>
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
              {strings.SCHEDULE_TRIP}
            </Text>
          </View>
          <View style={{flex: 0.2}}></View>
        </View>

        <View
          style={{
            marginHorizontal: moderateScale(20),
            paddingTop: moderateScaleVertical(50),
          }}>
          <TextInputWithUnderlineAndLabel
            value={pickedUpDate}
            label={strings.PICKUP_DATE}
            autoCapitalize={'none'}
            containerStyle={{marginVertical: moderateScaleVertical(10)}}
            txtInputStyle={{
              fontFamily: fontFamily.regular,
              opacity: 1,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
            undnerlinecolor={colors.textGreyB}
            labelStyle={{
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
            }}
            lableViewStyle={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            isLableIcon={true}
            // labelIconPath={imagePath.calendarB}
            labelIconStyle={{tintColor: themeColors.primary_color}}
            // onPressLabel={() => pickerOpen('isDatePickerModal')}
          />
          <TextInputWithUnderlineAndLabel
            value={pickedUpTime}
            label={strings.PICKUP_TIME}
            autoCapitalize={'none'}
            containerStyle={{marginVertical: moderateScaleVertical(10)}}
            txtInputStyle={{
              fontFamily: fontFamily.regular,
              opacity: 1,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
            undnerlinecolor={colors.textGreyB}
            labelStyle={{
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
            }}
            mainStyle={{marginTop: moderateScaleVertical(30)}}
            lableViewStyle={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            isLableIcon={true}
            // labelIconPath={imagePath.icTime}
            labelIconStyle={{tintColor: themeColors.primary_color}}
            // onPressLabel={() => pickerOpen('isTimerPickerModal')}
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
            btnText={strings.SCHEDULE}
          />
        </View>
      </ScrollView>
      <ModalView
        transparent={true}
        isVisible={isDatePickerModal}
        modalStyle={styles.modalContainer}
        mainViewStyle={styles.mainViewStyle}
        modalMainContent={_calendarModalMainView}
      />
      <ModalView
        transparent={true}
        isVisible={isTimerPickerModal}
        modalStyle={styles.modalContainer}
        mainViewStyle={styles.mainViewStyle}
        modalMainContent={_timeModalMainView}
      />
    </View>
  );
}
