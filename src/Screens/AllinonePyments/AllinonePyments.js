import queryString from 'query-string';
import React from 'react';
import {View} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {WebView} from 'react-native-webview';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {moderateScaleVertical} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';

export default function AllinonePyments({navigation, route}) {
  let paramsData = route?.params?.data || {};
  const {themeToggle, themeColor, appStyle, currencies, languages, appData} =
    useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  console.log(paramsData, '===>paramsData');

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const onNavigationStateChange = (props) => {
    const {url} = props;
    const URL = queryString.parseUrl(url);
    const queryParams = URL.query;
    const nonQueryURL = URL.url;
    console.log(props, 'returnURL');
    console.log('query params', queryParams);
    console.log('query paramsurl', URL);
    console.log('query paramsurl', url);
    let transId = '';
    if (url.includes('payment/checkoutSuccess')) {
      //in case of paypal
      transId = url.substring(url.lastIndexOf('/') + 1);
    } else {
      transId =
        queryParams?.transaction_id ||
        queryParams?.subscription_id ||
        queryParams?.TransID;
    }
    setTimeout(() => {
      if (
        queryParams?.status == 200 ||
        url.includes('payment/checkoutSuccess')
      ) {
   
        if (paramsData?.action == 'cart') {
          moveToNewScreen(navigationStrings.ORDERSUCESS, {
            orderDetail: {
              order_number: queryParams.order,
              id: paramsData?.orderDetail?.id,
            },
          })();
          return;
        }
        if (paramsData.action == 'tip') {
          if (paramsData?.id != 6) {
            tipAfterOrder(transId);
            return;
          } else {
            moveToNewScreen(paramsData?.screenName)();
          }
        }
        if (paramsData?.action == 'subscription') {
          console.log(transId, 'transId>transId');
          //Payfast(6), Paystack(6), FPX(19) // Cashfree(24)
          if (
            paramsData?.id != 6 &&
            paramsData?.id != 5 &&
            paramsData?.id != 19 &&
            paramsData?.id != 24
          ) {
            subscriptionApiHit(transId);
            return;
          } else {
            moveToNewScreen(paramsData?.screenName)();
          }
        }
        if (paramsData.action == 'wallet') {
          moveToNewScreen(paramsData?.screenName)();
        }
      } else if (queryParams?.status == 0) {
        if (paramsData?.action == 'cart') {
          moveToNewScreen(navigationStrings.CART, {
            queryURL: url.replace(`${nonQueryURL}?`, ''),
          })();
        } else {
          moveToNewScreen(paramsData?.screenName)();
        }
      }
    }, 1500);
  };

  const tipAfterOrder = (transId) => {
    actions
      .tipAfterOrder(
        {
          tip_amount: paramsData?.tip_amount,
          order_number: paramsData?.order_number,
          transaction_id: transId,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('tip res++++++', res);
        // updateState({ isLoading: false });
        if (res && res?.status == 'Success' && res?.data) {
          navigation.navigate(navigationStrings.ORDER_DETAIL);
        }
      })
      .catch((error) => {
        console.log('error riased', error);
      });
  };

  const subscriptionApiHit = (id) => {
    console.log(paramsData?.selectedPlanSlug, 'paramsData?.selectedPlanSlug');
    actions
      .purchaseSubscriptionPlan(
        `/${paramsData?.selectedPlanSlug}`,
        {
          payment_option_id: paramsData?.id,
          transaction_id: id,
          // amount: selectedPlan?.id,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('subscription res', res);
        navigation.navigate(navigationStrings.SUBSCRIPTION);
      })
      .catch((error) => {
        console.log('error rraised', error);
      });
  };
  console.log(paramsData, 'paramsData?.paymentUrlparamsData?.paymentUrl');
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.transparent}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={false}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={paramsData?.selectedPayment?.title || paramsData?.title}
        headerStyle={{backgroundColor: colors.white}}
      />
      {!!paramsData?.paymentUrl &&
      paramsData?.id != 6 &&
      paramsData?.id != 36 ? (
        <WebView
          // onLoad={() => updateState({ isLoading: false })}
          source={{uri: paramsData?.paymentUrl}}
          onNavigationStateChange={onNavigationStateChange}
        />
      ) : (
        <WebView
          // onLoad={() => updateState({ isLoading: false })}
          source={{
            uri: paramsData?.paymentUrl?.redirectUrl,
            method: 'POST',
            body: queryString.stringify(paramsData?.paymentUrl?.formData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          }}
          onNavigationStateChange={onNavigationStateChange}
        />
        // <></>
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
