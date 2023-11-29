import { DELETE_CATEGORY_SUCCESS, DELETE_CATEGORY_FAILURE } from "../types";
import axios from "axios";
import config from '../../../config';

export const deleteCategory = id => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let param = {
      'CategoryID': id
    }
    const api = `${config.baseUrl}/deletecategory`
    axios
      .post(api, param)
      .then(res => {
        let successMessage = res.data.message;

        dispatch(deleteCategorySuccess(id, successMessage));
        resolve(res);
      })
      .catch(error => {
        dispatch(deleteCategoryFailure(error.body));
        reject(error);
      });
  });
};

const deleteCategorySuccess = (id, successMessage) => {
  return {
    type: DELETE_CATEGORY_SUCCESS,
    payload: {
      id,
      successMessage
    }
  };
};

const deleteCategoryFailure = error => {
  return {
    type: DELETE_CATEGORY_FAILURE,
    payload: {
      error
    }
  };
};
