import { ADD_PRODUCT_SUCCESS, ADD_PRODUCT_FAILURE } from "../types";
import axios from "axios";
import { tokenConfig } from "../auth-actions/tokenConfig";
import config from '../../../config';

export const addProduct = (product, id) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const params = {
      'product': product,
      'User': id
    }
    const api = `${config.baseUrl}/addproduct`
    axios
      .post(api, product)
      .then(res => {
        let newProduct = res.data.product;
        let successMessage = res.data.message;

        dispatch(addProductSuccess(newProduct, successMessage));
        resolve(successMessage);
      })
      .catch(error => {
        dispatch(addProductFailure(error.message));
        reject(error.message);
      });
  });
};

const addProductSuccess = (product, successMessage) => {
  return {
    type: ADD_PRODUCT_SUCCESS,
    payload: {
      product,
      successMessage
    }
  };
};

const addProductFailure = error => {
  return {
    type: ADD_PRODUCT_FAILURE,
    payload: {
      error
    }
  };
};
