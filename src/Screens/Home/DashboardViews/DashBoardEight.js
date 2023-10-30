import { useScrollToTop } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useDarkMode } from 'react-native-dynamic';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import BannerHome2 from '../../../Components/BannerHome2';
import HomeCategoryCard3 from '../../../Components/HomeCategoryCard3';
import BannerLoader from '../../../Components/Loaders/BannerLoader';
import CategoryLoader2 from '../../../Components/Loaders/CategoryLoader2';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import MarketCard3 from '../../../Components/MarketCard3';
import ProductsComp from '../../../Components/ProductsComp';
import SubscriptionModal from '../../../Components/SubscriptionModal';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import staticStrings from '../../../constants/staticStrings';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';

import {
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';


export default function DashBoardEight({
  handleRefresh = () => { },
  bannerPress = () => { },
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => { },
  navigation = {},
  toggleData = {},
  onVendorFilterSeletion = () => { },
  tempCartData = null,
  onClose = () => { },
  onPressSubscribe = () => { },
  isSubscription = false,
  selectedFilterType = {},
}) {
  const userData = useSelector((state) => state?.auth?.userData);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isSingleVendor = appData?.profile?.preferences?.single_vendor;
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { bannerRef } = useRef();
  const { appData, themeColors, appStyle,languages } = useSelector(
    (state) => state?.initBoot,
  );

  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    isVendorColumnList: false,
    vendorsData: [],
    showMenu: false,
    categoriesData: [],
    seeMore: false,
    loading: true,
  });

  const appMainData = useSelector((state) => state?.home?.appMainData);

  let businessType = appData?.profile?.preferences?.business_type || null;

  const allCategory = appMainData?.categories;
  const checkForBrand =
    allCategory &&
    allCategory.find((x) => x?.redirect_to == staticStrings.BRAND);
  // const {bannerRef} = useRef();
  const { slider1ActiveSlide, vendorsData, showMenu, categoriesData, seeMore, loading } =
    state;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily, isDarkMode });

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    if (appMainData?.vendors && appMainData?.vendors.length) {
      updateState({
        vendorsData: appMainData?.vendors,
      });
      return;
    }
    updateState({
      vendorsData: [],
    });
  }, [appMainData?.vendors]);

  useEffect(() => {
    if (!!appMainData?.categories && appMainData?.categories.length) {
      if (appStyle?.homePageLayout == 5) {
        updateState({
          categoriesData: appMainData?.categories.filter(
            (item, indx) => indx < 8,
          ),
        });
      } else {
        updateState({
          categoriesData: appMainData?.categories,
        });
      }
      return;
    }
    updateState({
      categoriesData: [],
    });
  }, [appMainData?.categories]);

  // console.log('app main data', appMainData);

  const homeAllFilters = () => {
    let homeFilter = [
      { id: 1, type: strings.OPEN },
      { id: 2, type: strings.CLOSE },
      { id: 3, type: strings.BESTSELLER },
    ];

    return homeFilter;
  };

  const _homeCategory6 = ({ item, index }) => {
    return (
      <View
        style={{
          marginHorizontal: moderateScale(8),
          width: 'auto',
        }}>
        <HomeCategoryCard3
          data={item}
          onPress={() => onPressCategory(item)}
          isLoading={isLoading}
        />
      </View>
    );
  };

  const _renderVendors = ({ item, index }) => (
    <View style={{ marginHorizontal: moderateScale(16) }}>
      <MarketCard3
        data={item}
        onPress={() => onPressCategory(item)}
        extraStyles={{ margin: 2 }}
      />
    </View>
  );

  const scaleInAnimated = new Animated.Value(0);

  const seeMoreCategories = () => {
    updateState({
      categoriesData: !seeMore
        ? appMainData?.categories
        : appMainData?.categories.filter((item, indx) => indx < 8),
      seeMore: !seeMore,
    });
  };

  const categoriesBanners = () => {
    return (
      <View style={{}}>
        <View
          style={{
            alignSelf: 'center',
            marginTop: moderateScaleVertical(20),
          }}>
          <BannerHome2
            bannerRef={bannerRef}
            slider1ActiveSlide={slider1ActiveSlide}
            bannerData={appData?.mobile_banners}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            onSnapToItem={(index) => updateState({ slider1ActiveSlide: index })}
            onPress={(item) => bannerPress(item)}
            isDarkMode={isDarkMode}
            isPagination={true}
            paginationColor={{ backgroundColor: themeColors.primary_color }}
          />
        </View>
        {!isEmpty(appMainData?.categories) && <Text
          style={{
            fontSize: textScale(14),
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            marginHorizontal: moderateScale(10),
            marginVertical: moderateScaleVertical(10),
          }}>
          {(getBundleId() == appIds.mrVeloz && languages?.primary_language?.sort_code == 'es') ? strings?.WHAT_WHOULD_YOU_LIKE_TO_DO_MRVELOZ : strings.WHAT_WHOULD_YOU_LIKE_TO_DO}
        </Text>}
        {appMainData &&
          appMainData?.categories &&
          !!appMainData?.categories?.length && (
            <View
              style={{
                alignItems: 'center',
              }}>
              {appStyle?.homePageLayout === 6 && (
                <FlatList
                  key={'6'}
                  numColumns={4}
                  data={categoriesData}
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={_homeCategory6}
                  ItemSeparatorComponent={() => (
                    <View style={{ marginTop: moderateScale(12) }} />
                  )}
                  ListHeaderComponent={() => (
                    <View style={{ marginLeft: moderateScale(12) }} />
                  )}
                  ListFooterComponent={() => (
                    <View style={{ marginRight: moderateScale(12) }} />
                  )}
                />
              )}

              <View>
                {appMainData?.categories.length > 8 &&
                  appStyle?.homePageLayout === 5 && (
                    <TouchableOpacity
                      onPress={seeMoreCategories}
                      activeOpacity={0.8}
                      style={{
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: moderateScaleVertical(6),
                        marginHorizontal: moderateScale(8),
                        borderRadius: moderateScale(6),
                        marginTop: moderateScaleVertical(16),
                        borderColor: colors.borderColorB,
                      }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={{
                            fontSize: textScale(10),
                            fontFamily: fontFamily.regular,
                          }}>
                          {!seeMore ? strings.SEE_MORE : strings.SEE_LESS}
                        </Text>
                        <Image
                          source={imagePath.icDropdown4}
                          style={{
                            transform: [{ rotate: seeMore ? '180deg' : '0deg' }],
                            marginLeft: moderateScale(4),
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          )}
      </View>
    );
  };

  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };
  const renderBrands = ({ item }) => {
    // const imageUrl = getImageUrl(item.image.proxy_url, item.image.image_path, '800/600');
    const imageURI = getImageUrl(
      item.image.proxy_url,
      item.image.image_path,
      '800/600',
    );
    const isSVG = imageURI ? imageURI.includes('.svg') : null;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}
      // style={{
      //   ...getScaleTransformationStyle(scaleInAnimated),
      // }}
      // onPressIn={() => pressInAnimation(scaleInAnimated)}
      // onPressOut={() => pressOutAnimation(scaleInAnimated)}
      >
        {isSVG ? (
          <SvgUri
            height={moderateScale(96)}
            width={moderateScale(96)}
            uri={imageURI}
          />
        ) : (
          <FastImage
            source={{ uri: imageURI, priority: FastImage.priority.high }}
            style={{
              height: moderateScale(96),
              width: moderateScale(96),
              borderRadius: moderateScale(10),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const onViewAll = (type, data) => {
    console.log(data, 'type+++++', type);
    navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
      data: data,
      type: type,
    });
  };

  const listHeader = (type, data = [], isViewAll = false) => {
    return (
      <View style={styles.viewAllVeiw}>
        <Text
          style={{
            ...styles.exploreStoresTxt,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            marginTop: 0,
          }}>
          {type}
        </Text>

        {!!isViewAll && !!vendorsData && vendorsData.length > 1 && (
          <TouchableOpacity onPress={() => onViewAll(type, data)}>
            <Text style={styles.viewAllText}>{strings.VIEW_ALL}  </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFeaturedProducts = ({ item }) => {
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
    );
  };

  const renderSale = ({ item }) => {
    return (
      <ProductsComp
        // isDiscount
        item={item}
        imageStyle={{ height: moderateScale(186) }}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
    );
  };

  const scrollRef = React.useRef(null);
  useScrollToTop(scrollRef);

  // if ( !!vendorsData || !!categoriesData) {
  //   updateState({loading:false})
  // }


  if (isLoading) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        <BannerLoader
          // isVendorLoader
          viewStyles={{ marginTop: moderateScale(12) }}
        />

        {appStyle?.homePageLayout === 5 &&
          DeviceInfo.getBundleId() == appIds.dlvrd && (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: moderateScaleVertical(16),
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
          )}
        <CategoryLoader2
          viewStyles={{ marginVertical: moderateScale(16) }}
          radius={20}
        />

        <CategoryLoader2
          viewStyles={{ marginBottom: moderateScale(16) }}
          radius={20}
        />

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
    );
  }

  const vendorHeader = () => {
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
        <View style={styles.viewAllVeiw}>
          <Text
            style={{
              ...styles.exploreStoresTxt,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              marginTop: 0,
            }}>
            {strings.EXPLORE_STORES}{' '}
            {appData?.profile?.preferences?.vendors_nomenclature}
          </Text>

          {!!vendorsData && vendorsData.length > 1 && (
            <TouchableOpacity

              onPress={() => onViewAll('vendor', appMainData?.vendors)}>
              <Text style={styles.viewAllText}>{strings.VIEW_ALL} {DeviceInfo.getBundleId() === appIds.qdelo && 'Stores'}</Text>
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
                  source={isDarkMode ? imagePath.sortSelected : imagePath.sort}
                />
                <Text
                  style={{
                    fontSize: textScale(12),
                    marginHorizontal: moderateScale(5),
                    fontFamily: fontFamily.regular,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {isEmpty(selectedFilterType)
                    ? strings.RELEVANCE
                    : selectedFilterType?.type}
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
              {homeAllFilters()?.map((item, index) => {
                return (
                  <View key={index}>
                    <MenuOption
                      onSelect={() => onVendorFilterSeletion(item)}
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
  };

  const onPressViewEditAndReplace = (item) => {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: item?.vendors[0].order_id,
      // fromVendorApp: true,
      orderDetail: {
        dispatch_traking_url: item?.vendors[0].dispatch_traking_url,
      },
      selectedVendor: { id: item?.vendors[0].vendor_id },
    });
  };

  const showAllTempCartOrders = () => {
    return (
      <View>
        {tempCartData && tempCartData.length
          ? tempCartData.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => onPressViewEditAndReplace(item)}
                style={{
                  padding: moderateScale(8),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // alignItems: 'center',
                  backgroundColor: getColorCodeWithOpactiyNumber(
                    themeColors?.primary_color.substr(1),
                    20,
                  ),
                  marginHorizontal: moderateScale(15),
                  marginTop: moderateScale(15),
                  borderRadius: moderateScale(5),
                  borderWidth: moderateScale(0.5),
                  borderColor: themeColors?.primary_color,
                }}>
                <View style={{ flex: 0.7 }}>
                  <Text
                    style={{
                      fontSize: textScale(12),
                      fontFamily: fontFamily.medium,
                    }}>
                    {strings.YOURDRIVERHASMODIFIED}
                  </Text>
                  <Text
                    style={{
                      fontSize: textScale(12),
                      paddingTop: moderateScale(5),
                      fontFamily: fontFamily.bold,
                    }}>
                    {strings.VIEW_DETAIL}
                  </Text>
                </View>
                <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      fontSize: textScale(14),
                      fontFamily: fontFamily.medium,
                    }}>{`#${item?.order_number}`}</Text>
                </View>
              </TouchableOpacity>
            );
          })
          : null}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <SearchBar2
        placeHolderTxt={
          toggleData?.profile?.preferences?.search_nomenclature ||
          strings.SEARCH_HERE
        }
        navigation={navigation}``
      /> */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }>
        {showAllTempCartOrders()}
        <Animatable.View animation={'fadeInUp'} delay={200}>
          {categoriesBanners()}
          {
            <>
              <FlatList
                scrollEnabled={false}
                ListHeaderComponent={vendorHeader}
                showsVerticalScrollIndicator={false}
                alwaysBounceVertical={true}
                // ref={ref}
                data={vendorsData}
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
                        color: isDarkMode ? MyDarkTheme?.colors?.text : colors.blackB
                      }}>
                      {strings.SORRY_MSG}
                    </Text>
                  </View>
                )}
                ItemSeparatorComponent={() => (
                  <View style={{ height: moderateScale(10) }} />
                )}
              />

              {checkForBrand && (
                <View style={{}}>
                  {appMainData &&
                    appMainData?.brands &&
                    !!appMainData?.brands.length && (
                      <>
                        <View>{listHeader(strings.POPULAR_BRANDS)}</View>
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          data={appMainData?.brands}
                          renderItem={renderBrands}
                          keyExtractor={(item) => item.id.toString()}
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
                      </>
                    )}
                </View>
              )}
            </>
          }

          {businessType !== 'laundry' && (
            <View style={{}}>
              {appMainData &&
                appMainData?.featured_products &&
                !!appMainData?.featured_products.length && (
                  <>
                    {appIds.orderchekout == DeviceInfo.getBundleId() ? (
                      <View>{listHeader(strings.ALCOHAL)}</View>
                    ) : (
                      <View>{listHeader(strings.FEATURED_PRODUCTS)}</View>
                    )}

                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      data={appMainData?.featured_products}
                      renderItem={renderFeaturedProducts}
                      keyExtractor={(item) => item.id.toString()}
                      ItemSeparatorComponent={() => (
                        <View style={{ marginRight: moderateScale(16) }} />
                      )}
                      ListHeaderComponent={() => (
                        <View style={{ marginLeft: moderateScale(16) }} />
                      )}
                      ListFooterComponent={() => (
                        <View style={{ marginRight: moderateScale(16) }} />
                      )}
                    />
                  </>
                )}
            </View>
          )}

          {businessType !== 'laundry' &&
            appIds.orderchekout != DeviceInfo.getBundleId() && (
              <View style={{}}>
                {appMainData &&
                  appMainData?.new_products &&
                  !!appMainData?.new_products.length && (
                    <>
                      <View>{listHeader(strings.NEW_PRODUCTS)}</View>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={appMainData?.new_products}
                        renderItem={renderFeaturedProducts}
                        keyExtractor={(item) => item.id.toString()}
                        ItemSeparatorComponent={() => (
                          <View style={{ marginRight: moderateScale(16) }} />
                        )}
                        ListHeaderComponent={() => (
                          <View style={{ marginLeft: moderateScale(16) }} />
                        )}
                        ListFooterComponent={() => (
                          <View style={{ marginRight: moderateScale(16) }} />
                        )}
                      />
                    </>
                  )}
              </View>
            )}

          {/* {appIds.orderchekout == DeviceInfo.getBundleId() ? (
            <></>
          ) : (
            <View>
              {appMainData &&
                appMainData?.on_sale_products &&
                !!appMainData?.on_sale_products.length && (
                  <>
                    <View>{listHeader(strings.ON_SALE)}</View>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      keyExtractor={(item) => item?.id.toString() || ''}
                      data={appMainData?.on_sale_products}
                      renderItem={renderSale}
                      ItemSeparatorComponent={() => (
                        <View style={{marginRight: moderateScale(16)}} />
                      )}
                      ListHeaderComponent={() => (
                        <View style={{marginLeft: moderateScale(16)}} />
                      )}
                      ListFooterComponent={() => (
                        <View style={{marginRight: moderateScale(16)}} />
                      )}
                    />
                  </>
                )}
            </View>
          )} */}
        </Animatable.View>
        <View
          style={{
            height:
              Platform.OS == 'ios' ? moderateScale(60) : moderateScale(90),
          }}
        />
      </ScrollView>
      {!!userData?.auth_token &&
        !!appData?.profile?.preferences?.show_subscription_plan_popup && (
          <SubscriptionModal
            isVisible={isSubscription}
            onClose={onClose}
            onPressSubscribe={onPressSubscribe}
          />
        )}
    </View>
  );
}
