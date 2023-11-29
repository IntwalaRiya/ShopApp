import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { Container, Image, Button, Col, Row } from "react-bootstrap";
import { fetchordersToShip } from "../../redux/actions/order-actions/fetchOrdersToShip";
import { markOrderShipped } from "../../redux/actions/order-actions/markOrderShipped";
import DashboardSidebar from "./DashboardSidebar";
import DashboardSpinner from "./DashboardSpinner";

function OrdersToShip() {
  const { ordersToShip, loading } = useSelector(state => state.ordersToShippp);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchordersToShip());
  }, [dispatch]);

  let emptyMessage;
  if (!loading && ordersToShip.length === 0) {
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
         ******************* Orders to ship *********
         */}
        <Col>
          <h1 className='dashboard-headline'>Orders to ship</h1>

          {loading && <DashboardSpinner />}

          {emptyMessage}

          {ordersToShip.map(order => {
            let singleOrder = (
              <Row className='single-order' key={order.Product.ProductID}>
                <Row className='single-order-heading'>
                  <Col>
                    <div className='order-time'>
                      <div>Order placed </div>
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
                      Phone: +20<span>{order.PhoneNumber}</span>
                    </Col> */}
                  </Col>
                  <Col>
                    <div className='order-id'>
                      Order ID: #<span>{order.OrderID}</span>
                    </div>
                  </Col>
                </Row>

                {/* Order product */}
                <Row className='single-order-item'>
                  {/* <Col md='3'>
                    <Image
                      src={`${
                        process.env.PUBLIC_URL +
                        "/" +
                        order.products.product.productImage[0].path
                      }`}
                      thumbnail
                    />
                  </Col> */}

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
                        {!order.OrderState.Shipped && (
                          <Button
                            onClick={() => {
                              dispatch(markOrderShipped(order.OrderID));
                            }}>
                            Mark shipped
                          </Button>
                        )}

                        {order.OrderState.Shipped && (
                          <Button variant='secondary' disabled>
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

export default OrdersToShip;
