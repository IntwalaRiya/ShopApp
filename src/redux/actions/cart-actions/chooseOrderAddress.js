import { CHOOSE_ORDER_ADDRESS_SUCCESS, CHOOSE_ORDER_ADDRESS_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const chooseOrderAddress = (user, address) => (dispatch, getState) => {
  const params = {
    'User': user,
    'AddressID': address
  }
  
  const api = `${config.baseUrl}/chooseaddress`
  axios
    //api/cart/chooseOrderAddress
    .put(api, params, tokenConfig(getState))
    .then(res => {
      let successMessage = res.data.message;
      let cart = res.data.cart;
      let totalPrice = res.data.TotalPrice

      dispatch(chooseOrderAddressSuccess(cart, totalPrice, successMessage));
    })
    .catch(err => {
      let errorMessge = err.message;

      dispatch(chooseOrderAddressFailure(errorMessge));
    });
};

const chooseOrderAddressSuccess = (cart, totalPrice, message) => {
  return {
    type: CHOOSE_ORDER_ADDRESS_SUCCESS,
    payload: { cart, totalPrice, message }
  };
};

const chooseOrderAddressFailure = error => {
  return {
    type: CHOOSE_ORDER_ADDRESS_FAILURE,
    payload: { error }
  };
};
