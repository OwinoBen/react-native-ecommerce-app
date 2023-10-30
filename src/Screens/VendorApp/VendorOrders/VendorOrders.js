import {cloneDeep, debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../../Components/Header';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import OrderCardComponent from '../../../Components/OrderCardComponent';
import OrderCardVendorComponent from '../../../Components/OrderCardVendorComponent';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang/index';
import staticStrings from '../../../constants/staticStrings';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import {showError} from '../../../utils/helperFunctions';
// import OrderCardComponent from './OrderCardComponent';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../../styles/theme';
import Modal from 'react-native-modal';
import BorderTextInput from '../../../Components/BorderTextInput';
import {StartPrinting} from '../../PrinterConnection/PrinteFunc';
import {getItem} from '../../../utils/utils';
import * as RNLocalize from 'react-native-localize';

export default function VendorOrders({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route.params;
  const {storeSelectedVendor} = useSelector((state) => state?.order);

  const [state, setState] = useState({
    tabBarData: [
      {title: strings.ACTIVE_ORDERS, isActive: true},
      {title: strings.PAST_ORDERS, isActive: false},
      {title: strings.SCHEDULED_ORDERS, isActive: false},
    ],
    selectedTab: strings.ACTIVE_ORDERS,
    activeOrders: [],
    pastOrders: [],
    scheduledOrders: [],
    pageActive: 1,
    pagePastOrder: 1,
    pageScheduleOrder: 1,
    limit: 10,
    isLoading: true,
    isLoadingB: false,
    isRefreshing: false,
    vendor_list: [],
    selectedVendor: null,
    isRejectModal: false,
    rejectReason: '',
    acceptRejectData: '',
    status: null,
    isBleDevice: false,
  });
  const {
    isLoadingB,
    selectedTab,
    isLoading,
    activeOrders,
    pageActive,
    limit,
    isRefreshing,
    vendor_list,
    selectedVendor,
    isRejectModal,
    rejectReason,
    acceptRejectData,
    status,
    isBleDevice,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const currentTheme = useSelector((state) => state.initBoot);
  const {appData, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );

  const {themeColors, themeLayouts} = currentTheme;
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});
  useEffect(() => {
    // updateState({isLoading: true});
    if (isLoading) {
      _getListOfVendorOrders();
      _getBleDevice();
    }
  }, [isLoading]);

  const _getBleDevice = async () => {
    const res = await getItem('BleDevice');
    if (!!res) {
      updateState({
        isBleDevice: true,
      });
      return;
    } else {
      updateState({
        isBleDevice: false,
      });
    }
  };

  useEffect(() => {
    updateState({
      selectedVendor: storeSelectedVendor,
      isLoading: true,
      pageActive: 1,
    });
  }, [storeSelectedVendor]);

  const _getListOfVendorOrders = () => {
    let vendordId = !!storeSelectedVendor?.id
      ? storeSelectedVendor?.id
      : selectedVendor?.id
      ? selectedVendor?.id
      : '';
    actions
      ._getListOfVendorOrders(
        `?limit=${limit}&page=${pageActive}&selected_vendor_id=${vendordId}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          timezone: RNLocalize.getTimeZone(),
          // systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log('vendor', res);
        updateState({
          activeOrders:
            pageActive == 1
              ? res.data.order_list.data
              : [...activeOrders, ...res.data.order_list.data],
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

  //error handling
  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isLoadingB: false,
      isLoadingC: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };

  const onPressViewEditAndReplace = (item) => {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: item?.id,
      fromVendorApp: true,
      showRating: false,
      selectedVendor: selectedVendor,
    });
  };

  const renderOrders = ({item, index}) => {
    return (
      <OrderCardVendorComponent
        data={item}
        // selectedTab={selectedTab}
        onPress={() => onPressViewEditAndReplace(item)}
        updateOrderStatus={(data, status) => updateOrderStatus(data, status)}
        isBleDevice={isBleDevice}
      />
    );
  };

  const updateOrderStatus = (acceptRejectData, status) => {
    updateState({
      isLoadingB: status !== 3 ? true : false,
      isRejectModal: status === 3 ? true : false,
      acceptRejectData: acceptRejectData,
      status: status,
    });
    if (status !== 3) {
      let data = {};
      data['order_id'] = acceptRejectData?.id;
      data['vendor_id'] = selectedVendor?.id;
      data['order_status_option_id'] = status;
      data['reject_reason'] = rejectReason;

      actions
        .updateOrderStatus(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          // systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          if (res && res.status == 'success') {
            if (status == 7) {
              StartPrinting({id: acceptRejectData?.id});
            }
            updateStatus(res, acceptRejectData);
          }
        })
        .catch(errorMethod);
    } else return;
  };

  const _updateOrderStatus = () => {
    let data = {};
    data['order_id'] = acceptRejectData?.id;
    data['vendor_id'] = selectedVendor?.id;
    data['order_status_option_id'] = status;
    data['reject_reason'] = rejectReason;

    actions
      .updateOrderStatus(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        if (res && res.status == 'success') {
          updateStatus(res, acceptRejectData);
        }
      })
      .catch(errorMethod);
  };

  const updateStatus = (res, acceptRejectData) => {
    let clonedArrayOrderList = cloneDeep(activeOrders);

    updateState({
      isRejectModal: false,
      isLoadingB: false,
      activeOrders: clonedArrayOrderList.map((i, inx) => {
        if (i?.id == acceptRejectData?.id) {
          i.order_status = res.order_status;
          return i;
        } else {
          return i;
        }
      }),
    });
  };
  useEffect(() => {
    _getListOfVendorOrders();
  }, [pageActive, isRefreshing]);

  //Refresh screen

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageActive: 1, isRefreshing: true});
  };

  //pagination of data
  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageActive: pageActive + 1});
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const _reDirectToVendorList = () => {
    navigation.navigate(navigationStrings.VENDORLIST, {
      selectedVendor: selectedVendor,
      allVendors: vendor_list,
      screenType: staticStrings.ORDERS,
    });
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading || isLoadingB}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={selectedVendor?.name || ''}
        showImageAlongwithTitle={true}
        // rightIcon={imagePath.cartShop}
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{...commonStyles.headerTopLine}} />

      <FlatList
        data={activeOrders}
        extraData={activeOrders}
        // data={[1, 2, 3, 4]}
        renderItem={renderOrders}
        keyExtractor={(item, index) => String(index)}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          marginVertical: moderateScaleVertical(20),
        }}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        onEndReached={onEndReachedDelayed}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={{height: 20}} />}
        ListFooterComponent={() => <View style={{height: 20}} />}
        // ListEmptyComponent={<ListEmptyProduct />}
      />

      <Modal isVisible={isRejectModal}>
        <View
          style={{
            height: height / 2.35,
            backgroundColor: colors.white,
            paddingVertical: moderateScaleVertical(15),
            borderRadius: moderateScale(5),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              borderBottomWidth: 1,
              borderColor: colors.lightGreyBg,
              paddingHorizontal: moderateScale(10),
            }}>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: textScale(12),
                opacity: 0.9,
              }}>
              {strings.REJECT_REASON}
            </Text>
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => updateState({isRejectModal: false})}>
              <Image
                source={imagePath.ic_cross}
                style={{
                  height: 25,
                  width: 25,
                  tintColor: colors.black,
                  opacity: 0.6,
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingHorizontal: moderateScale(10),
              paddingTop: moderateScaleVertical(15),
            }}>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: textScale(12),
                opacity: 0.9,
              }}>
              {strings.ENTER_REASON_FOR_REJECTING_ORDER}
            </Text>
            <BorderTextInput
              onChangeText={(value) => updateState({rejectReason: value})}
              // placeholder={strings.MESSSAGE_FOR_US}
              containerStyle={{
                height: moderateScaleVertical(190),
                padding: 5,
                marginVertical: moderateScaleVertical(15),
                borderColor: colors.black,
                borderWidth: 0.5,
                opacity: 0.7,
              }}
              // textInputStyle={{height:moderateScaleVertical(108)}}
              textAlignVertical={'top'}
              multiline={true}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={_updateOrderStatus}
            style={{
              paddingHorizontal: moderateScale(20),
              paddingVertical: moderateScaleVertical(10),
              backgroundColor: themeColors.primary_color,
              alignSelf: 'center',
              borderRadius: moderateScale(10),
            }}>
            <Text
              style={{
                color: colors.white,
                fontFamily: fontFamily.regular,
                fontSize: textScale(12),
              }}>
              {strings.SUBMIT}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </WrapperContainer>
  )
}
