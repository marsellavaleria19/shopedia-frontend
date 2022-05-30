import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import {
  Container, Row, Col, Form, Button,
} from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Sidebar from '../../components/sidebar';
import Layout from '../../components/Layout';
import { login } from '../../redux/actions/auth';
import ModalNotifError from '../../components/ModalNotifError';

function Login() {
  const dispatch = useDispatch();
  const route = useRouter();

  const { auth } = useSelector((state) => state);
  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      route.push('/');
    }
  }, []);

  useEffect(() => {
    if (auth.token) {
      route.push('/');
    }
  }, [auth]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pwd = document.getElementById('password').value;
    dispatch(login(email, pwd));
  };

  return (
    <Layout>
      <Head>
        <title>Login | Shopedia</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="bg-color4 py-5">
        <h1 className="text-center pt-5">My Account</h1>
        <div className="text-center pb-5">Register and log in with your account to be able to shop at will</div>
      </div>
      <Container>
        <Row className="py-5">
          <Col xs={12} md={4}>
            <Sidebar />
          </Col>
          <Col xs={12} md={5}>
            <div className="my-5">
              <h3>Login</h3>
              <ModalNotifError message={auth.errMessage} />
              <Form.Control
                type="email"
                id="email"
                name="email"
                aria-describedby="email"
                className="me-5 py-3 mt-5"
                placeholder="User name or email address"
              />
              <Form.Control
                type="password"
                id="password"
                name="password"
                aria-describedby="password"
                className="me-5 py-3 mt-2"
                placeholder="password"
              />
              <Button onClick={handleSubmit} className="mt-4 px-4" variant="color2" size="lg" active>
                Login
              </Button>
              {' '}
              <br />
              <Row className="mt-3">
                <Col>
                  <Form.Check
                    inline
                    label="Remember Me"
                    name="group1"
                  />
                </Col>
                <Col>
                  <Link href="/forgot-password">
                    <a className="text-decoration-none text-color3">Forgot your password?</a>
                  </Link>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={12} md={3} />
        </Row>
      </Container>
    </Layout>
  );
}
export default Login;
