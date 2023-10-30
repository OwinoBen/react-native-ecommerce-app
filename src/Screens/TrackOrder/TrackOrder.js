import React, {useState} from 'react';
import {View} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import {WebView} from 'react-native-webview';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import { MyDarkTheme } from '../../styles/theme';
import stylesFun from './styles';

export default function WebPayment({navigation, route}) {
  const paramData = route?.params;
  console.log(paramData, 'paramData>>>');
  const [state, setState] = useState({});
  //update your state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data
  const {appData, themeColors, appStyle, currencies, languages,themeColor} = useSelector(
    (state) => state?.initBoot,
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey}
      statusBarColor={colors.white}>
      <Header
        leftIcon={imagePath.back}
        centerTitle={paramData?.paymentTitle || ''}
        headerStyle={{backgroundColor:isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey}}
      />
      <View style={{...commonStyles.headerTopLine}} />
    </WrapperContainer>
  );
}
