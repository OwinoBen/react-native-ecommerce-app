import React from 'react';
import {SafeAreaView} from 'react-native';
import strings from '../../constants/lang';

export default function ListEmptyCart({
  isLoading = false,
  containerStyle = {},
  text = strings.NOPRODUCTCART,
  textStyle = {},
}) {
  if (!isLoading) {
    return (
      <SafeAreaView style={{flex: 1}}>
        {/* <View style={[styles.containerStyle, containerStyle]}>
          <Image source={imagePath.emptyCart} />
          <Text style={{...styles.textStyle, ...textStyle}}>{text}</Text>
        </View> */}
      </SafeAreaView>
    );
  }
  return null;
}
