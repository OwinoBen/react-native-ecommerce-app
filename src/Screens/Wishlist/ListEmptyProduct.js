import React from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import ProductListLoader from '../../Components/Loaders/ProductListLoader';
import ProductLoader from '../../Components/Loaders/ProductLoader';
import NoDataFound from '../../Components/NoDataFound';
import strings from '../../constants/lang';
import {moderateScale} from '../../styles/responsiveSize';

export default function ListEmptyProduct({
  isLoading = false,
  text = strings.NODATAFOUND,
  containerStyle = {},
}) {
  if (isLoading) {
    // return <ProductLoader listSize={4} isRow />;
    return (
      <View>
        <ProductListLoader mainView={{marginHorizontal: moderateScale(15)}} />
        <ProductListLoader mainView={{marginHorizontal: moderateScale(15)}} />
        <ProductListLoader mainView={{marginHorizontal: moderateScale(15)}} />
        <ProductListLoader mainView={{marginHorizontal: moderateScale(15)}} />
        <ProductListLoader mainView={{marginHorizontal: moderateScale(15)}} />
        <ProductListLoader mainView={{marginHorizontal: moderateScale(15)}} />
        <ProductListLoader mainView={{marginHorizontal: moderateScale(15)}} />
      </View>
    );
  }
  return (
    <NoDataFound
      containerStyle={containerStyle}
      text={strings.EMPTY_WISHLIST}
      isLoading={isLoading}
    />
  );
}
