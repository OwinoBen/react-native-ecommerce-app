//import liraries
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

// create a component
const ButtonImage = ({
    image = '',
    imgStyle = {},
    onPress = () => { },
    btnStyle = {}
}) => {
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector(
        (state) => state?.initBoot,
    );
    return (
        <TouchableOpacity style={{ ...btnStyle }} onPress={onPress}
        >
            <Image
                source={image}
                style={{ ...imgStyle }}
            />
        </TouchableOpacity>
    );
};


export default ButtonImage;
