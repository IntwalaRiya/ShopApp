import { SHIPPER_PERMISSION_SUCCESS, SHIPPER_PERMISSION_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const changeShipperPermission = (Email, isShipper = null) => (
  dispatch,
  getState
) => {
  return new Promise((resolve, reject) => {
    const api = `${config.baseUrl}/addshipper`
    let params = { 
      'Email' : Email, 
      'isShipper': isShipper 
    };
    axios
      //api/permissions/addShipper?shipperId=
      .put(api, params, tokenConfig(getState))
      .then(res => {
        let successMessage = res.data.message;
        let shipper = res.data.user;

        dispatch(changeShipperPermissionSuccess(shipper, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.message;

        dispatch(changeShipperPermissionFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const changeShipperPermissionSuccess = (user, message) => {
  return {
    type: SHIPPER_PERMISSION_SUCCESS,
    payload: { user, message }
  };
};

const changeShipperPermissionFailure = error => {
  return {
    type: SHIPPER_PERMISSION_FAILURE,
    payload: { error }
  };
};
