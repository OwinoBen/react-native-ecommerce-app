import {debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import HeaderWithFilters from '../../Components/HeaderWithFilters';
import MarketCard from '../../Components/MarketCard';
import MarketCard2 from '../../Components/MarketCard2';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
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
import VendorsDesign1 from './Vendors2';
import {useDarkMode} from 'react-native-dynamic';
import { MyDarkTheme } from '../../styles/theme';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function Vendors({route, navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
    pageNo: 1,
    limit: 5,
    isRefreshing: false,
  });
  const {appData, themeColors, themeLayouts, currencies, languages} =
    useSelector((state) => state.initBoot);
  const location = useSelector((state) => state?.home?.location);

  const categoryData = useSelector((state) => state?.vendor?.categoryData);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);

  const {isLoading, pageNo, isRefreshing, limit} = state;
  const {data} = route.params;
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
    // let latlongObj = {};
    // if (appData?.profile?.preferences?.is_hyperlocal) {
    //   latlongObj = {
    //     address: location?.address,
    //     latitude: location?.latitude,
    //     longitude: location?.longitude,
    //   };
    // }
    actions
      .getDataByCategoryId(
        `/${data.id}?limit=${limit}&page=${pageNo}&type=${dine_In_Type}`,
        {},
        {code: appData.profile.code},
      )
      .then((res) => {
        console.log('All vendors', res);
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
      <MarketCard onPress={() => _checkRedirectScreen(item)} data={item} />
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
      <Header
        leftIcon={imagePath.back}
        centerTitle={data?.name}
        rightIcon={imagePath.search}
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />
      <View style={{...commonStyles.headerTopLine}} />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={(!isLoading && categoryData?.listData) || []}
        ListHeaderComponent={<View style={{height: 20}} />}
        ItemSeparatorComponent={() => <View style={{height: 8}} />}
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
        ListEmptyComponent={
          <ListEmptyVendors isLoading={isLoading} emptyText={'No data found'} />
        }
        ListFooterComponent={() => <View style={{height: 100}} />}
      />
    </WrapperContainer>

    //<VendorsDesign1 />
  );
}
