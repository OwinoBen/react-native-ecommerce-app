import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';

import MarketCard3 from '../../Components/MarketCard3';
import NoDataFound from '../../Components/NoDataFound';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun, { hitSlopProp } from '../../styles/commonStyles';
import {
    height,
    moderateScale,
    moderateScaleVertical,
    width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import FooterLoader from '../../Components/FooterLoader';

import { enableFreeze } from "react-native-screens";
import { UIActivityIndicator } from 'react-native-indicators';
import { getCurrentLocation } from '../../utils/helperFunctions';
import BrandCard3 from '../../Components/BrandCard3';
import staticStrings from '../../constants/staticStrings';
import { shortCodes } from '../../utils/constants/DynamicAppKeys';
import ProductsComp3 from '../../Components/ProductsComp3';
import SearchBar from '../../Components/SearchBar';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import SearchVendorLoader from './SearchVendorLoader';
import SearchProductLoader from './SearchProductLoader';
import SearchCategoryLoader from './SearchCategoryLoader';
import { isEmpty } from 'lodash';

enableFreeze(true);

let isNoMore = false;
let pageCount = 1
let limit = 20
let onEndReachedCalledDuringMomentum = false

export default function ViewAllSearchItems({ route, navigation }) {
    const { appData, themeColors, currencies, languages, appStyle } = useSelector((state) => state.initBoot || {});
    const userData = useSelector((state) => state?.auth?.userData || {});

    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
    const { appMainData, dineInType, location } = useSelector((state) => state?.home || {});
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    const fontFamily = appStyle?.fontSizeData;
    const commonStyles = commonStylesFun({ fontFamily });

    const { view_type, searchText } = route?.params || ''


    const [searchInput, setSearchInput] = useState(searchText)

    const [state, setState] = useState({
        isLoading: true,
        data: [],
        loadMore: true,
        userCurrentLatitude: null,
        userCurrentLongitude: null,
    });

    const {
        isLoading,
        data,
        loadMore,
        userCurrentLatitude,
        userCurrentLongitude,
    } = state;

    //update state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    useEffect(() => {
        getCurrentLocation()
            .then((res) => {
                updateState({
                    userCurrentLatitude: res?.latitude,
                    userCurrentLongitude: res?.longitude,
                });
            })
            .catch((error) => {
                console.log(error, ' error in response for current location');
            });
    }, [])


    useEffect(() => {
        isNoMore = false
        pageCount = 1
        const searchInterval = setTimeout(() => {
            updateState({ isLoading: true })
            apiHit(1, true); //default value 1 for pageNo and searchAgain true
        }, 400);
        return () => {
            if (searchInterval) {
                clearInterval(searchInterval);
            }
        };
    }, [searchInput]);


    const onChangeText = (value) => {
        setSearchInput(value)
        updateState({
            isLoading: false,
        });
    };

    const rightIconPress = () => {
        setSearchInput('')
        updateState({ isLoading: false })
    }


    //Home data
    const apiHit = (pageNo, searchAgain = false) => {

        if (!!appData?.profile?.preferences?.is_hyperlocal) {
            latlongObj = {
                latitude: location?.latitude,
                longitude: location?.longitude,
            };
        }
        let data = {};
        data['keyword'] = searchInput;
        data['type'] = dineInType;
        data['limit'] = limit;
        data['latitude'] = !!location?.latitude
            ? location?.latitude
            : userCurrentLatitude;
        data['longitude'] = !!location?.longitude
            ? location?.longitude
            : userCurrentLongitude;
        data['page'] = pageNo;
        data['view_type'] = view_type || 'category'


        let headers = {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
        };
        console.log(data, 'sending data+++');


        actions.viewAllSearchItemV2('', data, headers)
            .then((res) => {
                console.log('search data++++++', res?.data);
                if (!!res?.data && !isEmpty(res?.data)) {
                    let mergeData = pageNo == 1 ? res?.data[0]?.result : [...state.data, ...res?.data[0]?.result]
                    console.log("merging data", mergeData)
                    isNoMore = false
                    updateState({
                        data: mergeData,
                        isLoading: false,
                        pageCount: searchAgain ? 1 : pageNo + 1,
                        loadMore: false
                    });

                } else {
                    isNoMore = true
                    updateState({
                        isLoading: false,
                        loadMore: false,
                    })
                }

            })
            .catch((error) => {
                console.log('error raised', error);
                updateState({
                    isLoading: false,
                    loadMore: false,
                });
            });
    };


    //Naviagtion to specific screen
    const moveToNewScreen = (screenName, data = {}) => {
       return () => {
            navigation.navigate(screenName, { data });
        }
    }

    const _checkRedirectScreen = useCallback((item) => {
        {
            item?.is_show_category
                ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
                    item,
                    rootProducts: true,
                    categoryData: data,
                })()
                : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
                    id: item.id,
                    vendor: true,
                    name: item.name,
                    isVendorList: true,
                    fetchOffers: true,
                })();
        }
    }, [])


    const onPressCategory = useCallback((item) => {

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
                vendor: item?.redirect_to == staticStrings.ONDEMANDSERVICE ||
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
            // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
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
    }, [shortCodes, appData])



    const renderViewType = useCallback((item) => {
        switch (view_type) {
            case 'category':
                return (
                    <BrandCard3
                        data={item}
                        onPress={() => onPressCategory(item)}
                    />)
            case 'product':
                return (
                    <View style={{
                        width: '50%',
                        marginRight: moderateScale(4),

                    }}>
                        {console.log("itemitemitem",item)}
                        <ProductsComp3
                            item={item}
                            onPress={() =>
                                navigation.push(navigationStrings.PRODUCTDETAIL, { data: item })
                            }
                            containerStyle={{
                                width: '100%',
                                minHeight: height / 3.5,
                            }}
                            numberOfLines={1}
                        />
                    </View>)
            case 'vendor':
                return (
                    <View style={{
                        flex: 1
                    }}>
                        <MarketCard3 onPress={() => _checkRedirectScreen(item)} data={item} />
                    </View>
                )
            case 'brand':
                return (<BrandCard3
                    data={item}
                    onPress={() => onPressCategory(item)}
                />)

            default:
                break;
        }
    }, [view_type])



    const _renderItem = useCallback(({ item }) => {
        return (renderViewType(item))
    }, [data])


    const onEndReached = useCallback(() => {
        if (!isNoMore) {
            pageCount = pageCount + 1
            updateState({ loadMore: true });
            apiHit(pageCount, false);
        } else {
            isNoMore = true
        }
    }, [pageCount, isNoMore])


    const numColumnsReturn = () => {
        switch (view_type) {
            case 'vendor':
                return 1
            case 'brand':
                return 3
            case 'product':
                return 2
            case 'category':
                return 3
            default:
                return 1
        }
    }


    const loaderReturn = () => {

        switch (view_type) {
            case 'vendor':
                return (<SearchVendorLoader />)
            case 'brand':
                return (<SearchCategoryLoader />)
            case 'product':
                return (<SearchProductLoader />)
            case 'category':
                return (<SearchCategoryLoader />)
            default:
                return (<SearchVendorLoader />)
        }
    }



    return (
        <WrapperContainer
            bgColor={
                isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
            }
            statusBarColor={colors.backgroundGrey}>

            <View style={styles.headerView}>

                <View style={{ flex: 0.1 }}>
                    <TouchableOpacity
                        hitSlop={hitSlopProp}
                        activeOpacity={0.7}
                        onPress={() => navigation.goBack()}>
                        <Image
                            source={imagePath.icBackb}
                            style={{ tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 0.88 }}>
                    <SearchBar
                        containerStyle={{
                            // marginRight: moderateScale(18),
                            borderRadius: 8,
                            width: '100%',
                            backgroundColor: isDarkMode
                                ? colors.whiteOpacity15
                                : colors.greyColor,
                            height: moderateScaleVertical(42),

                        }}
                        searchValue={searchInput}
                        placeholder={strings.SEARCH_PRODUCT_VENDOR_ITEM}
                        onChangeText={(value) => onChangeText(value)}
                        showRightIcon={!!searchInput ? true : false}
                        rightIconPress={rightIconPress}
                        autoFocus={false}
                        showVoiceRecord={false}
                    />
                </View>
            </View>
            <View style={{ marginHorizontal: moderateScale(8) }}>
                {isLoading ?
                    <>{loaderReturn()}</>
                    : <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data}
                        extraData={data}
                        ItemSeparatorComponent={() => <View style={{ height: moderateScale(8) }} />}
                        numColumns={numColumnsReturn()}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={_renderItem}
                        onEndReachedThreshold={0.05}
                        onEndReached={onEndReached}
                        initialNumToRender={10}
                        onMomentumScrollBegin={onEndReachedCalledDuringMomentum}
                        ListEmptyComponent={
                            !isLoading && (
                                <View
                                    style={{
                                        flex: 1,
                                        marginTop: moderateScaleVertical(width / 2),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <NoDataFound isLoading={isLoading} />
                                </View>
                            )
                        }
                        ListFooterComponent={!!loadMore ?
                            <View style={{ marginBottom: moderateScale(100), marginTop: moderateScaleVertical(24) }}>

                                <UIActivityIndicator
                                    color={themeColors.primary_color}
                                    size={30}
                                />
                            </View>

                            : <View style={{ height: moderateScale(120) }} />}
                    />}
            </View>
        </WrapperContainer>
    );
}


const styles = StyleSheet.create({
    headerView: {
        flexDirection: "row",
        alignItems: 'center',
        marginBottom: moderateScaleVertical(16),
        marginHorizontal: moderateScale(8)
    }
})