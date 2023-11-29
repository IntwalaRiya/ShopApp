import React, { useEffect } from "react";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlistProducts } from "../../redux/actions/wishlist-actions/fetchWishlistProducts";
import { removeFromWishlist } from "../../redux/actions/wishlist-actions/removeFromWishlist";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import SettingsSidebar from "./SettingsSidebar";
import Loader from "react-loader-spinner";

function WishList() {
  const { wishlistItems, loading } = useSelector(state => state.wishlisttt);
  const { user} = useSelector(state => state.userrr);
  const dispatch = useDispatch();
  console.log(wishlistItems)

  useEffect(() => {
    dispatch(fetchWishlistProducts(user.Email.S));
  }, [dispatch]);

  let loadingSpinner;
  if (loading) {
    loadingSpinner = (
      <Loader type='Circles' color='#123' height={100} width={100} className='spinner' />
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col lg={4}>
          <SettingsSidebar />
        </Col>
        <Col lg={8}>
          {loadingSpinner}
          {!loading && (
            <Table striped bordered hover variant='dark'>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                { wishlistItems && wishlistItems.length > 0 ? (wishlistItems.map(item => {
                  return (
                    <tr key={item.Product.S}>
                      <td>
                        <Link to={`/product/${item.Product.S}`}>
                          {item.ProductName.S}
                        </Link>
                      </td>
                      <td>${item.ProductPrice.S}</td>
                      <td>
                        <Button
                          className='btn btn-danger'
                          onClick={() => dispatch(removeFromWishlist(item.WishlistID.S, user.Email.S))}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  );
                })) : (<p>No WishList available.</p>)}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default WishList;
