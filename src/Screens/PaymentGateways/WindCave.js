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

export default function WindCave({ navigation, route }) {
    let paramsData = route?.params;
    console.log(paramsData, '===>paramsData');

    const { themeToggle, themeColor, appStyle, appData, currencies, languages } =
        useSelector((state) => state?.initBoot);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    const [state, setState] = useState({
        webUrl: '',
        isLoading: true,
    });

    //Update states on screens
    const updateState = (data) => setState((state) => ({ ...state, ...data }));
    const { webUrl, isLoading } = state;

    useEffect(() => {
        apiHit();
    }, []);

    const apiHit = async () => {
        let queryData = `/${paramsData?.selectedPayment?.code?.toLowerCase()}?amount=${paramsData?.total_payable_amount
            }&payment_option_id=${paramsData?.payment_option_id}&action=${paramsData?.redirectFrom
            }&order_number=${paramsData?.orderDetail?.order_number}`;

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
            console.log(res, 'propWindCave?>>>');
            updateState({ webUrl: res.data });
        } catch (error) {
            updateState({ isLoading: false });

            showError(error.message || error);
        }
    };
    const moveToNewScreen =
        (screenName, data = {}) =>
            () => {
                navigation.navigate(screenName, { data });
            };

    const onNavigationStateChange = (props) => {
        const { url } = props;
        const URL = queryString.parseUrl(url);
        const queryParams = URL.query;
        const nonQueryURL = URL.url;
        console.log(props, 'propsEaseBuzz');

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
    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.transparent}
            statusBarColor={colors.white}
            source={loaderOne}
            isLoadingB={isLoading}>
            <Header
                leftIcon={
                    appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                        ? imagePath.icBackb
                        : imagePath.back
                }
                centerTitle={
                    paramsData?.selectedPayment?.title || paramsData?.walletTip?.title
                }
                headerStyle={{ backgroundColor: colors.white }}
            />
            {webUrl !== '' && (
                <WebView
                    onLoad={() => updateState({ isLoading: false })}
                    source={{ uri: webUrl }}
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

const styles = StyleSheet.create({});
