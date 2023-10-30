import {
  GET_AVAILABLE_ATTRIBUTES,
  GET_DETAILS_OF_INFLUENCE_CATEGORY,
  GET_INFLUENCER_REFER_EARN_CATEGORIES,
  GET_P2P_CATEGORIES,
  GET_PRODUCT_BY_P2P_CATEGORY,
  SAVE_INFULENCER_INFO,
  SUBMIT_PRODUCT_WITH_ATTRIBUTE,
  VIEW_ALL_CATEGORIES,
} from '../../config/urls';
import { apiGet, apiPost } from '../../utils/utils';
import store from '../store';
const { dispatch } = store;

export function getP2pCategories(data = {}, headers = {}) {
  return apiGet(GET_P2P_CATEGORIES, data, headers);
}

export function getAvailableAttributes(url = '', data = {}, headers = {}) {
  return apiGet(GET_AVAILABLE_ATTRIBUTES + url, data, headers);
}

export function submitProductWithAttributes(data = {}, headers = {}) {
  return apiPost(SUBMIT_PRODUCT_WITH_ATTRIBUTE, data, headers);
}

export function getProductByP2pCategoryId(url = '', data = {}, headers = {}) {
  return apiPost(GET_PRODUCT_BY_P2P_CATEGORY + url, data, headers);
}

export function getInfluencerReferEarnCategories(data = {}, headers = {}) {
  return apiGet(GET_INFLUENCER_REFER_EARN_CATEGORIES, data, headers);
}

export function getDetailsOfSelectedInfluenceCategory(
  url = '',
  data = {},
  headers = {},
) {
  return apiGet(GET_DETAILS_OF_INFLUENCE_CATEGORY + url, data, headers);
}

export function saveInfluencerInfo(data = {}, headers = {}) {
  return apiPost(SAVE_INFULENCER_INFO, data, headers);
}


export function getAllCategories(data = {}, headers = {}) {
  return apiPost(VIEW_ALL_CATEGORIES, data, headers);
}