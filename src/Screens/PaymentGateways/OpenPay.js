import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { height, moderateScaleVertical } from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import Header from '../../Components/Header';
import imagePath from '../../constants/imagePath';
import { showError } from '../../utils/helperFunctions';

export default function OpenPay({ navigation, route }) {
  let paramsData = route?.params;
  console.log(paramsData, '===>paramsData');

  const { themeToggle, themeColor, appStyle, appData, currencies, languages } =
    useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const [state, setState] = useState({
    webData: '',
    isLoading: true,
  });

  //Update states on screens
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { webData, isLoading } = state;

  useEffect(() => {
    apiHit();
  }, []);
  
  
//Error handling in screen
const errorMethod = (error) => {
  console.log(error, 'erro>>>>>>errorerrorr');
  // setLoadingAddons(false);
  updateState({
    isLoading: false,
   
  });
  showError(error?.message || error?.error);
};
const error=(error)=>{
  updateState({
    isLoading:false
  })
  setTimeout(()=>{
    Alert.alert('', error?.message, [
   
      {text: 'OK', onPress: () => navigation.navigate(navigationStrings.CART)},
    ]);
  },1000)
}
  const apiHit = async () => {
    let queryData = `/${paramsData?.selectedPayment?.code?.toLowerCase()}?amount=${paramsData?.total_payable_amount
      }&payment_option_id=${paramsData?.payment_option_id
      }&action=${paramsData?.redirectFrom}&order_number=${paramsData?.orderDetail?.order_number}`;
       actions.openPaymentWebUrl(queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        }).then(
          (res)=>{
            console.log(res,"apiHit>openPay>res");
            if(res.status==="error"){
              error(res)
            }
          updateState({ webData: res?.data });
          }
          
        ).catch(errorMethod) 
      
  };

  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

      const onNavigationStateChange = (props) => {
        const {url} = props;
        const URL = queryString.parseUrl(url);
        const queryParams = URL.query;
        const nonQueryURL = URL.url;
        console.log(url, 'propsMobbex');
    
        setTimeout(() => {
          if (queryParams.status == 200) {
            moveToNewScreen(navigationStrings.ORDERSUCESS, {
              orderDetail: {
                order_number: queryParams.order,
                id: paramsData?.orderDetail?.id,
              },
            })();
          }
          if (queryParams.status == 0) {
            moveToNewScreen(navigationStrings.CART, {
              queryURL: url.replace(`${nonQueryURL}?`, ''),
            })();
          }
        }, 3000);
      };

  console.log(isLoading, 'isLoadingisLoadingisLoading');
console.log(webData,"webDataaaaaa")
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.transparent}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5 ? imagePath.icBackb : imagePath.back
        }
        centerTitle={
          paramsData?.selectedPayment?.title || paramsData?.walletTip?.title
        }
        headerStyle={{ backgroundColor: colors.white }}
      />
      
      {webData !== '' && (
        <WebView
          showsVerticalScrollIndicator={false}
          source={{
            uri: webData,
            
          }}
          onNavigationStateChange={onNavigationStateChange}
          onLoad={() => updateState({ isLoading: false })}
        />
      )}
      <View 
       style={{
        height:moderateScaleVertical(30)
       }}
      />

     
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({});
