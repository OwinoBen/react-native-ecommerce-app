import React from 'react';
import { Text, View } from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import {
  moderateScale,
  moderateScaleVertical,
  width
} from '../../styles/responsiveSize';

export default function ListEmptyBrand({isLoading = false}) {
  if (isLoading) {
    return (
      <CardLoader
        cardWidth={width - moderateScale(32)}
        height={moderateScaleVertical(71)}
        listSize={10}
        containerStyle={{marginLeft: moderateScale(16)}}
      />
    );
  }
  return (
    <View>
      <Text></Text>
    </View>
  );
}
