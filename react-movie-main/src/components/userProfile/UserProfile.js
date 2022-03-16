import React, { Component } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "../userAuthorization/firebase";
import * as validate from '../../validate';
import Error from "../Error";
import Spinner from "../Spinner";
import { db } from '../userAuthorization/firebase'
import { collection, addDoc, Timestamp, query, onSnapshot, where, getDocs, orderBy } from 'firebase/firestore'
import Weather from '../weather/weather'

export default class UserProfile extends Component {
  state = {
    auth: false,
    name: "",
    email: "",
    phoneNumber: "",
    lastSignInTime: "",
    creationTime: "",
    uid: null,
    error:{body:"",email:"",password:"", name:'',phoneNumber: "",},
    loading:false,
    userOrders:[],
  };

  componentDidMount() {
      
      
  
    
      //!---------------------------------------
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ auth: true });
        
        this.setState({
          name: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
          uid: user.uid,
        });
      } else {
        this.setState({ auth: false });
        this.props.navigate("../Not-Found");

      }
      this.setState({loading:true})
      if(!this.state.uid)return
      const q = query(collection(db, 'orders') ,where('user_id', "==", this.state.uid) );
      onSnapshot(q, (querySnapshot) => {
          const results=[];
          const cart=[];
          querySnapshot.docs.forEach((doc) => {    
              const result=doc.data();
              const cart=JSON.parse(result.cart);
              const movies=cart.map(movie=>{
                  return {name:movie.name||movie.title,price:movie.price,image:movie.poster_path}
              });
            
              
              
              results.push({...result,movies})
          })

          
          
          this.setState({userOrders:results})
          this.setState({loading:false})
      })
      

    }); 
   
  }
  validateUser=()=>{
    try{
      validate.validateFullName(this.state.name);
      this.setState({error:{...this.state.error,name:''}})
      //validate empty
    validate.validateEmail(this.state.email);
    //empty error if email is valid
    
    this.setState({error:{...this.state.error,email:''}});
    //password validation
//    validate.validateMobile(this.state.phoneNumber);
   
//    this.setState({error:{...this.state.error,phoneNumber:''}});

    return true;
  
    }
    catch(error){
        
     
  
      this.setState({loading:false});
      this.renderError(error.message);
  
    }
  }

  updateProfileHandler=(e)=>{
      this.setState({loading:true})
      e.preventDefault();
      console.log('hello');
      const validate= this.validateUser()
      if(!validate)return
   

      updateProfile(auth.currentUser, {
        displayName: this.state.name, 
        // phoneNumber:'+962'+(this.state.phoneNumber).toString()
      }).then(() => {   
          this.setState({loading:false})
      }).catch((error) => {
        this.setState({loading:false})
        this.renderError(error.message)
        // ...
        console.log(error);
      });
     
     


  }
  renderError=(message)=>{
    if(!message)return
    if(message.startsWith('Number'))this.setState(prevState=>{
      return {error:{...prevState.error,phoneNumber:message}}
    });
    else if(message.startsWith('The name'))this.setState(prevState=>{
      return {error:{...prevState.error,name:message}};
    });
    else this.setState(prevState=>{
      return {error:{...prevState.error,body:message}};
    });
}
  
  render() {
      console.log(this.state.userOrders);
    return (
      <div>
        <section
          class="section section--first section--bg"
          data-bg="img/section/section.jpg"
        >
          <div class="container">
            <div class="row">
              <div class="col-12">
                <div class="section__wrap">
                  <h2 class="section__title">My Profile</h2>

                  <ul class="breadcrumb">
                    <li class="breadcrumb__item">
                      <a href="#">Home</a>
                    </li>
                    <li class="breadcrumb__item breadcrumb__item--active">
                      Profile
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {this.state.loading?<Spinner container='spinner_container' spinner_item='spinner_item' background='background'/>:''} 

        <div class="content" style={{opacity:this.state.loading?'0.1':'1'}}>
        
          <div class="profile">
         
         
            <div class="container">
              <div class="row">
                <div class="col-12">
                <div class="row">
                  
               
                  <div class="profile__content">
                    <div class="profile__user">
                      <div class="profile__avatar">
                        <img src="img/user.svg" alt="" />
                        
                      </div>
                      <div class="profile__meta">
                        <h3>{this.state.name}</h3>
                        <span>FlixGo ID: 480</span>
                      </div>
                      
                    </div>

                    <ul
                      class="nav nav-tabs content__tabs content__tabs--profile"
                      id="content__tabs"
                      role="tablist"
                    >
                      <li class="nav-item">
                        <a
                          class="nav-link active"
                          data-toggle="tab"
                          href="#tab-1"
                          role="tab"
                          aria-controls="tab-1"
                          aria-selected="true"
                        >
                          Profile
                        </a>
                      </li>

                      <li class="nav-item">
                        <a
                          class="nav-link"
                          data-toggle="tab"
                          href="#tab-2"
                          role="tab"
                          aria-controls="tab-2"
                          aria-selected="false"
                        >
                          Orders
                        </a>
                      </li>
                      <li>
                          <div style={{}} className="nav-item weather__container  ">
                   <Weather/>
                        
                      </div>
                          </li>
                    </ul>

                    <div
                      class="content__mobile-tabs content__mobile-tabs--profile"
                      id="content__mobile-tabs"
                    >
                        <div className="d-flex justify-content-center">
                        <div
                        class="content__mobile-tabs-btn dropdown-toggle"
                        role="navigation"
                        id="mobile-tabs"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                          
                        <input type="button" value="Profile" />
                        <span></span>
                      
                         
                        
                      </div>
                      <div style={{}} className="nav-item weather__container  ">
                   <Weather/>
                        
                      </div>
                        </div>
                   

                      <div
                        class="content__mobile-tabs-menu dropdown-menu"
                        aria-labelledby="mobile-tabs"
                      >
                        <ul class="nav nav-tabs" role="tablist">
                          <li class="nav-item">
                            <a
                              class="nav-link active"
                              id="1-tab"
                              data-toggle="tab"
                              href="#tab-1"
                              role="tab"
                              aria-controls="tab-1"
                              aria-selected="true"
                            >
                              Profile
                            </a>
                          </li>

                          <li class="nav-item">
                            <a
                              class="nav-link"
                              id="2-tab"
                              data-toggle="tab"
                              href="#tab-2"
                              role="tab"
                              aria-controls="tab-2"
                              aria-selected="false"
                            >
                              Orders
                            </a>
                          </li>
                         
                        </ul>
                      </div>
                    </div>

                    {/* <button class="profile__logout" type="button">
                      <i class="icon ion-ios-log-out"></i>
                      <span>Logout</span>
                    </button> */}
                   
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="container">
            <div class="tab-content" id="myTabContent">
              <div
                class="tab-pane fade show active"
                id="tab-1"
                role="tabpanel"
                aria-labelledby="1-tab"
              >
                <div class="row">
                    {/* profile details */}
                  <div class="col-12 col-lg-6 m-auto">
                    
                    <form  action="#" class="profile__form">
                  
                      <div class="row">
                        <div class="col-12">
                      
                          <h2 style={{fontSize:'1.4rem',marginBottom:'0'}} class="profile__title">Profile details</h2>
                          <hr style={{marginTop:'0',marginBottom:'2rem'}} />
                        </div>
                        <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                          <div class="profile__group">
                            <label class="profile__label" for="lastname">
                              Register date
                            </label>
                            {/* <input
                              id="date"
                              type="text"
                              name="date"
                              class="profile__input"
                              placeholder="Doe"
                              value={this.state.creationTime.slice(0,12)}
                              readonly 
                            />*/}
                              <h4 style={{color:'white',margin:'1rem 0.2rem '}}>{this.state.creationTime.slice(0,12)}</h4>
                          </div> 
                        
                        </div>

                        <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                          <div class="profile__group">
                            <label class="profile__label" for="username">
                              Name
                            </label>
                            <input
                              id="Name"
                              type="text"
                              name="Name"
                              class="profile__input"
                              placeholder="User 123"
                              value={this.state.name}
                              onChange={(e) => this.setState({ name: e.target.value })}
                            />
                             <Error error={this.state.error.name}/>
                          </div>
                        </div>

                        <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                          <div class="profile__group">
                            <label class="profile__label" for="email">
                              Email
                            </label>
                            <input
                              id="email"
                              type="text"
                              name="email"
                              class="profile__input"
                              placeholder="your email"
                              value={this.state.email}
                              readOnly
                              
                            />
                          </div>
                          <span className="profile__label" style={{color:'grey',fontSize:'0.7rem',alignText:'center',display:'block'}} >you can't change your email since it's unique</span>
                        </div>
                        {/* <div class="col-12 col-md-6 col-lg-12 col-xl-6 m-auto">
                          <div class="profile__group">
                            <label class="profile__label" for="firstname">
                             phone Number
                            </label>
                            <input
                              id="firstname"
                              type="number"
                              name="firstname"
                              class="profile__input"
                              placeholder="Add your phone num."
                              value={this.state.phoneNumber}
                              onChange={(e) => this.setState({ phoneNumber: e.target.value })}
                            />
                          </div>
                          <Error error={this.state.error.phoneNumber}/>
                        </div> */}

                      

                        <div class="col-12">
                          <button onClick={this.updateProfileHandler}  class="profile__btn"style={{marginLeft:'auto',marginRight:'0'}}>
                            Save
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* <div class="col-12 col-lg-6">
                    <form action="#" class="profile__form">
                      <div class="row">
                        <div class="col-12">
                          <h4 class="profile__title">Change password</h4>
                        </div>

                        <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                          <div class="profile__group">
                            <label class="profile__label" for="oldpass">
                              Old Password
                            </label>
                            <input
                              id="oldpass"
                              type="password"
                              name="oldpass"
                              class="profile__input"
                            />
                          </div>
                        </div>

                        <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                          <div class="profile__group">
                            <label class="profile__label" for="newpass">
                              New Password
                            </label>
                            <input
                              id="newpass"
                              type="password"
                              name="newpass"
                              class="profile__input"
                            />
                          </div>
                        </div>

                        <div class="col-12 col-md-6 col-lg-12 col-xl-6">
                          <div class="profile__group">
                            <label class="profile__label" for="confirmpass">
                              Confirm New Password
                            </label>
                            <input
                              id="confirmpass"
                              type="password"
                              name="confirmpass"
                              class="profile__input"
                            />
                          </div>
                        </div>

                        <div class="col-12">
                          <button style={{marginLeft:'auto',marginRight:'0'}} class="profile__btn" type="button">
                            Change
                          </button>
                        </div>
                      </div>
                    </form>
                  </div> */}
                </div>
              </div>
            
              <div
                class="tab-pane fade"
                id="tab-2"
                role="tabpanel"
                aria-labelledby="2-tab"
              >
                  {this.state.loading?<Spinner container='spinner_container' spinner_item='spinner_item' background='background'/>:''} 
                    { this.state.userOrders?.map(order=>{
                        return(
                          <div class="col-12 col-md-12 col-lg-12">
                          <div class="price price--profile">
                            <div class="price__item price__item--first">
                              <span>Date of Purchase: {new Date(order?.created?.seconds*1000).toString().slice(0,15)}</span> <span>Total:{order.totalPrice}$</span>
                            </div>
                            {order?.movies.map(movie=>{
                                return(
                                    <div class="price__item" style={{fontSize:'1.2rem'}}>
                                        
                                    <span>{movie.name}</span>
                                    <img style={{margin:'auto',display:'block',width:'10%'}} src={"https://image.tmdb.org/t/p/w500"+movie.image} alt="" />
                                    <span style={{marginLeft:'auto',marginRight:'0',color:'#ff5860'}}>{movie.price}$</span>
                                    
                                  </div>
                                )

                            })}
                           
                          
                            
                          </div>
                        </div>
                        )
                    }) }
                
                
                </div>
              </div>
              
                          </div>
          </div>
        </div>
      </div>
    );
  }
}
