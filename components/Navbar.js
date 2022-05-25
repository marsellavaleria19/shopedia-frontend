import Link from "next/link";
import Image from 'next/image'
import styles from './styles/Navbar.module.css'
import { useRouter } from "next/router";
import { BiSearchAlt2, BiHeart, BiCartAlt } from 'react-icons/bi';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../redux/actions/cart";
import { Dropdown } from "react-bootstrap";

const Navbar = () => {
  const route = useRouter();
  const [token, setToken] = useState('')
  const {cart} = useSelector(state => state)

  const { wishlists } = useSelector(state => state)
  const dispatch = useDispatch()
  const [dataCart, setDataCart] = useState(0)
  // const [localStorage,useLocalStorage] = useState(window.localStorage.getItem("cart")) 

  useEffect(()=>{
    const cartList = JSON.parse(window.localStorage.getItem('cart'))
    // setDataCart(cartList.length)
    if(cartList!==null){
      setDataCart(cartList.length)
    }else{
      setDataCart(0)
    }
    const token = window.localStorage.getItem('token')
    if (token) {
      setToken(token)
    }
  },[])

  useEffect(()=>{
    if(cart.isAddCart){
      const cartList = JSON.parse(window.localStorage.getItem("cart"))
      if(cartList!==null){
        setDataCart(cartList.length)
    }else{
      setDataCart(0)
    }
  }
  }, [cart])

  // useEffect(()=>{
  //   if(cart){
  //     setDataCart(cart.length)
  //   }
  // }, [cart])


  const searchBtn = (e) => {
    e.preventDefault()
    const input = document.getElementById('formSearch')
    if (input.style.display === 'block') {
      input.style.display = 'none'
    } else {
      input.style.display = 'block'
    }
  }

  const handleAddtoCart = (event) => {
    event.preventDefault()
    const cartList = window.localStorage.getItem('cart')
    if(cartList){
      route.push("/cart")
    } else {
      route.push("/cart/no-cart")
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
        <div className={`container ${styles.layout}`}>
          <Link href='/'>
            <a>
              <Image layout='intrinsic' alt='logo' src='/images/logo.png' width={100} height={100} />
            </a>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto my-0 my-lg-auto align-items-lg-center mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href='/'>
                  <a className={`${route.pathname === '/' && 'active'}nav-link fw-bold fs-5`} aria-current="page">HOME</a>
                </Link>
              </li>
              <li className="nav-item dropdown ms-lg-3">
                <Link href='/'>
                  <a className="nav-link dropdown-toggle fw-bold fs-5" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    PAGES
                  </a>
                </Link>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link href='/contact-us'>
                      <a className="dropdown-item">Contact Us</a>
                    </Link>
                  </li>
                  <li>
                    <Link href='/about-us'>
                      <a className="dropdown-item">About Us</a>
                    </Link>
                  </li>
                  <li>
                    <Link href='/faq'>
                      <a className="dropdown-item">FAQ</a>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown mx-lg-3">
                <Link href='/'>
                  <a className="nav-link dropdown-toggle fw-bold fs-5" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    SHOP
                  </a>
                </Link>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link href='/product'>
                      <a className="dropdown-item">Product</a>
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href='/blog'>
                  <a className="fw-bold fs-5">
                    BLOG
                  </a>
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li onClick={searchBtn} className="nav-item d-flex flex-row align-items-center">
                <button className="btn" type="submit">
                  <BiSearchAlt2 className="fs-2" />
                </button>
                <form id="formSearch" className={styles.formSearch}>
                  <input className="form-control bg-color1 text-white text-center" />
                </form>
              </li>
              <li className="nav-item">
                <button className="btn position-relative ms-lg-1" onClick={e => route.push('/wishlist')}>
                  <BiHeart className="fs-2" />
                  <div className={`bg-color1 position-absolute text-white rounded-circle ${styles.notif}`}>{wishlists.listWishlist.length || 0}</div>
                </button>
              </li>
              <li className="nav-item">
                <button className="btn position-relative mx-lg-1" onClick={handleAddtoCart}>
                  <BiCartAlt className="fs-2" />
                  <div className={`bg-color1 position-absolute text-white rounded-circle ${styles.notif}`}>{dataCart}</div>
                </button>
              </li>
              <li className="nav-item">
                <Dropdown>
                  <Dropdown.Toggle variant="transparent" id="dropdown-basic">
                    <Image src='/images/menu.png' layout='intrinsic' alt='menu' width={25} height={25} />
                  </Dropdown.Toggle>

                  {token &&
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={e => route.push("/profile")}>
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item onClick={e => route.push("/my-store")}>
                        My Store
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => { dispatch({ type: 'AUTH_LOGOUT' }); route.push("/") }} >
                        Log Out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  }
                  {!token &&
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={e => route.push("/login")}>
                        Login
                      </Dropdown.Item>
                      <Dropdown.Item onClick={e => route.push('/signup')}>
                        Signup
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  }
                </Dropdown>
              </li>
            </ul>
          </div>
        </div>
    </nav>
    </>
  )
}

export default Navbar;
