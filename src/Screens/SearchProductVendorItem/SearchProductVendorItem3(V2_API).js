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
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { getCurrentLocation } from '../../utils/helperFunctions';
import { useFocusEffect } from '@react-navigation/native';
import Voice from '@react-native-voice/voice';
import { isEmpty } from 'lodash';
import { enableFreeze } from "react-native-screens";
import HorizontalLine from '../../Components/HorizontalLine';
import { UIActivityIndicator } from 'react-native-indicators';
enableFreeze(true);

let isNoMore = false;
let onEndReachedCalledDuringMomentum = false;

export default function SearchProductVendorItem3V2({ navigation, route }) {
  //route params
  const paramData = route?.params?.data;
  console.log('param data', paramData);
  const [state, setState] = useState({
    isLoading: true,
    searchInput: !!paramData?.voiceInput || '',
    searchData: [],
    pageCount: 1,
    isLoadMore: false,
    showShimmer: false,
    userCurrentLatitude: null,
    userCurrentLongitude: null,
    isVoiceRecord: false,
    showRightIcon: false,
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

  const { appMainData } = useSelector((state) => state?.home);
  if (!isEmpty(appMainData) && !isEmpty(appMainData?.homePageLabels)) {
    var recommendedVendorsdata = appMainData?.homePageLabels?.filter(
      (itm) => itm?.slug == 'best_sellers',
    );
  }
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
    // data['latitude'] = !!location?.latitude
    //   ? location?.latitude
    //   : userCurrentLatitude;
    // data['longitude'] = !!location?.longitude
    //   ? location?.longitude
    //   : userCurrentLongitude;
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
      searchAction = actions.onGlobalSearchV2;
    }
    console.log(data, 'query +++', query);
    searchAction(query, data, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    })
      .then((response) => {
        console.log('res==>>>>++ search', response);
        const planeArry = []
        response.data.map((val, i) => {
          val.result.map((item, i) => {
            planeArry.push({
              type: item?.response_type,
              id: item?.id,
              name: item?.name || item?.translation[0]?.title
            })
          })
        })

        console.log('res==>>>>++ planeArry', planeArry);
        updateState({
          searchData: planeArry,
          isLoading: false,
          isLoadMore: false,
          showShimmer: false,
        });

        return;
        if (response.data.length == 0) {
          isNoMore = true;
        }
        let searchDataToUpdate = [...searchData];
        let resposneData = [...response.data];
        if (!isEmpty(searchDataToUpdate)) {
          searchDataToUpdate.map((item, index) => {
            resposneData.map((itm, indx) => {
              if (item?.id === itm?.id) {
                let indxToUpdate = searchDataToUpdate.findIndex(
                  (i, inx) => i?.id == itm?.id,
                );
                searchDataToUpdate[indxToUpdate].result = [
                  ...searchDataToUpdate[indxToUpdate].result,
                  ...itm?.result,
                ];
              }
            });
          });
        }
        updateState({
          searchData: searchAgain ? resposneData : searchDataToUpdate,
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

  console.log(searchData, 'searchData....searchData');

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

      if (searchInput.trim() && searchInput.length > 1) {
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
        console.log('calling.....2');
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
      if (item.redirect_to == staticStrings.P2P) {
        moveToNewScreen(navigationStrings.P2P_PRODUCTS, item)();
      } else if (item?.redirect_to == staticStrings.VENDOR) {
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
          {data && data.length
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

  const renderSearchResults = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => _onclickSearchItem(item)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={item?.image_url ? { uri: item?.image_url } : imagePath.icGold2}
          style={{
            height: 30,
            width: 30,
            borderRadius: moderateScale(15),
          }}
        />
        <Text
          numberOfLines={2}
          style={{
            fontFamily: fontFamily.regular,
            fontSize: textScale(12),
            marginHorizontal: moderateScale(8),
            color: isDarkMode
              ? MyDarkTheme.colors.text
              : colors.black,
            textAlign: 'justify'
          }}>
          {item?.dataname || item?.title || item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const onPresItem = (item) => {
    navigation.navigate(navigationStrings.VIEW_ALL_SEARCH_ITEM, {
      view_type: item?.type,
      searchText: item?.name.toLowerCase(),
    })
  }

  const renderProduct = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={String(item?.id || index)}
        onPress={() => onPresItem(item)}
      >
        <View style={{
          flexDirection: "row",
          alignItems: 'center',
          paddingHorizontal: moderateScale(12)
        }}>
            <View style={{flex:0.08}}>
          <Image style={{
            tintColor: isDarkMode? colors.white: colors.black
          }} source={imagePath.icSearchb} />
          </View>
          <View style={{flex:0.8}}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: textScale(12),
              fontFamily: fontFamily.bold,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
          >
            {item?.name || ''}
          </Text>
          </View>
          <View style={{flex:0.1,alignItems:'flex-end'}}>
          <Image style={{
            transform: [{ rotate: '-60deg' }],
          tintColor: isDarkMode? colors.whiteOpacity50: colors.grayOpacity51
          }} source={imagePath.searchArrow} />
          </View>
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
        {!!searchInput && searchInput?.length > 1 ? null : (
          <>
            {!isEmpty(previousSearches) ? (
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
            {/* {!isEmpty(recommendedVendorsdata[0]?.data) && (
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
                  data={recommendedVendorsdata[0]?.data}
                  renderItem={renderRecommendedVendors}
                  keyExtractor={(item, index) => String(item?.id || index)}
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
            )} */}
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

            <Image
              source={imagePath.icBackb}
              style={{
                tintColor: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.black,
                transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
              }}
            />

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
            <View style={{flex:0.5, alignItems:'center',justifyContent:'center'}}>
                <UIActivityIndicator color={themeColors?.primary_color || colors.blueB} />
              </View>
          ) : (
            <FlatList
              data={searchData}
              renderItem={renderProduct}
              keyExtractor={(item, index) => String(item?.id || index)}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
              ListEmptyComponent={_listEmptyComponent}
              ItemSeparatorComponent={() => (
                <HorizontalLine lineStyle={{ 
                  marginVertical: moderateScaleVertical(10),
                  borderBottomColor: isDarkMode? colors.whiteOpacity50: colors.blackOpacity10
                 }} />
              )}
              // onEndReached={onEndReached}
              ListHeaderComponent={() => (
                <View style={{ height: moderateScale(16) }} />
              )}
              extraData={searchData}
              ListFooterComponent={
                isLoadMore ? (
                  <View style={styles.bottomLoader}>
                    <FooterLoader />
                  </View>
                ) : (
                  <View style={{ height: moderateScale(80) }} />
                )
              }
            />
          )}
        </View>
      </View>
    </WrapperContainer>
  );
}
