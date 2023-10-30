import queryString from 'query-string';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {WebView} from 'react-native-webview';
import {useSelector} from 'react-redux';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {moderateScaleVertical} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import Header from '../../Components/Header';
import imagePath from '../../constants/imagePath';

export default function Yoco({navigation, route}) {
  let paramsData = route?.params;
  const {themeToggle, themeColor, appStyle, appData, currencies, languages} =
    useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const [state, setState] = useState({
    webUrl: '',
    isLoading: true,
  });

  //Update states on screens
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {webUrl, isLoading} = state;

  useEffect(() => {
    if (!!paramsData?.walletTip) {
      //pay via wallet or tip
      console.log(paramsData?.walletTip.paymentUrl, '===>paramsData');
      updateState({
        webUrl: paramsData?.walletTip.paymentUrl,
        isLoading: false,
      });
      return;
    }
    console.log(paramsData, '===>paramsData');
    apiHit(); //pay via cart
  }, []);

  const apiHit = async () => {
    let queryData = `/${paramsData?.selectedPayment?.title?.toLowerCase()}?amount=${
      paramsData?.total_payable_amount
    }&payment_option_id=${
      paramsData?.payment_option_id
    }&action=${paramsData?.redirectFrom}&order_number=${paramsData?.orderDetail?.order_number}`;
    console.log(queryData, 'queryData');
    try {
      const res = await actions.openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      );
      console.log(res, 'responseYoco');
      updateState({webUrl: res.data});
    } catch (error) {
      updateState({isLoading: false});
      console.log(error, 'errorerror');
      showError(error?.message || error);
    }
  };

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const onNavigationStateChange = (props) => {
    console.log(props, 'propspropsprops');
    const {url} = props;
    const URL = queryString.parseUrl(url);
    const queryParams = URL.query;
    const nonQueryURL = URL.url;
    // return;
    setTimeout(() => {
      if (queryParams.status == 200) {
        if (!!paramsData?.walletTip) {
          moveToNewScreen(paramsData?.walletTip?.screenName)();
          return;
        }
        moveToNewScreen(navigationStrings.ORDERSUCESS, {
          orderDetail: {
            order_number: queryParams.order,
            id: paramsData?.orderDetail?.id,
          },
        })();
      } else if (queryParams.status == 0) {
        if (!!paramsData?.walletTip) {
          moveToNewScreen(paramsData?.walletTip?.screenName)();
          return;
        }
        moveToNewScreen(navigationStrings.CART, {
          queryURL: url.replace(`${nonQueryURL}?`, ''),
        })();
      }
    }, 1500);
  };
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
        headerStyle={{backgroundColor: colors.white}}
      />
      {webUrl !== '' && (
        <WebView
          onLoad={() => updateState({isLoading: false})}
          source={{uri: webUrl}}
          onNavigationStateChange={onNavigationStateChange}
        />
      )}
      <View
        style={{
          height: moderateScaleVertical(75),
          backgroundColor: colors.transparent,
        }}
      />
    </WrapperContainer>
  );
}
