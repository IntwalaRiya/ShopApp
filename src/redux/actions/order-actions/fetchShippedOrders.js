import {
  FETCH_SHIPPED_ORDERS_STARTED,
  FETCH_SHIPPED_ORDERS_SUCCESS,
  FETCH_SHIPPED_ORDERS_FAILURE
} from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const fetchShippedOrders = () => (dispatch, getState) => {
  dispatch(fetchShippedOrdersStarted());


  const api = `${config.baseUrl}/fetchshippedorder`
  axios
    .post(api, tokenConfig(getState))
    .then(res => {
      // console.log(res.data.ShippedOrders)
      let shippedOrders = res.data.ShippedOrders;
      dispatch(fetchShippedOrdersSuccess(shippedOrders));
    })
    .catch(err => {
      dispatch(fetchShippedOrdersFailure(err.message));
    });
};

const fetchShippedOrdersStarted = () => {
  return {
    type: FETCH_SHIPPED_ORDERS_STARTED
  };
};

const fetchShippedOrdersSuccess = shippedOrders => {
  return {
    type: FETCH_SHIPPED_ORDERS_SUCCESS,
    payload: { shippedOrders }
  };
};

const fetchShippedOrdersFailure = error => {
  return {
    type: FETCH_SHIPPED_ORDERS_FAILURE,
    payload: { error }
  };
};
