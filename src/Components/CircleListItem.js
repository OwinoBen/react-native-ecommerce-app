import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../styles/colors';
import {moderateScale, textScale, width} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';

const CircleListItem = ({circlualistData, onPress = () => {}}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.circularView}>
          <FastImage
            style={styles.circularListImage}
            source={{
              uri: getImageUrl(
                circlualistData.icon.image_fit,
                circlualistData.icon.image_path,
                '600/360',
              ),
              priority: FastImage.priority.high,
            }}
          />
          <Text style={styles.categoryText}>{circlualistData.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularView: {
    height: moderateScale(width / 4),
    width: moderateScale(width / 4),
    borderWidth: 5,
    borderColor: colors.borderColorc,
    borderRadius: moderateScale(width / 8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    color: colors.textGreyH,
    fontSize: textScale(9),
  },
  circularListImage: {height: moderateScale(40), width: moderateScale(40)},
});
export default React.memo(CircleListItem);
