import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View, ScrollView, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import BrandCard3 from '../../Components/BrandCard3';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import { shortCodes } from '../../utils/constants/DynamicAppKeys';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../styles/theme';
import CardLoader from '../../Components/Loaders/CardLoader';
import stylesFunc from './styles';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import actions from '../../redux/actions';
import { showError } from '../../utils/helperFunctions';
import { debounce } from 'lodash';
import NoDataFound from '../../Components/NoDataFound';
import staticStrings from '../../constants/staticStrings';

export default function Category({ navigation, route }) {
  const { data } = route?.params || {};
  console.log(data, 'paramsData');

  const { location, appMainData, dineInType } = useSelector((state) => state?.home || {});

  const userData = useSelector((state) => state?.auth?.userData || {});

  const checkLayout = appMainData?.homePageLabels || []
  const allCategories = checkLayout.find(layout => layout?.slug == 'nav_categories')


  const {
    appStyle,
    appData,
    themeColors,
    fontFamily,
    languages,
    themeColor,
    themeToggle,
  } = useSelector((state) => state.initBoot);
  const categoryData = useSelector((state) => state?.vendor?.categoryData);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const styles = stylesFunc({ themeColors, fontFamily });

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



  const _renderItem = useCallback(({ item }) => {
    return (
      <BrandCard3
        data={item}
        onPress={() => onPressCategory(item)}
        imageHeight={80}
        imageWidth={80}
      />
    )
  }, [!!allCategories && allCategories?.data || []])



  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }>
      <Header centerTitle={strings.CATEGORY} leftIcon={false} />


      <View style={{ height: 1, backgroundColor: colors.borderLight }} />

      <View style={{ marginHorizontal: moderateScale(16) }}>
        <FlatList
          data={!!allCategories && allCategories?.data || []}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<View style={{ height: 10 }} />}
          keyExtractor={(item, index) => String(index)}
          contentContainerStyle={{ flexGrow: 1 }}
          ItemSeparatorComponent={() => (
            <View style={{ height: moderateScaleVertical(20) }} />
          )}
          numColumns={3}
          renderItem={_renderItem}

          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <NoDataFound isLoading={isLoading} containerStyle={{}} />
          }
        />
      </View>
    </WrapperContainer>
  );
}
