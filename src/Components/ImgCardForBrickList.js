import {BlurView} from '@react-native-community/blur';
import React, {useRef} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-elements';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../styles/responsiveSize';
import {
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';

const ImgCardForBrickList = ({
  data,
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
        {/* <Text>jgfjgjfggj</Text> */}
        {/* <View>
        <Image
          PlaceholderContent={
            <Image
              source={{
                uri: getImageUrl(
                  data.image.proxy_url,
                  data.image.image_path,
                  '60/28',
                ),
              }}
              style={[styles.imgLarge, imageStyle]}
            />
          }
          source={{
            uri: getImageUrl(
              data.image.proxy_url,
              data.image.image_path,
              '600/280',
            ),
          }}
          style={[styles.imgLarge, imageStyle]}
        />
        </View> */}
      <Animated.View>
       

        <Image
          PlaceholderContent={
            <Image
              source={{
                uri: getImageUrl(
                  data.image.proxy_url,
                  data.image.image_path,
                  '60/28',
                ),
              }}
              style={[styles.imgLarge, imageStyle]}
            />
          }
          source={{
            uri: getImageUrl(
              data.image.proxy_url,
              data.image.image_path,
              '600/280',
            ),
          }}
          style={[styles.imgLarge, imageStyle]}
        />
        <View style={styles.imgOverlay} />
        <View
          ref={viewRef2}
          style={[styles.blurContainer, {alignSelf: 'center'}]}>
          
          {/* <BlurView
            style={styles.absolute}
            viewRef={viewRef2}
            blurType="light"
            blurAmount={20}
            blurRadius={20}
          /> */}
          <Text style={styles.txt}>{text}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export function stylesData({fontFamily}) {
  const styles = StyleSheet.create({
    imgLarge: {
      height: '100%',
      width: '100%',
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
      bottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,.35)',
      borderRadius: moderateScaleVertical(15),
      height: moderateScaleVertical(40),
      width: moderateScale(130),
      overflow: 'hidden',

    },
    txt: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      opacity: 0.9,
      alignSelf:'center',
      textAlign:'center'
     
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
      marginVertical: moderateScaleVertical(4),
      marginHorizontal: moderateScale(4),
      borderRadius: 10,
      flex: 1,
    },
  });
  return styles;
}
export default React.memo(ImgCardForBrickList);
