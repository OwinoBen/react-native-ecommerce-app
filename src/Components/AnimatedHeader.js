import React from 'react';
import {Animated, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const HEADER_HEIGHT = 200;

const AnimatedHeader = ({animatedValue, children}) => {
  const insets = useSafeAreaInsets();
  const headerHeight = animatedValue.interpolate({
    inputRange: [0, HEADER_HEIGHT + insets.top],
    outputRange: [HEADER_HEIGHT + insets.top, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        height: headerHeight,
        backgroundColor: 'lightblue',
      }}>
      {children}
    </Animated.View>
  );
};

export default React.memo(AnimatedHeader);
