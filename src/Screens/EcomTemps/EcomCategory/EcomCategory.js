import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import WrapperContainer from '../../../Components/WrapperContainer';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
    moderateScale,
    moderateScaleVertical,
    textScale
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { shortCodes } from '../../../utils/constants/DynamicAppKeys';

import { Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import EcomBrandCard from '../../../Components/EcomBrandCard';
import EcomHeader from '../../../Components/EcomHeader';
import staticStrings from '../../../constants/staticStrings';
import actions from '../../../redux/actions';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../../../utils/helperFunctions';
import stylesFunc from './styles';

export default function EcomCategory({ navigation, route }) {
    const { data = null } = route?.params || {};
    console.log(data, 'paramsData');

    const { location, appMainData, dineInType } = useSelector((state) => state?.home || {});

    const userData = useSelector((state) => state?.auth?.userData || {});

    const [allCategories, setAllCategories] = useState([])




    useEffect(() => {
        const checkLayout = appMainData?.homePageLabels || []
        const filterCat = checkLayout.find(layout => layout?.slug == 'nav_categories')
        setAllCategories(filterCat?.data || [])

    }, [appMainData?.homePageLabels])


    const {
        appStyle,
        appData,
        themeColors,
        fontFamily,
        languages,
        themeColor,
        themeToggle,
        currencies
    } = useSelector((state) => state.initBoot);
    const categoryData = useSelector((state) => state?.vendor?.categoryData);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    const styles = stylesFunc({ themeColors, fontFamily });


    const [childList, setChildList] = useState([])
    const [selectedItem, setSelectdItem] = useState(null)


    const animation = useSharedValue(0)

    const viewStyle = useAnimatedStyle(() => {
        const marginTop = interpolate(
            animation?.value,
            [0, 1, 0],
            [0, 10, 0],
            Extrapolate.CLAMP,
        );
        return {
            marginTop,
        }
    })



    // useEffect(() => {
    //     if (item.id == curIndex) {
    //       animation.value = withTiming(1);
    //       return;
    //     }
    //     animation.value = withTiming(0);
    //   }, [selectedItem?.id]);



    const [state, setState] = useState({
        isLoading: false,
        pageNo: 1,
        limit: 5,
        isRefreshing: false,
        listData: []
    });
    const { isLoading, limit, pageNo, isRefreshing, listData } = state;

    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    //Naviagtion to specific screen
    const moveToNewScreen =
        (screenName, data = {}) =>
            () => {
                navigation.navigate(screenName, { data });
            };





    const onPressCategory = useCallback((item, index) => {

        console.log("item?.redirect_to", item)


        if (item?.redirect_to == staticStrings.P2P) {
            moveToNewScreen(navigationStrings.P2P_PRODUCTS, item)();
            return;
        }
        if (item?.redirect_to == staticStrings.FOOD_TEMPLATE) {
            moveToNewScreen(navigationStrings.SUBCATEGORY_VENDORS, item)();

            return;
        }
        if (item.redirect_to == staticStrings.VENDOR) {

            moveToNewScreen(navigationStrings.VENDOR, item)();
        } else if (
            item.redirect_to == staticStrings.PRODUCT ||
            item.redirect_to == staticStrings.CATEGORY ||
            item.redirect_to == staticStrings.ONDEMANDSERVICE ||
            item?.redirect_to == staticStrings.LAUNDRY ||
            item?.redirect_to == staticStrings.APPOINTMENT ||
            item?.redirect_to == staticStrings.RENTAL
        ) {
            moveToNewScreen(navigationStrings.PRODUCT_LIST, {
                fetchOffers: true,
                id: item.id,
                vendor:
                    item.redirect_to == staticStrings.ONDEMANDSERVICE ||
                        item.redirect_to == staticStrings.PRODUCT ||
                        item?.redirect_to == staticStrings.LAUNDRY ||
                        item?.redirect_to == staticStrings.APPOINTMENT ||
                        item?.redirect_to == staticStrings.RENTAL
                        ? false
                        : true,
                name: item.name,
                isVendorList: false,
            })();
        } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
            if (!!userData?.auth_token) {
                if (shortCodes.arenagrub == appData?.profile?.code) {
                    //   openUber();
                } else {
                    item['pickup_taxi'] = true;
                    moveToNewScreen(navigationStrings.ADDADDRESS, item)();
                }
            } else {
                actions.setAppSessionData('on_login');
            }
        } else if (item.redirect_to == staticStrings.DISPATCHER) {
            // moveToNewScreen(navigationStrings.DELIVERY, item)();
        } else if (item.redirect_to == staticStrings.CELEBRITY) {
            moveToNewScreen(navigationStrings.CELEBRITY)();
        } else if (item.redirect_to == staticStrings.BRAND) {
            moveToNewScreen(navigationStrings.CATEGORY_BRANDS, item)();
        } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
            if (appStyle?.homePageLayout === 10) {
                if (item.id !== selectedItem?.id) {
                    setSelectdItem(item)
                    setChildList(item?.children || [])
                } else {
                    setSelectdItem(null)
                    setChildList([])
                }
                return;
            }
            moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
        } else if (!item.is_show_category || item.is_show_category) {
            item?.is_show_category
                ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
                    item,
                    rootProducts: true,
                    // categoryData: data,
                })()
                : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
                    id: item?.id,
                    vendor: true,
                    name: item?.name,
                    isVendorList: true,
                    fetchOffers: true,
                })();
        }
    }, [shortCodes, appData, selectedItem, childList])



    useEffect(() => {
        setTimeout(() => {
            animation.value = withTiming(1);
        }, 1500);
      }, []);


    const _renderItem = useCallback(({ item, index }) => {
        return (
                <EcomBrandCard
                    data={item}
                    onPress={() => onPressCategory(item, index)}
                    imageHeight={80}
                    imageWidth={80}
                    selectedItem={selectedItem}
                    index={index}
                />
        )
    }, [!!allCategories && allCategories || [], selectedItem, childList])


    const itemSeparatorComponent = ({ leadingItem }) =>
        leadingItem.map((val, i) => {
            if (val.id == selectedItem.id) {
                return renderChildView()
            }
        })


    const renderChildView = (height = 0) => {
        return (
            <View
                style={{
                    backgroundColor: colors.white,
                    borderRadius: 4,
                    // shadowColor: '#000',
                    // shadowOffset: { width: 0, height: 1 },
                    // shadowOpacity: 0.1,
                    // shadowRadius: 2,
                    // elevation: 2,
                    marginHorizontal: 24,
                    marginBottom: 10,
                    padding: 8,
                    borderRadius: 8,
                    position: 'relative',
                    marginBottom: moderateScaleVertical(24)

                }}
            >
                <Animatable.View
                    // animation={'bounceInDown'}
                    style={{

                    }}>
                    {childList.map((data, i) => {
                        const imageURI = data?.icon
                            ? getImageUrl(data.icon.image_fit, data.icon.image_path, `${140}/${140}`)
                            : getImageUrl(data.image.image_fit, data.image.image_path, `${140}/${140}`);

                        const isSVG = imageURI ? imageURI.includes('.svg') : null;

                        return (
                            <TouchableOpacity
                                style={{ marginTop: 8, flexDirection: "row", alignItems: 'center' }}
                                onPress={() => _checkRedirectScreen(data)}
                            >
                                {isSVG ? (
                                    <SvgUri
                                        height={40}
                                        width={40}
                                        uri={imageURI}
                                    />
                                ) : (
                                    <FastImage
                                        source={{
                                            uri: imageURI,
                                            priority: FastImage.priority.high,
                                            cache: FastImage.cacheControl.immutable,
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                        style={{
                                            height: 60,
                                            width: 60,
                                            borderRadius: moderateScale(10),
                                            backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.grayOpacity51
                                        }}
                                    />
                                )}
                                <Text style={{
                                    marginLeft: 8,
                                    fontSize: textScale(16),

                                }}>{data?.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </Animatable.View>
                <View style={{ height: moderateScale(height) }} />
            </View>
        )
    }



    const _checkRedirectScreen = (item) => {

        console.log("itemitemitemitemitem", item)
        {
            item?.is_show_category
                ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
                    item,
                    rootProducts: true,
                    categoryData: data,
                })()
                : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
                    id: item.id,
                    vendor: false,
                    name: item.name,
                    category_slug: data?.slug,
                    fetchOffers: true,
                    categoryExist: data?.id || null,
                })();
        }
    };

    return (
        <WrapperContainer
            bgColor={
                isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
            }
            statusBarColor={
                isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
            }>          
            <EcomHeader
                isDarkMode={isDarkMode}
                navigation={navigation}
                style={{ marginVertical: moderateScaleVertical(16) }}
                themeColors={themeColors}
                appStyle={appStyle}
                showLeftIcon={false}
                defaultBottomColor={70}
            />
            <LinearGradient
                colors={[getColorCodeWithOpactiyNumber(
                    themeColors.primary_color.substr(1),
                    60), getColorCodeWithOpactiyNumber(
                        themeColors.primary_color.substr(1),
                        40), getColorCodeWithOpactiyNumber(
                            themeColors.primary_color.substr(1),
                            10)]}
                style={{ flex: 1 }}
            >

                <View style={{ marginHorizontal: moderateScale(8) }}>
                    <FlatList
                        data={!!allCategories && allCategories || []}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={<View style={{ height: 10 }} />}
                        keyExtractor={(item, index) => String(index)}
                        ItemSeparatorComponent={!!selectedItem ? itemSeparatorComponent : null}
                        numColumns={3}
                        renderItem={_renderItem}
                        ListFooterComponent={() =>
                            allCategories.slice(-3).map(it => {
                                if (it?.id === selectedItem?.id) {
                                    return renderChildView(40) //sending height
                                }
                            })
                        }
                    />
                </View>
            </LinearGradient>
        </WrapperContainer>
    );
}
