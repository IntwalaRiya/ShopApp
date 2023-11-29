import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchShippedOrders } from "../../redux/actions/order-actions/fetchShippedOrders";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { Container, Col, Row, Image, Button } from "react-bootstrap";
import DashboardSidebar from "./DashboardSidebar";
import DashboardSpinner from "./DashboardSpinner";

function ShippedOrders() {
  const { shippedOrders, loading } = useSelector(state => state.ordersToShippp);
  console.log(shippedOrders)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShippedOrders());
  }, [dispatch]);

  let emptyMessage;
  if (!loading && shippedOrders.length === 0) {
    emptyMessage = (
      <tr>
        <td>There are no orders yet</td>
      </tr>
    );
  }

  return (
    <Container fluid className='orders-history'>
      <Row>
        <Col md='3'>
          <DashboardSidebar />
        </Col>
        {/*
         ******************* Shipped Order *********
         */}
        <Col>
          <h1 className='dashboard-headline'>Shipped Order</h1>

          {loading && <DashboardSpinner />}

          {emptyMessage}

          {shippedOrders &&
            shippedOrders.map(order => {
              let singleOrder = (
                <Row className='single-order' key={order.OrderID}>
                  <Row className='single-order-heading'>
                    <Col>
                      <div className='order-time'>
                        <div>Order placed</div>
                        <Moment format='YYYY-MM-DD HH:mm'>{order.OrderDate}</Moment>
                      </div>
                    </Col>
                    <Col>
                      <div className='order-todal-price'>
                        Total:{" "}
                        <span>
                          ${order.OrderQuantity * order.Product.Price}
                        </span>
                      </div>
                    </Col>
                    <Col md='4'>
                      <Col>
                        Recipient:{" "}
                        <span>
                          {order.Firstname + " " + order.Lastname}
                        </span>
                      </Col>
                      {/* <Col>
                        Phone: +20<span>{order.address.phoneNumber}</span>
                      </Col> */}
                    </Col>
                    <Col>
                      <div className='order-id'>
                        Order ID: #<span>{order.OrderID}</span>
                      </div>
                    </Col>
                  </Row>

                  <Row className='order-delivered-time'>
                    {order.DeliveredDate && (
                      <div>
                        Delivered on:{" "}
                        <Moment format='YYYY-MM-DD HH:mm'>{order.DeliveredDate}</Moment>
                      </div>
                    )}
                  </Row>

                  {/* Order product */}
                  <Row className='single-order-item'>
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
                          {order.OrderState.Shipped && (
                            <Button variant='success' disabled>
                              Shipped
                            </Button>
                          )}
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

export default ShippedOrders;
