import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import {
  Container, Form, Button,
} from 'react-bootstrap';
import Image from 'next/image';
import { FiEdit3, FiLogOut } from 'react-icons/fi';
import { BiCheckCircle } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Input from '../../components/CInput';
import Layout from '../../components/Layout';
import BreadCrumb from '../../components/BrreadCrumb';
import NavProduct from '../../components/NavProduct';
import profile from '../../images/about1.png';
import { getProfile, editProfile } from '../../redux/actions/user';
import ModalLoading from '../../components/ModalLoading';
import ModalNotifSuccess from '../../components/ModalNotifSuccess';
import ModalNotifError from '../../components/ModalNotifError';

function Index() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.user?.dataUser);
  const user = useSelector((state) => state.user);
  const pages = useSelector((state) => state.pages);
  // const token = useSelector(state => state.user.token)
  const { role } = data;
  const genders = String(data.gender);
  const hiddenFileInput = useRef(null);
  const [datas, setDatas] = useState({});
  const route = useRouter();
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      dispatch(getProfile);
    } else {
      route.push('/');
    }
  }, []);
  useEffect(() => {
    if (user.editProfile) {
      dispatch(getProfile);
      setTimeout(() => {
        dispatch({ type: 'EDIT_PROFILE_CLEAR' });
      }, 5000);
    }
  }, [user.editProfile]);
  const uploadFile = (e) => {
    e.preventDefault();
    hiddenFileInput.current.click();
  };
  const fileInputHandler = (e) => {
    const reader = new FileReader();
    const picture = e.target.files[0];
    const profileImage = document.querySelector('#profile-image');
    reader.readAsDataURL(picture);
    // eslint-disable-next-line no-shadow
    reader.onload = (e) => {
      profileImage.src = e.target.result;
      profileImage.className += ' rounded-circle';
    };
    setDatas({
      picture: e.target.files[0],
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const gender = document.querySelector('#gender option:checked').value;
    const images = datas.picture;
    dispatch(editProfile(name, gender, images));
    // dispatch(getProfile)
  };
  return (
    <Layout>

      <Head>
        <title>My Profile | Shopedia</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="bg-color4 py-5">
        <Container>
          <BreadCrumb data={[{ name: 'Home', href: '/' }, { name: 'Profile', active: true }]} />
        </Container>
        <h1 className="text-center pt-4">Profile</h1>
        <div className="text-center pb-5">See your notifications for the latest updates</div>
      </div>
      <Container className="mb-5">
        {
          !data.confirmed
          && (
          <div className="d-flex justify-content-center alert alert-warning fade show" role="alert">
            <strong>
              Please Verify Your Account
              <Button block variant="danger ms-2 radius" onClick={() => { route.push('/verify-email'); }}> Verify Acount </Button>
            </strong>
          </div>
          )
        }
        <ModalLoading isLoading={pages.isLoading} />
        <ModalNotifSuccess message={user.successMsg} />
        <ModalNotifError message={user.errMessage} />
        {/* {role && role.name === 'seller' && <NavProduct />} */}
        <NavProduct />
        <Form onSubmit={handleSubmit}>
          <div className="d-flex flex-row">
            <div className="ms-4 my-5 d-inline position-relative ">
              <Image
                id="profile-image"
                alt="{auth?.fullName}"
                src={data.image || profile}
                width="80"
                height="80"
                className="rounded-circle mx-auto d-block"
              />
              <Button block variant="pallet-2 radius" onClick={(e) => uploadFile(e)}>
                <FiEdit3 size={20} />
                {' '}
                Edit
                {' '}
              </Button>
              <input
                type="file"
                ref={hiddenFileInput}
                className="d-none"
                name="picture"
                accept="image"
                onChange={(e) => fileInputHandler(e)}
              />
            </div>
            <div className="my-5 py-2 ms-5">
              <Input
                type="text"
                id="name"
                name="name"
                aria-describedby="name"
                className="me-5 pb-3 border-0 form-color2"
                defaultValue={data.name || 'Your Name'}
              // placeholder='Your Name*'
              />
              <div className="ms-2">
                as
                {role?.name}
              </div>
            </div>
          </div>
          {
            data?.confirmed
            && (
            <div className="my-3">
              <div className="d-inline alert alert-success fade show" role="alert">
                <strong>
                  Verified Account
                  <BiCheckCircle size={25} />
                </strong>
              </div>
            </div>
            )
          }
          <div className="border border-3 border-bottom-0 px-3 pt-3">
            <Form.Label className="px-3"><p>Gender :</p></Form.Label>
            <Form.Select className="border-0" size="lg" id="gender" defaultValue={genders}>
              <option disabled value="" label="null" />
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="others">others</option>
            </Form.Select>
          </div>
          <div className="border border-3 border-bottom-1 px-3 pt-3">
            <Form.Label className="px-3"><p>Your Email :</p></Form.Label>
            <Input
              type="email"
              id="email"
              name="email"
              aria-describedby="email"
              className="me-5 pb-3 border-0 form-color2"
              defaultValue={data.email}
              placeholder="Your email address *"
            />
          </div>
          {role && role.name === 'seller'
            && (
            <>
              <div className="border border-3 border-bottom-0 px-3 pt-3">
                <Form.Label className="px-3"><p>Store Name :</p></Form.Label>
                <Input
                  disabled
                  type="text"
                  id="store"
                  name="store"
                  aria-describedby="store"
                  className="me-5 pb-3 border-0 bg-transparent"
                  defaultValue={data.store?.name}
                  placeholder="Your Store"
                />
              </div>
              <div className="border border-3  px-3 pt-3">
                <p className="px-3">Store Description :</p>
                <Input
                  disabled
                  type="text"
                  id="description"
                  name="description"
                  aria-describedby="description"
                  className="me-5 mb-3 border-0 bg-transparent"
                  defaultValue={data.store?.description}
                  placeholder="Description Store"
                />
              </div>
            </>
            )}
          <Button type="submit" className="mt-4 px-4" variant="color2" size="lg" active>
            <FiLogOut />
&nbsp;Save
          </Button>
          {' '}
          {role?.name === 'seller' && (
          <Button href="/my-store/create-store" className="mt-4 px-4" variant="color2" size="lg" active>
            Create Store
          </Button>
          )}
          {' '}
        </Form>
      </Container>
    </Layout>
  );
}
export default Index;
