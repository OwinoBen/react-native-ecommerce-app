import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import WrapperContainer from '../../Components/WrapperContainer'
import Header from '../../Components/Header'
import { useDarkMode } from 'react-native-dynamic';
import colors from '../../styles/colors';
import { MyDarkTheme } from '../../styles/theme';
import { useSelector } from 'react-redux';
import imagePath from '../../constants/imagePath';
import actions from '../../redux/actions';
import { moderateScale, moderateScaleVertical, width } from '../../styles/responsiveSize';
import { Image } from 'react-native-animatable';
import strings from '../../constants/lang';
import NoDataFound from '../../Components/NoDataFound';
import { ActivityIndicator } from 'react-native-paper';


export default function SavedCards() {
    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    const {
        appData,
        currencies,
        languages,
        themeColors
    } = useSelector((state) => state?.initBoot);

    const [savedCardData, setSavedCardData] = useState([])
    const [selectedSavedListCardNumber, setSelectedSavedListCardNumber] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [btnLoader, setBtnLoader] = useState(false)
    const[delIndex,setDelIndex] = useState()

    useEffect(() => {
        getSavedCardList()
    }, [])

    const getSavedCardList = () => {

        actions.getSavedCardsList({},
            {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
            },
        )
            .then((res) => {
                console.log('getSavedCardList =>', res);
                // updateState({ isLoading: false, isRefreshing: false });
                if (res && res?.data) {
                    setSavedCardData(res?.data)
                    setIsLoading(false)
                }
            })
            .catch((err) => {
                console.log(err, 'errorrrr')
                setIsLoading(false)
            });
    }
    const deleteCard = (item,index) => {
        Alert.alert('', strings.DELETE_CARD, [
            {
                text: strings.CANCEL,
                onPress: () => console.log('Cancel Pressed'),
                // style: 'destructive',
            },
            {
                text: strings.CONFIRM,
                onPress: () => {
                    deleteSaveCard(item,index)
                },
            },
        ]);
    }

    const deleteSaveCard = (item,index) => {
        setDelIndex(index)
        setBtnLoader(true)
        let query = `?id=${item?.id}`
        actions.deleteCard(query, {}, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
        })
            .then((res) => {

                console.log(res, 'resereserseersre')
                alert(res?.message)
                getSavedCardList()
                setBtnLoader(false)
            })
            .catch((err) => {
                console.log(err, 'errorrrrrrrrrr')
                setBtnLoader(false)
            })
    }
    const selectSavedCard = (data, inx) => {
        console.log(data, 'datadatadata')
        // {
        //   selectedSavedListCardNumber && selectedSavedListCardNumber?.id == data?.id
        //     ? (updateState({ selectedSavedListCardNumber: null }))
        //     : updateState({ selectedSavedListCardNumber: data });
        // }
    };

    const renderSavedCardList = ({ item, index }) => {
        console.log(item,'itemmmmmmm')
        const expDate = item?.expiration
        // const expDate = item?.expiration.slice(0, 4) + "/" + item?.expiration.slice(4)
        return (
            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", marginHorizontal: moderateScale(20) }}>
                <TouchableOpacity
                    style={[
                        styles.caseOnDeliveryView,
                        {
                            marginVertical: moderateScaleVertical(8)
                        }]}>

                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={
                                    isDarkMode
                                        ? [
                                            styles.caseOnDeliveryText,
                                            { color: MyDarkTheme.colors.text },
                                        ]
                                        : styles.caseOnDeliveryText
                                }>
                                {'Card No:'}
                            </Text>
                            <Text
                                style={
                                    isDarkMode
                                        ? [
                                            styles.caseOnDeliveryText,
                                            { color: MyDarkTheme.colors.text },
                                        ]
                                        : styles.caseOnDeliveryText
                                }>
                                {item?.card_hint}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={
                                    isDarkMode
                                        ? [
                                            styles.caseOnDeliveryText,
                                            { color: MyDarkTheme.colors.text },
                                        ]
                                        : styles.caseOnDeliveryText
                                }>
                                {'Exp Date:'}
                            </Text>
                            <Text
                                style={
                                    isDarkMode
                                        ? [
                                            styles.caseOnDeliveryText,
                                            { color: MyDarkTheme.colors.text },
                                        ]
                                        : styles.caseOnDeliveryText
                                }>
                                {expDate}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {!!btnLoader && index == delIndex ? <ActivityIndicator size="small" color={themeColors.primary_color} /> : <TouchableOpacity onPress={() => deleteCard(item,index)}>
                    <Image source={imagePath?.delete} />
                </TouchableOpacity>}
            </View>

        )
    }

    return (
        <WrapperContainer
            bgColor={
                isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
            }
            statusBarColor={colors.backgroundGrey}
            isLoading={isLoading}
        // source={loaderOne}
        >
            <Header
                leftIcon={imagePath.back}
                centerTitle={"Saved Cards"}

                headerStyle={
                    isDarkMode
                        ? { backgroundColor: MyDarkTheme.colors.background }
                        : { backgroundColor: colors.white }
                }

            />
            <FlatList
                keyExtractor={(itm, inx) => String(inx)}
                data={savedCardData}
                renderItem={renderSavedCardList}
                ListEmptyComponent={
                    !isLoading && (
                        <View
                            style={{
                                flex: 1,
                                marginTop: moderateScaleVertical(width / 2),
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <NoDataFound />
                        </View>
                    )
                }
            />
        </WrapperContainer>
    )
}

const styles = StyleSheet.create({})
