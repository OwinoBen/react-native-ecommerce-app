import React from 'react';
import {Text, View, SafeAreaView, Image} from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import {useSelector} from 'react-redux';
import imagePath from '../../constants/imagePath';

import stylesFun from './styles';

import {
  height,
  moderateScale,
  moderateScaleVertical,
  scale,
  width,
} from '../../styles/responsiveSize';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';

export default function ListEmptyOffers({isLoading = false}) {
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});
  if (isLoading) {
    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <HeaderLoader
            viewStyles={{marginVertical: 30, marginLeft: 0}}
            widthLeft={width - moderateScale(120)}
            rectWidthLeft={width - moderateScale(120)}
            heightLeft={moderateScaleVertical(35)}
            rectHeightLeft={moderateScaleVertical(35)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{marginVertical: 30, marginLeft: 0}}
            widthLeft={moderateScale(70)}
            rectWidthLeft={moderateScale(70)}
            heightLeft={moderateScaleVertical(35)}
            rectHeightLeft={moderateScaleVertical(35)}
            isRight={false}
            rx={15}
            ry={15}
          />
        </View>
        <HeaderLoader
          viewStyles={{marginLeft: 0}}
          widthLeft={width - moderateScale(30)}
          rectWidthLeft={width - moderateScale(30)}
          heightLeft={moderateScaleVertical(180)}
          rectHeightLeft={moderateScaleVertical(180)}
          isRight={false}
          rx={15}
          ry={15}
        />
        <HeaderLoader
          viewStyles={{marginLeft: 0, marginTop: 30}}
          widthLeft={width - moderateScale(30)}
          rectWidthLeft={width - moderateScale(30)}
          heightLeft={moderateScaleVertical(180)}
          rectHeightLeft={moderateScaleVertical(180)}
          isRight={false}
          rx={15}
          ry={15}
        />
        <HeaderLoader
          viewStyles={{marginLeft: 0, marginTop: 30}}
          widthLeft={width - moderateScale(30)}
          rectWidthLeft={width - moderateScale(30)}
          heightLeft={moderateScaleVertical(180)}
          rectHeightLeft={moderateScaleVertical(180)}
          isRight={false}
          rx={15}
          ry={15}
        />
      </View>
    );
  }
  return (
    <SafeAreaView>
      <View style={styles.containerStyle}>
        <Image
          source={imagePath.noOffers}
          style={{marginTop: height / 4 - 30}}
        />
        <Text
          style={{
            marginTop: scale(20),
            color: colors.textGreyOpcaity7,
            fontFamily: styles.textStyle.fontFamily,
          }}>
          {strings.NOOFFERS_FOUND}
        </Text>
      </View>
    </SafeAreaView>
  );
}
