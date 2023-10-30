import React, {useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Image, StatusBar} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {useSelector} from 'react-redux';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import colors from '../../styles/colors';
import stylesFun from './styles';
import MapView, {Callout} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import imagePath from '../../constants/imagePath';
import {BlurView} from '@react-native-community/blur';
import {MyDarkTheme} from '../../styles/theme';
import StepIndicators from '../../Components/StepIndicator';
import {ScrollView} from 'react-native';
import StepIndicators1 from '../../Components/StepIndicator1';
import { Platform } from 'react-native';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
export default function StaticTrackOrder({navigation, route}) {
  const [state, setstate] = useState({
    isLoading: false,
    region: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    labels: ['Order accepted', 'Preparing food', 'On the way', 'Delivered'],
    currentPosition: 0,
  });
  const mapRef = useRef();

  const {themeColors, themeToggle, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const darkthemeusingDevice = useDarkMode();

  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColors;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});

  const {isLoading, region, labels, currentPosition} = state;

  const renderDotContainer = () => {
    return (
      <>
        <View style={{marginLeft: moderateScale(7)}}>
          {[1, 2, 3, 4, 5, 6, 7].map((item, index) => {
            return <View style={styles.dots}></View>;
          })}
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: -5}}>
          <Image source={imagePath.icRedOval} />
          <View
            style={{flexDirection: 'column', marginLeft: moderateScale(15)}}>
            <Text
              style={{
                fontFamily: fontFamily.bold,
                fontSize: textScale(12),
              }}>
              Foodie’s Hub
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
              }}>
              Sector 27, Chandigarh
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      <StatusBar translucent backgroundColor={colors.transparent} />
      <View style={styles.container}>
        <MapView
          //   provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={region}
          initialRegion={region}
          //   customMapStyle={mapStyle}
          ref={mapRef}
          // liteMode={true}
          tracksViewChanges={false}
          // onPress={onMapPress}
        >
          {/* <Marker
            coordinate={paramData?.location[0]}
            image={imagePath.radioLocation}>
            <Callout style={styles.plainView}>
              <View>
                <Text style={styles.pickupDropOff}>{'Pick up'}</Text>
                <Text numberOfLines={1} style={styles.pickupDropOffAddress}>{paramData?.tasks[0]?.address}</Text>
              </View>
            </Callout>
          </Marker>
          <Marker
            coordinate={paramData?.location[paramData?.location.length - 1]}
            image={imagePath.radioLocation}>
            <Callout  style={styles.plainView}>
              <View>
              <Text style={styles.pickupDropOff}>{'Drop off'}</Text>
              <Text numberOfLines={1} style={styles.pickupDropOffAddress}>{paramData?.tasks[paramData?.tasks.length-1]?.address}</Text>
              </View>
            </Callout>
          </Marker> */}

          {/* {paramData?.tasks.map((coordinate, index) => (
            <MapView.Marker
              tracksViewChanges={false}
              zIndex={index}
              key={`coordinate_${index}`}
              image={imagePath.radioLocation}
              coordinate={{
                latitude: Number(coordinate?.latitude),
                longitude: Number(coordinate?.longitude),
              }}>
              <Callout style={styles.plainView}>
                <View>
                  <Text style={styles.pickupDropOff}>
                    {index == 0 ? 'Pick up' : 'Drop off'}
                  </Text>
                  <Text numberOfLines={1} style={styles.pickupDropOffAddress}>
                    {coordinate?.address}
                  </Text>
                </View>
              </Callout>
            </MapView.Marker>
          ))} */}

          {/* <MapViewDirections
            origin={paramData?.location[0]}
            waypoints={
              paramData?.location.length > 2
                ? paramData?.location.slice(1, -1)
                : []
            }
            destination={paramData?.location[paramData?.location.length - 1]}
            apikey={profile?.preferences?.map_key}
            strokeWidth={3}
            strokeColor={themeColors.primary_color}
            optimizeWaypoints={true}
            onStart={(params) => {
              // console.log(Started routing between "${params.origin}" and "${params.destination}");
            }}
            precision={'high'}
            timePrecision={'now'}
            mode={'DRIVING'}
            // maxZoomLevel={20}
            onReady={(result) => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);
              updateState({
                totalDistance: result.distance.toFixed(2),
                totalDuration: result.duration.toFixed(2),
              });
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: width / 20,
                  bottom: height / 20,
                  left: width / 20,
                  top: height / 20,
                },
              });
            }}
            onError={(errorMessage) => {
              // console.log('GOT AN ERROR');
            }}
          /> */}
        </MapView>

        {/* Top View */}
        <View style={styles.topView}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButtonView}>
            <Image source={imagePath.backArrowCourier} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            height: height / 2,
            borderTopLeftRadius: moderateScale(30),
            borderTopRightRadius: moderateScale(30),
            width: width,
            backgroundColor: colors.white,
          }}>
          {/* <BlurView
            style={styles.absolute}
            blurType={Platform.OS === 'ios' ? 'xlight' : 'light'}
            blurAmount={50}
          /> */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom:
                Platform.OS === 'ios'
                  ? moderateScaleVertical(50)
                  : moderateScaleVertical(80),
            }}>
            <View
              style={{
                height: moderateScaleVertical(85),
                width: width - moderateScale(60),
                backgroundColor: colors.white,
                borderRadius: moderateScale(15),
                shadowOffset: {width: 0, height: 0.1},
                shadowOpacity: 0.2,
                //   shadowColor: '#fff',
                marginTop: moderateScaleVertical(20),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
                paddingHorizontal: moderateScale(15),
                elevation: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={imagePath.nature}
                  style={{
                    height: moderateScale(40),
                    width: moderateScale(40),
                    borderRadius: moderateScale(20),
                  }}></Image>
                <View style={{marginLeft: moderateScale(15)}}>
                  <Text
                    style={{
                      fontFamily: fontFamily.bold,
                      fontSize: textScale(12),
                    }}>
                    James Jay
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      fontSize: textScale(12),
                      marginTop: moderateScale(5),
                      color: colors.black,
                      opacity: 0.5,
                    }}>
                    Delivery Agent
                  </Text>
                </View>
              </View>
              <Image
                source={imagePath.icRedPhone}
                style={{
                  height: moderateScale(60),
                  width: moderateScale(60),
                  alignSelf: 'center',
                }}
              />
            </View>
            <View
              style={{
                marginVertical: moderateScaleVertical(25),
                alignItems: 'flex-start',
                paddingHorizontal: moderateScale(35),
              }}>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={imagePath.icLocation1} />
                  <View style={{marginStart: moderateScale(15)}}>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        fontSize: textScale(12),
                      }}>
                      Home
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.regular,
                      }}>
                      CDCL, Sector 28b, Chandigarh
                    </Text>
                  </View>
                </View>
                {renderDotContainer()}
              </View>
            </View>

            <StepIndicators1
              labels={labels}
              currentPosition={currentPosition}
              themeColor={themeColors}
              labelSize={15}
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
