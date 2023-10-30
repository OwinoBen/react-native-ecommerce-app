//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import { moderateScaleVertical, width } from '../../styles/responsiveSize';

// create a component
const SearchVendorLoader = () => {
    return (
        <View style={{ alignItems: 'center' }}>

        <HeaderLoader
            viewStyles={{ marginTop: 5 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
        />
        <HeaderLoader
            viewStyles={{ marginTop: 15 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
        />
        <HeaderLoader
            viewStyles={{ marginTop: 15 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
        />
        <HeaderLoader
            viewStyles={{ marginTop: 15 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
        />
        <HeaderLoader
            viewStyles={{ marginTop: 15 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
        />
    </View>
    );
};

export default React.memo(SearchVendorLoader);

