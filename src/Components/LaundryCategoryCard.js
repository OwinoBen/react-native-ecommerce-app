import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import {SvgUri} from 'react-native-svg';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {getImageUrl} from '../utils/helperFunctions';
import ButtonWithLoader from './ButtonWithLoader';

const LaundryCategoryCard = ({
  data = {},
  onPress = () => {},
  isLoading = false,
}) => {
  const {appStyle, themeToggle, themeColor, themeColors} = useSelector(
    (state) => state?.initBoot,
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors, isDarkMode});

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '160/160',
  );
  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  return (
    <View style={styles.container}>
      <View style={styles.imgViewStyle}>
        {isSVG ? (
          <SvgUri
            height={moderateScale(50)}
            width={moderateScale(50)}
            uri={imageURI}
            style={{}}
          />
        ) : (
          <View>
            <FastImage
              style={styles.roundImgStyle}
              source={{
                uri: imageURI,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              resizeMode="cover"
              // onLoad={onLoad}
            />
          </View>
        )}

        <Text style={styles.categoryTitle}>{data.name}</Text>
      </View>
      <ButtonWithLoader
        onPress={onPress}
        btnText="+ Add"
        btnTextStyle={{
          color: themeColors.primary_color,
        }}
        color={themeColors.primary_color}
        isLoading={isLoading}
        btnStyle={styles.addBtnStyle}
      />
    </View>
  );
};

export function stylesFunc({fontFamily, themeColors, isDarkMode}) {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      borderRadius: moderateScale(10),
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(20),
      backgroundColor: colors.white,
    },
    addBtnStyle: {
      width: moderateScale(90),
      marginTop: 0,
      height: moderateScaleVertical(35),
      borderRadius: moderateScale(5),
      borderColor: themeColors.primary_color,
    },
    imgViewStyle: {
      borderRadius: moderateScale(40),
      height: moderateScale(75),
      alignItems: 'center',
      flexDirection: 'row',
    },
    roundImgStyle: {
      height: moderateScale(50),
      width: moderateScale(50),
      borderRadius: moderateScale(25),
    },
    categoryTitle: {
      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      marginLeft: moderateScale(20),
    },
  });
  return styles;
}

export default React.memo(LaundryCategoryCard);
