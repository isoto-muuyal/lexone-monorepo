import React, { Component } from 'react';
import { Link } from "react-router-dom";
import FloatingInputs from "../../components/FloatingLabel";
import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons';
import { Checkbox, Button } from 'antd';
import axios from 'axios';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import MetaDecorator from '../../components/MetaDecorator';
import Swal from 'sweetalert2';
import i18next from "i18next";

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});
const validEmailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i);
class UserSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name : '',
            email : '',
            mobilenumber : '',
            password : '',
            c_password : '',
            t_and_c : false,
            name_err : '',
            email_err : '',
            mobile_err : '',
            password_err : '',
            c_password_err : '',
            t_and_c_err : '',
            form_has_err : false,
            m_ex_err : 0,
            e_ex_err : 0,
            uiconfig_state : {}
        }
    }
    
    firebaseui_loads() {
        const config = {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
            databaseURL: process.env.REACT_APP_FIREBASE_DBURL,
            projectId: process.env.REACT_APP_FIREBASE_PROID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID,
            measurementId: process.env.REACT_APP_FIREBASE_MEASURE_ID
        };
        
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        const rm = this;
        const uiconfig = {
            // Popup signin flow rather than redirect flow.
            signInFlow: 'popup',
            // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
            signInSuccessUrl: '/signedIn',
            // We will display Google and Facebook as auth providers.
            signInOptions: [
                {
                    provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                    recaptchaParameters: {
                        type: 'image', // 'audio'
                        size: 'invisible', // 'invisible' or 'compact'
                        badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
                    },
                    defaultCountry: 'IN',
                }
            ],
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    var verified_phone_no = authResult['user']['phoneNumber'];
                    rm.setState({ mobilenumber : verified_phone_no, form_has_err : false })
                    rm.mobile_already_exists();
                }	
            }
        };
        this.setState({
            uiconfig_state : uiconfig
        })
    }
    save_user = () => {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        
        const params = new URLSearchParams()
        params.append('password', this.state.password)
        params.append('login_type', 'email')
        params.append('name', this.state.name)
        params.append('mobile', this.state.mobilenumber)
        params.append('email', this.state.email)
        params.append('login_id', this.state.email)
        params.append('device_token', 'dfsf')
        params.append('device_platform', 'web')
        params.append('language_type', 'en')
        params.append('device_mode', '0')
        
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/signup`, 
        params,config)
            .then(res => {
                if(res.status === 200) {
                    if(res.data.status_code === 200){
                        this.setState({t_and_c_err: ''});
                        // history.replaceState('/user/user-login/1');
                        this.setState({t_and_c_err: 'User Created Successfully...'});
                        this.setState({
                            name : '',
                            email : '',
                            mobilenumber : '',
                            password : '',
                            c_password : '',
                            t_and_c : false
                        });
                        Toast.fire({
                            icon: 'success',
                            title: 'Your Account has been to created!'
                        });
                        this.props.history.push('/user/user-login');
                    }
                    else if(res.data.status_code === 400){
                        this.setState({t_and_c_err: res.data.message});
                    }
                    else {
                        this.setState({t_and_c_err: 'Something Went Wrong!'});
                    }
                }
                else {
                    this.props.history.push('/user/user-signup');
                }
            })
    }
    mobile_already_exists = () => { 
        var mobile = this.state.mobilenumber;
        if(mobile.trim() !== '') { 
            const config = { 
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            
            const params = new URLSearchParams()
            params.append('mobile', mobile)
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/mobileexists`, 
            params,config)
            .then(res => {
                if(res.data.status_code === 200){
                    // history.replaceState('/user/user-login/1');
                    this.setState({m_ex_err: 0});
                    this.setState({mobile_err: ''});
                }
                else if(res.data.status_code === 400){
                    this.setState({mobile_err: res.data.message});
                    this.setState({m_ex_err: 1});
                }
                else {
                    this.setState({t_and_c_err: 'Something Went Wrong!'});
                    this.setState({m_ex_err: 1});
                }
            })
        }
    }
    email_already_exists = () => {
        var email = this.state.email;
        const chk_email = validEmailRegex.test(email);
        if(email.trim() !== '' && chk_email === true) {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            const params = new URLSearchParams()
            params.append('email', email)
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/emailexist`, 
            params,config)
            .then(res => {
                if(res.data.status_code === 200){
                    // history.replaceState('/user/user-login/1');
                    this.setState({e_ex_err: 0, email_err : ''});
                }
                else if(res.data.status_code === 400){
                    this.setState({email_err: res.data.message});
                    this.setState({e_ex_err: 1});
                }
                else {
                    this.setState({t_and_c_err: 'Something Went Wrong!'});
                    this.setState({e_ex_err: 1});
                }
            })
        }
    }
    userSignup_submit = event => {
        event.preventDefault();
        var err = 0;
        const user = {
            password: this.state.password,
            login_type: 'email',
            name: this.state.name,
            mobile: this.state.mobilenumber,
            email: this.state.email
        };
        var password = user.password.trim();
        var c_password = this.state.c_password.trim();
        if(user.name === '')
        {
            this.setState({name_err: i18next.t('Name is required!')});
            err++;
        }
        else if(user.name.length < 3) {
            this.setState({name_err: i18next.t('Name should more than 3 Character!')});
            err++;
        }
        else {
            this.setState({name_err: ''});
        }
        if(user.email === '')
        {
            this.setState({email_err: i18next.t('Email is required!') });
            err++;
        }
        else if(validEmailRegex.test(user.email) === false) {
            this.setState({email_err: i18next.t('Email is Invalid') });
            err++;
        }
        else if(this.state.e_ex_err !== 0) {
            this.setState({email_err: i18next.t('Email Already exists')});
            err++;
        }
        else {
            this.setState({email_err: ''});
        }
        if(user.mobile === '') {
            this.setState({mobile_err: i18next.t('Mobile Number is required!')});
            err++;
        }
        else if(isNaN(user.mobile)) {
            this.setState({mobile_err:i18next.t('Enter Number Only!')});
            err++;
        }
        else if(this.state.m_ex_err !== 0) {
            this.setState({mobile_err: i18next.t('Mobile Number Already exists')});
            err++;
        }
        else {
            this.setState({mobile_err:''});
        }
        if(user.password === '') {
            this.setState({password_err: i18next.t('Password is required!')});
            err++;
        }
        else if(user.password.length < 6) {
            this.setState({password_err: i18next.t('Password Must be in above 6 Characters')});
            err++;
        }
        else {
            this.setState({password_err:''});
        }
        if(c_password === '') {
            this.setState({c_password_err: i18next.t('Make Sure Your Password is Correct!')});
            err++;
        }
        else if(password !== c_password) {
            this.setState({c_password_err: i18next.t('Whoops! Your Password is Mismatch, Try again')});
            err++;
        }
        else {
            this.setState({c_password_err:''});
        }

        if(this.state.t_and_c === false) {
            this.setState({t_and_c_err: i18next.t('Check the Terms & Conditions!')});
            err++;
        }
        else {
            this.setState({t_and_c_err:''});
        }
        if(err === 0) {
            this.save_user();
        }
        else {
            this.setState({
                form_has_err : false
            });
        }
    }
    dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
        u8arr[n] = bstr.charCodeAt(n);
        }
      return new File([u8arr], filename, {type:mime});
    }
    social_signin = (social_is) => {
        var provider = null;
        if(social_is === 'google') {
            provider = new firebase.auth.GoogleAuthProvider();
        }
        else {
            provider = new firebase.auth.FacebookAuthProvider();
        }
        
        var rm = this;
        firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            // var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            var social_user_info = user.providerData[0];
            let url = social_user_info.photoURL;
            var file_obj = [];
            
            const toDataURL = url => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
            }))
            toDataURL(url)
            .then(dataUrl => {
                var fileData = rm.dataURLtoFile(dataUrl, "imageName.jpg");
                
                file_obj.push(fileData)
                
            })
            const config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams();
            params.append('name' , social_user_info.displayName);
            params.append('email' , social_user_info.email);
            params.append('login_id' , social_user_info.uid);
            if(social_user_info.providerId === "google.com") {
                params.append('login_type' , 'google');
            }
            else {
                params.append('login_type' , 'facebook');
            }
            params.append('device_token' , 'fromweb4sdf8s4fsf1s8f4d4wfw');
            params.append('device_mode' , '0');
            params.append('device_platform' , 'web');
            params.append('language_type' , 'en');

            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/socialsignin`,params,config).then(res => {
                if(res.data.status_code === 200)
                {
                    localStorage.setItem('user',JSON.stringify(res.data));
                    localStorage.setItem('access_token',res.data.access_token);
                    var user_id = res.data.user_id;
                    const formData = new FormData();
                    formData.append("image", file_obj[0]);
                    formData.append("user_id", user_id);
                    
                    delete axios.defaults.headers.common["Authorization"];
                    axios({
                        method: "post",
                        url: `${process.env.REACT_APP_MEDIA_URL}/api/v1/user/profileupload`,
                        data: formData,
                        headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then (res1 => {
                        if(res1.data.status_code === 200) {
                            localStorage.removeItem('user');
                            res.data.user_image = res1.data.image;
                            localStorage.setItem('user',JSON.stringify(res.data));
                            axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
                           
                        } 
                    })
                    this.props.history.push('/');
                    window.location.reload(false);

                }
                else
                {
                    this.setState({login_err : res.data.message});
                    this.props.history.push('/user/user-login');
                }
            })
            // ...
        }).catch((error) => {
            console.log(error);
        });
    }
    render() {
        return (
            <React.Fragment>
                <MetaDecorator title="| User Signup" description="IDemand User Signup Page" />
                <div className="container">
                    <div className="my-5">
                        <div className="authenticateWidth user">
                            
                            <div className="d-flex justify-content-between mb-3">
                                <div className="align-self-center">  <h4 className="fB mb-0">{i18next.t('Signup to Join')}</h4></div>
                                <div className="align-self-center">   <Link to="/tasker/tasker-login">  <div className='d-flex'><h6 className="mb-0 fM primaryClr">{i18next.t('Tasker Login')} </h6> <RightOutlined className="primaryClr align-self-end ml-1" /> </div></Link></div>
                            </div>
                            { this.state.form_has_err === false ? 
                            <div className="authenticateField mb-4">
                                <div className="d-flex justify-content-around border-bottom p-3">
                                    <span ><Link to="/user/user-login" className="txtClr fM">{i18next.t('Login')}</Link></span>
                                    <span className="primaryClr fM">{i18next.t('Signup')}</span>
                                </div>
                                <form  className="floatingLabelStyle p-4 py-5 px-sm-5">
                                    <FloatingInputs labelName={i18next.t('Name')}>
                                        <input type="text" name="name" placeholder=" " onChange={(e) => this.setState({name : e.target.value.replace(/[^\w\s]/gi, "") })} value={this.state.name} maxLength="50" />
                                        <p className="text-danger" id="name_err">{this.state.name_err}</p>
                                    </FloatingInputs>

                                    <FloatingInputs labelName={i18next.t('Email')}>
                                        {/* <span className="tick"></span> */}
                                        <input type="email" name="email" placeholder=" " onChange={(e) => this.setState({email : e.target.value})} value={this.state.email} onBlur={this.email_already_exists} maxLength="100"/>
                                        <p className="text-danger" id="email_err">{this.state.email_err}</p>
                                    </FloatingInputs>

                                    <FloatingInputs labelName={i18next.t('Mobile Number')}>
                                        {/* <span className="tick"></span> */}
                                        <input type="text" name="mobile" placeholder=" " onMouseDown={ (e) => { e.stopPropagation(); this.setState({ form_has_err : true }); this.firebaseui_loads(); } } value={this.state.mobilenumber} />
                                        <p className="text-danger" id="mobile_err">{this.state.mobile_err}</p>
                                    </FloatingInputs>
                                    <FloatingInputs labelName={i18next.t('Password')}>
                                        {/* <span className="tick"></span> */}
                                        <input type="password" name="password" placeholder=" " onChange={(e) => this.setState({password : e.target.value})} value={this.state.password} maxLength="50"/>
                                        <p className="text-danger" id="password_err">{this.state.password_err}</p>
                                    </FloatingInputs>
                                    <FloatingInputs labelName={i18next.t('Confirm Password')}>
                                        {/* <span className="tick"></span> */}
                                        <input type="password" name="c_password" placeholder=" " onChange={(e) => this.setState({c_password : e.target.value})} value={this.state.c_password} maxLength="50"/>
                                        <p className="text-danger" id="c_password_err">{this.state.c_password_err}</p>
                                    </FloatingInputs>
                                    

                                    <div className="d-flex justify-content-center ">
                                        <div className="align-self-center">
                                            <Checkbox className="font-sm" name="t_and_c" onChange={(e) => this.setState({t_and_c : !this.state.t_and_c})} value={this.state.t_and_c} checked={this.state.t_and_c}>{i18next.t('I have agree all')} <Link to="/terms-condition" target="_blank">{i18next.t('Terms & Conditions')}</Link></Checkbox>
                                        </div>
                                    </div>
                                    <div className="w-100">
                                        
                                    </div>
                                    <p className="text-center text-danger" id="t_and_c_err">{this.state.t_and_c_err}</p>
                                    <Button onClick={this.userSignup_submit} size="large" className="PrimaryBtn lg fM my-4" block>Signup</Button>
                                    <p className="text-center mb-0 fM mt-3">{i18next.t('Already a Member')} ?  <Link to="/user/user-login"> {i18next.t('Login')}</Link></p>

                                </form>
                            </div>
                            :
                            <div className="authenticateField mb-4">
                                <div className="d-flex p-2 align-items-center hover-cont"
                                onClick={ ()=>{ this.setState({ form_has_err : false }) }  }> 
                                    <ArrowLeftOutlined  />
                                    &nbsp;
                                    <span>{i18next.t('Back')} </span>
                                </div>
                                <div className="floatingLabelStyle p-4 pb-5 text-center">
                                    <StyledFirebaseAuth uiConfig={this.state.uiconfig_state} firebaseAuth={firebase.auth()}/>
                                </div>
                            </div>
                            }
                            <div className="authenticateField">
                                <div className="text-center p-3">
                                    <p className="mb-0"> {i18next.t('Login with social')}</p>
                                    {/* <StyledFirebaseAuth uiConfig={this.state.uiconfig} firebaseAuth={firebase.auth()}/> */}
                                    
                                    <div className="d-flex justify-content-center mt-3">
                                        
                                        <div className="socialIcon cursorPointer">
                                            <img onClick={ (e)=> { e.stopPropagation(); this.social_signin('google'); } } src={require("../../assets/icons/social/google.png")} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UserSignup;