import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersToDeliver } from "../../redux/actions/order-actions/fetchOrdersToDeliver";
import DashboardSidebar from "./DashboardSidebar";
import { Container, Col, Row, Image, Button } from "react-bootstrap";
import OrderProgress from "./../account-settings/OrderProgress";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import DashboardSpinner from "./DashboardSpinner";
import { fetchDeliveredOrders } from "../../redux/actions/order-actions/fetchDeliveredOrder";

function DeliveredOrders() {
  const { deliveredOrders, loading } = useSelector(state => state.ordersToDeliverrr);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDeliveredOrders());
  }, [dispatch]);

  let emptyMessage;
  if (!loading && deliveredOrders.length === 0) {
    emptyMessage = (
      <tr>
        <td>There are no orders yet</td>
      </tr>
    );
  }

  let loadingSpinner;
  if (loading && deliveredOrders.length === 0) {
    emptyMessage = <DashboardSpinner />;
  }

  return (
    <Container fluid className='orders-history'>
      <Row>
        <Col md={3}>
          <DashboardSidebar />
        </Col>
        {/*
         ******************* My orders History *********
         */}
        <Col md={9}>
          <h1 className='dashboard-headline'>Delivered orders</h1>
          {loadingSpinner}
          {emptyMessage}

          {deliveredOrders.map((order) => {
            let singleOrder = (
              <Row className='single-order' key={order.OrderID}>
                <Row className='single-order-heading'>
                  <Col>
                    <div className='order-time'>
                      <div> Order placed</div>
                      <Moment format='YYYY-MM-DD HH:mm'>{order.OrderDate}</Moment>
                    </div>
                  </Col>
                  <Col>
                    {order.totalPrice && (
                      <div className='order-todal-price'>
                        Total: <span>${order.TotalPrice}</span>
                      </div>
                    )}
                  </Col>
                  <Col md='4'>
                    <Col>
                      Recipient:{" "}
                      <span>
                        {order.Firstname + " " + order.Lastname}
                      </span>
                    </Col>
                    {/* <Col>
                      Phone: +20<span>{order.phoneNumber}</span>
                    </Col> */}
                  </Col>
                  <Col>
                    <div className='order-id'>
                      Order ID: #<span>{order.OrderID}</span>
                    </div>
                  </Col>
                </Row>

                <Row className='order-delivered-time'>
                  <div>
                      Delivered on:{" "}
                      <Moment format='YYYY-MM-DD HH:mm'>{order.DeliveredDate}</Moment>
                  </div>
                </Row>

                <Row className='single-order-item' key={order.Product.ProductID}>
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
                        {/* <Col md='3'>
                          {order.OrderState.Delivered && (
                            <Button variant='success' disabled>
                              <i class='fa fa-check' aria-hidden='true'></i>
                            </Button>
                          )}
                        </Col> */}
                      </Row>

                      {/* <OrderProgress state={order.OrderState} /> */}
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

export default DeliveredOrders;
