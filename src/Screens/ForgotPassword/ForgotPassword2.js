import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import AutoUpLabelTxtInput from '../../Components/AutoUpLabelTxtInput';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import { showError, showSuccess } from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFunc from './styles';

export default function ForgotPassword2({ navigation }) {
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
  const { email, isLoading } = state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { appData, appStyle } = useSelector((state) => state?.initBoot || {});

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily });

  const _onCountryChange = (data) => {
    updateState({ cca2: data.cca2, callingCode: data.callingCode[0] });
    return;
  };
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
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
    updateState({ isLoading: true });
    actions
      .forgotApi(data, {
        code: appData.profile.code,
      })
      .then((res) => {
        showSuccess(res.success);
        updateState({ isLoading: false });
        console.log(res, 'forget password responses ');
        moveToNewScreen(navigationStrings.RESET_PASSWORD, { email: email })();
      })
      .catch((error) => {
        updateState({ isLoading: false });
        showError(error?.message || error?.error);
      });
  };

  //On change in textinput field
  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
  };

  return (
    <WrapperContainer isLoading={isLoading}>
      <Header
        leftIcon={imagePath.backArrow}
        centerTitle={strings.FORGOT_PASSWORD}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
        }}>
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: moderateScaleVertical(130) }}>
            <View style={styles.forgetDesc}>
              <Text style={styles.txtSmall}>{strings.FORGOT_DESCRIPTION}</Text>
            </View>
          </View>
          <View
            style={{
              marginTop: moderateScaleVertical(50),
              marginHorizontal: moderateScale(24),
            }}>
            <AutoUpLabelTxtInput
              value={email}
              label={strings.YOUR_EMAIL}
              onChangeText={_onChangeText('email')}
              keyboardType={'email-address'}
              containerStyle={{ marginBottom: moderateScale(20) }}
            />

            {/* <ButtonWithLoader
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
