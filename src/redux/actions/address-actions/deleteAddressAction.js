import { DELETE_ADDRESS_SUCCESS, DELETE_ADDRESS_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const deleteAddress = addressId => (dispatch, getState) => {
  // request quert params attached to the req header
  let params = {address: addressId };

  return new Promise((resolve, reject) => {
    // Hit /api/address?action=delete&address=addressId
    const api = `${config.baseUrl}/deleteaddress`
    axios
      .post(api, params)
      .then(res => {
        let successMessage = res.data.body;
        let address = res.data.address;
        dispatch(deleteAddressSuccess(address, successMessage, tokenConfig(getState)));
        resolve(successMessage);
      })
      .catch(error => {
        dispatch(deleteAddressFailure(error.body));
        reject(error.message);
      });
  });
};

const deleteAddressSuccess = (address, successMessage) => {
  return {
    type: DELETE_ADDRESS_SUCCESS,
    payload: {
      address,
      successMessage
    }
  };
};

const deleteAddressFailure = error => {
  return {
    type: DELETE_ADDRESS_FAILURE,
    payload: {
      error
    }
  };
};
