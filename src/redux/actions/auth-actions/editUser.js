import { UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE } from "./../types";
import axios from "axios";
import { tokenConfig } from "./tokenConfig";
import config from '../../../config';

export const editUser = user => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const api = `${config.baseUrl}/edituser`
    axios
      .put(api, user)
      .then(res => {
        console.log(res)
        const user = res.data.user;
        const message = res.data.body;

        dispatch(updateUserSuccess(user, message, tokenConfig(getState)));
        resolve(message);
      })
      .catch(err => {
        console.log(err)
        let errorMessge = err.data.body;

        dispatch(updateUserFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const updateUserSuccess = (user, message, token) => {
  return {
    type: UPDATE_USER_SUCCESS,
    payload: {
      user,
      message,
      token
    }
  };
};

const updateUserFailure = error => {
  return {
    type: UPDATE_USER_FAILURE,
    payload: {
      error
    }
  };
};
