import React from 'react';
import {Text, View} from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

export default function ListEmptyProduct({isLoading = false}) {
  const productViewLoader = () => {
    return (
      <View
        style={{
          marginHorizontal: moderateScale(15),
          marginTop: moderateScaleVertical(30),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(90)}
          rectWidthLeft={moderateScale(90)}
          rectHeightLeft={moderateScaleVertical(90)}
          heightLeft={moderateScaleVertical(90)}
          viewStyles={{
            marginHorizontal: 0,
          }}
          rx={3}
          ry={3}
        />
        <View style={{marginLeft: moderateScale(10)}}>
          <HeaderLoader
            isRight={false}
            widthLeft={moderateScale(120)}
            rectWidthLeft={moderateScale(120)}
            rectHeightLeft={moderateScaleVertical(15)}
            heightLeft={moderateScaleVertical(15)}
            viewStyles={{
              marginHorizontal: 0,
            }}
            rx={8}
            ry={8}
          />
          <HeaderLoader
            isRight={false}
            widthLeft={moderateScale(80)}
            rectWidthLeft={moderateScale(80)}
            rectHeightLeft={moderateScaleVertical(15)}
            heightLeft={moderateScaleVertical(15)}
            viewStyles={{
              marginHorizontal: 0,
              marginTop: moderateScale(5),
            }}
            rx={8}
            ry={8}
          />
        </View>
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(30)}
          rectWidthLeft={moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(30)}
          heightLeft={moderateScaleVertical(30)}
          viewStyles={{
            marginHorizontal: 0,
            marginTop: moderateScale(5),
            marginLeft: 'auto',
          }}
          rx={15}
          ry={15}
        />
      </View>
    );
  };
  if (isLoading) {
    return (
      <View
        style={{
          marginTop: moderateScaleVertical(20),
          marginBottom: moderateScaleVertical(60),
        }}>
        <HeaderLoader
          isRight={false}
          widthLeft={width - moderateScale(30)}
          rectWidthLeft={width - moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(145)}
          heightLeft={moderateScaleVertical(145)}
          viewStyles={{marginHorizontal: 0, alignSelf: 'center'}}
          rx={5}
          ry={5}
        />
        <View
          style={{
            marginTop: moderateScaleVertical(10),
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: moderateScale(15),
          }}>
          <HeaderLoader
            isRight={false}
            widthLeft={moderateScale(80)}
            rectWidthLeft={moderateScale(80)}
            rectHeightLeft={moderateScaleVertical(15)}
            heightLeft={moderateScaleVertical(15)}
            viewStyles={{
              marginHorizontal: 0,
            }}
            rx={8}
            ry={8}
          />
          <View style={{flexDirection: 'row'}}>
            <HeaderLoader
              isRight={false}
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              rectHeightLeft={moderateScaleVertical(15)}
              heightLeft={moderateScaleVertical(15)}
              viewStyles={{
                marginHorizontal: 0,
                marginRight: moderateScale(5),
              }}
              rx={8}
              ry={8}
            />
            <HeaderLoader
              isRight={false}
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              rectHeightLeft={moderateScaleVertical(15)}
              heightLeft={moderateScaleVertical(15)}
              viewStyles={{
                marginHorizontal: 0,
              }}
              rx={8}
              ry={8}
            />
          </View>
        </View>
        {productViewLoader()}
        {productViewLoader()}
        {productViewLoader()}
        {productViewLoader()}
        {productViewLoader()}
      </View>
    );
  }
  return (
    <View>
      <Text></Text>
    </View>
  );
}
