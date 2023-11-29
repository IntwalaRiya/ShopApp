import { LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE } from "./../types";
import axios from "axios";
import config from '../../../config';

export const login = user => dispatch => {
  const data = {
    body: user
  }
  return new Promise((resolve, reject) => {
    const api = `${config.baseUrl}/login`
    axios.post(api, data)
      .then(res => {
        const message = res.data.body;
        const user = res.data.user
        console.log(user)
        if (res.data.statusCode == 200){
          dispatch(loginUserSuccess(user, message));
          resolve(message);
        }
        else{
          dispatch(loginUserFailure(message));
          reject(message);
        }
      })
      .catch(err => {
        let error = err.body;
        dispatch(loginUserFailure(error));
        reject(error);
      });
  });
};

const loginUserSuccess = (user, message) => {
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      user,
      message
    }
  };
};

const loginUserFailure = error => {
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      error
    }
  };
};
