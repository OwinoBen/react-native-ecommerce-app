import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import SearchLoader from '../../Components/Loaders/SearchLoader';
import MarketCard3 from '../../Components/MarketCard3';
import NoDataFound from '../../Components/NoDataFound';
import SearchBar2 from '../../Components/SearchBar2';
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
import { MyDarkTheme } from '../../styles/theme';
import { showError } from '../../utils/helperFunctions';
import * as Animatable from 'react-native-animatable';
import Header from '../../Components/Header';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);

import FooterLoader from '../../Components/FooterLoader';

export default function Vendors3({ route, navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
    pageNo: 1,
    limit: 5,
    isRefreshing: false,
    listData: [],
    loadMore: true,
    totalProduct: 0,
  });
  const { appData, themeColors, themeLayouts, currencies, languages, appStyle } =
    useSelector((state) => state.initBoot);

  const categoryData = useSelector((state) => state?.vendor?.categoryData);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);

  // alert(dine_In_Type);
  const location = useSelector((state) => state?.home?.location);

  const { isLoading, pageNo, isRefreshing, limit, listData, loadMore, totalProduct } = state;
  const { data } = route.params;
  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({ fontFamily });

  useEffect(() => {
    actions
      .getDataByCategoryId(
        `/${data.id || data }?limit=${limit}&page=${pageNo}&type=${dine_In_Type}`,
        {},
        {
          code: appData.profile.code,
          latitude: location?.latitude || '',
          longitude: location?.longitude || '',
        },
      )
      .then((res) => {

        updateState({ isLoading: false, isRefreshing: false });

        if (totalProduct == 0) {
          updateState({ totalProduct: res?.data?.listData.total });
        }
        updateState({
          listData:
            pageNo == 1
              ? res.data.listData.data
              : [...listData, ...res.data.listData.data],
        });
      })
      .catch(errorMethod);
  }, [pageNo, isRefreshing]);

  const errorMethod = (error) => {
    updateState({ isLoading: false, isRefreshing: false });
    showError(error?.message || error?.error);
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ pageNo: 1, isRefreshing: true });
  };

  //pagination of data
  const onEndReached = ({ distanceFromEnd }) => {
    if (totalProduct !== listData.length) {
      updateState({ pageNo: pageNo + 1, loadMore: true });
    } else {
      updateState({ loadMore: false });
    }
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
          fetchOffers: true,
          categoryExist: data?.id || null,
        })();
    }
  };

  const _renderItem = ({ item, index }) => {
    return (
      <Animatable.View
        animation={'fadeInUp'}
        delay={index * 60}
        style={{ marginHorizontal: moderateScale(15) }}>
        <MarketCard3 onPress={() => _checkRedirectScreen(item)} data={item} />
      </Animatable.View>
    );
  };

  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: width - moderateScale(32),
    offset: (width - moderateScale(32)) * index,
    index,
  });

  const listFooterComponent = () => {
    return <View style={{ height: moderateScale(100) }}>
      {
        !!loadMore && <FooterLoader style={{ color: themeColors?.primary_color }} />
      }

    </View>;
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}>
      <Header
        leftIcon={imagePath.icBackb}
        centerTitle={data?.name}
        location={location}
        headerStyle={{
          marginBottom: moderateScaleVertical(8),
        }}
      />
      {/* <View style={{flexDirection: 'row', alignItems: 'center'}}> */}
      {isLoading ? (
        <SearchLoader viewStyles={{ marginVertical: moderateScale(17) }} />
      ) : (
        <SearchBar2 navigation={navigation} />
      )}
      {/* <Image
          style={
            isDarkMode
              && {tintColor: MyDarkTheme.colors.text}
              
          }
          source={imagePath.filter1}
        /> */}
      {/* </View> */}
      {!!isLoading ? (
        <View style={{ alignItems: 'center' }}>
          <HeaderLoader
            viewStyles={{ marginTop: 5 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{ marginTop: 15 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{ marginTop: 15 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{ marginTop: 15 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{ marginTop: 15 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
          />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={(!isLoading && listData) || []}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
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
            !isLoading && (
              <View
                style={{
                  flex: 1,
                  marginTop: moderateScaleVertical(width / 2),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <NoDataFound isLoading={state.isLoading} />
              </View>
            )
          }
          ListFooterComponent={listFooterComponent}
        />
      )}
    </WrapperContainer>

    //<VendorsDesign1 />
  );
}
