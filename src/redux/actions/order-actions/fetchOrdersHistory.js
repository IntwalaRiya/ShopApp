import {
  FETCH_HISTORY_STARTED,
  FETCH_HISTORY_SUCCESS,
  FETCH_HISTORY_FAILURE
} from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

// to fetch each user's all orders he placed
export const fetchOrdersHistory = (id) => (dispatch, getState) => {
  dispatch(fetchHistoryStarted());
  const params = {
    "User": id
  }
  const api = `${config.baseUrl}/fetchorderhistory`
  axios
    .post(api, params, tokenConfig(getState))
    .then(res => {
      dispatch(fetchHistorySuccess(res.data.orders));
    })
    .catch(err => {
      dispatch(fetchHistoryFailure(err.message));
    });
};

const fetchHistoryStarted = () => {
  return {
    type: FETCH_HISTORY_STARTED
  };
};

const fetchHistorySuccess = historyOrders => {
  return {
    type: FETCH_HISTORY_SUCCESS,
    payload: { historyOrders }
  };
};

const fetchHistoryFailure = error => {
  return {
    type: FETCH_HISTORY_FAILURE,
    payload: { error }
  };
};
