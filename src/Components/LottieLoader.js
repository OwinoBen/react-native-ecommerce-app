import LottieView from 'lottie-react-native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import commonStyles from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';

const LottieLoader = ({
  noDataFound,
  emptyText,
  style,
  textStyle,
  containerStyle,
}) => {
  return (
    <View style={{...styles.container, ...containerStyle}}>
      <LottieView
        source={noDataFound}
        autoPlay
        loop
        style={{
          ...style,
          height: moderateScaleVertical(width / 2),
          width: moderateScale(width / 2),
        }}
      />
      <Text
        style={{
          ...styles.textStyle,
          ...textStyle,
        }}>
        {emptyText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    ...commonStyles.mediumFont16,
    fontSize: textScale(18),
  },
});

export default React.memo(LottieLoader);
