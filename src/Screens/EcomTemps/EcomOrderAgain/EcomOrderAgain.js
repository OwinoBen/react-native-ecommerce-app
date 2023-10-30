import { cloneDeep, debounce } from "lodash";
import React, { createRef, useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDarkMode } from "react-native-dynamic";
import FastImage from "react-native-fast-image";
import * as RNLocalize from "react-native-localize";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import CustomTopTabBar from "../../../Components/CustomTopTabBar";
import GradientButton from "../../../Components/GradientButton";
import Header from "../../../Components/Header";
import NoDataFound from "../../../Components/NoDataFound";
import OrderCardVendorComponent2 from "../../../Components/OrderCardVendorComponent2";
import WrapperContainer from "../../../Components/WrapperContainer";
import imagePath from "../../../constants/imagePath";
import strings from "../../../constants/lang/index";
import staticStrings from "../../../constants/staticStrings";
import navigationStrings from "../../../navigation/navigationStrings";
import actions from "../../../redux/actions";
import colors from "../../../styles/colors";
import commonStylesFunc from "../../../styles/commonStyles";
import {
    height,
    moderateScale,
    moderateScaleVertical,
    width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { getImageUrl, showError } from '../../../utils/helperFunctions';
import stylesFun from './styles';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { getBundleId } from 'react-native-device-info';


import { enableFreeze } from "react-native-screens";
enableFreeze(true);

export default function EcomOrderAgain(props) {
    const { navigation, route } = props;
    const {
        appData,
        currencies,
        languages,
        themeColors,
        appStyle,
        themeColor,
        themeToggle,
    } = useSelector((state) => state?.initBoot);
    const location = useSelector((state) => state?.home?.location);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    const cartData = useSelector((state) => state?.cart?.cartItemCount);

    let backIconShow = true

    const [state, setState] = useState({
        selectedTab: strings.PAST_ORDERS,
        orders: [],
        activeOrders: [],
        pastOrders: [],
        scheduledOrders: [],
        pageActive: 1,
        pagePastOrder: 1,
        pageScheduleOrder: 1,
        limit: 10,
        isLoading: false,
        isRefreshing: false,
        tabType: "past",
        isVisibleReturnOrderModal: false,
        selectedOrderForReturn: null,
        selectProductForRetrun: null,
        viewHeight: 0,
        reasons: [],
        isOrderForReplace: false,
    });
    const {
        viewHeight,
        selectedTab,
        isLoading,
        activeOrders,
        pastOrders,
        scheduledOrders,
        pageActive,
        pagePastOrder,
        pageScheduleOrder,
        limit,
        isRefreshing,
        tabType,
        orders,
        isVisibleReturnOrderModal,
        selectedOrderForReturn,
        selectProductForRetrun,
        reasons,
        isOrderForReplace,
    } = state;

    //Update state in screen
    const updateState = (data) => setState((state) => ({ ...state, ...data }));
    // const _scrollRef = createRef();
    //Reduc store data
    const userData = useSelector((state) => state.auth.userData);

    const fontFamily = appStyle?.fontSizeData;
    const commonStyles = commonStylesFunc({ fontFamily });
    const styles = stylesFun({ fontFamily, themeColors });




    const updateLocalItem = (data) => {
        console.log("update location item data", data);
        let cloneArr = orders;
        let filterArray = cloneArr.filter((val) => {
            if (val.order_id !== data.order_id) {
                return val;
            }
        });
        // console.log("update location item data filter array",filterArray)
        updateState({ orders: filterArray });
    };

    //Get list of all orders api
    const _getListOfOrders = () => {
        actions
            .getOrderListing(
                `?limit=${limit}&page=${pageActive}&type=past`,
                {},
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                    timezone: RNLocalize.getTimeZone(),
                    latitude: location?.latitude.toString() || "",
                    longitude: location?.longitude.toString() || "",
                }
            )
            .then((res) => {
                console.log(res, "res my orders >>>");
                updateState({
                    orders:
                        pageActive == 1 ? res.data.data : [...orders, ...res.data.data],
                    isLoading: false,
                    isRefreshing: false,


                });
            })
            .catch(errorMethod);
    };

    //error handling of api
    const errorMethod = (error) => {
        console.log(error, "error>error");
        updateState({
            isLoading: false,
            isRefreshing: false,
        });
        showError(error?.message || error?.error);
    };

   

    const onPressViewEditAndReplace = (item) => {
        if (
            item?.dispatch_traking_url &&
            (item?.product_details[0]?.category_type ==
                staticStrings.PICKUPANDDELIEVRY ||
                item?.product_details[0]?.category_type ==
                staticStrings.ONDEMANDSERVICE)
        ) {
            navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
                orderId: item?.order_id,
                fromVendorApp: true,
                selectedVendor: { id: item?.vendor_id },
                orderDetail: item,
                showRating: item?.order_status?.current_status?.id != 6 ? false : true,
                keyValue: 1,
            });
        } else {
            navigation.navigate(navigationStrings.ORDER_DETAIL, {
                orderId: item?.order_id,
                fromVendorApp: true,
                orderDetail: item,
                orderStatus: item?.order_status,
                selectedVendor: { id: item?.vendor_id },
                showRating: item?.order_status?.current_status?.id != 6 ? false : true,
                fromActive: selectedTab == "Active Orders", // this value use for useInterval
            });
        }
    };
    const rateYourOrder = () => {
        navigation.navigate(navigationStrings.RATEORDER);
    };

    const returnYourOrder = (item) => {
        updateState({ isLoading: true, isOrderForReplace: false });
        actions
            .getReturnOrderDetailData(
                `?id=${item?.order_id}&vendor_id=${item?.vendor_id}`,
                {},
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                }
            )
            .then((res) => {
                console.log(res, "getReturnOrderDetailData>>>res>>>");

                updateState({
                    isVisibleReturnOrderModal: true,
                    selectedOrderForReturn: res?.data,
                    selectProductForRetrun: null,
                    isLoading: false,
                });
            })
            .catch(errorMethod);
    };

    const repeatOrder = (item) => {
        console.log(item);
        console.log(cartData);
        let data = {};
        data["order_vendor_id"] = item.id;
        data["cart_id"] = cartData?.data?.id;
        console.log(data);
        updateState({ isLoading: true });
        actions
            .repeatOrder(``, data, {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
            })
            .then((res) => {
                console.log(res, "getReturnOrderDetailData>>>res>>>");
                navigation.navigate(navigationStrings.CART);
                updateState({
                    isLoading: false,
                });
            })
            .catch(errorMethod);
    };

    //_onCustomerEditOrder funcationality

    const _onCustomerEditOrder = (orderData) => {
        console.log(orderData?.order_id, "order Data for edit order");
        const apiData = {
            orderid: orderData?.order_id,
        };
        actions
            .customerEditOrder(apiData, {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
            })
            .then((res) => {
                console.log(res, "edit order Api response");
                navigation.navigate(navigationStrings.CART);
            })
            .catch((error) => {
                console.log(error, "edit order api error");
                errorMethod();
            });
    };

    // discard customer edit order in cart

    const _onDiscardCustomerEditOrder = (orderData) => {
        updateState({
            isLoading: true
        })
        const apiData = {
            orderid: orderData?.order_id,
        };

        actions
            .discardCustomerEditOrder(apiData, {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
            })
            .then((res) => {
                showSuccess(res?.message);

            })
            .catch(errorMethod);
    }

    const onReplaceOrder = (item) => {
        console.log(item, '====>item');
        updateState({ isLoading: true });
        actions
            .getProductsForReplace(
                `?id=${item?.order_id}&vendor_id=${item?.vendor_id}`,
                {},
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                },
            )
            .then((res) => {
                updateState({
                    isLoading: false,
                    isOrderForReplace: true,
                    isVisibleReturnOrderModal: true,
                    selectedOrderForReturn: res?.data,
                    selectProductForRetrun: null,
                });
            })
            .catch(errorMethod);
    };

    const renderOrders = ({ item, index }) => {
        return (
            <OrderCardVendorComponent2
                data={item}
                selectedTab={selectedTab}
                onPress={() => onPressViewEditAndReplace(item)}
                onPressRateOrder={
                    selectedTab == strings.PAST_ORDERS ? () => rateYourOrder() : null
                }
                onReplaceOrder={onReplaceOrder}
                navigation={navigation}
                onPressReturnOrder={
                    selectedTab == strings.PAST_ORDERS
                        ? () => returnYourOrder(item)
                        : null
                }
                cardStyle={{ padding: 0 }}
                etaTime={!!item?.ETA ? item.ETA : null}
                updateLocalItem={updateLocalItem}
                showRepeatOrderButton={selectedTab == strings.PAST_ORDERS}
                // onRepeatOrderPress={() => repeatOrder(item)}
                onRepeatOrderPress={() => {
                    Alert.alert("", strings.THIS_WILL_REMOVE_CART, [
                        {
                            text: strings.CANCEL,
                            onPress: () => console.log("Cancel Pressed"),
                            // style: 'destructive',
                        },
                        {
                            text: strings.CONTINUE,
                            onPress: () => repeatOrder(item),
                        },
                    ]);
                }}
                _onCustomerEditOrder={_onCustomerEditOrder}
                _onDiscardCustomerEditOrder={_onDiscardCustomerEditOrder}
            />
            // <OrderCardComponent
            //   data={item}
            //   selectedTab={selectedTab}
            //   onPressRateOrder={
            //     selectedTab == strings.PAST_ORDERS ? () => rateYourOrder() : null
            //   }
            //   onPress={() => onPressViewEditAndReplace(item)}
            // />
        );
    };

    //Get list of all orders based on selected tab

    //Get list of all orders
    // useEffect(() => {
    // updateState({ isLoading: true });
    //   if (userData && userData?.auth_token) {
    //     _getListOfOrders();
    //   } else {
    //     updateState({
    //       isLoading: false,
    //     });
    //     actions.setAppSessionData("on_login");
    //   }
    // }, [selectedTab]);

    useEffect(() => {
        updateState({ isLoading: true });
        if (userData && userData?.auth_token) {
            _getListOfOrders();
        } else {
            updateState({
                isLoading: false,
            });
            actions.setAppSessionData("on_login");
        }
    }, [pageActive, pagePastOrder, pageScheduleOrder, isRefreshing, selectedTab]);

    //Refresh screen

    //Pull to refresh
    const handleRefresh = () => {
        console.log(selectedTab, "selectedTab");

        if (userData && userData?.auth_token) {
            if (
                selectedTab == strings.ACTIVE_ORDERS ||
                selectedTab == strings.ACTIVERIDES ||
                selectedTab == strings.ACTIVEDELEIVERIES
            ) {
                updateState({
                    pageActive: 1,
                    tabType: staticStrings.ACTIVE,
                    isRefreshing: true,
                });
            }
            if (
                selectedTab == strings.PAST_ORDERS ||
                selectedTab == strings.PASTRIDES ||
                selectedTab == strings.PASTDELEIVERIES
            ) {
                updateState({
                    pageActive: 1,
                    tabType: staticStrings.PAST,
                    isRefreshing: true,
                });
            }
            if (selectedTab == strings.SCHEDULED_ORDERS) {
                updateState({
                    pageActive: 1,
                    tabType: staticStrings.SCHEDULE,
                    isRefreshing: true,
                });
            }
        }
    };

    //pagination of data
    const onEndReached = ({ distanceFromEnd }) => {
        if (
            selectedTab == strings.ACTIVE_ORDERS ||
            selectedTab == strings.ACTIVERIDES ||
            selectedTab == strings.ACTIVEDELEIVERIES
        ) {
            updateState({ pageActive: pageActive + 1, tabType: staticStrings.ACTIVE });
        }
        if (
            selectedTab == strings.PAST_ORDERS ||
            selectedTab == strings.PASTRIDES ||
            selectedTab == strings.PASTDELEIVERIES
        ) {
            updateState({ pageActive: pagePastOrder + 1, tabType: staticStrings.PAST });
        }
        // if (selectedTab == strings.SCHEDULED_ORDERS) {
        //   updateState({
        //     pageActive: pageScheduleOrder + 1,
        //     tabType: staticStrings.SCHEDULE,
        //   });
        // }
    };

    const onEndReachedDelayed = debounce(onEndReached, 1000, {
        leading: true,
        trailing: false,
    });

    //Give Rating

    const onClose = () => {
        updateState({ isVisibleReturnOrderModal: false });
    };

    const selectProduct = (item) => {
        console.log(item, ">item>item");
        if (selectProductForRetrun && selectProductForRetrun?.id == item?.id) {
            updateState({
                selectProductForRetrun: null,
            });
        } else {
            updateState({
                selectProductForRetrun: item,
            });
        }
    };

    const returnOrder = () => {
        if (selectProductForRetrun) {
            console.log(
                selectProductForRetrun,
                "selectProductForRetrun>>selectProductForRetrun"
            );
            updateState({ isVisibleReturnOrderModal: false, isLoading: true });

            if (isOrderForReplace) {
                actions
                    .getDetailOfProductToReplace(
                        `?return_ids=${selectProductForRetrun?.id}&order_id=${selectProductForRetrun?.order_id}&product_id=${selectProductForRetrun?.product_id}`,
                        {},
                        {
                            code: appData?.profile?.code,
                            currency: currencies?.primary_currency?.id,
                            language: languages?.primary_language?.id,
                        },
                    )
                    .then((res) => {
                        console.log(res, '>>>>>>res');
                        updateState({ isLoading: false });
                        setTimeout(() => {
                            navigation.navigate(navigationStrings.REPLACE_ORDER, {
                                selectProductForRetrun: selectProductForRetrun,
                                reasons:
                                    res?.data?.reasons && res?.data?.reasons.length
                                        ? res?.data?.reasons.map((item, index) => {
                                            (item['value'] = item?.title),
                                                (item['label'] = item?.title);
                                            return item;
                                        })
                                        : [],
                                getOrderDetail: _getListOfOrders,
                            });
                        }, 500);
                    })
                    .catch(errorMethod);
                return;
            }
            actions
                .getReturnProductrDetailData(
                    `?return_ids=${selectProductForRetrun?.id}&order_id=${selectProductForRetrun?.order_id}`,
                    {},
                    {
                        code: appData?.profile?.code,
                        currency: currencies?.primary_currency?.id,
                        language: languages?.primary_language?.id,
                    }
                )
                .then((res) => {
                    updateState({ isLoading: false });
                    setTimeout(() => {
                        navigation.navigate(navigationStrings.RETURNORDER, {
                            selectProductForRetrun: selectProductForRetrun,
                            selectedOrderForReturn: res?.data?.order
                                ? res?.data?.order
                                : selectedOrderForReturn,
                            reasons:
                                res?.data?.reasons && res?.data?.reasons.length
                                    ? res?.data?.reasons.map((item, index) => {
                                        (item['value'] = item?.title),
                                            (item['label'] = item?.title);
                                        return item;
                                    })
                                    : [],
                            getOrderDetail: _getListOfOrders,
                        });
                    }, 500);
                })
                .catch(errorMethod);
        } else {
            showError(strings.PLEASE_SELECT_RETURN_ORDER);
        }
    };


    const listEmptyComp = useCallback(() => {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <NoDataFound
                    image={
                        appStyle?.homePageLayout === 4
                            ? appIds.mml == getBundleId()
                                ? imagePath.notrcukImage
                                : imagePath.noRides
                            : imagePath.noDataFound2
                    }
                    isLoading={state.isLoading}
                    text={
                        appStyle?.homePageLayout === 4
                            ? appIds.mml == getBundleId()
                                ? strings.NODELIVERIESFOUND
                                : appIds.jiffex == getBundleId()
                                    ? strings.NO_ORDERS_FOUND
                                    : strings.NO_RIDE_FOUND
                            : strings.NODATAFOUND
                    }
                />
            </View>
        )
    }, [orders])


    return (
        <WrapperContainer
            bgColor={
                isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
            }
            statusBarColor={colors.white}
            isLoading={isLoading}
        >
            <Header
                noLeftIcon={!backIconShow}
                leftIcon={
                    appStyle?.homePageLayout === 2
                        ? imagePath.backArrow
                        : appStyle?.homePageLayout === 3
                            ? imagePath.icBackb
                            : imagePath.backArrowCourier
                }
                centerTitle={'Order Again'}
                headerStyle={
                    isDarkMode
                        ? { backgroundColor: MyDarkTheme.colors.background }
                        : { backgroundColor: colors.white }
                }
                onPressLeft={()=>navigation.openDrawer()}
            />

            <View style={{ ...commonStyles.headerTopLine }} />

            <FlatList
                // ref={_scrollRef}
                data={orders}
                extraData={orders}
                // data={activeOrders || pastOrders || scheduledOrders}
                // data={[1, 2, 3, 4]}
                renderItem={renderOrders}
                keyExtractor={(item, index) => String(item?.id || index)}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: "center",
                    marginVertical: moderateScaleVertical(20),
                }}
                refreshing={isRefreshing}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={themeColors.primary_color}
                    />
                }
                onEndReached={onEndReachedDelayed}
                onEndReachedThreshold={0.5}
                windowSize={6}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                ListFooterComponent={() => <View style={{ height: 90 }} />}
                ListEmptyComponent={!isLoading && (listEmptyComp())
                }
            />

            <Modal
                transparent={true}
                isVisible={isVisibleReturnOrderModal}
                animationIn={"pulse"}
                animationOut={"pulse"}
                style={[styles.modalContainer]}
            >
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Image source={imagePath.crossB} />
                </TouchableOpacity>
                <View
                    style={
                        isDarkMode
                            ? [
                                styles.modalMainViewContainer,
                                { backgroundColor: MyDarkTheme.colors.lightDark },
                            ]
                            : styles.modalMainViewContainer
                    }
                    onLayout={(event) => {
                        updateState({ viewHeight: event.nativeEvent.layout.height });
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        style={
                            isDarkMode
                                ? [
                                    styles.modalMainViewContainer,
                                    { backgroundColor: MyDarkTheme.colors.lightDark },
                                ]
                                : styles.modalMainViewContainer
                        }
                    >
                        <View
                            style={{
                                // flex: 0.6,
                                // alignItems: 'center',
                                justifyContent: "center",
                                marginTop: 10,
                            }}
                        >
                            <Text
                                style={
                                    isDarkMode
                                        ? [styles.carType, { color: MyDarkTheme.colors.text }]
                                        : styles.carType
                                }>
                                {isOrderForReplace
                                    ? strings.DOYOUWANTTOREPLACEYOURORDER
                                    : strings.DOYOUWANTTORETURNYOURORDER}
                            </Text>
                        </View>
                        <View
                            style={{
                                marginVertical: moderateScaleVertical(10),
                                marginBottom: moderateScale(20),
                            }}
                        >
                            <Text
                                style={
                                    isDarkMode
                                        ? [
                                            styles.selectItemToReturn,
                                            { color: MyDarkTheme.colors.text },
                                        ]
                                        : styles.selectItemToReturn
                                }
                            >
                                {strings.SELECTITEMSFORRETURN}
                            </Text>
                        </View>

                        {selectedOrderForReturn &&
                            selectedOrderForReturn?.vendors &&
                            selectedOrderForReturn?.vendors[0]?.products
                            ? selectedOrderForReturn?.vendors[0]?.products.map(
                                (item, index) => {
                                    return (
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    marginBottom: moderateScaleVertical(20),
                                                }}
                                            >
                                                {item?.product_return ? (
                                                    <View>
                                                        <Text
                                                            style={{
                                                                fontFamily: fontFamily.medium,
                                                                fontSize: moderateScale(14),
                                                                color: isDarkMode
                                                                    ? MyDarkTheme.colors.text
                                                                    : colors.textGreyJ,
                                                            }}
                                                        >
                                                            {item?.product_return?.status}
                                                        </Text>
                                                    </View>
                                                ) : (
                                                    <TouchableOpacity
                                                        onPress={() => selectProduct(item)}
                                                    >
                                                        <Image
                                                            source={
                                                                selectProductForRetrun &&
                                                                    selectProductForRetrun?.product_id ==
                                                                    item?.product_id
                                                                    ? imagePath.radioActive
                                                                    : imagePath.radioInActive
                                                            }
                                                        />
                                                    </TouchableOpacity>
                                                )}

                                                <View style={styles.cartItemImage}>
                                                    <FastImage
                                                        source={
                                                            item?.image != "" && item?.image != null
                                                                ? {
                                                                    uri: getImageUrl(
                                                                        item?.image?.proxy_url,
                                                                        item?.image?.image_path,
                                                                        "300/300"
                                                                    ),
                                                                    priority: FastImage.priority.high,
                                                                }
                                                                : imagePath.patternOne
                                                        }
                                                        style={styles.imageStyle}
                                                    />
                                                </View>
                                                <View style={{ marginLeft: 10 }}>
                                                    <View style={{ overflow: "hidden" }}>
                                                        <Text
                                                            numberOfLines={2}
                                                            style={
                                                                isDarkMode
                                                                    ? [
                                                                        styles.priceItemLabel2,
                                                                        {
                                                                            opacity: 0.8,
                                                                            color: MyDarkTheme.colors.text,
                                                                        },
                                                                    ]
                                                                    : [styles.priceItemLabel2, { opacity: 0.8 }]
                                                            }
                                                        >
                                                            {item?.translation?.title}
                                                        </Text>
                                                    </View>

                                                    {item?.quantity ? (
                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text
                                                                style={
                                                                    isDarkMode
                                                                        ? { color: MyDarkTheme.colors.text }
                                                                        : { color: colors.textGrey }
                                                                }
                                                            >
                                                                {strings.QTY}
                                                            </Text>
                                                            <Text style={styles.cartItemWeight}>
                                                                {item?.quantity}
                                                            </Text>
                                                        </View>
                                                    ) : (
                                                        <TouchableOpacity
                                                            onPress={() => selectProduct(item)}>
                                                            <Image
                                                                source={
                                                                    selectProductForRetrun &&
                                                                        selectProductForRetrun?.product_id ==
                                                                        item?.product_id
                                                                        ? imagePath.radioActive
                                                                        : imagePath.radioInActive
                                                                }
                                                            />
                                                        </TouchableOpacity>
                                                    )}

                                                    <View style={styles.cartItemImage}>
                                                        <FastImage
                                                            source={
                                                                item?.image != '' && item?.image != null
                                                                    ? {
                                                                        uri: getImageUrl(
                                                                            item?.image?.proxy_url,
                                                                            item?.image?.image_path,
                                                                            '300/300',
                                                                        ),
                                                                        priority: FastImage.priority.high,
                                                                    }
                                                                    : imagePath.patternOne
                                                            }
                                                            style={styles.imageStyle}
                                                        />
                                                    </View>
                                                    <View style={{ marginLeft: 10 }}>
                                                        <View style={{ overflow: 'hidden' }}>
                                                            <Text
                                                                numberOfLines={2}
                                                                style={
                                                                    isDarkMode
                                                                        ? [
                                                                            styles.priceItemLabel2,
                                                                            {
                                                                                opacity: 0.8,
                                                                                color: MyDarkTheme.colors.text,
                                                                            },
                                                                        ]
                                                                        : [styles.priceItemLabel2, { opacity: 0.8 }]
                                                                }>
                                                                {item?.translation?.title}
                                                            </Text>
                                                        </View>

                                                        {item?.quantity && (
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Text
                                                                    style={
                                                                        isDarkMode
                                                                            ? { color: MyDarkTheme.colors.text }
                                                                            : { color: colors.textGrey }
                                                                    }>
                                                                    {strings.QTY}
                                                                </Text>
                                                                <Text style={styles.cartItemWeight}>
                                                                    {item?.quantity}
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                        </ScrollView>
                                    );
                                }
                            )
                            : null}
                        <View style={{ height: 50 }} />
                    </ScrollView>
                    <View
                        style={[
                            styles.bottomAddToCartView,
                            { top: viewHeight - height / 12 },
                        ]}
                    >
                        <GradientButton
                            colorsArray={[
                                themeColors.primary_color,
                                themeColors.primary_color,
                            ]}
                            // textStyle={styles.textStyle}
                            onPress={returnOrder}
                            marginTop={moderateScaleVertical(10)}
                            marginBottom={moderateScaleVertical(10)}
                            btnText={strings.SELECT}
                        />
                    </View>
                </View>
            </Modal>
        </WrapperContainer>
    )

}
