import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Toast, Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import { login } from "../../redux/actions/auth-actions/loginAction";
import axios from "axios";

// form validation useing Yup
const validate = () =>
  Yup.object({
    email: Yup.string()
      .min(2, "Must be more than one character")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Must be more than 8 characters")
      .required("This field is required")
  });

function LoginForm(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const loginUser = async(user) => {
    // const data = {
    //   'body': user
    // }
    //     try{
    //         const response = await axios.post('https://zlyah2qxg0.execute-api.us-east-1.amazonaws.com/dev/login', data);
    //         console.log(response)
    //         if (response.status === 200){
    //             props.history.push('/');
    //         }
    //         else{
    //             alert("Credential Doesn't Match!!");
    //             props.history.push('/login');
    //         }
    //     }
    //     catch(error){
    //         console.log('Error:', error);
    //     }
    dispatch(login(user))
      .then(res => {
        toast.success(res, {
          position: toast.POSITION.BOTTOM_LEFT,
          transition: Slide
        });
        props.history.push("/");
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
      <Formik
        initialValues={{
          email: "",
          password: ""
        }}
        validationSchema={validate}
        onSubmit={(values, { setSubmitting }) => {
          const newUser = {
            email: values.email,
            password: values.password
          };

          loginUser(newUser);
          setSubmitting(false);
        }}>
        <div className='login-form'>
          <Container>
            <Row>
              <Col md='4' sm='6' className='main-col'>
                <div className='form-container'>
                  <Form className='form-horizontal'>
                    <div className='form-group'>
                      <span className='input-icon'>
                        <i className='fa fa-user'></i>
                      </span>
                      <Field
                        name='email'
                        className='form-control'
                        placeholder='Enter email'
                      />
                      <ErrorMessage component={Toast} name='email' />
                    </div>
                    <div className='form-group'>
                      <span className='input-icon'>
                        <i className='fa fa-lock'></i>
                      </span>
                      <Field
                        type='password'
                        name='password'
                        className='form-control'
                        placeholder='Enter password'
                      />
                      <ErrorMessage component={Toast} name='password' />
                    </div>
                    <div className='forgot-pass'>
                      <a href='/'>Lost password?</a>
                    </div>
                    <br />
                    <div className='forgot-pass'>
                      Not a user, <Link to='/signup'>Sign up</Link>
                    </div>
                    <Button variant='primary' type='submit' className='btn signin'>
                      Login
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Formik>
    </Container>
  );
}

export default LoginForm;
