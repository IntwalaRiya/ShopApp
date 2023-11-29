import { PLACED_ORDER_SUCCESS, PLACED_ORDER_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const placeOrder = (id) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const params = {
      'User': id
    }

    const api = `${config.baseUrl}/ordersuccess`
    axios
      .put(api, params, tokenConfig(getState))
      .then(res => {
        let successMessage = res.data.message;
        let cart = res.data.cart;
        dispatch(placeOrderSuccess(cart, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.message;
        dispatch(placeOrderFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const placeOrderSuccess = (cart, message) => {
  return {
    type: PLACED_ORDER_SUCCESS,
    payload: { cart, message }
  };
};

const placeOrderFailure = error => {
  return {
    type: PLACED_ORDER_FAILURE,
    payload: { error }
  };
};
