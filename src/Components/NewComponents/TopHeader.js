import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import imagePath from '../../constants/imagePath';
import {moderateScale} from '../../styles/responsiveSize';
import fontFamily from '../../styles/fontFamily';
import strings from '../../constants/lang';

const TopHeader = ({onPressLeft = () => {}, onPressRight}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPressLeft}>
        <Image source={imagePath.back1} />
      </TouchableOpacity>
      <Text style={styles.text1}>{strings.FILTER}</Text>
      <TouchableOpacity onPress={onPressRight}>
        <Text>{strings.RESET_ALL}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TopHeader;

const styles = StyleSheet.create({
  container: {
    marginVertical: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text1: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  text2: {
    fontSize: 13,
    fontFamily: fontFamily.medium,
  },
});
