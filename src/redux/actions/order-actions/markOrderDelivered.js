import { ORDER_DELIVERED_SUCCESS, ORDER_DELIVERED_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const markOrderDelivered = orderId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let params = { 'OrderID': orderId };

    const api = `${config.baseUrl}/maekorderdelivered`
    axios
      .post(api, params , tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        // let order = res.data.order;
        let areaOrders = res.data.DeliveredOrder;

        dispatch(markDeliveredSuccess(areaOrders, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.message;

        dispatch(markDeliveredFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const markDeliveredSuccess = ( areaOrders, message) => {
  return {
    type: ORDER_DELIVERED_SUCCESS,
    payload: { areaOrders, message }
  };
};

const markDeliveredFailure = error => {
  return {
    type: ORDER_DELIVERED_FAILURE,
    payload: { error }
  };
};
