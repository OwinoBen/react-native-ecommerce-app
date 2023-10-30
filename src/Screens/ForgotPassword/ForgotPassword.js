import React, {useState} from 'react';
import {I18nManager, Image, Text, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {showError, showSuccess} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFunc from './styles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import colors from '../../styles/colors';
import ButtonWithLoader from '../../Components/ButtonWithLoader';

export default function ForgotPassword({navigation}) {
  const theme = useSelector(state => state?.initBoot?.themeColor);
  const toggleTheme = useSelector(state => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: false,
    callingCode: '1',
    cca2: 'US',
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    deviceToken: '',
  });
  const {email, isLoading} = state;
  const updateState = data => setState(state => ({...state, ...data}));
  const {appData, appStyle} = useSelector(state => state?.initBoot || {});

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});

  const _onCountryChange = data => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };
  const moveToNewScreen = (screenName, data) => () => {
    return navigation.navigate(screenName, {data});
  };

  //Validated form
  const isValidData = () => {
    const error = validations({
      email: email,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };
  //Forget password api
  const onForget = () => {
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    let data = {
      email: email,
    };
    updateState({isLoading: true});
    actions
      .forgotApi(data, {
        code: appData.profile.code,
      })
      .then(res => {
        showSuccess(res.success);
        updateState({isLoading: false});

        // moveToNewScreen(navigationStrings.RESET_PASSWORD, {email: email})();
        moveToNewScreen(navigationStrings.LOGIN)();
      })
      .catch(error => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  //On change in textinput field
  const _onChangeText = key => val => {
    updateState({[key]: val});
  };

  return (
    <WrapperContainer
      isLoading={isLoading}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      <View style={styles.mainView}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{alignSelf: 'flex-start'}}>
          <Image
            source={
              appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.icBackb
                : imagePath.back
            }
            style={
              isDarkMode
                ? {
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    tintColor: MyDarkTheme.colors.text,
                  }
                : {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}
            }
          />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
        }}>
        <View style={{flex: 1}}>
          <View style={{marginTop: moderateScaleVertical(50)}}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text
                style={
                  isDarkMode
                    ? [styles.header, {color: MyDarkTheme.colors.text}]
                    : styles.header
                }>
                {strings.FORGOT_PASSWORD}
              </Text>
            </View>

            <View style={styles.forgetDesc}>
              <Text
                style={
                  isDarkMode
                    ? [styles.txtSmall, {color: MyDarkTheme.colors.text}]
                    : styles.txtSmall
                }>
                {strings.FORGOT_DESCRIPTION}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: moderateScaleVertical(50),
              marginHorizontal: moderateScale(24),
            }}>
            <BorderTextInput
              onChangeText={_onChangeText('email')}
              placeholder={strings.YOUR_EMAIL}
              value={email}
              keyboardType={'email-address'}
            />
            {/*
            <ButtonWithLoader
              btnText={strings.FORGOT_PASSWORD}
              btnStyle={{ marginTop: moderateScaleVertical(10) }}
              onPress={onForget}
            /> */}

            <GradientButton
              onPress={onForget}
              marginTop={moderateScaleVertical(10)}
              btnText={strings.FORGOT_PASSWORD}
            />
            {/* <PhoneNumberInput /> */}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
