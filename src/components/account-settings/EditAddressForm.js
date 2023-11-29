import React, { useEffect } from "react";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, Form } from "formik";
import {
  Button,
  Container,
  Toast,
  Row,
  Col,
  ProgressBar,
  Breadcrumb
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast, Slide } from "react-toastify";
import { useLocation } from "react-router-dom";
import { editAddress } from "../../redux/actions/address-actions/updateAddressAction";
import { fetchAddresses } from "../../redux/actions/address-actions/fetchAddressesAction";

// form validation useing Yup
const validate = () =>
  Yup.object({
    firstName: Yup.string()
      .min(2, "Must be more then one character")
      .required("This field is required"),
    lastName: Yup.string()
      .min(2, "Must be more than 10 characters")
      .required("This field is required"),
    address1: Yup.string()
      .min(2, "Must be more than 10 characters")
      .required("This field is required"),
    address2: Yup.string().min(2, "Must be more than 10 characters"),
    country: Yup.string()
      .min(2, "Must be more than 10 characters")
      .required("This field is required"),
    state: Yup.string()
      .min(2, "Must be more than 10 characters")
      .required("This field is required"),
    city: Yup.string()
      .min(2, "Must be more than 10 characters")
      .required("This field is required"),
    street: Yup.string()
      .min(2, "Must be more than 10 characters")
      .required("This field is required"),
    building: Yup.string().min(2, "Must be more than 10 characters"),
    floor: Yup.string().min(2, "Must be more than 10 characters"),
    apartment: Yup.string().min(2, "Must be more than 10 characters"),
    phoneNumber: Yup.number()
      .positive("Must be more than 0")
      .integer("Must be more than 0")
      .required("This field is required"),
    postalCode: Yup.number()
      .positive("Must be more than 0")
      .integer("Must be more than 0")
      .required("This field is required")
  });

