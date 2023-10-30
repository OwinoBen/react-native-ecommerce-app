import React, {useEffect, useState} from 'react';
import {FlatList, Image, ScrollView, Text, View} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import EmptyListLoader from '../../Components/EmptyListLoader';
import Header2 from '../../Components/Header2';
import CardLoader from '../../Components/Loaders/CardLoader';
import CelebrityLoader from '../../Components/Loaders/CelebrityLoader';
import ProductLoader from '../../Components/Loaders/ProductLoader';
import ThreeColumnCard2 from '../../Components/ThreeColumnCard2';
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
  textScale,
  width,
} from '../../styles/responsiveSize';
import {getImageUrl, showError} from '../../utils/helperFunctions';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function VendorDetail2({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  let vendorParams = route?.params?.data;
  console.log(vendorParams, 'VendorDetail params');
  const userData = useSelector((state) => state?.auth?.userData);

  const [state, setState] = useState({
    vendorId: vendorParams?.item?.id,
    vendorData: [],
    isLoading: true,
    limit: 12,
    pageNo: 1,
  });
  const {vendorId, vendorData, isLoading, limit, pageNo} = state;
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
    // console.log(data, 'vendor_id');
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
        console.log();
        updateState({isLoading: false});
        if (res && res.data) {
          updateState({vendorData: res.data.listData});
        }
        console.log(res, 'Vendor data response');
      })
      .catch(errorMethod);
  };
  /*********** */

  /*********GET VENDOR DETAIL********* */
  const getVendorDetailData = () => {
    let data = {};
    data['vendor_id'] = vendorId;
    console.log(data, 'vendor_id');
    actions
      .getVendorDetail(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then((res) => {
        updateState({isLoading: false});
        if (res && res.data) {
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

  const _renderItem = ({item, index}) => {
    return (
      <ThreeColumnCard2
        onPress={
          item.name === 'Pick & Drop'
            ? userData?.auth_token
              ? moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, item)
              : actions.setAppSessionData('on_login')
            : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
                id: item.id,
                rootProducts: vendorParams?.rootProducts,
                // vendor: true,
                // rootProducts:
                name: item.name,
                categoryExist: item?.id || null,
              })
        }
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
      <Header2
        leftIcon={imagePath.backArrow}
        centerTitle={vendorParams?.item?.name}
        rightIcon={imagePath.search}
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />

      <View style={{...commonStyles.headerTopLine}} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {vendorParams?.item?.redirect_to !== staticStrings.SUBCATEGORY && (
          <View
            style={{
              marginHorizontal: moderateScale(20),
              marginVertical: moderateScaleVertical(15),
            }}>
            <FastImage
              source={{
                uri: getImageUrl(
                  vendorParams?.item?.image?.proxy_url ||
                    vendorParams?.item?.image?.proxy_url ||
                    vendorParams?.item?.banner?.proxy_url,
                  vendorParams?.item?.image?.image_path ||
                    vendorParams?.item?.image?.image_path ||
                    vendorParams?.item?.banner?.image_path,

                  `800/400`,
                ),
                priority: FastImage.priority.high,
              }}
              style={{
                width: moderateScale(95),
                height: moderateScaleVertical(95),
                borderRadius: moderateScale(16),
              }}
            />
            <Text
              style={[
                {
                  ...commonStyles.mediumFont14,
                  opacity: 1,
                  marginTop: moderateScaleVertical(20),
                  fontSize: textScale(18),
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                },
              ]}>
              {vendorParams?.item?.name}
            </Text>
            {vendorParams?.item?.desc && (
              <Text
                style={{
                  marginTop: moderateScaleVertical(13),
                  fontFamily: fontFamily.regular,
                  marginBottom: moderateScale(7),
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
                }}>
                {vendorParams?.item?.desc}
              </Text>
            )}

            <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={1}
              dashColor={colors.greyLight}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: moderateScaleVertical(15),
                marginRight: moderateScale(70),
              }}>
              <View style={{flexDirection: 'column'}}>
                {(!!appData?.profile?.preferences?.rating_check && vendorParams?.item?.product_avg_average_rating) && (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={imagePath.starWhite}
                      style={{
                        tintColor: isDarkMode ? colors.yellowB : colors.black,
                        height: 10,
                        width: 10,
                        marginRight: moderateScale(5),
                      }}
                    />

                    <Text
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackC,
                        fontSize: textScale(11),
                        fontFamily: fontFamily.medium,
                        marginHorizontal: moderateScale(5),
                      }}>
                      {Number(
                        vendorParams?.item?.product_avg_average_rating,
                      ).toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {isLoading ? (
          <View
            style={{
              marginTop: moderateScale(25),
              marginHorizontal: moderateScale(20),
            }}>
            <CelebrityLoader
              isLoading={isLoading}
              pRows={1}
              isRow
              cardWidth={(width - moderateScale(60)) / 3}
              marginHorizontal={moderateScale(0)}
            />
          </View>
        ) : (
          <View style={{marginHorizontal: moderateScale(7.5)}}>
            <FlatList
              data={vendorData || []}
              ListHeaderComponent={<View style={{height: 10}} />}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              numColumns={3}
              ItemSeparatorComponent={() => (
                <View style={{height: moderateScale(15)}}></View>
              )}
              renderItem={_renderItem}
              ListEmptyComponent={<EmptyListLoader />}
              keyExtractor={(item, index) => String(index)}
            />
          </View>
        )}
      </ScrollView>
    </WrapperContainer>
  );
}
