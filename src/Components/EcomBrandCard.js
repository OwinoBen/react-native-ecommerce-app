import { useNavigation } from '@react-navigation/native';
import React,{useEffect} from 'react';
import  {StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {
    moderateScale,
    moderateScaleVertical,
    textScale,
    width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getImageUrl, } from '../utils/helperFunctions';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const EcomBrandCard = ({
    data = {},
    onPress = () => { },
    applyRadius = false,
    imageHeight = 80,
    imageWidth = 80,
    selectedItem = null,
    curIndex = 0
}) => {
    const navigation = useNavigation();
    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
    // const theme = useSelector((state) => state?.initBoot?.themeColor);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

    const scaleInAnimated = new Animated.Value(0);
    const { appStyle, themeColors } = useSelector((state) => state.initBoot);
    const fontFamily = appStyle?.fontSizeData;
    const commonStyles = commonStylesFun({ fontFamily });


    let imgHeight =imageHeight
    let imgWidth = imageWidth

    const imageURI = data?.icon
        ? getImageUrl(data.icon.image_fit, data.icon.image_path, `${imgHeight + 140}/${imgWidth + 140}`)
        : getImageUrl(data.image.image_fit, data.image.image_path, `${imgHeight + 140}/${imgWidth + 140}`);

    const isSVG = imageURI ? imageURI.includes('.svg') : null;



    const animation = useSharedValue(0)
  

    useEffect(() => {
        if (selectedItem?.id == data.id) {
            animation.value = withTiming(1);
            return;
        }
        animation.value = withTiming(0);
    }, [selectedItem]);

    const viewStyle = useAnimatedStyle(() => {
        const marginTop = interpolate(
            animation?.value,
            [0, 1, 0],
            [0, 10, 0],
            Extrapolate.CLAMP,
        );
        return {
            marginTop,
        }
    })


    return (

        <Animated.View style={[
            viewStyle,
            { 
            width: (width / 3.2), 
            alignItems: 'center', 
            marginBottom: moderateScaleVertical(8),
            borderRadius: (width / 3.2)/2
         }
        ]}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                style={{ alignContent: 'center' }}
            >
                {isSVG ? (
                    <SvgUri
                        height={imgHeight}
                        width={imgWidth}
                        uri={imageURI}
                    />
                ) : (
                    <FastImage
                        source={{
                            uri: imageURI,
                            priority: FastImage.priority.high,
                            cache: FastImage.cacheControl.immutable,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        style={{
                            height: 100,
                            width: 100,
                            borderRadius: 100 / 2,
                            borderWidth: selectedItem?.id == data?.id ? 3 : 1,
                            borderColor: selectedItem?.id == data?.id ? themeColors.primary_color : colors.grayOpacity51
                        }}
                    />
                )}
            </TouchableOpacity>
            <View style={{ paddingHorizontal: moderateScale(4) }} >
                <Text

                    style={{
                        color: colors?.black,
                        fontFamily: selectedItem?.id == data?.id ? fontFamily.bold : fontFamily.regular,
                        fontSize: textScale(14),
                        marginTop: moderateScaleVertical(8),
                        marginRight: moderateScale(2)
                    }}>
                    {data?.name || (data?.translation && data?.translation[0]?.title) || ''}
                </Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    imgContainer: {
        // flex: 1,
        marginHorizontal: moderateScale(8),
        width: width / 3 - moderateScale(16),
    },
    imgStyle: {
        height: moderateScale(80),
        width: '100%',
        borderRadius: moderateScale(10),
    },
});
export default React.memo(EcomBrandCard);
