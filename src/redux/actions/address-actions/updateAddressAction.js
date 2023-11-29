import { EDIT_ADDRESS_SUCCESS, EDIT_ADDRESS_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const editAddress = (address, id) => (dispatch, getState) => {
  let params = {
    action: "edit",
    address: id
  };
  // Hit /api/address/addresses?action=edit&address=id
  return new Promise((resolve, reject) => {
    address["AddressID"] = id
    const api = `${config.baseUrl}/updateaddress`
    axios
      .put(api, address)
      .then(res => {
        let successMessage = res.data.message;
        let address = res.data.address;
        dispatch(editAddressSuccess(address, successMessage, tokenConfig(getState)));
        resolve(successMessage);
      })
      .catch(error => {
        dispatch(editAddressFailure(error.message));
        reject(error.message);
      });
  });
};

const editAddressSuccess = (address, successMessage, token) => {
  return {
    type: EDIT_ADDRESS_SUCCESS,
    payload: {
      address,
      successMessage,
      token
    }
  };
};

const editAddressFailure = error => {
  return {
    type: EDIT_ADDRESS_FAILURE,
    payload: {
      error
    }
  };
};
