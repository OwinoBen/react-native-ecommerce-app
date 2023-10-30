import { View, Text, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'


import * as Progress from 'react-native-progress';

import { useSelector } from 'react-redux';

import { useIsFocused } from '@react-navigation/native';

import { height, moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize';
import colors from '../styles/colors';
import GradientButton from './GradientButton';
import imagePath from '../constants/imagePath';
import useInterval from '../utils/useInterval';
import { tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { getColorCodeWithOpactiyNumber } from '../utils/helperFunctions';

const BidAcceptRejectCard = ({
  data = [],
  bidExpiryDuration = {},
  _onDeclineBid = () => { },
  _onAcceptRideBid = () => { }
}) => {
  const {
    appData,
    currencies,
    languages,
    themeColors,
    appStyle,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const {
    additional_preferences,
    digit_after_decimal,
  } = appData?.profile?.preferences;


  return (
    <View style={{
      marginTop: moderateScaleVertical(20),
      width: moderateScale(width - 40),
      alignSelf: 'center',
      backgroundColor:colors?.whiteSmokeColor,
      borderRadius: moderateScale(15), overflow: 'hidden'
    }}>
      <View style={{
        alignSelf: 'flex-end',
        marginHorizontal: moderateScale(20),
        marginTop: moderateScaleVertical(8)
      }} >
        <CountdownCircleTimer
          isPlaying
          duration={Number(bidExpiryDuration)}
          colors={[themeColors?.primary_color]}
          size={40}
          strokeWidth={5}
        >
          {({ remainingTime }) => {
           // remainingTime == 1 && bidExpiryDuration !=null && _onDeclineBid(data?.id)
            return (
              <Text>{remainingTime}</Text>
            )

          }}
        </CountdownCircleTimer>

      </View>
      <View style={{ marginHorizontal: moderateScale(10), flexDirection: 'row', alignItems: 'center', }}>
        <View>
          <Image style={{ height: moderateScaleVertical(50), width: moderateScale(50), borderRadius: moderateScale(25) }} source={{ uri:data?.driver_image }} />
        </View>

        <View style={{ marginHorizontal: moderateScale(10), flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '62%', }}>
            <Text style={{ fontSize: textScale(13), fontFamily: fontFamily.bold }}>{data?.driver_name}</Text>
            
          </View>
          <View>
            <Text style={{ fontSize: textScale(15), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}> {tokenConverterPlusCurrencyNumberFormater(
              Number(data?.bid_price),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}</Text>
          </View>

        </View>
      </View>
      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginVertical: moderateScaleVertical(10) }}>
        <GradientButton
          colorsArray={[colors.white, colors.white]}
          textStyle={{
            textTransform: 'none',
            fontSize: textScale(13),
            color: colors?.redB,

          }}
          onPress={() => _onDeclineBid(data?.id)}
          btnText={`Decline`}
          btnStyle={{ width: moderateScale(width / 2.5), borderWidth: moderateScale(1), borderColor: colors.redB }}
        />
        <GradientButton
          colorsArray={[themeColors?.primary_color, themeColors?.primary_color]}
          textStyle={{
            textTransform: 'none',
            fontSize: textScale(13),
            color: colors.white,
          }}
          onPress={() => _onAcceptRideBid(data)}
          btnText={`Accept`}
          btnStyle={{ width: moderateScale(width / 2.5) }}
        />
      </View>


    </View>
  )
}

export default BidAcceptRejectCard;