import React from 'react';
import CardLoader from '../../Components/Loaders/CardLoader';
import NoDataFound from '../../Components/NoDataFound';
import strings from '../../constants/lang';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

export default function ListEmptyProduct({
  isLoading = false,
  text = strings.NODATAFOUND,
  containerStyle = {},
}) {
  if (isLoading) {
    return (
      <CardLoader
        cardWidth={width - moderateScale(32)}
        height={moderateScaleVertical(170)}
        listSize={5}
        containerStyle={{marginLeft: moderateScale(16)}}
      />
    );
  } else {
    return (
      <NoDataFound
        text={text}
        isLoading={isLoading}
        containerStyle={containerStyle}
      />
    );
  }
}
