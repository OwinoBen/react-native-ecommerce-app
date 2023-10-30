import React, {useState} from 'react';
import {ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';
import CardView from 'react-native-cardview';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import {moderateScale, width} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';

const BannerHome = ({
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
}) => {
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    showLightboxView: false,
  });
  const {slider1ActiveSlide, showLightboxView} = state;
  const setSnapState = (index) => {
    setState({slider1ActiveSlide: index});
    setActiveState(index);
  };

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const renderCarousel = (image) => (
    <FastImage
      style={{flex: 1}}
      resizeMode="contain"
      source={{uri: image, priority: FastImage.priority.high}}
    />
  );
  const _onPress = () => {
    updateState({showLightboxView: true});
  };
  const bannerDataImages = ({item, index}) => {
    const imageUrl = item?.image?.path
      ? getImageUrl(
          item?.image?.path?.proxy_url,
          item?.image?.path?.image_path,
          '2000/600',
        )
      : getImageUrl(
          item?.image?.proxy_url,
          item?.image?.image_path,
          '2000/600',
        );

    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.imageStyle, imagestyle]}
          onPress={() => onPress(item)}>
          {/* <Lightbox
            underlayColor={'black'}
            renderContent={() => renderCarousel(imageUrl)}> */}
          <ImageBackground
            source={{uri: imageUrl}}
            style={{height: width * 0.4, width: width, ...imagestyle}}
            resizeMode={'contain'}>
            {childView}
          </ImageBackground>
          {/* </Lightbox> */}

          {/* {pagination && (
            <View style={{justifyContent: 'flex-end', height: 200}}>
              <Pagination
                dotsLength={bannerData.length}
                activeDotIndex={slider1ActiveSlide}
                containerStyle={{paddingTop: 5}}
                dotColor={'grey'}
                dotStyle={[styles.dotStyle, dotStyle]}
                inactiveDotColor={'black'}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.8}
              />
            </View>
          )} */}
        </TouchableOpacity>
      </>
    );
  };
  return (
    <CardView style={[styles.cardViewStyle, cardViewStyle]}>
      <Carousel
        ref={bannerRef}
        data={bannerData && bannerData?.length ? bannerData : []}
        renderItem={bannerDataImages}
        autoplay={true}
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
    // height: width * 0.4,
    // width: width - 20,
  },
  dotStyle: {height: 12, width: 12, borderRadius: 12 / 2},
  cardViewStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    height: width * 0.4,
    width: width - 20,
    marginHorizontal: moderateScale(10),
    overflow: 'visible',

    // marginRight: 20
  },
});

export default React.memo(BannerHome);
