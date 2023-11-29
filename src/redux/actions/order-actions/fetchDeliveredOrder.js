import {
  FETCH_DELIVERED_ORDER_SUCCESS,
  FETCH_DELIVERED_ORDER_STARTED,
  FETCH_DELIVERED_ORDER_FAILURE
} from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const fetchDeliveredOrders = () => (dispatch, getState) => {
  dispatch(fetchDeliveredOrdersStarted());

  const api = `${config.baseUrl}/fetchdeliveredorder`
  axios
    .post(api, tokenConfig(getState))
    .then(res => {
      let ordersToDeliver = res.data.areaOrders;
      // console.log(res.data)
      dispatch(fetchDeliveredOrdersSuccess(ordersToDeliver));
    })
    .catch(err => {
      dispatch(fetchDeliveredOrdersFailure(err.message));
    });
};

const fetchDeliveredOrdersStarted = () => {
  return {
    type: FETCH_DELIVERED_ORDER_STARTED
  };
};

const fetchDeliveredOrdersSuccess = areaOrders => {
  return {
    type: FETCH_DELIVERED_ORDER_SUCCESS,
    payload: { areaOrders }
  };
};

const fetchDeliveredOrdersFailure = error => {
  return {
    type: FETCH_DELIVERED_ORDER_FAILURE,
    payload: { error }
  };
};
