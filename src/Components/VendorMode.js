//import liraries
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize';
import colors from '../styles/colors';
import FastImage from 'react-native-fast-image';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import { MyDarkTheme } from '../styles/theme';
import { getImageUrl } from '../utils/helperFunctions';

// create a component
const VendorMode = ({
    onPressMode = () => {},
    item = {}
}) => {
    const { appData, themeColors, appStyle,currencies,languages, themeColor, themeToggle } = useSelector((state) => state?.initBoot || {});
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const fontFamily = appStyle?.fontSizeData;

    const imageURI =
      typeof (item?.icon) == 'string' ? item.icon :
        getImageUrl(
          item?.icon?.image_fit,
          item?.icon?.image_path,
          '200/200',
        );

    return (
        <View style={{ width: width / 4.2 }}>
            <TouchableOpacity
                onPress={() => onPressMode(item)}
                activeOpacity={0.9}
                style={{
                    // width: (width - moderateScale(16)) / 4,
                    marginVertical: moderateScale(0),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        flex: 0.8,
                        borderRadius: moderateScale(8),
                        width: moderateScale(80),
                        height: moderateScale(80),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: colors.textGreyLight,
                        borderWidth: 0.5,
                    }}>
                    <FastImage
                        style={{
                            height: moderateScale(40),
                            width: moderateScale(40),
                            borderRadius: moderateScale(20),
                        }}
                        source={{
                            uri: imageURI,
                            cache: FastImage.cacheControl.immutable,
                            priority: FastImage.priority.high,
                        }}
                        resizeMode="contain"

                    />
                </View>
                <View style={{ flex: 0.2 }}>
                    <Text
                        // numberOfLines={1}
                        style={{
                            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity70,
                            fontFamily: fontFamily.regular,
                            fontSize: textScale(11),
                            textAlign: 'center',
                            marginTop: moderateScaleVertical(4),
                            width: moderateScale(80),
                        }}>
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default React.memo(VendorMode);
