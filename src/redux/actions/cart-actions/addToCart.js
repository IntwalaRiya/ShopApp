import { ADD_TO_CART_SUCCESS, ADD_TO_CART_FAILURE } from "./../types";
import { tokenConfig } from "./../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const addToCart = (productId, orderQuantity = null, userId) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let params = { 
      'ProductID': productId,
      'OrderQuantity': orderQuantity['orderQuantity'],
      'UserID': userId
    };
    const api = `${config.baseUrl}/addtocart`
    axios
      //api/cart/addToCart?productId=123123132
      .post(api, params, tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let cart = res.data.cart;
        let totalPrice = res.data.TotalPrice.S;
        

        dispatch(addToCartSuccess(cart, totalPrice, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.message;

        dispatch(addToCartFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const addToCartSuccess = (cart, totalPrice, message) => {
  return {
    type: ADD_TO_CART_SUCCESS,
    payload: { cart, totalPrice, message }
  };
};

const addToCartFailure = error => {
  return {
    type: ADD_TO_CART_FAILURE,
    payload: { error }
  };
};
