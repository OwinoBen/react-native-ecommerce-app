import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DashedLine from 'react-native-dashed-line';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import RNExitApp from 'react-native-exit-app';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import HomeCategoryCard3 from '../../../Components/HomeCategoryCard3';
import HomeCategoryCard4 from '../../../Components/HomeCategoryCard4';
import BannerLoader from '../../../Components/Loaders/BannerLoader';
import CategoryLoader2 from '../../../Components/Loaders/CategoryLoader2';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import MarketCard3 from '../../../Components/MarketCard3';
import ProductsComp2 from '../../../Components/ProductsComp2';
import ProductsComp3 from '../../../Components/ProductsComp3';
import SingleCategoryProducts from '../../../Components/SingleCategoryProducts';
import SubscriptionModal from '../../../Components/SubscriptionModal';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import { useScrollToTop } from '@react-navigation/native';
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView
} from 'recyclerlistview'; // Version can be specified in package.json


const ViewTypes = {
  BANNER: 0,
  VENDORS: 1,
  NAV_CATEGORIES:2,
  BEST_SELLERS: 3,
  BRANDS:4,
  SPOTLIGHT_DEALS: 5,
  SELECTED_PRODUCTS: 6,
  SINGLE_CATEGORY_PRODUCTS:7,
  NEW_PRODUCTS: 8,
  FEATURED_PRODUCTS: 9,
  ON_SALE: 10,
  MOST_POPULAR_PRODUCTS: 11,
  RECENTLY_VIEWED: 12,
  ORDERED_PRODUCTS: 13,
};


import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl
} from '../../../utils/helperFunctions';
import { getItem, setItem } from '../../../utils/utils';
import stylesFunc from '../styles';
import DashBoardFiveV2ApiLoader from './DashBoardFiveV2ApiLoader';
import { getImageUrlNew } from '../../../utils/commonFunction';
import ProductsComp3V2 from '../../../Components/ProductsComp3V2';

