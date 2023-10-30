//import liraries
import { useFocusEffect } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import HTMLView from 'react-native-htmlview';
import * as RNLocalize from 'react-native-localize';
import { useSelector } from 'react-redux';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
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
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import { getImageUrl, showError } from '../../../utils/helperFunctions';
import { MyDarkTheme } from '../../../styles/theme';

// create a component
const ProductPriceDetails = ({ navigation }) => {
    const {
        appData,
        currencies,
        languages,
        appStyle,
        themeColors,
        themeToggle,
        themeColor,
        allAddresss,
    } = useSelector(state => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const darkthemeusingDevice = useDarkMode();
    const { dineInType, appMainData, location } = useSelector(state => state?.home);
    const { additional_preferences, digit_after_decimal } =
        appData?.profile?.preferences || {};

    const [state, setState] = useState({
        serviceFee: 0,
        totalPayableAmount: 0,
        vendorDetails: {},
        productDetails: {},
    });
    const { serviceFee, totalPayableAmount, vendorDetails, productDetails } = state;

    const [isHereByConfirm, setIsHereByConfirm] = useState(false);
    const [isCancellationPolicy, setIsCancellationPolicy] = useState(false);


    const updateState = data => setState(state => ({ ...state, ...data }));

    const moveToNewScreen =
        (screenName, data = {}) =>
            () => {
                navigation.navigate(screenName, { data });
            };

    useFocusEffect(
        React.useCallback(() => {
            getCartDetail();
        }, []),
    );

    const currencyWithSymbol = ({ price, multiplier = 1 }) => {
        return tokenConverterPlusCurrencyNumberFormater(
            price * multiplier,
            digit_after_decimal,
            additional_preferences,
            currencies?.primary_currency?.symbol,
        );
    };

    const getCartDetail = () => {
        const apiData = `/?type=${dineInType}`;
        let apiHeader = {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
            systemuser: DeviceInfo.getUniqueId(),
            timezone: RNLocalize.getTimeZone(),
            device_token: DeviceInfo.getUniqueId(),
        };
        console.log('Sending api header', apiHeader);
        actions
            .getCartDetail(apiData, {}, apiHeader)
            .then(res => {
                console.log('cart details>>>', res);
                actions.cartItemQty(res);
                if (res?.data && !isEmpty(res?.data)) {
                    updateState({
                        serviceFee: res?.data?.total_service_fee,
                        totalPayableAmount: res?.data?.total_payable_amount,
                        vendorDetails: res?.data?.vendor_details,
                        productDetails:
                            !isEmpty(res?.data?.products) &&
                            res?.data?.products[0]?.vendor_products[0],
                    });
                }
            })
            .catch(error => showError(error?.message || error?.error));
    };

    const onBookNowPress = () => {
        const item = {
            data: state,
        };
        moveToNewScreen(navigationStrings.PAYMENT_SCREEN, item)();
    };

    const imageUrl =
        productDetails &&
        productDetails.cartImg?.path &&
        getImageUrl(
            productDetails?.cartImg?.path?.image_fit,
            productDetails?.cartImg?.path?.image_path,
            '200/200',
        );
    const startEndDate = `${!isEmpty(productDetails)
        ? moment(productDetails?.start_date_time).format('DD MMM')
        : ''
        } - ${!isEmpty(productDetails)
            ? moment(productDetails?.end_date_time).format('DD MMM')
            : ''
        }`;
    const priceOnTimeBase = !isEmpty(productDetails) ? productDetails?.price || productDetails?.variants?.price : '';


    return (
        <WrapperContainer bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white} >
            <OoryksHeader
                leftTitle={strings.DETAILS}
                headerContainerStyle={{
                    borderBottomWidth: 1,
                    borderBottomColor: colors.grey1,
                }}
            />
            <View style={{ flex: 0.9 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: moderateScaleVertical(14),
                        marginHorizontal: moderateScale(16),
                    }}>
                    <Text
                        style={{
                            fontFamily: fontFamily?.regular,
                            color: colors.textGreyN,
                            marginLeft: moderateScale(8),
                            fontSize: textScale(13),
                        }}>
                        <Text
                            style={{
                                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                            }}>
                            {strings.ADDRESS}
                        </Text>{' '}
                        {productDetails?.product?.address}
                    </Text>
                </View>
                <View
                    style={{
                        borderWidth: 0.5,
                        margin: moderateScale(16),
                        borderColor: colors.greyA,
                        borderRadius: moderateScale(8),
                    }}>

                    {productDetails?.product?.productcategory?.type_id !== 13 ? <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: moderateScaleVertical(8),
                                marginHorizontal: moderateScale(12),
                            }}>
                            <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
                                Days {!isEmpty(productDetails) && productDetails?.days}
                            </Text>
                            <Text style={{ fontFamily: fontFamily.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }} numberOfLines={1}>
                                {startEndDate}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: moderateScaleVertical(8),
                                marginHorizontal: moderateScale(12),
                            }}>
                            <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
                                {currencyWithSymbol({ price: priceOnTimeBase })} x{' '}
                                {!isEmpty(productDetails) && productDetails?.days} days
                            </Text>
                            <Text style={{ fontFamily: fontFamily.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
                                {currencyWithSymbol({
                                    price: priceOnTimeBase,
                                    multiplier:
                                        !isEmpty(productDetails) && Number(productDetails?.days),
                                })}
                            </Text>
                        </View>
                    </View> : <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: moderateScaleVertical(8),
                            marginHorizontal: moderateScale(12),
                        }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
                            Price
                        </Text>
                        <Text style={{ fontFamily: fontFamily.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }} numberOfLines={1}>
                            {currencyWithSymbol({
                                price: priceOnTimeBase,

                            })}

                        </Text>
                    </View>}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: moderateScaleVertical(8),
                            marginHorizontal: moderateScale(12),
                        }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>Service Fee</Text>
                        <Text style={{ fontFamily: fontFamily.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
                            {currencyWithSymbol({ price: serviceFee })}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: moderateScaleVertical(8),
                            marginHorizontal: moderateScale(12),
                        }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>Promo Code</Text>
                        <Text style={{ fontFamily: fontFamily.bold }}></Text>
                    </View>

                    <View
                        style={{
                            height: 2,
                            // width:width-40,
                            marginHorizontal: moderateScale(10),
                            backgroundColor: colors.greyA,
                            opacity: 0.26,
                        }}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: moderateScale(8),
                            marginHorizontal: moderateScale(12),
                        }}>
                        <Text
                            style={{
                                fontFamily: fontFamily.bold,
                                color: colors.black,
                                fontSize: textScale(16),
                                color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                            }}>
                            Total
                        </Text>
                        <Text
                            style={{ fontFamily: fontFamily.bold, fontSize: textScale(16), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
                            {currencyWithSymbol({ price: totalPayableAmount })}
                        </Text>
                    </View>
                </View>
                <View style={{ padding: moderateScale(16) }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() =>
                            navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL)
                        }>
                        <View
                            style={{
                                flexDirection: 'row',
                                borderRadius: 12,
                                backgroundColor: colors.whiteSmokeColor,
                                padding: 11,
                            }}>
                            <FastImage
                                source={imageUrl ? { uri: imageUrl } : imagePath.ooryks_img}
                                style={{
                                    width: moderateScale(69),
                                    height: moderateScaleVertical(69),
                                }}
                            />
                            <View
                                style={{
                                    marginLeft: moderateScale(10),
                                    width: moderateScale(199),
                                }}>
                                <Text style={{ fontFamily: fontFamily.bold }}>
                                    {!isEmpty(productDetails) &&
                                        productDetails?.product?.translation[0]?.title}
                                </Text>
                                <HTMLView
                                    value={
                                        productDetails?.product?.translation[0]?.body_html
                                            ? productDetails?.product?.translation[0]?.body_html
                                            : ''
                                    }
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: moderateScale(16),
                        alignItems: 'center',
                        marginTop: moderateScaleVertical(32),
                    }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setIsHereByConfirm(!isHereByConfirm)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Image
                            source={
                                isHereByConfirm
                                    ? imagePath.checkBox2Active
                                    : imagePath.checkBox2InActive
                            }
                        />
                        <Text
                            style={{
                                color: colors.textGreyQ,
                                marginLeft: moderateScale(12),
                                fontSize: textScale(14),
                            }}>
                            I hereby confirm
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: moderateScale(16),
                        marginTop: moderateScaleVertical(14),
                    }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            setIsCancellationPolicy(!isCancellationPolicy)
                        }
                        }
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Image source={isCancellationPolicy
                            ? imagePath.checkBox2Active
                            : imagePath.checkBox2InActive} />
                        <Text
                            onPress={() => navigation.navigate(navigationStrings.WEBLINKS, {
                                id: 4,
                                slug: 'cancelation-policy',
                                title: 'Cancelation Policy',
                            })}
                            style={{
                                color: colors.blue,
                                marginLeft: moderateScale(12),
                                fontSize: textScale(14),
                                textDecorationLine: "underline"
                            }}>
                            Cancellation policy.
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {
                <View style={{ flex: 0.2 }}>
                    <View
                        style={{
                            marginHorizontal: moderateScale(16),
                        }}>
                        <ButtonWithLoader
                            btnText={strings.BOOK_NOW}
                            onPress={onBookNowPress}
                            disabled={!(isCancellationPolicy & isHereByConfirm)}
                            btnStyle={{
                                backgroundColor: (isCancellationPolicy & isHereByConfirm) ? isDarkMode ? themeColors?.primary_color : colors.black : colors.textGreyB,
                                borderWidth: 0,
                                borderRadius: moderateScale(8),
                            }}
                        />
                    </View>
                </View>
            }
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {},
});

//make this component available to the app
export default ProductPriceDetails;
