import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, RefreshControl, Text, View, Image } from 'react-native'
import OoryksHeader from '../../../Components/OoryksHeader'
import WrapperContainer from '../../../Components/WrapperContainer'
import actions from '../../../redux/actions'
import colors from '../../../styles/colors'
import stylesFunc from './styles'
import { useSelector } from 'react-redux'
import P2pProductComp from '../../../Components/P2pProductComp'
import imagePath from '../../../constants/imagePath'
import { moderateScale, moderateScaleVertical } from '../../../styles/responsiveSize'
import { showError } from '../../../utils/helperFunctions'
import navigationStrings from '../../../navigation/navigationStrings'
import { useDarkMode } from 'react-native-dynamic'
import { MyDarkTheme } from '../../../styles/theme'

export default function RentTypeList({ route, navigation }) {
    console.log(route, "<===route")
    const { appData, currencies, languages, appStyle, themeColors, themeToggle, themeColor } = useSelector(
        state => state?.initBoot,
    );
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFunc({ fontFamily, themeColors })
    const paramData = route?.params

    const [orderHistory, setOrderHistory] = useState([])
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [isRefreshing, setisRefreshing] = useState(false);
    const [pageNo, setpageNo] = useState(1);
    const [isLoadMore, setisLoadMore] = useState(true);


    useEffect(() => {
        getOrders()
    }, [])

    const getOrders = (pageNo = 1) => {
        actions
            .getAllP2pOrders(
                `?limit=${12}&page=${pageNo}&type=${paramData?.type}&user_type=${paramData?.userType}`,
                {},
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,

                },
            )
            .then(res => {
                console.log(res, '<===res getAllP2pOrders');
                console.log(res, '<===res getAllP2pOrders');
                setIsLoadingOrders(false);
                setOrderHistory(
                    pageNo === 1
                        ? res?.data?.data
                        : [...orderHistory, ...res?.data?.data],
                );
                setisRefreshing(false);
                if (res?.data?.current_page === res?.data?.last_page) {
                    setisLoadMore(false);
                }
            })
            .catch(errorMethod);
    }


    const errorMethod = (error) => {
        setisRefreshing(false);
        setIsLoadingOrders(false);
        showError(error?.message || error?.error);
    }


    const onEndReached = () => {
        if (isLoadMore) {
            setpageNo(pageNo + 1);
            getOrders(pageNo + 1);
        }
    };


    const handleRefresh = () => {
        setisRefreshing(true);
        setpageNo(1);
        setisLoadMore(true);
        getOrders(1);
    };

    const renderItem = useCallback(
        ({ item }) => {
            return <P2pProductComp item={item} isMoreDetails={true} onViewDetails={() => navigation.navigate(navigationStrings.P2P_ORDER_DETAIL, {
                order_id: item?.order_id
            })} />
        },
        [],
    )

    const ListEmptyComp = () => <View
        style={styles.emptyContainer}>
        {
            !isLoadingOrders && <Image
                source={imagePath.noDataFound3}
                style={{
                    height: moderateScale(300),
                    width: moderateScale(300),
                }}
            />
        }
    </View>

    const ItemSeparatorComponent = () => <View
        style={{
            height: moderateScaleVertical(12),
        }}
    />


    return (
        <WrapperContainer isLoading={isLoadingOrders} bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white} >
            <OoryksHeader leftTitle={`${paramData?.type === "upcoming" ? "Upcoming" : "Ongoing"} Rents`} />
            <View style={{
                height: 1,
                backgroundColor: colors.textGreyO
            }} />
            <View style={{
                flex: 1,
                paddingTop: moderateScaleVertical(32)
            }}>
                <Text style={{ ...styles.titleTxt, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>As {paramData?.userType === "borrower" ? "Borrower" : "Lender"}</Text>
                <FlatList
                    data={orderHistory}
                    renderItem={renderItem}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            tintColor={themeColors.primary_color}
                        />
                    }
                    ItemSeparatorComponent={ItemSeparatorComponent}
                    ListEmptyComponent={ListEmptyComp}
                />
            </View>
        </WrapperContainer>
    )
}
