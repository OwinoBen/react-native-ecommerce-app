//import liraries
import {
    CardField,
    StripeProvider,
    createPaymentMethod,
    createToken,
    handleNextAction,
} from '@stripe/stripe-react-native';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import GradientButton from '../../../Components/GradientButton';
import OoryksHeader from '../../../Components/OoryksHeader';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
    moderateScale,
    moderateScaleVertical,
    textScale,
} from '../../../styles/responsiveSize';
import { showError } from '../../../utils/helperFunctions';
import { MyDarkTheme } from '../../../styles/theme';
import { useDarkMode } from 'react-native-dynamic';

// create a component
const P2pPayment = ({ navigation, route, item }) => {
    const paramData = route?.params?.data?.data;
    const bottomSheetRef = useRef(null);

    const { appData, currencies, languages, appStyle, themeColors, themeToggle, themeColor } = useSelector(
        state => state?.initBoot,
    );
    const { reloadData } = useSelector(state => state?.reloadData || {});
    const { selectedAddress } = useSelector(state => state?.cart || {});
    const { dineInType, location } = useSelector(state => state?.home);
    const { preferences } = appData?.profile;
    const fontFamily = appStyle?.fontSizeData;
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const styles = stylesFunc({ fontFamily });

    const moveToNewScreen =
        (screenName, data = {}) =>
            () => {
                navigation.navigate(screenName, { data });
            };

    const headers = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
    };

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [opensheet, setOpensheet] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState({
        code: 'cod',
        credentials: '{"cod_min_amount": "1"}',
        id: 1,
        off_site: 0,
        title: 'Cash On Delivery',
        title_lng: 'Cash On Delivery',
    });
    const [paymentMethodId, setPaymentMethodId] = useState(null);
    const [cardInfo, setCardInfo] = useState(null);
    const [tokenInfo, setTokenInfo] = useState(null);
    const [isPlaceOrderLoading, setisPlaceOrderLoading] = useState(false);

    //Error handling in screen
    const errorMethod = error => {
        console.log(error, '<==errorOccurred');
        setisPlaceOrderLoading(false);
        showError(
            error?.error?.description ||
            error?.description ||
            error?.message ||
            error?.error ||
            error,
        );
    };

    useEffect(() => {
        getListOfPaymentMethod();
    }, []);

    //Get list of all payment method
    const getListOfPaymentMethod = () => {
        const apiData = `/cart?service_type=${dineInType}`;
        actions
            .getListOfPaymentMethod(apiData, {}, headers)
            .then(res => {
                console.log(res, 'allpayments gate');
                if (res && res?.data) {
                    setPaymentMethods(res?.data);
                }
            })
            .catch(errorMethod);
    };

    const _directOrderPlace = () => {
        if (isEmpty(selectedPayment)) {
            showError(strings.SELECT_PAYMENT_METHOD);
            return;
        }
        let data = {};
        data['vendor_id'] = paramData?.productDetails?.vendor_id;
        data['address_id'] = dineInType != 'delivery' ? '' : selectedAddress?.id;
        data['payment_option_id'] = selectedPayment?.id || 1;

        data['type'] = dineInType || '';
        data['is_gift'] = 0;
        data['specific_instructions'] = '';
        data['amount'] = Number(paramData?.totalPayableAmount);
        placeOrderData(data);
    };

    const placeOrderData = data => {
        setisPlaceOrderLoading(true);
        const headerData = {
            ...headers,
            latitude: !isEmpty(location) ? location?.latitude.toString() : '',
            longitude: !isEmpty(location) ? location?.longitude.toString() : '',
        };

        actions
            .placeOrder(data, headerData)
            .then(res => {
                setisPlaceOrderLoading(false);
                console.log(res, '<===res placeOrder');
                actions.reloadData(!reloadData);
                actions.cartItemQty(0);
                moveToNewScreen(navigationStrings.ORDERSUCESS, {
                    orderDetail: res?.data,
                    product_id: paramData?.productDetails?.product_id,
                })();
                // if (selectedPayment?.id === 49 || selectedPayment?.id === 50) {
                //     // _paymentWithPlugnPayMethods(res);
                //     return;
                // } else {
                //     checkPaymentOptions(res);
                // }
            })
            .catch(errorMethod);
    };

    const checkPaymentOptions = res => {
        let paymentId = res?.data?.payment_option_id;
        let order_number = res?.data?.order_number;
        // setSelectedPayment(selectedPayment);
        console.log('api res success', res);

        // let paymentData = {
        //     total_payable_amount: (
        //         Number(cartData?.total_payable_amount) +
        //         (selectedTipAmount != null && selectedTipAmount != ''
        //             ? Number(selectedTipAmount)
        //             : 0)
        //     ).toFixed(appData?.profile?.preferences?.digit_after_decimal),
        //     payment_option_id: selectedPayment?.id,
        //     orderDetail: res.data,
        //     redirectFrom: 'cart',
        //     selectedPayment: selectedPayment,
        // };
        // if (!!paymentId &&
        //     !!(Number(cartData?.total_payable_amount) + Number(selectedTipAmount) === 0)) {
        //     moveToNewScreen(navigationStrings.ORDERSUCESS, { orderDetail: res.data, })();
        //     return;
        // }

        console.log('paymentIdpaymentIdpaymentIdpaymentId', paymentId);
        switch (paymentId) {
            case 4:
                _offineLinePayment(order_number);
                return;
        }
    };

    //Offline payments
    const _offineLinePayment = async order_number => {
        console.log('payment method id++++', paymentMethodId);
        if (!!paymentMethodId) {
            _paymentWithStripe(cardInfo, tokenInfo, paymentMethodId, order_number);
        } else {
            errorMethod(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
        }
    };

    const _paymentWithStripe = async (
        cardInfo,
        tokenInfo,
        paymentMethodId,
        order_number,
    ) => {
        const data = {
            payment_option_id: selectedPayment?.id,
            action: 'cart',
            amount: Number(paramData?.totalPayableAmount),
            payment_method_id: paymentMethodId,
            order_number: order_number,
            card: cardInfo,
        };
        console.log('_paymentWithStripe => data', data);
        actions
            .getStripePaymentIntent(data, headers)
            .then(async res => {
                if (res && res?.client_secret) {
                    const { paymentIntent, error } = await handleNextAction(
                        res?.client_secret,
                    );
                    if (paymentIntent) {
                        if (paymentIntent) {
                            actions
                                .confirmPaymentIntentStripe(
                                    {
                                        order_number: order_number,
                                        payment_option_id: selectedPayment?.id,
                                        action: 'cart',
                                        amount: Number(paramData?.totalPayableAmount),
                                        payment_intent_id: paymentIntent?.id,
                                        address_id: selectedAddress?.id,
                                        tip: 0,
                                    },
                                    headers,
                                )
                                .then(res => {
                                    console.log(res, '_paymentWithStripe :: secondresponse');
                                    if (res && res?.status == 'Success' && res?.data) {
                                        actions.cartItemQty({});
                                        setCartItems([]);
                                        setCartData({});
                                        actions.reloadData(!reloadData);
                                        // setSelectedPayment({
                                        //     id: 1,
                                        //     off_site: 0,
                                        //     title: 'Cash On Delivery',
                                        //     title_lng: strings.CASH_ON_DELIVERY,
                                        // });
                                        // setPickupDriverComment(null);
                                        // setDropOffDriverComment(null);
                                        // setVendorComment(null);
                                        // setLocalPickupDate(null);
                                        // setLocaleDropOffDate(null);
                                        // setModalType(null);
                                        // setSheduledpickupdate(null);

                                        moveToNewScreen(navigationStrings.ORDERSUCESS, {
                                            orderDetail: res.data,
                                        })();
                                        showSuccess(res?.message);
                                    } else {
                                        // setSelectedPayment({
                                        //     id: 1,
                                        //     off_site: 0,
                                        //     title: 'Cash On Delivery',
                                        //     title_lng: strings.CASH_ON_DELIVERY,
                                        // });
                                    }
                                })
                                .catch(errorMethod);
                        }
                    } else {
                        console.log(error, 'error');
                        showError(error?.message || 'payment failed');
                    }
                } else {
                }
            })
            .catch(errorMethod);
    };

    const _onChangeStripeData = cardDetails => {
        console.log('_onChangeStripeData_onChangeStripeData', cardDetails);
        if (cardDetails?.complete) {
            selectPaymentOption(cardDetails);
        } else {
        }
    };

    const selectPaymentOption = async cardInfo => {
        if (cardInfo) {
            await createToken({ ...cardInfo, type: 'Card' })
                .then(res => {
                    console.log(res, 'stripeTokenres>>');
                    console.log(cardInfo, 'stripeTokencardInfo>>');
                    if (!!res?.error) {
                        alert(res.error.localizedMessage);
                        return;
                    }
                    if (res && res?.token && res.token?.id) {
                        _createPaymentMethod(cardInfo, res.token?.id);
                    } else {
                    }
                })
                .catch(err => {
                    console.log(err, 'err>>');
                });
        } else {
            alert(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
            //   showError(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
        }
    };

    const _createPaymentMethod = async (cardInfo, res2) => {
        console.log(cardInfo, '_createPaymentMethod>>>ardInfo');
        if (res2) {
            await createPaymentMethod({
                token: res2,
                card: cardInfo,
                paymentMethodType: 'Card',
                billing_details: {
                    name: 'Jenny Rosen',
                },
            })
                .then(res => {
                    console.log('_createPaymentMethod res', res);
                    if (res && res?.error && res?.error?.message) {
                        showError(res?.error?.message);
                        paymentModalClose();
                    } else {
                        // onSelectPayment({
                        //     // selectedPaymentMethod,
                        //     cardInfo,
                        //     tokenInfo: res2,
                        //     payment_method_id: res?.paymentMethod?.id,
                        // });
                        if (!!cardInfo) {
                            setCardInfo(cardInfo);
                        }
                        if (!!res2) {
                            setTokenInfo(res2);
                        }
                        if (res?.paymentMethod) {
                            setPaymentMethodId(res?.paymentMethod?.id);
                        }
                        // paymentModalClose();
                    }
                })
                .catch(errorMethod);
        }
    };

    const mainView = () => {
        return (
            <>
                <ScrollView
                    style={{
                        marginHorizontal: moderateScaleVertical(16),
                        // marginTop: moderateScaleVertical(10),
                    }}>
                    <View>
                        <CardField
                            postalCodeEnabled={false}
                            placeholder={{
                                number: '4242 4242 4242 4242',
                            }}
                            cardStyle={{
                                backgroundColor: colors.white,
                                textColor: colors.black,
                            }}
                            style={{
                                width: '100%',
                                height: 50,
                                marginVertical: 10,
                            }}
                            onCardChange={cardDetails => {
                                _onChangeStripeData(cardDetails);
                            }}
                            onFocus={focusedField => {
                                console.log('focusField', focusedField);
                            }}
                            onBlur={() => {
                                Keyboard.dismiss();
                            }}
                        />
                    </View>
                </ScrollView>

                {/* <View
                    style={{
                        marginHorizontal: moderateScaleVertical(20),
                        marginBottom:
                            keyboardHeight == 0
                                ? keyboardHeight
                                : moderateScale(keyboardHeight - 80),
                    }}>
                    <GradientButton
                        onPress={selectPaymentOption}
                        marginTop={moderateScaleVertical(10)}
                        marginBottom={height / 9}
                        btnText={strings.SELECT}
                        indicator={btnLoader}
                        indicatorColor={colors.white}
                    />
                </View> */}
            </>
        );
    };



    const renderPaymentMethods = useCallback(
        ({ item, index }) => {
            return (
                <View
                    style={{
                        height: moderateScaleVertical(50),
                        justifyContent: 'flex-end',
                    }}>
                    <ButtonWithLoader
                        onPress={() => setSelectedPayment(item)}
                        btnText={item?.title}
                        btnTextStyle={{
                            color:
                                selectedPayment?.id === item?.id
                                    ? themeColors?.primary_color
                                    : colors.black,
                        }}
                        btnStyle={{
                            borderColor:
                                selectedPayment?.id === item?.id
                                    ? themeColors?.primary_color
                                    : colors.transactionHistoryBg,
                            marginTop: 0,
                            borderRadius: 2,
                            paddingHorizontal: moderateScale(12),
                            backgroundColor:
                                selectedPayment?.id === item?.id
                                    ? colors.white
                                    : colors.transactionHistoryBg,
                            height: moderateScaleVertical(40),
                        }}
                    />
                    {selectedPayment?.id === item?.id && (
                        <Image
                            source={imagePath.icTick}
                            style={{
                                position: 'absolute',
                                right: -5,
                                top: 5,
                            }}
                        />
                    )}
                </View>
            );
        },
        [paymentMethods, selectedPayment],
    );

    return (
        <WrapperContainer bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
            <OoryksHeader leftTitle={strings.PAYMENT} />

            <View style={{ flex: 0.75 }}>
                <View
                    style={{
                        borderRadius: 12,
                        marginTop: moderateScaleVertical(8),
                        marginHorizontal: moderateScale(16),
                    }}>
                    <View
                        style={{
                            padding: moderateScale(7),
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FastImage
                                source={imagePath.mapIcon}
                                resizeMode="contain"
                                style={{
                                    borderRadius: 8,
                                    width: moderateScale(63),
                                    height: moderateScaleVertical(69),
                                }}
                            />
                            <View style={{ marginLeft: moderateScale(9) }}>
                                <Text
                                    style={{ fontSize: textScale(14), fontFamily: fontFamily?.medium, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}
                                    numberOfLines={1}>
                                    Home
                                </Text>
                                <Text
                                    style={{
                                        lineHeight: moderateScaleVertical(15),
                                        marginTop: moderateScaleVertical(8),
                                        color: colors.lightGreyText,
                                        width: moderateScale(182),
                                        fontSize: textScale(12),
                                        fontWeight: '400',
                                    }}
                                    numberOfLines={2}>
                                    CDCL, Sector 28 b, Chandigarh 80274732434
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Image
                                source={imagePath.icEdit1}
                                style={{ tintColor: colors.black }}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={{
                            color: colors.greyD,
                            fontSize: textScale(12),
                            fontFamily: fontFamily?.medium,
                            marginTop: moderateScaleVertical(37),
                        }}>
                        {strings.PAYMENT.toUpperCase()}
                    </Text>
                </View>

                <View
                    style={{
                        marginVertical: moderateScaleVertical(24),
                    }}>
                    <FlatList
                        data={paymentMethods}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderPaymentMethods}
                        ListHeaderComponent={() => (
                            <View
                                style={{
                                    width: moderateScale(20),
                                }}
                            />
                        )}
                        ListFooterComponent={() => (
                            <View
                                style={{
                                    width: 10,
                                }}
                            />
                        )}
                        ItemSeparatorComponent={() => (
                            <View style={{ width: moderateScale(8) }} />
                        )}
                    />
                </View>

                <TouchableOpacity style={styles.cardView}>
                    <Image source={imagePath.ic_master} />
                    <Text style={styles.cardText}>XXXX XXXX XXXX 1234</Text>
                </TouchableOpacity>
                <Text
                    style={{
                        textAlign: 'center',
                        color: colors.greyLight,
                        marginVertical: moderateScale(10),
                    }}>
                    -- OR --
                </Text>
                {selectedPayment?.id == 4 && (
                    <StripeProvider
                        publishableKey={preferences?.stripe_publishable_key}
                        merchantIdentifier="merchant.identifier">
                        {mainView()}
                    </StripeProvider>
                )}
                <TouchableOpacity
                    style={{ ...styles.cardView, marginTop: moderateScaleVertical(14) }}
                    onPress={() => setOpensheet(true)}>
                    <Image source={imagePath.icAdd} />
                    <Text style={styles.cardText}>{strings.ADD_NEW_CARD}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 0.2, justifyContent: 'flex-end' }}>
                <ButtonWithLoader
                    isLoading={isPlaceOrderLoading}
                    btnText={strings.PAYNOW}
                    onPress={_directOrderPlace}
                    btnStyle={{
                        marginHorizontal: moderateScale(20),
                        backgroundColor: isDarkMode ? themeColors?.primary_color : colors.black,
                        borderWidth: 0,
                        borderRadius: moderateScale(8),
                    }}
                    btnTextStyle={{}}
                />
            </View>

            <Modal
                isVisible={opensheet}
                onBackdropPress={() => setOpensheet(false)}
                style={{
                    margin: 0,
                    justifyContent: 'flex-end',
                }}>
                <View style={styles.mainView}>
                    <Text style={styles.numStyle}>{strings.ADD_NEW_CARD}</Text>
                    <Text style={styles.labelStyle}>{strings.CARD_NUMBER}</Text>

                    <TextInput
                        style={{
                            ...styles.inputStyle,
                            marginBottom: moderateScaleVertical(24),
                        }}
                    />
                    <Text style={styles.labelStyle}>{strings.CARD_HOLDER_NAME}</Text>

                    <TextInput style={styles.inputStyle} />

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: moderateScaleVertical(24),
                        }}>
                        <View style={{ flex: 0.48 }}>
                            <Text style={styles.labelStyle}>{strings.EXPIRY}</Text>
                            <TextInput style={{ ...styles.inputStyle, width: '100%' }} />
                        </View>
                        <View style={{ flex: 0.48 }}>
                            <Text style={styles.labelStyle}>{strings.CVV}</Text>
                            <TextInput style={{ ...styles.inputStyle, width: '100%' }} />
                        </View>
                    </View>
                    <GradientButton
                        onPress={() => setOpensheet(false)}
                        btnText={strings.SAVE}
                        btnStyle={{ marginTop: 0 }}
                    />
                    <View
                        style={{
                            height: moderateScaleVertical(10),
                        }}
                    />
                </View>
            </Modal>
        </WrapperContainer>
    );
};

export function stylesFunc({ fontFamily }) {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#2c3e50',
        },
        labelStyle: {
            fontSize: textScale(14),
            marginTop: moderateScaleVertical(12),
            opacity: 0.5,
            fontFamily: fontFamily?.medium,
        },
        inputStyle: {
            height: moderateScale(48),
            borderWidth: 1,
            marginTop: moderateScaleVertical(14),
            borderRadius: moderateScale(4),
            borderColor: colors.profileInputborder,
        },
        numStyle: {
            fontSize: textScale(20),
            fontFamily: fontFamily?.medium,
        },
        mainView: {
            paddingHorizontal: moderateScale(12),
            paddingTop: moderateScaleVertical(24),
            backgroundColor: colors.white,
            borderTopLeftRadius: moderateScale(24),
            borderTopRightRadius: moderateScale(24),
        },
        cardView: {
            flexDirection: 'row',
            height: moderateScale(47),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.transactionHistoryBg,
            marginHorizontal: moderateScale(20),
        },
        cardText: {
            marginLeft: moderateScale(4),
            fontFamily: fontFamily?.bold,
        },
    });
    return styles;
}

//make this component available to the app
export default P2pPayment;
