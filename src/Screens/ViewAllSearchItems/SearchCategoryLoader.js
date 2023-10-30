//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import { moderateScale, moderateScaleVertical, width } from '../../styles/responsiveSize';

// create a component

let containerHeight = parseInt(moderateScale(80))
let containerWidth = parseInt(moderateScale(80))

const SearchCategoryLoader = () => {
    return (

        <View style={{}}>
            {[{}, {}, {}, {},{},{},{}].map((val, i) => {
                return (
                    <View key={String(i)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: moderateScaleVertical(16),marginHorizontal:moderateScale(8) }}>

                        <HeaderLoader
                            widthLeft={containerWidth}
                            rectWidthLeft={containerWidth}
                            heightLeft={containerHeight}
                            rectHeightLeft={containerHeight}
                            isRight={false}
                            rx={4}
                            ry={4}
                            viewStyles={{marginHorizontal:0}}
                        />
                        <HeaderLoader
                            widthLeft={containerWidth}
                            rectWidthLeft={containerWidth}
                            heightLeft={containerHeight}
                            rectHeightLeft={containerHeight}
                            isRight={false}
                            rx={4}
                            ry={4}
                            viewStyles={{marginHorizontal:0,marginHorizontal:moderateScale(8)}}
                        />
                        <HeaderLoader
                            widthLeft={containerWidth}
                            rectWidthLeft={containerWidth}
                            heightLeft={containerHeight}
                            rectHeightLeft={containerHeight}
                            isRight={false}
                            rx={4}
                            ry={4}
                            viewStyles={{marginHorizontal:0}}
                        />
                            <HeaderLoader
                            widthLeft={containerWidth}
                            rectWidthLeft={containerWidth}
                            heightLeft={containerHeight}
                            rectHeightLeft={containerHeight}
                            isRight={false}
                            rx={4}
                            ry={4}
                            viewStyles={{marginHorizontal:0,marginHorizontal:moderateScale(8)}}
                        />

                    </View>
                )
            })}
        </View>


    );
};

export default React.memo(SearchCategoryLoader);

