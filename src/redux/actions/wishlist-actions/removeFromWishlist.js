import { DELETE_FROM_WISHLIST_SUCCESS, DELETE_FROM_WISHLIST_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";
import config from '../../../config';
import { useSelector } from "react-redux";

export const removeFromWishlist = productId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const { user, loading } = useSelector(state => state.userrr);
    const params = {
      'User': user.Email,
      'Product': productId
    }
    const api = `${config.baseUrl}/removewishlist`

    axios
      .post(api, params, tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let wishlist = res.data.wishlist;

        dispatch(removeFromWishlistSuccess(wishlist, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.message;
        dispatch(removeFromWishlistFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const removeFromWishlistSuccess = (wishlist, message) => {
  return {
    type: DELETE_FROM_WISHLIST_SUCCESS,
    payload: { wishlist, message }
  };
};

const removeFromWishlistFailure = error => {
  return {
    type: DELETE_FROM_WISHLIST_FAILURE,
    payload: { error }
  };
};
