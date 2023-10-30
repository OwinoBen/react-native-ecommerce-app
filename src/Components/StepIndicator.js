import React from 'react';
import {Image} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import imagePath from '../constants/imagePath';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {moderateScale} from '../styles/responsiveSize';

const StepIndicators_ = ({
  containerStyle = {},
  placeholder = '',
  labels = [],
  currentPosition,
  themeColor,
  labelSize = 13,
  dispatcherStatus,
}) => {
  const {appData, themeColors, currencies, languages, appStyle} = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  console.log('dispatcher status', dispatcherStatus);

  const thirdIndicatorStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 0,
    stepStrokeCurrentColor: '#7eaec4',
    stepStrokeWidth: 2,
    stepStrokeFinishedColor: themeColor.primary_color,
    stepStrokeUnFinishedColor: '#D8D8D8',
    separatorFinishedColor: themeColor.primary_color,
    separatorUnFinishedColor: '#D8D8D8',
    stepIndicatorFinishedColor: themeColor.primary_color,
    stepIndicatorUnFinishedColor: '#D8D8D8',
    stepIndicatorCurrentColor: themeColor.primary_color,
    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 0,
    stepIndicatorLabelCurrentColor: 'transparent',
    stepIndicatorLabelFinishedColor: 'transparent',
    stepIndicatorLabelUnFinishedColor: 'transparent',
    labelColor: colors.lightGreyBgColor,
    labelSize: labelSize,
    currentStepLabelColor: themeColor.primary_color,
    labelFontFamily: fontFamily.regular,
  };

  const getSourceImage = ({position, stepStatus}) => {
    let iconConfig = null;
    switch (position) {
      case 0: {
        iconConfig =
          stepStatus == 'finished'
            ? imagePath.inactiveaccept
            : imagePath.inactiveaccept;
        break;
      }
      case 1: {
        iconConfig =
          stepStatus == 'finished'
            ? imagePath.inactiveprocceing
            : imagePath.inactiveprocceing;
        break;
      }
      case 2: {
        iconConfig =
          stepStatus == 'finished'
            ? imagePath.inactiveoutdelivery
            : imagePath.inactiveoutdelivery;
        break;
      }
      case 3: {
        iconConfig =
          stepStatus == 'finished'
            ? imagePath.inactivedelivered
            : imagePath.inactivedelivered;
        break;
      }
      default: {
        break;
      }
    }
    return iconConfig;
    // if (stepStatus == 'finished') {
    //   return imagePath.tick;
    // }
  };

  const renderStepIndicator = ({position, stepStatus}) => {
    //console.log(position, 'position', stepStatus, 'stepStatus');
    return (
      <Image
        style={{
          width: moderateScale(30),
          height: moderateScale(30),
        }}
        source={{uri: dispatcherStatus?.dispatcher_status_icons[position]}}
      />
    );
  };

  const renderLabel = ({position, stepStatus, label, currentPosition}) => {
    //console.log(position, 'position', stepStatus, 'stepStatus');
    return <Image source={getSourceImage({position, stepStatus})} />;
  };

  const allLables = labels.map((i, inx) => {
    return `${i.lable}\n${i.orderDate}`;
  });

  return (
    <StepIndicator
      stepCount={dispatcherStatus.vendor_dispatcher_status_count} //showing step indicators dynamically
      customStyles={thirdIndicatorStyles}
      currentPosition={dispatcherStatus?.vendor_dispatcher_status?.length - 1}
      renderStepIndicator={renderStepIndicator}
      // renderLabel={renderLabel}
      //labels={labels}
    />
  );
};
export default React.memo(StepIndicators_);
