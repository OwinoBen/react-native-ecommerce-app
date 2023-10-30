import store from '../store';
import types from '../types';
const { dispatch } = store;

export function chatRefresh(data = false) {
    dispatch({
        type: types.CHAT_REFRESH,
        payload: data,
    });
}
