import store from '../store';
import types from '../types';
const { dispatch } = store;

export function reloadData(data = false) {
    dispatch({
        type: types.RELOAD_DATA,
        payload: data,
    });
}
