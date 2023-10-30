import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import Header from '../../../Components/Header';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import staticStrings from '../../../constants/staticStrings';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import {getImageUrl} from '../../../utils/helperFunctions';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../../styles/theme';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';

// import OrderCardComponent from './OrderCardComponent';

export default function VendorList({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {allVendors, selectedVendor, screenType} = route.params;
  const [state, setState] = useState({
    isLoading: false,
    selectedVendorInStore: selectedVendor,
  });
  const {isLoading, selectedVendorInStore} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const currentTheme = useSelector((state) => state.initBoot);
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  const {themeColors, themeLayouts} = currentTheme;

  const setStoreAndRedirect = (i) => {
    updateState({selectedVendorInStore: i});
    actions.savedSelectedVendor(i);
    navigation.navigate(
      screenType == staticStrings.ORDERS
        ? navigationStrings.VENDOR_ORDER
        : screenType == staticStrings.PRODUCTS
        ? navigationStrings.VENDOR_PRODUCT
        : screenType == staticStrings.REVENUE
        ? navigationStrings.VENDOR_REVENUE
        : screenType,
      {
        selectedVendorFrom: i,
      },
    );
  };
  const styles = stylesData({fontFamily});
  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5 ? imagePath.icBackb : imagePath.back
        }
        centerTitle={strings.AVAILABLE_STORE}
        textStyle={{fontSize: textScale(13), fontFamily: fontFamily.medium}}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{...commonStyles.headerTopLine}} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: moderateScaleVertical(20),
          marginHorizontal: moderateScale(10),
          paddingBottom: moderateScaleVertical(30),
        }}>
        {allVendors && allVendors.length
          ? allVendors.map((i, inx) => {
              let imageurl = i.logo
                ? getImageUrl(i.logo.image_fit, i.logo.image_path, '200/200')
                : logoUrl;
              return (
                <TouchableOpacity
                  onPress={() => setStoreAndRedirect(i)}
                  key={inx}
                  style={
                    isDarkMode
                      ? [
                          styles.listViewStyle,
                          {backgroundColor: MyDarkTheme.colors.lightDark},
                        ]
                      : styles.listViewStyle
                  }>
                  <View
                    style={{
                      flex: 0.8,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <FastImage
                      source={{
                        uri: imageurl,
                        priority: FastImage.priority.high,
                      }}
                      style={{
                        height: moderateScale(48),
                        width: moderateScale(48),
                        borderRadius: moderateScale(48 / 2),
                      }}
                    />
                    <Text
                      style={
                        isDarkMode
                          ? [
                              styles.vendorTitleStyle,
                              {color: MyDarkTheme.colors.text},
                            ]
                          : styles.vendorTitleStyle
                      }>
                      {i.name}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 0.2,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}>
                    {!!(i?.id == selectedVendorInStore?.id) && (
                      <Image
                        style={{tintColor: themeColors.primary_color}}
                        source={imagePath.done}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          : null}
      </ScrollView>
    </WrapperContainer>
  );
}

export function stylesData({fontFamily}) {
  const currentTheme = useSelector((state) => state.initBoot);
  const {themeColors} = currentTheme;
  const styles = StyleSheet.create({
    listViewStyle: {
      flexDirection: 'row',
      marginBottom: moderateScaleVertical(10),
      justifyContent: 'space-between',
      backgroundColor: colors.white,
      borderRadius: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      padding: moderateScale(10),
    },
    vendorTitleStyle: {
      marginLeft: moderateScale(10),
      color: colors.textGreyI,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
    },
  });
  return styles;
}
