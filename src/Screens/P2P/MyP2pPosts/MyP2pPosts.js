import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import WrapperContainer from '../../../Components/WrapperContainer';
import Header from '../../../Components/Header';
import imagePath from '../../../constants/imagePath';
import actions from '../../../redux/actions';
import { useSelector } from 'react-redux';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import navigationStrings from '../../../navigation/navigationStrings';
import { debounce, isEmpty } from 'lodash';
import FastImage from 'react-native-fast-image';
import { getImageUrl, showError } from '../../../utils/helperFunctions';
import HTMLView from 'react-native-htmlview';
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import fontFamily from '../../../styles/fontFamily';
import colors from '../../../styles/colors';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../../styles/theme';

export default function MyP2pPosts({ route, navigation }) {
  const { appData, themeColors, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};
  const { userData } = useSelector((state) => state?.auth);
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [allPosts, setAllPosts] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isLoadMore, setLoadMore] = useState(true);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = (pageNo = 1, limit = 10) => {
    let query = `/${userData?.vendor_id}?limit=${limit}&page=${pageNo}type=all`;

    actions
      .allVendorData(query, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, '<===response allVendorData');
        setAllPosts(res?.data?.data || []);
        setLoading(false);
        setRefreshing(false);
        if (res?.data?.current_page < res?.data?.last_page) {
          setLoadMore(false);
        }
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, '<===error allVendorData');
    setLoading(false);
    setRefreshing(false);
    showError(error?.error || error?.message);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getAllPosts(1);
  };

  const onEndReached = () => {
    if (isLoadMore) {
      setPageNo(pageNo + 1);
      getAllPosts(pageNo + 1);
    }
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });



  const renderAllPostsItem = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.itemBox}
          onPress={() => {
            navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, {
              product_id: item?.id,
            });
          }}>
          <FastImage
            style={styles.imageStyle}
            source={
              !isEmpty(item?.media)
                ? {
                  uri: getImageUrl(
                    item?.media[0].image?.path?.image_fit,
                    item?.media[0].image?.path?.image_path,
                    '500/500',
                  ),
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }
                : imagePath.icDefaultImg
            }
          />

          <View style={{ flex: 1 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {/* <View style={{flex: 1, }}> */}
              <Text
                numberOfLines={1}
                style={[styles.font16medium, { textTransform: 'capitalize' }]}>
                {item.translation[0]?.title}
              </Text>

              {/* <Image style={{alignSelf: 'flex-end'}} source={imagePath.share} /> */}
            </View>
            {item?.category_name?.name ? (
              <Text style={styles.font13Regular}>
                in {item.category_name.name}
              </Text>
            ) : null}

            <View style={{ marginTop: 10 }}>
              <HTMLView
                value={
                  item?.translation[0]?.body_html
                    ? item?.translation[0]?.body_html
                    : ''
                }
              />
              <View />
            </View>
            <Text
              style={{
                fontFamily: fontFamily.bold,
                fontSize: 14,
                color: colors.black,
                marginTop: moderateScaleVertical(4),
              }}>
              {tokenConverterPlusCurrencyNumberFormater(
                Number(item?.variant[0]?.price || 0),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [allPosts],
  );

  return (
    <WrapperContainer isLoading={isLoading} bgColor={
      isDarkMode ? MyDarkTheme.colors.background : colors.white
    } >
      <Header centerTitle={'My Posts'} leftIcon={imagePath.backArrow} headerStyle={
        isDarkMode
          ? { backgroundColor: MyDarkTheme.colors.background }
          : { backgroundColor: colors.white }
      } />
      <View
        style={{
          flex: 1,
          paddingHorizontal: moderateScale(15),
        }}>
        <FlatList
          data={allPosts}
          renderItem={renderAllPostsItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
            />
          }
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: moderateScale(600),
                }}>
                {!isLoading && <Image source={imagePath.emptyCartRoyo} />}
              </View>
            );
          }}
          onEndReached={onEndReachedDelayed}
        />
      </View>
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({
  font16Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: '#4CB549',
    marginRight: moderateScale(10),
  },
  container: {
    flex: 1,
  },
  font16medium: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.black,
  },
  textStyle: {
    color: colors.black,
    fontSize: 24,
    fontFamily: fontFamily.bold,
  },
  imageStyle: {
    width: moderateScale(60),
    height: moderateScaleVertical(60),
    borderRadius: 6,
    marginRight: moderateScale(18),
  },
  rowReverse: {
    flexDirection: 'row-reverse',
    height: '100%',
  },
  itemBox: {
    padding: moderateScale(18),
    borderRadius: moderateScale(6),
    backgroundColor: colors.whiteSmokeColor,
    flexDirection: 'row',
    marginBottom: moderateScaleVertical(16),
  },
  font13Regular: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.blackOpacity40,
  },
  hiddenButton: {
    paddingHorizontal: moderateScale(14),
    marginBottom: moderateScale(16),
    borderRadius: moderateScaleVertical(8),
    justifyContent: 'center',
    marginLeft: moderateScale(8),
  },
  categoryItem: {
    alignSelf: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(16),
    marginBottom: moderateScaleVertical(8),
    borderRadius: moderateScaleVertical(6),
  },
  productBtn: {
    position: 'absolute',
    bottom: Platform.OS == 'ios' ? moderateScale(75) : moderateScale(5),
    borderRadius: moderateScale(100),
    paddingHorizontal: moderateScale(15),
    right: 10,
    backgroundColor: colors.white,
  },
  categoryBtn: {
    position: 'absolute',
    padding: moderateScale(10),
    bottom: moderateScaleVertical(20),
    right: moderateScale(10),
    borderRadius: moderateScale(100),
    paddingHorizontal: moderateScale(15),
  },
  emptyCartBody: {
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(600),
  },
  labelStyle: {
    fontFamily: fontFamily.bold,
    color: colors.blackOpacity43,
    fontSize: textScale(13),
    marginBottom: moderateScale(5),
  },
  addProductBtn: {
    color: colors.white,
    fontSize: textScale(14),
  },
  textInputStyle: {
    fontFamily: fontFamily.bold,
    color: colors.black,
    fontSize: textScale(13),
  },
  noDataFound: {
    width: '100%',
    height: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySelectDropDownView: {
    borderWidth: 1,
    borderColor: colors.blackOpacity20,
    borderRadius: 5,
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(5),
    maxHeight: moderateScale(100),
  },
  categoryItm: {
    marginBottom: moderateScale(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.textGreyB,
    paddingBottom: 8,
  },
});
