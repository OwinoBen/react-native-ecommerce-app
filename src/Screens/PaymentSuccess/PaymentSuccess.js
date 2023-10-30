import React, {useState} from 'react';
import {Image, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import ButtonComponent from '../../Components/ButtonComponent';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import stylesFunc from './styles';
export default function PaymentSuccess({navigation, route}) {
  const currentTheme = useSelector((state) => state.appTheme);
  const {appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const [state, setState] = useState({});
  const {} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {themeColors, themeLayouts} = currentTheme;

  const trackOrder = () => {
    navigation.navigate(navigationStrings.TRACKING);
  };
  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}>
      <KeyboardAwareScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: moderateScaleVertical(20)}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(navigationStrings.DELIVERY);
          }}>
          <Image source={imagePath.cross} />
        </TouchableOpacity>
        <View style={styles.doneIconView}>
          <Image
            source={imagePath.successfulIcon}
            style={{marginBottom: moderateScaleVertical(30)}}
          />
          <Text style={styles.requestSubmitText}>
            {strings.REQUEST_SUBMITTED}
          </Text>
          <Text style={styles.successfully}>{strings.SUCCESSFULLY}</Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginVertical: moderateScaleVertical(50),
          }}>
          <Text style={styles.yourAWBText}>Your AWB number is 259856</Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginBottom: moderateScaleVertical(20),
          }}>
          <ButtonComponent
            btnText={strings.TRACK_ORDER}
            onPress={trackOrder}
            textStyle={{color: colors.textBlue}}
            borderRadius={moderateScale(13)}
            containerStyle={{
              backgroundColor: 'rgba(67,162,231,0.3)',
              width: width / 1.2,
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
