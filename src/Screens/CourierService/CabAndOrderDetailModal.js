import {stringify} from 'querystring';
import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, ScrollView, View} from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {useSelector} from 'react-redux';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import strings from '../../constants/lang';
import stylesFun from '../CourierService/ChooseCarTypeAndTime/styles';
import Modal from 'react-native-modal';
import Dash from 'react-native-dash';
import {cloneDeep} from 'lodash';
import TransparentButtonWithTxtAndIcon from '../../Components/TransparentButtonWithTxtAndIcon';
import GradientButton from '../../Components/GradientButton';

export default function CabAndOrderDetailModal({
  isModalVisible = false,
  navigation = {navigation},
  updateModalState,
  closeModal,
}) {
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const [state, setState] = useState({
    isLoading: false,
    pickupArray: [
      {
        id: 1,
        status: 'Package picked up',
        time: '2:20 pm',
        address: '2972 Westheimer Rd. santa Fe',
        image: imagePath.cabLarge,
      },
      {
        id: 2,
        status: 'Driver en route to delivery',
        time: '2:20 pm',
        address: '2972 Westheimer Rd. santa Fe',
        rideStatus: true,
      },
      {
        id: 3,
        status: 'Delivery pending',
        // time: '2:20 pm',
        address: '2972 Westheimer Rd. santa Fe',
      },
    ],
    viewHeights: [],
    viewLoadFinised: false,
  });
  const {isLoading, pickupArray, viewHeights, viewLoadFinised} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;
  // useEffect(() => {
  //   if (isModalVisible) {
  //     setTimeout(() => {
  //       updateModalState();
  //     }, );
  //   }
  // }, [isModalVisible]);

  useEffect(() => {
    console.log(viewHeights, 'viewHeights>>>');
  }, [viewHeights]);

  const _closeModal = () => {
    updateState({viewHeights: []});
    closeModal();
  };

  const getHeight = (index) => {
    console.log(index, 'number of times');
    let height = null;
    let newArray = cloneDeep(viewHeights);
    newArray.map((i, inx) => {
      if (inx == index) {
        height = i.height;
      }
    });
    console.log(height, 'height>>>>>>');
    return height;
  };
  return (
    <Modal
      transparent={true}
      isVisible={isModalVisible}
      animationType={'slide'}
      style={styles.modalContainer}
      onLayout={(event) => {
        // updateState({viewHeight: event.nativeEvent.layout.height});
      }}>
      <View style={{flex: 1}}>
        {/* Top View */}

        <View style={styles.topView2}>
          <TouchableOpacity style={styles.backButtonView} onPress={_closeModal}>
            <Image source={imagePath.closeButton} />
          </TouchableOpacity>
        </View>
       
        <ScrollView bounces={false}>
          {pickupArray &&
            pickupArray.length &&
            pickupArray.map((item, index) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    // height: 80,
                  }}>
                  <View
                    style={{
                      flex: 0.2,
                      alignItems: 'center',
                      marginRight: moderateScale(5),
                    }}>
                    <Dash
                      style={{
                        height: item.image?180: item.rideStatus ? 140 : 75,
                        // height: viewHeights.length && viewLoadFinised? getHeight(index) : 80,
                        flexDirection: 'column',
                        alignSelf: 'center',

                        // paddingBottom: moderateScaleVertical(50),
                      }}
                      dashLength={2}
                      dashColor={colors.themeColor}
                      dashGap={2}
                      dashThickness={1}
                    />
                    <Image
                      source={imagePath.checkbox}
                      style={{
                        position: 'absolute',
                        marginVertical: moderateScaleVertical(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flex: 0.8,
                      // marginVertical: moderateScaleVertical(10),
                      // justifyContent: 'space-evenly',
                    }}
                    onLayout={(event) => {
                      console.log(
                        event.nativeEvent.layout.height,
                        'index',
                        index,
                      );
                      updateState({
                        viewHeights: [
                          {
                            height: event.nativeEvent.layout.height,
                            index: index,
                          },
                          ...viewHeights,
                        ],
                        viewLoadFinised:
                          pickupArray.length - 1 == index ? true : false,
                      });
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <Text style={styles.status}>{item.status}</Text>
                        <Text style={styles.addressStyle} numberOfLines={1}>
                          {item.address}
                        </Text>
                      </View>
                      <View
                        style={{
                          // flex: 0.2,
                          marginRight: moderateScale(20),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            textAlign: 'right',
                            color: colors.textGreyJ,
                            fontFamily: fontFamily.semiBold,
                            fontSize: textScale(12),
                          }}>
                          {item.time}
                        </Text>
                      </View>
                    </View>

                    {item?.image ? (
                      <View
                        style={{paddingVertical: moderateScaleVertical(20)}}>
                        <Image source={item?.image} />
                      </View>
                    ) : null}
                    {item?.rideStatus ? (
                      <View
                        style={{
                          // marginVertical: moderateScaleVertical(5),
                          flexDirection: 'row',
                          // justifyContent: 'space-between',
                          // alignItems: 'center',
                          marginVertical: moderateScaleVertical(10),
                          // marginHorizontal: moderateScale(10),
                          // backgroundColor:'red'
                        }}>
                        <GradientButton
                          colorsArray={[
                            themeColors.primary_color,
                            themeColors.primary_color,
                          ]}
                          textStyle={{
                            textTransform: 'none',
                            fontSize: textScale(16),
                          }}
                          marginTop={moderateScaleVertical(10)}
                          // marginBottom={moderateScaleVertical(10)}
                          btnText={strings.CALL}
                          containerStyle={{width: width / 3}}
                        />

                        <TransparentButtonWithTxtAndIcon
                          btnText={strings.CHAT}
                          borderRadius={moderateScale(13)}
                          // marginBottom={moderateScaleVertical(10)}
                          marginTop={moderateScaleVertical(10)}
                          containerStyle={{
                            width: width / 3,
                            marginLeft: moderateScale(20),
                          }}
                          textStyle={{
                            color: colors.themeColor,
                            textTransform: 'none',
                            fontSize: textScale(16),
                          }}
                        />
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })}
        </ScrollView>

        <View
          style={{
            justifyContent: 'flex-end',
            // alignItems: 'center',
            marginHorizontal: moderateScale(10),
            marginBottom: moderateScale(30),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: moderateScale(10),
            }}>
            <Text style={styles.orderDetailLabel}>{'Total amount paid'}</Text>
            <Text style={styles.orderDetailValue}>{'$50.50'}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: moderateScale(10),
            }}>
            <Text style={styles.orderDetailLabel}>{'Order ID'}</Text>
            <Text style={styles.orderDetailValue}>{'34567892'}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: moderateScale(10),
            }}>
            <Text style={styles.orderDetailLabel}>{'Paid using'}</Text>
            <Text style={styles.orderDetailValue}>{'Visa •••• 2346'}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
