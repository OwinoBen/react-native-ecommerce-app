import { BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  I18nManager,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import SunmiV2Printer from 'react-native-sunmi-v2-printer';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
import ListItemHorizontal from '../../Components/ListItemHorizontalWithImage';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import ZendeskChat from '../../library/react-native-zendesk-chat';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import {
  getImageUrl,
  getRandomColor,
  showError,
} from '../../utils/helperFunctions';
import stylesFun from './styles';

import { bluetoothPermission } from '../../utils/permissions';
export default function Account3({ navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {
    themeColors,
    appStyle,
    appData,
    shortCodeStatus,
    currencies,
    languages,
  } = useSelector((state) => state?.initBoot);
  const businessType = appStyle?.homePageLayout;
  const { dineInType, appMainData } = useSelector((state) => state?.home);

  const [allVendors, setAllVendors] = useState([]);

  const [state, setState] = useState({
    isLoading: false,
  });

  const { preferences, phone_number, contact_phone_number } = appData?.profile;

  console.log("appDataappDataappData", appData, languages)

  const [isVisible, setIsVisible] = useState(false);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors });
  const commonStyles = commonStylesFun({ fontFamily });
  const [allAvailAblePaymentMethods, setAllAvailAblePaymentMethods] = useState([])
  //Navigation to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const userData = useSelector((state) => state.auth.userData);

  //Share your app

  useEffect(() => {
    if (!!appMainData?.is_admin) {
      fetchAllVendors();
    }
  }, [appMainData?.is_admin]);

  useEffect(() => {
    if (!!userData?.auth_token) { getListOfPaymentMethod() }
  }, [userData?.auth_token])
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

  console.log(userData, 'appDataappData');
  const getListOfPaymentMethod = () => {
    actions
      .getListOfPaymentMethod(
        '/wallet',
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('payment list options', res.data);
        // updateState({ isLoadingB: false, isRefreshing: false });
        if (res && res?.data) {
          setAllAvailAblePaymentMethods(res?.data)

        }
      })
      .catch((err) => console.log(err, 'errororroro'));
  };



  const onShare = () => {
    console.log('onShare', appData?.profile?.preferences);
    if (
      !!appData?.profile?.preferences?.android_app_link ||
      !!appData?.profile?.preferences?.ios_link
    ) {
      let hyperLink =
        Platform.OS === 'android'
          ? appData?.profile?.preferences?.android_app_link
          : appData?.profile?.preferences?.ios_link;

      let options = { url: hyperLink };
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

  // initalize Zendesk
  useEffect(() => {
    ZendeskChat.init(
      `${preferences?.customer_support_key}`,
      `${preferences?.customer_support_application_id}`,
    );

  }, [
    preferences?.customer_support_application_id,
    preferences?.customer_support_key,
  ]);



  const onStartSupportChat = () => {
    ZendeskChat.setVisitorInfo({
      name: userData?.name,
      phone: userData?.phone_number ? userData?.phone_number : '',

    });
    ZendeskChat.startChat({
      name: userData?.name,
      phone: userData?.phone_number ? userData?.phone_number : '',
      withChat: true,
      color: '#000',
      messagingOptions: { botName: `${DeviceInfo.getApplicationName()} Support` },

    });
  };



  const usernameFirstlater = !!userData?.name && userData?.name?.charAt(0);

  const goToChatRoom = (type) => {
    if (!!appMainData?.is_admin && type == 'vendor_chat') {
      navigation.navigate(navigationStrings.CHAT_ROOM, {
        type: type,
        allVendors: allVendors,
      });
    } else {
      navigation.navigate(navigationStrings.CHAT_ROOM, { type: type });
    }
  };

  const goToChatRoomForVendor = useCallback(() => {
    navigation.navigate(navigationStrings.CHAT_ROOM_FOR_VENDOR, {
      type: 'vendor_chat',
    });
  }, []);


  //----------------------------------ActionSheet------------------------------//
  let actionSheet = useRef();
  const showActionSheet = () => {
    actionSheet.current.show();
  };

  const onSosButton = (index) => {
    console.log(index, 'index');
    switch (index) {
      case 0:
        Linking.openURL(
          `tel:${appData?.profile?.preferences?.sos_police_contact}`,
        );

        break;
      case 1:
        Linking.openURL(
          `tel:${appData?.profile?.preferences?.sos_ambulance_contact}`,
        );
        break;

      default:
        break;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        {/* <StatusBar
        backgroundColor={
          isDarkMode
            ? MyDarkTheme.colors.background
            : getColorCodeWithOpactiyNumber(
                themeColors.primary_color.substr(1),
                20,
              )
        }
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      /> */}


        {shortCodeStatus == '245bae' ? (
          <Header
            noLeftIcon={false}
            customLeft={() => (
              <Text
                onPress={() => actions.setAppSessionData('show_shortcode')}
                style={{
                  color: themeColors.primary_color,
                  fontFamily: fontFamily.bold,
                }}>
                {strings.EDITCODE}
              </Text>
            )}
          // rightIcon={imagePath.cartShop}
          //   centerTitle={strings.MY_ACCOUNT}
          />
        ) : (
          <Header centerTitle={strings.MY_ACCOUNT} noLeftIcon={true} />
        )}

        {/* <View style={{...commonStyles.headerTopLine}} /> */}

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {!!userData?.auth_token && (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={moveToNewScreen(navigationStrings.MY_PROFILE)}
                style={{
                  marginHorizontal: moderateScale(24),
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: moderateScaleVertical(35),
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.white,
                  paddingVertical: moderateScaleVertical(12),
                  borderRadius: 12,
                  // flex: 1,
                }}>
                {userData?.source ? (
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
                      height: moderateScale(46),
                      width: moderateScale(46),
                      borderRadius: moderateScale(12),
                      marginHorizontal: moderateScale(15),
                      backgroundColor: colors.blackOpacity10,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      backgroundColor: getRandomColor(),
                      height: moderateScale(46),
                      width: moderateScale(46),
                      borderRadius: moderateScale(12),
                      marginHorizontal: moderateScale(15),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: textScale(20),
                        textTransform: 'uppercase',
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackB,
                      }}>
                      {usernameFirstlater}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyJ,
                      fontFamily: fontFamily.medium,
                      fontSize: textScale(14),
                      textAlign: 'left',
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
                      textAlign: 'left',
                    }}>
                    {userData?.email}
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  marginTop: moderateScale(30),
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

          {!!userData?.auth_token &&
            ((businessType == 4 || !!appData?.profile?.preferences?.is_rental_weekly_monthly_price) ? null : (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: 'row' }}
                leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
                onPress={moveToNewScreen(navigationStrings.MY_ORDERS, {
                  isBack: true,
                })}
                iconLeft={imagePath.myOrder2}
                centerHeading={(getBundleId() == appIds.mrVeloz && languages?.primary_language?.sort_code == 'es') ? strings.MY_ORDERS_MRVELOZ : strings.MY_ORDERS}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            ))}
          {!!userData?.auth_token && allAvailAblePaymentMethods?.map((item, inx) => {
            if (item?.id == 50) {
              return (<ListItemHorizontal
                centerContainerStyle={{ flexDirection: 'row' }}
                leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
                onPress={moveToNewScreen(navigationStrings.SAVEDCARDS, {
                  isBack: true,
                })}
                iconLeft={imagePath.icMyPosts}
                centerHeading={"Saved Cards"}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              />)
            }
          })}
          {!!userData?.auth_token &&
            dineInType == 'p2p' &&
            !!appMainData?.is_admin &&
            (businessType == 4 ? null : (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: 'row' }}
                leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
                onPress={moveToNewScreen(navigationStrings.MY_POSTS, {
                  isBack: true,
                })}
                iconLeft={imagePath.icMyPosts}
                centerHeading={strings.MY_POSTS}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              />
            ))}
          {/* {!!userData?.auth_token && getBundleId() != appIds.sxm2go ? (
            <ListItemHorizontal
              centerContainerStyle={{ flexDirection: 'row' }}
              leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
              onPress={moveToNewScreen(navigationStrings.REFER_AND_EARN)}
              iconLeft={imagePath.share1}
              centerHeading={strings.REFER_AND_EARN}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          ) : null} */}

          {!!userData?.auth_token &&
            !!appData &&
            !!appData?.profile &&
            appData?.profile?.preferences?.subscription_mode == 1 && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: 'row' }}
                leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
                onPress={moveToNewScreen(navigationStrings.SUBSCRIPTION)}
                iconLeft={imagePath.subscription}
                centerHeading={strings.SUBSCRIPTION}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            )}

          {!!userData?.auth_token && getBundleId() !== appIds.appi && (
            <ListItemHorizontal
              centerContainerStyle={{ flexDirection: 'row' }}
              leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
              onPress={moveToNewScreen(navigationStrings.LOYALTY)}
              iconLeft={imagePath.loyalty}
              centerHeading={strings.LOYALTYPOINTS}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
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
          {!!userData?.auth_token && getBundleId() !== appIds.appi && (
            <ListItemHorizontal
              centerContainerStyle={{ flexDirection: 'row' }}
              leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
              onPress={moveToNewScreen(navigationStrings.WALLET)}
              iconLeft={imagePath.wallet3}
              centerHeading={(getBundleId() == appIds.mrVeloz && languages?.primary_language?.sort_code == 'es') ? strings?.WALLET_MRVELOZ : strings.WALLET}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )}
          {!!userData?.auth_token &&
            (businessType == 4 ? null : (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: 'row' }}
                leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
                onPress={moveToNewScreen(navigationStrings.WISHLIST)}
                iconLeft={imagePath.wishlist}
                centerHeading={strings.FAVOURITE}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            ))}

          <ListItemHorizontal
            centerContainerStyle={{ flexDirection: 'row' }}
            leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
            onPress={moveToNewScreen(navigationStrings.CMSLINKS)}
            iconLeft={imagePath.links}
            centerHeading={
              getBundleId() == appIds.sxm2go ? strings.JOIN : getBundleId() == appIds.masa ? "More Information" : strings.LINKS
            }
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            }}
          // iconRight={imagePath.goRight}
          // rightIconStyle={{tintColor: colors.textGreyLight}}
          />

          {!!userData?.auth_token && (
            <ListItemHorizontal
              centerContainerStyle={{ flexDirection: 'row' }}
              leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
              onPress={onShare}
              iconLeft={imagePath.share1}
              centerHeading={strings.SHARE_APP}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )}

          <ListItemHorizontal
            centerContainerStyle={{ flexDirection: 'row' }}
            leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
            onPress={moveToNewScreen(navigationStrings.SETTIGS)}
            iconLeft={imagePath.settings1}
            centerHeading={strings.SETTINGS}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            }}
          // iconRight={imagePath.goRight}
          // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
          {appData.profile.preferences.sos == 1 ? (
            <ListItemHorizontal
              centerContainerStyle={{ flexDirection: 'row' }}
              leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
              onPress={showActionSheet}
              iconLeft={imagePath.icSos}
              centerHeading={strings.SOS}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
            />
          ) : null}

          {!!userData?.auth_token &&
            Platform.OS === 'android' &&
            !!appMainData?.is_admin ? (
            <ListItemHorizontal
              centerContainerStyle={{ flexDirection: 'row' }}
              leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
              onPress={() => {
                BluetoothManager.checkBluetoothEnabled().then(
                  (enabled) => {
                    if (Boolean(enabled)) {
                      bluetoothPermission().then((res) => {
                        console.log(res, 'resreserserserser')
                        navigation.navigate(navigationStrings.ATTACH_PRINTER);

                      })

                    } else {

                      bluetoothPermission().then((res) => {
                        console.log(res, 'resesersererser')
                        BluetoothManager.enableBluetooth()
                          .then((res) => {

                            navigation.navigate(navigationStrings.ATTACH_PRINTER);

                          })
                          .catch((err) => { });
                      })

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
          ) : null}

          {!!userData?.auth_token &&
            Platform.OS === 'android' &&
            SunmiV2Printer.hasPrinter &&
            __DEV__ &&
            (businessType == 'taxi' ? null : (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: 'row' }}
                leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
                onPress={() => {
                  BluetoothManager.checkBluetoothEnabled().then(
                    (enabled) => {
                      if (Boolean(enabled)) {
                        navigation.navigate(
                          navigationStrings.ATTACH_PRINTER + 'sunmi',
                        );
                      } else {
                        BluetoothManager.enableBluetooth()
                          .then(() => {
                            navigation.navigate(
                              navigationStrings.ATTACH_PRINTER + 'sunmi',
                            );
                          })
                          .catch((err) => { });
                      }
                    },
                    (err) => {
                      err;
                    },
                  );
                }}
                iconLeft={imagePath.printer}
                centerHeading={'Sunmi ' + SunmiV2Printer.printerModal}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            ))}

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
          {!!userData?.auth_token && (
            <ListItemHorizontal
              centerContainerStyle={{ flexDirection: 'row' }}
              leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
              onPress={
                appIds.hokitch == getBundleId()
                  ? () =>
                    Linking.openURL(
                      `https://api.whatsapp.com/send?phone=${contact_phone_number
                        ? contact_phone_number
                        : phone_number
                      }`,
                    )
                  : moveToNewScreen(navigationStrings.CONTACT_US)
              }
              iconLeft={imagePath.contactUs}
              centerHeading={(getBundleId() == appIds?.mrVeloz && languages?.primary_language?.sort_code == 'es') ? strings?.CONTACT_US_MRVELOZ : strings.CONTACT_US}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )}


          {!!userData?.auth_token && preferences?.customer_support_application_id && preferences?.customer_support_key && (
            <ListItemHorizontal
              centerContainerStyle={{ flexDirection: 'row' }}
              leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
              onPress={() => onStartSupportChat()}
              iconLeft={imagePath.support}
              centerHeading={strings.SUPPORT}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )}

          {!!userData?.auth_token &&
            !!appMainData?.is_admin &&
            businessType != 4 && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: 'row' }}
                leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
                onPress={moveToNewScreen(navigationStrings.TABROUTESVENDORNEW)}
                iconLeft={imagePath.mystores2}
                centerHeading={strings.MYSTORES}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            )}

          {dineInType !== 'p2p' &&
            !!userData?.auth_token &&
            !!appMainData?.is_admin &&
            businessType != 4 &&
            !!appData?.profile?.socket_url && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: 'row' }}
                leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
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

          {dineInType !== 'p2p' &&
            !!userData?.auth_token &&
            !!appData?.profile?.socket_url && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: 'row' }}
                leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
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

          {dineInType !== 'p2p' &&
            !!userData?.auth_token &&
            !!appMainData?.is_admin &&
            !!appData?.profile?.socket_url && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: 'row' }}
                leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
                onPress={() => goToChatRoom('vendor_chat')}
                iconLeft={imagePath.icUserChat}
                centerHeading={strings.VENDOR_CHAT}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              />
            )}

          {dineInType !== 'p2p' &&
            !!userData?.auth_token &&
            !!appData?.profile?.socket_url && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: 'row' }}
                leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
                onPress={() => goToChatRoom('user_chat')}
                iconLeft={imagePath.icVendorChat}
                centerHeading={strings.USER_CHAT}
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
                <Text
                  style={{
                    ...styles.loginLogoutText,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {strings.LOGIN}
                </Text>
                <Image
                  source={imagePath.rightBlue}
                  style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
        <ActionSheet
          ref={actionSheet}
          // title={'Choose one option'}
          options={[strings.POLICE, strings.AMBULANCE, strings.CANCEL]}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => onSosButton(index)}
        />
      </SafeAreaView>
    </View>
  );
}
