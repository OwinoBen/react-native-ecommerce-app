import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { moderateScale, moderateScaleVertical } from '../../../styles/responsiveSize';
import WrapperContainer from '../../../Components/WrapperContainer';
import colors from '../../../styles/colors';
import { getColorCodeWithOpactiyNumber, showError } from '../../../utils/helperFunctions';
import { useIsFocused } from "@react-navigation/native";
import { isEmpty } from 'lodash';
import { useDarkMode } from 'react-native-dynamic';
import { UIActivityIndicator } from 'react-native-indicators';
import { useSelector } from 'react-redux';
import BidAcceptRejectCard from '../../../Components/BidAcceptRejectCard';
import Header from '../../../Components/Header';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import { MyDarkTheme } from '../../../styles/theme';
import moment from 'moment';
import useInterval from '../../../utils/useInterval';



export default function BidingDriversList(props) {
  const { route, navigation } = props
  const { lastBidInfo } = useSelector((state) => state?.home);

  const paramData = route?.params?.data?.paramData || lastBidInfo?.bidData
  const {
    appData,
    currencies,
    languages,
    themeColors,
    appStyle,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot);
  const {
    notificationForBide
  } = useSelector((state) => state?.order);

  const fontFamily = appStyle?.fontSizeData;
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const [allDriverBidesList, setAllDriverBidesList] = useState([])
  const [bidExpiryTime, setBidExpiryTime] = useState(0)
  let endDate = new Date(lastBidInfo?.expiryTime);
  let startDate = new Date();

  useEffect(() => {
    _onOrderBidRideDetails()
  }, [notificationForBide])

  useEffect(() => {
    let timeDiffInSeconds = (endDate.getTime() - startDate.getTime()) / 1000;
    if (bidExpiryTime != 0 || (timeDiffInSeconds > 0 && !!lastBidInfo)) {
      let timer = setTimeout(() => {
        if (isEmpty(allDriverBidesList)) {
          showError("Bid expired!")
          onPressLeft()
        }
      }, !!lastBidInfo ? timeDiffInSeconds * 1000 : Number(Number(bidExpiryTime) * 1000));
      return () => clearTimeout(timer)
    }
  }, [bidExpiryTime])

  const _onOrderBidRideDetails = () => {
    const data = {
      order_id: paramData?.apiResponseData?.id || null,
      task_type: 'bid_ride_request'
    }

    const headerData = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }
    actions.orderRideBidDetails(data, headerData).then((res) => {
      setAllDriverBidesList(res?.data?.biddata)
      if (!lastBidInfo) {
        var bidExpiryTime = new Date();
        bidExpiryTime.setSeconds(bidExpiryTime.getSeconds() + Number(res?.data?.bid_expire_time_limit_seconds));
        actions.saveBidInAsync({
          bidData: paramData,
          expiryTime: bidExpiryTime
        })
      }
      setBidExpiryTime(Number(res?.data?.bid_expire_time_limit_seconds))
    }).catch((error) => {
      showError(error?.message)
    })
  }


  const _onDeclineRideBid = (id) => {
    const apiData = {
      bid_id: id
    }
    const headerData = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }
    actions.declineRideBid(apiData, headerData).then((res) => {
      _onOrderBidRideDetails()
    }).catch((error) => {
      showError(error?.message)
    })
  }

  const _onAcceptRideBid = (bidData) => {
    const apiData = {
      bid_id: bidData?.id,
    }
    const headerData = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }

    actions.acceptRideForBid(apiData, headerData).then((res) => {
      navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
        ...paramData,
        bidData: bidData,
        showPaymentModal: true,
      });
    }).catch((error) => {
      showError(error?.message)
    })
  }

  const onPressLeft = () => {
    actions.clearLastBidData()
    if (!lastBidInfo) {
      navigation.goBack()
    }
    else {
      navigation.navigate(navigationStrings.TAXIHOMESCREEN)
    }
  }

  const renderDriverListCard = useCallback(({ item, index }) => {
    return (
      <BidAcceptRejectCard
        data={item}
        bidExpiryDuration={bidExpiryTime}
        _onDeclineBid={_onDeclineRideBid}
        _onAcceptRideBid={_onAcceptRideBid}
      />
    )
  }, [allDriverBidesList, bidExpiryTime])

  return (
    <WrapperContainer>
      <Header
        leftIcon={imagePath.backArrow}
        centerTitle={strings.ALL_BIDS}
        onPressLeft={onPressLeft}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.white }
        }
      />
      {isEmpty(allDriverBidesList) &&
        <View style={{
          justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: getColorCodeWithOpactiyNumber(themeColors?.primary_color.substring(1), 20),
          paddingVertical: moderateScaleVertical(5)
        }}>
          <Text
            style={{
              color: themeColors?.primary_color,
              fontFamily: fontFamily?.bold,
            }}
          >
            {strings.WAITING_FOR_DRIVER_BIDS}
          </Text>
          <UIActivityIndicator size={20} color={themeColors?.primary_color} style={{ flex: 0.2 }} />
        </View>

      }

      <FlatList
        showsVerticalScrollIndicator={false}
        data={allDriverBidesList}
        renderItem={renderDriverListCard}
        ListFooterComponent={() => (
          <View style={{ marginLeft: moderateScale(16) }} />
        )}
        ListHeaderComponent={() => (
          <View style={{ marginRight: moderateScale(16) }} />
        )}
      />
    </WrapperContainer>
  )
}