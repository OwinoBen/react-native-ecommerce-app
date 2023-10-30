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

const ImgCardSmall = ({
  rectImage,
  text,
  onPress = () => {},
  containerStyle = {},
  imageStyle = {},
}) => {
  const {themeColors, appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const scaleInAnimated = new Animated.Value(0);
  const viewRef = useRef();
  const styles = stylesData({fontFamily});
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}
      style={[
        styles.imgContainer,
        containerStyle,
        getScaleTransformationStyle(scaleInAnimated),
      ]}>
      <Animated.View>
        <FastImage
          source={{uri: rectImage, priority: FastImage.priority.high}}
          style={[styles.imgSmall, imageStyle]}
        />
        <View style={styles.imgOverlay} />
        <View ref={viewRef} style={styles.blurContainer}>
          <BlurView
            style={styles.absolute}
            viewRef={viewRef}
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
    imgSmall: {height: width * 0.32, width: width * 0.47, borderRadius: 4},
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
      left: moderateScale(24),
      bottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      right: moderateScale(24),
      // backgroundColor: 'rgba(255,255,255,.35)',
      borderRadius: moderateScaleVertical(15),
      height: moderateScaleVertical(30),
      overflow: 'hidden',
    },
    txt: {
      color: colors.white,
      fontFamily: fontFamily?.bold,
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
  });
  return styles;
}

const styles = StyleSheet.create({});
export default React.memo(ImgCardSmall);
