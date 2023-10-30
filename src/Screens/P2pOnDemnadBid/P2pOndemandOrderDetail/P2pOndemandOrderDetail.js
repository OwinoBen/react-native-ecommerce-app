import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import OoryksHeader from '../../../Components/OoryksHeader'
import WrapperContainer from '../../../Components/WrapperContainer'
import actions from '../../../redux/actions'
import colors from '../../../styles/colors'
import stylesFunc from './styles'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { useDarkMode } from 'react-native-dynamic'
import FastImage from 'react-native-fast-image'
import HTMLView from 'react-native-htmlview'
import { useSelector } from 'react-redux'
import strings from '../../../constants/lang'
import navigationStrings from '../../../navigation/navigationStrings'
import { moderateScale, moderateScaleVertical, textScale } from '../../../styles/responsiveSize'
import { MyDarkTheme } from '../../../styles/theme'
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction'
import { getImageUrl, showError } from '../../../utils/helperFunctions'


export default function P2pOndemandOrderDetail({ route, navigation }) {
    console.log(route, "<===route")
    const { appData, currencies, languages, appStyle, themeColors, themeColor, themeToggle } = useSelector(
        state => state?.initBoot,
    );
    const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences || {};

    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFunc({ fontFamily, themeColors })
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const paramData = route?.params


    const [orderData, setOrderData] = useState({})

    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
        getOrderDetailsP2p()
    }, [])

    const getOrderDetailsP2p = () => {
        actions.getP2pOrderDetail({
            order_id: paramData?.order_id
        }, {
            code: appData.profile.code,
            currency: currencies.primary_currency.id,
            language: languages.primary_language.id,
        }).then((res) => {
            console.log(res, "<===res getP2pOrderDetail")
            setisLoading(false)
            setOrderData(res?.data || {})
        }).catch((err) => {
            setisLoading(false)
            showError(err?.message || err?.error)
        })
    }


    const productInfo = !isEmpty(orderData) ? orderData?.vendors[0]?.products[0] : {}


    return (
        <WrapperContainer isLoading={isLoading} bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
            <OoryksHeader
                leftTitle={"Orders"}
                headerContainerStyle={{ borderBottomWidth: 1, borderBottomColor: colors.grey1 }}
            />
            {!isEmpty(orderData) && <View style={{ flex: 0.9, }}>
                <View style={styles.addressCont}>
                    <Text style={styles.addressTxt}>
                        <Text style={{
                            color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                        }}>{strings.ADDRESS}</Text> {productInfo?.product?.address}
                    </Text>
                </View>
                <View style={{ borderWidth: 0.5, margin: moderateScale(16), borderColor: colors.greyA, borderRadius: moderateScale(8) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScaleVertical(8), marginHorizontal: moderateScale(12) }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>Days {productInfo?.days}</Text>
                        <Text style={{ fontFamily: fontFamily?.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }} numberOfLines={1}>
                            {`${moment(productInfo?.start_date_time).format("DD MMMM")} - ${moment(productInfo?.end_date_time).format("DD MMMM")}`}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScaleVertical(8), marginHorizontal: moderateScale(12) }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}> {tokenConverterPlusCurrencyNumberFormater(
                            productInfo?.price,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)} x {productInfo?.days} days</Text>
                        <Text style={{ fontFamily: fontFamily?.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{tokenConverterPlusCurrencyNumberFormater(
                            productInfo?.price * productInfo?.days,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScaleVertical(8), marginHorizontal: moderateScale(12) }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>Service Fee</Text>
                        <Text style={{ fontFamily: fontFamily?.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{tokenConverterPlusCurrencyNumberFormater(
                            orderData?.total_service_fee,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: moderateScaleVertical(8), marginHorizontal: moderateScale(12) }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>Promo Code</Text>
                        <Text style={{ fontFamily: fontFamily?.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}></Text>
                    </View>

                    <View style={{
                        height: 2,
                        // width:width-40,
                        marginHorizontal: moderateScale(10),
                        backgroundColor: colors.greyA,
                        opacity: 0.26,

                    }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: moderateScale(8), marginHorizontal: moderateScale(12) }}>
                        <Text style={{ fontFamily: fontFamily?.bold, fontSize: textScale(16), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>Total</Text>
                        <Text style={{ fontFamily: fontFamily?.bold, fontSize: textScale(16), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{tokenConverterPlusCurrencyNumberFormater(
                            orderData?.payable_amount,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)}</Text>
                    </View>
                </View>
                <View style={{ padding: moderateScale(16) }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL)}>
                        <View style={{ flexDirection: 'row', borderRadius: 12, backgroundColor: colors.whiteSmokeColor, padding: 11 }}>
                            <FastImage
                                source={{
                                    uri: getImageUrl(productInfo?.image?.image_fit, productInfo?.image?.image_path, "300/300")
                                }}
                                style={{ width: moderateScale(69), height: moderateScaleVertical(69), borderRadius: moderateScale(8) }}
                            />
                            <View style={{ marginLeft: moderateScale(10), width: moderateScale(199) }}>
                                <Text style={{ fontFamily: fontFamily?.bold }}>
                                    {productInfo?.translation?.title}
                                </Text>
                                <HTMLView

                                    value={
                                        productInfo?.translation?.body_html
                                            ? productInfo?.translation?.body_html
                                            : ''
                                    }

                                />
                            </View>
                        </View>

                    </TouchableOpacity>
                </View>


            </View>
            }
        </WrapperContainer>
    )
}
