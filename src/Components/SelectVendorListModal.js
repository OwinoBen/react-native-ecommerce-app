import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import WrapperContainer from '../Components/WrapperContainer';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {getImageUrl} from '../utils/helperFunctions';
import Header from './Header';

// import OrderCardComponent from './OrderCardComponent';

export default function SelectVendorListModal({
  onCloseModal = () => {},
  vendorList = [],
  onVendorSelect = () => {},
  selectedVendor = {},
}) {
  const {themeColor, themeToggle, appStyle, themeColors} = useSelector(
    (state) => state?.initBoot,
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});
  const styles = stylesData({fontFamily});

  const renderVendorList = ({item, index}) => {
    {
      let imageurl = item.logo
        ? getImageUrl(item.logo.image_fit, item.logo.image_path, '200/200')
        : logoUrl;
      return (
        <TouchableOpacity
          onPress={() => onVendorSelect(item)}
          key={index}
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
                  ? [styles.vendorTitleStyle, {color: MyDarkTheme.colors.text}]
                  : styles.vendorTitleStyle
              }>
              {item.name}
            </Text>
          </View>

          <View
            style={{
              flex: 0.2,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            {!!(item?.id == selectedVendor?.id) && (
              <Image
                style={{tintColor: themeColors.primary_color}}
                source={imagePath.done}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    }
  };
  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5 ? imagePath.icBackb : imagePath.back
        }
        onPressLeft={onCloseModal}
        centerTitle={strings.AVAILABLE_STORE}
        textStyle={{fontSize: textScale(13), fontFamily: fontFamily.medium}}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{...commonStyles.headerTopLine}} />

      <FlatList
        style={{
          marginHorizontal: moderateScale(15),
          marginTop: moderateScaleVertical(15),
        }}
        data={vendorList}
        renderItem={renderVendorList}
      />
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
