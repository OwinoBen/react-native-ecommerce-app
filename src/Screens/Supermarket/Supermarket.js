import React from 'react';
import {FlatList, View} from 'react-native';
import HeaderWithFilters from '../../Components/HeaderWithFilters';
import MarketCard from '../../Components/MarketCard';
import WrapperContainer from '../../Components/WrapperContainer';
import colors from '../../styles/colors';

export default function Supermarket() {
  const _renderItem = ({item, index}) => {
    return <MarketCard />;
  };
  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}>
      <HeaderWithFilters centerTitle={'Supermarkets'} />
      <FlatList
        data={[1, 3, 3, 3]}
        ListHeaderComponent={<View style={{height: 20}} />}
        ItemSeparatorComponent={() => <View style={{height: 8}} />}
        keyExtractor={(item, index) => String(index)}
        renderItem={_renderItem}
      />
    </WrapperContainer>
  );
}
