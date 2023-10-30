import {
    WALLET_USER_VERIFY,
    WALLET_TRANSFER_CONFIRM
} from '../../config/urls';
import { apiPost } from '../../utils/utils';

export function walletUserVerify(data = {}, headers = {}) {
    return apiPost(WALLET_USER_VERIFY, data, headers)
}

export function walletTransferConfirm(data = {}, headers = {}) {
    return apiPost(WALLET_TRANSFER_CONFIRM, data, headers)
}
