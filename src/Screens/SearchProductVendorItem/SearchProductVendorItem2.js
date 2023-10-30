import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  I18nManager,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
import {
  loaderOne,
  searchLoader,
} from '../../Components/Loaders/AnimatedLoaderFiles';
import SearchBar from '../../Components/SearchBar';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc, { hitSlopProp } from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { appIds, shortCodes } from '../../utils/constants/DynamicAppKeys';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../styles/theme';
import LottieView from 'lottie-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MarketCard3 from '../../Components/MarketCard3';
import { setItem } from '../../utils/utils';
import RoundImg from '../../Components/RoundImg';
import FooterLoader from '../../Components/FooterLoader';
import styles from './styles';
import CircularLoader from '../../Components/Loaders/CircularLoader';
import CircularProfileLoader from '../../Components/Loaders/CircularProfileLoader';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { getCurrentLocation } from '../../utils/helperFunctions';
import { useFocusEffect } from '@react-navigation/native';
import Voice from '@react-native-voice/voice';
import { getBundleId } from 'react-native-device-info';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);

let isNoMore = false;
let onEndReachedCalledDuringMomentum = false;

export default function SearchProductVendorItem2({ navigation, route }) {
  //route params
  const paramData = route?.params?.data;
  console.log('param data', paramData);
  const [state, setState] = useState({
    isLoading: true,
    searchInput: !!paramData?.voiceInput ? paramData?.voiceInput : '',
    searchData: [],
    showRightIcon: false,
    pageCount: 1,
    isLoadMore: false,
    showShimmer: false,
    userCurrentLatitude: null,
    userCurrentLongitude: null,
    isVoiceRecord: false,
  });

  const { location } = useSelector((state) => state?.home);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const previousSearches = useSelector((state) => state?.initBoot?.searchText);
  const dineInType = useSelector((state) => state?.home?.dineInType);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {
    isLoading,
    searchInput,
    searchData,
    showRightIcon,
    recentlySearched,
    trendingNearYou,
    pageCount,
    isLoadMore,
    showShimmer,
    userCurrentLatitude,
    userCurrentLongitude,
    isVoiceRecord,
  } = state;
  const { appData, themeColors, themeLayouts, currencies, languages, appStyle } =
    useSelector((state) => state?.initBoot);

  const appMainData = useSelector((state) => state?.home?.appMainData);
  const recommendedVendorsdata = appMainData?.vendors || [];
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({ fontFamily });

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const onChangeText = (value) => {
    updateState({
      searchInput: value,
      isLoading: false,
    });
  };
  console.log(paramData, 'paramData');
  userCurrentLatitude, userCurrentLongitude;

  useFocusEffect(
    useCallback(() => {
      Voice.onSpeechStart = onSpeechStartHandler;
      Voice.onSpeechEnd = onSpeechEndHandler;
      Voice.onSpeechResults = onSpeechResultsHandler;
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []),
  );

  const onSpeechStartHandler = (e) => { };
  const onSpeechEndHandler = (e) => {
    updateState({
      isVoiceRecord: false,
    });
  };

  const onSpeechResultsHandler = (e) => {
    let text = e.value[0];
    updateState({
      searchInput: text,
    });
    onVoiceStop();
  };

  const onVoiceListen = async () => {
    updateState({
      isVoiceRecord: true,
    });
    const langType = languages?.primary_language?.sort_code;

    try {
      await Voice.start(langType);
    } catch (error) {
      console.log('error raised', error);
    }
  };

  console.log('lcoaiton latit', location);
  const onVoiceStop = async () => {
    updateState({
      isVoiceRecord: false,
    });
    try {
      await Voice.stop();
    } catch (error) {
      console.log('error raised', error);
    }
  };

  //Global searching of data
  const globalSearch = (pageCount, searchAgain = false) => {
    let data = {};
    data['keyword'] = searchInput;
    data['type'] = dineInType;
    data['limit'] = 10;
    data['latitude'] = !!location?.latitude
      ? location?.latitude
      : userCurrentLatitude;
    data['longitude'] = !!location?.longitude
      ? location?.longitude
      : userCurrentLongitude;
    data['page'] = pageCount;
    let query = '';
    let searchAction = null;
    if (paramData?.type == staticStrings.CATEGORY) {
      query = `/${paramData.id}`;
      searchAction = actions.onSearchByCategory;
    } else if (paramData?.type == staticStrings.VENDOR) {
      query = `/${paramData.id}`;
      searchAction = actions.onSearchByVendor;
    } else if (paramData?.type == staticStrings.BRAND) {
      query = `/${paramData.id}`;
      searchAction = actions.onSearchByBrand;
    } else {
      searchAction = actions.onGlobalSearch;
    }
    console.log(data, 'query +++', query);
    searchAction(query, data, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    })
      .then((response) => {
        console.log('res==>>>>++', response);
        if (response?.data?.length == 0) {
          isNoMore = true;
        }
        updateState({
          searchData: searchAgain
            ? response?.data
            : [...searchData, ...response?.data],
          pageCount: searchAgain ? 1 : pageCount + 1,
          isLoading: false,
          isLoadMore: false,
          showShimmer: false,
        });
      })
      .catch((error) => {
        console.log(error, 'errororors');
        updateState({
          searchData: [],
          isLoading: false,
          showShimmer: false,
          isLoadMore: false,
        });
      });
  };

  // useEffect(() => {
  //   if (searchInput != '') {
  //     updateState({ showRightIcon: true });
  //     globalSearch(1);
  //   } else {
  //     updateState({ searchData: [], showRightIcon: false, isLoading: false });
  //   }
  // }, [searchInput]);

  // userCurrenetLocation

  const currentLocation = () => {
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
  };

  useEffect(() => {
    currentLocation();
    const searchInterval = setTimeout(() => {
      let searchObj = {};
      if (searchInput.trim()) {
        updateState({
          searchLoader: true,
          showRightIcon: true,
          pageCount: 1,
          showShimmer: true,
        });
        searchObj.search_text = searchInput;
        isNoMore = false;
      }
      if (!!searchObj.search_text) {
        globalSearch(1, true); //search from start
      } else {
        updateState({
          searchData: [],
          showRightIcon: false,
          isLoading: false,
          searchLoader: false,
          showShimmer: false,
        });
      }
    }, 600);
    return () => {
      if (searchInterval) {
        clearInterval(searchInterval);
      }
    };
  }, [searchInput]);

  const _onclickSearchItem = (item) => {
    console.log(item, 'clickedItem');
    const searchResultExists = previousSearches?.some(
      (recent) => recent.id === item.id,
    );
    if (searchResultExists) {
    } else {
      console.log(item, 'itemitem');
      actions.addSearchResults(item);
      const lastSearch = [...previousSearches, item];
      setItem('searchResult', lastSearch);
    }

    if (item.response_type == 'category') {
      if (item?.redirect_to == staticStrings.P2P) {
        navigation.push(navigationStrings.P2P_PRODUCTS, {
          data: {
            id: item.id,
            name: item.dataname,
          },
        });
      }
      else if (item?.redirect_to == staticStrings.VENDOR) {
        navigation.push(navigationStrings.VENDOR, {
          data: {
            id: item.id,
            name: item.dataname,
          },
        });
      } else if (
        item?.redirect_to == staticStrings.PRODUCT ||
        item.redirect_to == staticStrings.ONDEMANDSERVICE
      ) {
        navigation.push(navigationStrings.PRODUCT_LIST, {
          data: {
            id: item.id,
            name: item.dataname,
          },
        });
      } else {
        // moveToNewScreen(navigationStrings.DELIVERY, item)();
      }
    }
    if (item.redirect_to == staticStrings.SUBCATEGORY) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
    }
    if (item?.response_type == 'brand') {
      navigation.push(navigationStrings.BRANDDETAIL, {
        data: {
          id: item.id,
          name: item.dataname,
        },
      });
    }
    if (item?.response_type == 'vendor') {
      navigation.push(navigationStrings.PRODUCT_LIST, {
        data: {
          id: item.id,
          vendor: true,
          name: item.dataname,
          fetchOffers: true,
        },
      });
    }
    if (item?.response_type == 'product') {
      navigation.push(navigationStrings.PRODUCTDETAIL, { data: { id: item.id } });
    }
  };

  const onPressRecommendedVendors = (item) => {
    if (!item.is_show_category || item.is_show_category) {
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
        })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  const _clearRecentSearches = () => {
    actions.deleteSearchResults();
  };

  const onEndReached = () => {
    if (!onEndReachedCalledDuringMomentum && !isNoMore) {
      updateState({ isLoadMore: true });
      globalSearch(pageCount + 1);
    }
  };

  const onClickRecent = (item) => {
    console.log('item+++++', item);
    // return;
    updateState({
      searchInput: item?.dataname || item?.name,
      isLoading: false,
    });
  };

  const recentlyData = (data) => {
    // console.log(data, 'data');
    return (
      <View
        style={{
          marginVertical: moderateScaleVertical(10),
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            // justifyContent: 'space-between',
          }}>
          {data && data?.length
            ? data.map((item, index) => {
              console.log(item, 'itemitem');
              return (
                <View>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      borderColor: colors.textGreyB,
                      borderWidth: 0.5,
                      borderRadius: 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: moderateScale(5),
                      paddingHorizontal: moderateScale(5),
                      paddingVertical: moderateScaleVertical(7),
                      marginVertical: moderateScaleVertical(5),
                    }}
                    onPress={() => onClickRecent(item)}
                    key={index}>
                    <View>
                      <Image
                        style={
                          isDarkMode
                            ? {
                              tintColor: MyDarkTheme.colors.text,
                              opacity: 0.7,
                              marginHorizontal: moderateScale(5),
                            }
                            : {
                              opacity: 0.7,
                              marginHorizontal: moderateScale(5),
                            }
                        }
                        source={imagePath.recently_search}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: fontFamily.medium,
                          color: colors.greyLight,
                        }}>
                        {item?.dataname || item?.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
            : null}
        </View>
      </View>
    );
  };

  const renderProduct = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => _onclickSearchItem(item)}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: moderateScale(20),
        }}>
        {!!item?.image_url && (
          <RoundImg
            img={item?.image_url}
            size={35}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
          />
        )}
        <View style={{ flex: 1, marginLeft: moderateScale(12) }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: textScale(12),
              fontFamily: fontFamily.medium,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {item?.dataname || item?.title || item?.name}
          </Text>
          {/* <Text
            style={{
              fontSize: textScale(9),
              fontFamily: fontFamily.regular,
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.grayOpacity51,
              marginTop: moderateScaleVertical(5),
            }}>
            Dish
          </Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecommendedVendors = ({ item }) => {
    return (
      <View
        style={{
          width: moderateScale(width / 2),
          marginLeft: moderateScale(10),
        }}>
        <MarketCard3
          data={item}
          fastImageStyle={{
            height: moderateScaleVertical(110),
          }}
          imageResizeMode="cover"
          onPress={() => onPressRecommendedVendors(item)}
          isMaxSaftey={false}
        />
      </View>
    );
  };

  const _listEmptyComponent = () => {
    return (
      <View>
        {searchInput ? null : (
          <>
            {previousSearches?.length > 0 ? (
              <View style={{ marginHorizontal: moderateScale(20) }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',

                    width: width - 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: width - 16,
                    }}>
                    <Text
                      style={{
                        fontSize: textScale(16),
                        fontFamily: fontFamily.medium,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                      }}>
                      {strings.RECENTLY_SEARCH}
                    </Text>
                    <TouchableOpacity onPress={() => _clearRecentSearches()}>
                      <Text
                        style={{
                          paddingHorizontal: moderateScale(20),
                          fontSize: textScale(12),
                          fontFamily: fontFamily.regular,
                          color: themeColors.primary_color,
                        }}>
                        {strings.CLEAR}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>{recentlyData(previousSearches)}</View>
              </View>
            ) : null}
            {!!recommendedVendorsdata?.length && (
              <View>
                <Text
                  style={{
                    fontSize: textScale(16),
                    fontFamily: fontFamily.medium,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    marginHorizontal: moderateScale(20),
                  }}>
                  {strings.RECOMMENDED_FOR_YOU}
                </Text>

                <FlatList
                  horizontal
                  data={recommendedVendorsdata}
                  renderItem={renderRecommendedVendors}
                  keyExtractor={(item, index) => item?.id.toString()}
                  keyboardShouldPersistTaps="always"
                  showsHorizontalScrollIndicator={false}
                  style={{
                    flex: 1,
                    marginVertical: moderateScaleVertical(5),
                    paddingVertical: moderateScaleVertical(5),
                  }}
                  // ListEmptyComponent={_listEmptyComponent}
                  ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
                />
              </View>
            )}
          </>
        )}
      </View>
    );
  };
  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: moderateScale(8),
            marginTop: moderateScale(5),
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={{
              flex: 0.2,
            }}
            hitSlop={hitSlopProp}>
            {getBundleId() == appIds.sorDelivery ? null : (
              <Image
                source={
                  appStyle?.homePageLayout === 3 ||
                    appStyle?.homePageLayout === 5 ||
                    appStyle?.homePageLayout === 6
                    ? imagePath.icBackb
                    : imagePath.back
                }
                style={{
                  tintColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.black,
                  transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                }}
              />
            )}
          </TouchableOpacity>

          <SearchBar
            containerStyle={{
              marginRight: moderateScale(18),
              borderRadius: 8,
              width: width / 1.12,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
              height: moderateScaleVertical(37),
              marginLeft: moderateScale(25),
            }}
            searchValue={searchInput}
            placeholder={strings.SEARCH_PRODUCT_VENDOR_ITEM}
            onChangeText={(value) => onChangeText(value)}
            showRightIcon={showRightIcon}
            rightIconPress={() =>
              updateState({ searchInput: '', isLoading: false })
            }
            autoFocus={true}
            isVoiceRecord={isVoiceRecord}
            onVoiceStop={onVoiceStop}
            onVoiceListen={onVoiceListen}
          />
        </View>

        <View style={{ flex: 1 }}>
          {showShimmer ? (
            <View
              style={{
                flex: 1,
                marginHorizontal: moderateScale(20),
                marginTop: moderateScaleVertical(24),
              }}>
              {[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}].map(() => {
                return (
                  <ContentLoader style={{ height: moderateScale(54) }}>
                    <Circle cx="20" cy="20" r="20" />
                    <Rect x="50" y="14" rx="2" ry="2" width="100" height="8" />
                  </ContentLoader>
                );
              })}
            </View>
          ) : (
            <FlatList
              data={searchData}
              renderItem={renderProduct}
              keyExtractor={(item, index) => String(index)}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
              ListEmptyComponent={_listEmptyComponent}
              ItemSeparatorComponent={() => (
                <View style={{ height: moderateScale(20) }} />
              )}
              onEndReached={onEndReached}
              ListHeaderComponent={() => (
                <View style={{ height: moderateScale(16) }} />
              )}
              extraData={searchData}
              ListFooterComponent={
                () => {
                  return (
                    isLoadMore ? (
                      <View style={{ height: moderateScaleVertical(100) }}>
                        <FooterLoader style={{ color: themeColors?.primary_color }} />
                      </View>
                    ) : (
                      <View style={{ height: moderateScale(80) }} />
                    )
                  )
                }
              }
            />
          )}
        </View>
      </View>
    </WrapperContainer>
  );
}
