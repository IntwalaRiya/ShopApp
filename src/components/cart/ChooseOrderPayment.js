import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses } from "../../redux/actions/address-actions/fetchAddressesAction";
import { placeOrder } from "../../redux/actions/order-actions/placeOrderAction";
import { toast, Slide } from "react-toastify";

function ChooseOrderPayment() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userrr);

  useEffect(() => {
    dispatch(fetchAddresses(user.Email.S));
  }, [dispatch]);

  const placeNewOrder = () => {
    dispatch((user.Email.S))
      .then(res => {
        console.log(res)
        toast.success(res, {
          position: toast.POSITION.BOTTOM_LEFT,
          transition: Slide
        });
      })
      .catch(err => {
        toast.error(err, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: false
        });
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Col>
              <h3>Payment Methods</h3>
              <h6>###Todo</h6>
            </Col>
            <Col>
              <Button variant='success' onClick={() => placeNewOrder()}>
                Order Now
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default ChooseOrderPayment;
