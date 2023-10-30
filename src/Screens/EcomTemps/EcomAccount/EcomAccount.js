import { BluetoothManager } from "@brooons/react-native-bluetooth-escpos-printer";
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
    Alert,
    I18nManager,
    Image,
    Linking,
    Platform,
    ScrollView,
    Share,
    Text,
    TouchableOpacity, View
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import ListItemHorizontal from '../../../Components/ListItemHorizontalWithImage';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang/index';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun, { hitSlopProp } from '../../../styles/commonStyles';
import ActionSheet from 'react-native-actionsheet';
import {
    moderateScale,
    moderateScaleVertical,
    textScale
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import {
    getImageUrl,
    getRandomColor,
    showError
} from "../../../utils/helperFunctions";
import stylesFun from "./styles";
import Header from "../../../Components/Header";

export default function EcomAccount({ navigation }) {
    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    const {
        themeColors,
        appStyle,
        appData,
        shortCodeStatus,
        languages,
        currencies,
    } = useSelector((state) => state?.initBoot);


    console.log("languageslanguages+++", languages)

    const businessType = appStyle?.homePageLayout;
    const [state, setState] = useState({ isLoading: false });
    const [allVendors, setAllVendors] = useState([]);

    const [isVisible, setIsVisible] = useState(false);

    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFun({ fontFamily, themeColors });
    const commonStyles = commonStylesFun({ fontFamily });

    //Navigation to specific screen
    const moveToNewScreen = (screenName, data = {}) => () => {
        return navigation.navigate(screenName, { data });
    };



    console.log("appDataappData", appData)
    const userData = useSelector((state) => state.auth.userData);
    const { dineInType, appMainData,countryFlag } = useSelector((state) => state?.home || {});

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


    const goToChatRoomForVendor = useCallback(() => {
        navigation.navigate(navigationStrings.CHAT_ROOM_FOR_VENDOR, {
            type: 'vendor_chat',
        });
    }, []);

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



    //Share your app
    const onShare = async () => {
        try {
            const result = await Share.share({
                url:
                    "https://play.google.com/store/apps/details?id=com.codebrew.customer",
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
            }
        } catch (error) {
            alert(error.message);
        }
    };
    const onJoinUS = () => {
        if (deviceInfoModule.getBundleId() == appIds.jazzyBug) { }
    }
    //Logout function
    const userlogout = () => {
        if (!!userData?.auth_token) {
            Alert.alert("", strings.LOGOUT_SURE_MSG, [
                {
                    text: strings.CANCEL,
                    onPress: () => console.log("Cancel Pressed"),
                    // style: 'destructive',
                },
                {
                    text: strings.CONFIRM,
                    onPress: () => {
                        actions.userLogout();
                        actions.cartItemQty("");
                        moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
                    },
                },
            ]);
        } else {
            moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
        }
    };

    const usernameFirstlater = !!userData?.name && userData?.name?.charAt(0);


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

    const onDeleteAccount = () => {
        if (!!userData?.auth_token) {
            Alert.alert(strings.ARE_YOU_SURE_YOU_WANT_TO_DELETE, "", [
                {
                    text: strings.CANCEL,
                    onPress: () => console.log("Cancel Pressed"),
                    // style: 'destructive',
                },
                {
                    text: strings.CONFIRM,
                    onPress: deleleUserAccount,
                },
            ]);
        } else {
            moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
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
                }
            );
            console.log("delete user account res", res);
            actions.userLogout();
            actions.cartItemQty("");
            actions.saveAddress("");
            actions.addSearchResults("clear");
            moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
        } catch (error) {
            console.log("erro raised", error);
            showError(error?.message);
        }
    };


    return (
        <WrapperContainer
            bgColor={
                isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
            }
        >
            {/* <Text
      
        style={{
          color: colors.black2Color,
          fontSize: textScale(16),
          lineHeight: textScale(28),
          textAlign: "center",
          fontFamily: fontFamily.medium,
        }}
      >
        {strings.ACCOUNT}
      </Text> */}
            <Header centerTitle={strings.MY_ACCOUNT} noLeftIcon={true} />
            <ScrollView style={{
                flex: 1,
                backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
            }} showsVerticalScrollIndicator={false}>
                {!!userData?.auth_token && (
                    <>
                        <View
                            style={{
                                marginHorizontal: moderateScale(24),
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: moderateScaleVertical(20),
                                backgroundColor: isDarkMode
                                    ? MyDarkTheme.colors.lightDark
                                    : colors.greyColor,
                                paddingVertical: moderateScaleVertical(12),
                                borderRadius: 12,
                            }}
                        >
                            {userData?.source ? (
                                <FastImage
                                    source={
                                        userData?.source?.image_path
                                            ? {
                                                uri: getImageUrl(
                                                    userData?.source?.proxy_url,
                                                    userData?.source?.image_path,
                                                    "200/200"
                                                ),
                                            }
                                            : userData?.source
                                    }
                                    style={{
                                        height: moderateScale(46),
                                        width: moderateScale(46),
                                        borderRadius: moderateScale(23),
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
                                        borderRadius: moderateScale(23),
                                        marginHorizontal: moderateScale(15),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: textScale(20),
                                            textTransform: "uppercase",
                                            color: isDarkMode
                                                ? MyDarkTheme.colors.text
                                                : colors.blackB,
                                        }}
                                    >
                                        {usernameFirstlater}
                                    </Text>
                                </View>
                            )}
                            <View
                                style={{
                                    marginHorizontal: moderateScale(10),
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flex: 1,
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            color: isDarkMode
                                                ? MyDarkTheme.colors.text
                                                : colors.textGreyJ,
                                            fontFamily: fontFamily.medium,
                                            fontSize: textScale(14),
                                        }}
                                    >
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
                                        }}
                                    >
                                        {userData?.email}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    hitSlop={hitSlopProp}
                                    onPress={moveToNewScreen(navigationStrings.MY_PROFILE)}
                                >
                                    <Image
                                        source={imagePath.icEdit1}
                                        style={{
                                            tintColor: isDarkMode
                                                ? colors.white : colors.black,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                            style={{
                                marginTop: moderateScale(30),
                            }}
                        />
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
                    (businessType == 4 ? null : (
                        <ListItemHorizontal
                            centerContainerStyle={{ flexDirection: "row" }}
                            leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                            onPress={moveToNewScreen(navigationStrings.MY_ORDERS)}
                            iconLeft={imagePath.myOrder2}
                            centerHeading={strings.MY_ORDERS}
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
                    !!appData &&
                    !!appData?.profile &&
                    appData?.profile?.preferences?.subscription_mode == 1 && (
                        <ListItemHorizontal
                            centerContainerStyle={{ flexDirection: "row" }}
                            leftIconStyle={{ flex: 0.1, alignItems: "center" }}
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
                        centerContainerStyle={{ flexDirection: "row" }}
                        leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                        onPress={moveToNewScreen(navigationStrings.TRACKING)}
                        iconLeft={imagePath.subscription}
                        centerHeading={strings.TRACKING}
                        containerStyle={styles.containerStyle2}
                        centerHeadingStyle={{
                            fontSize: textScale(14),
                            fontFamily: fontFamily.regular,
                        }}
                    // iconRight={imagePath.goRight}
                    // rightIconStyle={{tintColor: colors.textGreyLight}}
                    />
                )}

                {!!userData?.auth_token && (
                    <ListItemHorizontal
                        centerContainerStyle={{ flexDirection: "row" }}
                        leftIconStyle={{ flex: 0.1, alignItems: "center" }}
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
                {!!userData?.auth_token && (
                    <ListItemHorizontal
                        centerContainerStyle={{ flexDirection: "row" }}
                        leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                        onPress={moveToNewScreen(navigationStrings.WALLET)}
                        iconLeft={imagePath.wallet3}
                        centerHeading={strings.WALLET}
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
                            centerContainerStyle={{ flexDirection: "row" }}
                            leftIconStyle={{ flex: 0.1, alignItems: "center" }}
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
                    centerContainerStyle={{ flexDirection: "row" }}
                    leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                    onPress={moveToNewScreen(navigationStrings.CMSLINKS)}
                    iconLeft={imagePath.links}
                    centerHeading={strings.LINKS}
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
                        centerContainerStyle={{ flexDirection: "row" }}
                        leftIconStyle={{ flex: 0.1, alignItems: "center" }}
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
                    centerContainerStyle={{ flexDirection: "row" }}
                    leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                    onPress={moveToNewScreen(navigationStrings.ECOM_LANG_CURRENCY, { 
                        type: 'country',
                        renderIndex: 1
                     })}
                    iconLeft={imagePath.icCountry}
                    centerHeading={strings.COUNTRY}
                    containerStyle={styles.containerStyle2}
                    showCountry={countryFlag}
                    centerHeadingStyle={{
                        fontSize: textScale(14),
                        fontFamily: fontFamily.regular,
                    }}
                />
                <ListItemHorizontal
                    centerContainerStyle={{ flexDirection: "row" }}
                    leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                    onPress={moveToNewScreen(navigationStrings.ECOM_LANG_CURRENCY, { 
                        type: 'currency',
                        renderIndex: 2
                     })}
                    iconLeft={imagePath.icCurrency}
                    centerHeading={strings.CURRENCIES}
                    containerStyle={styles.containerStyle2}
                    centerHeadingStyle={{
                        fontSize: textScale(14),
                        fontFamily: fontFamily.regular,
                    }}
                    rightText={currencies?.primary_currency?.iso_code}

                />

                <ListItemHorizontal
                    centerContainerStyle={{ flexDirection: "row" }}
                    leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                    onPress={moveToNewScreen(navigationStrings.ECOM_LANG_CURRENCY, { 
                        type: 'language',
                        renderIndex: 3
                     })}
                    rightText={languages?.primary_language?.name || languages?.primary_language?.value}
                    iconLeft={imagePath.icLang}
                    centerHeading={strings.LANGUAGES}
                    containerStyle={styles.containerStyle2}
                    centerHeadingStyle={{
                        fontSize: textScale(14),
                        fontFamily: fontFamily.regular,
                    }}
                />
                <ListItemHorizontal
                    centerContainerStyle={{ flexDirection: "row" }}
                    leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                    onPress={moveToNewScreen(navigationStrings.SETTIGS)}
                    iconLeft={imagePath.settings1}
                    centerHeading={strings.SETTINGS}
                    containerStyle={styles.containerStyle2}
                    centerHeadingStyle={{
                        fontSize: textScale(14),
                        fontFamily: fontFamily.regular,
                    }}
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
                    Platform.OS === 'android' && getBundleId() !== appIds.appi &&
                    (businessType == 'taxi' ? null : (
                        <ListItemHorizontal
                            centerContainerStyle={{ flexDirection: "row" }}
                            leftIconStyle={{ flex: 0.1, alignItems: "center" }}
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
                                                .catch((err) => { });
                                        }
                                    },
                                    (err) => {
                                        err;
                                    }
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
                    centerContainerStyle={{ flexDirection: "row" }}
                    leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                    onPress={moveToNewScreen(navigationStrings.CONTACT_US)}
                    iconLeft={imagePath.contactUs}
                    centerHeading={strings.CONTACT_US}
                    containerStyle={styles.containerStyle2}
                    centerHeadingStyle={{
                        fontSize: textScale(14),
                        fontFamily: fontFamily.regular,
                    }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
                />



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
                            onPress={() => actions.setAppSessionData("on_login")}
                            style={styles.touchAbleLoginVIew}
                        >
                            <Text
                                style={{
                                    ...styles.loginLogoutText,
                                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                                }}
                            >
                                {strings.LOGIN}
                            </Text>
                            <Image
                                source={imagePath.rightBlue}
                                style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
                            />
                        </TouchableOpacity>
                    </View>
                )}
                {!!userData?.auth_token &&
                    !!appMainData?.is_admin &&
                    businessType != 4 && (
                        <ListItemHorizontal
                            centerContainerStyle={{ flexDirection: "row" }}
                            leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                            onPress={moveToNewScreen(navigationStrings.TABROUTESVENDOR)}
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

                <View style={{ height: 100 }} />
                <ActionSheet
                    ref={actionSheet}
                    // title={'Choose one option'}
                    options={[strings.POLICE, strings.AMBULANCE, strings.CANCEL]}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => onSosButton(index)}
                />
            </ScrollView>
        </WrapperContainer>
    );
}
