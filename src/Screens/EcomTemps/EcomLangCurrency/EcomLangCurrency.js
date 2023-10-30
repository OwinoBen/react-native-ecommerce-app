import { BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    I18nManager,
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import RNRestart from 'react-native-restart';
import { useSelector } from 'react-redux';
import Header from '../../../Components/Header';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import SearchBar from '../../../Components/SearchBar';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings, { changeLaguage } from '../../../constants/lang/index';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFunc from '../../../styles/commonStyles';
import { moderateScale, moderateScaleVertical, textScale } from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { setItem } from '../../../utils/utils';
import stylesFunc from './styles';
import FastImage from 'react-native-fast-image';
import { setCountry } from '../../../redux/actions/init';

export default function EcomLangCurrency({ route, navigation }) {
    const {
        currencies,
        appData,
        languages,
        appStyle,
        themeColors,
        themeToggle,
        themeColor,
        primary_country
    } = useSelector((state) => state?.initBoot);
    const { data = {} } = route?.params || {}


    let renderType = data.type == "language" ? strings.LANGUAGES : data.type == 'country' ? strings.COUNTRY : strings.CURRENCIES
    let renderIndex = data?.renderIndex

    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    console.log("appDataappData", appData)


    const flatListRef = useRef(null)


    const [serachText, setSearchText] = useState('')

    const initialState = {
        appCurrencies: currencies || [],
        appLanguages: languages || [],
        appCountries: appData?.countries || []
    }

    const [state, setState] = useState({
        isLoading: false,
        ...initialState
    });

    const {
        isLoading,
        appCurrencies,
        appLanguages,
        appCountries
    } = state;
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFunc({ fontFamily, themeColors });
    const commonStyles = commonStylesFunc({ fontFamily });

    console.log("appCountriesappCountries", appCountries)


    const updateCurrency = (item) => {
        const data = currencies.all_currencies.filter((x) => x.id == item.id)[0];
        if (data.iso_code !== currencies.primary_currency.iso_code) {
            let currenciesData = {
                ...currencies,
                primary_currency: data,
            };
            setItem('setPrimaryCurrent', currenciesData);
            actions.updateCurrency(data);
            updateState({ appCurrencies: currenciesData })
        }
    };

    //Update language
    const updateLanguage = (item) => {
        console.log(item, 'itemmmm');
        const data = languages.all_languages.filter((x) => x.id == item.id)[0];
        // console.log(data, "setLang")
        if (data.sort_code !== languages.primary_language.sort_code) {
            let languagesData = {
                ...languages,
                primary_language: data,
            };
            // updateState({isLoading: true});
            setItem('setPrimaryLanguage', languagesData);
            setTimeout(() => {
                updateState({ isLoading: false });
                actions.updateLanguage(data);
                onSubmitLang(data.sort_code, languagesData);
            }, 1000);
        }
    };

    //update language all over the app
    const onSubmitLang = async (lang) => {
        if (lang == '') {
            showAlertMessageError(strings.SELECT);
            return;
        } else {
            let btData = {};
            AsyncStorage.getItem('BleDevice').then(async (res) => {
                if (res !== null) {
                    btData = res;
                    await AsyncStorage.setItem('autoConnectEnabled', 'true');
                    await AsyncStorage.setItem('BleDevice2', btData);
                    console.log('++++++22', btData);
                    if (lang === 'ar' || lang === 'he') {
                        I18nManager.forceRTL(true);
                        setItem('language', lang);
                        changeLaguage(lang);
                        RNRestart.Restart();
                    } else {
                        I18nManager.forceRTL(false);
                        setItem('language', lang);
                        changeLaguage(lang);
                        RNRestart.Restart();
                    }
                    BluetoothManager.disconnect(JSON.parse(res).boundAddress).then(
                        (s) => { },
                    );
                } else {
                    if (lang === 'ar' || lang === 'he') {
                        I18nManager.forceRTL(true);
                        setItem('language', lang);
                        changeLaguage(lang);
                        RNRestart.Restart();
                    } else {
                        I18nManager.forceRTL(false);
                        setItem('language', lang);
                        changeLaguage(lang);
                        RNRestart.Restart();
                    }
                }
            });
        }
    };

    const renderLanguage = ({ item }) => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: moderateScaleVertical(12)
                }}
                activeOpacity={0.7}
                onPress={() => updateLanguage(item)}
            >
                <View>
                    <Text style={{
                        ...commonStyles.mediumFont14,
                        color: isDarkMode ? colors.white : colors.black,
                        textTransform: 'uppercase',
                        marginBottom: moderateScaleVertical(4)
                    }} >{item?.sort_code}</Text>
                    <Text style={{
                        ...commonStyles.mediumFont12,
                        color: isDarkMode ? colors.white : colors.blackOpacity70,
                        fontFamily: fontFamily.regular
                    }}>{item?.name || item?.value}</Text>
                </View>
                {appLanguages?.primary_language?.id == item?.id ? <Image style={{ tintColor: themeColors.primary_color }} source={imagePath.curLangCheck} /> : null}
            </TouchableOpacity>
        )
    }

    const renderCurrency = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: moderateScaleVertical(12)
                }}
                activeOpacity={0.7}
                onPress={() => updateCurrency(item)}
            >
                <View>
                    <Text style={{
                        ...commonStyles.mediumFont14,
                        color: isDarkMode ? colors.white : colors.black,
                        textTransform: 'uppercase',
                        marginBottom: moderateScaleVertical(4)
                    }} >{item?.iso_code}</Text>
                    <Text style={{
                        ...commonStyles.mediumFont12,
                        color: isDarkMode ? colors.white : colors.blackOpacity70,
                        fontFamily: fontFamily.regular
                    }}>{item?.name || item?.value}</Text>
                </View>
                {appCurrencies?.primary_currency?.id == item.id ? <Image style={{ tintColor: themeColors.primary_color }} source={imagePath.curLangCheck} /> : null}
            </TouchableOpacity>
        )
    }



    const searchCountry = (array = [], searchText) => {
        let result = []
        array.filter(function (item) {
            console.log("itemitem", item)
            let searchFirstKey = item?.country?.nicename
            if (searchFirstKey?.toLowerCase().includes(searchText.toLowerCase())) {
                result.push(item)
            }
        });
        return result
    }

    const updateCountry = (data) => {
        let countryData = { primary_country: data }
        setItem('setPrimaryCountry', countryData).then((res) => {
            setCountry(countryData)
        }).catch((error) => alert("Country not saved"))
    }


    const renderCountries = useCallback(({ item, index }) => {
        let data = item?.country
        return (
            <View style={{ height: 60 }}>
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        alignItems: 'center',
                        marginBottom: moderateScaleVertical(12),
                        justifyContent: 'space-between',

                    }}
                    activeOpacity={0.7}
                    onPress={() => updateCountry(data)}
                >
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <FastImage
                            source={{ uri: data?.flag }}
                            style={{
                                width: moderateScale(36),
                                height: moderateScale(24),
                                marginRight: moderateScale(8)
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />

                        <View>
                            <Text style={{
                                ...commonStyles.mediumFont14,
                                color: primary_country?.primary_country?.id == data?.id ? themeColors?.primary_color : isDarkMode ? colors.white : colors.black,
                            }} >{data?.nicename}</Text>
                        </View>
                    </View>
                    {primary_country?.primary_country?.id == data?.id? <Image style={{ tintColor: themeColors.primary_color }} source={imagePath.curLangCheck} /> : null}
                </TouchableOpacity>
            </View>
        )
    }, [primary_country])





    // useEffect(() => {
        // const arrayObjects = Object.entries(jsonObject).map(([key, value]) => ({
        //     country: { ...value, iso_code: key },
        // }));
        // if (renderIndex == 1) {
        //     updateState({ countries: arrayObjects, initialCountries: arrayObjects })

        //     if (!!flatListRef?.current) {
        //         // Find the index of the item in the data array
        //         const index = arrayObjects.findIndex((listItem) => listItem.country.iso_code == countryFlag);
        //         console.log("indexindex", index)
        //         if (index >= 0) {
        //             setTimeout(() => {
        //                 flatListRef.current.scrollToIndex({ 
        //                     index:index,
        //                     viewPosition: 0.5
        //                  });
        //             }, 700);
        //         }
        //     }
        // }
    // }, [])


    function searchObjects(array, searchText) {

        let type = data.type == "language" ? 'sort_code' : 'iso_code'
        let result = []

        array.filter(function (item) {

            console.log("itemitem", item)
            let searchFirstKey = item[`${type}`]
            let searchSecondKey = item?.value || item?.name
            if (searchFirstKey?.toLowerCase().includes(searchText.toLowerCase())) {
                result.push(item)
            } else if (searchSecondKey?.toLowerCase().includes(searchText.toLowerCase())) {
                result.push(item)
            }
        });
        return result
    }
    const filterData = (text = '') => {
        console.log("texttext", text)
        setSearchText(text)
        if (renderIndex == 3) {
            let result = searchObjects(initialState.appLanguages.all_languages, text)
            console.log("language resultresult", result)
            updateState({ appLanguages: { ...initialState.appLanguages, all_languages: result } })
            return;
        }

        if (renderIndex == 2) {
            let result = searchObjects(initialState.appCurrencies.all_currencies, text)
            console.log("currency resultresult", result)
            updateState({ appCurrencies: { ...initialState.appCurrencies, all_currencies: result } })
            return
        }

        if (renderIndex == 1) {
            let result = searchCountry(initialState.appCountries, text)
            updateState({ appCountries: result })
            return
        }
    }


    const getItemLayout = (data, index) => ({
        length: 60,
        offset: 60 * index,
        index,
    });


    return (
        <WrapperContainer
            bgColor={
                isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
            }
            statusBarColor={colors.white}
            source={loaderOne}
            isLoadingB={isLoading}>
            <Header
                leftIcon={
                    appStyle?.homePageLayout === 2
                        ? imagePath.backArrow
                        : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                            ? imagePath.icBackb
                            : imagePath.back
                }
                centerTitle={renderType}
                // rightIcon={imagePath.cartShop}
                headerStyle={
                    isDarkMode
                        ? { backgroundColor: MyDarkTheme.colors.background }
                        : { backgroundColor: colors.white }
                }

            />

            <View style={{ ...commonStyles.headerTopLine }} />
            <View style={{
                flex: 1,
                paddingHorizontal: moderateScale(16),
                backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white
            }}>

                <SearchBar
                    containerStyle={{
                        marginVertical: moderateScaleVertical(8),
                        height: moderateScale(38),
                        backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity10,
                        borderRadius: moderateScale(8)
                    }}
                    // showRightIcon={false}
                    showVoiceRecord={false}
                    placeholder={`Search ${renderType}`}
                    onChangeText={(text) => filterData(text)}
                    searchValue={serachText}
                />

                <View
                    style={{
                        flex: 1,
                        backgroundColor: isDarkMode
                            ? MyDarkTheme.colors.background
                            : colors.white

                    }}>

                    {renderIndex == 3 ?
                        <FlatList
                            data={appLanguages?.all_languages || []}
                            extraData={appCurrencies.all_languages}
                            renderItem={renderLanguage}
                            keyExtractor={(item, index) => String(item?.id || index)}

                        />
                        : renderIndex == 1 ?
                            <FlatList
                                ref={flatListRef}
                                data={appCountries}
                                extraData={appCountries}
                                renderItem={renderCountries}
                                keyExtractor={(item, index) => String(item?.country_id || index)}
                                onScrollToIndexFailed={() => console.log("failed")}
                                getItemLayout={getItemLayout}
                            /> :

                            <FlatList
                                data={appCurrencies?.all_currencies || []}
                                extraData={appCurrencies.all_currencies}
                                renderItem={renderCurrency}
                                keyExtractor={(item, index) => String(item?.id || index)}
                            />
                    }
                </View>

            </View>
        </WrapperContainer>
    );
}
