import { useFocusEffect } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import { useSelector } from 'react-redux';
import Header2 from '../../../Components/Header2';
import P2pProductComp from '../../../Components/P2pProductComp';
import SwitchableTabs from '../../../Components/SwitchableTabs';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';

import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../../styles/responsiveSize';
import stylesFunc from './styles';
import navigationStrings from '../../navigation/navigationStrings';
import { showError } from '../../utils/helperFunctions';
import { MyDarkTheme } from '../../styles/theme';
import { useDarkMode } from 'react-native-dynamic';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';

export default function P2pOndemandMyOrders({ navigation }) {
  const { appData, currencies, languages, appStyle, themeColors, themeToggle, themeColor } = useSelector(
    state => state?.initBoot,
  );

  const { userData } = useSelector((state) => state?.auth);
  const { location } = useSelector(state => state?.home);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const { preferences } = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, themeColors })

  const [tabsData, setTabsData] = useState([
    {
      id: 1,
      title: 'All',
    },
    {
      id: 2,
      title: 'Upcoming rents',
    },
    {
      id: 3,
      title: 'Ongoing rents',
    },
  ]);
  const [selectedTab, setSelectedTab] = useState({
    id: 1,
    title: 'All',
  });
  const [orderHistory, setOrderHistory] = useState([]);
  const [isRefreshing, setisRefreshing] = useState(false);
  const [pageNo, setpageNo] = useState(1);
  const [isLoadMore, setisLoadMore] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [upcomingOngoingOrders, setUpcomingOngoingOrders] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (!userData?.auth_token) {
        actions.setAppSessionData('on_login');
        return;
      }
      if (selectedTab?.id == 1) {
        getOrders();
      }
      else {
        getOngoingAndUpcomingOrders(selectedTab);
      }
    }, []),
  );

  const onChangeTab = type => {
    setSelectedTab(type);
    setpageNo(1);
    if (type?.id == 1) {
      getOrders(1, 'all');
    } else {
      getOngoingAndUpcomingOrders(type);
    }
  };

  const handleRefresh = () => {
    setisRefreshing(true);
    setpageNo(1);
    setisLoadMore(true);
    if (selectedTab?.id == 1) {
      getOrders(1, 'all');
    } else {
      getOngoingAndUpcomingOrders(selectedTab);
    }
  };
  const onEndReached = () => {
    if (isLoadMore) {
      setpageNo(pageNo + 1);
      getOrders(pageNo + 1);
    }
  };

  const getOngoingAndUpcomingOrders = type => {
    setIsLoadingOrders(true)
    actions.getUpcomingAndOngoingOrders(
      `?type=${type?.id == 2 ? 'upcoming' : 'ongoing'}`,
      {},
      {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      },
    )
      .then(res => {
        console.log(res, '<===res getUpcomingAndOngoingOrders');
        setIsLoadingOrders(false)
        setUpcomingOngoingOrders(res?.data);

      })
      .catch(errorMethod);
  };

  const getOrders = (pageNo = 1, type = 'all') => {
    setIsLoadingOrders(true);
    actions
      .getAllP2pOrders(
        `?limit=${12}&page=${pageNo}&type=${type}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          timezone: RNLocalize.getTimeZone(),
          latitude: location?.latitude.toString() || '',
          longitude: location?.longitude.toString() || '',
        },
      )
      .then(res => {
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
  };

  const errorMethod = (error) => {
    setisRefreshing(false);
    setIsLoadingOrders(false);
    showError(error?.message || error?.error);
  }

  const renderOrders = useCallback(
    ({ item }) => {
      return <P2pProductComp item={item} onViewDetails={() => navigation?.navigate(navigationStrings.P2P_ORDER_DETAIL, {
        order_id: item?.order_id
      })} />;
    },
    [orderHistory, selectedTab],
  );

  const renderUpcomingOngoingOrders = useCallback(
    ({ item }) => {
      return <P2pProductComp item={item} onViewDetails={() => navigation?.navigate(navigationStrings.P2P_ORDER_DETAIL, {
        order_id: item?.order_id
      })} />;
    },
    [upcomingOngoingOrders],
  );

  const ListEmptyComp = () => <View
    style={styles.emptyContainer}>
    <Image
      source={imagePath.noDataFound3}
      style={{
        height: moderateScale(300),
        width: moderateScale(300),
      }}
    />
  </View>

  const ItemSeparatorComponent = () => <View
    style={{
      height: moderateScaleVertical(12),
    }}
  />

  const HeaderView = ({ leftText = "", onPressRight = () => { } }) => <View
    style={styles.headerContainer}>
    <Text
      style={{ ...styles.leftText, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
      {leftText}
    </Text>
    <TouchableOpacity onPress={onPressRight}>
      <Text
        style={styles.rightTxt}>
        {strings.VIEW_ALL}
      </Text>
    </TouchableOpacity>
  </View>



  return (
    <WrapperContainer isLoading={isLoadingOrders} bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white} >
      <Header2
        centerTitle="Orders"
        textStyle={{
          fontFamily: fontFamily?.medium,
          fontSize: textScale(16),
        }}
      />
      <View
        style={{
          height: 1,
          backgroundColor: colors.textGreyO,
        }}
      />
      <SwitchableTabs
        tabsData={tabsData}
        selectedTab={selectedTab}
        onChangeTab={onChangeTab}
        mainContainerStyle={{
          marginHorizontal: moderateScale(10),
          marginVertical: moderateScaleVertical(20),
        }}
      />

      <View
        style={{
          flex: 1,
        }}>
        {selectedTab?.id == 1 ? (
          <FlatList
            data={orderHistory}
            renderItem={renderOrders}
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
        ) : (
          <View style={{ flex: 1 }}>
            {!isEmpty(upcomingOngoingOrders?.lender) ||
              !isEmpty(upcomingOngoingOrders?.borrower) ? (
              <View>
                {!isEmpty(upcomingOngoingOrders?.lender) && (
                  <View>
                    <HeaderView leftText={strings.AS_LENDER} onPressRight={() => navigation.navigate(navigationStrings.RENT_TYPE_LISTING, {
                      userType: "lender",
                      type: selectedTab?.id == 2 ? "upcoming" : "ongoing"
                    })} />
                    <FlatList
                      data={upcomingOngoingOrders?.lender}
                      renderItem={renderUpcomingOngoingOrders}
                      refreshControl={
                        <RefreshControl
                          refreshing={isRefreshing}
                          onRefresh={handleRefresh}
                          tintColor={themeColors.primary_color}
                        />
                      }
                      ItemSeparatorComponent={ItemSeparatorComponent}
                    />
                  </View>
                )}

                {!isEmpty(upcomingOngoingOrders?.borrower) && (
                  <View>
                    <HeaderView leftText={strings.AS_BORROWER} onPressRight={() => navigation.navigate(navigationStrings.RENT_TYPE_LISTING, {
                      userType: "borrower",
                      type: selectedTab?.id == 2 ? "upcoming" : "ongoing"
                    })} />
                    <FlatList
                      data={upcomingOngoingOrders?.borrower}
                      renderItem={renderUpcomingOngoingOrders}
                      refreshControl={
                        <RefreshControl
                          refreshing={isRefreshing}
                          onRefresh={handleRefresh}
                          tintColor={themeColors.primary_color}
                        />
                      }
                      ItemSeparatorComponent={ItemSeparatorComponent}
                    />
                  </View>
                )}
              </View>
            ) : <ListEmptyComp />}
          </View>
        )}
      </View>
    </WrapperContainer>
  );
}
