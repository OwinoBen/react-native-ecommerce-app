// import OrderCardComponent from './OrderCardComponent';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {processColor, View, Text, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../../Components/Header';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import NoDataFound from '../../../Components/NoDataFound';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang/index';
import staticStrings from '../../../constants/staticStrings';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';

import {
  height,
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import {
  getColorCodeWithOpactiyNumber,
  showError,
} from '../../../utils/helperFunctions';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../../styles/theme';
import {useFocusEffect} from '@react-navigation/native';

export default function VendorRevenue({navigation, route}) {
  const paramData = route.params;
  // console.log(paramData, 'paramData');

  const currentTheme = useSelector((state) => state.initBoot);
  const {appData, currencies, languages} = useSelector(
    (state) => state.initBoot,
  );
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const {storeSelectedVendor} = useSelector((state) => state?.order);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {themeColors, themeLayouts} = currentTheme;
  const [state, setState] = useState({
    tabBarData: [
      {title: strings.ACTIVE_ORDERS, isActive: true},
      {title: strings.PAST_ORDERS, isActive: false},
      {title: strings.SCHEDULED_ORDERS, isActive: false},
    ],
    selectedTab: strings.ACTIVE_ORDERS,
    activeOrders: [],
    pastOrders: [],
    scheduledOrders: [],
    pageActive: 1,
    pagePastOrder: 1,
    pageScheduleOrder: 1,
    limit: 10,
    isLoading: true,
    isRefreshing: false,
    vendor_list: [],
    selectedVendor: null,
    startDate: null,
    endDate: null,
    displayedDate: moment(),
    xAxis: {
      // valueFormatter: ['2021-07-07', '2021-07-08', '2021-07-09'],
      valueFormatter: [],

      granularityEnabled: true,
      granularity: 1,
    },

    yAxis: {
      left: {
        granularityEnabled: true,
        granularity: 10,
      },
      right: {
        granularityEnabled: true,
        granularity: 100,
      },
    },
    selectedDate: null,
    // mapData: {
    //   barData: {
    //     dataSets: [
    //       {
    //         values: [30, 150, 56],
    //         // values: [
    //         //   {y: [40]},
    //         //   {y: [10]},
    //         //   {y: [30]},
    //         //   {y: [30]},
    //         //   {y: [45]},
    //         //   {y: [67]},
    //         //   {y: [34]},
    //         //   {y: [40]},
    //         //   {y: [10]},
    //         //   {y: [30]},
    //         //   {y: [30]},
    //         //   {y: [45]},
    //         //   {y: [67]},
    //         //   {y: [34]},
    //         //   {y: [34]},
    //         //   {y: [40]},
    //         //   {y: [10]},
    //         //   {y: [30]},
    //         //   {y: [30]},
    //         //   {y: [45]},
    //         //   {y: [67]},
    //         //   {y: [34]},
    //         // ],
    //         label: 'Total Sale',
    //         config: {
    //           colors: [
    //             processColor(getColorCodeWithOpactiyNumber('41A2E6', 20)),
    //           ],
    //           // stackLabels: ['Engineering', 'Sales', 'Marketing'],
    //         },
    //       },
    //     ],
    //   },
    //   lineData: {
    //     dataSets: [
    //       {
    //         values: [20, 100, 50],
    //         label: 'Total Order',

    //         config: {
    //           drawValues: true,
    //           colors: [processColor('green')],
    //           mode: 'LINE',
    //           drawCircles: false,
    //           lineWidth: 1,
    //           axisDependency: 'LEFT',
    //         },
    //       },
    //     ],
    //   },
    // },
    mapData: null,
    barData: {
      dataSets: [
        {
          values: [30, 150, 56],
          label: 'Total Sale',
          config: {
            colors: [processColor(getColorCodeWithOpactiyNumber('41A2E6', 20))],
            // stackLabels: ['Engineering', 'Sales', 'Marketing'],
          },
        },
      ],
    },
    lineData: {
      dataSets: [
        {
          values: [20, 100, 50],
          label: 'Total Order',

          config: {
            drawValues: true,
            colors: [processColor('green')],
            mode: 'LINE',
            drawCircles: false,
            lineWidth: 1,
            axisDependency: 'LEFT',
          },
        },
      ],
    },
    selectedTimeOptions: [
      {id: 1, title: 'Weekly', type: 'weekly'},
      {id: 2, title: 'Monthly', type: 'monthly'},
      {id: 3, title: 'Yearly', type: 'yearly'},
    ],
    selectedTimeOption: null,
  });

  const {
    xAxis,
    mapData,
    yAxis,
    selectedTab,
    isLoading,
    activeOrders,
    pageActive,
    limit,
    isRefreshing,
    vendor_list,
    selectedVendor,
    startDate,
    endDate,
    displayedDate,
    selectedDate,
    selectedTimeOptions,
    selectedTimeOption,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  useEffect(() => {
    // updateState({isLoading: true});
    if (isLoading) {
      _getListOfVendorOrders();
      _getRevnueData();
    }
  }, [isLoading]);

  useEffect(() => {
    if (selectedVendor != null) {
      _getRevnueData();
    }
  }, [selectedTimeOption, selectedVendor]);

  const _getListOfVendorOrders = () => {
    let vendordId = !!storeSelectedVendor?.id
      ? storeSelectedVendor?.id
      : selectedVendor?.id
      ? selectedVendor?.id
      : '';
    actions
      ._getListOfVendorOrders(
        `?limit=${limit}&page=${pageActive}&selected_vendor_id=${vendordId}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          // systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        updateState({
          vendor_list: res.data.vendor_list,
          selectedVendor: !!storeSelectedVendor?.id
            ? storeSelectedVendor
            : !!selectedVendor
            ? selectedVendor
            : res.data.vendor_list.find((x) => x.is_selected),
          isLoading: false,
        });
      })
      .catch(errorMethod);
  };

  const _getRevnueData = () => {
    let data = {};
    data['type'] = selectedTimeOption ? selectedTimeOption?.type : '';
    data['vendor_id'] = selectedVendor ? selectedVendor?.id : '';

    actions
      .getRevenueData(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'res__getRevnueData>>>');
        if (res?.data?.dates.length) {
          updateState({
            isLoading: false,
            xAxis: {
              ...state.xAxis,
              valueFormatter: res?.data?.dates,
            },
            mapData: {
              barData: {
                dataSets: [
                  {
                    values: res?.data?.revenue.length
                      ? res?.data?.revenue.map((i, inx) => {
                          return Number(i);
                        })
                      : [],
                    label: 'Total Sale',
                    config: {
                      colors: [
                        processColor(
                          getColorCodeWithOpactiyNumber('41A2E6', 20),
                        ),
                      ],
                    },
                  },
                ],
              },
              lineData: {
                dataSets: [
                  {
                    values: res?.data?.sales.length
                      ? res?.data?.sales.map((i, inx) => {
                          return Number(i);
                        })
                      : [],
                    label: 'Total Order',

                    config: {
                      drawValues: true,
                      colors: [processColor('green')],
                      mode: 'LINEAR',
                      drawCircles: false,
                      lineWidth: 1,
                      axisDependency: 'LEFT',
                    },
                  },
                ],
              },
            },
          });
        } else {
          updateState({
            isLoading: false,
            mapData: null,
          });
        }
      })
      .catch(errorMethod);
  };

  //error handling
  const errorMethod = (error) => {
    updateState({
      isLoading: false,
    });
    showError(error?.message || error?.error);
  };

  const _reDirectToVendorList = () => {
    navigation.navigate(navigationStrings.VENDORLIST, {
      selectedVendor: selectedVendor,
      allVendors: vendor_list,
      screenType: staticStrings.REVENUE,
    });
  };
  useEffect(() => {
    updateState({
      selectedVendor: storeSelectedVendor,
      isLoading: true,
      pageActive: 1,
    });
  }, [storeSelectedVendor]);

  const setDates = (dates) => {
    updateState({...dates});
  };

  const _selectTime = (item) => {
    {
      selectedTimeOption && selectedTimeOption?.id == item?.id
        ? updateState({selectedTimeOption: null, isLoading: true})
        : updateState({selectedTimeOption: item, isLoading: true});
    }
  };
  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 3  || appStyle?.homePageLayout === 5? imagePath.icBackb : imagePath.back
        }
        centerTitle={selectedVendor?.name || ''}
        showImageAlongwithTitle={true}
        // rightIcon={imagePath.cartShop}
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{...commonStyles.headerTopLine}} />

      {selectedTimeOptions && selectedTimeOptions.length && (
        <View
          style={{
            marginHorizontal: moderateScale(20),
            marginTop: moderateScale(width / 8),
          }}>
          <ScrollView horizontal>
            {selectedTimeOptions.map((i, inx) => {
              return (
                <TouchableOpacity
                  key={String(inx)}
                  onPress={() => _selectTime(i)}
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor:
                      selectedTimeOption && selectedTimeOption?.id == i.id
                        ? themeColors?.primary_color
                        : getColorCodeWithOpactiyNumber(
                            themeColors.primary_color.substr(1),
                            20,
                          ),
                    borderColor: themeColors.primary_color,
                    borderWidth:
                      selectedTimeOption && selectedTimeOption?.id == i.id
                        ? 1
                        : 0,
                    borderRadius: 10,
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.medium,
                      color:
                        selectedTimeOption && selectedTimeOption?.id == i.id
                          ? colors.white
                          : themeColors.primary_color,
                    }}>
                    {i.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
      {/* <DateRangePicker
        // open={isVisibleDatePicker}
        onChange={setDates}
        presetButtons={true}
        // containerStyle={{alignSelf:'center'}}
        endDate={endDate}
        startDate={startDate}
        displayedDate={displayedDate}
        range>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          // onPress={setDates}
        >
          <Text>{selectedDate ? selectedDate : 'Select Date'}</Text>
          <Image
            style={{tintColor: colors.black}}
            source={imagePath.dropDownSingle}
          />
        </View>
      </DateRangePicker> */}

      {/* <LineChart
        style={{flex: 1}}
        data={{dataSets: [{label: 'demo', values: [{y: 1}, {y: 2}, {y: 1}]}]}}
      /> */}
      {!!(mapData && mapData?.barData && mapData?.lineData) ? (
        <Text>Chart</Text>
      ) : (
        // <NoDataFound isLoading={isLoading} containerStyle={{flex: 0.6}} />
        <></>
      )}
    </WrapperContainer>
  );
}
