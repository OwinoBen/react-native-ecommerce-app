import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import FastImage from 'react-native-fast-image';
import {UIActivityIndicator} from 'react-native-indicators';
import colors from '../styles/colors';
import {moderateScale} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
class BlurImages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showIndicator: true,
      randomColors: '',
    };
  }

  componentDidMount() {
    var w = Math.floor(Math.random() * 256);
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = 0.3;
    var rgbaColor = 'rgba(' + w + ',' + x + ',' + y + ',' + z + ')';
    //console.log(rgbaColor)
    this.setState({
      randomColors: rgbaColor,
    });
  }
  thumbnailAnimated = new Animated.Value(0);

  imageAnimated = new Animated.Value(0);

  handleThumbnailLoad = () => {
    setTimeout(() => {
      Animated.timing(this.thumbnailAnimated, {
        toValue: 1,
      }).start();
      this.setState({});
    }, 100);
  };

  onImageLoad = () => {
    setTimeout(() => {
      Animated.timing(this.imageAnimated, {
        toValue: 1,
      }).start();
      this.setState({
        showIndicator: false,
      });
    }, 100);
  };

  render() {
    const {
      style = {},
      bgStyle = {},
      themeColor,
      isDarkMode,
      imageSource,
      thumbnailQuality,
      originalQuality,
      containerStyle,
      thumbnailUrl,
      originalUrl,
      ...props
    } = this.props;

    return (
      <View
        style={{
          ...styles.container,
          backgroundColor: isDarkMode
            ? colors.whiteOpacity15
            : colors.greyColor,
          ...containerStyle,
        }}>
        <AnimatedFastImage
          {...props}
          source={{
            ...thumbnailUrl,
            priority: FastImage.priority.high,
          }}
          style={[
            style,
            {
              opacity: this.thumbnailAnimated,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            },
          ]}
          onLoad={this.handleThumbnailLoad}></AnimatedFastImage>
        <AnimatedFastImage
          {...props}
          source={{
            ...originalUrl,
            priority: FastImage.priority.low,
          }}
          style={[
            styles.imageOverlay,
            {
              opacity: this.imageAnimated,
              // alignItems: 'center',
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            },
            style,
          ]}
          onLoadEnd={this.onImageLoad}>
          {/* {this.state.showIndicator ?
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <UIActivityIndicator size={70} color={themeColor} />
                        </View>
                        : <View />} */}
        </AnimatedFastImage>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    flex: 1,
    borderTopRightRadius: moderateScale(9),
    borderTopLeftRadius: moderateScale(9),
  },
});

export default React.memo(BlurImages);
