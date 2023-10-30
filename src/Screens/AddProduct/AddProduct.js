import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {useSelector} from 'react-redux';
import BorderTextInputWithLable from '../../Components/BorderTextInputWithLable';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';

export default function AddProduct() {
  const {themeColor, themeToggle, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      // isLoadingB={isLoadingB}
      source={loaderOne}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={strings.ADD_PRODUCT}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{flex: 1, marginHorizontal: moderateScale(15)}}>
        <BorderTextInputWithLable
          placeholder={'Salt'}
          label={strings.PRODUCT_NAME}
          textInputStyle={{
            borderWidth: 0.7,
            borderRadius: moderateScale(8),
            fontFamily: fontFamily.regular,
            color: colors.black,
          }}
          //   value={houseNo}
          multiline={false}
          borderWidth={0}
          marginBottomTxt={0}
          containerStyle={{borderBottomWidth: 1}}
          mainStyle={{marginTop: 10}}
          labelStyle={{
            marginBottom: moderateScale(7),
            fontFamily: fontFamily.regular,
          }}
        />
        <BorderTextInputWithLable
          placeholder={'Grocery'}
          label={strings.PRODUCT_CATEGORY}
          textInputStyle={{
            borderWidth: 0.7,
            borderRadius: moderateScale(8),
            fontFamily: fontFamily.regular,
            color: colors.black,
          }}
          //   value={houseNo}
          multiline={false}
          borderWidth={0}
          marginBottomTxt={0}
          containerStyle={{borderBottomWidth: 1}}
          mainStyle={{marginTop: 10}}
          labelStyle={{
            marginBottom: moderateScale(7),
            fontFamily: fontFamily.regular,
          }}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <BorderTextInputWithLable
            placeholder={'23'}
            label={strings.MRP}
            textInputStyle={{
              borderWidth: 0.7,
              borderRadius: moderateScale(8),
              fontFamily: fontFamily.regular,
              color: colors.black,
            }}
            //   value={houseNo}
            multiline={false}
            borderWidth={0}
            marginBottomTxt={0}
            containerStyle={{borderBottomWidth: 1}}
            mainStyle={{marginTop: 10, width: '45%'}}
            labelStyle={{
              marginBottom: moderateScale(7),
              fontFamily: fontFamily.regular,
            }}
          />
          <BorderTextInputWithLable
            placeholder={'21'}
            label={strings.SALE_PRICE}
            textInputStyle={{
              borderWidth: 0.7,
              borderRadius: moderateScale(8),
              fontFamily: fontFamily.regular,
              color: colors.black,
            }}
            //   value={houseNo}
            multiline={false}
            borderWidth={0}
            marginBottomTxt={0}
            containerStyle={{borderBottomWidth: 1}}
            mainStyle={{marginTop: 10, width: '45%'}}
            labelStyle={{
              marginBottom: moderateScale(7),
              fontFamily: fontFamily.regular,
            }}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <BorderTextInputWithLable
            placeholder={'23'}
            label={strings.PRODUCT_UNIT}
            textInputStyle={{
              borderWidth: 0.7,
              borderRadius: moderateScale(8),
              fontFamily: fontFamily.regular,
              color: colors.black,
            }}
            //   value={houseNo}
            multiline={false}
            borderWidth={0}
            marginBottomTxt={0}
            containerStyle={{borderBottomWidth: 1}}
            mainStyle={{marginTop: 10, width: '45%'}}
            labelStyle={{
              marginBottom: moderateScale(7),
              fontFamily: fontFamily.regular,
            }}
          />
          <BorderTextInputWithLable
            placeholder={'1'}
            label={strings.UNITS_SET}
            textInputStyle={{
              borderWidth: 0.7,
              borderRadius: moderateScale(8),
              fontFamily: fontFamily.regular,
              color: colors.black,
            }}
            //   value={houseNo}
            multiline={false}
            borderWidth={0}
            marginBottomTxt={0}
            containerStyle={{borderBottomWidth: 1}}
            mainStyle={{marginTop: 10, width: '45%'}}
            labelStyle={{
              marginBottom: moderateScale(7),
              fontFamily: fontFamily.regular,
            }}
          />
        </View>
        <BorderTextInputWithLable
          placeholder={'Lorem ipsum'}
          label={strings.PRODUCTS_DETAIL}
          textInputStyle={{
            borderWidth: 0.7,
            borderRadius: moderateScale(8),
            fontFamily: fontFamily.regular,
            color: colors.black,
          }}
          //   value={houseNo}
          multiline={false}
          borderWidth={0}
          marginBottomTxt={0}
          containerStyle={{borderBottomWidth: 1}}
          mainStyle={{marginTop: 10}}
          labelStyle={{
            marginBottom: moderateScale(7),
            fontFamily: fontFamily.regular,
          }}
        />

        <GradientButton
          colorsArray={[colors.seaGreen, colors.seaGreen]}
          textStyle={{
            fontFamily: fontFamily.medium,
          }}
          marginTop={moderateScaleVertical(10)}
          btnText={strings.ADD}
          containerStyle={{
            borderRadius: moderateScale(5),
            marginTop: 'auto',
            marginBottom: moderateScale(10),
          }}
        />
      </View>
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({});
