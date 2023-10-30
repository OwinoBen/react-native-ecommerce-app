import React, {useState} from 'react';
import {Alert} from 'react-native';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import stylesFun from './styles';
import queryString from 'query-string';
import actions from '../../redux/actions';

export default function WebPayment({navigation, route}) {
  const paramData = route?.params;
  console.log(paramData, 'paramData>>>');
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

  console.log('paramData', paramData);

  const onNavigationStateChange = (navState) => {
    console.log(navState,"navState>>>UPDATE");
    const URL = queryString.parseUrl(navState.url);
    const queryParams = URL.query;
    const nonQueryURL = URL.url;
    console.log('state change query', queryParams);
    let transId = '';
    if (
      navState.canGoBack &&
      navState.url.includes('payment/checkoutSuccess')
    ) {
      if (navState.url.includes('payment/checkoutSuccess')) {
        transId = navState.url.substring(navState.url.lastIndexOf('/') + 1);
      } else {
        transId = queryParams?.transaction_id;
      }
      if (paramData?.redirectFrom == 'cart') {
        navigation.navigate(navigationStrings.CART, {
          redirectFrom: 'cart',
          transactionId: transId,
          selectedAddressData: paramData?.selectedAddressData,
          selectedPayment: paramData?.selectedPayment,
        });
        return;
      }
      if (paramData?.redirectFrom == 'tip') {
        actions
          .tipAfterOrder(
            {
              tip_amount: paramData?.tip_amount,
              order_number: paramData?.order_number,
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
            updateState({isLoading: false});
            if (res && res?.status == 'Success' && res?.data) {
              navigation.navigate(navigationStrings.ORDER_DETAIL);
            }
          })
          .catch((error) => {
            console.log('error riased', error);
          });
      }
      if (paramData?.redirectFrom == 'subscription') {
        if (queryParams.status == '200') {
          subscriptionApiHit(queryParams.transaction_id);
        } else {
          navigation.navigate(navigationStrings.SUBSCRIPTION);
        }
      } else {
        setTimeout(() => {
          alert(strings.PAYMENT_SUCCESS);
          navigation.navigate(navigationStrings.WALLET);
        }, 2000);
      }
    }
    // const { url } = props;
    // const URL = queryString.parseUrl(url);
    // const queryParams = URL.query;
    // const nonQueryURL = URL.url;
    // console.log(props, 'propsMobbex');
    // console.log("queryParams",queryParams)
    // console.log("nonQueryURL",url.replace(`${nonQueryURL}?`, ''))
    // return;
  };

  const subscriptionApiHit = id => {
    actions
      .purchaseSubscriptionPlan(
        `/${paramData?.selectedPlanSlug}`,
        {
          payment_option_id: paramData?.selectedPaymentMethod?.id,
          transaction_id: id,
          // amount: selectedPlan?.id,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then(res => {
        console.log('subscription res', res);
        navigation.navigate(navigationStrings.SUBSCRIPTION);
      })
      .catch((error) => {
        console.log('error rraised', error);
      });
  };
  console.log(paramData,"paramData");

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.white}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5 ? imagePath.icBackb : imagePath.back
        }
        centerTitle={paramData?.paymentTitle || ''}
        headerStyle={{backgroundColor: Colors.white}}
      />
      <View style={{...commonStyles.headerTopLine}} />
      <WebView
        source={{uri: paramData?.paymentUrl}}
        onNavigationStateChange={onNavigationStateChange}

        // onNavigationStateChange={(navState) => {
        //   console.log(navState, 'webProps');

        // }}
      />
    </WrapperContainer>
  );
}
