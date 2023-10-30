//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {PulseIndicator} from 'react-native-indicators';
import {Marker} from 'react-native-maps';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import {moderateScale, textScale} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
// create a component
const CustomCallouts = ({data}) => {
  console.log('custom callouts', data);
  const {themeToggle, appStyle, themeColor} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  return (
    <>
      {data.map((val, index) => {
        if (index == 0) {
          //pickup location
          return (
            <Marker
              tracksViewChanges={false}
              key={`coordinate_${index}`}
              // calloutOffset={{ x: 0, y: 18 }}
              // calloutAnchor={{ x: 0, y: 10 }}
              image={imagePath.radioLocation}
              coordinate={{
                latitude: Number(val?.latitude),
                longitude: Number(val?.longitude),
              }}>
              <View
                style={{
                  ...styles.plainView,
                  backgroundColor: colors.white,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#6B8E23',

                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: moderateScale(4),
                    }}>
                    <Text
                      style={{
                        ...styles.pickupDropOff,
                        color: colors.white,
                        fontFamily: fontFamily.medium,
                        textTransform: 'capitalize',
                      }}>
                      {strings.PICKUP}
                    </Text>
                    {/* <PulseIndicator
                      size={12}
                      color="white"
                      style={{
                        height: moderateScale(8),
                        width: moderateScale(8),
                        borderRadius: moderateScale(4),
                      }}
                    /> */}
                  </View>
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: moderateScale(8),
                      paddingVertical: moderateScale(10),
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        ...styles.pickupDropOff,
                        color: colors.black,
                        alignItems: 'center',
                        maxWidth: moderateScale(180),
                        fontFamily: fontFamily.medium,
                      }}>
                      {val?.pre_address || val?.address}
                    </Text>
                    <Image
                      style={{
                        marginLeft: moderateScale(4),
                        height: moderateScale(12),
                        width: moderateScale(12),
                      }}
                      resizeMode="contain"
                      source={imagePath.icGo}
                    />
                  </View> */}
                </View>
              </View>
            </Marker>
          );
        }
        if (data.length - 1 == index) {
          //last drop location
          return (
            <Marker
              tracksViewChanges={false}
              key={`coordinate_${index}`}
              // calloutOffset={{ x: 0, y: 18 }}
              // calloutAnchor={{ x: 0, y: 10 }}
              image={imagePath.radioLocation}
              coordinate={{
                latitude: Number(val?.latitude),
                longitude: Number(val?.longitude),
              }}>
              <View
                style={{
                  ...styles.plainView,
                  backgroundColor: colors.white,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#DC143C',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: moderateScale(4),
                    }}>
                    {index == 0 ? (
                      <Text
                        style={{
                          ...styles.pickupDropOff,
                          color: colors.white,
                          fontFamily: fontFamily.medium,
                          textTransform: 'capitalize',
                        }}>
                        {strings.PICKUP}
                      </Text>
                    ) : (
                      // <PulseIndicator
                      //   size={12}
                      //   color="white"
                      //   style={{
                      //     height: moderateScale(8),
                      //     width: moderateScale(8),
                      //     borderRadius: moderateScale(4),
                      //   }}
                      // />
                      <Text
                        style={{
                          ...styles.pickupDropOff,
                          color: colors.white,
                          fontFamily: fontFamily.medium,
                          textTransform: 'capitalize',
                        }}>
                        {strings.DROP}
                      </Text>
                    )}
                  </View>
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: moderateScale(8),
                      paddingVertical: moderateScale(10),
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        ...styles.pickupDropOff,
                        fontFamily: fontFamily.medium,
                        color: colors.black,
                        alignItems: 'center',
                        maxWidth: moderateScale(180),
                      }}>
                      {val?.pre_address || val?.address}
                    </Text>
                    <Image
                      style={{
                        marginLeft: moderateScale(4),
                        height: moderateScale(12),
                        width: moderateScale(12),
                      }}
                      resizeMode="contain"
                      source={imagePath.icGo}
                    />
                  </View> */}
                </View>
              </View>
            </Marker>
          );
        }
        return (
          <Marker
            tracksViewChanges={false}
            key={`coordinate_${index}`}
            coordinate={{
              latitude: Number(val?.latitude),
              longitude: Number(val?.longitude),
            }}>
            <Image
              style={{
                tintColor: '#DC143C',
              }}
              source={imagePath.radioLocation}
            />
          </Marker>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  plainView: {
    alignItems: 'center',
    justifyContent: 'center',
    // left: 20,
    borderRadius: moderateScale(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pickupDropOff: {
    textAlign: 'center',
    alignItems: 'center',
    fontSize: textScale(9),
  },
});

//make this component available to the app
export default React.memo(CustomCallouts);
