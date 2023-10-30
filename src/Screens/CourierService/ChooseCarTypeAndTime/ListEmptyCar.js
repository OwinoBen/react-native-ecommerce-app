import React from 'react';
import {Text, View} from 'react-native';
import CardLoader from '../../../Components/Loaders/CardLoader';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';

export default function ListEmptyCar({isLoading = false}) {
  if (isLoading) {
    return (
      <View style={{marginTop: moderateScaleVertical(20), }}>
        <View style={{flexDirection: 'row'}}>
          <CardLoader
            cardWidth={width / 6}
            height={moderateScaleVertical(100)}
            listSize={1}
            containerStyle={{
              marginLeft: moderateScale(16),
              //   backgroundColor: colors.white,
              justifyContent: 'center',
            }}
          />
          <View>
            <CardLoader
              cardWidth={50}
              height={moderateScaleVertical(20)}
              listSize={1}
              containerStyle={{
                marginLeft: moderateScale(16),
                color: colors.white,
              }}
            />
            <CardLoader
              cardWidth={width / 2}
              height={moderateScaleVertical(16)}
              listSize={1}
              containerStyle={{
                marginLeft: moderateScale(16),
                color: colors.white,
              }}
            />
            <CardLoader
              cardWidth={width / 2}
              height={moderateScaleVertical(16)}
              listSize={1}
              containerStyle={{
                marginLeft: moderateScale(16),
                color: colors.white,
              }}
            />
            <CardLoader
              cardWidth={width / 2}
              height={moderateScaleVertical(16)}
              listSize={1}
              containerStyle={{
                marginLeft: moderateScale(16),
                color: colors.white,
              }}
            />
          </View>

          
            <CardLoader
              cardWidth={width / 6}
              height={moderateScaleVertical(25)}
              listSize={1}
              containerStyle={{
                marginLeft: moderateScale(16),
                // backgroundColor: colors.white,
                justifyContent: 'center',
              }}
            />
          
        </View>
      </View>
    );
  }
  return (
    <View>
      <Text></Text>
    </View>
  );
}
