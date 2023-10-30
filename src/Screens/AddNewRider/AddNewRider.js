import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import BorderTextInputWithLable from '../../Components/BorderTextInputWithLable';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import Modal from '../../Components/Modal';
import SearchBar from '../../Components/SearchBar';
import TextInputWithUnderlineAndLabel from '../../Components/TextInputWithUnderlineAndLabel';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import stylesFun from './styles';
import { getColorCodeWithOpactiyNumber, showError } from '../../utils/helperFunctions';
import actions from '../../redux/actions';
import validations from '../../utils/validations';


export default function AddNewRider({ navigation, route }) {
  const paramData = route?.params;
  console.log(paramData, "paramDataparamDataparamData");
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const userData = useSelector((state) => state?.auth?.userData);
  const { appData, allAddresss, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );

  const [state, setState] = useState({
    firstName: paramData?.contact?.name ? paramData?.contact?.name : '',
    lastName: paramData?.contact?.name ? paramData?.contact?.name : '',
    friendMobileNumber: paramData?.selectedPhone?.number ? paramData?.selectedPhone?.number : '',
    isLoading:false
  });
  const { firstName, lastName, friendMobileNumber,isLoading } = state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));


  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFun({
    fontFamily,
    themeColors,

  });


  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
  };



  const _onAddRider = () => {
    if (firstName == '') {
      showError(strings.PLEASE_ENTER_RIDER_FIRST_NAME)
      return
    }
    if (lastName == '') {
      showError(strings.PLEASE_ENTER_RIDER_LAST_NAME)
      return
    }
    if (friendMobileNumber == ''
    ) {   
      showError(strings.PLEASE_RIDER_MOBILE_NUMER)
      return
    }
    updateState({
      isLoading:true
    })

    const data = {
      first_name: firstName,
      last_name: lastName,
      phone_number: friendMobileNumber.replace(/\s+/g, '')
    }
    console.log(data,"data");
    actions.addRider(data, { code: appData?.profile?.code }).then((res) => {
      updateState({
        isLoading:false
      })
      navigation.goBack()
    }).catch(errorMethod)
  }

  const errorMethod = (error) => {
    updateState({ isLoading: false, isRefreshing: false });
    showError(error?.message || error?.error);
  };



  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.white
        // colors.white
      }
      statusBarColor={colors.white}
     isLoadingB={isLoading}
      source={loaderOne}>
      <View style={{ paddingHorizontal: moderateScale(20) }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: moderateScale(40),

            marginTop: moderateScaleVertical(20)
          }}>
          <TouchableOpacity
            style={{ flex: 0.5, flexDirection: 'row' }}
            onPress={() => navigation.goBack()}
            hitSlop={{
              top: 30,
              right: 30,
              left: 30,
              bottom: 30,
            }}>
            <Image
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
              source={imagePath.backArrowCourier}
            />
            <Text
              style={{
                fontSize: textScale(16),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                marginHorizontal: moderateScale(20)
              }}>
              {strings.NEW_RIDER}
            </Text>
          </TouchableOpacity>


        </View>


        <View style={[styles.messageMainContainer, { backgroundColor: getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 20) }]}>
          {paramData?.addNewRiderContact ? <Text style={{ fontFamily: fontFamily.regular, color: colors.blackLight, textAlign: 'left' }}>
            {strings.THIS_CONTACT_WILL_NOT_SAVE_IN_ADDRESS_BOOK}
          </Text> : <Text style={styles.messageText}>
            {strings.DRIVER_WILL_SEE_NAME}
            <Text style={{ fontFamily: fontFamily.regular, color: colors.blackLight }}>

              {strings.CHNAGING_THE_NAME_WILL_NOT_AFFECT_IN_YOUR_DEVICE_CONTACT}
            </Text>
          </Text>}
        </View>
        <TextInputWithUnderlineAndLabel
          onChangeText={_onChangeText('firstName')}
          label={'First Name'}
          value={firstName}
          containerStyle={styles.textInputContainer}
          undnerlinecolor={colors.textGreyB}
          labelStyle={{
            color: colors.black,
            fontSize: textScale(12),
          }}
          txtInputStyle={styles.textInputStyle}
          returnKeyType={'next'}
        />
        <TextInputWithUnderlineAndLabel
          onChangeText={_onChangeText('lastName')}
          label={'Last Name'}
          value={lastName}
          containerStyle={styles.textInputContainer}
          undnerlinecolor={colors.textGreyB}
          labelStyle={{
            color: colors.black,
            fontSize: textScale(12),
          }}
          txtInputStyle={styles.textInputStyle}
          returnKeyType={'next'}
        />
        <View>
          <Text style={styles.phoneNumberTextInputLabel}>{strings.PHONE_NUMBER}</Text>
          <View style={styles.phoneNumberInnerContainer}>
            <TextInputWithUnderlineAndLabel
              onChangeText={_onChangeText('friendMobileNumber')}
              value={friendMobileNumber}
              containerStyle={styles.phoneNumberInnput}
              undnerlinecolor={colors.textGreyB}
              labelStyle={{
                color: colors.black,
                fontSize: textScale(12),
              }}
              txtInputStyle={styles.textInputStyle}
              returnKeyType={'next'}
              keyboardType={'numeric'}
            />

          </View>
        </View>
        <GradientButton
          colorsArray={[
            themeColors.primary_color,
            themeColors.primary_color,
          ]}
          textStyle={{ textTransform: 'none', fontSize: textScale(16) }}
          onPress={_onAddRider}
          marginTop={moderateScaleVertical(30)}
          marginBottom={moderateScaleVertical(10)}
          btnText={strings.ADD_RIDER}
          btnStyle={{ borderRadius: moderateScale(4) }}
        />
      </View>
    </WrapperContainer>
  );
}
