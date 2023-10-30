import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  ScrollView, Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import colors from '../../styles/colors';
import { MyDarkTheme } from '../../styles/theme';
import { useSelector } from 'react-redux';
import { useDarkMode } from 'react-native-dynamic';
import actions from '../../redux/actions';
import Header3 from '../../Components/Header3';
import HomeCategoryCard2 from '../../Components/HomeCategoryCard2';
import BannerLoader from '../../Components/Loaders/BannerLoader';
import CategoryLoader2 from '../../Components/Loaders/CategoryLoader2';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import MarketCard3 from '../../Components/MarketCard3';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';


import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../styles/responsiveSize';
import { getImageUrl, showError } from '../../utils/helperFunctions';
import stylesFunc from './styles';
import DeliveryTypeComp from '../../Components/DeliveryTypeComp';
import * as Animatable from 'react-native-animatable';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import FastImage from 'react-native-fast-image';
import SearchBar3 from '../../Components/SearchBar3';


export default function SubcategoryVendor({ navigation, route }) {
  const paramData = route?.params?.data;
  const {
    appData,
    currencies,
    languages,
    appStyle,
    isDineInSelected,
    themeColor,
    themeToggle,
    themeColors,
  } = useSelector((state) => state?.initBoot);
  const { appMainData, dineInType, location } = useSelector(
    (state) => state?.home,
  );
  const { userData } = useSelector((state) => state?.auth);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });

  const [subcategoryVendorData, setSubcategoryVendorData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState({});
  const [isApiLoading, setApiLoading] = useState(false);
  const [selectedTabType, setSelectedTabType] = useState({});

  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  useEffect(() => {
    getSubCategoryVendors();
  }, [selectedFilter, selectedTabType]);

  const getSubCategoryVendors = useCallback(() => {
    if (!isEmpty(selectedFilter)) {
      setApiLoading(true);
    }
    let latlongObj = {};
    if (appData?.profile?.preferences?.is_hyperlocal) {
      latlongObj = {
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
    }
    let vendorFilterData = {
      open_vendor: selectedFilter?.id == 1 ? 1 : 0,
      close_vendor: selectedFilter?.id == 2 ? 1 : 0,
      best_vendor: selectedFilter?.id == 3 ? 1 : 0,
    };

    actions
      .getSubCategoryVendors(
        {
          type: selectedTabType,
          category_id: paramData?.id,
          ...latlongObj,
          ...vendorFilterData,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'res>>>>>>res...res');
        setApiLoading(false);
        setLoading(false);
        setSubcategoryVendorData(res?.data);
      })
      .catch(errorMethod);
  }, [selectedFilter]);

  //Error handling in screen
  const errorMethod = useCallback((error) => {
    setApiLoading(false);
    setLoading(false);
    showError(error?.message || error?.error);
  }, []);

  const onPressVendor = (item) => {
    console.log('item+++', item);

    if (item?.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (shortCodes.arenagrub == appData?.profile?.code) {
          openUber();
        } else {
          item['pickup_taxi'] = true;
          moveToNewScreen(navigationStrings.ADDADDRESS, item)();
        }
      } else {
        actions.setAppSessionData('on_login');
      }
    } else if (!!item?.is_show_category) {
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
        item,
        rootProducts: true,
      })();
    } else {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        id: item?.id,
        vendor: true,
        name: item?.name,
        isVendorList: true,
        fetchOffers: true,
      })();
    }
  };

  const onPressCategory = (item) => {
    if (item.redirect_to == staticStrings.VENDOR) {
      moveToNewScreen(navigationStrings.VENDOR, item)();
    } else if (
      item.redirect_to == staticStrings.PRODUCT ||
      item.redirect_to == staticStrings.CATEGORY ||
      item.redirect_to == staticStrings.ONDEMANDSERVICE ||
      item?.redirect_to == staticStrings.LAUNDRY
    ) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        fetchOffers: true,
        id: item.id,
        vendor:
          item.redirect_to == staticStrings.ONDEMANDSERVICE
            ? false
            : item.redirect_to == staticStrings.PRODUCT
              ? false
              : true,
        name: item.name,
        isVendorList: false,
      })();
    } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (shortCodes.arenagrub == appData?.profile?.code) {
          openUber();
        } else {
          item['pickup_taxi'] = true;
          moveToNewScreen(navigationStrings.ADDADDRESS, item)();
        }
      } else {
        actions.setAppSessionData('on_login');
      }
    } else if (item.redirect_to == staticStrings.DISPATCHER) {
    } else if (item.redirect_to == staticStrings.CELEBRITY) {
      moveToNewScreen(navigationStrings.CELEBRITY)();
    } else if (item.redirect_to == staticStrings.BRAND) {
      moveToNewScreen(navigationStrings.CATEGORY_BRANDS, item)();
    } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
    } else if (!item.is_show_category || item.is_show_category) {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
          item,
          rootProducts: true,
        })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: item?.id,
          vendor: true,
          name: item?.name,
          isVendorList: true,
          fetchOffers: true,
        })();
    }
  };

  const openUber = () => {
    let appName = 'Uber - Easy affordable trips';
    let appStoreLocale = '';
    let playStoreId = 'com.ubercab';
    let appStoreId = '368677368';
    AppLink.maybeOpenURL('uber://', {
      appName: appName,
      appStoreId: appStoreId,
      appStoreLocale: appStoreLocale,
      playStoreId: playStoreId,
    })
      .then((res) => { })
      .catch((err) => {
        Linking.openURL('https://www.uber.com/in/en/');
        console.log('errro raised', err);
      });
  };

  const onViewAll = (type, data) => {
    console.log(data, 'type+++++', type);
    navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
      data: data,
      type: type,
    });
  };

  const _renderItem = useCallback(({ item, index }) => {
    return (
      <HomeCategoryCard2
        data={item}
        onPress={() => onPressCategory(item)}
        isLoading={isLoading}
      />
    );
  }, []);

  const renderBanners = useCallback(({ item }) => {
    const imageUrl = getImageUrl(item.image_fit, item.image_path, '400/600');
    return (
      <FastImage
        source={{
          uri: imageUrl,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.immutable,
        }}
        style={{
          height: height / 3.8,
          width: moderateScale(160),
          borderRadius: moderateScale(16),
          backgroundColor: isDarkMode
            ? colors.whiteOpacity15
            : colors.greyColor,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  }, []);

  const vendorHeader = useCallback(() => {
    if (appData?.profile?.preferences?.single_vendor) {
      return (
        <View
          style={{
            marginBottom: moderateScaleVertical(24),
            marginTop: moderateScaleVertical(8),
          }}
        />
      );
    }
    return (
      <View key={Math.random()}>
        <View style={{ ...styles.viewAllVeiw }}>
          <Text
            numberOfLines={1}
            style={{
              ...styles.exploreStoresTxt,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              marginTop: 0,
              flex: 1,
              fontFamily: fontFamily.medium,
            }}>
            {`${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`}
          </Text>

          {!isEmpty(subcategoryVendorData?.vendors) && (
            <TouchableOpacity
              style={{ marginHorizontal: moderateScale(4) }}
              onPress={() => onViewAll('vendor', appMainData?.vendors)}>
              <Text style={styles.viewAllText}>{strings.VIEW_ALL}</Text>
            </TouchableOpacity>
          )}
          <Menu style={{ alignSelf: 'flex-end' }}>
            <MenuTrigger>
              <View style={styles.menuView}>
                <Image
                  style={{
                    height: moderateScaleVertical(16),
                    width: moderateScale(16),
                    tintColor: themeColors.primary_color,
                  }}
                  resizeMode="contain"
                  source={imagePath.sort}
                />
                <Text
                  style={{
                    fontSize: textScale(12),
                    marginHorizontal: moderateScale(5),
                    fontFamily: fontFamily.regular,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {isEmpty(selectedFilter)
                    ? strings.RELEVANCE
                    : selectedFilter?.type}
                </Text>
              </View>
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: {
                  marginTop: moderateScaleVertical(36),
                  width: moderateScale(100),
                },
              }}>
              {[
                { id: 1, type: strings.OPEN },
                { id: 2, type: strings.CLOSE },
                { id: 3, type: strings.BESTSELLER },
              ]?.map((item, index) => {
                return (
                  <View key={index}>
                    <MenuOption
                      onSelect={() => setSelectedFilter(item)}
                      key={String(index)}
                      text={item?.type}
                      style={{
                        marginVertical: moderateScaleVertical(5),
                      }}
                    />
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: colors.greyColor,
                      }}
                    />
                  </View>
                );
              })}
            </MenuOptions>
          </Menu>
        </View>
      </View>
    );
  }, [selectedFilter, subcategoryVendorData]);
  const _renderVendors = useCallback(
    ({ item, index }) => (
      <View style={{ marginHorizontal: moderateScale(16) }}>
        <MarketCard3
          data={item}
          onPress={() => onPressVendor(item)}
          extraStyles={{ margin: 2 }}
        />
      </View>
    ),
    [],
  );

  const selectedToggle = useCallback(
    (type) => {
      if (dineInType != type) {
        {
          actions.dineInData(type);
          setSelectedTabType(type);
          setApiLoading(true);
        }
      }
    },
    [dineInType],
  );

  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.white
      }
      isLoading={isApiLoading}
      isSafeArea={false}
      >
        <SafeAreaView>
      <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity 
        
        onPress={() => navigation.goBack()} hitSlop={{
            top: 50,
            right: 50,
            left: 50,
            bottom: 50,
        }} style={{ marginLeft: moderateScale(8)}}>
          <Image style={{tintColor: isDarkMode? colors.white: colors.black}} source={imagePath.backArrowCourier} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <SearchBar3
            onPress={() => navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)}
            containerStyle={{
              marginVertical: moderateScaleVertical(0),
              marginBottom: moderateScaleVertical(0),
              height: moderateScale(38),
              backgroundColor:   isDarkMode ?colors.whiteOpacity22: colors.blackOpacity10
            }}
          />
        </View>
      </View>
      </SafeAreaView>
      <DeliveryTypeComp selectedToggle={selectedToggle} />
      {isLoading ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <CategoryLoader2 viewStyles={{ marginVertical: moderateScale(16) }} />

          {appStyle?.homePageLayout === 5 ? (
            <CategoryLoader2 viewStyles={{ marginBottom: moderateScale(16) }} />
          ) : null}
          {appStyle?.homePageLayout === 5 ? (
            <View
              style={{
                flexDirection: 'row',
                marginBottom: moderateScaleVertical(16),
              }}>
              <HeaderLoader
                widthLeft={moderateScale(width / 1.2)}
                rectWidthLeft={moderateScale(width / 1.2)}
                heightLeft={moderateScaleVertical(140)}
                rectHeightLeft={moderateScaleVertical(140)}
                isRight={false}
                rx={15}
                ry={15}
              />
              <HeaderLoader
                widthLeft={moderateScale(width / 1.2)}
                rectWidthLeft={moderateScale(width / 1.2)}
                heightLeft={moderateScaleVertical(140)}
                rectHeightLeft={moderateScaleVertical(140)}
                isRight={false}
                rx={15}
                ry={15}
              />
            </View>
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <HeaderLoader
                viewStyles={{
                  marginTop: moderateScaleVertical(8),
                  marginBottom: moderateScaleVertical(16),
                }}
                widthLeft={moderateScale(150)}
                rectWidthLeft={moderateScale(150)}
                heightLeft={moderateScaleVertical(240)}
                rectHeightLeft={moderateScaleVertical(240)}
                isRight={false}
                rx={15}
                ry={15}
              />
              <HeaderLoader
                viewStyles={{
                  marginTop: moderateScaleVertical(8),
                  marginBottom: moderateScaleVertical(16),
                }}
                widthLeft={moderateScale(150)}
                rectWidthLeft={moderateScale(150)}
                heightLeft={moderateScaleVertical(240)}
                rectHeightLeft={moderateScaleVertical(240)}
                isRight={false}
                rx={15}
                ry={15}
              />
              <HeaderLoader
                viewStyles={{
                  marginTop: moderateScaleVertical(8),
                  marginBottom: moderateScaleVertical(16),
                }}
                widthLeft={moderateScale(150)}
                rectWidthLeft={moderateScale(150)}
                heightLeft={moderateScaleVertical(240)}
                rectHeightLeft={moderateScaleVertical(240)}
                isRight={false}
                rx={15}
                ry={15}
              />
            </View>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <HeaderLoader
              widthLeft={moderateScale(180)}
              rectWidthLeft={moderateScale(180)}
              rectHeightLeft={moderateScaleVertical(60)}
              isRight={false}
              rx={4}
              ry={4}
            />
            <HeaderLoader
              widthLeft={moderateScale(100)}
              rectWidthLeft={moderateScale(100)}
              rectHeightLeft={moderateScaleVertical(60)}
              isRight={false}
              rx={4}
              ry={4}
            />
          </View>

          <BannerLoader
            // isVendorLoader
            viewStyles={{ marginTop: moderateScale(12) }}
          />
          <BannerLoader
            // isVendorLoader
            viewStyles={{ marginTop: moderateScale(12) }}
          />
          <BannerLoader
            // isVendorLoader
            viewStyles={{ marginTop: moderateScale(12) }}
          />
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <Animatable.View animation={'fadeInUp'} delay={200}>
            {!isEmpty(subcategoryVendorData?.categories) && (
              <View
                style={{
                  height: moderateScaleVertical(80),
                  marginVertical: moderateScaleVertical(16),
                }}>
                <FlatList
                  key={1}
                  horizontal
                  data={subcategoryVendorData?.categories}
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={_renderItem}
                  ItemSeparatorComponent={() => (
                    <View style={{ marginTop: moderateScale(24) }} />
                  )}
                  ListHeaderComponent={() => (
                    <View style={{ marginLeft: moderateScale(12) }} />
                  )}
                  ListFooterComponent={() => (
                    <View style={{ marginRight: moderateScale(12) }} />
                  )}
                />
              </View>
            )}

            <View
              style={{
                marginTop: moderateScaleVertical(4),
              }}>
              <FlatList
                horizontal
                data={subcategoryVendorData?.mobile_banners}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={renderBanners}
                ItemSeparatorComponent={() => (
                  <View style={{ marginRight: moderateScale(12) }} />
                )}
                ListHeaderComponent={() => (
                  <View style={{ marginLeft: moderateScale(16) }} />
                )}
                ListFooterComponent={() => (
                  <View style={{ marginRight: moderateScale(16) }} />
                )}
              />
            </View>
            <FlatList
              scrollEnabled={false}
              ListHeaderComponent={vendorHeader()}
              showsVerticalScrollIndicator={false}
              alwaysBounceVertical={true}
              data={subcategoryVendorData?.vendors}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={_renderVendors}
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
                    {`${strings.SORRY_MSG}`}
                  </Text>
                </View>
              )}
              ItemSeparatorComponent={() => (
                <View style={{ height: moderateScale(10) }} />
              )}
            />
          </Animatable.View>
        </ScrollView>
      )}
    </WrapperContainer>
  );
}
