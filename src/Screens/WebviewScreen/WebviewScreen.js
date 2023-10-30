import React, {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {WebView} from 'react-native-webview';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {moderateScale} from '../../styles/responsiveSize';
import stylesFun from './styles';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function WebviewScreen({navigation, route}) {
  const paramData = route?.params;
  const [state, setState] = useState({});
  //update your state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  console.log(paramData, 'paramDataparamData');
  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.white}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 3  || appStyle?.homePageLayout === 5? imagePath.icBackb : imagePath.back
        }
        centerTitle={paramData?.title || ''}
        headerStyle={{backgroundColor: colors.white}}
      />
      <View style={{...commonStyles.headerTopLine}} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <WebView source={{uri: paramData?.url}} />
        <View style={{height: moderateScale(40)}} />
      </ScrollView>
    </WrapperContainer>
  );
}
