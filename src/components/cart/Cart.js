import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartProducts } from "../../redux/actions/cart-actions/fetchCartProducts";
import { removeFromCart } from "../../redux/actions/cart-actions/removeFromCart";
import { changeCartQuantity } from "../../redux/actions/cart-actions/changeCartQuantity";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Page404 from "./../404";
import ChooseAddressToDeliver from "./ChooseAddressToDeliver";

function Cart() {
  const { cart, totalPrice, loading } = useSelector(state => state.carttt);
  const { user } = useSelector(state => state.userrr);
  console.log(cart)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartProducts(user.Email.S));
  }, [dispatch]);

  /* handle loading spinner  */
  let loadingSpinner;
  if (loading && cart.length === 0) {
    loadingSpinner = (
      <tr>
        <td colSpan='3'>
          <Spinner animation='border' /> loading...{" "}
        </td>
      </tr>
    );
  }

  function PriceCalc() {
    let amount = 0
    for(let i=0; i<cart.length; i++){
      amount += parseInt(cart[i]['TotalPrice']['S'], 10)
    }
    return amount
  }
  /* handle empty message */
  let emptyMessage;
  if (!loading && cart.length === 0) {
    emptyMessage = <td>Your cart is empty</td>;
  }

  // number in stock range
  function options(numberInStock) {
    let arr = [];

    for (let i = 1; i <= numberInStock; i++) {
      arr.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return arr;
  }

  if (!user && !loading) {
    return <Page404 />;
  } else if (cart) {
    return (
      <Container className='cart'>
        <Row>
          <Col className='total-price'>
            <p>Total: ${PriceCalc()}</p>
          </Col>
          <Col>
            {cart.length > 0 && (
              <Link className='cart-pay' to='/checkout'>
                <Button variant='secondary'>Proceed to pay</Button>
              </Link>
            )}
          </Col>
        </Row>

        <Table striped bordered hover variant='dark' className='cart-table'>
          <thead>
            <tr>
              <th>Item</th>
              <th>quantity</th>
              <th>Total Price</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {emptyMessage}
            {loadingSpinner}
            {cart.length > 0 &&
              cart.map(item => {
                return (
                  <tr key={item.CartID.S}>
                    <td>
                      <Link to={`/product/${item.Product.M.ProductID.S}`}>{item.Product.M.Name.S}</Link>
                    </td>

                    <td>
                      <select
                        className='custom-select'
                        value={item.OrderQuantity.S}
                        onChange={e => {
                          let quantity = { orderQuantity: e.target.value };
                          dispatch(changeCartQuantity(item.User.S, item.CartID.S, quantity));
                        }}>
                        {options(item.Product.M.NumberInStock.S)}
                      </select>
                    </td>

                    <td className='cart-product-price'>
                      ${item.OrderQuantity.S * item.Product.M.Price.S}
                    </td>
                    <td>
                      <Button
                        className='btn btn-danger'
                        onClick={() => dispatch(removeFromCart(item.User.S, item.CartID.S))}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default Cart;
