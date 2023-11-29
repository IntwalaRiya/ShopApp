import { CHANGE_CART_QUANTITY_SUCCESS, CHANGE_CART_QUANTITY_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const changeCartQuantity = (user, cartId, orderQuantity = null) => (
  dispatch,
  getState
) => {
  return new Promise((resolve, reject) => {
    const api = `${config.baseUrl}/addtocart`
    let params = { 
      'User': user,
      'CartID': cartId,
      'OrderQuantity': orderQuantity['orderQuantity']
    };
    axios
      //api/cart/changeQuantityFromCart?productId=
      .put(
        api,
        params,
        tokenConfig(getState, params)
      )
      .then(res => {
        let successMessage = res.data.message;
        let cart = res.data.cart;
        let totalPrice = res.data.TotalPrice

        dispatch(changeCartQuantitySuccess(cart, totalPrice, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.message;

        dispatch(changeCartQuantityFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const changeCartQuantitySuccess = (cart, totalPrice, message) => {
  return {
    type: CHANGE_CART_QUANTITY_SUCCESS,
    payload: { cart, totalPrice, message }
  };
};

const changeCartQuantityFailure = error => {
  return {
    type: CHANGE_CART_QUANTITY_FAILURE,
    payload: { error }
  };
};
