import { CardNumber } from 'frames-react-native'
import React, { useState } from 'react'
import { View } from 'react-native-animatable'

import strings from '../constants/lang'
import { height, moderateScaleVertical } from '../styles/responsiveSize'

import BorderTextInput from './BorderTextInput'
import ButtonComponent from './ButtonComponent'



export default function PaymentGateways({
  isCardNumber,
  cvc,
  expiryDate,
  onChangeText = () => { },
  onChangeExpiryDateText = () => { },
  onChangeCvcText = () => { },
  eDate,
  paymentid= 49,
  onChangeYearText=()=>{},
  onChangeDateText=()=>{},
  year,
}) {
  return (
    <View style={{ marginTop: moderateScaleVertical(15) }}>
      <BorderTextInput
        onChangeText={onChangeText}
        placeholder={'Card Number'}
        value={isCardNumber}
        keyboardType={'numeric'}
        autoCapitalize={'none'}
        autoFocus={true}
        returnKeyType={'next'}
        maxLength={19}
      />

      <View style={{ flexDirection: 'row', flex: 1, justifyContent: "space-between" }}>

        <View style={{ flex: .5 }}>
          {paymentid !=50 ? 
          <BorderTextInput
            onChangeText={onChangeExpiryDateText}
            placeholder={'MM/YY'}
            value={expiryDate}
            keyboardType={'numeric'}
            autoCapitalize={'none'}
            autoFocus={true}
            returnKeyType={'next'}
            maxLength={5}
          /> :
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flex:.5}}>
              <BorderTextInput
                onChangeText={onChangeYearText}
                placeholder={'YYYY'}
                value={year}
                keyboardType={'numeric'}
                autoCapitalize={'none'}
                autoFocus={true}
                returnKeyType={'next'}
                maxLength={4}
              />
                </View>
                <View style={{flex:.4}}>
              <BorderTextInput
                onChangeText={onChangeDateText}
                placeholder={'MM'}
                value={eDate}
                keyboardType={'numeric'}
                autoCapitalize={'none'}
                autoFocus={true}
                returnKeyType={'next'}
                maxLength={2}
              /></View>
            </View>
          }
        </View>
        <View style={{ flex: .4 }}>
          <BorderTextInput
            secureTextEntry={true}
            onChangeText={onChangeCvcText}
            placeholder={'CVC'}
            value={cvc}
            keyboardType={'numeric'}
            autoCapitalize={'none'}
            autoFocus={true}
            returnKeyType={'done'}
            maxLength={3}
          />
        </View>
      </View>

    </View>
  )
}
