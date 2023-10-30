//import liraries
import { isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import Header from '../../../Components/Header';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import { moderateScaleVertical } from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import styles from './styles';
import moment from 'moment';
import { dialCall } from '../../../utils/openNativeApp';




// create a component
const TechnicianProfile = ({ route }) => {
    const darkthemeusingDevice = useDarkMode();
    const { themeColor, themeToggle, } = useSelector((state) => state?.initBoot || {})
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const paramData = route?.params?.data?.driverData;


    const renderItem = useCallback(
        ({ item, index }) => {
            return (
                <View >
                    <View style={{ flexDirection: 'row', marginTop: moderateScaleVertical(28), alignItems: 'center' }}>
                        <Image style={styles.imgStyle}
                            source={imagePath.star} />
                        <Text style={{ ...styles.ratingTex, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{item?.rating} {strings.OUT_OF_FIVE}</Text>
                    </View>
                    {!!item?.review && <Text style={styles.commentText}>{item?.review}</Text>}

                    <View>

                        <Text style={{ ...styles.dateText, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{moment(item?.created_at).format("DD MMMM YYYY")}</Text>

                    </View>

                </View>
            )

        },
        [],
    )




    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
            <Header centerTitle={strings.TECHNICIAN_PROFILE} />

            <ScrollView>
                <View style={styles.firstView}>
                    <View style={styles.firstViewStyle}>
                        <View style={styles.nameView}>

                            <Text style={{ ...styles.nameStyle, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{paramData?.name || paramData?.agent?.name}</Text>
                            <Text style={{ ...styles.nameText, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{strings.JOBS_DONE} {paramData?.complete_order_count || paramData?.total_order_by_agent}</Text>
                            <View style={styles.viewStyle}>
                                <Text style={{ ...styles.ratingStyle, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{Number(paramData?.rating || paramData?.avgrating || 0).toFixed(2)} </Text>
                                <StarRating
                                    maxStars={5}
                                    rating={Number(paramData?.rating || paramData?.avgrating || 0)}
                                    fullStarColor={colors.green}
                                    starSize={15}
                                />

                            </View>
                        </View>
                        {/* <View style={styles.firstLine} /> */}
                        <FastImage style={styles.firstLine} source={{
                            uri: paramData?.image_url || paramData?.agent_image
                        }} />
                    </View>


                    <View style={styles.lineStyle} />

                    {
                        !!(paramData?.phone_number || paramData?.agent?.phone_number) && <TouchableOpacity onPress={() => dialCall(paramData?.phone_number || paramData?.agent?.phone_number)} style={styles.callStyle}>
                            <Image source={imagePath.call} />
                            <Text style={styles.callText}>{paramData?.phone_number || paramData?.agent?.phone_number}</Text>
                        </TouchableOpacity>

                    }
                    {!isEmpty(paramData?.agent_rating || paramData?.agent_ratings) ? <View style={{ marginTop: moderateScaleVertical(28), marginBottom: moderateScaleVertical(48) }}>
                        <Text style={styles.revText}> {paramData?.agent_rating?.length || paramData?.agent_ratings?.length} Reviews</Text>
                        <View>
                            <FlatList data={paramData?.agent_rating || paramData?.agent_ratings || []} renderItem={renderItem} />
                        </View>
                    </View> : <View style={{
                        alignItems: "center",
                        marginTop: moderateScaleVertical(20)
                    }}>
                        <Text style={{
                            color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                        }}>{strings.NO_REVIEWS_YET}</Text></View>}
                </View>
            </ScrollView>
        </WrapperContainer>
    );
};

export default TechnicianProfile;

