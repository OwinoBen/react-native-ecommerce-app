import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import colors from '../../styles/colors';

import stylesFunc from './styles';
import BorderTextInputWithLable from '../../Components/BorderTextInputWithLable';
import BorderTextInput from '../../Components/BorderTextInput';
import { moderateScale } from '../../styles/responsiveSize';
import { getItem, setItem } from '../../utils/utils';
import ButtonComponent from '../../Components/ButtonComponent';

export default function DeveloperMode({ navigation }) {
    const currentTheme = useSelector((state) => state.appTheme);
    const { themeColors, themeLayouts } = currentTheme;
    const { appStyle } = useSelector((state) => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;


    const styles = stylesFunc({ themeColors, fontFamily });

    const [state, setState] = useState({
        baseUrl: '',
        shortCode: ''
    });

    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const { baseUrl, shortCode } = state

    useEffect(() => {
        (async () => {
            const prevCode = await getItem('saveShortCode');
            if (!!prevCode) {
                updateState({ shortCode: prevCode })
            }
        })();
    }, [])

    console.log("shortCodeshortCode",shortCode)

    const onDone = () =>{
        setItem('base_url', baseUrl).then((res)=>{

        })
    }

    return (
        <WrapperContainer
            bgColor={colors.backgroundGreyC}
            statusBarColor={colors.backgroundGreyC}>
            <Header

                centerTitle={'Developer Mode'}
                headerStyle={{ backgroundColor: colors.backgroundGreyC }}
            />

            <View style={styles.headerLine} />
            <View style={{ flex: 1, padding: moderateScale(16) }}>

                <BorderTextInput
                    placeholder='Base URL'
                    value={baseUrl}
                    onChangeText={(val) => updateState({ baseUrl: val })}
                />

                <BorderTextInput
                    placeholder='Short Code'
                    value={shortCode}
                    onChangeText={(val) => updateState({ shortCode: val })}
                    maxLength={6}
                />

                <ButtonComponent 
                btnText={'DONE'}
                onPress={onDone}
                />
            </View>


        </WrapperContainer>
    );
}
