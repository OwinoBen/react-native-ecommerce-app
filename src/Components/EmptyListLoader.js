import React from 'react';
import {View} from 'react-native';

import strings from '../constants/lang';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../styles/responsiveSize';
import CardLoader from './Loaders/CardLoader';
import NoDataFound from './NoDataFound';
const EmptyListLoader = ({
  isLoading = false,
  text = strings.NODATAFOUND,
  containerStyle = {},
  listSize = 1,
  isRow = false,
  cardWidth = moderateScale(150),
  isVendorList,
  emptyText = '',
  isVendorEmpty,
}) => {
  const contentCard = () => {
    if (isLoading) {
      return (
        <CardLoader
          cardWidth={cardWidth}
          height={moderateScaleVertical(130)}
          listSize={listSize}
          containerStyle={{
            marginLeft: moderateScale(5),
            marginTop: moderateScale(10),
          }}
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
  };

  const contentVendorCard = () => {
    if (isLoading) {
      return (
        <View style={{flexDirection: 'row'}}>
          <CardLoader
            cardWidth={moderateScale(200)}
            height={moderateScaleVertical(40)}
            listSize={listSize}
            pRows={5}
            rowContainerstyle={{
              marginLeft: moderateScale(16),
              marginTop: moderateScale(7),
            }}
          />
          <CardLoader
            cardWidth={moderateScale(145)}
            height={moderateScaleVertical(130)}
            listSize={listSize}
            containerStyle={{
              marginLeft: moderateScale(16),
              marginTop: moderateScale(10),
            }}
          />
        </View>
      );
    }
  };

  return (
    <View style={{width: width - 5}}>
      {isRow ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {contentCard()}
          {contentCard()}
          {contentCard()}
        </View>
      ) : isVendorList ? (
        <>
          {contentVendorCard()}
          {contentVendorCard()}
          {contentVendorCard()}
          {contentVendorCard()}
          {contentVendorCard()}
        </>
      ) : (
        contentCard()
      )}
    </View>
  );
};
export default React.memo(EmptyListLoader);