function EditAddressForm() {
  const { addresses, loading } = useSelector(state => state.addresss);
  console.log(addresses)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // handle submit our form
  const handleSubmitt = (address, id) => {
    dispatch(editAddress(address, id))
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

  // A custom hook that builds on useLocation to parse the query string
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery();
  let id = query.get("addressId");

  let currentAddress = addresses.filter(address => address.AddressID === id);

  let initialValues;
  if (currentAddress[0]) {
    initialValues = {
      Firstname: currentAddress[0].Firstname,
      Lastname: currentAddress[0].Lastname,
      Address1: currentAddress[0].Address1,
      Address2: currentAddress[0].Address2,
      Country: currentAddress[0].Country,
      State: currentAddress[0].State,
      City: currentAddress[0].City,
      Street: currentAddress[0].Street,
      Building: currentAddress[0].Building,
      Floor: currentAddress[0].Floor,
      Apartment: currentAddress[0].Apartment,
      PhoneNumber: currentAddress[0].PhoneNumber,
      PostalCode: currentAddress[0].PostalCode
    };
  }

  return (
    <Container>
      {loading && <ProgressBar animated now={100} />}

      <Breadcrumb>
        <Breadcrumb.Item href='/my_addresses'>My Addresses</Breadcrumb.Item>
        <Breadcrumb.Item active>Edit address</Breadcrumb.Item>
      </Breadcrumb>

      {currentAddress[0] && (
        <Formik
          initialValues={initialValues}
          validationSchema={validate}
          onSubmit={(values, { setSubmitting }) => {
            const newAddress = {
              Firstname: values.firstName,
              Lastname: values.lastName,
              Address1: values.address1,
              Address2: values.address2,
              Country: values.country,
              State: values.state,
              City: values.city,
              Street: values.street,
              Building: values.building,
              Floor: values.floor,
              Apartment: values.apartment,
              PhoneNumber: values.phoneNumber,
              PostalCode: values.postalCode
            };

            handleSubmitt(newAddress, currentAddress[0].AddressID);

            setSubmitting(false);
          }}>
          <Form
            method='post'
            encType='multipart/form-data'
            className='add-category-form mb-5'>
            <Row>
              <Col>
                <div className='form-group'>
                  <label>First Name *</label>
                  <Field
                    type='text'
                    name='firstName'
                    className='form-control'
                    placeholder='Enter first name'
                  />
                  <ErrorMessage component={Toast} name='firstName' />
                </div>
              </Col>
              <Col>
                <div className='form-group'>
                  <label>Last Name *</label>
                  <Field
                    type='text'
                    name='lastName'
                    className='form-control'
                    placeholder='Enter last name'
                  />
                  <ErrorMessage component={Toast} name='lastName' />
                </div>
              </Col>
            </Row>
            <div className='form-group'>
              <label>Address 1 *</label>
              <Field
                type='text'
                name='address1'
                className='form-control'
                placeholder='Enter address'
              />
              <ErrorMessage component={Toast} name='address1' />
            </div>
            <div className='form-group'>
              <label>Address 2</label>
              <Field
                type='text'
                name='address2'
                className='form-control'
                placeholder='Enter address'
              />
              <ErrorMessage component={Toast} name='address2' />
            </div>
            <Row>
              <Col>
                <div className='form-group'>
                  <label>Country *</label>
                  <Field
                    type='text'
                    name='country'
                    className='form-control'
                    placeholder='Enter country'
                  />
                  <ErrorMessage component={Toast} name='country' />
                </div>
              </Col>
              <Col>
                <div className='form-group'>
                  <label>State *</label>
                  <Field as='select' name='state' className='form-control'>
                    <option value='' disabled selected>
                      Choose City
                    </option>
                    <option value='Cairo'>Cairo</option>
                    <option value='Alexandria'>Alexandria</option>
                  </Field>
                  <ErrorMessage component={Toast} name='state' />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className='form-group'>
                  <label>City *</label>
                  <Field
                    type='text'
                    name='city'
                    className='form-control'
                    placeholder='Enter City'
                  />
                  <ErrorMessage component={Toast} name='city' />
                </div>
              </Col>
              <Col>
                <div className='form-group'>
                  <label>Street *</label>
                  <Field
                    type='text'
                    name='street'
                    className='form-control'
                    placeholder='Enter Street'
                  />
                  <ErrorMessage component={Toast} name='street' />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className='form-group'>
                  <label>Building</label>
                  <Field
                    type='text'
                    name='building'
                    className='form-control'
                    placeholder='Enter building'
                  />
                  <ErrorMessage component={Toast} name='building' />
                </div>
              </Col>
              <Col>
                <div className='form-group'>
                  <label>Floor</label>
                  <Field
                    type='text'
                    name='floor'
                    className='form-control'
                    placeholder='Enter floor'
                  />
                  <ErrorMessage component={Toast} name='floor' />
                </div>
              </Col>
              <Col>
                <div className='form-group'>
                  <label>Apartment</label>
                  <Field
                    type='text'
                    name='apartment'
                    className='form-control'
                    placeholder='Enter apartment'
                  />
                  <ErrorMessage component={Toast} name='apartment' />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className='form-group'>
                  <label>Phone Number *</label>
                  <Field
                    type='text'
                    name='phoneNumber'
                    className='form-control'
                    placeholder='Enter Phone Number'
                  />
                  <ErrorMessage component={Toast} name='phoneNumber' />
                </div>
              </Col>
              <Col>
                <div className='form-group'>
                  <label>Postal Code *</label>
                  <Field
                    type='text'
                    name='postalCode'
                    className='form-control'
                    placeholder='Enter Postal Code'
                  />
                  <ErrorMessage component={Toast} name='postalCode' />
                </div>
              </Col>
            </Row>
            <Button variant='primary' type='submit'>
              UPDATE{" "}
            </Button>{" "}
          </Form>
        </Formik>
      )}
    </Container>
  );
}

export default EditAddressForm;
