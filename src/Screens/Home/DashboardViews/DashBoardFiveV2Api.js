import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import RNExitApp from 'react-native-exit-app';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import HomeCategoryCard4 from '../../../Components/HomeCategoryCard4';
import SubscriptionModal from '../../../Components/SubscriptionModal';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import { useScrollToTop } from '@react-navigation/native';
import deviceInfoModule from 'react-native-device-info';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { getColorCodeWithOpactiyNumber, getImageUrl, showError, showSuccess } from '../../../utils/helperFunctions';
import { getItem, setItem } from '../../../utils/utils';
import stylesFunc from '../styles';
import DashBoardFiveV2ApiLoader from './DashBoardFiveV2ApiLoader';
import { getImageUrlNew } from '../../../utils/commonFunction';
import ProductsComp3V2 from '../../../Components/ProductsComp3V2';
import * as CategoryTemplate from '../TemplateStyle/CategoryStyle'
import MarketCard3V2 from '../../../Components/MarketCard3V2';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Cities from '../../../Components/Cities';
import fontFamily from '../../../styles/fontFamily';
import actions from '../../../redux/actions';
import VendorMode from '../../../Components/VendorMode';
import { enableFreeze } from "react-native-screens";
import Animated from 'react-native-reanimated';
import GridImageComponent from '../../../Components/GridImageComponent';
enableFreeze(true);

const homeFilter = [
  { id: 1, type: strings.OPEN },
  { id: 2, type: strings.CLOSE },
  { id: 3, type: strings.BESTSELLER },
];



