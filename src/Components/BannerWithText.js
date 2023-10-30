import React, {useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CardView from 'react-native-cardview';
import {colors} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {UIActivityIndicator} from 'react-native-indicators';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useSelector} from 'react-redux';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';

const BannerWithText = ({
  imagestyle = {},
  // slider1ActiveSlide = 0,
  bannerData = [],
  dotStyle = {},
  bannerRef,
  cardViewStyle = {},
  sliderWidth = width - 20,
  itemWidth = width - 20,
  onSnapToItem,
  pagination = true,
  resizeMode = 'cover',
  setActiveState = () => {},
  onPress = () => {},
  childView = null,
  showLightbox = false,
  tagline = '',
}) => {
  const {themeColors, appStyle} = useSelector((state) => state?.initBoot);

  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    showLightboxView: false,
    imageLoader: true,
  });
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {slider1ActiveSlide, showLightboxView} = state;
  const setSnapState = (index) => {
    updateState({slider1ActiveSlide: index});
    setActiveState(index);
  };
  const fontFamily = appStyle?.fontSizeData;
  const bannerDataImages = ({item, index}) => {
    const imageUrl = item?.image?.path
      ? getImageUrl(
          item.image_mobile.path.image_fit,
          item.image.path.image_path,
          '1000/1000',
        )
      : getImageUrl(item.image.image_fit, item.image.image_path, '1000/1000');

    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.imageStyle, imagestyle]}
          onPress={() => onPress(item)}>
          {/* <Lightbox
            underlayColor={'black'}
            renderContent={() => renderCarousel(imageUrl)}> */}

          <FastImage
            source={{uri: imageUrl, priority: FastImage.priority.high}}
            //  onLoadStart={()=>}
            onLoadEnd={() => updateState({imageLoader: false})}
            style={{
              height: width * 0.5,
              width: width - 20,
              borderRadius: 12,
              ...imagestyle,
            }}
            resizeMode={resizeMode}>
            {!!state.imageLoader && (
              <UIActivityIndicator
                color={themeColors.primary_color}
                size={40}
              />
            )}
            {childView}
          </FastImage>

          {/* </Lightbox> */}
          <View
            style={{
              flex: 0.2,
              paddingHorizontal: moderateScale(10),
            }}>
            <Text
              style={{
                fontSize: textScale(24),
                fontFamily: fontFamily.bold,
                marginTop: moderateScaleVertical(50),
                color: colors.black,
              }}>
              {'News & Entertainment'}
            </Text>
            <Text
              style={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
                marginVertical: moderateScaleVertical(20),
                color: colors.black,
                opacity: 0.65,
              }}>
              {tagline}
            </Text>
          </View>

          {pagination && (
            <View style={{justifyContent: 'flex-end'}}>
              <Pagination
                dotsLength={bannerData.length}
                activeDotIndex={slider1ActiveSlide}
                containerStyle={{paddingTop: 5}}
                dotColor={themeColors?.primary_color}
                dotStyle={[styles.dotStyle, dotStyle]}
                inactiveDotColor={'grey'}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.8}
              />
            </View>
          )}
        </TouchableOpacity>
      </>
    );
  };
  return (
    <CardView style={[styles.cardViewStyle, cardViewStyle]}>
      <Carousel
        ref={bannerRef}
        data={bannerData}
        renderItem={bannerDataImages}
        autoplay={false}
        loop={true}
        autoplayInterval={3000}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        onSnapToItem={(index) => setSnapState(index)}
      />
    </CardView>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  dotStyle: {height: 6, width: 6, borderRadius: 12 / 2},
  cardViewStyle: {
    alignItems: 'center',
    height: height / 0.6,
    width: width - 20,
    marginHorizontal: moderateScale(10),
    overflow: 'visible',
    paddingTop: moderateScaleVertical(40),
  },
});

export default React.memo(BannerWithText);
