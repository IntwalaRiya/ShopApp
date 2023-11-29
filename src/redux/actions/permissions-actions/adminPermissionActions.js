import { ADMIN_PERMISSION_SUCCESS, ADMIN_PERMISSION_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';

export const changeAdminPermission = (adminId, isAdmin = null) => (
  dispatch,
  getState
) => {
  return new Promise((resolve, reject) => {
    const api = `${config.baseUrl}/updateadminpermission`
    const params = {
      'Email': adminId,
      'isAdmin': isAdmin
    }
    //let params = { adminId, isAdmin };
    axios
      //api/permissions/addAdmin?adminId=
      .put(api, params, tokenConfig(getState))
      .then(res => {
        let successMessage = res.data.message;
        let admin = res.data.user;

        dispatch(changeAdminPermissionSuccess(admin, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.message;

        dispatch(changeAdminPermissionFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const changeAdminPermissionSuccess = (user, message) => {
  return {
    type: ADMIN_PERMISSION_SUCCESS,
    payload: { user, message }
  };
};

const changeAdminPermissionFailure = error => {
  return {
    type: ADMIN_PERMISSION_FAILURE,
    payload: { error }
  };
};
