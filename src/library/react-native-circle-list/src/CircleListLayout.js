import PropTypes from 'prop-types';
import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {moderateScaleVertical} from '../../../styles/responsiveSize';

export const CircleListLayout = ({
  calcHeight,
  containerStyle,
  displayData,
  keyExtractor,
  panHandlers,
  renderItem,
  state,
  visibleDataBounds,
}) => (
  <View
    {...panHandlers}
    style={[styles.container, {height: calcHeight()}, containerStyle]}>
    <View style={styles.wrapper}>
      {displayData.map((item, index) => {
        const scale = state[`scale${index}`];
        const translateX = state[`translateX${index}`];
        const translateY = state[`translateY${index}`];
        const {_dataIndex, ...itemToRender} = item;

        return (
          translateX &&
          translateY &&
          visibleDataBounds &&
          visibleDataBounds.includes(_dataIndex) && (
            <Animated.View
              key={keyExtractor(item, index)}
              style={[
                styles.renderItemContainer,
                {
                  transform: [{translateX}, {translateY}, {scale}],
                },
              ]}>
              {renderItem({item: itemToRender, index: item._dataIndex})}
            </Animated.View>
          )
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  renderItemContainer: {
    position: 'absolute',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: moderateScaleVertical(235),
  },
});

CircleListLayout.propTypes = {
  calcHeight: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  displayData: PropTypes.array,
  keyExtractor: PropTypes.func.isRequired,
  panHandlers: PropTypes.object.isRequired,
  renderItem: PropTypes.func.isRequired,
  state: PropTypes.object,
  visibleDataBounds: PropTypes.array,
};
