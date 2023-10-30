//import liraries
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
    Menu, MenuOption, MenuOptions, MenuTrigger
} from 'react-native-popup-menu';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import GradientCartView from '../../../Components/GradientCartView';
import Header from '../../../Components/Header';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import { moderateScale, moderateScaleVertical, textScale } from '../../../styles/responsiveSize';
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import { hapticEffects, showError, showSuccess } from '../../../utils/helperFunctions';
import { removeItem } from '../../../utils/utils';
import stylesFunc from './styles';
import { MyDarkTheme } from '../../../styles/theme';



// create a component
const AvailableTechnicians = ({ navigation, route }) => {
    // navigation.navigate(navigationStrings.ORDER_DETAIL);
    const paramData = route?.params?.data;
    console.log(paramData, 'paramData =>')
    const moveToNewScreen = (screenName, data) => () => {
        navigation.navigate(screenName, { data });
    };
    const darkthemeusingDevice = useDarkMode();
    const {
        appData,
        themeColors,
        themeLayouts,
        currencies,
        languages,
        themeColor,
        themeToggle,
        redirectedFrom,
        appStyle,
    } = useSelector((state) => state?.initBoot || {})
    const { dineInType } = useSelector((state) => state?.home || {});
    const CartItems = useSelector((state) => state?.cart?.cartItemCount || {});
    const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences;

    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const styles = stylesFunc({ themeColors, isDarkMode });

    const [state, setState] = useState({
        isLoadingC: true, availablePersonData: [], menuOpened: false, menuSortOption: ["By Price", "By Rating"], selectedSortOption: '',
    });
    const { isLoadingC, availablePersonData, menuOpened, menuSortOption, selectedSortOption, } = state;

    const updateState = (data) => { setState((state) => ({ ...state, ...data })) };

    const errorMethod = (error) => {
        console.log('checking error', error);
        updateState({ isLoadingC: false, });
        showError(error?.message || error?.error);
    };

    useEffect(() => {
        actions.sendProductBookingData(paramData,
            {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                systemuser: DeviceInfo.getUniqueId(),
            })
            .then((res) => {
                if (!!res?.data) {
                    console.log(res, "<===res sendProductBookingData");
                    if (isEmpty(selectedSortOption)) {
                        updateState({
                            availablePersonData: res?.data,
                            isLoadingC: false,
                        })
                    } else {
                        if (selectedSortOption === "By Price") {
                            const priceSort = res?.data.sort((a, b) =>
                                Number(a?.product_prices[0]?.price).toFixed(2).localeCompare(Number(b?.product_prices[0]?.price).toFixed(2)));
                            console.log("priceSort", priceSort);
                            updateState({
                                availablePersonData: priceSort,
                                isLoadingC: false,
                            })
                        } else {
                            const ratingSort = res?.data.sort((a, b) =>
                                Number(a?.rating).toFixed(2).localeCompare(Number(b?.rating)));
                            console.log("ratingSort", ratingSort);
                            updateState({
                                availablePersonData: ratingSort,
                                isLoadingC: false,
                            })

                        }
                    }
                }
            })
            .catch(errorMethod)
    }, [selectedSortOption,])

    const itemSeparator = () => {
        return (
            <View style={{ marginTop: moderateScaleVertical(10) }} />
        )
    }
    const ListFooterComponent = () => {
        return (
            <View style={{ marginBottom: moderateScaleVertical(100) }} />
        )
    }

    const addToCart = (data) => {
        if (!isEmpty(CartItems?.data) && !isEmpty(CartItems?.data?.products) && CartItems?.data?.products[0].dispatch_agent_id !== data?.id) {
            showError(strings.SELECT_SAME_PROVIDER_SERVICE)
            return
        }
        updateState({
            isLoadingC: true
        })
        let cartData = {};
        cartData['sku'] = paramData?.sku;
        cartData['quantity'] = paramData.qty || 1;
        cartData['product_variant_id'] = paramData?.variant_id;
        cartData['type'] = dineInType;
        cartData['dispatcherAgentData'] = {
            ["agent_price"]: data?.product_prices[0]?.price,
            ["agent_id"]: data?.id,
            ["address_id"]: paramData?.address_id,
            ["slot"]: paramData?.slot,
            ["onDemandBookingdate"]: paramData?.bookingdateTime,
        };
        actions
            .addProductsToCart(cartData, {
                code: appData.profile.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                systemuser: DeviceInfo.getUniqueId(),
            })
            .then((res) => {
                console.log(res, '<===res addProductsToCart');
                actions.cartItemQty(res);
                showSuccess(strings.ADDED_CART)
                updateState({ cartId: res.data.id, isLoadingC: false });
                moveToNewScreen(navigationStrings.CART)()
            })
            .catch(errorMethod);
    }



    const onProfilePress = (driverStatus) => {
        moveToNewScreen(navigationStrings.TECHNICIAN_PROFILE, { driverData: driverStatus })();
    }


    const renderItem = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ ...styles.renderView, width: '95%' }} onPress={() => addToCart(item)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
                        <View style={{ flex: 0.2 }}>
                            <Image style={styles.imgStyle} source={{ uri: item.image_url }} />
                        </View>
                        <View style={{ flex: 0.5 }}>
                            <Text style={styles.nameStyle}>{item.name}</Text>
                            <Text style={styles.jobPercentage}>{strings.JOBS_DONE} {item.complete_order_count}</Text>
                        </View>
                        <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                            <StarRating
                                maxStars={5}
                                rating={Number(item?.rating)}
                                fullStarColor={colors.ORANGE}
                                starSize={15}
                            />
                            <Text style={styles.priceStyle}>{Number(item?.product_prices[0]?.price).toFixed(2)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    height: moderateScaleVertical(74),
                    backgroundColor: colors.lightGray,
                    justifyContent: 'center',
                    borderRadius: moderateScale(4),
                    width: '5%'
                }} onPress={() => onProfilePress(item)}>
                    <Image
                        style={{ ...styles.imageStyle2, transform: [{ rotate: '270deg' }] }}
                        resizeMode="contain"
                        source={imagePath.dropDownNew}

                    />
                </TouchableOpacity>
            </View>
        )
    }

    const playHapticEffect = (effect = 'clockTick') => {
        const options = {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: true,
        };

        ReactNativeHapticFeedback.trigger(effect, options);
    };


    const bottomButtonClick = () => {
        removeItem('selectedTable');
        setTimeout(() => {
            clearEntireCart();
        }, 1000);
    };

    const clearEntireCart = () => {
        actions
            .clearCart(
                {},
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                    systemuser: DeviceInfo.getUniqueId(),
                },
            )
            .then((res) => {
                actions.cartItemQty({});
                console.log(res, '<==res clearCart');
                updateState({
                    isLoadingB: false,
                });
                showSuccess(res?.message);
            })
            .catch(errorMethod);
    };

    const onClickSort = () => {
        updateState({ menuOpened: !menuOpened })
    }

    return (
        <WrapperContainer
            isLoading={isLoadingC}
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
            <Header centerTitle={strings.AVAILABLE_TECHNICIANS} />
            <View style={{
                backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.background
                    : colors.white,
                flex: 1,
            }}>
                <View style={styles.container}>
                    <View style={styles.textView}>
                        <View style={{ flex: 0.8 }}>
                            <Text style={styles.timeServiceStyle}>{strings.TIME_AND_SERVICE_SELECTION}</Text>
                        </View>

                        <View style={{ flex: 0.4, }}>
                            <Menu style={{ alignSelf: 'center' }} opened={menuOpened} onBackdropPress={onClickSort}>
                                <MenuTrigger onPress={onClickSort}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.pickerView}>
                                            <Text style={{ ...styles.textStyleTime, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
                                                {selectedSortOption ? selectedSortOption : strings.SORT}
                                            </Text>
                                            <Image
                                                style={[styles.imageStyle,]}
                                                resizeMode="contain"
                                                source={imagePath.newsort}
                                            />
                                        </View>
                                        {!isEmpty(selectedSortOption) &&
                                            <TouchableOpacity onPress={() => updateState({ selectedSortOption: '', })}>
                                                <Image
                                                    style={{ ...styles.imageStyle2, marginLeft: moderateScale(6) }}
                                                    resizeMode="contain"
                                                    source={imagePath.cross}
                                                />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </MenuTrigger>
                                <MenuOptions
                                    customStyles={{
                                        optionsContainer: {
                                            marginTop: moderateScaleVertical(36),
                                            width: moderateScale(80),
                                            height: moderateScale(80),
                                        },
                                        optionsWrapper: {
                                            width: moderateScale(80),
                                            height: moderateScale(80),
                                        },
                                    }}>
                                    <ScrollView>
                                        {menuSortOption.map((item, index) => {
                                            return (
                                                <View key={index}>
                                                    <MenuOption
                                                        onSelect={() => updateState({ selectedSortOption: item, menuOpened: !menuOpened })}
                                                        key={String(index)}
                                                        text={item}
                                                        style={{
                                                            marginVertical: moderateScaleVertical(5),
                                                            backgroundColor: selectedSortOption === item ? colors.greyColor : colors.whiteOpacity15
                                                        }}
                                                        customStyles={{
                                                            optionText: { textAlign: 'center', }
                                                        }}
                                                    />
                                                    <View style={styles.borderOption} />
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                </MenuOptions>
                            </Menu>

                        </View>
                    </View>
                    <View style={{ marginTop: moderateScaleVertical(28) }}>
                        <FlatList
                            keyExtractor={(item, index) => String(index)}
                            showsVerticalScrollIndicator={false}
                            data={availablePersonData}
                            renderItem={renderItem}
                            ItemSeparatorComponent={itemSeparator}
                            ListFooterComponent={ListFooterComponent}
                            ListEmptyComponent={() => (
                                <View>
                                    <FastImage
                                        source={imagePath.noDataFound}
                                        resizeMode="contain"
                                        style={{
                                            width: moderateScale(140),
                                            height: moderateScale(140),
                                            alignSelf: 'center',
                                            marginTop: moderateScaleVertical(30),
                                        }}
                                    />
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: textScale(11),
                                            fontFamily: fontFamily.regular,
                                            marginHorizontal: moderateScale(10),
                                            lineHeight: moderateScale(20),
                                            marginTop: moderateScale(5),
                                        }}>
                                        {`No Technician Found`}
                                    </Text>
                                </View>
                            )}
                        />

                    </View>

                </View>

                <GradientCartView
                    onPress={() => {
                        playHapticEffect(hapticEffects.notificationSuccess);
                        moveToNewScreen(navigationStrings.CART)()
                    }}
                    btnText={
                        CartItems && CartItems.data && CartItems.data.item_count
                            ? `${CartItems.data.item_count} ${CartItems.data.item_count == 1
                                ? strings.ITEM
                                : strings.ITEMS
                            } | ${tokenConverterPlusCurrencyNumberFormater(
                                Number(CartItems?.data?.gross_paybale_amount),
                                digit_after_decimal,
                                additional_preferences,
                                currencies?.primary_currency?.symbol,
                            )}`
                            : ''
                    }
                    ifCartShow={CartItems && CartItems.data && CartItems.data.item_count > 0 ? true : false}
                    btnStyle={{ position: 'absolute' }}
                />
            </View>
        </WrapperContainer >
    );
};



//make this component available to the app
export default AvailableTechnicians;
