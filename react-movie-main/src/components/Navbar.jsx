import React, { Component, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";


export default function  Navbar(props){
  const[emptyCart,setEmptyCart]=useState(false)
  useEffect(()=>{
    if(!localStorage.getItem('cart'))setEmptyCart(true)
  })

  const navigate=useNavigate();
  const logout=()=>{
    const auth = getAuth();
    signOut(auth).then(() => {
      
      navigate('/')
  // Sign-out successful.
  }).catch((error) => {
  // An error happened.
  });


  }
  
 
 
  
    return (
      <header className="header">
        <div className="header__wrap">        
          <div className="container">       
            <div className="row"> 
              <div className="col-12">
                <div className="header__content">
                  <Link className="header__nav-link" to="/react-movie">
                    {" "}
                    <img src="img/logo.svg" alt="" />
                  </Link>

                  <ul className="header__nav">
                    <li className="header__nav-item">
                      <Link className="header__nav-link" to="/react-movie">
                        Home
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <Link className="header__nav-link" to="/react-movie/store">
                        store
                      </Link>
                    </li>
                  {!props.auth? <> <li className="header__nav-item">
                      <Link className="header__nav-link" to="/react-movie/register">
                        Register
                      </Link>
                    </li>
                    {/* <li className="header__nav-item">
                      <Link className="header__nav-link" to="login">
                        Login
                      </Link>
                    </li> */}
                    </>:<Link className="header__nav-link" to="/react-movie/profile"> Profile</Link>
                    }
                  </ul>
                            

                  
                  <div className="header__auth">
                    {/* <button className="header__search-btn" type="button">
                      <i className="icon ion-ios-search"></i>
                    </button>
   */}

                   

                    {/* <div className="dropdown header__lang">
                      <a
                        className="dropdown-toggle header__nav-link"
                        href="#"
                        role="button"
                        id="dropdownMenuLang"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        EN
                      </a>

                      <ul
                        className="dropdown-menu header__dropdown-menu"
                        aria-labelledby="dropdownMenuLang"
                      >
                        <li>
                          <a href="#">English</a>
                        </li>
                        <li>
                          <a href="#">Spanish</a>
                        </li>
                        <li>
                          <a href="#">Russian</a>
                        </li>
                      </ul>
                    </div> */}

                    {props.auth?  <span onClick={logout} style={{cursor:'pointer'}}  className="header__sign-in">
                      <i className="icon ion-ios-log-in"></i>
                      <span >Logout</span> </span>: 
                       <span  style={{cursor:'pointer'}}  className="header__sign-in">
                       <i className="icon ion-ios-log-in"></i>
                      
                      <Link  to="/react-movie/login"> <span>Login</span></Link>
                      </span>
                    
                   
                    }
                   
                  </div>
                      <div className="header__cart">
                      <button className="header__cart-btn" type="">
                      <Link to='/react-movie/cart' className="ion-ios-cart"><i></i></Link>
                    </button>
                    <span className="cartNum">{props.cartCount}</span>
                            </div>  

                  <button className="header__btn" type="button">
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        <form action="#" className="header__search">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="header__search-content">
                  <input
                    type="text"
                    placeholder="Search for a movie, TV Series that you are looking for"
                  />

                  <button type="button">search</button>

                </div>
              </div>
            </div>
          </div>
        </form>
      </header>
    );
  }



