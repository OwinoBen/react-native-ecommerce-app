import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {
  loaderOne,
  searchLoader,
} from '../../Components/Loaders/AnimatedLoaderFiles';
import SearchBar from '../../Components/SearchBar';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import LottieView from 'lottie-react-native';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function SearchProductVendorItem({navigation, route}) {
  const [state, setState] = useState({
    isLoading: true,
    searchInput: '',
    searchData: [],
    showRightIcon: false,
  });
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {isLoading, searchInput, searchData, showRightIcon} = state;
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);

  //route params
  const paramData = route?.params?.data;
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});

  console.log('param data', paramData);
  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const onChangeText = (value) => {
    updateState({
      searchInput: value,
      isLoading: false,
    });
  };

  //Global searching of data
  const globalSearch = () => {
    let data = {};
    data['keyword'] = searchInput;
    let query = '';
    let searchAction = null;
    if (paramData?.type == staticStrings.CATEGORY) {
      query = `/${paramData.id}`;
      searchAction = actions.onSearchByCategory;
    } else if (paramData?.type == staticStrings.VENDOR) {
      query = `/${paramData.id}`;
      searchAction = actions.onSearchByVendor;
    } else if (paramData?.type == staticStrings.BRAND) {
      query = `/${paramData.id}`;
      searchAction = actions.onSearchByBrand;
    } else {
      searchAction = actions.onGlobalSearch;
    }
    searchAction(query, data, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    })
      .then((response) => {
        console.log(response.data);
        updateState({
          searchData: response.data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        updateState({
          searchData: [],
          isLoading: false,
        });
      });
  };

  // //Search data by category id
  // const searchByCategory = () => {
  //   let data = {};
  //   data['keyword'] = searchInput;
  //   actions
  //     .onGlobalSearch(data, {
  //       code: appData?.profile?.code,
  //       currency: currencies?.primary_currency?.id,
  //       language: languages?.primary_language?.id,
  //     })
  //     .then((response) => {
  //       console.log(response, 'THIS IS DATA');
  //       // updateState({
  //       //   searchData: response.data,
  //       //   isLoading: false,
  //       // });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       // updateState({
  //       //   searchData: [],
  //       //   isLoading: false,
  //       // });
  //     });
  // };

  useEffect(() => {
    if (searchInput != '') {
      updateState({showRightIcon: true});
      globalSearch();
    } else {
      updateState({searchData: [], showRightIcon: false, isLoading: false});
    }
  }, [searchInput]);

  const _onclickSearchItem = (item) => {
    if (item.response_type == 'category') {
      if (item?.type?.redirect_to == staticStrings.VENDOR) {
        navigation.push(navigationStrings.VENDOR, {
          data: {
            id: item.id,
            name: item.dataname,
          },
        });
      } else if (item?.type?.redirect_to == staticStrings.PRODUCT) {
        navigation.push(navigationStrings.PRODUCT_LIST, {
          data: {
            id: item.id,
            name: item.dataname,
          },
        });
      } else {
        moveToNewScreen(navigationStrings.DELIVERY, item)();
      }
    }
    if (item.response_type == 'brand') {
      navigation.push(navigationStrings.BRANDDETAIL, {
        data: {
          id: item.id,
          name: item.dataname,
        },
      });
    }
    if (item.response_type == 'vendor') {
      navigation.push(navigationStrings.PRODUCT_LIST, {
        data: {
          id: item.id,
          vendor: true,
          name: item.dataname,
        },
      });
    }
    if (item.response_type == 'product') {
      navigation.push(navigationStrings.PRODUCTDETAIL, {data: {id: item.id}});
    }
  };

  const renderProduct = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => _onclickSearchItem(item)}
        style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex: 0.9}}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: fontFamily.medium,
              color: colors.greyLight,
            }}>
            {item.dataname || item.title}
          </Text>
        </View>
        <View style={{flex: 0.1}}>
          <Image
            style={
              isDarkMode
                ? {tintColor: MyDarkTheme.colors.text, opacity: 0.7}
                : {opacity: 0.7}
            }
            source={imagePath.sideUpwordArrow}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const _listComponent = () => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <LottieView
          source={searchLoader}
          autoPlay
          loop
          style={{
            height: moderateScaleVertical(200),
            width: moderateScale(200),
          }}
        />
        {/* <Image source={imagePath.search_gif} /> */}
      </View>
    );
  };
  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={strings.SEARCH}
        // rightIcon={imagePath.cartShop}
        headerStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.greysearchHeader,
        }}
      />

      <View style={{...commonStyles.headerTopLine}} />
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.greySearchBackground,
        }}>
        <View
          style={{
            flex: 0.15,
            flexDirection: 'column',
            justifyContent: 'center',
            // backgroundColor:'red'
          }}>
          <SearchBar
            containerStyle={{
              marginHorizontal: moderateScale(20),
              borderRadius: 15,
            }}
            searchValue={searchInput}
            placeholder={strings.SEARCH_PRODUCT_VENDOR_ITEM}
            onChangeText={(value) => onChangeText(value)}
            showRightIcon={showRightIcon}
            rightIconPress={() =>
              updateState({searchInput: '', isLoading: false})
            }
           
          />
        </View>

        <FlatList
          data={searchData}
          renderItem={renderProduct}
          keyExtractor={(item, index) => String(index)}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            marginVertical: moderateScaleVertical(10),
            marginHorizontal: moderateScale(20),
            // backgroundColor: 'black',
          }}
          //ListEmptyComponent={_listEmptyComponent}
          ItemSeparatorComponent={() => <View style={{height: 30}} />}
        />
      </View>
    </WrapperContainer>
  );
}
