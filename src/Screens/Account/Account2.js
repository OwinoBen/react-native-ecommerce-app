import {BluetoothManager} from '@brooons/react-native-bluetooth-escpos-printer';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  I18nManager,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import ListItemHorizontal from '../../Components/ListItemHorizontalWithImage';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {appIds} from '../../utils/constants/DynamicAppKeys';
import {getImageUrl, showError} from '../../utils/helperFunctions';
import stylesFun from './styles';

export default function Account2({navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: false,
  });
  const {
    shortCodeStatus,
    themeColors,
    appStyle,
    appData,
    currencies,
    languages,
  } = useSelector((state) => state?.initBoot);
  const businessType = appStyle?.homePageLayout;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});

  const [allVendors, setAllVendors] = useState([]);

  //Navigation to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const userData = useSelector((state) => state.auth.userData);
  const appMainData = useSelector((state) => state?.home?.appMainData);

  useFocusEffect(
    React.useCallback(() => {
      _scrollRef.current.scrollTo(0);
    }, []),
  );

  //Share your app
  const onShare = () => {
    console.log('onShare', appData);
    if (!!appData?.domain_link) {
      let hyperLink = appData?.domain_link + '/share';
      let options = {url: hyperLink};
      Share.open(options)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
      return;
    }
    alert('link not found');
  };
  //Logout function
  const userlogout = () => {
    if (!!userData?.auth_token) {
      Alert.alert('', strings.LOGOUT_SURE_MSG, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {
          text: strings.CONFIRM,
          onPress: () => {
            actions.userLogout();
            actions.cartItemQty('');
          },
        },
      ]);
    }
    actions.setAppSessionData('on_login');
  };
  const _scrollRef = useRef();

  const onDeleteAccount = () => {
    if (!!userData?.auth_token) {
      Alert.alert('', strings.ARE_YOU_SURE_YOU_WANT_TO_DELETE, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {
          text: strings.CONFIRM,
          onPress: deleleUserAccount,
        },
      ]);
    } else {
      actions.setAppSessionData('on_login');
    }
  };
  const deleleUserAccount = async () => {
    try {
      const res = await actions.deleteAccount(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      );
      console.log('delete user account res', res);
      actions.userLogout();
      actions.cartItemQty('');
      actions.saveAddress('');
      actions.addSearchResults('clear');
    } catch (error) {
      console.log('erro raised', error);
      showError(error?.message);
    }
  };

  const goToChatRoom = (type) => {
    if (!!appMainData?.is_admin && type == 'vendor_chat') {
      navigation.navigate(navigationStrings.CHAT_ROOM, {
        type: type,
        allVendors: allVendors,
      });
    } else {
      navigation.navigate(navigationStrings.CHAT_ROOM, {type: type});
    }
  };

  const goToChatRoomForVendor = useCallback(() => {
    navigation.navigate(navigationStrings.CHAT_ROOM_FOR_VENDOR, {
      type: 'vendor_chat',
    });
  }, []);

  useEffect(() => {
    if (!!appMainData?.is_admin) {
      fetchAllVendors();
    }
  }, [appMainData?.is_admin]);

  const fetchAllVendors = async (value = null) => {
    let query = `?limit=${100000}&page=${1}`;
    let headers = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    };
    try {
      const res = await actions.storeVendors(query, headers);
      if (res?.data?.data) {
        setAllVendors(res.data.data);
        return;
      }
      console.log('available vendors res', res);
    } catch (error) {
      console.log('error riased', error);
      showError(error?.message);
    }
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}>
          {shortCodeStatus == '245bae' ? (
        <Header
          noLeftIcon={false}
          customLeft={() => (
            <Text
              onPress={() => actions.setAppSessionData('on_login')}
              style={{
                color: themeColors.primary_color,
                fontFamily: fontFamily.bold,
              }}>
              {strings.EDITCODE}
            </Text>
          )}
          // rightIcon={imagePath.cartShop}
          centerTitle={strings.MY_ACCOUNT}
        />
      ) : (
        <Header centerTitle={strings.MY_ACCOUNT} noLeftIcon={true} />
      )}

      <View style={{...commonStyles.headerTopLine}} />

      <ScrollView style={{flex: 1}} ref={_scrollRef}>
        {!!userData?.auth_token && (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={moveToNewScreen(navigationStrings.MY_PROFILE)}
              style={{
                marginHorizontal: moderateScale(23),
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: moderateScaleVertical(45),
              }}>
              <FastImage
                source={
                  userData?.source?.image_path
                    ? {
                        uri: getImageUrl(
                          userData?.source?.proxy_url,
                          userData?.source?.image_path,
                          '200/200',
                        ),
                      }
                    : userData?.source
                }
                style={{
                  height: moderateScale(60),
                  width: moderateScale(60),
                  borderRadius: moderateScale(60),
                }}
              />
              <View
                style={{
                  flexDirection: 'column',
                  marginHorizontal: moderateScale(25),
                }}>
                <Text
                  style={{
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyJ,
                    fontFamily: fontFamily.bold,
                    fontSize: textScale(16),
                  }}>
                  {userData?.name}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(14),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyJ,
                    marginTop: moderateScaleVertical(5),
                  }}>
                  {userData?.email}
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                marginTop: moderateScale(40),
              }}></View>
          </>
          // <ListItemHorizontal
          //   centerContainerStyle={{flexDirection: 'row'}}
          //   leftIconStyle={{flex: 0.1, alignItems: 'center'}}
          //   onPress={moveToNewScreen(navigationStrings.MY_PROFILE)}
          //   iconLeft={imagePath.icProfile}
          //   centerHeading={strings.MY_PROFILE}
          //   containerStyle={styles.containerStyle}
          //   iconRight={imagePath.goRight}
          //   rightIconStyle={{tintColor: colors.textGreyLight}}
          //   centerHeadingStyle={{fontSize: textScale(15)}}
          // />
        )}
        {/* {!!userData?.auth_token && (
          <TouchableOpacity style={{flex: 0.1}}>
            <Image
              source={imagePath.myOrder}
              style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
            />
          </TouchableOpacity>
        )} */}
        {DeviceInfo.getBundleId() != appIds.dlvrd &&
          !!userData?.auth_token &&
          (businessType == 4 ? null : (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={moveToNewScreen(navigationStrings.MY_ORDERS, {
                isBack: true,
              })}
              iconLeft={imagePath.myOrder}
              centerHeading={strings.MY_ORDERS}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{fontSize: textScale(15)}}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          ))}

        {!!userData?.auth_token &&
          !!appData &&
          !!appData?.profile &&
          appData?.profile?.preferences?.subscription_mode == 1 && (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={moveToNewScreen(navigationStrings.SUBSCRIPTION)}
              iconLeft={imagePath.myOrder}
              centerHeading={strings.SUBSCRIPTION}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{fontSize: textScale(15)}}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )}

        {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.LOYALTY)}
            iconLeft={imagePath.myOrder}
            centerHeading={strings.LOYALTYPOINTS}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}

        {/* {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.NOTIFICATION)}
            iconLeft={imagePath.notifcation}
            centerHeading={strings.NOTIFICATION}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )} */}
        {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.WALLET)}
            iconLeft={imagePath.wallet}
            centerHeading={strings.WALLET}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}
        {!!userData?.auth_token &&
          (businessType == 4 ? null : (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={moveToNewScreen(navigationStrings.WISHLIST)}
              iconLeft={imagePath.fav}
              centerHeading={strings.WISHLIST}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{fontSize: textScale(15)}}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          ))}

        <ListItemHorizontal
          centerContainerStyle={{flexDirection: 'row'}}
          leftIconStyle={{flex: 0.1, alignItems: 'center'}}
          onPress={moveToNewScreen(navigationStrings.CMSLINKS)}
          iconLeft={imagePath.about}
          centerHeading={strings.LINKS}
          containerStyle={styles.containerStyle2}
          centerHeadingStyle={{fontSize: textScale(15)}}
          // iconRight={imagePath.goRight}
          // rightIconStyle={{tintColor: colors.textGreyLight}}
        />
        {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={onShare}
            iconLeft={imagePath.share}
            centerHeading={strings.SHARE_APP}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}

        <ListItemHorizontal
          centerContainerStyle={{flexDirection: 'row'}}
          leftIconStyle={{flex: 0.1, alignItems: 'center'}}
          onPress={moveToNewScreen(navigationStrings.SETTIGS)}
          iconLeft={imagePath.settings}
          centerHeading={strings.SETTINGS}
          containerStyle={styles.containerStyle2}
          centerHeadingStyle={{fontSize: textScale(15)}}
          // iconRight={imagePath.goRight}
          // rightIconStyle={{tintColor: colors.textGreyLight}}
        />
        {/* {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            iconLeft={imagePath.payment}
            centerHeading={strings.PAYMENTS}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )} */}
        <ListItemHorizontal
          centerContainerStyle={{flexDirection: 'row'}}
          leftIconStyle={{flex: 0.1, alignItems: 'center'}}
          onPress={moveToNewScreen(navigationStrings.CONTACT_US)}
          iconLeft={imagePath.message}
          centerHeading={strings.CONTACT_US}
          containerStyle={styles.containerStyle2}
          centerHeadingStyle={{fontSize: textScale(15)}}
          // iconRight={imagePath.goRight}
          // rightIconStyle={{tintColor: colors.textGreyLight}}
        />

        {!!userData?.auth_token &&
          Platform.OS === 'android' &&
          (businessType == 'taxi' ? null : (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={() => {
                BluetoothManager.checkBluetoothEnabled().then(
                  (enabled) => {
                    if (Boolean(enabled)) {
                      navigation.navigate(navigationStrings.ATTACH_PRINTER);
                    } else {
                      BluetoothManager.enableBluetooth()
                        .then(() => {
                          navigation.navigate(navigationStrings.ATTACH_PRINTER);
                        })
                        .catch((err) => {});
                    }
                  },
                  (err) => {
                    err;
                  },
                );
              }}
              iconLeft={imagePath.printer}
              centerHeading={strings.ATTACH_PRINTER}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          ))}

        {!!userData?.auth_token &&
          !!appMainData?.is_admin &&
          businessType != 4 && (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={moveToNewScreen(navigationStrings.TABROUTESVENDOR)}
              iconLeft={imagePath.myStoreIcon}
              centerHeading={strings.MYSTORES}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{fontSize: textScale(15)}}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )}

        {!!userData?.auth_token &&
          !!appMainData?.is_admin &&
          businessType != 4 &&
          !!appData?.profile?.socket_url && (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={goToChatRoomForVendor}
              iconLeft={imagePath.icStoreChat}
              centerHeading={strings.STORES_CAHT}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )}

        {!!userData?.auth_token && !!appData?.profile?.socket_url && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={() => goToChatRoom('agent_chat')}
            iconLeft={imagePath.icDriverChat}
            centerHeading={strings.DRIVER_CHAT}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            }}
          />
        )}

        {!!userData?.auth_token &&
          !!appMainData?.is_admin &&
          !!appData?.profile?.socket_url && (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={() => goToChatRoom('vendor_chat')}
              iconLeft={imagePath.icUserChat}
              centerHeading={strings.USER_CHAT}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
            />
          )}

        {!!userData?.auth_token && !!appData?.profile?.socket_url && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={() => goToChatRoom('user_chat')}
            iconLeft={imagePath.icVendorChat}
            centerHeading={strings.VENDOR_CHAT}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            }}
          />
        )}

        {!!userData?.auth_token ? null : (
          <View style={styles.loginView}>
            <TouchableOpacity
              // onPress={()=>actions.isVendorNotification(true)}
              onPress={() => actions.setAppSessionData('on_login')}
              style={styles.touchAbleLoginVIew}>
              <Text style={styles.loginLogoutText}>{strings.LOGIN}</Text>
              <Image
                source={imagePath.rightBlue}
                style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={{height: 100}} />
      </ScrollView>
    </WrapperContainer>
  );
}
