import {
  FETCH_ADDRESSES_STARTED,
  FETCH_ADDRESSES_SUCCESS,
  FETCH_ADDRESSES_FAILURE
} from "../types";
import { tokenConfig } from "./../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';
import { useSelector } from "react-redux";

export const fetchAddresses = (id) => (dispatch, getState) => {
  
  return new Promise((resolve, reject) =>{
    
    const params = {
      "User": id
    }
    // dispatch(fetchAddressesStarted());
    const api = `${config.baseUrl}/getaddresses`
    axios
      .post(api, params)
      .then(res => {
        console.log(res)
        dispatch(fetchAddressesSuccess(res.data.address, tokenConfig(getState)));
      })
      .catch(err => {
        dispatch(fetchAddressesFailure(err.message));
      });
  }
)};

const fetchAddressesStarted = () => {
  return {
    type: FETCH_ADDRESSES_STARTED
  };
};

const fetchAddressesSuccess = addresses => {
  return {
    type: FETCH_ADDRESSES_SUCCESS,
    payload: {
      addresses
    }
  };
};

const fetchAddressesFailure = error => {
  return {
    type: FETCH_ADDRESSES_FAILURE,
    payload: {
      error
    }
  };
};
