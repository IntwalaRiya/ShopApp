import {
  FETCH_SINGLE_PRODUCT_STARTED,
  FETCH_SINGLE_PRODUCT_SUCCESS,
  FETCH_SINGLE_PRODUCT_FAILURE
} from "./../types";
import axios from "axios";
import config from '../../../config';

export const fetchSingleProductAction = id => {
  return dispatch => {
    dispatch(fetchSingleProductStarted());
    const api = `${config.baseUrl}/getsingleproduct`
    const param = {
      'ProductID': id
    }
    axios
      .post(api, param)
      .then(res => {
        dispatch(fetchSingleProductSuccess(res.data.product));
      })
      .catch(error => {
        dispatch(fetchSingleProductFailure(error.message));
      });
  };
};

const fetchSingleProductStarted = () => {
  return {
    type: FETCH_SINGLE_PRODUCT_STARTED
  };
};

const fetchSingleProductSuccess = product => {
  return {
    type: FETCH_SINGLE_PRODUCT_SUCCESS,
    payload: {
      product
    }
  };
};

const fetchSingleProductFailure = error => {
  return {
    type: FETCH_SINGLE_PRODUCT_FAILURE,
    payload: {
      error
    }
  };
};
