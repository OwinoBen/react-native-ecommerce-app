import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../../Components/Header';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import {resetStackAndNavigate} from '../../../navigation/NavigationService';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import {showError} from '../../../utils/helperFunctions';

const RoyoAccounts = (props) => {
  const {navigation} = props;

  const [state, setState] = useState({
    selectedVendor: null,
    vendor_list: [],
    isLoading: false,
    isRefreshing: false,
    vendorDetail: {},
  });

  const {selectedVendor, vendor_list, isLoading, isRefreshing, vendorDetail} =
    state;
  const {appData, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state.auth.userData);
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const {storeSelectedVendor} = useSelector((state) => state?.order);
  useEffect(() => {
    updateState({
      selectedVendor: storeSelectedVendor,
    });
  }, [storeSelectedVendor]);

  useEffect(() => {
    _getListOfVendor();
    // _getVendorProfile(selectedVendor);
  }, []);

  useEffect(() => {
    console.log('check selectedVendor', selectedVendor);
    updateState({isLoading: true});
    _getVendorProfile(selectedVendor);
  }, [selectedVendor]);

  const _getVendorProfile = () => {
    let vendordId = !!storeSelectedVendor?.id
      ? storeSelectedVendor?.id
      : selectedVendor?.id
      ? selectedVendor?.id
      : '';
    console.log('res__getRevnueData>>>profile>>account', vendordId);
    let data = {};
    data['vendor_id'] = vendordId;
    if (!data.vendor_id) {
      return false;
    }
    console.log('res__getRevnueData>>>profile>>account', vendordId);
    actions
      .getVendorProfile(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'res__getRevnueData>>>profile>>account');

        updateState({
          isRefreshing: false,
          isLoading: false,
          vendorDetail: res?.data,
        });
      })
      .catch(errorMethod);
  };

  const _reDirectToVendorList = () => {
    navigation.navigate(navigationStrings.VENDORLIST, {
      selectedVendor: selectedVendor,
      allVendors: vendor_list,
      screenType: navigationStrings.ROYO_VENDOR_ACCOUNT,
    });
  };

  const userlogout = () => {
    if (!!userData?.auth_token) {
      Alert.alert('', strings.LOGOUT_SURE_MSG, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          style: 'destructive',
        },
        {
          text: strings.CONFIRM,
          onPress: async () => {
            actions.userLogout();
            actions.cartItemQty('');
            resetStackAndNavigate(navigation, navigationStrings.LOGIN);
          },
        },
      ]);
    } else {
      resetStackAndNavigate(navigation, navigationStrings.LOGIN);
    }
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
  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };
  const data = [
    {
      text: strings.TRANSACTIONS,
      image: imagePath.transactionsRoyo,
      onPress: () =>
        navigation.navigate(navigationStrings.ROYO_VENDOR_TRANSACTIONS),
    },
    // {
    //   text: 'Payment Settings',
    //   image: imagePath.paymentSettinRoyo,
    //   onPress: () =>
    //     navigation.navigate(navigationStrings.ROYO_VENDOR_PAYMENT_SETTINGS),
    // },
    {
      text: strings.SIGN_OUT,
      image: imagePath.signoutRoyo,
      onPress: userlogout,
    },
  ];

  return (
    <WrapperContainer
      bgColor="white"
      isLoadingB={isLoading}
      source={loaderOne}
      statusBarColor="white"
      barStyle="dark-content">
      <Header
        headerStyle={{marginVertical: moderateScaleVertical(16)}}
        // centerTitle="Accounts | Foodies hub  "
        centerTitle={`${strings.ACCOUNTS} | ${selectedVendor?.name} `}
        noLeftIcon
        imageAlongwithTitle={imagePath.dropdownTriangle}
        showImageAlongwithTitle
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          {vendorDetail?.logo?.proxy_url ? (
            <Image
              source={{
                uri: `${vendorDetail?.logo?.proxy_url}100/100${vendorDetail?.logo?.image_path}`,
              }}
              style={{
                width: moderateScale(50),
                height: moderateScale(50),
                marginRight: moderateScale(10),
              }}
            />
          ) : (
            <View style={styles.cameraBox}>
              <Image source={imagePath.cameraRoyo} />
              <Text style={styles.addLogo}>{strings.ADD_LOGO}</Text>
            </View>
          )}
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={styles.font16Semibold}>{selectedVendor?.name}</Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: fontFamily.regular,
                color: colors.blackOpacity66,
              }}>
              {vendorDetail?.address}
            </Text>
          </View>
          {/* <Image style={{alignSelf: 'center'}} source={imagePath.edit1Royo} /> */}
        </View>
        <View style={{marginTop: moderateScaleVertical(16)}}>
          {data.map((val, index) => {
            return (
              <TouchableOpacity
                onPress={val.onPress}
                key={index}
                style={{
                  flexDirection: 'row',
                  marginVertical: moderateScaleVertical(15),
                  alignItems: 'center',
                }}>
                <Image source={val.image} />
                <Text style={styles.font15Semibold}>{val.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </WrapperContainer>
  );
};

export default RoyoAccounts;

const styles = StyleSheet.create({
  container: {
    marginBottom: moderateScaleVertical(24),
    marginHorizontal: moderateScale(16),
  },
  header: {
    flexDirection: 'row',
    padding: moderateScale(12),
    backgroundColor: '#24C3A323',
    borderRadius: moderateScale(5),
    // marginTop: moderateScaleVertical(16),
  },
  cameraBox: {
    marginRight: moderateScale(8),
    backgroundColor: colors.white,
    padding: moderateScale(12),
    alignItems: 'center',
    borderRadius: moderateScale(5),
  },
  addLogo: {
    fontFamily: fontFamily.regular,
    fontSize: textScale(10),
    color: colors.blackOpacity43,
  },
  font16Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    marginBottom: moderateScaleVertical(8),
    color: colors.black,
  },
  font15Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: textScale(15),
    color: colors.blackOpacity66,
    marginLeft: moderateScale(16),
  },
});
