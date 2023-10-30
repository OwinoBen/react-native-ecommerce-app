import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import CategoriesCard from '../../../Components/CategoriesCard';
import OoryksHeader from '../../../Components/OoryksHeader';
import WrapperContainer from '../../../Components/WrapperContainer';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import { moderateScale, moderateScaleVertical } from '../../../styles/responsiveSize';
import { showError } from '../../../utils/helperFunctions';
import stylesFunc from './styles';

const AllCategories = ({ navigation }) => {
    const {
        appData,
        currencies,
        languages,
    } = useSelector(state => state?.initBoot);
    const [allCategories, setAllCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const moveToNewScreen =
        (screenName, data = {}) =>
            () => {
                navigation.navigate(screenName, { data });
            };

    useEffect(() => {
        getCategories()
    }, [])

    const getCategories = () => {
        setIsLoading(true)
        actions.getAllCategories({
            type: "p2p"
        }, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
        }).then((res) => {
            console.log(res, "<===getAllCategories")
            setIsLoading(false)
            setAllCategories(res?.data?.navCategories)
        }).catch(errorMethod)
    }

    const errorMethod = error => {
        console.log(error, "<===getAllCategories")
        setIsLoading(false);
        showError(error?.message || error?.error);
    };




    const renderItem = ({ item, index }) => {
        return (
            <CategoriesCard item={item} onPress={moveToNewScreen(navigationStrings.P2P_PRODUCTS, item)} />
        )
    }


    return (
        <WrapperContainer isLoading={isLoading}>
            <OoryksHeader leftTitle={strings.CATEGORIES} />
            <View style={{ marginTop: moderateScaleVertical(12), paddingHorizontal: moderateScale(16) }}>
                <FlatList
                    data={allCategories}
                    renderItem={renderItem}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{
                        justifyContent: "space-between"
                    }}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{ height: moderateScale(12) }} />
                        )
                    }}
                    ListFooterComponent={() => <View style={{
                        height: moderateScaleVertical(80)
                    }} />}
                />
            </View>
        </WrapperContainer>
    );
};





//make this component available to the app
export default AllCategories;
