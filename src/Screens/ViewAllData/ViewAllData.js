import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import Header3 from '../../Components/Header3';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import SearchLoader from '../../Components/Loaders/SearchLoader';
import MarketCard3 from '../../Components/MarketCard3';
import NoDataFound from '../../Components/NoDataFound';
import SearchBar2 from '../../Components/SearchBar2';
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
import { MyDarkTheme } from '../../styles/theme';
import FooterLoader from '../../Components/FooterLoader';

import { enableFreeze } from "react-native-screens";
import { UIActivityIndicator } from 'react-native-indicators';
import { debounce } from 'lodash';
enableFreeze(true);


var noMoreData = false;

export default function ViewAllData({ route, navigation }) {
  const { appData, themeColors, currencies, languages, appStyle } = useSelector(
    (state) => state.initBoot,
  );
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const { appMainData, dineInType, location } = useSelector(
    (state) => state?.home,
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({ fontFamily });



  const [state, setState] = useState({
    isLoading: true,
    pageNo: 1,
    limit: 10,
    isRefreshing: false,
    data: [],
    openVendor: 1,
    closeVendor: 0,
    bestSeller: 0,
    nearMe: 0,
  });

  const {
    isLoading,
    pageNo,
    isRefreshing,
    limit,
    data,
    openVendor,
    closeVendor,
    bestSeller,
    nearMe,
  } = state;

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    apiHit(pageNo);

    // const homeAllFilters = () => {
    //   let homeFilter = [
    //     { id: 1, type: strings.OPEN },
    //     { id: 2, type: strings.CLOSE },
    //     { id: 3, type: strings.BESTSELLER },
    //   ];
    //   if (!!appData?.profile?.preferences?.is_hyperlocal) {
    //     homeFilter.push({ id: 4, type: strings.NEAR_BY });
    //   } else {
    //     if (homeFilter.length > 3) {
    //       homeFilter.pop();
    //     }
    //   }
    //   return homeFilter;
    // };
    return () => noMoreData = false
  }, []);

  //Home data
  const apiHit = (pageNo) => {
    let latlongObj = {};
    if (!!appData?.profile?.preferences?.is_hyperlocal) {
      latlongObj = {
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
    }
    let vendorFilterData = {
      close_vendor: 1,
      open_vendor: 0,
      best_vendor: 0,
      near_me: 0,
    };

    console.log(noMoreData, 'noMoreDatanoMoreData');


    // let query = `?limit=${limit}&page=${pageNo}&close_vendor=${1}&open_vendor=${0}&best_vendor=${0}&near_me=${0}`
    let query = `?limit=${limit}&page=${pageNo}&type=${dineInType ? dineInType : dineInType
      }&latitude=${latlongObj?.latitude || ''}&longitude=${latlongObj?.longitude || ''
      }`;

    let headers = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    };
    console.log('sending headers', headers);
    console.log('sending query', query);

    actions
      .vendorAll(query, {}, headers)
      .then((res) => {
        console.log('Home data++++++', res?.data);
        if (res?.data?.data?.length == 0) {
          noMoreData = true
        }
        updateState({
          data: pageNo == 1 ? res?.data?.data : [...data, ...res?.data?.data],
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log('error raised', error);
        updateState({
          isLoading: false,
        });
      });
  };
  console.log('data length', data.length);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

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
          isVendorList: true,
          fetchOffers: true,
        })();
    }
  };

  /**********/

  const _renderItem = ({ item, index }) => {
    return (
      <Animatable.View
        style={{ marginHorizontal: moderateScale(15) }}
      // animation={'fadeInUp'}
      // delay={index * 60}
      >
        <MarketCard3 onPress={() => _checkRedirectScreen(item)} data={item} />
      </Animatable.View>
    );
  };

  if (isLoading) {
    return (
      <WrapperContainer
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }
        statusBarColor={colors.backgroundGrey}>
        <Header3
          leftIcon={imagePath.icBackb}
          centerTitle={data?.name}
          rightIcon={imagePath.search}
          showAddress={false}
        // location={location}
        // onPressRight={() =>
        //   navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        // }
        />
        <View style={{ alignItems: 'center' }}>
          <SearchLoader viewStyles={{ marginVertical: moderateScale(17) }} />
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
      </WrapperContainer>
    );
  }


  const onEndReached = () => {
    if (!noMoreData) {
      updateState({ pageNo: pageNo + 1 });
      apiHit(pageNo + 1);
    } else {
      noMoreData = true
    }
  };
  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const listFooterComponent = () => {
    return (
      <View style={{ marginBottom: moderateScale(100), marginTop: moderateScaleVertical(16) }}>
        <UIActivityIndicator
          color={themeColors?.primary_color}
          size={30}
        />
      </View>
    )
  }

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      // isLoading={loadMore}
      >

      <Header3
        leftIcon={imagePath.icBackb}
        showAddress={false}
        rightIcon={imagePath.search}


      />
      {/* <TouchableOpacity>
          <Image source={imagePath.filter} />
        </TouchableOpacity> */}

      <SearchBar2 navigation={navigation} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        extraData={data}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        keyExtractor={(item, index) => String(index)}
        renderItem={_renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReachedDelayed}
        initialNumToRender={6}
        ListEmptyComponent={
          !isLoading && (
            <View
              style={{
                flex: 1,
                marginTop: moderateScaleVertical(width / 2),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <NoDataFound isLoading={isLoading} />
            </View>
          )
        }
        ListFooterComponent={!noMoreData ?
          <>{listFooterComponent()}</>
          : <View style={{ height: moderateScale(100) }} />}
      />
    </WrapperContainer>
  );
}
