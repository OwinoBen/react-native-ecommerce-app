import {debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {useSelector} from 'react-redux';
import EmptyListLoader from '../../Components/EmptyListLoader';
import Header2 from '../../Components/Header2';
import MarketCard2 from '../../Components/MarketCard2';
import NoDataFound from '../../Components/NoDataFound';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';
import ListEmptyVendors from './ListEmptyVendors';
import ProductLoader2 from '../../Components/Loaders/ProductLoader2';
import {useDarkMode} from 'react-native-dynamic';
import { MyDarkTheme } from '../../styles/theme';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function Vendors2({route, navigation}) {
  const [state, setState] = useState({
    isLoading: true,
    pageNo: 1,
    limit: 5,
    isRefreshing: false,
  });
  const {appData, themeColors, themeLayouts, currencies, languages} =
    useSelector((state) => state.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const categoryData = useSelector((state) => state?.vendor?.categoryData);
  const {isLoading, pageNo, isRefreshing, limit} = state;
  const {data} = route.params;
  console.log(data, 'vebndor data????');
  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  useEffect(() => {
    actions
      .getDataByCategoryId(
        `/${data.id}?limit=${limit}&page=${pageNo}`,
        {},
        {code: appData.profile.code},
      )
      .then((res) => {
        updateState({isLoading: false, isRefreshing: false});
        const vendorData = {
          category: res.data.category,
          listData:
            pageNo == 1
              ? res.data.listData.data
              : [...categoryData?.listData, ...res.data.listData.data],
        };
        actions.saveVendorListingAndCategoryInfo(vendorData);
      })
      .catch(errorMethod);
  }, [pageNo, isRefreshing]);

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

  //************Check the redirecton screen********/
  const _checkRedirectScreen = (item) => {
    {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            categoryData: data,
          })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: item.id,
            vendor: true,
            name: item.name,
            category_slug: data?.slug,
            categoryExist: data?.id || null
          })();
    }
  };

  /**********/

  const _renderItem = ({item, index}) => {
    return (
      // <MarketCard onPress={() => _checkRedirectScreen(item)} data={item} />
      <MarketCard2 onPress={() => _checkRedirectScreen(item)} data={item} />
    );
  };

  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: width - moderateScale(32),
    offset: (width - moderateScale(32)) * index,
    index,
  });

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}>
      <Header2
        leftIcon={imagePath.backArrow}
        centerTitle={data?.name}
        rightIcon={imagePath.slider}
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />
      <View style={{...commonStyles.headerTopLine}} />
      {isLoading ? (
        <View
          style={{
            marginTop: moderateScale(40),
          }}>
          <ProductLoader2 isLoading={isLoading} isProductList />
        </View>
      ) : (
        <View style={{marginHorizontal: moderateScale(20), flex: 1}}>
          {isLoading && categoryData?.listData && (
            <EmptyListLoader isLoading={isLoading} isVendorList />
          )}
          <FlatList
            showsVerticalScrollIndicator={false}
            data={(!isLoading && categoryData?.listData) || []}
            ListHeaderComponent={<View style={{height: 20}} />}
            ItemSeparatorComponent={() => (
              <View style={{height: moderateScaleVertical(50)}} />
            )}
            keyExtractor={(item, index) => String(index)}
            renderItem={_renderItem}
            refreshing={isRefreshing}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={themeColors.primary_color}
                // titleColor="#fff"
              />
            }
              getItemLayout={getItemLayout}
              onScrollToIndexFailed={(val) => console.log('indexed failed')}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={10}
            onEndReached={onEndReachedDelayed}
            onEndReachedThreshold={0.5}
            // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
            // ListEmptyComponent={<NoDataFound text={strings.NODATAFOUND} />}
            ListFooterComponent={() => <View style={{height: 20}} />}
          />
        </View>
      )}
    </WrapperContainer>
    //<VendorsDesign1 />
  );
}
