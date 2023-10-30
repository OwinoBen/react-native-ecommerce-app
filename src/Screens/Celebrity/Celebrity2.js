import React, {useEffect, useRef, useState} from 'react';
import {FlatList, ScrollView, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import CelebrityLoader from '../../Components/Loaders/CelebrityLoader';
import NoDataFound from '../../Components/NoDataFound';
import ThreeColumnCard from '../../Components/ThreeColumnCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError} from '../../utils/helperFunctions';
import ListEmptyCleb from './ListEmptyCeleb';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';

export default function Celebrity2({navigation}) {
  const swiperRef = useRef();
  const [state, setState] = useState({
    isLoading: true,
    celebrityList: [],
    scrollableDataArray: [
      'All',
      'ABCD',
      'EFGH',
      'IJKL',
      'MNOP',
      'QRST',
      'UVWX',
      'YZ',
    ],
    selectedTab: 'All',
    pageIndex: 0,
  });
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, currencies, languages, appStyle, themeColors} = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});

  const {isLoading, celebrityList, scrollableDataArray, selectedTab} = state;

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };
  //get list of celebrity based on selected top tab item
  useEffect(() => {
    if (!!celebrityList?.length) {
      updateState({isLoading: true});
    }
    _getAllCelebrity();
  }, [selectedTab]);

  //get list of celebrity
  const _getAllCelebrity = () => {
    let query = '';
    if (selectedTab == 'All') {
      query = '/all';
    } else {
      query = `/${selectedTab}`;
    }
    actions
      ._getAllCelebrityData(
        query,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'res>>>>DATA');
        if (res) {
          updateState({celebrityList: res.data});
        }
        updateState({
          isLoading: false,
        });
      })
      .catch(errorMethod);
  };
  //Error handling of api
  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({isLoading: false});
    showError(error?.message || error?.error);
  };

  //Update state in screen
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const _onPress = (item, key) => {
    // if (swiperRef.current) {
    //   swiperRef.current.setPage(key);
    // }
    updateState({pageIndex: key, selectedTab: scrollableDataArray[key]});
  };
  //Rendered view of list of celebrity
  const _renderItem = ({item, index}) => {
    return (
      <ThreeColumnCard
        onPress={moveToNewScreen(navigationStrings.CELEBRITYDETAIL, item)}
        data={item}
        cardIndex={index}
        withTextBG
      />
    );
  };

  //Flatlist component for List of celebrities
  const _listOfCelebraties = () => {
    return (
      <FlatList
        data={isLoading ? [] : celebrityList}
        extraData={state}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        style={{flex: 1}}
        ListHeaderComponent={<View style={{height: 10}} />}
        contentContainerStyle={{paddingHorizontal: moderateScale(16)}}
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
        renderItem={_renderItem}
        keyExtractor={(item, index) => String(index)}
        ListEmptyComponent={
          <NoDataFound
            isLoading={isLoading}
            containerStyle={{marginVertical: moderateScaleVertical(height / 4)}}
          />
        }
      />
    );
  };

  const celebrityTagLoader = () => {
    return (
      <HeaderLoader
        isRight={false}
        widthLeft={(width - moderateScale(44)) / 7}
        rectWidthLeft={(width - moderateScale(44)) / 7}
        rectHeightLeft={moderateScaleVertical(15)}
        heightLeft={moderateScaleVertical(15)}
        viewStyles={{
          marginHorizontal: 0,
        }}
        rx={8}
        ry={8}
      />
    );
  };

  const celebrityLoader = () => {
    return (
      <View>
        <HeaderLoader
          isRight={false}
          widthLeft={(width - moderateScale(44)) / 3}
          rectWidthLeft={(width - moderateScale(44)) / 3}
          rectHeightLeft={moderateScaleVertical(110)}
          heightLeft={moderateScaleVertical(110)}
          viewStyles={{
            marginHorizontal: 0,
            marginTop: moderateScaleVertical(20),
          }}
          rx={5}
          ry={5}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={(width - moderateScale(44)) / 3.6}
          rectWidthLeft={(width - moderateScale(44)) / 3.6}
          rectHeightLeft={moderateScaleVertical(8)}
          heightLeft={moderateScaleVertical(8)}
          viewStyles={{
            marginHorizontal: 0,
            marginTop: moderateScaleVertical(5),
            alignSelf: 'center',
          }}
          rx={5}
          ry={5}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <WrapperContainer
        bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
        statusBarColor={colors.white}>
        <Header
          centerTitle={strings.CELEBRITIES}
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
          onPressLeft={() => navigation.navigate(navigationStrings.HOMESTACK)}
        />
        <View
          style={{
            marginLeft: moderateScale(30),
            marginRight: moderateScale(15),
            marginVertical: moderateScaleVertical(15),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {[1, 1, 1, 1, 1, 1].map((i, indx) => {
            return <View key={String(indx)}>{celebrityTagLoader()}</View>;
          })}
        </View>
        <View
          style={{
            height: 0.5,
            backgroundColor: colors.lightGreyBg,
            marginHorizontal: moderateScale(15),
          }}></View>
        <View
          style={{
            marginHorizontal: moderateScale(15),
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
          {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((i, inx) => {
            return <View key={String(inx)}>{celebrityLoader()}</View>;
          })}
        </View>
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}>
      <Header
        centerTitle={strings.CELEBRITIES}
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
        onPressLeft={() => navigation.navigate(navigationStrings.HOMESTACK)}
      />

      <View style={{height: 50}}>
        <ScrollView
          style={styles.scrollviewHorizontal2}
          contentContainerStyle={{paddingHorizontal: moderateScale(16)}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {scrollableDataArray.map((item, index) => {
            return (
              <Text
                key={String(index)}
                onPress={() => _onPress(item, index)}
                style={
                  selectedTab == item
                    ? [styles.headerText2, {color: themeColors.primary_color}]
                    : [styles.headerText2]
                }>
                {item}
              </Text>
            );
          })}
        </ScrollView>
      </View>

      <View style={{flex: 1, marginTop: 3}}>{_listOfCelebraties()}</View>

      {/* <View style={{flex: 1}}>{_listOfCelebraties()}</View> */}

      {/* <PagerView
        ref={swiperRef}
        style={{flex: 1}}
        initialPage={pageIndex}
        scrollEnabled={true}
        onPageSelected={(e) => {
          console.log(e.currentTarget,"ererere")
          // swiperRef.current.setPage(e.nativeEvent.position);
          // updateState({pageIndex: e.nativeEvent.position})
        }}
        >
        {scrollableDataArray.map((item, index) => {
          return isLoading ? (
            <View>
              <View style={{height: 10}} />
              <CelebrityLoader listSize={5} isRow />
            </View>
          ) : (
            <View style={{flex: 1}} key={index} collapsable={false}>
              {pageIndex == index ? _listOfCelebraties() : null}
            </View>
          );
        })}
      </PagerView> */}
    </WrapperContainer>
  );
}
