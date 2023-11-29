import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddresses } from "../../redux/actions/address-actions/fetchAddressesAction";
import { deleteAddress } from "../../redux/actions/address-actions/deleteAddressAction";
import SettingsSidebar from "./SettingsSidebar";
import { Link } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import Loader from "react-loader-spinner";

function Addresses() {
  const { addresses, loading } = useSelector(state => state.addresss);
  const { user } = useSelector(state => state.userrr);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAddresses(user.Email));
  }, [dispatch]);

  // handle submit our form
  const handleDelete = id => {
    dispatch(deleteAddress(id))
      .then(res => {
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

  let allAddresses;
  if (loading) {
    allAddresses = (
      <Loader type='Circles' color='#123' height={100} width={100} className='spinner' />
    );
  } else {
    allAddresses = (
      <Row>
        <Col md='6'>
          <Link to='/my_addresses/add_address' className='add-address'>
            <i class='fa fa-plus' aria-hidden='true'></i>
            <br />
            <span>Add Address</span>
          </Link>
        </Col>
        {addresses && addresses.length > 0 ? (addresses.map((address)=> (
          <Col md='6' key={address.AddressID.S} className='one-address'>
            <div className='wrapper'>
              <span className='name'>
                {address.Firstname.S} {address.Lastname.S}
              </span>
              <span className='city'>
                {address.City.S}, {address.State}
              </span>
              <span className='country'>{address.Country.S}</span>
              <span className='phone'>+20{address.PhoneNumber.S}</span>
              <span className='edit'>
                <Link to={`/my_addresses/edit_address?addressId=${address.AddressID}`}>
                  Edit{" "}
                </Link>
                | <p onClick={() => handleDelete(address.AddressID)}>Delete</p>
              </span>
            </div>
          </Col>
        ))
      ):(<p>No addresses available.</p>)}
      </Row>
    );
  }

  return (
    <Container fluid className='addresses-list'>
      <Row>
        <Col lg={4}>
          <SettingsSidebar />
        </Col>
        <Col lg={8}>
          <Row className='header'>
            <Col>
              <h3>Shipping Addresses</h3>
            </Col>
          </Row>
          {allAddresses}
        </Col>
      </Row>
    </Container>
  );
}

export default Addresses;
