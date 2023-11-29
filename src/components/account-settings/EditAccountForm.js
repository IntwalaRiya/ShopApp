import React from "react";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { Button, Container, Toast, ProgressBar, Breadcrumb } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast, Slide } from "react-toastify";
import { editUser } from "../../redux/actions/auth-actions/editUser";

// form validation useing Yup
const validate = () =>
  Yup.object({
    firstName: Yup.string().min(2, "Must be more then one character"),
    lastName: Yup.string().min(2, "Must be more than 10 characters"),
    email: Yup.string()
      .email("Please enter a vaild email")
      .min(2, "Must be more than 10 characters"),
    password: Yup.string().min(2, "Must be more than 10 characters"),
    gender: Yup.string().nullable(),
    nationality: Yup.string().min(2, "Must be more than 10 characters").nullable(),
    birthDate: Yup.string().min(2, "Must be more than 10 characters").nullable(),
    isSeller: Yup.string().min(2, "Must be more than 10 characters")
  });

function EditAccountForm(props) {
  const { user, loading } = useSelector(state => state.userrr);
  // console.log(user)

  const dispatch = useDispatch();

  // handle submit our form
  const handleSubmitt = address => {
    if (address.password == address.verifyPassword){
    delete address.verifyPassword;
    // console.log(address)
    dispatch(editUser(address))
      .then(res => {
        toast.success(res, {
          position: toast.POSITION.BOTTOM_LEFT,
          transition: Slide
        });
        props.history.push("/settings");
      })
      .catch(err => {
        toast.error(err, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: false
        });
      });
    }
    else{
      toast.error("Password doesn't match", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: false
      });
    }
  };

  let initialValues;
  if (user) {
    initialValues = {
      // password: "",
      // verifyPassword: "",
      firstName: user.Firstname.S,
      lastName: user.Lastname.S,
      // email: user.Email.S,
      gender: user.Gender.S,
      nationality: user.Nationality.S,
      birthDate: user.BirthDate.S,
      isSeller: user.isSeller.BOOL
    };
  }

  return (
    <Container>
      {loading && <ProgressBar animated now={100} />}

      {user && (
        <>
          <Breadcrumb>
            <Breadcrumb.Item href='/settings'>My Account</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit account</Breadcrumb.Item>
          </Breadcrumb>

          <Formik
            initialValues={initialValues}
            validationSchema={validate}
            onSubmit={(values, { setSubmitting }) => {
              const updatedUser = {
                password: values.password,
                verifyPassword: values.verifyPassword,
                Firstname: values.firstName,
                Lastname: values.lastName,
                Email: user.Email.S,
                Gender: values.gender,
                Nationality: values.nationality,
                BirthDate: values.birthDate,
                isSeller: values.isSeller
              };

              handleSubmitt(updatedUser);

              setSubmitting(false);
            }}>
            <Form
              action='/api/users/edit_account'
              method='put'
              className='add-category-form mb-5'>
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
              {/* <div className='form-group'>
                <label>Email *</label>
                <Field
                  type='text'
                  name='email'
                  className='form-control'
                  placeholder='Enter email'
                />
                <ErrorMessage component={Toast} name='email' />
              </div> */}
              <div className='form-group'>
                <label>Password *</label>
                <Field
                  type='password'
                  name='password'
                  className='form-control'
                  placeholder='Enter new password'
                />
                <ErrorMessage component={Toast} name='password' />
              </div>
              <div className='form-group'>
                <label>Verify Password *</label>
                <Field
                  type='password'
                  name='verifyPassword'
                  className='form-control'
                  placeholder='Enter password again'
                />
                <ErrorMessage component={Toast} name='verifyPassword' />
              </div>
              <div className='form-group'>
                <label>Gender</label>
                <Field
                  as='select'
                  type='text'
                  name='gender'
                  className='form-control'
                  placeholder='Enter first name'>
                  <option value='' disabled>
                    Select Gender
                  </option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </Field>
                <ErrorMessage component={Toast} name='gender' />
              </div>
              <div className='form-group'>
                <label>Nationality</label>
                <Field
                  type='text'
                  name='nationality'
                  className='form-control'
                  placeholder='Enter your nationality'
                />
                <ErrorMessage component={Toast} name='nationality' />
              </div>
              <div className='form-group'>
                <label>Birth Date</label>
                <Field type='date' name='birthDate' className='form-control' />
                <ErrorMessage component={Toast} name='birthDate' />
              </div>
              <div className='form-group'>
                <label>Sell with us?</label>
                <Field as='select' name='isSeller' className='form-control'>
                  <option value='true'>Yes</option>
                  <option value='false'>No</option>
                </Field>
                <ErrorMessage component={Toast} name='isSeller' />
              </div>
              <Button variant='primary' type='submit'>
                UPDATE{" "}
              </Button>{" "}
            </Form>
          </Formik>
        </>
      )}
    </Container>
  );
}

export default EditAccountForm;