const DashBoardFiveV2Api = ({
  handleRefresh = () => { },
  bannerPress = () => { },
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => { },
  navigation = {},
  tempCartData = null,
  onPressVendor = () => { },
  onClose = () => { },
  onPressSubscribe = () => { },
  isSubscription = false,
  showAllProducts = () => { },
  showAllSpotDealAndSelectedProducts = () => { },
  onVendorFilterSeletion = () => { },
  selcetedToggle = () => { },
  showVendorCategory = true,
  appMainData = {},
  scrollHandler = () => { }
}) => {



  const { appData, themeColors, appStyle, currencies, languages, themeColor, themeToggle } = useSelector((state) => state?.initBoot || {});
  const userData = useSelector((state) => state?.auth?.userData);
  const { cartItemCount } = useSelector((state) => state?.cart);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  let businessType = appData?.profile?.preferences?.business_type || null;

  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    isVendorColumnList: false,
    vendorsData: [],
    showMenu: false,
    currSelectedFilter: null,
    categoriesData: [],
    seeMore: false,
  });
  const { slider1ActiveSlide, vendorsData, showMenu, categoriesData, seeMore, currSelectedFilter } = state;

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const ref = React.useRef(null);

  useScrollToTop(ref);

  const [isConfirmAgeModal, setIsConfirmAgeModal] = useState(true);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });


  const OnTakeMeOut = () => { RNExitApp.exitApp() };

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



  const onSelectedFilter = (selectedFilter) => {
    updateState({ showMenu: false, currSelectedFilter: selectedFilter });
    onVendorFilterSeletion(selectedFilter);
  };


  const _renderVendors = useCallback(({ item, index }) => (
    <View style={{ width: '100%' }}>
      <MarketCard3V2
        data={item}
        onPress={() => onPressVendor(item)}
        extraStyles={{ margin: 2 }}
      />
    </View>
  ), [isDarkMode])


  const onViewAll = useCallback((type, data) => {
    navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
      data: data,
      type: type,
    });
  }, [isDarkMode])

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
            marginVertical: moderateScaleVertical(16),
          }}>
            <Text
              numberOfLines={1}
              style={{
                ...styles.exploreStoresTxt,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                marginTop: 0,
                flex: 1,
              }}>
              {getBundleId() == appIds.quickLube
                ? item?.data?.length > 1
                  ? `${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`
                  : strings.BOOK_HERE
                : `${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`}
            </Text>


            {<Menu style={{ alignSelf: 'flex-end' }}>
              <MenuTrigger>
                <View style={styles.menuView}>
                  <FastImage
                    style={{
                      height: moderateScaleVertical(16),
                      width: moderateScale(16),
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.white
                        : colors.black,
                    }}
                    resizeMode="contain"
                    source={isDarkMode ? imagePath.sortSelected : imagePath.sort}
                  />
                  <Text
                    style={{
                      fontSize: textScale(12),
                      marginHorizontal: moderateScale(5),
                      fontFamily: fontFamily.regular,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {!currSelectedFilter
                      ? strings.RELEVANCE
                      : currSelectedFilter?.type}
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
                {homeFilter.map((item, index) => {
                  return (
                    <View key={index}>
                      <MenuOption
                        onSelect={() => onSelectedFilter(item)}
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
            </Menu>}

          </View>
        )}
      </View>
    );
  }, [appData, isDarkMode, appMainData, isDarkMode])

  const onPressViewEditAndReplace = useCallback((item) => {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: item?.vendors[0].order_id,
      orderDetail: {
        dispatch_traking_url: item?.vendors[0].dispatch_traking_url,
      },
      selectedVendor: { id: item?.vendors[0].vendor_id },
    });
  }, [isDarkMode])



  const moveToNewScreen = (screenName, data = {}) => () => { navigation.navigate(screenName, { data }) }


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
                  <CategoriesView item={item} showTitle={false} />
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
                    item?.slug == "cities" ? <CitiesView item={item} /> :
                      <React.Fragment />
        }
      </View>
    );
  }, [themeColors, fontFamily, appMainData, appStyle, isDarkMode, cartItemCount])

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
  }, [fontFamily, themeColors, tempCartData, isDarkMode])


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
          // alignItems: 'center',
          borderRadius: 8
        }}
      />


    );
  }, [isDarkMode])



  const SingleCategoryProductsView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleViewHome
            item={item}
            isDarkMode={isDarkMode}
            appStyle={appStyle}
          />
          {item?.data?.length >= 9 && <TouchableOpacity onPress={() => showAllProducts(item)}>
            <Text style={{ marginHorizontal: moderateScale(18), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>}
        </View>
        <View style={{ marginHorizontal: moderateScale(8) }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            // numColumns={3}
            data={item?.data}
            renderItem={_renderSingleCategoryProducts}
            keyExtractor={(item, index) => String(item?.id + `${index}`)}
            ItemSeparatorComponent={() => (
              <View style={{ marginRight: moderateScale(12) }} />
            )}
            ListHeaderComponent={() => (
              <View style={{ marginLeft: moderateScale(9) }} />
            )}
            ListFooterComponent={() => (
              <View style={{ marginRight: moderateScale(16) }} />
            )}
          />
        </View>
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
          <TitleViewHome
            item={item}
            isDarkMode={isDarkMode}
            appStyle={appStyle}
          />
          {item?.data?.length >= 9 && <TouchableOpacity onPress={() => showAllSpotDealAndSelectedProducts(item)}>
            <Text style={{ marginHorizontal: moderateScale(18), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>}
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



  const _renderCategories = useCallback(({ item, index }) => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return (
          <CategoryTemplate.HomeCategory6
            data={item}
            onPress={() => onPressCategory(item)}
          />
        )
      case 2:
        return (
          <View style={{ marginRight: moderateScale(8) }}>
            <CategoryTemplate.HomeCategoryCard2 data={item} onPress={() => onPressCategory(item)} />
          </View>
        )
      case 3:
        return (
          <View
            style={{

              width: appStyle?.homePageLayout == 5 ? '20%' : '25%',
            }}>
            <CategoryTemplate.HomeCategoryCard_3_5_7
              data={item}
              onPress={() => onPressCategory(item)}
              isLoading={isLoading}
            />
          </View>
        )
      case 4:
        return (
          <View style={{ width: width / 4.2 }}>
            <CategoryTemplate.HomeCategoryCard4
              data={item}
              onPress={() => onPressCategory(item)}
            />
          </View>
        )
      case 5:
        return (
          <View
            style={{
              marginRight: appStyle?.homePageLayout == 5 ? 0 : moderateScale(8),
              width: appStyle?.homePageLayout == 5 ? '25%' : 'auto',
            }}>
            <CategoryTemplate.HomeCategoryCard_3_5_7
              data={item}
              onPress={() => onPressCategory(item)}
              isLoading={isLoading}
            />
          </View>
        )
      case 6:
        return (
          <View style={{ width: width / 4.2 }}>
            <CategoryTemplate.HomeCategoryCard6
              data={item}
              onPress={() => onPressCategory(item)}
            />
          </View>
        )
      case 7:
        return (
          <View
            style={{
              marginRight: appStyle?.homePageLayout == 5 ? 0 : moderateScale(8),
              width: appStyle?.homePageLayout == 5 ? '25%' : 'auto',
            }}>
            <CategoryTemplate.HomeCategoryCard_3_5_7
              data={item}
              onPress={() => onPressCategory(item)}
              isLoading={isLoading}
            />
          </View>
        )
      case 8:
        return (
          <CategoryTemplate.HomeCategoryCard8
            item={item}
            onPress={() => onPressCategory(item)}
          />

        )
      case 10:
        return (

          <HomeCategoryCard4
            data={item}
            onPress={() => onPressCategory(item)}
            applyRadius={moderateScale(30)}
            categoryHieght={60}
            categoryWidth={60}
            index={index}
          />

        )
      default:
        <HomeCategoryCard4
          data={item}
          onPress={() => onPressCategory(item)}
          applyRadius={4}
          index={index}
        />
    }
  }, [appStyle, isDarkMode])


  const categoryFlatViewStyle = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return {
          numColumns: 4,
          horizontal: false,
          scrollEnabled: false
        };
      case 2:
        return {
          numColumns: 0,
          horizontal: true,
          scrollEnabled: true
        };

      case 8:
        return {
          numColumns: 3,
          horizontal: false,
          scrollEnabled: false
        };
      case 10:
        return {
          numColumns: 0,
          horizontal: true,
          scrollEnabled: true
        };

      default:
        return {
          numColumns: 4,
          horizontal: false,
          scrollEnabled: false
        };
    }
  }



  //banners view
  const BannersView = ({
    item = {},
    showTitle = true,
  }) => {
    let myBanner = item?.banner_images || appMainData?.mobile_banners || appData?.mobile_banners || []
    return (
      !isEmpty(myBanner) ?
        <View key={String(item?.id)} style={{  }}>
{/*       
          <Carousel
            autoplay={true}
            loop={true}
            autoplayInterval={2000}
            data={myBanner}
            renderItem={renderBanners}
            sliderWidth={width}
            itemWidth={width - moderateScale(32)}

          /> */}
        <GridImageComponent data={myBanner}onPress={(item)=>bannerPress(item)} />

        </View> : <React.Fragment />
    )
  }

  //render banners function
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

  const onPressMode = (item) => {
    if (!!cartItemCount?.data && cartItemCount?.data?.item_count) {
      clearCartItem(item)
    } else {
      selcetedToggle(item.type)
    }
  }





  const clearCartItem = (item) => {
    Alert.alert('', strings.REMOVE_CART_MSG, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
      },
      { text: strings.CLEAR_CART2, onPress: () => clearCart(item) },
    ]);
  };

  const clearCart = (item) => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: deviceInfoModule.getUniqueId(),
        },
      )
      .then((res) => {
        showSuccess(res?.message);
        actions.cartItemQty(res);
        selcetedToggle(item.type)
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    showError(error?.message || error?.error);
  };


  const renderMode = useCallback(({ item, index }) => {
    return (
      <VendorMode
        item={item}
        onPressMode={onPressMode}
      />
    )
  }, [cartItemCount, appData?.profile?.preferences?.vendorMode || []])

  const CategoriesView = useCallback(({ item, showTitle }) => {
    return !isEmpty(item?.data) ? (
      <View
        key={String(item?.id || '')}
        style={{
          marginBottom: moderateScaleVertical(0),
          marginHorizontal: moderateScale(10)

        }}>

        {appStyle?.homePageLayout == 6 && showVendorCategory && getBundleId() == appIds?.dropOff ? <View>
          <View>
            <Text
              style={{
                fontSize: textScale(14),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                marginHorizontal: moderateScale(10),
                marginTop: moderateScaleVertical(20),
                marginBottom: moderateScaleVertical(8)
              }}>
              {strings.WHAT_WHOULD_YOU_LIKE_TO_DO}
            </Text>

            <FlatList
              data={appData?.profile?.preferences?.vendorMode || []}
              renderItem={renderMode}
              numColumns={4}
              ItemSeparatorComponent={() => <View style={{ height: moderateScale(10) }} />}
              keyExtractor={(item, index) => String(item?.type || index)}
            />
          </View>
        </View> :
          <View>
            {!!showTitle ? <TitleViewHome isDarkMode={isDarkMode} item={item} /> : <View style={{ marginVertical: moderateScaleVertical(6) }} />}
            <FlatList
              horizontal={categoryFlatViewStyle().horizontal}
              data={item?.data}
              scrollEnabled={categoryFlatViewStyle().scrollEnabled}
              keyExtractor={(item, index) => String(item?.id + `${index}`)}
              showsHorizontalScrollIndicator={false}
              numColumns={categoryFlatViewStyle().numColumns}
              renderItem={_renderCategories}
              ItemSeparatorComponent={() => (
                <View style={{ height: moderateScale(8) }} />
              )}
            />
          </View>
        }
      </View>
    ) : (
      <React.Fragment />
    );
  }, [appMainData, isDarkMode, cartItemCount])

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

    return (
      <View
        key={String(item?.id || '')}
        style={{
          marginBottom: moderateScaleVertical(0)
        }}>
        <View style={{ marginTop: moderateScaleVertical(8) }} />

        {vendorHeader(item)}

        <View style={{ marginHorizontal: moderateScale(16) }}>
          <FlatList
            alwaysBounceVertical={true}
            data={item?.data || []}
            keyExtractor={(item, index) => String(item?.id + `${index}`)}
            showsHorizontalScrollIndicator={false}
            renderItem={_renderVendors}
            ListEmptyComponent={listEmptyComponent}
            ItemSeparatorComponent={() => (
              <View style={{ height: moderateScale(10) }} />
            )}
            ListFooterComponent={() => {
              return (
                <View style={{
                  alignSelf: 'center', marginTop: moderateScaleVertical(8),
                  borderBottomWidth: 1,
                  borderBottomColor: themeColors?.primary_color
                }}>
                  {item?.data?.length > 1 && (
                    <TouchableOpacity
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
              )
            }}
          />
        </View>
      </View>
    )
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
          <TitleViewHome
            item={item}
            isDarkMode={isDarkMode}
            appStyle={appStyle}
          />
          {item?.data?.length >= 9 && <TouchableOpacity onPress={() => showAllSpotDealAndSelectedProducts(item)}>
            <Text style={{ marginHorizontal: moderateScale(18), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>}
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


  const keyExtractorUnique = useCallback((item, index) => !!item?.id ? String(item.id) : String(index))


  //remove unncessary data
  const optamizeValue = useMemo(() => {
    let filterData = !!appMainData?.homePageLabels && appMainData?.homePageLabels.filter((val, i) => {
      if (val?.slug == 'banner' && !isEmpty(val?.banner_image)) {
        return val
      }
      return val
    })
    return filterData
  }, [appMainData?.homePageLabels])


  const dataProvider = useMemo(() => optamizeValue, [appMainData?.homePageLabels])

  if (isLoading) { return (<DashBoardFiveV2ApiLoader />) } //home loader



  const ListHeaderComponent = () => {
    let myBanner = appMainData?.mobile_banners || appData?.mobile_banners || []
    return (
      <View style={{ marginTop: moderateScaleVertical(8) }}>
        <Carousel
          autoplay={true}
          loop={true}
          autoplayInterval={2000}
          data={myBanner}
          renderItem={renderBanners}
          sliderWidth={width}
          itemWidth={width - moderateScale(32)}
        />
      </View>
    )
  }




  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
    >
      {showAllTempCartOrders()}

      {!!dataProvider && !isEmpty(dataProvider) ?
        <Animated.FlatList
          showsVerticalScrollIndicator={false}
          ref={ref}
          data={dataProvider}
          extraData={dataProvider}
          renderItem={renderHomePageItems}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          keyExtractor={keyExtractorUnique}
          onScrollToIndexFailed={() => console.log("df")}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          // ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={() => <View
            style={{
              height:
                moderateScale(80)
            }}
          />
          }
        /> : null}

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
      fontSize: textScale(16),
      textAlign: 'left',
      color: isDarkMode ? colors.white : colors.black,
      marginHorizontal: moderateScale(16),
      marginTop: moderateScaleVertical(20),
      marginBottom: moderateScaleVertical(7),
      ...textStyle
    }}>
    {!isEmpty(item?.translations) ? (item?.translations[0]?.title || item?.title) : item?.title}
  </Text>
  );
}

