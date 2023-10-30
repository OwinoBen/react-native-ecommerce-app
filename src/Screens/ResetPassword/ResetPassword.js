import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View, I18nManager} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
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
export default function ResetPassword({navigation, route}) {
  const [state, setState] = useState({
    isLoading: false,
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {appData, appStyle} = useSelector((state) => state?.initBoot || {});

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});

  const {data} = route.params;

  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };
  const isValidData = () => {
    const error = validations({
      otp: otp,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const onResetPassword = () => {
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    let dataSend = {
      email: data.email,
      otp: otp,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };
    updateState({isLoading: true});
    actions
      .resetPassword(dataSend, {
        code: appData.profile.code,
      })
      .then((res) => {
        showSuccess(res.success);
        updateState({isLoading: false});
        moveToNewScreen(navigationStrings.LOGIN, {})();
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  const {newPassword, confirmPassword, isLoading, otp} = state;
  return (
    <WrapperContainer isLoadingB={isLoading}>
      <View
        style={{
          height: moderateScaleVertical(60),
          paddingHorizontal: moderateScale(24),
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{alignSelf: 'flex-start'}}>
          <Image
            source={
              appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.icBackb
                : imagePath.back
            }
            style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
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
            <Text style={styles.header}>{strings.RESET_PASSWORD}</Text>
            <Text style={styles.txtSmall}>
              {strings.RESET_PASSWORD_DESCRIPTION}
            </Text>
          </View>
          <View
            style={{
              marginTop: moderateScaleVertical(50),
              marginHorizontal: moderateScale(24),
            }}>
            <BorderTextInput
              onChangeText={_onChangeText('otp')}
              placeholder={strings.ENTER_OTP_EMAIL}
              value={otp}
            />

            <BorderTextInput
              onChangeText={_onChangeText('newPassword')}
              placeholder={strings.ENTER_NEW_PASS}
              value={newPassword}
              secureTextEntry={true}
            />

            <BorderTextInput
              onChangeText={_onChangeText('confirmPassword')}
              placeholder={strings.ENTER_CONFIRM_PASS}
              value={confirmPassword}
              secureTextEntry={true}
            />

{/* <ButtonWithLoader
              btnText={strings.RESET_PASSWORD}
              btnStyle={{ marginTop: moderateScaleVertical(10) }}
              onPress={onResetPassword}
            /> */}
            <GradientButton
              onPress={onResetPassword}
              marginTop={moderateScaleVertical(10)}
              btnText={strings.RESET_PASSWORD}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
