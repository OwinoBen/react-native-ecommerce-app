import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import colors from '../styles/colors';
import { moderateScale, width } from '../styles/responsiveSize';
import { appIds } from '../utils/constants/DynamicAppKeys';
import { getImageUrl } from '../utils/helperFunctions';

const BannerHome2 = ({
  imagestyle = {},
  bannerData = [],
  bannerRef,
  sliderWidth = width - 20,
  itemWidth = width - 20,
  resizeMode = 'cover',
  setActiveState = () => { },
  onPress = () => { },
  childView = null,
  carouselViewStyle = {},
  isDarkMode = false,
  isPagination = false,
  paginationColor = { backgroundColor: colors.themeColor },
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const pagination = () => {
    // const { entries, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={bannerData.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          justifyContent: 'flex-start',
          paddingVertical: moderateScale(15),
          paddingHorizontal: moderateScale(20),
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          // marginHorizontal: 8,
          ...paginationColor,
        }}
        inactiveDotStyle={{
          backgroundColor: '#D8D8D8',
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.6}
        inactiveDotScale={0.8}
      />
    );
  };

  const setSnapState = (index) => {
    setActiveState(index);
    setActiveSlide(index);
  };

  const bannerDataImages = ({ item, index }) => {

    const imageUrl = item?.image?.path
      ? getImageUrl(
        item.image.path.image_fit,
        item.image.path.image_path,
        '900/700',
      )
      : item?.image?.image_fit ? getImageUrl(item.image.image_fit, item.image.image_path, '900/700') : item?.banner_image_url;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.imageStyle, imagestyle]}
        onPress={() => onPress(item)}>
        <FastImage
          source={{ uri: imageUrl }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: isDarkMode
              ? colors.whiteOpacity15
              : colors.greyColor,
          }}>
          {childView}
        </FastImage>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View
        style={{
          height: width * 0.4,
          borderRadius: moderateScale(25),
          ...carouselViewStyle,
        }}>
        <Carousel
          ref={bannerRef}
          data={bannerData}
          scrollEnabled={true}
          renderItem={bannerDataImages}
          autoplay={true}
          loop={true}
          autoplayInterval={2000}
          enableMomentum={true}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          onSnapToItem={(index) => setSnapState(index)}
        />
      </View>
      <View style={{ alignSelf: 'center' }}>{isPagination && pagination()}</View>
    </>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: moderateScale(15),
    overflow: 'hidden',
  },
});

export default React.memo(BannerHome2);
