import { ADD_TO_WISHLIST_SUCCESS, ADD_TO_WISHLIST_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import config from '../../../config';

export const addToWishlist = (productId, id) => (dispatch, getState) => {
  const api = `${config.baseUrl}/addtowishlist`
  
  return new Promise((resolve, reject) => {
    let params = { 
      'ProductID': productId,
      'UserID': id
    };
    axios
      .post(api, params, tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let wishlist = res.data.wishlist;

        dispatch(addToWishlistSuccess(wishlist, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.message;
        dispatch(addToWishlistFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const addToWishlistSuccess = (wishlist, message) => {
  return {
    type: ADD_TO_WISHLIST_SUCCESS,
    payload: { wishlist, message }
  };
};

const addToWishlistFailure = error => {
  return {
    type: ADD_TO_WISHLIST_FAILURE,
    payload: { error }
  };
};
