import {Platform} from 'react-native';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

export const boxWidth = (box1 = 2.55, box2 = 65) =>
  width > 600 ? width / box1 : width - moderateScale(box2);
export const noOfColumn = width > 600 ? 2 : 1;
export const customMarginLeftForBox = (index = 1, margin = 12) =>
  width > 600 ? index % 2 && moderateScale(margin) : 0;
export const customMarginBottom = (android = 0, ios = 64) =>
  Platform.OS == 'android'
    ? moderateScaleVertical(android)
    : moderateScaleVertical(ios);
