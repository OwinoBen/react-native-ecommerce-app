import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {moderateScale} from '../styles/responsiveSize';

export default function InventoryComp() {
  const {themeColors, appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  return (
    <View
      style={{
        backgroundColor: colors.seaGreen1,
        height: 160,
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(15),
        borderRadius: moderateScale(5),
        marginVertical: moderateScale(7),
      }}>
      <View style={styles.itemView}>
        <Text style={commonStyles.mediumFont16}>Sneakers</Text>
        <View style={styles.increaseDecreaseView}>
          <TouchableOpacity>
            <Image source={imagePath.icMinus} style={{height: 23, width: 23}} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: moderateScale(10),
            }}>
            <Text>50</Text>
            <Image
              source={imagePath.dropDownNew}
              style={{marginLeft: moderateScale(3)}}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={imagePath.icPlus2} style={{height: 23, width: 23}} />
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={{
          ...commonStyles.mediumFont12,
          marginVertical: moderateScale(5),
        }}>
        Total units - 500
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '30%',
          marginTop: moderateScale(5),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Image source={imagePath.icStore} />
          <Text style={styles.unitsTxt}>200</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Image source={imagePath.icStore2} />
          <Text style={styles.unitsTxt}>300</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          borderRadius: moderateScale(5),
          borderWidth: 1,
          borderColor: colors.seaGreen,
          paddingVertical: moderateScale(10),
          alignItems: 'center',
          marginTop: moderateScale(10),
        }}>
        <Text style={{color: colors.seaGreen}}>{strings.PURCHASE_PRODUCT}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  increaseDecreaseView: {
    flexDirection: 'row',
  },
  unitsTxt: {marginLeft: moderateScale(7), opacity: 0.7},
});
