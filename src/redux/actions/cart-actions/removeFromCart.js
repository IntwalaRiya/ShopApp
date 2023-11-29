import { DELETE_FROM_CART_SUCCESS, DELETE_FROM_CART_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const removeFromCart = (userid, cartid) => (dispatch, getState) => {
  console.log(userid, cartid)
  return new Promise((resolve, reject) => {
    let params = { 
      'CartID': cartid,
      'User': userid 
    };
    const api = `${config.baseUrl}/removeproductcart`
    axios
      .post(api, params, tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let cart = res.data.cart;
        let totalPrice = res.data.TotalPrice;
        dispatch(removeFromCartSuccess(cart, totalPrice, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessage = err.message;
        dispatch(removeFromCartFailure(errorMessage));
        reject(errorMessage);
      });
  });
};

const removeFromCartSuccess = (cart, totalPrice, message) => {
  return {
    type: DELETE_FROM_CART_SUCCESS,
    payload: { cart, totalPrice, message }
  };
};

const removeFromCartFailure = error => {
  return {
    type: DELETE_FROM_CART_FAILURE,
    payload: { error }
  };
};
