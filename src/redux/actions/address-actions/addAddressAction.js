import { ADD_ADDRESS_SUCCESS, ADD_ADDRESS_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';
import { useSelector } from "react-redux";

export const addAddress = address => (dispatch, getState) => {
  let params = { action: "add" };
  //api/address?action=add
  return new Promise((resolve, reject) => {
    const api = `${config.baseUrl}/addaddress`
    axios
      .post(api, address)
      .then(res => {
        let successMessage = res.data.body;
        let address = res.data.address;
        dispatch(addAddressSuccess(address, successMessage, tokenConfig(getState)));
        resolve(successMessage);
      })
      .catch(error => {
        dispatch(addAddressFailure(error.data.message));
        reject(error.data.message);
      });
  });
};

const addAddressSuccess = (address, successMessage) => {
  return {
    type: ADD_ADDRESS_SUCCESS,
    payload: {
      address,
      successMessage
    }
  };
};

const addAddressFailure = error => {
  return {
    type: ADD_ADDRESS_FAILURE,
    payload: {
      error
    }
  };
};
