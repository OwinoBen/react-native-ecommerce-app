import {BlurView} from '@react-native-community/blur';
import React, {useRef} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../styles/responsiveSize';
import {
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';

const ImgCardLarge = ({
  rectImage,
  text,
  onPress = () => {},
  containerStyle = {},
  imageStyle = {},
}) => {
  const {appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const scaleInAnimated = new Animated.Value(0);
  const viewRef2 = useRef();
  const styles = stylesData({fontFamily});

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}
      style={[
        styles.rectangleBox,
        containerStyle,
        {...getScaleTransformationStyle(scaleInAnimated)},
      ]}>
      <Animated.View>
        <FastImage
          source={{uri: rectImage, priority: FastImage.priority.high}}
          style={[styles.imgLarge, imageStyle]}
        />
        <View style={styles.imgOverlay} />
        <View
          ref={viewRef2}
          style={[styles.blurContainer, {alignSelf: 'center'}]}>
          <BlurView
            style={styles.absolute}
            viewRef={viewRef2}
            blurType="light"
            blurAmount={20}
            blurRadius={20}
          />
          <Text style={styles.txt}>{text}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export function stylesData({fontFamily}) {
  const styles = StyleSheet.create({
    imgLarge: {
      height: width * 0.32,
      width: width * 0.96,
      borderRadius: 4,
    },
    imgContainer: {
      height: width * 0.32,
      width: width * 0.47,
      borderRadius: 4,
      marginBottom: moderateScale(8),
    },
    imgOverlay: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 4,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    blurContainer: {
      position: 'absolute',
      left: moderateScale(115),
      bottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      right: moderateScale(115),
      // backgroundColor: 'rgba(255,255,255,.35)',
      borderRadius: moderateScaleVertical(15),
      height: moderateScaleVertical(30),
      overflow: 'hidden',
    },
    txt: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      opacity: 0.9,
    },
    absolute: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      height: moderateScaleVertical(30),
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: moderateScaleVertical(15),
    },
    rectangleBox: {
      height: width * 0.32,
      width: width * 0.96,
      // height: moderateScaleVertical(128),
      marginHorizontal: moderateScale(8),
      // width: width - moderateScale(16),
      borderRadius: 4,
    },
  });
  return styles;
}
export default React.memo(ImgCardLarge);
