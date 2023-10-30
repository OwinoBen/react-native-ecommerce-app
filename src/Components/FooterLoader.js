import React from 'react';
import { UIActivityIndicator } from 'react-native-indicators';
import colors from '../styles/colors';


const FooterLoader = ({style = {
  size:30,
  color:colors.themeColor
}}) => {
  return (
    <UIActivityIndicator size={style?.size} color={style?.color}/>
  );
};

export default React.memo(FooterLoader);
