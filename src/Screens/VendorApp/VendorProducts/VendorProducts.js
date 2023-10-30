import {cloneDeep, debounce} from 'lodash';
import React, {Fragment, useEffect, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {useSelector} from 'react-redux';
import CustomTopTabBar from '../../../Components/CustomTopTabBar';
import Header from '../../../Components/Header';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import ProductCard from '../../../Components/ProductCard';
import ProductCartListView from '../../../Components/ProductCartListView';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import staticStrings from '../../../constants/staticStrings';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {showError} from '../../../utils/helperFunctions';
import ListEmptyProduct from './ListEmptyProduct';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../../styles/theme';
import {useFocusEffect} from '@react-navigation/native';

export default function VendorProducts({route, navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const {storeSelectedVendor} = useSelector((state) => state?.order);
  console.log(storeSelectedVendor, 'storeSelectedVendor');
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route.params;

  const [state, setState] = useState({
    vendor_list: [],
    selectedVendor: null,
    isVisibleModal: false,
    isLoading: true,
    pageNo: 1,
    limit: 12,
    isRefreshing: false,
    productListData: [],
    category_list: [],
    categoryInfo: null,
    gridView: false,
    selectedTab: null,
  });

  const {
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    internetConnection,
    appStyle,
  } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});
  const {
    vendor_list,
    selectedVendor,
    isLoading,
    pageNo,
    limit,
    isRefreshing,
    categoryInfo,
    productListData,
    category_list,
    gridView,
    selectedTab,
  } = state;

  //Saving the initial state
  const initialState = cloneDeep(state);
  //Logged in user data
  const userData = useSelector((state) => state?.auth?.userData);
  //app Main Data
  const appMainData = useSelector((state) => state?.home?.appMainData);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const updateState = (data) => setState((state) => ({...state, ...data}));

  useEffect(() => {
    getAllListItems();
  }, [languages, currencies, isRefreshing, isLoading]);

  useEffect(() => {
    updateState({
      selectedTab: null,
      selectedVendor: storeSelectedVendor,
      isLoading: true,
    });
  }, [storeSelectedVendor]);

  useEffect(() => {
    getAllListItems();
  }, [pageNo]);

  const getAllListItems = () => {
    getAllProducts();
  };

  useFocusEffect(
    React.useCallback(() => {
      updateState({pageNo: 1});
    }, [pageNo]),
  );

  /**********Get all list items by store  id and category id */
  console.log(selectedVendor?.id,"resres");
  const getAllProducts = () => {
    actions
      .getProductBySpecificId(
        `?selected_category_id=${
          selectedTab?.id || ''
        }&limit=${limit}&page=${pageNo}&selected_vendor_id=${
          selectedVendor?.id || ''
        }`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res,selectedVendor?.id,"resres");
        updateState({
          isLoading: false,
          isRefreshing: false,
          vendor_list: res.data.vendor_list,
          selectedTab: selectedTab
            ? selectedTab
            : res.data.category_list.filter((x) => x.is_selected),
          selectedVendor: !!storeSelectedVendor?.id
            ? storeSelectedVendor
            : !!selectedVendor
            ? selectedVendor
            : res.data.vendor_list.find((x) => x.is_selected),
          category_list: res.data.category_list,
          productListData:
            pageNo == 1
              ? res.data.products.data
              : [...productListData, ...res.data.products.data],
        });
      })
      .catch(errorMethod);
    // }
  };

  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  //pagination of data
  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageNo: pageNo + 1});
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const renderProduct = ({item, index}) => {
    item.showAddToCart = true;
    return gridView ? (
      <ProductCard
        data={item}
        onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
        onAddtoWishlist={() => _onAddtoWishlist(item)}
        addToCart={() => _addToCart(item)}
        bottomText={strings.VIEW_DETAIL}
      />
    ) : (
      <ProductCartListView
        data={item}
        onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
        onAddtoWishlist={() => _onAddtoWishlist(item)}
        addToCart={() => _addToCart(item)}
      />
    );
  };

  const onPressChildCards = (item) => {
    // updateState({selectedSbCategoryID: item.id});
    navigation.push(navigationStrings.PRODUCT_LIST, {data: item});
  };

  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: width * 0.5 - 21.5,
    offset: (width * 0.5 - 21.5) * index,
    index,
  });

  // changeTab function
  const changeTab = (tabData) => {
    let clonedArray = cloneDeep(category_list);
    let upDatedTabBar = cloneDeep(tabData);
    upDatedTabBar.is_selected = true;
    updateState({
      isLoading: true,
      category_list: clonedArray.map((item) => {
        if (item.id == tabData.id) {
          item.is_selected = true;
          return item;
        } else {
          item.is_selected = false;
          return item;
        }
      }),
      selectedTab: upDatedTabBar,
      // selectedTab: clonedArray.filter((x) => x.is_selected),
    });
  };

  //To remove flickering of icon and image we are creating the header child seperately
  const listHeaderComponent = () => {
    return (
      <Fragment>
        {category_list && category_list.length ? (
          <CustomTopTabBar
            scrollEnabled={true}
            tabBarItems={category_list}
            customContainerStyle={
              isDarkMode
                ? {backgroundColor: MyDarkTheme.colors.background}
                : {backgroundColor: colors.white}
            }
            onPress={(tabData) => changeTab(tabData)}
            customTextContainerStyle={{
              width: width / 3,
            }}
            textStyle={{
              fontFamily: fontFamily.medium,
              fontSize: textScale(12),
            }}
            topBarMainView={{width: width / 3}}
            textTabBarView={{
              width: moderateScale(width / 3),
              borderBottomWidth: 1,
            }}
          />
        ) : null}

        {/* <View style={{marginTop: moderateScaleVertical(20)}} /> */}
      </Fragment>
    );
  };

  const _reDirectToVendorList = () => {
    navigation.navigate(navigationStrings.VENDORLIST, {
      selectedVendor: selectedVendor,
      allVendors: vendor_list,
      screenType: staticStrings.PRODUCTS,
    });
  };

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
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5 ? imagePath.icBackb : imagePath.back
        }
        centerTitle={selectedVendor?.name || ''}
        showImageAlongwithTitle={true}
        hideRight={true}
        rightIcon={gridView ? imagePath.gridViewIcon : imagePath.listViewIcon}
        onPressRight={() => updateState({gridView: !gridView})}
        rightIconStyle={{tintColor: colors.black}}
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      {listHeaderComponent()}
      <View style={{...commonStyles.headerTopLine}} />

      <FlatList
        key={gridView ? '_' : '#'}
        data={productListData || []}
        renderItem={renderProduct}
        // ListHeaderComponent={listHeaderComponent()}
        keyExtractor={(item, index) =>
          gridView ? '_' + String(index) : '#' + String(index)
        }
        keyboardShouldPersistTaps="always"
        numColumns={gridView ? 2 : 1}
        showsVerticalScrollIndicator={false}
        style={{flex: 1, marginTop: moderateScaleVertical(20)}}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        ItemSeparatorComponent={() => (
          <View style={{height: gridView ? 20 : 10}} />
        )}
        columnWrapperStyle={
          gridView
            ? {
                justifyContent: 'space-between',
                marginHorizontal: moderateScale(14),
              }
            : null
        }
        refreshing={isRefreshing}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={(val) => console.log('indexed failed')}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={10}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        onEndReached={onEndReachedDelayed}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => <View style={{height: 20}} />}
        ListEmptyComponent={!isLoading && <ListEmptyProduct />}
      />
    </WrapperContainer>
  );
}
