import React from 'react';
import {Image} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import imagePath from '../constants/imagePath';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';

const StepIndicators1 = ({
  containerStyle = {},
  placeholder = '',
  labels = [],
  currentPosition,
  themeColor,
  stepCount = 4,
  labelSize = 13,
}) => {
  const {appData, themeColors, currencies, languages, appStyle} = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;

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
            ? imagePath.icUnChecked
            : imagePath.icRedChecked;
        break;
      }
      case 1: {
        iconConfig =
          stepStatus == 'finished'
            ? imagePath.icRedChecked
            : imagePath.icUnChecked;
        break;
      }
      case 2: {
        iconConfig =
          stepStatus == 'finished'
            ? imagePath.icRedChecked
            : imagePath.icUnChecked;
        break;
      }
      case 3: {
        iconConfig =
          stepStatus == 'finished'
            ? imagePath.icRedChecked
            : imagePath.icUnChecked;
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
    return <Image source={getSourceImage({position, stepStatus})} />;
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
      stepCount={stepCount}
      customStyles={thirdIndicatorStyles}
      currentPosition={currentPosition}
      renderStepIndicator={renderStepIndicator}
      // renderLabel={renderLabel}
      labels={labels}
    />
  );
};
export default React.memo(StepIndicators1);
