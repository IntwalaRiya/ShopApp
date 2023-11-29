import { USER_LOADING, USER_LOADED, AUTH_ERROR } from "./../types";
import { tokenConfig } from "./tokenConfig";
import axios from "axios";
import config from '../../../config';
/*
 * this function to load the user with a specific token given from the frontend
 * in the request header cause JWT is stateless and we have to load the user
 * from the token in every refresh to the website
 * call this function in app.js before any render in useEffect
 */
export const loadUser = (id=null) => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
  const params = {
    'Email': id
  }

  const api = `${config.baseUrl}/user`
  axios
    .post(api, params, tokenConfig(getState))
    .then(res => {
      console.log(res.data.user)
      dispatch(userLoadedSuccess(res.data.user));
    })
    .catch(error => {
      dispatch(userLoadedFailure(error));
    });
};

const userLoadedSuccess = user => {
  return {
    type: USER_LOADED,
    payload: { user }
  };
};

const userLoadedFailure = error => {
  return {
    type: AUTH_ERROR,
    payload: { error }
  };
};
