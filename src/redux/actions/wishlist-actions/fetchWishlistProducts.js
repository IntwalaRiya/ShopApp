import {
  FETCH_WISHLIST_STARTED,
  FETCH_WISHLIST_SUCCESS,
  FETCH_WISHLIST_FAILURE
} from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';
import { useSelector } from "react-redux";

export const fetchWishlistProducts = (id) => (dispatch, getState) => {
  dispatch(fetchWishlistStarted());
  const api = `${config.baseUrl}/fetchwishlist`
  
  const params = {
    'User': id
  }

  axios
    .post(api, params, tokenConfig(getState))
    .then(res => {
      dispatch(fetchWishlistSuccess(res.data.wishlist));
    })
    .catch(err => {
      dispatch(fetchWishlistFailure(err.message));
    });
};

const fetchWishlistStarted = () => {
  return {
    type: FETCH_WISHLIST_STARTED
  };
};

const fetchWishlistSuccess = wishlist => {
  return {
    type: FETCH_WISHLIST_SUCCESS,
    payload: { wishlist }
  };
};

const fetchWishlistFailure = error => {
  return {
    type: FETCH_WISHLIST_FAILURE,
    payload: { error }
  };
};
