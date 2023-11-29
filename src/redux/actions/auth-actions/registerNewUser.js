import { REGISTER_USER_FAILURE, REGISTER_USER_SUCCESS } from "./../types";
import axios from "axios";
import config from '../../../config';

export const registerNewUser = user => dispatch => {
  return new Promise((resolve, reject) => {
    const data = {
      body: user
    }
    const api = `${config.baseUrl}/register`
    axios
      .post(api, data)
      .then(res => {
        console.log(res)
        const message = res.data.body;
        const user = res.data.user

        dispatch(registerUserSuccess(user, message));
        resolve(message);
      })
      .catch(err => {
        let errorMessge = err.message;

        dispatch(registerUserFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const registerUserSuccess = (user, successMessage) => {
  return {
    type: REGISTER_USER_SUCCESS,
    payload: {
      user,
      successMessage
    }
  };
};

const registerUserFailure = error => {
  return {
    type: REGISTER_USER_FAILURE,
    payload: {
      error
    }
  };
};
