import { DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Image, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import navigationStrings from '../navigation/navigationStrings';
import { dummyUser } from '../constants/constants';
import commonStylesFun from '../styles/commonStyles';
import strings from '../constants/lang';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import { useDarkMode } from 'react-native-dynamic';
import colors from '../styles/colors';
import { MyDarkTheme } from '../styles/theme';
import imagePath from '../constants/imagePath';
import actions from '../redux/actions';
import ButtonComponent from './ButtonComponent';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../utils/helperFunctions';
import { TouchableOpacity } from '@gorhom/bottom-sheet';




const CustomDrawerContent = (props) => {


  const navigation = useNavigation()
  const userData = useSelector(state => state?.auth?.userData || null)
  const { appStyle, themeColors } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({ fontFamily });
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const currentTab = useRef(1)

  console.log("userDatauserData", userData)

  const imageStyle = {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: moderateScale(15)
  }

  const onPressWishList = (index) => {
    if (!!userData?.auth_token) {
      currentTab.current = index
      navigation.navigate(navigationStrings.WISHLIST, { isComeFromDrawer: true })
    } else {
      actions.setAppSessionData('on_login')
    }
  }

  const onPressLoginLogout = () => {
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
            actions.saveAddress('');
            actions.addSearchResults('clear');
            actions.setAppSessionData('on_login');
          },
        },
      ]);
    } else {
      actions.setAppSessionData('on_login');
    }
  }


  const onPressItem = (screenName, index) => {
    currentTab.current = index
    navigation.navigate(screenName)
  }

  const onPressPrivacyPolicy = (id, index) => {
    currentTab.current = index
    navigation.navigate(navigationStrings.WEBLINKS, { id: id, isComeFromDrawer: true })
  }

  const onPressProfile = () => {
    if (!!userData?.auth_token) {

      navigation.navigate(navigationStrings.MY_PROFILE, { isComeFromDrawer: true })
    } else {
      actions.setAppSessionData('on_login')
    }
  }
  return (

    <View style={{
      flex: 1,
      backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white
    }}>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 0.8 }}>
          <TouchableOpacity
            style={{
              alignSelf: 'center'
            }}
            activeOpacity={0.7}
            onPress={onPressProfile}
          >

            <FastImage
              source={
                userData?.source?.uri
                  ? {
                    uri: userData?.source?.uri,
                    priority: FastImage.priority.high,
                  }
                  : { uri: dummyUser }
              }
              style={{
                height: moderateScale(80),
                width: moderateScale(80),
                borderRadius: moderateScale(40),
              }}
            />

            <Text
              numberOfLines={1}
              style={{
                ...commonStyles.buttonTextWhite,
                marginVertical: moderateScaleVertical(8),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black
              }}>
              {!!userData?.name ? userData?.name : strings.GUSET_USER}
            </Text>
          </TouchableOpacity>

          <DrawerItem
            label={strings.HOME}
            onPress={() => onPressItem(navigationStrings.HOME, 1)} //screenName, tabIndex
            icon={({ focused }) => {
              return (
                <Image style={{
                  ...imageStyle,
                  resizeMode: 'contain',
                  tintColor: themeColors.primary_color
                }} source={imagePath.icEcomHomeInactive} />
              )
            }}
            labelStyle={{ color: isDarkMode ? colors.white : colors.black }}
          />
          {!!userData && 
          <DrawerItem
            label={'Order Again'}
            onPress={() => onPressItem(navigationStrings.ORDER_AGAIN, 2)} //tabIndex

            icon={({ focused }) => {
              return (
                <Image style={{
                  ...imageStyle,
                  resizeMode: 'contain',
                  tintColor: themeColors.primary_color
                }} source={imagePath.icRepeat} />
              )
            }}
            labelStyle={{ color: isDarkMode ? colors.white : colors.black }}

          />}

          {/* <DrawerItem
            label={strings.CATEGORY}
            onPress={() => onPressItem(navigationStrings.CATEGORY, 2)} //screenName, tabIndex
            icon={({ focused }) => {
              return (
                <Image style={{
                  ...imageStyle,
                  tintColor: currentTab?.current == 2 ? themeColors.primary_color : colors.black
                }} source={imagePath.icCat} />
              )
            }}
            labelStyle={{ color: currentTab?.current == 2 ? themeColors?.primary_color : colors.black }}
            style={{
              backgroundColor: currentTab?.current == 2 ? getColorCodeWithOpactiyNumber(
                themeColors.primary_color.substr(1),
                10,
              ) : colors.white
            }}
          /> */}


          <DrawerItem
            label={strings.WISHLIST}
            onPress={() => onPressWishList(3)} //tabIndex
            icon={({ focused }) => {
              return (
                <Image style={{
                  ...imageStyle,
                  resizeMode: 'contain',
                  tintColor: themeColors.primary_color
                }} source={imagePath.wishlist2} />
              )
            }}
            labelStyle={{ color: isDarkMode ? colors.white : colors.black }}
          />

          <DrawerItem
            label={strings.PRIVACY_POLICY}
            onPress={() => onPressPrivacyPolicy(3, 4)} //id, tabIndex
            icon={({ focused }) => {
              return (
                <Image style={{
                  ...imageStyle,
                  resizeMode: 'contain',
                  tintColor: themeColors.primary_color
                }} source={imagePath.icPrivacy} />
              )
            }}
            labelStyle={{ color: isDarkMode ? colors.white : colors.black }}
          />

          <DrawerItem
            label={strings.TERMS_CONDITIONS}
            onPress={() => onPressPrivacyPolicy(2, 5)} //id, tabIndex
            icon={({ focused }) => {
              return (
                <Image style={{
                  ...imageStyle,
                  resizeMode: 'contain',
                  tintColor: themeColors.primary_color
                }} source={imagePath.icTerms} />
              )
            }}
            labelStyle={{ color: isDarkMode ? colors.white : colors.black }}
          />

        </View>


        <View style={{ flex: 0.2, justifyContent: 'flex-end', paddingBottom: moderateScaleVertical(16) }}>
          <ButtonComponent
            btnText={!!userData?.auth_token ? strings.LOGOUT : strings.LOGIN}
            containerStyle={{
              backgroundColor: themeColors.primary_color,
              marginHorizontal: moderateScale(12),
              borderRadius: moderateScale(4)
            }}
            onPress={onPressLoginLogout}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};
export default React.memo(CustomDrawerContent);