const DashBoardFiveV2Api = ({
  handleRefresh = () => { },
  bannerPress = () => { },
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => { },
  navigation = {},
  onVendorFilterSeletion = () => { },
  tempCartData = null,
  onPressVendor = () => { },
  onClose = () => { },
  onPressSubscribe = () => { },
  isSubscription = false,
  showAllProducts = () => { },
  showAllSpotDealAndSelectedProducts = () => { },
  onScrollFlat = () => { },
  searchBarAnim
}) => {

  const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector((state) => state?.initBoot || {});
  const userData = useSelector((state) => state?.auth?.userData || {});

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const appMainData = useSelector((state) => state?.home?.appMainData);
  let businessType = appData?.profile?.preferences?.business_type || null;

  const ref = useRef(null);

  useScrollToTop(ref);

  const isGetEstimation = appData?.profile?.preferences?.get_estimations;

  const [isConfirmAgeModal, setIsConfirmAgeModal] = useState(true);
  const [state, setState] = useState({
    newCategoryData: [],
    isVendorColumnList: false,
    showMenu: false,
    currSelectedFilter: null,
    categoriesData: [],
    seeMore: false,
  });
  const { showMenu, categoriesData, seeMore } = state;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });
  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));



  const optamizeValue = useMemo(() => {

    let filterData = !!appMainData?.homePageLabels && appMainData?.homePageLabels.filter((val, i) => {
      if (val?.slug == 'banner' && !isEmpty(val?.banner_image)) {
        return val
      }
      if (!!val?.data && !isEmpty(val?.data)) {
        return val
      }
    })
    return filterData
  }, [appMainData?.homePageLabels])

  const _layoutProvider = useRef(layoutMaker()).current;

  const listView = useRef();

  const dataProvider = useMemo(() => dataProviderMaker(optamizeValue || []), [appMainData?.homePageLabels || []]);

  useEffect(() => {

  }, [appMainData?.homePageLabels])


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


  const OnTakeMeOut = () => {
    RNExitApp.exitApp();
  };

  const checkAgeModalPermission = async () => {
    try {
      const getIsUserCofirmedAgeModal = await getItem(
        'isUserConfirmedAgeModal',
      );
      if (
        getIsUserCofirmedAgeModal !== null &&
        !!(userData && userData?.auth_token)
      ) {
        setIsConfirmAgeModal(getIsUserCofirmedAgeModal);
      } else {
        setIsConfirmAgeModal(true);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  useEffect(() => {
    checkAgeModalPermission();
  }, []);

  const onConfirmAge = async (userPermission) => {
    try {
      const getIsUserCofirmedAgeModal = await getItem(
        'isUserConfirmedAgeModal',
      );
      console.log(getIsUserCofirmedAgeModal, 'checkkk');
      if (
        getIsUserCofirmedAgeModal !== null &&
        !!(userData && userData?.auth_token)
      ) {
        setIsConfirmAgeModal(getIsUserCofirmedAgeModal);
      } else {
        setIsConfirmAgeModal(false);
        if (!!(userData && userData?.auth_token)) {
          await setItem('isUserConfirmedAgeModal', userPermission);
        }
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
  const _renderCategories = useCallback(({ item, index }) => {
    return (
      <View
        style={{ width: width / 4.2 }}>
        <HomeCategoryCard4
          data={item}
          onPress={() => onPressCategory(item)}
          isLoading={isLoading}
          applyRadius={4}
          index={index}
        />
      </View>
    );
  }, [])

  const _renderVendors = useCallback(({ item, index }) => (
    <View style={{ width: width - width / 3.5 }}>
      <MarketCard3
        data={item}
        onPress={() => onPressVendor(item)}
        extraStyles={{ margin: 2 }}
      />
    </View>
  ), [])

  const _renderBrands = useCallback(({ item }) => {
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
  }, [appMainData])

  const onViewAll = useCallback((type, data) => {
    navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
      data: data,
      type: type,
    });
  }, [])

  const vendorHeader = useCallback((item) => {
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
        {getBundleId() == appIds.muvpod ? null : (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: moderateScale(16),
            marginBottom: moderateScaleVertical(15),
          }}>
            <Text
              numberOfLines={1}
              style={{
                ...styles.exploreStoresTxt,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,

                flex: 1,
              }}>
              {getBundleId() == appIds.quickLube
                ? item?.data?.length > 1
                  ? `${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`
                  : strings.BOOK_HERE
                : `${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`}
            </Text>

            {item?.data?.length > 1 && (
              <TouchableOpacity
                style={{ marginHorizontal: moderateScale(4) }}
                onPress={() => onViewAll('vendor', appMainData?.vendors)}>
                <Text
                  style={{
                    ...styles.viewAllText,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : themeColors.primary_color,
                  }}>
                  {strings.VIEW_ALL}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }, [appData, isDarkMode, appMainData])

  const onPressViewEditAndReplace = useCallback((item) => {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: item?.vendors[0].order_id,
      orderDetail: {
        dispatch_traking_url: item?.vendors[0].dispatch_traking_url,
      },
      selectedVendor: { id: item?.vendors[0].vendor_id },
    });
  }, [])



  const moveToNewScreen = (screenName, data = {}) => () => { navigation.navigate(screenName, { data }) }


  const showAllTempCartOrders = useCallback(() => {
    return (
      <View>
        {!isEmpty(tempCartData) && tempCartData?.length
          ? tempCartData?.map((item, index) => {
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
  }, [fontFamily, themeColors, tempCartData])

  const _renderProducts = useCallback(({ item, index }) => {
    return (
      <Animatable.View
        animation={'slideInRight'}
        delay={index * 100}
      >
        <ProductsComp3V2
          item={item}
          onPress={() =>
            !!item?.is_p2p ? navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, { data: item }) : navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
          }
        />
      </Animatable.View>
    );
  }, [])

  const _renderSingleCategoryProducts = useCallback(({ item, index }) => {
    return (

      <SingleCategoryProducts
        mainContainerStyle={{
          borderRadius: moderateScale(20),
          overflow: 'hidden',
          height: moderateScaleVertical(130),
          elevation: 0,
          alignItems: 'center',
          width: width / 3 - 10

        }}
        showRating={false}
        imageStyle={{ width: moderateScale(width / 4), height: moderateScaleVertical(80), resizeMode: 'cover' }}
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
        productNameStyle={{ textAlign: 'center', fontSize: textScale(10), marginBottom: moderateScaleVertical(5) }}
        numberOfLines={2}
      />


    );
  }, [])

  const ProductsThemeView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View
        style={{
          marginBottom: moderateScaleVertical(0),
          height: height / 3.2
        }}>
        <TitleViewHome item={item} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderProducts}
          keyExtractor={(item, index) => String(item?.id || index)}
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
  }, [appMainData])

  const SingleCategoryProductsView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleViewHome item={{ title: item?.data?.category_detail?.slug }} />
          {item?.data?.category_detail?.products?.length >= 9 && <TouchableOpacity onPress={() => showAllProducts(item)}>
            <Text style={{ marginHorizontal: moderateScale(18), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>}
        </View>
        <View style={{ marginHorizontal: moderateScale(8) }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            numColumns={3}
            data={item?.data?.category_detail?.products}
            renderItem={_renderSingleCategoryProducts}
            keyExtractor={(item) => item?.id?.toString()}
            ListFooterComponent={() => (
              <View style={{ marginRight: moderateScale(16) }} />
            )}
          />
        </View>
      </View>
    ) : (
      <React.Fragment />
    );
  }, [themeColors, fontFamily, appMainData])

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
      <View style={{
        marginBottom: moderateScaleVertical(0)
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleViewHome item={item} />
          {item?.data?.length >= 9 && <TouchableOpacity onPress={() => showAllSpotDealAndSelectedProducts(item)}>
            <Text style={{ marginHorizontal: moderateScale(18), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>}
        </View>

        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderSelectedProducts}
          keyExtractor={(item) => item?.id?.toString()}

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
  }, [themeColors, fontFamily, appMainData])

  const CategoriesView = useCallback(({ item, showTitle }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(0),
        marginHorizontal: moderateScale(10),
        backgroundColor: 'red'

      }}>
        {!!showTitle ? <TitleViewHome item={item} /> : <View style={{ marginVertical: moderateScaleVertical(6) }} />}
        <FlatList
          key={'6'}
          // horizontal
          data={item?.data}
          keyExtractor={(item) => item?.id?.toString()}
          showsHorizontalScrollIndicator={false}
          numColumns={4}
          renderItem={_renderCategories}
          ItemSeparatorComponent={() => (
            <View style={{ height: moderateScale(8) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  }, [appMainData])

  const VendorsView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(0)
      }}>
        <View style={{ marginTop: moderateScaleVertical(8) }} />
        {vendorHeader(item)}
        <FlatList
          horizontal
          alwaysBounceVertical={true}
          data={item?.data}
          keyExtractor={(item) => item?.id?.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={_renderVendors}
          ListHeaderComponent={() => (
            <View style={{ marginLeft: moderateScale(16) }} />
          )}
          ListFooterComponent={() => (
            <View style={{ marginLeft: moderateScale(16) }} />
          )}
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
                {businessType == 'home_service'
                  ? `${strings.WR_ARE_CURRENTLY_NOT_OPERATING} `
                  : `${strings.SORRY_MSG}`}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ width: moderateScale(10) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  }, [appMainData])

  const _renderBestVendors = useCallback(({ item, index }) => {

    return (
      <TouchableOpacity
        key={String(item?.id || index)}
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
            fontFamily: fontFamily.bold,
            fontSize: textScale(18),
            color: colors.white,
          }}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  }, [appMainData, fontFamily, isDarkMode])

  const BestSellersView = useCallback(({ item }) => {

    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(0)
      }}>
        <TitleViewHome item={item} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data || []}
          renderItem={_renderBestVendors}
          keyExtractor={(item) => item?.id?.toString()}
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
  }, [appMainData, fontFamily, isDarkMode])

  const BrandsView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(0)
      }}>
        <TitleViewHome item={item} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderBrands}
          keyExtractor={(item) => item?.id?.toString()}
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
  }, [appMainData])

  const TitleViewHome = useCallback(({ item, titleViewStyle = {} }) => {
    return (
      <Text
        style={{
          ...styles.exploreStoresTxt,
          color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          marginHorizontal: moderateScale(16),
          marginVertical: moderateScaleVertical(6),
          // fontSize: textScale(14),
          // ...titleViewStyle
        }}>
        {!isEmpty(item?.translations) ? (item?.translations[0]?.title || item?.title) : item?.title}
      </Text>
    );
  }, [isDarkMode, MyDarkTheme])


  const _renderSpotlightDeals = useCallback(({ item }) => {
    return (
      <ProductsComp2
        item={item}
        onPress={() => navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })}
        numberOfLines={2}
      />
    )
  }, [])

  const SpotlightDealsView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(0)
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleViewHome item={item} />
          {item?.data?.length >= 9 && <TouchableOpacity onPress={() => showAllSpotDealAndSelectedProducts(item)}>
            <Text style={{ marginHorizontal: moderateScale(18), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>}
        </View>
        <FlatList
          estimatedItemSize={200}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderSpotlightDeals}
          keyExtractor={(item) => item?.id?.toString()}
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
  }, [themeColors, fontFamily, appMainData])


  const renderBanners = useCallback(({ item, index }) => {
    const imageUrl =
      item?.banner_image_url ||
      getImageUrl(
        item.image.image_fit,
        item.image.image_path,
        appStyle?.homePageLayout === 5
          ? '800/600'
          : DeviceInfo.getBundleId() == appIds.masa
            ? '800/600'
            : '1200/1000',
      );
    return (
      <Animatable.View
        animation={'zoomIn'}
        delay={200}
        key={String(item?.id || index)}
      >
        <TouchableOpacity style={{
        }} activeOpacity={0.8} onPress={() => bannerPress(item)}>
          <FastImage
            source={{
              uri: imageUrl,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{
              height: moderateScale(200),
              width: width - moderateScale(30),
              borderRadius: moderateScale(16),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.grayOpacity51,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </Animatable.View>
    );
  }, [])



  const BannersView = useCallback(({ item = {}, showTitle = true }) => {
    return (
      !isEmpty(item?.banner_images || appMainData?.mobile_banners || appData?.mobile_banners) ?
        <View key={String(item?.id)} style={{ marginBottom: moderateScaleVertical(0), }}>
          {!!showTitle ? <TitleViewHome item={item} /> : <View style={{ marginVertical: moderateScaleVertical(6) }} />}
          <Carousel
            autoplay={true}
            loop={true}
            autoplayInterval={2000}
            data={
              item?.banner_images ||
              appMainData?.mobile_banners ||
              appData?.mobile_banners
            }
            renderItem={renderBanners}
            sliderWidth={width}
            itemWidth={width - moderateScale(32)}
          />
        </View> : <React.Fragment />
    )
  }, [appMainData, appData])


  const keyExtractorUnique = useCallback((item, index) => !!item?.id ? String(item.id) : String(index))


  const rowRenderer = (type, item) => {
    console.log("datadatadata", item)

    let uniqueId = String(item?.id || index)
    return (
      item?.slug == 'banner' ? (
        <BannersView key={uniqueId} item={item} showTitle={false} />
      ) :
        (item?.slug == 'new_products' ||
          item?.slug == 'featured_products' ||
          item?.slug == 'on_sale' ||
          item?.slug == 'most_popular_products' ||
          item?.slug == 'recently_viewed' || item?.slug == "ordered_products"
        ) ?
          <ProductsThemeView key={uniqueId} item={item} />
          : item?.slug == 'vendors' ?
            <VendorsView key={uniqueId} item={item} />
            : item?.slug == 'nav_categories' ? (
              <CategoriesView key={uniqueId} item={item} showTitle={false} />
            ) : item?.slug == 'best_sellers' ? (
              <BestSellersView key={uniqueId} item={item} />
            ) : item?.slug == 'brands' ? (
              <BrandsView key={uniqueId} item={item} />
            ) : item?.slug == 'spotlight_deals' ? (
              <SpotlightDealsView key={uniqueId} item={item} />
            ) : item?.slug == 'selected_products' ? (
              <SelectedProductsThemeView key={uniqueId} item={item} />
            ) : item?.slug == 'single_category_products' ? <SingleCategoryProductsView key={uniqueId} item={item} /> :
              <React.Fragment />


    );
  };


  if (isLoading) { return (<DashBoardFiveV2ApiLoader />) } //home loader


  console.log("appMainData?.homePageLabels", dataProvider)
  return (
    <WrapperContainer>
      {showAllTempCartOrders()}

      <RecyclerListView
        ref={listView}
        onEndReachedThreshold={1}
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={rowRenderer}

      />

      {getBundleId() == appIds.easyDrink && isConfirmAgeModal && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isConfirmAgeModal}
          // onRequestClose={() => {
          //   Alert.alert("Modal has been closed.");
          //   setModalVisible(!modalVisible);
          // }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View style={styles.innerAgeModaleView}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    marginBottom: moderateScale(10),
                  }}>
                  <Image
                    style={{
                      height: moderateScaleVertical(25),
                      width: moderateScale(25),
                    }}
                    source={imagePath.icCross18}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.ageModalText,
                    { color: isDarkMode ? colors.white : colors.black },
                  ]}>
                  {strings.AGE_VERIFICATION}
                </Text>
                {/* <View style={styles.horizontalLine} /> */}
                <View style={styles.horizontalLine}>
                  <DashedLine
                    dashLength={5}
                    dashThickness={1}
                    dashGap={2}
                    dashColor={colors.black}
                    style={{ marginTop: moderateScale(7) }}
                  />
                </View>
                <Text style={styles.ageConfirmationText}>
                  {strings.YOU_MUST_BE_18}
                </Text>
                <View
                  style={{
                    marginVertical: moderateScaleVertical(10),
                    width: '70%',
                  }}>
                  <GradientButton
                    colorsArray={[
                      themeColors.primary_color,
                      themeColors.primary_color,
                    ]}
                    textStyle={{
                      fontFamily: fontFamily.medium,
                      color: colors.white,
                    }}
                    onPress={() => {
                      onConfirmAge(false);
                    }}
                    borderRadius={moderateScale(5)}
                    btnText={strings.YES_I_AM_ABOVE_18}
                    containerStyle={{
                      width: '100%',
                    }}
                  />
                </View>

                <Text onPress={OnTakeMeOut} style={styles.takeMeOutStyle}>
                  {strings.TAKE_ME_OUT}
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {!!userData?.auth_token &&
        !!appData?.profile?.preferences?.show_subscription_plan_popup && (
          <SubscriptionModal
            isVisible={isSubscription}
            onClose={onClose}
            onPressSubscribe={onPressSubscribe}
          />
        )}
    </WrapperContainer>
  );
}


