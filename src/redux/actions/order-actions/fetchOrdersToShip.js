import {
  FETCH_ORDERS_TO_SHIP_STARTED,
  FETCH_ORDERS_TO_SHIP_SUCCESS,
  FETCH_ORDERS_TO_SHIP_FAILURE
} from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const fetchordersToShip = () => (dispatch, getState) => {
  dispatch(fetchordersToShipStarted());
  const api = `${config.baseUrl}/fetchconfirmedorder`
  axios
    .post(api, tokenConfig(getState))
    .then(res => {
      let ordersToShip = res.data.OrdersToShip;
      // console.log(ordersToShip)
      dispatch(fetchordersToShipSuccess(ordersToShip));
    })
    .catch(err => {
      dispatch(fetchordersToShipFailure(err.message));
    });
};

const fetchordersToShipStarted = () => {
  return {
    type: FETCH_ORDERS_TO_SHIP_STARTED
  };
};

const fetchordersToShipSuccess = ordersToShip => {
  return {
    type: FETCH_ORDERS_TO_SHIP_SUCCESS,
    payload: { ordersToShip }
  };
};

const fetchordersToShipFailure = error => {
  return {
    type: FETCH_ORDERS_TO_SHIP_FAILURE,
    payload: { error }
  };
};
