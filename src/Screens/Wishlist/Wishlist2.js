import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import WishlistCard from '../../Components/WishlistCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {height, moderateScaleVertical} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {showError} from '../../utils/helperFunctions';
import ListEmptyProduct from './ListEmptyProduct';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function Wishlist2({navigation,route}) {
  const {
    appData,
    appStyle,
    currencies,
    languages,
    themeColors,
    themeColor,
    themeToggle,
  } = useSelector((state) => state?.initBoot);
  const {userData} = useSelector((state) => state?.auth);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const [isShimmerLoading, setIsShimmerLoading] = useState(true);
  const [state, setState] = useState({
    isLoading: false,
    isRefreshing: false,
    wishlistArray: [],
    limit: 10,
    pageNo: 1,
    isHitApi: true,
  });
  const {isLoading, limit, pageNo, isRefreshing, wishlistArray, isHitApi} =
    state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  useEffect(() => {
    if (isHitApi) {
      getAllWishlistItems();
    }
  }, [pageNo, isRefreshing]);

  /*  GET ALL WISHLISTED ITEMS API FUNCTION  */
  const getAllWishlistItems = () => {
    actions
      .getWishlistProducts(
        `?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'wishlist api response...');
        let newArray =
          pageNo == 1 ? res.data.data : [...wishlistArray, ...res.data.data];
        setIsShimmerLoading(false);
        updateState({
          isLoading: false,
          isRefreshing: false,
          isHitApi: res.data.data.length == 0 ? false : true,
          wishlistArray:
            newArray && newArray.length
              ? newArray.map((i, inx) => {
                  i.product.inwishlist = {product_id: i.product_id};
                  return i;
                })
              : [],
        });
      })
      .catch(errorMethod);
  };

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const errorMethod = (error) => {
    setIsShimmerLoading(false);
    updateState({
      isLoading: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };
  //Add product to cart
  const _addToCart = (item) => {
    moveToNewScreen(navigationStrings.PRODUCTDETAIL, item.product)();
  };
  const renderProduct = ({item, index}) => {
    return (
      <WishlistCard
        data={item.product}
        onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item.product)}
      />
    );
  };

  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true, isLoading: false});
  };

  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageNo: pageNo + 1});
  };

  const onPressGoBack = () => {
    if (!!route?.params && route?.params?.isComeFromDrawer) {
      navigation.openDrawer()
    } else {
      navigation.goBack()
    }
  }

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}>
      {/* <Text>Helo</Text> */}
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={strings.WISHLIST}
        rightIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icSearchb
            : imagePath.search
        }
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
        onPressLeft={onPressGoBack}
      />
      <View style={{...commonStyles.headerTopLine}} />
      <View
        style={{
          flex: 1,
          paddingBottom: moderateScaleVertical(70),
        }}>
        <FlatList
          data={wishlistArray}
          renderItem={renderProduct}
          keyExtractor={(item, index) => String(index)}
          ListHeaderComponent={
            <View style={{height: !wishlistArray.length > 0 ? 20 : 0}} />
          }
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          refreshing={isRefreshing}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          initialNumToRender={6}
          ListFooterComponent={() => <View style={{height: 20}} />}
          ListEmptyComponent={() => (
            <ListEmptyProduct
              isLoading={isShimmerLoading}
              containerStyle={{
                marginTop: height / 4,
              }}
            />
          )}
        />
      </View>
    </WrapperContainer>
  );
}
