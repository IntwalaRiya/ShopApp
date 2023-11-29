import {
  FETCH_CATEGORY_PRODUCTS_STARTED,
  FETCH_CATEGORY_PRODUCTS_SUCCESS,
  FETCH_CATEGORY_PRODUCTS_FAILURE
} from "./../types";
import axios from "axios";
import config from '../../../config';

export const fetchCategoryProducts = id => {
  return dispatch => {
    dispatch(fetchCategoriesProductsStarted());
    const api = `${config.baseUrl}/getcategoryproduct`
    const param = {
      "CategoryID": id
    }
    axios
      .post(api, param)
      .then(res => {
        let category = res.data.category;
        let products = res.data.products;
        dispatch(fetchCategoriesProductsSuccess(products, category));
      })
      .catch(err => {
        dispatch(fetchCategoriesProductsFailure(err.message));
      });
  };
};

const fetchCategoriesProductsStarted = () => {
  return {
    type: FETCH_CATEGORY_PRODUCTS_STARTED
  };
};

const fetchCategoriesProductsSuccess = (products, category) => {
  return {
    type: FETCH_CATEGORY_PRODUCTS_SUCCESS,
    payload: {
      products,
      category
    }
  };
};

const fetchCategoriesProductsFailure = error => {
  return {
    type: FETCH_CATEGORY_PRODUCTS_FAILURE,
    payload: {
      error
    }
  };
};
