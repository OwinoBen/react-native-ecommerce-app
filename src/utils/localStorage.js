import { getItem, getUserData } from "./utils";
import store from '../redux/store';
import types from "../redux/types";

const checkLocalStorage = async () => {
    const userData = await getUserData();
    const { dispatch } = store;

    if (userData && !!userData.auth_token) {
        dispatch({
            type: types.LOGIN,
            payload: userData,
        });
    }
    const getAppData = await getItem('appData');
    if (!!getAppData) {
        // setPrimaryColor(getAppData.themeColors.primary_color);
        dispatch({
            type: types.APP_INIT,
            payload: getAppData,
        });
    }
}

export default checkLocalStorage