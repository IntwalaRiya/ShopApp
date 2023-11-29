import { FETCH_CART_STARTED, FETCH_CART_SUCCESS, FETCH_CART_FAILURE } from "./../types";
import { tokenConfig } from "./../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const fetchCartProducts = (id) => (dispatch, getState) => {
  dispatch(fetchCartStarted());
  const params = {
    'User': id
  }
  console.log(params)

  const api = `${config.baseUrl}/fetchcart`
  axios
    .post(api,params)
    .then(res => {
      console.log(res)
      let cart = res.data.cart;
      let totalPrice  =  res.data.TotalPrice;
      console.log(totalPrice)
      dispatch(fetchCartSuccess(cart));
    })
    .catch(err => {
      dispatch(fetchCartFailure(err.message));
    });
};

const fetchCartStarted = () => {
  return {
    type: FETCH_CART_STARTED
  };
};

const fetchCartSuccess = cart => {
  return {
    type: FETCH_CART_SUCCESS,
    payload: { cart }
  };
};

const fetchCartFailure = error => {
  return {
    type: FETCH_CART_FAILURE,
    payload: { error }
  };
};
