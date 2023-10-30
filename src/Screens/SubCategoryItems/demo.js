  import { isEmpty } from 'lodash';
  import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
  import {
    FlatList,
    Linking,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
  } from 'react-native';
  import { useDarkMode } from 'react-native-dynamic';
  import { useSelector } from 'react-redux';
  import HomeCategoryCard2 from '../../Components/HomeCategoryCard2';
  import strings from '../../constants/lang';
  import staticStrings from '../../constants/staticStrings';
  import navigationStrings from '../../navigation/navigationStrings';
  import actions from '../../redux/actions';
  import colors from '../../styles/colors';
  import { MyDarkTheme } from '../../styles/theme';
  import Carousel from 'react-native-snap-carousel';
  import DeviceInfo from 'react-native-device-info';
  import * as Animatable from 'react-native-animatable';
  import FastImage from 'react-native-fast-image';
  import Ecomheader from '../../Components/EcomHeader';
  import { height, moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize';
  import { getImageUrl, showError } from '../../utils/helperFunctions';
  import CompLoader from './CompLoader';
  import stylesFunc from './styles';
  import { getImageUrlNew } from '../../utils/commonFunction';
  import { SvgUri } from 'react-native-svg';
  import BrandCard2 from '../../Components/BrandCard2';
  import BrandCard from '../../Components/BrandCard';
  import MarketCard from '../../Components/MarketCard';
  import { appIds, shortCodes } from '../../utils/constants/DynamicAppKeys';
  import ProductsComp3V2 from '../../Components/ProductsComp3V2';
  import MarketCard3V2 from '../../Components/MarketCard3V2';
  import imagePath from '../../constants/imagePath';
  import HomeCategoryCard4 from '../../Components/HomeCategoryCard4';
  import SingleCategoryProducts from '../../Components/SingleCategoryProducts';

export default function SubcategoryVendor({ navigation, route }) {
  console.log(route, 'route>>>>route');
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
  const { appMainData, dineInType, location } = useSelector((state) => state?.home || {});
  const { userData } = useSelector((state) => state?.auth);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;


  const memorizedThemeColors = useMemo(() => themeColors, [themeColors])
  const memorizedIsDarkMode = useMemo(() => isDarkMode, [isDarkMode])
  const memorizedAppStyle = useMemo(() => appStyle, [appStyle])

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });

  let businessType = appData?.profile?.preferences?.business_type || null;

  const parentFlatRef = useRef(null)

  const initState = {
    mobile_banners: [],
    vendors: [],
    categories: [],
    brands: [],
    featured_products: [],
    new_products: [],
    on_sale_products: [],
    homePageLabels: [],
    image_prefix: {}
  }

  const [subcategoryVendorData, setSubcategoryVendorData] = useState(initState);
  const [isLoading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState({});
  const [isApiLoading, setApiLoading] = useState(false);
  const [selectedTabType, setSelectedTabType] = useState({});
  const [currentActiveSlider, setCurrentActiveSlider] = useState(0)
  const [flatIndex, setFlatIndex] = useState(0)

  const moveToNewScreen = (screenName, data = {}) => () => { navigation.navigate(screenName, { data }) };



  useEffect(() => {
    getSubCategoryVendors();
    return () => { setSubcategoryVendorData(initState) }
  }, []);

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

    let apiData = {
      type: dineInType,
      category_id: paramData?.id,
      ...latlongObj,
      ...vendorFilterData,
    }
    let apiHeader = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }

    console.log(apiHeader, "api data", apiData)

    actions.getSubCategoryVendorsV2(apiData, apiHeader)
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
    console.log("error raised", error)
    setApiLoading(false);
    setLoading(false);
    showError(error?.message || error?.error);
  }, [selectedTabType, paramData]);



  const openUber = useCallback(() => {
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
  }, [])


  const onPressVendor = useCallback((item) => {

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
  }, [userData])


  const onPressCategory = useCallback((item) => {
    console.log("onPressCategoryItem", item)
    switch (item?.redirect_to) {
      case staticStrings.VENDOR: moveToNewScreen(navigationStrings.VENDOR, item)(); break;
      case staticStrings.PRODUCT: case staticStrings.CATEGORY:
      case staticStrings.ONDEMANDSERVICE: case staticStrings.LAUNDRY:
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
        break;
      case staticStrings.PICKUPANDDELIEVRY:
        if (!!userData?.auth_token) {
          if (shortCodes.arenagrub == appData?.profile?.code) {
            openUber();
          } else {
            item['pickup_taxi'] = true;
            moveToNewScreen(navigationStrings.ADDADDRESS, item)();
          }
        } else { actions.setAppSessionData('on_login') }
        break;
      case staticStrings.CELEBRITY: moveToNewScreen(navigationStrings.CELEBRITY)(); break;
      case staticStrings.BRAND: moveToNewScreen(navigationStrings.CATEGORY_BRANDS, item)(); break;
      case staticStrings.SUBCATEGORY: moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
        break;
      default:
        !!item?.is_show_category ?
          moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
          })() :
          moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: item?.id,
            vendor: false,
            name: item?.name,
            isVendorList: false,
            fetchOffers: true,
          })();
        break;
    }
  }, [userData])


  const onViewAll = useCallback((type, data) => {
    navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
      data: data,
      type: type,
    });
  }, [])

  const _renderItem = useCallback(({ item, index }) => {
    return (
      <HomeCategoryCard2
        data={item}
        onPress={() => onPressCategory(item)}
        isLoading={isLoading}
      />
    );
  }, [isLoading]);

  const renderBanners = ({
    item = {},
    index = 0,
  }) => {
    const imageUrl =
      item?.banner_image_url ||
      getImageUrl(
        item?.image.image_fit,
        item?.image.image_path,
        appStyle?.homePageLayout === 5
          ? '800/600'
          : DeviceInfo.getBundleId() == appIds.masa
            ? '800/600'
            : '1200/1000',
      );
    console.log("appStyle?.homePageLayout ", appStyle?.homePageLayout)
    return (
      <View key={String(item?.id || index)}>
        <TouchableOpacity style={{
        }} activeOpacity={0.8} onPress={() => bannerPress(item)}>
          <FastImage
            source={{
              uri: imageUrl,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{
              height:
                appStyle?.homePageLayout !== 5
                  ? moderateScale(140)
                  : DeviceInfo.getBundleId() == appIds.masa
                    ? moderateScale(260)
                    : height / 3.8,
              width:
                appStyle?.homePageLayout !== 5
                  ? width / 1.1
                  : DeviceInfo.getBundleId() == appIds.masa
                    ? width / 1.1
                    : moderateScale(160),
              borderRadius: moderateScale(16),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>
    );
  }


  // const renderBanners = useCallback(({ item, index }) => {
  //   const imageUrl = item?.banner_image_url ||
  //     getImageUrl(
  //       item?.image.image_fit,
  //       item?.image.image_path,
  //       appStyle?.homePageLayout === 5
  //         ? '800/600'
  //         : DeviceInfo.getBundleId() == appIds.masa
  //           ? '800/600'
  //           : '1200/1000',
  //     );
  //   console.log("appStyle?.homePageLayout ", appStyle?.homePageLayout)
  //   return (
  //     <View key={String(item?.id || index)}>
  //       <TouchableOpacity style={{
  //       }} activeOpacity={0.8} onPress={() => bannerPress(item)}>
  //         <FastImage
  //           source={{
  //             uri: imageUrl,
  //             priority: FastImage.priority.high,
  //             cache: FastImage.cacheControl.immutable,
  //           }}
  //           style={{
  //             height:
  //               appStyle?.homePageLayout !== 5
  //                 ? moderateScale(200)
  //                 : DeviceInfo.getBundleId() == appIds.masa
  //                   ? moderateScale(260)
  //                   : height / 3.8,
  //             width:
  //               appStyle?.homePageLayout !== 5
  //                 ? '100%'
  //                 : DeviceInfo.getBundleId() == appIds.masa
  //                   ? '100%'
  //                   : moderateScale(200),
  //             // borderRadius: moderateScale(16),
  //             backgroundColor: isDarkMode
  //               ? colors.whiteOpacity15
  //               : colors.greyColor,
  //           }}
  //           resizeMode={FastImage.resizeMode.cover}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   );
  //   // // const imageUrl = getImageUrl(item.image_fit, item.image_path, '400/600');
  //   // return (
  //   //   <>

  //   //   <FastImage
  //   //     source={{
  //   //       uri: 'https://previews.123rf.com/images/hollygraphic/hollygraphic1511/hollygraphic151100020/48173455-big-sale-banner-design.jpg',
  //   //       priority: FastImage.priority.high,
  //   //       cache: FastImage.cacheControl.immutable,
  //   //     }}
  //   //     style={{
  //   //       height: 200,
  //   //       width: moderateScale(160),
  //   //       borderRadius: moderateScale(16),
  //   //       backgroundColor: isDarkMode
  //   //         ? colors.whiteOpacity15
  //   //         : colors.greyColor,
  //   //     }}
  //   //     resizeMode={FastImage.resizeMode.cover}
  //   //   />
  //   //   </>
  //   // );
  // }, []);


  console.log("currentActiveSlider", currentActiveSlider)


  const horizontalLine = useCallback(() => {
    return <View style={{ height: 2, backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity10, marginVertical: moderateScaleVertical(8) }} />
  }, [isDarkMode])


  const categoryView = useCallback(() => {
    return (
      <View
        style={{

        }}>
        {!isEmpty(subcategoryVendorData?.categories) ? <FlatList
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
        /> : null}

        {!!subcategoryVendorData?.mobile_banners && !isEmpty(subcategoryVendorData?.mobile_banners) ? <View
          style={{ marginTop: moderateScaleVertical(4) }}>

          <Carousel
            autoplay={true}
            loop={true}
            autoplayInterval={2000}
            data={subcategoryVendorData?.mobile_banners}
            renderItem={renderBanners}
            sliderWidth={width}
            itemWidth={width}
            onSnapToItem={(index) => setCurrentActiveSlider(index)}

          />
          <View style={{ alignSelf: 'center', flexDirection: 'row', marginTop: moderateScaleVertical(8) }}>
            {subcategoryVendorData?.mobile_banners.map((val, i) => {
              return (<View style={{
                ...styles.dotStyle, backgroundColor: i == currentActiveSlider ?
                  isDarkMode ? colors.white : colors.black : isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity20
              }} />)
            })}
          </View>
          {horizontalLine()}
          {/* <FlatList
            horizontal
            // data={subcategoryVendorData?.mobile_banners}
            data={[{},{}]}
            keyExtractor={(item, index) => String(index)}
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
          /> */}
        </View> : null}
      </View>
    )
  }, [isDarkMode, currentActiveSlider, subcategoryVendorData])

  const vendorHeader = useCallback(() => {

    if (appData?.profile?.preferences?.single_vendor) {
      return (<>{categoryView()}</>)
    }
    return (
      <View key={Math.random()}>
        {categoryView()}
      </View>
    );
  }, [selectedFilter, subcategoryVendorData, isDarkMode, currentActiveSlider]);

  const _renderVendors = useCallback((data, index) => {

    let imageUrl = getImageUrlNew({
      url: data?.path || data?.logo || null,
      image_const_arr: appMainData.image_prefix,
      type: 'image_fit',
      height: 250,
      width: 250
    })
    return (
      <Pressable onPress={() => onPressVendor(data)} style={{ width: width / 3 }}>
        <View style={{ borderRadius: 8, alignItems: 'center' }}>
          <FastImage
            source={{
              uri: imageUrl,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{
              width: moderateScale(100),
              height: moderateScale(100),
              borderRadius: 8
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text
            numberOfLines={1}
            style={{
              ...styles.vendorText,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              textAlign: 'center'
            }}>
            {data.name}
          </Text>
        </View>
      </Pressable>
    )
    // <View style={{ width: '100%' }}>
    //   {/* <MarketCard3V2
    //     data={item}
    //     onPress={() => onPressVendor(item)}
    //     extraStyles={{ margin: 2 }}
    //   /> */}
    // </View>
  }, [isDarkMode])





  const _renderBrands = useCallback((item, index) => {
    return (
      <BrandCard2
        data={item}
        onPress={() => { }}
        showName={false}
      />
    );
  }, [subcategoryVendorData, isDarkMode])


  const _renderSales = useCallback((item, index) => {
    return (
      <Text>Sales Product</Text>
      // <MarketCard3
      // data={item}
      // onPress={()=>{}}

      // />
    );
  }, [subcategoryVendorData, isDarkMode])




  const BannersView = ({
    item = {},
    showTitle = true,
  }) => {
    let myBanner = item?.banner_images || appMainData?.mobile_banners || appData?.mobile_banners || []
    return (
      !isEmpty(myBanner) ?
        <View key={String(item?.id)} style={{ marginBottom: moderateScaleVertical(0) }}>
          {!!showTitle ?
            <TitleViewHome
              item={item}
              isDarkMode={isDarkMode}
              appStyle={appStyle}

            /> : <View style={{ marginVertical: moderateScaleVertical(6) }} />}
          <Carousel
            autoplay={true}
            loop={true}
            autoplayInterval={2000}
            data={myBanner}
            renderItem={renderBanners}
            sliderWidth={width}
            itemWidth={width - moderateScale(32)}
          />
        </View> : <React.Fragment />
    )
  }


  const listEmptyComponent = useCallback(() => {
    return (
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
            color: isDarkMode ? colors.white : colors.black
          }}>
          {businessType == 'home_service'
            ? `${strings.WR_ARE_CURRENTLY_NOT_OPERATING} `
            : `${strings.SORRY_MSG}`}
        </Text>
      </View>
    )
  }, [isDarkMode])


  const VendorsView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View
        key={String(item?.id || '')}
        style={{
          backgroundColor: isDarkMode ? MyDarkTheme.colors.background : 'rgba(222,236,249,1)',
          paddingVertical: moderateScaleVertical(8),
          marginTop: moderateScaleVertical(8)
        }}>


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

          {!isEmpty(item?.data) && (
            <TouchableOpacity
              style={{ marginHorizontal: moderateScale(4) }}
              onPress={() => onViewAll('vendor', appMainData?.vendors)}>
              <Text style={styles.viewAllText}>{strings.VIEW_ALL}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ flexDirection: "row", flexWrap: 'wrap' }}>
          {item?.data.map((val, i) => {
            return _renderVendors(val, i)
          })}

          {/* <FlatList
            alwaysBounceVertical={true}
            data={item?.data || []}
            keyExtractor={(item, index) => String(item?.id + `${index}`)}
            showsHorizontalScrollIndicator={false}
            renderItem={_renderVendors}
            ListEmptyComponent={listEmptyComponent}
            ItemSeparatorComponent={() => (
              <View style={{ height: moderateScale(10) }} />
            )}
          /> */}
        </View>
      </View>
    ) : (
      <React.Fragment />
    );
  }, [appMainData, isDarkMode])



  const _renderCategories = useCallback((item, index) => {
    return (
      <View style={{ marginBottom: moderateScaleVertical(8) }}>
        <HomeCategoryCard4
          data={item}
          onPress={() => onPressCategory(item)}
          applyRadius={4}
          index={index}
          categoryHieght={40}
          categoryWidth={40}
        />
      </View>
    )
  }, [appStyle, isDarkMode])




  const CategoriesView = useCallback(({ item, showTitle }) => {
    return !isEmpty(item?.data) ? (
      <View
        key={String(item?.id || '')}
        style={{
          marginBottom: moderateScaleVertical(0),
          // marginHorizontal: moderateScale(10)

        }}>



        {!!showTitle ? <TitleViewHome appStyle={appStyle} isDarkMode={isDarkMode} item={item} /> : <View style={{ marginVertical: moderateScaleVertical(6) }} />}


        <View style={{ flexDirection: "row", flexWrap: 'wrap' }}>
          {item?.data.map((val, i) => {
            return _renderCategories(val, i)
          })}

        </View>
        {/* <FlatList

          data={item?.data}
          numColumns={3}

          keyExtractor={(item, index) => String(item?.id + `${index}`)}
          showsHorizontalScrollIndicator={false}
          renderItem={_renderCategories}
          ItemSeparatorComponent={() => (
            <View style={{ height: moderateScale(8) }} />
          )}
        /> */}
      </View>
    ) : (
      <React.Fragment />
    );
  }, [appMainData, isDarkMode])



  const _renderSpotlightDeals = useCallback(({ item }) => {
    return (
      <ProductsComp3V2
        item={item}
        onPress={() => navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })}
        numberOfLines={1}
      />
    )
  }, [isDarkMode])

  const SpotlightDealsView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View
        key={String(item?.id || '')}
        style={{
          marginTop: moderateScaleVertical(8),
          backgroundColor: 'white',
          paddingVertical: moderateScaleVertical(8)

        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleViewHome textStyle={{ marginTop: 0 }} item={item} isDarkMode={isDarkMode} />
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data || []}
          renderItem={_renderSpotlightDeals}
          keyExtractor={(item, index) => String(item?.id + `${index}`)}
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
    ) : (
      <React.Fragment />
    );
  }, [themeColors, fontFamily, appMainData, isDarkMode])



  const _renderSelectedProducts = useCallback(({ item, index }) => {
    return (
      <View style={{ marginRight: 8 }}>
        <ProductsComp3V2
          item={item}
          onPress={() =>
            navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
          }
        />
      </View>
    )
  }, [appMainData, isDarkMode, themeColors])


  const SelectedProductsThemeView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View
        key={String(item?.id || '')}
        style={{
          marginBottom: moderateScaleVertical(0)
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleViewHome item={item} isDarkMode={isDarkMode} />
        </View>

        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderSelectedProducts}
          keyExtractor={(item, index) => String(item?.id + `${index}`)}

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

      </View>
    ) : (
      <React.Fragment />
    );
  }, [themeColors, fontFamily, appMainData, isDarkMode])


  const SingleCategoryProductsView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View
        style={{
          backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.whiteSmokeColor,
          // paddingHorizontal: moderateScale(8),
          paddingBottom: moderateScaleVertical(8),
          marginVertical: moderateScaleVertical(12)
        }}
      >
        <TitleViewHome
          item={item}
          isDarkMode={isDarkMode}
          appStyle={appStyle}
        />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderSingleCategoryProducts}
          keyExtractor={(item, index) => String(item?.id + `${index}`)}
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

      </View>
    ) : (
      <React.Fragment />
    );
  }, [themeColors, fontFamily, appMainData, isDarkMode])


  const _renderSingleCategoryProducts = useCallback(({ item, index }) => {
    return (
      <ProductsComp3V2
        item={item}
        onPress={() =>
          !!item?.is_p2p ? navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, { data: item }) : navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
        imageStyle={{
          width: moderateScale(100),
          height: moderateScale(100),
          borderRadius: 8
        }}
        containerStyle={{
          width: width / 3.2,
          alignItems: 'center',
          borderRadius: 8
        }}
      />

    );
  }, [isDarkMode])


  const renderHomePageItems = useCallback(({ item, index }) => {
    let uniqueId = String(item?.id || index)
    return (
      <View key={uniqueId}>
        {
          item?.slug == 'banner' ? (
            <BannersView
              item={item}
              showTitle={false}
            />
          ) :
            (item?.slug == 'new_products' ||
              item?.slug == 'featured_products' ||
              item?.slug == 'on_sale' ||
              item?.slug == 'most_popular_products' ||
              item?.slug == 'recently_viewed' || item?.slug == "ordered_products"
            ) ?
              <ProductsThemeView appStyle={appStyle} item={item} isDarkMode={isDarkMode} navigation={navigation} />
              : item?.slug == 'vendors' ?
                <VendorsView item={item} />
                : item?.slug == 'nav_categories' ? (
                  <CategoriesView item={item} showTitle={true} />
                ) : item?.slug == 'best_sellers' ? (
                  <BestSellersView
                    item={item}
                    onPressVendor={onPressVendor}
                    appMainData={appMainData}
                    styles={styles}
                    appStyle={appStyle}
                    isDarkMode={isDarkMode}
                  />
                ) :
                  item?.slug == 'brands' ? (
                    <BrandsView
                      item={item}
                      appMainData={appMainData}
                      isDarkMode={isDarkMode}
                      moveToNewScreen={moveToNewScreen}
                    />
                  ) : item?.slug == 'spotlight_deals' ? (
                    <SpotlightDealsView item={item} />
                  ) : item?.slug == 'selected_products' ? (
                    <SelectedProductsThemeView item={item} />
                  ) : item?.slug == 'single_category_products' ? <SingleCategoryProductsView item={item} /> :
                    <React.Fragment />
        }
      </View>
    );
  }, [themeColors, fontFamily, appMainData, appStyle, isDarkMode])

  const dataProvider = useMemo(() => subcategoryVendorData?.homePageLabels || [], [subcategoryVendorData?.homePageLabels || []]);

  const keyExtractorUnique = useCallback((item, index) => !!item?.id ? String(item.id) : String(index))

  const goToPosition = useCallback((index) => {
    if (!!parentFlatRef?.current) {
      setFlatIndex(index)
      parentFlatRef.current.scrollToIndex({
        index: index
      })
    }
  }, [dataProvider])


  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.whiteSmokeColor }}>
      {isLoading ?
        <Animatable.View animation={'fadeIn'} easing={'ease-in-out-sine'} style={{ flex: 1 }}>
          <CompLoader
            navigation={navigation}
            isDarkMode={memorizedIsDarkMode}
            appStyle={memorizedAppStyle}
            themeColors={memorizedThemeColors}
          />
        </Animatable.View> :
        <>
          <Animatable.View animation={'fadeIn'} easing={'ease-in-out-sine'} style={{ flex: 1 }}>
            <Ecomheader
              isDarkMode={memorizedIsDarkMode}
              navigation={navigation}
              style={{ marginVertical: moderateScaleVertical(16) }}
              themeColors={memorizedThemeColors}
              appStyle={memorizedAppStyle}
            />

            {!!dataProvider && !isEmpty(dataProvider) ?
              <View style={{ flexDirection: 'row', backgroundColor: colors.white }}>

                {true ?


                  <ScrollView style={{
                    width: width / 2.4,
                    borderRightWidth: 0.5,
                    borderRightColor: colors.grayOpacity51,
                    height: height
                  }}>
                    <View style={{}}>
                      {dataProvider.map((val, i) => {
                        if (isEmpty(val?.data)) {
                          return (
                            <></>
                          )
                        }
                        return (
                          <TouchableOpacity
                            key={String(i)}
                            onPress={() => goToPosition(i)}
                            style={{
                              backgroundColor: i == flatIndex ? themeColors?.primary_color : colors.white,
                              paddingHorizontal: moderateScale(8),

                              height: 62,

                              justifyContent: 'center',
                            }}>
                            <Text style={{
                              fontSize: textScale(10),
                              textTransform: 'uppercase',
                              fontFamily: i == flatIndex ? fontFamily.medium : fontFamily.regular,
                              color: i == flatIndex ? colors.white : colors.black,
                            }}>{val?.title == 'NavCategories' ? 'Categories' : val?.title}</Text>
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                  </ScrollView> : null}
                <FlatList

                  ref={parentFlatRef}
                  data={dataProvider}
                  extraData={dataProvider}
                  renderItem={renderHomePageItems}
                  keyExtractor={keyExtractorUnique}
                  onScrollToIndexFailed={() => console.log("on indexFailed")}
                  // refreshControl={
                  //   <RefreshControl
                  //     refreshing={isRefreshing}
                  //     onRefresh={handleRefresh}
                  //     tintColor={themeColors.primary_color}
                  //   />
                  // }
                  // ListHeaderComponent={ListHeaderComponent}
                  ListFooterComponent={() => <View
                    style={{
                      height:
                        moderateScale(80)
                    }}
                  />
                  }
                />
              </View> : null}



          </Animatable.View>
        </>
      }
    </View>
  );
}



const _renderProducts = ({ item, navigation }) => {
  return (
    <ProductsComp3V2
      item={item}
      onPress={() =>
        !!item?.is_p2p ? navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, { data: item }) : navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
      }
    />
  )
}



const ProductsThemeView = ({ item, navigation, isDarkMode, appStyle = {} }) => {
  return !isEmpty(item?.data) ? (
    <View
      key={String(item?.id || '')}
      style={{
        marginBottom: moderateScaleVertical(0)
      }}>
      <TitleViewHome
        item={item}
        isDarkMode={isDarkMode}
        appStyle={appStyle}
      />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={item?.data}
        renderItem={({ item, }) => _renderProducts({ item, navigation })}
        keyExtractor={(item, index) => String(item?.id + `${index}`)}
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
    </View>
  ) : (
    <React.Fragment />
  );
}

//Title home
const TitleViewHome = ({
  item = {},
  isDarkMode = false,
  appStyle = {},
  textStyle = {}

}) => {
  const fontFamily = appStyle?.fontSizeData;
  return (<Text
    style={{
      fontFamily: fontFamily?.medium,
      fontSize: textScale(14),
      textAlign: 'left',
      color: isDarkMode ? colors.white : colors.black,
      marginHorizontal: moderateScale(16),
      marginVertical: moderateScaleVertical(6),
      ...textStyle
    }}>

    {item?.title == 'NavCategories' ? 'Shop By Category' : !isEmpty(item?.translations) ? (item?.translations[0]?.title || item?.title) : item?.title}
  </Text>
  );
}



const _renderBestVendors = ({
  item = {},
  onPressVendor = () => { },
  appMainData = {},
  styles = {},
  appStyle = {},

}) => {
  const fontFamily = appStyle?.fontSizeData;


  return (
    <TouchableOpacity
      key={String(item?.id)}
      onPress={() => onPressVendor(item)}
      activeOpacity={0.7}
      style={{
        height: moderateScaleVertical(140),
        width: width / 2,
        borderRadius: moderateScale(10),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',

      }}>
      <FastImage
        source={{
          uri: getImageUrlNew({
            url: item?.logo || null,
            image_const_arr: appMainData.image_prefix,
            type: 'image_fit',
            height: 250,
            width: 250,
          }),
          cache: FastImage.cacheControl.immutable,
          priority: FastImage.priority.high,
        }}
        style={{
          ...StyleSheet.absoluteFill,
          height: moderateScaleVertical(140),
          width: width / 2,
        }}
      />
      <View
        style={{
          ...StyleSheet.absoluteFill,
          height: moderateScaleVertical(140),
          width: width - width / 3.5,
          backgroundColor: colors.blackOpacity66,
        }}
      />
      {!!item?.rating !== '0.0' && !!item?.rating && (
        <View
          style={{ ...styles.hdrRatingTxtView, position: 'absolute', top: 0 }}>
          <Text
            style={{
              ...styles.ratingTxt,
              fontFamily: fontFamily.medium,
            }}>
            {Number(item?.rating).toFixed(1)}
          </Text>
          <Image
            style={styles.starImg}
            source={imagePath.star}
            resizeMode="contain"
          />
        </View>
      )}
      <Text
        style={{
          fontFamily: fontFamily?.bold,
          fontSize: textScale(18),
          color: colors.white,
        }}>
        {item?.name}
      </Text>
    </TouchableOpacity>
  );
}


const BestSellersView = ({
  item = {},
  onPressVendor = () => { },
  appMainData = {},
  styles = {},
  appStyle = {},
  isDarkMode = false
}) => {
  return !isEmpty(item?.data) ? (
    <View
      key={String(item?.id || '')}
      style={{
        marginBottom: moderateScaleVertical(0)
      }}>
      <TitleViewHome isDarkMode={isDarkMode} item={item} />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={item?.data || []}
        renderItem={({ item }) => _renderBestVendors({
          item,
          onPressVendor,
          appMainData,
          styles,
          appStyle
        })}
        keyExtractor={(item, index) => String(item?.id + `${index}`)}
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
    </View>
  ) : (
    <React.Fragment />
  );
}



//render brands function
const _renderBrands = ({
  item = {},
  isDarkMode = false,
  appMainData = {},
  moveToNewScreen = () => { }
}) => {
  const imageURI = item?.image
    ? getImageUrlNew({
      url: item?.image || null,
      image_const_arr: appMainData.image_prefix,
      type: 'image_fit',
      height: 250,
      width: 250,
    })
    : item?.image_url;
  const isSVG = imageURI ? imageURI.includes('.svg') : null;


  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}>
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
            borderWidth: 1,
            borderColor: colors.borderStroke
          }}
        />
      )}
    </TouchableOpacity>
  );
}

const BrandsView = ({
  item = {},
  isDarkMode = false,
  appMainData = {},
  moveToNewScreen = () => { }
}) => {
  return !isEmpty(item?.data) ? (
    <View
      key={String(item?.id || '')}
      style={{
        marginBottom: moderateScaleVertical(0),
      }}>
      <TitleViewHome isDarkMode={isDarkMode} item={item} />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={item?.data}
        renderItem={({ item }) => _renderBrands({ item, isDarkMode, appMainData, moveToNewScreen })}
        keyExtractor={(item, index) => String(item?.id + `${index}`)}
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
  ) : (
    <React.Fragment />
  );
}