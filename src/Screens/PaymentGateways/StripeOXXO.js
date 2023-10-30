import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { moderateScaleVertical } from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { showError } from '../../utils/helperFunctions';
import Header from '../../Components/Header';
import imagePath from '../../constants/imagePath';


// PARAMS
// action, (cart, wallet, tip, subscription)
// amount,
// order_number, (in case of cart or tip)
// address_id, (in case of cart)
// subscription_id (subscription slug in case of subscription)
// user_id

const StripeOXXO = ({ navigation, route }) => {
    let paramsData = route?.params;
    console.log(paramsData, '===>paramsData');

    const { themeToggle, themeColor, appStyle, appData, currencies, languages } = useSelector((state) => state?.initBoot);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    const [state, setState] = useState({
        webUrl: '',
        isLoading: true,
    });

    //Update states on screens
    const updateState = (data) => setState((state) => ({ ...state, ...data }));
    const { webUrl, isLoading } = state;
    console.log(webUrl, "weburllll")
    useEffect(() => {
        apiHit();
    }, []);

    const moveToNewScreen =
        (screenName, data = {}) =>
            () => {
                navigation.navigate(screenName, { data });
            };

    const apiHit = async () => {
        let address_id = paramsData?.orderDetail?.address_id !== null ? paramsData?.orderDetail?.address_id :""
        let queryData = `/${paramsData?.selectedPayment?.code?.toLowerCase()}?amount=${paramsData?.total_payable_amount
            }&payment_option_id=${paramsData?.payment_option_id}&action=cart&order_number=${paramsData?.orderDetail?.order_number}&address_id=${address_id}`;
        console.log(queryData, "queryData")
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
            console.log(res, 'responseFPX');
            updateState({ webUrl: res.data, isLoading: false });
        } catch (error) {
            updateState({ isLoading: false });

            showError(error.message || error);
        }
    };


    const onNavigationStateChange = (props) => {
        const { url } = props;
        const URL = queryString.parseUrl(url);

        const queryParams = URL?.query;
        console.log(queryParams, "urllll")
        const nonQueryURL = URL?.url;
        console.log(props, 'propsFPX');

        setTimeout(() => {
            if (queryParams.status == 200) {
                moveToNewScreen(navigationStrings.ORDERSUCESS
                    , {
                        orderDetail: {
                            order_number: queryParams?.order,
                            id: paramsData?.orderDetail?.id,
                        },
                    }
                )();
            }
            if (queryParams.status == 0) {
                moveToNewScreen(navigationStrings.CART, {
                    queryURL: url.replace(`${nonQueryURL}?`, ''),
                })();
            }
        }, 2000);
    };

    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
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
            {webUrl !== '' && (
                <WebView
                    showsVerticalScrollIndicator={false}
                    onLoad={() => updateState({ isLoading: false })}
                    source={{ uri: webUrl }}
                    onNavigationStateChange={onNavigationStateChange}
                    androidLayerType="software"
                    style={{
                        backgroundColor: colors.white,
                        opacity: 0.99,
                        overflow: 'hidden'
                    }}
                    screenOptions={{
                        animationEnabled: Platform.select({
                            ios: true,
                            android: false,
                        })
                    }}
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
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default StripeOXXO;
