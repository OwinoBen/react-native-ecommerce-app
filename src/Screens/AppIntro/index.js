import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import strings from '../../constants/lang';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {getCurrentLocation, getImageUrl} from '../../utils/helperFunctions';
import {chekLocationPermission} from '../../utils/permissions';
import {setItem} from '../../utils/utils';

const AppIntro = ({route, navigation}) => {
  const {appData, themeColors, currencies, languages, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const [state, setState] = useState({
    slides: [],
  });
  const {slides} = state;
  const updateState = (data) => setState((state) => ({...state, ...data}));

  useEffect(() => {
    getCurrLocation();
    const temp = appData?.dynamic_tutorial.map((el, index) => {
      return {
        key: index + 1,
        title: '',
        text: '',
        image: `${el.file_name.image_fit}800/1600${el.file_name.image_path}`,
        backgroundColor: '#22bcb5',
      };
    });

    updateState({slides: temp});
    setItem('firstTime', true);
  }, []);

  const _renderItem = ({item, index}) => {
    console.log(index,"itemitem",item)
    return (
      <View 
      style={[styles.slide, {backgroundColor: 'white'}]}
      key={String(item?.key + index)}
      >
        <FastImage
          source={{
            uri: item.image,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={{
            height: height,
            width: width,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    );
  };

  const _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <GradientButton
          btnText={strings.START}
          btnStyle={{paddingHorizontal: 10}}
          onPress={() => actions.setAppSessionData('guest_login')}
        />
      </View>
    );
  };

  const onSlideChange = (el, i) => {};

  const onScroll = () => {};

  const renderPagination = (index) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        {slides.map((val, i) => {
          return (
            <View
              style={{
                width: moderateScale(10),
                height: moderateScale(10),
                borderRadius: moderateScale(5),
                backgroundColor:
                  index == i
                    ? themeColors.primary_color
                    : colors.blackOpacity30,
                marginBottom: moderateScaleVertical(12),
                marginLeft: moderateScale(4),
              }}
            />
          );
        })}
      </View>
    );
  };

  const getCurrLocation = async () => {
    try {
      let isPermission = await chekLocationPermission(true);
      console.log('is permission', isPermission);
      if (isPermission !== 'goback' && isPermission == 'granted') {
        const res = await getCurrentLocation('home');
        console.log('current location +++++', res);
        if (!!res) {
          homeData(res);
        }
      } else {
        homeData(null);
      }
    } catch (error) {
      console.log('error raised', error);
    }
  };

  const homeData = (location) => {
    let latlongObj = {};

    if (appData?.profile?.preferences?.is_hyperlocal && !!location) {
      latlongObj = {
        address: location?.address,
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
    }
    actions
      .homeData(
        {
          type: 'delivery',
          ...latlongObj,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then(async (res) => {
        console.log('Home data++++++', res);
        preLoadImages(res.data);
      })
      .catch((error) => {
        console.log('error raised', error);
      });
  };

  const preLoadImages = async (data) => {
    if (data.categories.length > 0) {
      let preLoadCategories = data.categories.map((item, inx) => {
        return {
          uri: getImageUrl(
            item?.icon?.image_fit,
            item?.icon?.image_path,
            '160/160',
          ),
        };
      });
      FastImage.preload(preLoadCategories); //preload categories
    }

    if (!!appData?.mobile_banners && appData?.mobile_banners?.length > 0) {
      let preLoadBanner = appData?.mobile_banners.map((item) => {
        return {
          uri: getImageUrl(
            item.image.image_fit,
            item.image.image_path,
            appStyle?.homePageLayout === 5 ? '800/600' : '400/600',
          ),
        };
      });
      FastImage.preload(preLoadBanner); //preload banners
    }

    if (data.vendors.length > 0) {
      let preLoadVendors = data.vendors.map((item, inx) => {
        return {
          uri: getImageUrl(
            item.banner.proxy_url || item.image.proxy_url,
            item.banner.image_path || item.image.image_path,
            '700/300',
          ),
        };
      });
      FastImage.preload(preLoadVendors); //preload vendors
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={{flex: 0.9}}>
        <AppIntroSlider
          data={slides}
          renderDoneButton={() => <View></View>}
          onEndReached={(el) => console.log(el)}
          renderItem={_renderItem}
          activeDotStyle={styles.activeDotStyle}
          onSlideChange={(el, i) => onSlideChange(el, i)}
          onScroll={() => onScroll()}
          renderNextButton={() => <View></View>}
          renderPagination={renderPagination}
          keyExtractor={(item, index)=> String(item?.key || index)}
        />
      </View>
      <View style={{flex: 0.1}}>{_renderDoneButton()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue',
  },
  image: {
    // width: Dimensions.get('screen').width,
    // height: Dimensions.get('screen').height,
    width: '100%',
    height: '100%',
    // marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
  activeDotStyle: {
    backgroundColor: colors.themeColor,
  },
  buttonCircle: {
    marginBottom: moderateScale(8),
    marginHorizontal: moderateScale(25),
  },
});

export default AppIntro;
