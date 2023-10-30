import {useFocusEffect} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  Alert,
  I18nManager,
  Image,
  Platform,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
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
import stylesFun from './styles';
import DeviceInfo from 'react-native-device-info';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import {BluetoothManager} from '@brooons/react-native-bluetooth-escpos-printer';
import {
  getImageUrl,
  getRandomColor,
  showError,
} from '../../utils/helperFunctions';
import FastImage from 'react-native-fast-image';
import {color} from 'react-native-reanimated';
import ListItemHorizontalWithRightText from '../../Components/ListItemHorizontalWithImageWithRightText';

export default function Account5({navigation}) {
  const [state, setState] = useState({
    isLoading: false,
  });
  const {
    shortCodeStatus,
    themeColors,
    appStyle,
    appData,
    languages,
    currencies,
  } = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const homePageLayout = appStyle?.homePageLayout;
  const businessType = appStyle?.homePageLayout;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});

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
  const onShare = async () => {
    try {
      const result = await Share.share({
        url: 'https://play.google.com/store/apps/details?id=com.codebrew.customer',
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
            moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
          },
        },
      ]);
    } else {
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    }
  };
  const _scrollRef = useRef();

  const onDeleteAccount = () => {
    if (!!userData?.auth_token) {
      Alert.alert(strings.ARE_YOU_SURE_YOU_WANT_TO_DELETE, '', [
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
        },
      );
      console.log('delete user account res', res);
      actions.userLogout();
      actions.cartItemQty('');
      actions.saveAddress('');
      actions.addSearchResults('clear');
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    } catch (error) {
      console.log('erro raised', error);
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
              onPress={() =>
                navigation.push(navigationStrings.SHORT_CODE, {
                  shortCodeParam: true,
                })
              }
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

      {/* <View style={{ ...commonStyles.headerTopLine }} /> */}

      <ScrollView style={{flex: 1}} ref={_scrollRef}>
        {!!userData?.auth_token && (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              // onPress={moveToNewScreen(navigationStrings.MY_PROFILE)}
              style={{
                marginHorizontal: moderateScale(5),
                flexDirection: 'row',
                // alignItems: 'center',
                marginTop: moderateScaleVertical(10),
                // backgroundColor: isDarkMode
                //   ? MyDarkTheme.colors.lightDark
                //   : colors.white,
                paddingVertical: moderateScaleVertical(12),
                // borderRadius: 12,
                alignSelf: 'flex-start',
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
                    height: moderateScale(42),
                    width: moderateScale(42),
                    borderRadius: moderateScale(50),
                    marginHorizontal: moderateScale(15),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: textScale(18),
                      textTransform: 'uppercase',
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.blackB,
                    }}>
                    {userData?.name.slice(0, 1)}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'column',
                  marginRight: moderateScale(25),
                }}>
                <Text
                  style={{
                    // color: isDarkMode
                    //   ? MyDarkTheme.colors.text
                    //   : colors.textGreyJ,
                    fontFamily: fontFamily.medium,
                    fontSize: textScale(16),
                  }}>
                  {userData?.name}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(13),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyJ,
                    marginTop: moderateScaleVertical(3),
                  }}>
                  {userData?.email}
                </Text>
                {console.log('checking profile data >>>> ', userData)}
                {/* {userData?.phone_number && ( */}
                {
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      fontSize: textScale(13),
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyJ,
                      marginTop: moderateScaleVertical(3),
                    }}>
                    {/* {userData?.phone_number} */}
                    {'+61325458796'}
                  </Text>
                }
              </View>
              <TouchableOpacity
                style={{
                  alignItems: 'flex-end',
                  flex: 1,
                  paddingRight: moderateScale(20),
                }}>
                <Image
                  source={imagePath.editBlue}
                  style={{tintColor: colors.grayOpacity51}}
                />
              </TouchableOpacity>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: colors.redColor,
                flexDirection: 'row',
                borderRadius: moderateScale(5),
                alignItems: 'center',
                marginHorizontal: moderateScale(20),
                justifyContent: 'space-between',
                paddingHorizontal: moderateScale(17),
                paddingVertical: moderateScale(15),
              }}>
              <Text style={{color: colors.white, fontSize: textScale(13)}}>
                Security check. Please verify email
              </Text>
              <TouchableOpacity
                style={{
                  paddingHorizontal: moderateScale(12),
                  paddingVertical: moderateScaleVertical(1),
                  borderRadius: moderateScale(50),
                  borderWidth: 1,
                  borderColor: colors.white,
                }}>
                <Text style={{color: colors.white, fontSize: textScale(12)}}>
                  Verify
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: moderateScale(10),
              }}></View>
          </>
          // <ListItemHorizontal
          //   centerContainerStyle={{flexDirection: 'row'}}
          //   leftIconStyle={{flex: 0.2, alignItems: 'center'}}
          //   onPress={moveToNewScreen(navigationStrings.MY_PROFILE)}
          //   iconLeft={imagePath.icProfile}
          //   centerHeading={strings.MY_PROFILE}
          //   containerStyle={styles.containerStyle}
          //   iconRight={imagePath.goRight}
          //   rightIconStyle={{tintColor: colors.textGreyLight}}
          //   centerHeadingStyle={{fontSize: textScale(15)}}
          // />
        )}
        <Text
          style={{
            marginHorizontal: moderateScale(20),
            fontSize: textScale(13),
            fontFamily: fontFamily.bold,
            marginBottom: moderateScale(5),
          }}>
          {'Account'}
        </Text>
        {!!userData?.auth_token &&
          (businessType == 4 ? null : (
            <ListItemHorizontalWithRightText
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.2, alignItems: 'center'}}
              // onPress={moveToNewScreen(navigationStrings.MY_ORDERS)}
              iconLeft={imagePath.myOrders}
              centerHeading={strings.MY_ORDERS}
              containerStyle={styles.containerStyle}
              centerHeadingStyle={
                isDarkMode
                  ? {
                      fontSize: textScale(14),
                      fontFamily: fontFamily.medium,
                      color: MyDarkTheme.colors.text,
                    }
                  : {fontSize: textScale(14), fontFamily: fontFamily.medium}
              }
              iconRight={imagePath.goRight}
              rightIconStyle={{tintColor: colors.textGreyLight}}
              rightText="See ongoing & history"
            />
          ))}

        {!!userData?.auth_token && (
          <ListItemHorizontalWithRightText
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.2, alignItems: 'center'}}
            // onPress={moveToNewScreen(navigationStrings.SUBSCRIPTION)}
            iconLeft={imagePath.roundPercentage}
            centerHeading={'Payment Methods'}
            containerStyle={styles.containerStyle}
            centerHeadingStyle={
              isDarkMode
                ? {
                    fontSize: textScale(14),
                    fontFamily: fontFamily.medium,
                    color: MyDarkTheme.colors.text,
                  }
                : {fontSize: textScale(14), fontFamily: fontFamily.medium}
            }
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}

        {!!userData?.auth_token && (
          <ListItemHorizontalWithRightText
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.2, alignItems: 'center'}}
            // onPress={moveToNewScreen(navigationStrings.LOYALTY)}
            iconLeft={imagePath.changeLanguage}
            centerHeading={'Change Language'}
            containerStyle={styles.containerStyle}
            centerHeadingStyle={
              isDarkMode
                ? {
                    fontSize: textScale(14),
                    fontFamily: fontFamily.medium,
                    color: MyDarkTheme.colors.text,
                  }
                : {fontSize: textScale(14), fontFamily: fontFamily.medium}
            }
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}

        {/* {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.2, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.NOTIFICATION)}
            iconLeft={imagePath.notifcation}
            centerHeading={strings.NOTIFICATION}
            containerStyle={styles.containerStyle}
            centerHeadingStyle={{fontSize: textScale(15)}}
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )} */}
        {!!userData?.auth_token && (
          <ListItemHorizontalWithRightText
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.2, alignItems: 'center'}}
            // onPress={moveToNewScreen(navigationStrings.WALLET)}
            iconLeft={imagePath.saved}
            centerHeading={'Saved Addresses'}
            containerStyle={styles.containerStyle}
            centerHeadingStyle={
              isDarkMode
                ? {
                    fontSize: textScale(14),
                    fontFamily: fontFamily.medium,
                    color: MyDarkTheme.colors.text,
                  }
                : {fontSize: textScale(14), fontFamily: fontFamily.medium}
            }
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}
        {!!userData?.auth_token &&
          (businessType == 4 ? null : (
            <ListItemHorizontalWithRightText
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.2, alignItems: 'center'}}
              // onPress={moveToNewScreen(navigationStrings.WISHLIST)}
              iconLeft={imagePath.inviteFriend}
              centerHeading={'Invite Friends'}
              containerStyle={styles.containerStyle}
              centerHeadingStyle={
                isDarkMode
                  ? {
                      fontSize: textScale(14),
                      fontFamily: fontFamily.medium,
                      color: MyDarkTheme.colors.text,
                    }
                  : {fontSize: textScale(14), fontFamily: fontFamily.medium}
              }
              iconRight={imagePath.goRight}
              rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          ))}

        {/* <ListItemHorizontalWithRightText
          centerContainerStyle={{ flexDirection: 'row' }}
          leftIconStyle={{ flex: 0.2, alignItems: 'center' }}
          onPress={moveToNewScreen(navigationStrings.CMSLINKS)}
          iconLeft={imagePath.about}
          centerHeading={strings.LINKS}
          containerStyle={styles.containerStyle}
          centerHeadingStyle={
            isDarkMode
              ? { fontSize: textScale(14), fontFamily: fontFamily.medium , color: MyDarkTheme.colors.text }
              : { fontSize: textScale(14), fontFamily: fontFamily.medium  }
          }
          iconRight={imagePath.goRight}
          rightIconStyle={{ tintColor: colors.textGreyLight }}
        />
        {!!userData?.auth_token && (
          <ListItemHorizontalWithRightText
            centerContainerStyle={{ flexDirection: 'row' }}
            leftIconStyle={{ flex: 0.2, alignItems: 'center' }}
            onPress={onShare}
            iconLeft={imagePath.share}
            centerHeading={strings.SHARE_APP}
            containerStyle={styles.containerStyle}
            centerHeadingStyle={
              isDarkMode
                ? { fontSize: textScale(14), fontFamily: fontFamily.medium , color: MyDarkTheme.colors.text }
                : { fontSize: textScale(14), fontFamily: fontFamily.medium  }
            }
            iconRight={imagePath.goRight}
            rightIconStyle={{ tintColor: colors.textGreyLight }}
          />
        )}

        <ListItemHorizontalWithRightText
          centerContainerStyle={{ flexDirection: 'row' }}
          leftIconStyle={{ flex: 0.2, alignItems: 'center' }}
          onPress={moveToNewScreen(navigationStrings.SETTIGS)}
          iconLeft={imagePath.settings}
          centerHeading={strings.SETTINGS}
          containerStyle={styles.containerStyle}
          centerHeadingStyle={
            isDarkMode
              ? { fontSize: textScale(14), fontFamily: fontFamily.medium , color: MyDarkTheme.colors.text }
              : { fontSize: textScale(14), fontFamily: fontFamily.medium  }
          }
          iconRight={imagePath.goRight}
          rightIconStyle={{ tintColor: colors.textGreyLight }}
        /> */}
        {/* {!!userData?.auth_token && (
          <ListItemHorizontalWithRightText
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.2, alignItems: 'center'}}
            iconLeft={imagePath.payment}
            centerHeading={strings.PAYMENTS}
            containerStyle={styles.containerStyle}
            centerHeadingStyle={{fontSize: textScale(15)}}
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )} */}
        {/* <ListItemHorizontalWithRightText
          centerContainerStyle={{ flexDirection: 'row' }}
          leftIconStyle={{ flex: 0.2, alignItems: 'center' }}
          onPress={moveToNewScreen(navigationStrings.CONTACT_US)}
          iconLeft={imagePath.message}
          centerHeading={strings.CONTACT_US}
          containerStyle={styles.containerStyle}
          centerHeadingStyle={
            isDarkMode
              ? { fontSize: textScale(14), fontFamily: fontFamily.medium , color: MyDarkTheme.colors.text }
              : { fontSize: textScale(14), fontFamily: fontFamily.medium  }
          }
          iconRight={imagePath.goRight}
          rightIconStyle={{ tintColor: colors.textGreyLight }}
        /> */}

        {!!userData?.auth_token &&
          Platform.OS === 'android' &&
          (businessType == 'taxi' ? null : (
            <ListItemHorizontalWithRightText
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.2, alignItems: 'center'}}
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
              containerStyle={styles.containerStyle}
              centerHeadingStyle={
                isDarkMode
                  ? {
                      fontSize: textScale(14),
                      fontFamily: fontFamily.medium,
                      color: MyDarkTheme.colors.text,
                    }
                  : {fontSize: textScale(14), fontFamily: fontFamily.medium}
              }
              iconRight={imagePath.goRight}
              rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          ))}

        {!!userData?.auth_token &&
          !!appMainData?.is_admin &&
          (businessType === 4 ? null : (
            <ListItemHorizontalWithRightText
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.2, alignItems: 'center'}}
              onPress={moveToNewScreen(navigationStrings.TABROUTESVENDOR)}
              iconLeft={imagePath.myStoreIcon}
              centerHeading={strings.MYSTORES}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={
                isDarkMode
                  ? {
                      fontSize: textScale(14),
                      fontFamily: fontFamily.medium,
                      color: MyDarkTheme.colors.text,
                    }
                  : {fontSize: textScale(14), fontFamily: fontFamily.medium}
              }
              iconRight={imagePath.goRight}
              rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          ))}

        {!!userData?.auth_token && (
          <ListItemHorizontalWithRightText
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={onDeleteAccount}
            iconLeft={imagePath.user}
            centerHeading={strings.DELETE_ACCOUNT}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}

        <View style={styles.loginView}>
          <TouchableOpacity
            onPress={userlogout}
            style={styles.touchAbleLoginVIew}>
            <Text style={styles.loginLogoutText}>
              {!!userData?.auth_token ? strings.LOGOUT : strings.LOGIN}
            </Text>
            <Image
              source={imagePath.rightBlue}
              style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
            />
          </TouchableOpacity>
        </View>
        <View style={{height: 100}} />
      </ScrollView>
    </WrapperContainer>
  );
}
