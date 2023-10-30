import React from 'react';
import {View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useSelector} from 'react-redux';
import commonStylesFun from '../../styles/commonStyles';
import {height, width} from '../../styles/responsiveSize';
import stylesFun from './styles';
import Modal from 'react-native-modal';
import colors from '../../styles/colors';

export default function DateAndTimeModal({
  isLoading = false,
  isVisible = false,
  availAbleTimes = [],
  date = new Date(),
  onPressBack,
  selectedAvailableTimeOption = null,
  selectAvailAbleTime,
  _selectTime,
  _onDateChange,
  openTimeAndDateOption = 'date',
}) {
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
    <Modal
      transparent={true}
      isVisible={isVisible}
      animationType={'none'}
      onBackdropPress={_selectTime}
      onBackButtonPress={_selectTime}
      style={styles.modalContainer}>
      <View style={{backgroundColor: colors.white, height: height / 3.5}}>
        <DatePicker
          date={date}
          mode={openTimeAndDateOption == 'date' ? 'date' : 'time'}
          minimumDate={new Date()}
          style={{width: width - 20, height: height / 3.5}}
          // onDateChange={setDate}
          onDateChange={(value) => onDateChange(value)}
        />
      </View>
    </Modal>
  );
}
