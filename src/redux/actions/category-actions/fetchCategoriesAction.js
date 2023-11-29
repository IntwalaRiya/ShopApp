import {
  FETCH_CATEGORIES_STARTED,
  FETCH_CATEGORIES_FAILURE,
  FETCH_CATEGORIES_SUCCESS
} from "./../types";
import axios from "axios";
import config from '../../../config';

export const fetchCategories = () => {
  const api = `${config.baseUrl}/getcategory`
  return dispatch => {
    dispatch(fetchCategoriesStarted());
    axios
      .get(api)
      .then(res => {
        dispatch(fetchCategoriesSuccess(res.data.body));
      })
      .catch(err => {
        dispatch(fetchCategoriesFailure(err.message));
      });
  };
};

const fetchCategoriesStarted = () => {
  return {
    type: FETCH_CATEGORIES_STARTED
  };
};

const fetchCategoriesSuccess = categories => {
  return {
    type: FETCH_CATEGORIES_SUCCESS,
    payload: {
      categories
    }
  };
};

const fetchCategoriesFailure = error => {
  return {
    type: FETCH_CATEGORIES_FAILURE,
    payload: {
      error
    }
  };
};