//product theme view
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
const _renderCities = ({ item, navigation }) => {
  return (
    <View>
      <Cities
        item={item}
      />
    </View>
  )
}

const CitiesView = ({ item = {},
  onPressVendor = () => { },
  appMainData = {},
  styles = {},
  appStyle = {},
  moveToNewScreen = () => { },
  isDarkMode = false }) => {
  console.log(item, "awdbatufgjdhvgjncjn");

  if (isEmpty(item?.data || [])) {
    return <></>
  }
  return (
    <View>
      <TitleViewHome
        item={item}
        isDarkMode={isDarkMode}
        appStyle={appStyle}
      />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={item?.data || []}
        renderItem={({ item }) => _renderCities({ item, isDarkMode, appMainData, moveToNewScreen })}
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
  )
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



//best sellers view
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
      <TitleViewHome
        item={item}
        isDarkMode={isDarkMode}
        appStyle={appStyle}
      />
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
//render best vendors function

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

//brand view


const BrandsView = ({
  item = {},
  isDarkMode = false,
  appMainData = {},
  moveToNewScreen = () => { },
  appStyle = {}
}) => {
  return !isEmpty(item?.data) ? (
    <View
      key={String(item?.id || '')}
      style={{
        marginBottom: moderateScaleVertical(0),
      }}>
      <TitleViewHome
        item={item}
        isDarkMode={isDarkMode}
        appStyle={appStyle}
      // textStyle={{ fontFamily: fontFamily?.medium}}
      />
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

export default React.memo(DashBoardFiveV2Api);


