import { useFocusEffect } from '@react-navigation/native';
import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState, Fragment } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DatePicker from 'react-native-date-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import { Pagination } from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import Banner from '../Components/Banner';
import GradientButton from '../Components/GradientButton';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import commonStylesFun, { hitSlopProp } from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import {
    height,
    moderateScale,
    moderateScaleVertical,
    textScale,
    width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import {
    addRemoveMinutes,
    getHourAndMinutes,
    tokenConverterPlusCurrencyNumberFormater,
} from '../utils/commonFunction';
import {
    getColorCodeWithOpactiyNumber,
    getImageUrl,
    hapticEffects,
    playHapticEffect,
} from '../utils/helperFunctions';
import BannerLoader from './Loaders/BannerLoader';
import HeaderLoader from './Loaders/HeaderLoader';
import { Calendar, CalendarList } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import BorderTextInputWithLable from './BorderTextInputWithLable';

const Reccuring = ({
    planValues = ["Daily", "Weekly", "Custom", "Alternate Days"],
    weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    quickSelection = ["Weekdays", "Weekends"],
    showCalendar = false,
    reccuringCheckBox = false,
    selectedPlanValues = '',
    selectedWeekDaysValues = [],
    selectedQuickSelectionValue = '',
    minimumDate = moment(new Date()).add('days', 2).format("YYYY-MM-DD"),
    initDate = new Date(),
    start = {},
    end = {},
    period = {},
    disabledDaysIndexes = [],
    selectedDaysIndexes = [],
    recurringDate = new Date(),
    showDateTimeModal = false,
    slectedDate = new Date(),
    updateAddonState = () => { },
}) => {
    const { appData, themeColors, currencies, languages, appStyle, themeColor } =
        useSelector((state) => state?.initBoot);
    const { additional_preferences, digit_after_decimal } =
        appData?.profile?.preferences;
    const fontFamily = appStyle?.fontSizeData;
    const isDarkMode = themeColor;
    const buttonTextColor = themeColors;
    const commonStyles = commonStylesFun({ fontFamily, buttonTextColor });
    // const [variantState, setVariantState] = useState({
    //     planValues: ["Daily", "Weekly", "Custom", "Alternate Days"],
    //     weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    //     quickSelection: ["Weekdays", "Weekends"],
    //     showCalendar: false,
    //     reccuringCheckBox: false,
    //     selectedPlanValues: '',
    //     selectedWeekDaysValues: [],
    //     selectedQuickSelectionValue: '',
    //     minimumDate: new Date().toJSON().slice(0, 10),
    //     initDate: new Date(),
    //     start: {},
    //     end: {},
    //     period: {},
    //     disabledDaysIndexes: [],
    //     selectedDaysIndexes: [],
    //     date: new Date(),
    //     showDateTimeModal: false,
    //     slectedDate: new Date(),
    // })

    // const { planValues, reccuringCheckBox, showCalendar, selectedPlanValues, minimumDate,
    //     weekDays, quickSelection, start, end, period, selectedWeekDaysValues, selectedQuickSelectionValue, initDate,
    //     disabledDaysIndexes, selectedDaysIndexes, date, showDateTimeModal, slectedDate } = variantState
    // const updateAddonState = (data) => { setVariantState((state) => ({ ...state, ...data })) };

    // reccuring 
    const onPlanSelect = (itm) => {
        updateAddonState({ selectedPlanValues: itm === selectedPlanValues ? '' : itm })
        if (itm === 'Daily') {
            updateAddonState({ showCalendar: itm === selectedPlanValues ? false : true })
        } else if (itm === 'Custom') {
            updateAddonState({ showCalendar: itm === selectedPlanValues ? false : true })
        } else if (itm === 'Alternate Days') {
            updateAddonState({ showCalendar: itm === selectedPlanValues ? false : true })
        } else {
            updateAddonState({ showCalendar: false })
        }
        updateAddonState({
            selectedWeekDaysValues: [],
            selectedQuickSelectionValue: '',
            start: {},
            end: {},
            period: {},
            disabledDaysIndexes: [],
            selectedDaysIndexes: [],
            recurringDate: new Date(),
            showDateTimeModal: false,
            slectedDate: new Date(),
        })
    }

    const onSelectDayDelivery = (itm) => {

        let selectedDays = [...selectedWeekDaysValues]

        if (isEmpty(selectedDays)) {
            selectedDays.push(itm)
            updateAddonState({ showCalendar: true })
        } else {
            selectedDays.indexOf(itm) === -1 ?
                insert(itm, selectedDays) :
                selectedDays.splice(selectedDays.indexOf(itm), 1);
        }
        updateAddonState({ selectedWeekDaysValues: selectedDays, selectedQuickSelectionValue: '', period: {}, start: {}, end: {} })
        selectedDays.length < 1 && updateAddonState({ showCalendar: false, disabledDaysIndexes: [], selectedDaysIndexes: [], start: {}, end: {} })
        if (selectedDays.length > 0) {
            const disabledDaysNumber = [...disabledDaysIndexes]
            let selectedDaysNumber = [...selectedDaysIndexes]
            const value = itm === "Mo" ? 1 :
                itm === "Tu" ? 2 :
                    itm === "We" ? 3 :
                        itm === "Th" ? 4 :
                            itm === "Fr" ? 5 :
                                itm === "Sa" ? 6 :
                                    itm === "Su" && 7

            if (isEmpty(selectedDaysNumber)) {
                selectedDaysNumber.push(value)
            } else {
                selectedDaysNumber.indexOf(value) === -1 ?
                    insert(value, selectedDaysNumber) :
                    selectedDaysNumber.splice(selectedDaysNumber.indexOf(value), 1);
            }
            updateAddonState({ selectedDaysIndexes: selectedDaysNumber, period: {}, start: {}, end: {} })

            const weekArr = [1, 2, 3, 4, 5, 6, 7]
            console.log("disabledDaysIndexes =>", disabledDaysIndexes);
            console.log("disabledDaysNumber =>", disabledDaysNumber);
            const numberToDeleteSet = new Set(selectedDaysNumber);
            const newArr = weekArr.filter((name) => {
                // return those elements not in the namesToDeleteSet
                return !numberToDeleteSet.has(name);
            });
            console.log("newArr =>", newArr);

            updateAddonState({ disabledDaysIndexes: newArr })
            getDisabledDays(
                initDate.getMonth(),
                initDate.getFullYear(),
                newArr
            )
        }
    }

    const onSelectQuickSelection = (itm) => {
        if (itm === 'Weekdays') {
            selectedQuickSelectionValue === (itm) ?
                updateAddonState({
                    selectedWeekDaysValues: [], selectedQuickSelectionValue: '', showCalendar: false, disabledDaysIndexes: [],
                    start: {},
                    end: {},
                    period: {},
                })
                :
                (
                    updateAddonState({
                        selectedWeekDaysValues: ["Mo", "Tu", "We", "Th", "Fr"], selectedQuickSelectionValue: itm,
                        showCalendar: true, disabledDaysIndexes: [6, 7], start: {},
                        end: {},
                    }),
                    getDisabledDays(
                        initDate.getMonth(),
                        initDate.getFullYear(),
                        [6, 7]
                    )
                )
        }
        if (itm === 'Weekends') {
            selectedQuickSelectionValue === (itm) ?
                updateAddonState({
                    selectedWeekDaysValues: [], selectedQuickSelectionValue: '', showCalendar: false, disabledDaysIndexes: [],
                    start: {},
                    end: {},
                })
                :
                (
                    updateAddonState({
                        selectedWeekDaysValues: ["Sa", "Su"], selectedQuickSelectionValue: itm, showCalendar: true, disabledDaysIndexes: [1, 2, 3, 4, 5],
                        start: {},
                        end: {},
                        period: {},
                    }),
                    getDisabledDays(
                        initDate.getMonth(),
                        initDate.getFullYear(),
                        [1, 2, 3, 4, 5]
                    )
                )
        }
    }

    const openDateAndTimeModal = (key) => () => {
        updateAddonState({ showDateTimeModal: true });
    };

    const ShowReccuringView = () => {
        const { timestamp: startTimeStamp } = start
        const { timestamp: endTimeStamp } = end
        return (
            <View style={styles.mainView}>
                <Text style={{
                    ...styles.productName,
                    color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    fontFamily: fontFamily.bold,
                }}>
                    Select your plan type
                </Text>
                <View style={styles.elementInRows}>
                    {planValues.map((itm, inx) => {
                        return (
                            <TouchableOpacity key={String(inx)}
                                onPress={() => onPlanSelect(itm)}
                                style={{
                                    backgroundColor: selectedPlanValues === itm ? themeColors.themeMain :
                                        getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 60),
                                    marginHorizontal: moderateScale(6),
                                    marginVertical: moderateScale(6),
                                    paddingHorizontal: moderateScale(16),
                                    paddingVertical: moderateScale(10),
                                    borderRadius: moderateScale(10),
                                }}>
                                <Text style={{
                                    ...styles.productName,
                                    color: isDarkMode
                                        ? colors.black :
                                        MyDarkTheme.colors.white,
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(10)
                                }}>{itm}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                {!isEmpty(selectedPlanValues) &&
                    <View>
                        <View style={{ marginVertical: moderateScaleVertical(8) }}>
                            {
                                selectedPlanValues === 'Daily' || selectedPlanValues === 'Alternate Days' ?
                                    <View style={{ alignItems: 'flex-start' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ ...styles.dateText, marginRight: moderateScale(15) }}>
                                                Select Start Date:
                                            </Text>
                                            <Text style={{
                                                ...styles.productName, fontFamily: fontFamily.medium,
                                                fontSize: textScale(12), textAlign: 'center', marginVertical: moderateScaleVertical(4)
                                            }}>
                                                {startTimeStamp ? moment(startTimeStamp).format('MM/DD/YY') : 'Select Date'}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={{ ...styles.dateText, marginRight: moderateScale(22) }}>
                                                Select End Date:
                                            </Text>
                                            <Text style={{
                                                ...styles.productName, textAlign: 'center', fontFamily: fontFamily.medium,
                                                fontSize: textScale(12), marginVertical: moderateScaleVertical(4)
                                            }}>
                                                {endTimeStamp ? moment(endTimeStamp).format('MM/DD/YY') : 'Select Date'}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ ...styles.dateText, marginRight: moderateScale(48) }}>
                                                Select Time:
                                            </Text>
                                            <TouchableOpacity
                                                onPress={_selectTime}
                                                style={{ flexDirection: 'row', borderWidth: moderateScale(0.2), paddingRight: moderateScale(15) }}>
                                                <Image source={imagePath.clock} style={{ marginRight: moderateScale(8), alignSelf: 'center', marginLeft: moderateScale(4), }} />
                                                <Text style={{
                                                    ...styles.productName, textAlign: 'center', fontFamily: fontFamily.medium,
                                                    fontSize: textScale(12), marginVertical: moderateScaleVertical(4),
                                                }}>
                                                    {recurringDate ? moment(recurringDate).format('LT') : 'Select Time'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    : selectedPlanValues === 'Weekly' ?
                                        <View style={{ alignItems: 'flex-start' }}>
                                            <Text style={[styles.planHeading, {
                                                color: isDarkMode
                                                    ? colors.white :
                                                    MyDarkTheme.colors.black,
                                            }]}>{`Select Day(s) of Delivery`}</Text>
                                            <View style={styles.elementInRows}>
                                                {weekDays.map((itm, inx) => {
                                                    return (
                                                        <TouchableOpacity key={String(inx)}
                                                            onPress={() => onSelectDayDelivery(itm)}
                                                            style={{
                                                                // width: moderateScale(50), 
                                                                backgroundColor: selectedWeekDaysValues.includes(itm) ? themeColors.themeMain :
                                                                    getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 60),
                                                                marginHorizontal: moderateScale(6),
                                                                marginVertical: moderateScale(6),
                                                                paddingHorizontal: moderateScale(16),
                                                                paddingVertical: moderateScale(10),
                                                                borderRadius: moderateScale(10),
                                                            }}>
                                                            <Text style={{
                                                                ...styles.productName,
                                                                color: isDarkMode
                                                                    ? colors.black :
                                                                    MyDarkTheme.colors.white,
                                                                fontFamily: fontFamily.bold,
                                                                fontSize: textScale(10)
                                                            }}>{itm}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                            </View>
                                            <View style={{}}>
                                                <Text style={[styles.planHeading, {
                                                    color: isDarkMode
                                                        ? colors.white :
                                                        MyDarkTheme.colors.black,
                                                }]}>
                                                    Quick Selection
                                                </Text>
                                                <View style={styles.elementInRows}>
                                                    {quickSelection.map((itm, inx) => {
                                                        return (
                                                            <TouchableOpacity key={String(inx)}
                                                                onPress={() => onSelectQuickSelection(itm)}
                                                                style={{
                                                                    backgroundColor: selectedQuickSelectionValue.includes(itm) ? themeColors.themeMain :
                                                                        getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 60),
                                                                    marginHorizontal: moderateScale(6),
                                                                    marginVertical: moderateScale(6),
                                                                    paddingHorizontal: moderateScale(16),
                                                                    paddingVertical: moderateScale(10),
                                                                    borderRadius: moderateScale(10),
                                                                }}>
                                                                <Text style={{
                                                                    ...styles.productName,
                                                                    color: isDarkMode
                                                                        ? colors.black :
                                                                        MyDarkTheme.colors.white,
                                                                    fontFamily: fontFamily.bold,
                                                                    fontSize: textScale(10)
                                                                }}>{itm}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    })}
                                                </View>
                                            </View>
                                        </View>
                                        : selectedPlanValues === 'Custom' &&
                                        <View>
                                            <Text style={[styles.planHeading, {
                                                color: isDarkMode
                                                    ? colors.white :
                                                    MyDarkTheme.colors.black,
                                            }]}>
                                                {`Select Day(s) for monthly delivery`}
                                            </Text>
                                            {/* <BorderTextInputWithLable
                                                label={'Select end Year and Month'}
                                                labelStyle={{
                                                    fontFamily: fontFamily.regular,
                                                    fontSize: textScale(12),
                                                }}
                                                textViewOnly={true}
                                                value={moment(slectedDate).format('YYYY-MM-DD')}
                                                disabled={false}
                                                mainStyle={{ zIndex: -1000, marginTop: moderateScaleVertical(10) }}
                                                onPress={openDateAndTimeModal('slectedDate')}
                                                onPressRight={openDateAndTimeModal('slectedDate')}
                                                rightIcon={imagePath.ic_calendar}
                                                tintColor={colors.blackB}
                                            /> */}
                                        </View>
                            }
                        </View>
                        {showCalendar &&
                            (
                                selectedPlanValues === 'Custom' ?
                                    <Calendar
                                        horizontal={true}
                                        pagingEnabled={true}
                                        calendarWidth={width - moderateScale(38)}
                                        calendarHeight={height / 2.6}
                                        minDate={minimumDate}
                                        onDayPress={(value) => onMonthPress(value)}
                                        renderArrow={_renderArrow}
                                        markingType={'custom'}
                                        markedDates={period}
                                        // markedDates={{
                                        //   '2023-01-16': {selected: true, marked: true},
                                        //   '2023-01-17': {marked: true},
                                        //   '2023-01-19': {disabled: true}
                                        // }}
                                        theme={{
                                            calendarBackground: isDarkMode
                                                ? MyDarkTheme.colors.lightDark
                                                : colors.white,
                                            dayTextColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                                            monthTextColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                                            textDisabledColor: isDarkMode ? colors.whiteOpacity22 : colors.greyA,
                                            textSectionTitleDisabledColor: isDarkMode ? colors.whiteOpacity22 : colors.greyA,
                                        }}
                                    />
                                    :
                                    <Calendar
                                        horizontal={true}
                                        pagingEnabled={true}
                                        calendarWidth={width - moderateScale(38)}
                                        calendarHeight={height / 2.6}
                                        renderArrow={_renderArrow}
                                        hideArrows={false}
                                        onDayPress={(value) => onDayPress(value)}
                                        minDate={minimumDate}
                                        markingType={'period'}
                                        markedDates={period}
                                        theme={{
                                            calendarBackground: isDarkMode
                                                ? MyDarkTheme.colors.lightDark
                                                : colors.white,
                                            dayTextColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                                            monthTextColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                                            textDisabledColor: isDarkMode ? colors.whiteOpacity22 : colors.greyA,
                                            textSectionTitleDisabledColor: isDarkMode ? colors.whiteOpacity22 : colors.greyA,
                                            todayTextColor: isDarkMode ? colors.whiteOpacity22 : colors.greyA
                                        }}
                                        firstDay={1}
                                        disabledDaysIndexes={disabledDaysIndexes}
                                        disableAllTouchEventsForDisabledDays={true}
                                    />
                            )
                        }
                    </View>
                }
            </View>
        )
    }
    function insert(element, array) {
        array.push(element);
        array.sort(function (a, b) {
            const date1 = new Date(a);
            const date2 = new Date(b);
            return date1 - date2;
        });
        return array;
    }
    const toTimestamp = (strDate) => {
        // const dt = moment(strDate).format("X");
        const dt = Date.parse(strDate);
        return dt;
    }
    const getDatesDiff = (start_date, end_date, date_format = "YYYY-MM-DD") => {
        const getDateAsArray = date => {
            return moment(date.split(/\D+/), date_format);
        };
        const diff = getDateAsArray(end_date).diff(getDateAsArray(start_date), "days") + 1;
        const dates = [];
        for (let i = 0; i < diff; i++) {
            const nextDate = getDateAsArray(start_date).add(i, "day");
            // for weekend
            // const isWeekEndDay = nextDate.isoWeekday() > 5;
            // if (!isWeekEndDay)
            dates.push(nextDate.format(date_format))
        }
        return dates;
    };

    const getPeriod = (startTimestamp, endTimestamp, selectedPlanValues, oldperiodo) => {
        const periodo = !isEmpty(oldperiodo) ? { ...oldperiodo } : {}
        let currentTimestamp = startTimestamp
        while (currentTimestamp < endTimestamp) {
            if (selectedPlanValues === ('Weekly')) {
                if (periodo[currentTimestamp]?.disabled === true) {
                    periodo[currentTimestamp] = { color: isDarkMode ? colors.whiteOpacity22 : colors.greyA, startingDay: false, textColor: '#FFFFFF' }
                } else {
                    const dateString = getDateString(currentTimestamp, selectedPlanValues)
                    if (dateString) {
                        periodo[dateString] = {
                            color: currentTimestamp === startTimestamp ? themeColors.primary_color : getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 25),
                            startingDay: currentTimestamp === startTimestamp,
                            textColor: colors.white
                        }
                    }
                }
            } else if (selectedPlanValues === ('Alternate Days')) {
                const dateString = getDateString(currentTimestamp)
                if (!periodo.hasOwnProperty(dateString)) {
                    periodo[dateString] = {
                        color: currentTimestamp === startTimestamp ? themeColors.primary_color : getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 25),
                        startingDay: currentTimestamp === startTimestamp,
                        textColor: colors.white
                    }
                }
            } else {
                const dateString = getDateString(currentTimestamp)
                periodo[dateString] = {
                    color: currentTimestamp === startTimestamp ? themeColors.primary_color : getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 25),
                    startingDay: currentTimestamp === startTimestamp,
                    textColor: colors.white
                }
            }
            currentTimestamp += 24 * 60 * 60 * 1000
        }
        if (selectedPlanValues === ('Weekly')) {
            const dateString = getDateString(endTimestamp, selectedPlanValues)
            if (dateString) {
                periodo[dateString] = {
                    color: themeColors.primary_color,
                    endingDay: true,
                    textColor: colors.white
                }
            }
        } else {
            const dateString = getDateString(endTimestamp, selectedPlanValues)
            periodo[dateString] = {
                color: themeColors.primary_color,
                endingDay: true,
                textColor: colors.white
            }
        }
        return periodo
    }

    const getDateString = (timestamp, selectedPlanValues = '') => {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        let dateString = `${year}-`
        if (month < 10) {
            dateString += `0${month}-`
        } else {
            dateString += `${month}-`
        }
        if (day < 10) {
            dateString += `0${day}`
        } else {
            dateString += day
        }
        if (selectedPlanValues || !isEmpty(selectedPlanValues)) {
            let weekdayNumber = date.getDay()
            weekdayNumber = weekdayNumber === 0 ? weekdayNumber + 7 : weekdayNumber
            console.log("weekdayNumber =>", weekdayNumber);
            if (disabledDaysIndexes.includes(weekdayNumber)) {
                return null;
            } else {
                return dateString
            }
        } else {
            return dateString
        }
    }

    const getDisabledDays = (month, year, daysIndexes) => {
        let pivot = moment().month(month).year(year).startOf('month');
        const end = moment().month(month).year(year).endOf('year');
        let dates = {};
        const disabled = { disabled: true, disableTouchEvent: true };
        while (pivot.isBefore(end)) {
            daysIndexes.forEach((day) => {
                const copy = moment(pivot);
                dates[copy.day(day).format('YYYY-MM-DD')] = disabled;
            });
            pivot.add(7, 'days');
        }
        updateAddonState({ period: dates })
        return dates;
    };

    function insertProperty(obj, key, value) {
        var result = {};
        var counter = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                result[prop] = obj[prop];
                counter++;
            }
        }
        if (!(key in result)) {
            result[key] = value;
        }
        return result;
    };

    const onMonthPress = (dayObj) => {
        const { dateString, day, month, year, } = dayObj

        const periodIsEmpty = isEmpty(period)
        if (periodIsEmpty) {
            const periodo = {
                // [dateString]: {
                //   color: themeColors.primary_color,
                //   selected: true,
                //   marked: true,
                //   textColor: colors.white
                // },
                [dateString]: {
                    customStyles: {
                        container: {
                            backgroundColor: themeColors.primary_color,
                            elevation: 2,
                            borderRadius: moderateScale(5)
                        },
                        text: {
                            color: colors.white
                        }
                    }
                },
            }
            updateAddonState({ period: periodo })
        } else {
            let periodo = { ...period }
            for (var prop in period) {
                if (!period.hasOwnProperty(dateString)) {
                    periodo = {
                        ...periodo,
                        // [dateString]: {
                        //   color: themeColors.primary_color,
                        //   selected: true,
                        //   marked: true,
                        //   textColor: colors.white
                        // }
                        [dateString]: {
                            customStyles: {
                                container: {
                                    backgroundColor: themeColors.primary_color,
                                    elevation: 2,
                                    borderRadius: moderateScale(5)
                                },
                                text: {
                                    color: colors.white
                                }
                            }
                        }
                    }
                } else {
                    delete periodo[dateString]
                }
            }
            console.log("periodo =>", periodo);
            updateAddonState({ period: periodo })
        }
    }

    const getAlternativeDaysOff = (month, year, clickedTimestamp) => {
        let pivot = moment().month(month).year(year).startOf('month');
        const end = moment().month(month).year(year).endOf('year');

        const pivotTimeStamp = moment(pivot).format();
        const startEnd = {
            color: themeColors.primary_color,
            // endingDay: true,
            startingDay: true,
            textColor: colors.white
        }
        const disabled = { disabled: true, disableTouchEvent: true };
        let count = 0
        let dates = {};
        while (pivot.isBefore(end)) {
            const copy = moment(pivot).format('YYYY-MM-DD');
            if (pivot.isSame(clickedTimestamp)) {
                dates[copy] = startEnd
            } else if (moment(pivot).format("YYYY-MM-DD") > moment(clickedTimestamp).format("YYYY-MM-DD")) {
                if (count === 0) {
                    dates[copy] = disabled
                    count = 1
                } else {
                    count = 0
                }
            } else if (moment(pivot).format("YYYY-MM-DD") < moment(clickedTimestamp).format("YYYY-MM-DD")) {
                dates[copy] = disabled
            }
            pivot.add(1, 'days');
        }
        return dates
    }

    const onDayPress = (dayObj) => {
        const { dateString, day, month, year, } = dayObj
        if (selectedPlanValues === ('Daily') || selectedPlanValues === ('Alternate Days')) {
            // timestamp returned by dayObj is in 12:00AM UTC 0, want local 12:00AM
            const statePeriodo = selectedPlanValues === ('Alternate Days') ? { ...period } : {}
            const timestamp = new Date(year, month - 1, day).getTime()
            const newDayObj = { ...dayObj, timestamp }
            // if there is no start day, add start. or if there is already a end and start date, restart
            const startIsEmpty = isEmpty(start)
            if (startIsEmpty || !startIsEmpty && !isEmpty(end)) {
                let periodo
                if (selectedPlanValues === ('Alternate Days')) {
                    periodo = getAlternativeDaysOff(initDate.getMonth(), initDate.getFullYear(), timestamp)
                } else {
                    periodo = {
                        [dateString]: {
                            color: themeColors.primary_color,
                            endingDay: true,
                            startingDay: true,
                            textColor: colors.white
                        },
                    }
                }
                updateAddonState({ start: newDayObj, period: periodo, end: {} })
            } else {
                // if end date is older than start date switch
                const { timestamp: savedTimestamp } = start
                if (savedTimestamp > timestamp) {
                    let periodo
                    periodo = getPeriod(timestamp, savedTimestamp, selectedPlanValues, statePeriodo)
                    updateAddonState({ start: newDayObj, end: start, period: periodo })

                } else {
                    if (savedTimestamp === timestamp) {
                        updateAddonState({ start: {}, end: {}, period: {} })
                    }
                    else {
                        let periodo
                        periodo = getPeriod(savedTimestamp, timestamp, selectedPlanValues, statePeriodo)
                        updateAddonState({ end: newDayObj, start: start, period: periodo })
                    }

                }
            }
        }

        if (selectedPlanValues === ('Weekly')) {
            // timestamp returned by dayObj is in 12:00AM UTC 0, want local 12:00AM
            const statePeriodo = { ...period }
            const timestamp = new Date(year, month - 1, day).getTime()
            const newDayObj = { ...dayObj, timestamp }
            // if there is no start day, add start. or if there is already a end and start date, restart
            const startIsEmpty = isEmpty(start)
            if (startIsEmpty || !startIsEmpty && !isEmpty(end)) {
                const { timestamp: startTimeStamp } = start
                const { timestamp: endTimeStamp } = end
                let periodo1
                if (startTimeStamp !== newDayObj.timestamp && endTimeStamp) {
                    const periodo2 = getDisabledDays(
                        initDate.getMonth(),
                        initDate.getFullYear(),
                        disabledDaysIndexes
                    )
                    periodo1 = insertProperty(periodo2, dateString, {
                        color: themeColors.primary_color,
                        endingDay: true,
                        startingDay: true,
                        textColor: colors.white
                    });
                    updateAddonState({ start: newDayObj, end: {}, period: periodo1 })
                } else {
                    periodo1 = insertProperty(statePeriodo, dateString, {
                        color: themeColors.primary_color,
                        endingDay: true,
                        startingDay: true,
                        textColor: colors.white
                    });
                    updateAddonState({ start: newDayObj, period: periodo1, end: {} })
                }

            }
            else {
                // if end date is older than start date switch
                const { timestamp: savedTimestamp } = start
                if (savedTimestamp > timestamp) {
                    const periodo = getPeriod(timestamp, savedTimestamp, selectedPlanValues, statePeriodo)
                    updateAddonState({ start: newDayObj, end: start, period: periodo })
                }
                else {
                    if (savedTimestamp === timestamp) {
                        updateAddonState({ start: {}, end: {}, period: {} })
                        getDisabledDays(
                            initDate.getMonth(),
                            initDate.getFullYear(),
                            disabledDaysIndexes
                        )
                    }
                    else {
                        const periodo = getPeriod(savedTimestamp, timestamp, selectedPlanValues, statePeriodo)
                        updateAddonState({ end: newDayObj, start: start, period: periodo })
                    }
                }
            }

        }
    }
    const _renderArrow = (direction) => {
        if (direction == 'left') {
            return (
                <Image
                    source={imagePath.icgo3}
                    style={{
                        height: 25,
                        width: 25,
                        tintColor: themeColors.primary_color,
                        transform: [{ scaleX: -1 }],
                    }}
                />
            );
        } else {
            return (
                <Image
                    source={imagePath.icgo3}
                    style={{ height: 25, width: 25, tintColor: themeColors.primary_color }}
                />
            );
        }
    };

    const _onDateChange = (date) => {
        updateAddonState({ slectedDate: date, recurringDate: date, showDateTimeModal: false });
    };

    const _selectTime = () => {
        updateAddonState({ showDateTimeModal: !showDateTimeModal });
    };
    return (
        <View style={{ flex: 1 }}>
            {ShowReccuringView()}
            <DatePicker
                modal={true}
                open={showDateTimeModal}
                date={new Date()}
                textColor={isDarkMode ? colors.white : colors.blackB}
                mode="time"
                // minimumDate={new Date()}
                onCancel={_selectTime}
                onConfirm={(value) => _onDateChange(value)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    productName: {
        color: colors.textGrey,
        fontSize: textScale(18),
        lineHeight: 28,
        fontFamily: fontFamily.medium,
    },

    relatedProducts: {
        color: colors.textGrey,
        fontSize: textScale(18),
        lineHeight: 28,
        fontFamily: fontFamily.medium,
        marginVertical: moderateScaleVertical(10),
    },

    variantLable: {
        color: colors.textGrey,
        fontSize: textScale(12),
        fontFamily: fontFamily.medium,
    },

    modalMainViewContainer: {
        backgroundColor: colors.white,
    },
    modalContainer: {
        marginHorizontal: 0,
        marginBottom: 0,
        marginTop: moderateScaleVertical(height / 10),
        overflow: 'hidden',
    },
    closeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: moderateScaleVertical(10),
    },
    imageStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    cardView: {
        height: height / 3.8,
        width: width,
        overflow: 'hidden',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    productName: {
        color: colors.textGrey,
        fontSize: textScale(14),
        fontFamily: fontFamily.regular,
    },
    mainView: {
        marginVertical: moderateScaleVertical(12),
        paddingHorizontal: moderateScale(12),
    },
    description: {
        color: colors.textGreyB,
        fontSize: textScale(14),
        lineHeight: 22,
        fontFamily: fontFamily.regular,
        textAlign: 'left',
    },
    variantValue: {
        color: colors.black,
        fontSize: textScale(10),
        lineHeight: 22,
        fontFamily: fontFamily.regular,
        paddingRight: moderateScale(4),
    },

    chooseOption: {
        marginBottom: moderateScale(2),
        color: colors.textGreyF,
        fontSize: textScale(9),
        lineHeight: 22,
        fontFamily: fontFamily.regular,
    },
    incDecBtnStyle: {
        borderWidth: 0.4,
        borderRadius: moderateScale(4),
        height: moderateScale(38),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(12),
    },
    variantSizeViewOne: {
        height: moderateScale(30),
        width: moderateScale(30),
        borderRadius: moderateScale(30 / 2),
        alignItems: 'center',
        justifyContent: 'center',
    },
    variantSizeViewTwo: {
        height: moderateScale(40),
        width: moderateScale(40),
        borderRadius: moderateScale(40 / 2),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardViewStyle: {
        alignItems: 'center',
        height: width * 0.6,
        width: width,
        alignItems: 'center',
        height: width * 0.6,
        borderRadius: moderateScale(15),
        width: '100%',
        overflow: 'hidden',
        // marginRight: 20
    },
    dotStyle: { height: 12, width: 12, borderRadius: 12 / 2 },

    dropDownStyle: {
        paddingHorizontal: moderateScale(8),
        borderRadius: moderateScale(4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: moderateScaleVertical(2),
    },
    modalView: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScaleVertical(16),
        paddingBottom: moderateScaleVertical(16),
        borderTopLeftRadius: moderateScale(12),
        borderTopRightRadius: moderateScale(12),
    },
    horizontalLine: {
        width: '100%',
        borderBottomWidth: 1.5,
        marginVertical: moderateScaleVertical(8),
    },
    dateText: {
        color: colors.textGrey,
        textAlign: 'left',
        fontFamily: fontFamily.bold,
        fontSize: textScale(12),
        marginVertical: moderateScaleVertical(4),
    },
    elementInRows: {
        flexDirection: 'row',
        marginVertical: moderateScaleVertical(8),
        flexWrap: 'wrap'
    },
    planHeading: {
        fontFamily: fontFamily.regular,
        fontSize: textScale(12)
    }
});
export default Reccuring;