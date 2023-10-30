import { Dimensions, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
    moderateScale,
    moderateScaleVertical,
    textScale,
} from '../../styles/responsiveSize';
var { height, width } = Dimensions.get('window');
export default () => {
    const styles = StyleSheet.create({
        main: {
            flex: 1,
            paddingHorizontal: 10,
            backgroundColor: 'white',
        },
        container: {
            flex: 1,
            backgroundColor: 'white',
            // marginVertical: 30,
            // borderBottomLeftRadius: 20,
            // borderBottomRightRadius: 20
        },
        scanView: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 15,
            marginTop: 20,
            marginBottom: 15
        },
        scanBtn: {
            width: 80,
            height: 35,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#4287f5',
            // borderTopStartRadius: 20,
            borderRadius: 20,
            // marginBottom: 10
        },
        scanBtnTxt: {
            fontSize: moderateScale(14),
            fontFamily: fontFamily.medium,
            color: 'white'
        },
        closeBtn: { borderRadius: 50, top: 0, right: 0, zIndex: 99999, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' },
        imageStyle: { tintColor: 'black', transform: [{ rotate: '45deg' }], width: 35, height: 35 },
        title: {
            //   width: width,
            //   backgroundColor: "#eee",
            color: "#232323",
            paddingLeft: 8,
            paddingVertical: 4,
            textAlign: "left",
            marginBottom: 10,
            fontSize: moderateScale(18),
            fontFamily: fontFamily.semiBold
        },
        wtf: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 60,
            backgroundColor: colors.lightBlueBackground,
            marginBottom: 10,
            marginHorizontal: 10,
            borderRadius: 5,
            paddingHorizontal: 15
        },
        rowContainer: {
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        rowContainerInner: {
            flexDirection: 'row',
            // width: '100%',
            alignItems: 'center',
            // justifyContent: 'space-between'
        },
        iconImg: {
            width: 18,
            height: 18,
            marginRight: 15
        },
        rightArrowImg: {
            width: 25,
            height: 25,
            marginRight: 15
            // alignSelf: 'flex-end'
        },
        rightArrowBtn: {
            // backgroundColor: 'pink',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            width: 50
        },
        PairedRowView: {
            flex: 1,
            // flexDirection: "row",
            justifyContent: "center",
            // alignItems: "center",
            height: 70,
            backgroundColor: colors.lightBlueBackground,
            marginBottom: 10,
            marginHorizontal: 10,
            borderRadius: 5,
            paddingHorizontal: 10
        },
        PairedRowName: {
            fontSize: moderateScale(15),
            fontFamily: fontFamily.semiBold,
            marginBottom: 5
        },
        PairedRowAdrress: {
            fontSize: moderateScale(14),
            fontFamily: fontFamily.regular,
            color: colors.textGreyOpcaity7
        },
        name: {
            flex: 1,
            textAlign: "left",
            fontFamily: fontFamily.circularRegular,
            fontSize: moderateScale(15),
        },
        address: {
            flex: 1,
            textAlign: "right",
            fontFamily: fontFamily.circularRegular,
            fontSize: moderateScale(14),
        },
        disconnectBtnView: {
            flexDirection: "row",
            justifyContent: 'flex-end',
            marginHorizontal: 15,
            width: 80,
            height: 35,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#4287f5',
            // borderTopStartRadius: 20,
            borderRadius: 20,
        },
        subscription2: {
            width: '80%',
            fontFamily: fontFamily.bold,
            fontSize: moderateScale(19),
            color: colors.blackC,
            // opacity: 0.5,
        },
        unpairBtn: {
            backgroundColor: colors.blueColor,
            width: '100%',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15

        },
        unpairBtnTxt: {
            color: colors.white,
            fontSize: moderateScale(18),
            fontFamily: fontFamily.semiBold
        }
    });
    return styles;
};
