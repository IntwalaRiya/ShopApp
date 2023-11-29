import React, { useEffect } from "react";
import { Container, Image, Row, Col, Alert, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersHistory } from "../../redux/actions/order-actions/fetchOrdersHistory";
import SettingsSidebar from "./SettingsSidebar";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import OrderProgress from "./OrderProgress";

function Cart() {
  const { historyOrders, loading } = useSelector(state => state.historyyy);
  const { user } = useSelector(state => state.userrr);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrdersHistory(user.Email.S));
  }, [dispatch]);

  let loadingSpinner;
  if (loading && historyOrders.length === 0) {
    loadingSpinner = (
      <Loader type='Circles' color='#123' height={100} width={100} className='spinner' />
    );
  }

  let emptyMessage;
  if (historyOrders.length === 0) {
    emptyMessage = <Alert variant='warning'>No orders to show</Alert>;
  }else{
    emptyMessage = null
  }

  return (
    <Container fluid className='orders-history'>
      <Row>
        <Col lg={4}>
          <SettingsSidebar />
        </Col>
        {/*
         ******************* My orders History *********
         */}
        <Col lg={8}>
          <Row className='heading'>Orders History</Row>
          {emptyMessage}
          {loadingSpinner}

          {historyOrders.map((order) => {
            let singleOrder = (
              <Row className='single-order' key={order._id}>
                <Row className='single-order-heading'>
                  <Col>
                    <div className='order-time'>
                      Order placed <span>{order.OrderDate}</span>
                    </div>
                  </Col>
                  <Col>
                    {order.totalPrice && (
                      <div className='order-todal-price'>
                        Total: <span>${order.TotalPrice}</span>
                      </div>
                    )}
                  </Col>
                  <Col>
                    Shipped to:{" "}
                    <span>{order.Firstname + " " + order.Lastname}</span>
                  </Col>
                  <Col>
                    <div className='order-id'>
                      Order ID: #<span>{order.OrderID}</span>
                    </div>
                  </Col>
                </Row>

                <Row className='order-delivered-time'>
                  {order.DeliveredDate && <div>Delivered on: {order.DeliveredDate}</div>}
                </Row>

                  <Row className='single-order-item' key={order.Product.ProductID}>
                    <Col md='3'>
                      <Image
                        src="https://shopappimages.s3.amazonaws.com/pictures/10-20B14_phoneFront.png"
                        thumbnail
                      />
                    </Col>

                    <Col md='9'>
                      <Row>
                        <Col md='9'>
                          <Link to={`/product/${order.Product.ProductID}`}>
                            <div>{order.Product.Name}</div>
                          </Link>
                          <div className='quantity'>
                            Quantity: <span>{order.OrderQuantity}</span>
                          </div>
                          <div className='price'>
                            $Total:
                            <span>
                              {" "}
                              ${order.OrderQuantity * order.Product.Price}
                            </span>
                          </div>
                        </Col>
                        <Col md='3'>
                          <Button variant='secondary'>Return</Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
              </Row>
            );

            return singleOrder;
          })}
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
