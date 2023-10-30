import React, {useEffect, useState} from 'react';
import {FlatList, View, ScrollView, RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';
import BrandCard2 from '../../Components/BrandCard2';
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
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import CardLoader from '../../Components/Loaders/CardLoader';
import stylesFunc from './styles';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import actions from '../../redux/actions';
import {showError} from '../../utils/helperFunctions';
import {debounce} from 'lodash';
import NoDataFound from '../../Components/NoDataFound';

export default function CategoryBrands({navigation, route}) {
  const {data} = route?.params;
  console.log(data, 'paramsData');
  const {location, appMainData, dineInType} = useSelector(
    (state) => state?.home,
  );
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

  const styles = stylesFunc({themeColors, fontFamily});

  const [state, setState] = useState({
    isLoading: true,
    pageNo: 1,
    limit: 5,
    isRefreshing: false,
    listData: []
  });
  const {isLoading, limit, pageNo, isRefreshing,listData} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  //Redux store data

  useEffect(() => {
    actions
      .getDataByCategoryId(
        `/${data.id}?limit=${limit}&page=${pageNo}&type=${dineInType}`,
        {},
        {
          code: appData.profile.code,
          latitude: location?.latitude.toString() || '',
          longitude: location?.longitude.toString() || '',
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({
          isRefreshing: false,
          isLoading: false,
          listData: pageNo == 1
                ? res?.data.listData.data
                : [...listData, ...res.data.listData.data],
        });
        

        // const vendorData = {
        //   category: res.data.category,
        //   listData:
        //     pageNo == 1
        //       ? res?.data.listData.data
        //       : [...categoryData?.listData, ...res.data.listData.data],
        // };
        // actions.saveVendorListingAndCategoryInfo(vendorData);
      })
      .catch(errorMethod);
  }, [isRefreshing, pageNo]);

  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({
      isRefreshing: false,
      isLoading: false,
    });
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

  const _renderItem = ({item, index}) => {
    return (
      <BrandCard2
        data={item}
        onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}
      />
    );
  };

  if (isLoading) {
    return (
      <WrapperContainer
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }
        statusBarColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }>
        <Header
          centerTitle={strings.BRANDS}
          leftIcon={
            appStyle?.homePageLayout === 2
              ? imagePath.backArrow
              : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
          }
          rightIcon={
            appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icSearchb
              : imagePath.search
          }
          onPressRight={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }
        />

        <View style={{height: 1, backgroundColor: colors.borderLight}} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {[{}, {}, {}, {}, {}, {}].map((val, i) => {
            return (
              <View
                key={String(i)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: moderateScale(15),
                }}>
                <HeaderLoader
                  isRight={false}
                  widthLeft={(width - moderateScale(30)) / 3.25}
                  rectWidthLeft={(width - moderateScale(30)) / 3.25}
                  rectHeightLeft={moderateScaleVertical(100)}
                  heightLeft={moderateScaleVertical(100)}
                  viewStyles={{
                    marginHorizontal: 0,
                    marginTop: moderateScaleVertical(12),
                  }}
                  rx={3}
                  ry={3}
                />
                <HeaderLoader
                  isRight={false}
                  widthLeft={(width - moderateScale(30)) / 3.25}
                  rectWidthLeft={(width - moderateScale(30)) / 3.25}
                  rectHeightLeft={moderateScaleVertical(100)}
                  heightLeft={moderateScaleVertical(100)}
                  viewStyles={{
                    marginHorizontal: 0,
                    marginTop: moderateScaleVertical(12),
                  }}
                  rx={3}
                  ry={3}
                />
                <HeaderLoader
                  isRight={false}
                  widthLeft={(width - moderateScale(30)) / 3.25}
                  rectWidthLeft={(width - moderateScale(30)) / 3.25}
                  rectHeightLeft={moderateScaleVertical(100)}
                  heightLeft={moderateScaleVertical(100)}
                  viewStyles={{
                    marginHorizontal: 0,
                    marginTop: moderateScaleVertical(12),
                  }}
                  rx={3}
                  ry={3}
                />
              </View>
            );
          })}
          <View style={{height: width / 8}} />
        </ScrollView>
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }>
      <Header
        centerTitle={strings.BRANDS}
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        rightIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icSearchb
            : imagePath.search
        }
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />

      <View style={{height: 1, backgroundColor: colors.borderLight}} />

      <FlatList
        data={listData || []}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<View style={{height: 10}} />}
        keyExtractor={(item, index) => String(index)}
        contentContainerStyle={{flexGrow: 1}}
        ItemSeparatorComponent={() => (
          <View style={{height: moderateScaleVertical(10)}} />
        )}
        numColumns={3}
        renderItem={_renderItem}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        onEndReached={onEndReachedDelayed}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <NoDataFound isLoading={isLoading} containerStyle={{}} />
        }
      />
    </WrapperContainer>
  );
}
