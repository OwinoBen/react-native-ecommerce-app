import { BlurView } from '@react-native-community/blur';
import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {
  getImageUrl,
  getScaleTransformationStyle,
  otpTimerCounter,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';
import IconTextRow from './IconTextRow';
import { useDarkMode } from 'react-native-dynamic';
import strings from '../constants/lang';
import { string } from 'prop-types';
import MarketCard3 from './MarketCard3';
const MarketCard = ({ data = {}, onPress = () => { }, activeOpacity = 1 }) => {
  const { appStyle ,appData} = useSelector((state) => state?.initBoot);
  
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  // const appTheme=useSelector(state=>state.colors.appTheme)
  const navigation = useNavigation();
  const scaleInAnimated = new Animated.Value(0);
  // const openDetails = () => {
  //   navigation.navigate(navigationStrings.SUPERMARKET_PRODUCTS_CATEGORY, {data});
  // };
  const viewRef = useRef();
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily });
  const commonStyles = commonStylesFunc({ fontFamily });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}
      style={getScaleTransformationStyle(scaleInAnimated)}>
      <Animated.View>
        <ImageBackground
          source={{
            uri: getImageUrl(
              data?.banner?.proxy_url,
              data?.banner?.image_path,
              '800/400',
            ),
          }}
          style={{
            marginHorizontal: moderateScale(16),
            height: moderateScaleVertical(170),
            width: width - moderateScale(32),
            borderRadius: 4,
            backgroundColor: isDarkMode ? colors.white : null,
          }}
          imageStyle={{ borderRadius: 4 }}>
          <LinearGradient
            style={{ flex: 1, borderRadius: 4, justifyContent: 'space-between' }}
            colors={[
              colors.blackOpacity10,
              colors.blackOpacity43,
              colors.blackOpacity86,
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: moderateScale(10),
              }}>
              <View
                ref={viewRef}
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  overflow: 'hidden',
                  marginTop: 10,
                  // marginLeft: 10,
                  borderRadius: moderateScale(5),
                  height: moderateScale(54),
                  maxWidth: width - width / 3,
                  padding: 10,
                  borderColor: colors.white,
                  borderWidth: 1,
                }}>
                {/* <BlurView
                  style={styles.absolute}
                  viewRef={viewRef}
                  blurType="dark"
                  blurAmount={2}
                  blurRadius={2}
                /> */}

                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: textScale(14),
                    color: colors.white,
                    textAlign: 'center',
                    fontFamily: fontFamily.medium,
                  }}>
                  {data.name}
                  {/* {'DeliveryZOne DeliveryZOne DeliveryZOne'} */}
                </Text>
              </View>
              <TouchableOpacity
                disabled={otpTimerCounter}
                style={{
                  height: moderateScaleVertical(30),
                  width: moderateScale(65),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.white,
                  flexDirection: 'row',
                  // paddingHorizontal: 10,
                  marginTop: 10,
                  borderRadius: 20,
                }}>
                <View
                  style={{
                    height: 7,
                    width: 7,
                    borderRadius: 10,
                    backgroundColor: data?.show_slot
                      ? colors.green
                      : data?.slot && data?.slot.length
                        ? colors.green
                        : colors.redB,
                    marginRight: moderateScale(5),
                  }}
                />
                <Text
                  style={{
                    ...commonStyles.mediumFont14Normal,
                    fontSize: textScale(12),
                    color: data?.show_slot
                      ? colors.green
                      : data?.slot && data?.slot.length
                        ? colors.green
                        : colors.redB,
                  }}>
                  {data?.show_slot
                    ? strings.OPEN
                    : data?.slot && data?.slot.length
                      ? strings.OPEN
                      : strings.CLOSE}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginHorizontal: moderateScale(10),
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <View style={{ flexDirection: 'row' }}>
                {/* <IconTextRow
                  containerStyle={{marginRight: 10}}
                  icon={imagePath.time}
                  text={'30 minutes'}
                />
                <IconTextRow
                  containerStyle={{marginRight: 10}}
                  icon={imagePath.locationGreen}
                  text={'1.7km'}
                /> */}
              </View>
              {!!appData?.profile?.preferences?.rating_check && !!data?.product_avg_average_rating && (
                <View>
                  <TouchableOpacity
                    style={{
                      height: moderateScaleVertical(30),
                      width: moderateScale(59),
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.orange,
                      flexDirection: 'row',
                      // paddingHorizontal: 10,
                      marginBottom: 3,
                      borderRadius: 20,
                    }}>
                    <Image source={imagePath.starWhite} />
                    <Text
                      style={{
                        ...commonStyles.mediumFont14Normal,
                        fontSize: textScale(12),
                        marginLeft: moderateScale(5),
                        color: colors.white,
                      }}>
                      {Number(data?.product_avg_average_rating).toFixed(1)}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>
    </TouchableOpacity>
  );
};

export function stylesFunc({ fontFamily }) {
  const styles = StyleSheet.create({
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

    absolute: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      // height: moderateScaleVertical(54),
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      // borderRadius: moderateScaleVertical(5),
    },
  });
  return styles;
}
export default React.memo(MarketCard);
