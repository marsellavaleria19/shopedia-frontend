/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Col, Row, Alert,
} from 'react-bootstrap';
import { GrDeliver } from 'react-icons/gr';
import Image from 'next/image';
import { AiFillStar } from 'react-icons/ai';
import { BsCheck } from 'react-icons/bs';
import { CgRuler } from 'react-icons/cg';
import { BiMap } from 'react-icons/bi';
import { FaFacebookF, FaYoutube, FaTwitter } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import ReactStars from 'react-rating-stars-component';
import NumberFormat from 'react-number-format';
import Layout from '../../components/Layout';
import styles from './productDetail.module.scss';
import CButton from '../../components/CButton';
import BreadCrumb from '../../components/BrreadCrumb';
import { getProductDetail } from '../../redux/actions/product';
import capitalFirst from '../../helper/capitalFirst';
import http from '../../helper/http';
import { addCart } from '../../redux/actions/cart';
import noImg from '../../images/noImg.jpg';
import { getWishLlists } from '../../redux/actions/wishlist';
import { getListReview, addReview } from '../../redux/actions/review';

function ProductDetail() {
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [whislist, setWhislist] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartReady, setCartReady] = useState();
  const [whislistReady, setWhislistReady] = useState();
  const [idWishlist, setIdWishlist] = useState();

  const route = useRouter();
  const dispatch = useDispatch();

  const {
    product, user, review, wishlists,
  } = useSelector((state) => state);
  const {
    id, name, price, description, rates, product_images, stock,
  } = product.productDetail;
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  };

  useEffect(() => {
    const { id } = route.query;
    dispatch(getProductDetail(id));
    dispatch(getWishLlists);
    const token = window.localStorage.getItem('token');
    dispatch(getListReview(route.query.id));
    // dispatch(addCart)
  }, [route.query]);

  useEffect(() => {
    const filtWishlist = wishlists.listWishlist.filter((item) => item.product.name === name);
    if (filtWishlist.length > 0) {
      setWhislistReady(true);
      setIdWishlist(filtWishlist[0].id);
    } else {
      setWhislistReady(false);
      setIdWishlist(null);
    }
  }, [wishlists]);

  useEffect(() => {
    const cartStorage = JSON.parse(window.localStorage.getItem('cart'));
    if (cartStorage) {
      const filt = cartStorage.filter((item) => item.data.id === id);
      if (filt.length > 0) {
        setCartReady(true);
        dispatch(addCart);
      } else {
        setCartReady(false);
        dispatch(addCart);
      }
    }
  }, [id, dispatch]);

  const imgClick = (e, currentImg) => {
    e.preventDefault();
    const bigImg = document.getElementById('mainImg');
    bigImg.innerHTML = `<Image src=${currentImg} quality={100} layout="intrinsic" alt='product' width={680} height={680} />`;
  };
  const countInc = (e) => {
    e.preventDefault();
    if (count < stock) {
      setCount(count + 1);
    }
  };
  const countDec = (e) => {
    e.preventDefault();
    if (count > 1) {
      setCount(count - 1);
    }
  };
  let imageProduct = {};
  if (product_images) {
    imageProduct = product_images[0];
  }
  const dataCart = {
    id, name, price, stock,
    // userId: user.dataUser.id,
    // product: { id, name, price, stock },
    // product_images: imageProduct,
  };
  const addtoCart = (e) => {
    e.preventDefault();
    const parsed = JSON.stringify(dataCart);
    const cartStorage = JSON.parse(window.localStorage.getItem('cart'));
    const data = { data: dataCart, product_image: product_images[0] || null, qty: count };
    if (cartStorage) {
      const filt = cartStorage.filter((item) => item.data.id === dataCart.id);
      if (filt.length === 0) {
        cartStorage.push(data);
        window.localStorage.setItem('cart', JSON.stringify(cartStorage));
      }
    } else {
      window.localStorage.setItem('cart', JSON.stringify([data]));
    }
    setCartSuccess(true);
    setCartReady(true);
    dispatch(addCart);
  };
  const deleteCart = (e) => {
    e.preventDefault();
    const cartStorage = JSON.parse(window.localStorage.getItem('cart'));
    const filt = cartStorage.filter((data) => data.data.id !== dataCart.id);
    window.localStorage.setItem('cart', JSON.stringify(filt));
    dispatch(addCart);
    setCartReady(false);
  };

  const addWhislist = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = window.localStorage.getItem('token');
    const param = new URLSearchParams();
    param.append('productId', Number(route.query.id));
    await http(token).post('/users/favorite-product', param)
      .then((res) => {
        if (res.status < 400) {
          // setWhislist(res.data.results)
          setWhislistReady(true);
          dispatch(getWishLlists);
        }
      })
      .catch((err) => {
        // setWhislist(false)
        setWhislistReady(false);
      });
    setIsLoading(false);
  };
  const deleteWihslist = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = window.localStorage.getItem('token');
    await http(token).delete(`/users/favorite-product/${idWishlist}`)
      .then((res) => {
        if (res.status < 400) {
          setWhislist(true);
          setWhislistReady(false);
          dispatch(getWishLlists);
        }
      })
      .catch((err) => {
        setWhislist(false);
        // setWhislistReady(true)
      });
    setIsLoading(true);
  };
  const handleReview = async (e) => {
    e.preventDefault();
    setReviewMessage('');
    setIsLoading(true);
    const token = window.localStorage.getItem('token');
    const comment = document.getElementById('comment').value;
    const name = document.getElementById('comment').value;
    const email = document.getElementById('comment').value;
    if (comment && name && email) {
      dispatch(addReview(Number(route.query.id), comment));
      dispatch(getListReview(route.query.id));
    } else {
      setReviewMessage('Please fill the form');
    }
  };

  const replyClick = (idx) => {
    // e.preventDefault();
    const form = document.getElementById(`formReply${idx}`);
    if (form.style.display === 'block') {
      form.style.display = 'none';
    } else {
      form.style.display = 'block';
    }
    // form.style.display = 'block'
  };
  const replyReview = (id, idx, e) => {
    e.preventDefault();
    const input = document.getElementById(`replyForm${id}`).value;
    const form = document.getElementById(`formReply${idx}`);
    if (form.style.display === 'block') {
      form.style.display = 'none';
    } else {
      form.style.display = 'block';
    }
    dispatch(addReview(Number(route.query.id), input, id));
    dispatch(getListReview(route.query.id));
  };

  const relatedProducts = [
    { pict: '/images/product1.png', name: 'Coaster 506222-CO Loveseat', price: 765.99 },
    { pict: '/images/product2.png', name: 'Coaster 506222-CO Loveseat', price: 765.99 },
    { pict: '/images/product2.png', name: 'Coaster 506222-CO Loveseat', price: 765.99 },
  ];
  return (
    <Layout>
      <header className="container">
        <BreadCrumb data={[{ name: 'Home', href: '/' }, { name: 'Product', href: '/product' }, { name: `${route.query.id}`, active: true }]} />
        <Row className={`my-5 ${styles.sideRow}`}>
          <Col lg={3} className="p-lg-5">
            <aside className="h-100">
              <div className={`d-flex justify-content-center h-100 ${styles.asideImg}`}>
                {product_images && product_images[0]
                  ? product_images.map((data, index) => (
                    <div key={index} style={{ cursor: 'pointer' }} onClick={(e) => imgClick(e, data.image)}>
                      <Image src={data.image} alt={data.alt} width={120} height={120} />
                    </div>
                  ))
                  : <Image src={noImg} quality={100} layout="intrinsic" alt="product" width={680} height={680} />}
              </div>
            </aside>
          </Col>
          <Col lg={9}>
            <div className="text-end">
              <div className="rounded-pill bg-color2 d-inline-block p-3 text-color4">
                Hot
              </div>
            </div>
            <div id="mainImg" className="d-flex justify-content-center align-items-center h-100 overflow-hidden">
              {product_images && product_images[0]
                ? product_images.map((data, index) => {
                  if (index === 0) {
                    return <Image key={index} src={data.image} quality={100} layout="intrinsic" alt="product" width={680} height={680} />;
                  }
                })
                : <Image src={noImg} quality={100} layout="intrinsic" alt="product" width={680} height={680} />}
            </div>
          </Col>
        </Row>
      </header>
      <main className="container mb-5">
        <div className="fs-2">{name && capitalFirst(name)}</div>
        <div className="mt-5 mb-3">
          {(review.results && review.results.length > 0) && ([...Array(5)].map((data, index) => <AiFillStar key={index} />))}
          <span>
            {review.results && review.results.length}
            {' '}
            (reviews)
          </span>
        </div>
        <Row className="mb-5">
          <Col xs={6}>
            <div className="fw-bold h2"><NumberFormat value={String(price)} prefix="Rp. " mask="." thousandSeparator displayType="text" /></div>
            {rates && rates[0]
              ? rates.map((data, index) => {
                if (index === 0) {
                  return (
                    <div key={index} className="d-flex flex-row align-items-center">
                      <ReactStars
                        count={5}
                        size={50}
                        activeColor="#ffd700"
                        value={Number(data.rate)}
                        edit={false}
                        isHalf
                      />
                      <h4 className="mt-2 ms-3">
                        (
                        {Number(data.rate)}
                        )
                      </h4>
                    </div>
                  );
                }
              })
              : ''}

          </Col>
          <Col xs={6}>
            <div className={`${styles.pill} d-inline pe-2`}>
              <BsCheck className="border border-dark rounded-pill" />
            </div>
            {stock}
            {' '}
            In Stock
          </Col>
        </Row>
        <p>
          {description}
        </p>
        <div className="my-5">
          <div className="border border-dark d-inline py-2 rounded me-3">
            <button type="button" onClick={countDec} className="btn">-</button>
            <span>{count}</span>
            <button type="button" onClick={countInc} className="btn">+</button>
          </div>
          {cartReady
            ? <button type="button" onClick={deleteCart} className="btn btn-outline-danger ms-3">Delete from Cart</button>
            : <button type="button" onClick={addtoCart} className="btn btn-dark">Add to Cart</button>}
          {whislistReady
            ? <button type="button" onClick={deleteWihslist} className="btn btn-outline-danger ms-3">Delete from Whislist</button>
            : <button type="button" onClick={addWhislist} className="btn btn-outline-dark ms-3">Add to Whislist</button>}
        </div>
        <div>
          <div>SKU: N/A</div>
          <div>Categories: </div>
          <div>Tag</div>
          <div>Product ID:</div>
        </div>
        <div className="my-5">
          <span>
            <GrDeliver />
            {' '}
            Delivery and return
          </span>
          <span className="mx-5">
            <CgRuler />
            {' '}
            Size Guide
          </span>
          <span>
            <BiMap />
            {' '}
            Store Available
          </span>
        </div>
        <div className="mb-5">
          <div className="border d-inline px-2 py-1 border-dark  rounded-pill me-3">
            <FaFacebookF />
          </div>
          <div className="border d-inline px-2 py-1 border-dark  rounded-pill me-3">
            <FaTwitter />
          </div>
          <div className="border d-inline px-2 py-1 border-dark  rounded-pill me-3">
            <FaYoutube />
          </div>
        </div>

        <nav>
          <style jsx>
            {`
            .nav-product-details .nav-link.active, .nav-product-details .nav-item.show .nav-link {
              border-color: white !important;
            }
            .nav-product-details .nav-link.active {
              border-bottom: 2px solid black !important;
              color: black;
            }
            .nav-product-details.nav-tabs {
              border-bottom: none !important;
            }
            `}
          </style>
          <div className={`nav nav-tabs ${styles.navBottom} nav-product-details d-flex justify-content-between`} id="nav-tab" role="tablist">
            <button className="nav-link fs-4 text-muted active" id="nav-description-tab" data-bs-toggle="tab" data-bs-target="#nav-description" type="button" role="tab" aria-controls="nav-description" aria-selected="true">Description</button>
            <button className="nav-link fs-4 text-muted" id="nav-review-tab" data-bs-toggle="tab" data-bs-target="#nav-review" type="button" role="tab" aria-controls="nav-review" aria-selected="false">Review</button>
            <button className="nav-link fs-4 text-muted" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Aditional Information</button>
            <button className="nav-link fs-4 text-muted" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">About Brands</button>
            <button className="nav-link fs-4 text-muted" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false"> Shipping & Delivery</button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div className="tab-pane fade show active" id="nav-description" role="tabpanel" aria-labelledby="nav-description-tab">
            <Row className="align-items-center mt-5">
              <Col xs={12} lg={5}>
                {product_images && product_images[0]
                  ? product_images.map((data, index) => {
                    if (index === 0) {
                      return <Image key={index} src={data.image} quality={100} layout="intrinsic" alt="product" width={680} height={680} />;
                    }
                  })
                  : <Image src={noImg} quality={100} layout="intrinsic" alt="product" width={680} height={680} />}
              </Col>
              <Col xs={12} lg={7}>
                <div>
                  <p className="text-muted">{description}</p>
                </div>
              </Col>
            </Row>
          </div>
          <div className="tab-pane mt-5 px-lg-5 fade text-dark" id="nav-review" role="tabpanel" aria-labelledby="nav-review-tab">
            <div className="px-lg-5 my-5 py-4">
              {review.results && review.results.map((data, idx) => {
                const date = data.createdAt;
                return (
                  <div key={data.id} className="pt-5">
                    <div className="d-flex flex-row">
                      <div style={{ backgroundImage: `url(${data.user.image || '/images/defaultpp.jpg'})` }} className={styles.photoReview} />
                      <div className={`${styles.commentReview} ms-4`}>
                        <div>
                          “
                          {data.comment}
                          ”
                        </div>
                        <div className="text-muted mt-3">
                          {date}
                          <button type="button" onClick={(e) => replyClick(idx)} className="fw-bold btn ms-3">Reply</button>
                        </div>
                        <form id={`formReply${idx}`} style={{ display: 'none' }}>
                          <input id={`replyForm${data.id}`} type="text" placeholder="reply" />
                          <button type="button" onClick={(e) => replyReview(data.id, idx, e)} className="btn btn-color2 fw-bold">Send</button>
                        </form>
                        <div>
                          {review.results && data.replies.map((item) => (
                            <div key={item.id} className="pt-5">
                              <div className="d-flex flex-row">
                                <div style={{ backgroundImage: `url(${item.user.image || '/images/defaultpp.jpg'})` }} className={styles.photoReview} />
                                <div className={`${styles.commentReview} ms-4`}>
                                  <div>
                                    “
                                    {item.comment}
                                    ”
                                  </div>
                                  <div className="text-muted mt-3">
                                    {item.createdAt}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <hr className="mt-5" />
                  </div>
                );
              })}
            </div>
            <div className="px-lg-5 mt-4">
              <h3>Leave A Comment</h3>
              <p>Your email address will not be published. Required fields are marked *</p>
              <form>
                <Row>
                  <Col xs={12} lg={4}>
                    <input className="py-2 w-100 px-2" type="text" id="nameRev" placeholder="Name *" />
                  </Col>
                  <Col xs={12} lg={4}>
                    <input className="py-2 w-100 px-2" type="text" id="emailRev" placeholder="Email *" />
                  </Col>
                  <Col xs={12} lg={4}>
                    <input className="py-2 w-100 px-2" type="text" id="websiteRev" placeholder="Website" />
                  </Col>
                  <Col xs={12}>
                    <textarea className={`w-100 mt-3 p-2 ${styles.comment}`} id="comment" placeholder="Your Comment" />
                  </Col>
                </Row>
                {reviewMessage && <Alert variant="color2" className="text-danger">{reviewMessage}</Alert>}
                <CButton onClick={handleReview} classStyle="px-5 mt-3" color="dark">Send</CButton>
              </form>
            </div>
          </div>
          <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">33</div>
        </div>

        <div className="d-none d-lg-block">
          <div className="fs-3 text-center my-5">Related Products</div>
          <Row>
            {product.product?.map((data, index) => {
              if (index <= 2) {
                return (
                  <Col key={index} lg={4}>
                    <div style={{ backgroundImage: `url(${data.product_images[0].image})` }} className={`${styles.relatedBg}`} />
                    <div className="fs-5 my-4">{data.name}</div>
                    <div className="fw-bold">
                      <NumberFormat value={String(data.price)} prefix="Rp. " mask="." thousandSeparator displayType="text" />
                    </div>
                  </Col>
                );
              }
            })}
          </Row>
        </div>

      </main>
    </Layout>
  );
}

export default ProductDetail;
