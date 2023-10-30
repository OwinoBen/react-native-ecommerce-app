import React, { useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
  View,
} from 'react-native';
import CardView from 'react-native-cardview';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../styles/responsiveSize';
import { getImageUrl } from '../utils/helperFunctions';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { appIds } from '../utils/constants/DynamicAppKeys';

const TaxiBannerHome = ({
  imagestyle = {},
  // slider1ActiveSlide = 0,
  bannerData = [],
  dotStyle = {},
  bannerRef,
  cardViewStyle = {},
  sliderWidth = width,
  itemWidth = width,
  onSnapToItem,
  pagination = true,
  resizeMode = 'cover',
  setActiveState = () => { },
  onPress = () => { },
  childView = null,
  showLightbox = false,
  appStyle = {},
}) => {
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    showLightboxView: false,
  });
  const { slider1ActiveSlide, showLightboxView } = state;
  const setSnapState = (index) => {
    setState({ slider1ActiveSlide: index });
    setActiveState(index);
  };

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const renderCarousel = (image) => (
    <FastImage
      style={{ flex: 1 }}
      resizeMode="stretch"
      source={{ uri: image, priority: FastImage.priority.high }}
    />
  );
  const _onPress = () => {
    updateState({ showLightboxView: true });
  };
  const bannerImage = ({ item, index }) => {
    const imageUrl = item?.image?.path
      ? getImageUrl(
        item?.image?.path.image_fit,
        item?.image.path.image_path,
        '2000/600',
      )
      : getImageUrl(
        item?.image?.image_fit,
        item?.image?.image_path,
        '2000/600',
      );
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => onPress(item)}>
        <FastImage
          source={{
            uri: imageUrl,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={{
            height:
              appStyle?.homePageLayout == 5
                ? moderateScale(140)
                : DeviceInfo.getBundleId() == appIds.masa
                  ? moderateScale(260)
                  : height / 3.8,
            width:
              appStyle?.homePageLayout == 5
                ? width / 1.2
                : DeviceInfo.getBundleId() == appIds.masa
                  ? width / 1.1
                  : moderateScale(160),
            borderRadius: moderateScale(16),
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };
  const bannerDataImages = ({ item, index }) => {
    const imageUrl = item?.image?.path
      ? getImageUrl(
        item?.image?.path.image_fit,
        item?.image.path.image_path,
        '2000/600',
      )
      : getImageUrl(
        item?.image?.image_fit,
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
            source={{ uri: imageUrl }}
            style={{
              height: width * 0.45,
              width: width,

              ...imagestyle,
            }}
            resizeMode={'cover'}>
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
    <>
      {appStyle.homePageLayout == 3 ? (
        <View style={{ marginTop: moderateScaleVertical(4) }}>
          <FlatList
            ref={bannerRef}
            data={bannerData}
            renderItem={bannerImage}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            ItemSeparatorComponent={() => (
              <View style={{ marginRight: moderateScale(12) }} />
            )}
            ListHeaderComponent={() => (
              <View style={{ marginLeft: moderateScale(16) }} />
            )}
            ListFooterComponent={() => (
              <View style={{ marginRight: moderateScale(16) }} />
            )}
          />
        </View>
      ) : (
        <CardView style={[styles.cardViewStyle, cardViewStyle]}>
          <Carousel

            layout={'default'}
            ref={bannerRef}
            data={bannerData}
            renderItem={bannerDataImages}
            autoplay={true}
            loop={true}
            autoplayInterval={3000}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            onSnapToItem={(index) => setSnapState(index)}
          />
        </CardView>
      )}
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
    // height: width * 0.4,
    // width: width - 20,
  },
  dotStyle: { height: 12, width: 12, borderRadius: 12 / 2 },
  cardViewStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    height: width * 0.45,
    width: width,
    // marginHorizontal: moderateScale(10),
    overflow: 'visible',
    borderRadius: 12 / 2,


    // marginRight: 20
  },
});

export default React.memo(TaxiBannerHome);
