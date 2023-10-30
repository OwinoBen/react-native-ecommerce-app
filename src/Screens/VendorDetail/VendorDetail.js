import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import VendorDetailLoader from '../../Components/Loaders/VendorDetailLoader';
import ThreeColumnCard from '../../Components/ThreeColumnCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import staticStrings from '../../constants/staticStrings';
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
import ListEmptyVendors from '../Vendors/ListEmptyVendors';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import strings from '../../constants/lang';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function VendorDetail({navigation, route}) {
  let vendorParams = route?.params?.data;
  console.log(vendorParams, 'vendorParams>>>>>>>');
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  // alert("312")
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const userData = useSelector((state) => state?.auth?.userData);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    vendorId: vendorParams?.item?.id || vendorParams.id,
    vendordName: vendorParams.name || '',
    vendorData: [],
    isLoading: true,
    limit: 12,
    pageNo: 1,
  });
  const {vendorId, vendorData, isLoading, limit, pageNo, vendordName} = state;
  useEffect(() => {
    if (
      vendorParams &&
      vendorParams?.item &&
      vendorParams?.item?.redirect_to == staticStrings.SUBCATEGORY
    ) {
      getSubCategoryDetailData();
    } else {
      getVendorDetailData();
    }
  }, [vendorId]);

  const convertLocalDateToUTCDate = (date, toUTC) => {
    date = new Date(date);
    //Local time converted to UTC
    var localOffset = date.getTimezoneOffset() * 60000;
    var localTime = date.getTime();
    if (toUTC) {
      date = localTime + localOffset;
    } else {
      date = localTime - localOffset;
    }
    date = new Date(date);
    return date;
  };

  useEffect(() => {
    convertLocalDateToUTCDate('2021-09-28T00:00', true);
  }, []);

  const {appData, appStyle, currencies, languages} = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  /***********GET SUBCATEGORY  DETAIL DATA******** */

  const getSubCategoryDetailData = () => {
    //
    actions
      .getProductByCategoryId(
        `/${vendorId}?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log(res, 'res>>>category data');
        updateState({isLoading: false});
        if (res && res.data) {
          updateState({vendorData: res.data.listData});
        }
      })
      .catch(errorMethod);
  };
  /*********** */

  /*********GET VENDOR DETAIL********* */
  const getVendorDetailData = () => {
    let data = {};
    data['vendor_id'] = vendorId;

    actions
      .getVendorDetail(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then((res) => {
        updateState({isLoading: false});
        if (res && res.data) {
          console.log(res, 'res>>res');
          let newArray = res.data;
          // if (vendorParams?.rootProducts) {
          //   // console.log(
          //   //   newArray.filter((x) => x?.id != vendorParams?.categoryData?.id),
          //   //   'newArray>>>>',
          //   // );
          //   newArray= newArray.filter((x) => x?.id != vendorParams?.categoryData?.id)
          // }
          updateState({vendorData: newArray});
        }
      })
      .catch(errorMethod);
  };

  /********* */

  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
    showError(error?.message || error?.error);
  };

  const onPressItem = (item) => {
    console.log('item+++', item);

    if (!!item?.type && item?.type?.id == 7) {
      if (!!userData?.auth_token) {
        item['pickup_taxi'] = true;
        item['redirect_to'] = item.type.redirect_to;
        navigation.navigate(navigationStrings.ADDADDRESS, {data: item});
        return;
      }
      actions.setAppSessionData('on_login');
      return;
    }
    if (!!item?.redirect_to && item?.redirect_to == staticStrings.PRODUCT) {
      navigation.navigate(navigationStrings.PRODUCT_LIST, {
        data: {
          id: item.id,
          rootProducts: vendorParams?.rootProducts,
          vendor: vendorParams?.rootProducts ? true : false,
          vendorData: vendorParams?.item,
          categoryInfo: item,
          name: item.name,
          isVendorList: false,
          category_slug: item?.slug,
          categoryExist: item?.id || null,
        },
      });
      return;
    }
    if (!!item?.type && item?.type.redirect_to == staticStrings.PRODUCT) {
      navigation.navigate(navigationStrings.PRODUCT_LIST, {
        data: {
          id: item.id,
          rootProducts: vendorParams?.rootProducts,
          vendor: vendorParams?.rootProducts ? true : false,
          vendorData: vendorParams?.item,
          categoryInfo: item,
          name: item.name,
          isVendorList: false,
          category_slug: item?.slug,
          categoryExist: item?.id || null,
        },
      });
      return;
    }
    if (item?.redirect_to == staticStrings.VENDOR) {
      navigation.navigate(navigationStrings.VENDOR, {data: item});
      return;
    }

    if (item?.redirect_to == staticStrings.SUBCATEGORY) {
      navigation.push(navigationStrings.VENDOR_DETAIL, {data: {item: item}});
      return;
    }

    // navigation.navigate(navigationStrings.PRODUCT_LIST, {
    //   data: {
    //     id: item.id,
    //     rootProducts: vendorParams?.rootProducts,
    //     vendor: vendorParams?.rootProducts ? true : false,
    //     vendorData: vendorParams?.item,
    //     categoryInfo: item,
    //     name: item.name,
    //     isVendorList: false,
    //     category_slug: item?.slug,
    //     categoryExist: item?.id || null
    //   },
    // });
    moveToNewScreen(navigationStrings.PRODUCT_LIST, {
      id: item.id,
      rootProducts: vendorParams?.rootProducts,
      vendor: vendorParams?.rootProducts ? true : false,
      // rootProducts:
      vendorData: vendorParams?.item,
      categoryInfo: item,
      name: item.name,
      categoryExist: item?.id || null,
    });
  };
  const _renderItem = ({item, index}) => {
    return (
      <ThreeColumnCard
        onPress={() => onPressItem(item)}
        // onPress={() => navigation.navigate(navigationStrings.PRODUCT_LIST)}
        data={item}
        withTextBG
        cardIndex={index}
      />
    );
  };

  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }>
      {/* <Header centerTitle={vendorParams?.item?.name} hideRight={false} /> */}

      <Header
        leftIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={vendorParams?.item?.name || vendordName}
        rightIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icSearchb
            : imagePath.search
        }
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />

      <View style={{...commonStyles.headerTopLine}} />
      {isLoading ? (
        <View>
          <View style={{height: 10}} />
          <VendorDetailLoader listSize={5} isRow />
        </View>
      ) : (
        <FlatList
          data={vendorData}
          numColumns={3}
          ListHeaderComponent={<View style={{height: 10}} />}
          // columnWrapperStyle={{justifyContent: 'space-between'}}
          contentContainerStyle={{marginHorizontal: moderateScale(16)}}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          renderItem={_renderItem}
          ListEmptyComponent={
            !isLoading && (
              <View
                style={{
                  flex: 1,
                  marginTop: moderateScaleVertical(width / 2),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ListEmptyVendors
                  isLoading={isLoading}
                  emptyText={strings.NO_DATA_FOUND}
                />
              </View>
            )
          }
          keyExtractor={(item, index) => String(index)}
        />
      )}
    </WrapperContainer>
  );
}
