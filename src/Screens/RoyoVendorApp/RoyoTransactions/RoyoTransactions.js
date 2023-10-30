import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import MultiScreen from '../../../Components/MultiScreen';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import {FlatList} from 'react-native';
import Header from '../../../Components/Header';
import {showMessage} from 'react-native-flash-message';
import {showError} from '../../../utils/helperFunctions';
import actions from '../../../redux/actions';
import {useSelector} from 'react-redux';
import navigationStrings from '../../../navigation/navigationStrings';
import {isEmpty} from 'lodash';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import strings from '../../../constants/lang';
import {tokenConverterPlusCurrencyNumberFormater} from '../../../utils/commonFunction';

const RoyoTransactions = (props) => {
  const {navigation} = props;

  const [state, setState] = useState({
    selectedVendor: null,
    vendor_list: [],
    isLoading: false,
    isRefreshing: false,
    activeIndex: 0,
    totalAmtRecieved: 0,
    completedOrdersArr: [],
    pendingOrdersArr: [],
    refunddOrdersArr: [],
  });

  const {
    selectedVendor,
    vendor_list,
    isLoading,
    isRefreshing,
    activeIndex,
    completedOrdersArr,
    refunddOrdersArr,
    pendingOrdersArr,
    totalAmtRecieved,
  } = state;
  const {appData, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const {storeSelectedVendor} = useSelector((state) => state?.order);
  useEffect(() => {
    updateState({
      // selectedTab: null,
      selectedVendor: storeSelectedVendor,
      // isLoading: true,
    });
    _getVendorTransactions(0);
  }, [storeSelectedVendor]);

  useEffect(() => {
    _getListOfVendor();
    _getVendorTransactions(0);
  }, []);

  const _reDirectToVendorList = () => {
    navigation.navigate(navigationStrings.VENDORLIST, {
      selectedVendor: selectedVendor,
      allVendors: vendor_list,
      screenType: navigationStrings.ROYO_VENDOR_TRANSACTIONS,
    });
  };
  const _getListOfVendor = () => {
    let vendordId = !!storeSelectedVendor?.id
      ? storeSelectedVendor?.id
      : selectedVendor?.id
      ? selectedVendor?.id
      : '';
    actions
      ._getListOfVendorOrders(
        `?limit=${1}&page=${1}&selected_vendor_id=${vendordId}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('vendor orders res', res);
        updateState({
          vendor_list: res.data.vendor_list,
          selectedVendor: !!storeSelectedVendor?.id
            ? storeSelectedVendor
            : res.data.vendor_list.find((x) => x.is_selected),
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  const _getVendorTransactions = (index) => {
    updateState({isLoading: true});
    let vendordId = !isEmpty(storeSelectedVendor)
      ? storeSelectedVendor?.id
      : !isEmpty(selectedVendor)
      ? selectedVendor?.id
      : '';
    console.log('vendor transactions active index', index);
    console.log('check vendor id in transactions >>', vendordId);
    if (!vendordId) {
      return false;
    }
    const data = {};

    data['vendor_id'] = vendordId;

    /** Type : complete, pending, refund */
    data['type'] = index == 2 ? 'refund' : index == 1 ? 'pending' : 'complete';
    console.log('check vendor params in transactions >>', data);
    actions
      .getVendorTransactions(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log('vendor transactions result >> ', res);
        console.log('vendor transactions active index', index);
        updateState({
          isLoading: false,
          isRefreshing: false,
          completedOrdersArr:
            index == 0 && res?.data && res?.data?.orders
              ? res?.data?.orders
              : completedOrdersArr,
          refunddOrdersArr:
            index == 2 && res?.data && res?.data?.orders
              ? res?.data?.orders
              : refunddOrdersArr,
          pendingOrdersArr:
            index == 1 && res?.data && res?.data?.orders
              ? res?.data?.orders
              : pendingOrdersArr,
          totalAmtRecieved:
            res?.data && res?.data?.totalEarning
              ? Number(res?.data?.totalEarning).toFixed(2)
              : 0,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  const data = [
    imagePath.cabImage,
    imagePath.contactIllustration,
    imagePath.listViewIcon,
    // imagePath.icoTimeOrder,
  ];

  const selectedOrder = (index) => {
    updateState({activeIndex: index});
    _getVendorTransactions(index);
  };

  const transactions = (data, item) => {
    console.log('datadata', data);
    return (
      <View style={styles.transactionContainer}>
        <View
          style={{
            minWidth: moderateScale(30 + item.product_details?.length * 11),
            ...styles.transactionBody,
          }}>
          {item.product_details?.map((val, index) => (
            <Image
              key={index}
              source={{
                uri: `${val.image_path.proxy_url}50/50${val.image_path.image_path}`,
              }}
              style={{
                ...styles.transactionImage,
                zIndex: -index,
                marginLeft: moderateScale(11 * index),
              }}
            />
          ))}
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.font14Medium}>
            {strings.ORDER} #{item.order_number}
          </Text>
          <Text style={styles.font12Regular}>{item.date_time}</Text>
        </View>
        <Text
          style={[
            styles.font16Semibold,
            {color: activeIndex == 2 ? colors.redColor : colors.themeColor2},
          ]}>
          {activeIndex == 0 ? '+' : activeIndex == 1 ? '' : '-'}
          {tokenConverterPlusCurrencyNumberFormater(
            Number(item.payable_amount),
            digit_after_decimal,
            additional_preferences,
            currencies?.primary_currency?.symbol,
          )}
        </Text>
      </View>
    );
  };
  return (
    <WrapperContainer
      bgColor="white"
      statusBarColor="white"
      barStyle="dark-content"
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        headerStyle={{marginVertical: moderateScaleVertical(16)}}
        leftIcon={imagePath.backRoyo}
        centerTitle={strings.TRANSACTIONS + ' | ' + selectedVendor?.name || ''}
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        showImageAlongwithTitle
        imageAlongwithTitle={imagePath.dropdownTriangle}
      />
      <View style={styles.headerBox}>
        <Text style={styles.font28Semibold}>
          {tokenConverterPlusCurrencyNumberFormater(
            Number(totalAmtRecieved),
            digit_after_decimal,
            additional_preferences,
            currencies?.primary_currency?.symbol,
          )}
        </Text>
        <Text style={styles.font14Semibold}>{strings.AMOUNT_RECIEVED}</Text>
      </View>

      <View style={styles.transactionTimeBox}>
        <Text style={styles.font14Regular}>{strings.TRANSACTION_TIME} :</Text>
        <Text style={styles.font14Regular}>{strings.LIFETIME}</Text>
        {/* <Image
          style={{alignItems: 'center', tintColor: colors.blackOpacity66}}
          source={imagePath.dropdownTriangle}
        /> */}
      </View>
      <View style={styles.container}>
        <MultiScreen
          tabTextStyle={{
            marginTop: moderateScaleVertical(0),
          }}
          screenName={[
            strings.COMPLETED,
            strings.PENDING,
            strings.REFUNDS,
            '',
            '',
          ]}
          selectedScreen={(index) => selectedOrder(index)}
          selectedScreenIndex={activeIndex}
        />

        {activeIndex == 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            data={completedOrdersArr}
            renderItem={({item, index}) => transactions(data, item)}
            keyExtractor={(item, key) => key}
          />
        ) : null}
        {activeIndex == 1 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            data={pendingOrdersArr}
            renderItem={({item, index}) => transactions(data, item)}
            keyExtractor={(item, key) => key}
          />
        ) : null}
        {activeIndex == 2 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            data={refunddOrdersArr}
            renderItem={({item, index}) => transactions(data, item)}
            keyExtractor={(item, key) => key}
          />
        ) : null}
      </View>
    </WrapperContainer>
  );
};

export default RoyoTransactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: moderateScaleVertical(16),
    marginTop: moderateScaleVertical(16),
    paddingBottom: moderateScaleVertical(10),
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateScaleVertical(10),
  },
  transactionBody: {
    paddingTop: moderateScaleVertical(24),
    justifyContent: 'center',
  },
  transactionImage: {
    backgroundColor: colors.white,
    position: 'absolute',
    width: moderateScale(27),
    height: moderateScale(27),
    borderRadius: moderateScale(27),
  },
  transactionTimeBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: moderateScaleVertical(13),
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
  },
  headerBox: {
    marginTop: moderateScaleVertical(10),
    alignItems: 'center',
    paddingVertical: moderateScaleVertical(30),
    backgroundColor: '#25C7A7',
  },
  font14Medium: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: colors.black,
    marginVertical: moderateScaleVertical(3),
  },
  font14Regular: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.blackOpacity66,
  },
  font12Regular: {
    fontFamily: fontFamily.regular,
    fontSize: textScale(12),
    color: colors.blackOpacity66,
  },
  font16Semibold: {
    color: colors.themeColor2,
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
  },
  font28Semibold: {
    fontFamily: fontFamily.semiBold,
    marginBottom: moderateScaleVertical(8),
    fontSize: textScale(28),
    lineHeight: textScale(35),
    color: colors.white,
  },
  font14Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.white,
  },
});
