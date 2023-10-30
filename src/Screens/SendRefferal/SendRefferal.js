import React, { useState } from 'react';
import { I18nManager, Image, Text, TouchableOpacity, View } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import actions from '../../redux/actions';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import { showError, showSuccess } from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFunc from './styles';
export default function SendRefferal({ navigation }) {
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
  const { phoneNumber, callingCode, cca2, name, email, isLoading, password } =
    state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { appData, appStyle } = useSelector((state) => state?.initBoot);
  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({ fontFamily });

  const _onCountryChange = (data) => {
    updateState({ cca2: data.cca2, callingCode: data.callingCode[0] });
    return;
  };
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };
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
      .sendRefferalCode(data, {
        code: appData.profile.code,
      })
      .then((res) => {
        console.log(res, 'res>>>');
        showSuccess(res?.message);
        updateState({ isLoading: false });
        // moveToNewScreen(navigationStrings.RESET_PASSWORD, {email: email})();
        navigation.goBack();
      })
      .catch((error) => {
        updateState({ isLoading: false });
        showError(error?.message || error?.error);
      });
  };

  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
  };

  return (
    <WrapperContainer isLoadingB={isLoading} source={loaderOne}>
      <View
        style={{
          height: moderateScaleVertical(60),
          paddingHorizontal: moderateScale(24),
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{ alignSelf: 'flex-start' }}>
          <Image
            source={imagePath.back}
            style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
          />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
        }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              marginTop: moderateScaleVertical(50),
              marginHorizontal: moderateScale(24),
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.header}>{strings.SENDREFFERAL}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                // justifyContent: 'center',
                // marginHorizontal: moderateScale(24),
              }}>
              <Text style={styles.txtSmall}>{`Hello, ${userData?.name}`}</Text>
            </View>
          </View>
          <View
            style={{
              marginTop: moderateScaleVertical(30),
              marginHorizontal: moderateScale(24),
            }}>
            <BorderTextInput
              onChangeText={_onChangeText('email')}
              placeholder={getBundleId() === appIds.qdelo ? strings.ENTER_FRIEND_EMAIL : strings.YOUR_EMAIL}
              value={email}
            />
            <GradientButton
              onPress={onForget}
              marginTop={moderateScaleVertical(10)}
              btnText={strings.SUBMIT}
            />
            {/* <PhoneNumberInput /> */}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