const switchReturn = () =>{
    switch (viewt) {
      case value:
        
        return ;
    
      default:
        break;
    }
}




const layoutMaker = () =>
  new LayoutProvider(
    (index) => {
      return index
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.BANNER:
          dim.width = width
          dim.height = moderateScale(220);
          break;
        case ViewTypes.NAV_CATEGORIES:
          dim.width = width;
          dim.height = moderateScale(240);
          break;
        case ViewTypes.VENDORS:
          dim.width = width
          dim.height = moderateScale(240);
          break;
        case ViewTypes.BEST_SELLERS:
          dim.width = width;
          dim.height = moderateScale(240);
          break;
        case ViewTypes.BRANDS:
          dim.width = width;
          dim.height = moderateScale(240);
          break;
        case ViewTypes.SPOTLIGHT_DEALS:
          dim.width = width;
          dim.height = moderateScale(240);
          break;
        case ViewTypes.SELECTED_PRODUCTS:
          dim.width = width;
          dim.height = moderateScale(240);
          break;
        case ViewTypes.SINGLE_CATEGORY_PRODUCTS:
          dim.width = width;
          dim.height = moderateScale(240);
          break;
        case ViewTypes.NEW_PRODUCTS:
          dim.width = width;
          dim.height =height / 2;
          break;
        case ViewTypes.FEATURED_PRODUCTS:
          dim.width = width;
          dim.height = height / 2;
          break;
        case ViewTypes.ON_SALE:
          dim.width = width;
          dim.height =height / 2;
          break;
        case ViewTypes.MOST_POPULAR_PRODUCTS:
          dim.width = width;
          dim.height = height / 2;
          break;
        case ViewTypes.RECENTLY_VIEWED:
          dim.width = width;
          dim.height = height / 2.5;
          break;
        case ViewTypes.ORDERED_PRODUCTS:
          dim.width = width;
          dim.height = height / 2.5;
          break;
        default:
          dim.width = width;
          dim.height = height / 3;
      }
    }
  );



const dataProviderMaker = (data) => new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);




export default React.memo(DashBoardFiveV2Api);

