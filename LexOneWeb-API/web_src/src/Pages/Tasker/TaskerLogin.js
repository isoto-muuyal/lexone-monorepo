import React from "react";
import { Link } from "react-router-dom";
import FloatingInputs from "../../components/FloatingLabel";
import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons';
import { Checkbox, Button } from 'antd';
import axios from 'axios';
import firebase from 'firebase';
import Cookies from 'universal-cookie';
import MetaDecorator from '../../components/MetaDecorator';
import i18next from "i18next";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import MockLoginHint from '../../components/MockLoginHint';
import { isMockAuthEnabled, persistMockSession, tryMockLawyerLogin } from '../../utils/mockAuth';

const fcm_config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DBURL,
    projectId: process.env.REACT_APP_FIREBASE_PROID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASURE_ID
}

if (!firebase.apps.length) {
    firebase.initializeApp(fcm_config);
}else {
    firebase.app(); 
}

class TaskerLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password : '',
            email_err : '',
            password_err : '',
            login_err : '',
            login_succ : '',
            remember_me : false,
            form_has_err : false,
            cookies : new Cookies()
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
                    //defaultCountry: 'SG', // Singapore
                    defaultCountry: 'IN',
                }
            ],
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    var verified_phone_no = authResult['user']['phoneNumber'];
                    rm.setState({ mobilenumber : verified_phone_no, form_has_err : false })
                    var device_token = '';
                    if(localStorage.getItem('device_token') === null) {
                        device_token = 'fsdfsdf9787977897';
                    }
                    else {
                        device_token = localStorage.getItem('device_token');
                    }
                    const params = new URLSearchParams();
                    params.append('phone' , verified_phone_no);
                    params.append('login_id' , verified_phone_no);
                    params.append('login_type' , 'phone');
                    params.append('device_mode' , '0');
                    params.append('device_platform' , 'web');
                    params.append('device_token' , device_token);
                    axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/signin`,params,config).then(res => {
                        if(res.data.status_code === 200)
                        {
                            localStorage.setItem('user',JSON.stringify(res.data));
                            localStorage.setItem('access_token',res.data.access_token);
                            rm.setState({login_err : ''});
                            window.location.reload();                            
                        }
                        else
                        {
                            rm.setState({login_err : "Mobile number Not Registered"});
                            rm.props.history.push('/tasker/tasker-login');
                        }
                    })
                }   
            }
        };
        this.setState({
            uiconfig_state : uiconfig
        })
    }

    componentDidMount= () => {
        this.get_remember_me_options()
    }
    get_remember_me_options = () => {
        if((this.state.cookies.get('tasker_email') && this.state.cookies.get('tasker_password')) && this.state.cookies.get('tasker_email') !== '' && this.state.cookies.get('tasker_password') !== '') {
            this.setState({remember_me : true, email : this.state.cookies.get('tasker_email'), password : this.state.cookies.get('tasker_password') });
        }
        else {
            this.setState({remember_me : false});
        }
    }
    authenticate_tasker = () => {
        var err = 0;
        const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i); // eslint-disable-line
        if(this.state.email.trim() === '') {
            this.setState({ email_err : i18next.t("Email is required!") });
            err++;
        }
        else if(!validEmailRegex.test(this.state.email)) {
            this.setState({ email_err : i18next.t("Email is Invalid") });
            err++;
        }
        else {
            this.setState({ email_err : '' });
        }

        if(this.state.password.trim() === '') {
            this.setState({ password_err : i18next.t("Password is required!") });
            err++;
        }
        else {
            this.setState({ password_err : '' });
        }

        if(err === 0){
            if (isMockAuthEnabled()) {
                const mockSession = tryMockLawyerLogin(this.state.email, this.state.password);
                if (mockSession) {
                    persistMockSession(mockSession);
                    this.props.history.push('/tasker');
                    window.location.reload(false);
                    return;
                }
            }

            const config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            var device_token = '';
            if(localStorage.getItem('device_token') === null) {
                if(localStorage.getItem('ip_address') !== null) {
                    device_token = localStorage.getItem('ip_address');
                }
                else {
                    device_token = Math.random();
                }
            }
            else {
                device_token = localStorage.getItem('device_token');
            }
            const params = new URLSearchParams();
            params.append('email' , this.state.email);
            params.append('password' , this.state.password);
            params.append('login_id' , this.state.email);
            params.append('login_type' , 'email');
            params.append('device_token' , device_token);
            params.append('device_mode' , '1');
            params.append('device_platform' , 'web');

            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/signin`,params,config).then(res => {
                console.log(res);
                // console.log(res.data);
                if(res.data.status_code === 200)
                {
                    localStorage.setItem('user',JSON.stringify(res.data));
                    localStorage.setItem('access_token',res.data.access_token);
                    this.props.history.push('/tasker');
                    window.location.reload(false);
                }
                else
                {
                    this.setState({password_err : res.data.message});
                }
            })
        }
        
    }
    set_remember_me = () => {
        this.setState({ remember_me : !this.state.remember_me });
        if(this.state.remember_me !== true) {
            this.state.cookies.set('tasker_email', this.state.email, { maxAge : 10000 });
            this.state.cookies.set('tasker_password', this.state.password, { maxAge : 10000 });
        }
        else {
            this.state.cookies.remove('tasker_email');
            this.state.cookies.remove('tasker_password');
        }
    }
    render() {
        return (
            <React.Fragment>
                <MetaDecorator title='| Tasker Login' description="Tasker Login Page"/>
                <div className="container">
                    <div className="my-5">
                        <div className="authenticateWidth user">

                            <div className="d-flex justify-content-between mb-3">
                                <div className="align-self-center">  <h4 className="fB mb-0">{ i18next.t("Login with Tasker") }</h4></div>
                                <div className="align-self-center">   <Link to="/user/user-login">  <div className='d-flex'><h6 className="mb-0 fM primaryClr">{i18next.t('User Login')} </h6> <RightOutlined className="primaryClr align-self-end ml-1" /> </div></Link></div>
                            </div>
                            { this.state.form_has_err === false ? 
                            <div className="authenticateField mb-4">
                                <div className="d-flex justify-content-around border-bottom p-3">
                                    <span className="primaryClr fM">{ i18next.t("Login") }</span>
                                    <span><Link to="/tasker/tasker-signup" className="txtClr fM">{ i18next.t("Signup") }</Link></span>
                                </div>
                                <form action="" className="floatingLabelStyle p-4 pb-3 px-sm-5 mt-3">
                                    <FloatingInputs labelName={ i18next.t("Email") }>

                                        <input type="email" maxLength="50" onKeyUp={(e)=> { if (e.keyCode === 13) {
                                            this.authenticate_tasker();
                                        } }} placeholder=" " onChange={(e)=> this.setState({ email : e.target.value }) } value={this.state.email}/>
                                        <p className="text-danger">{this.state.email_err}</p>
                                    </FloatingInputs>

                                    <FloatingInputs labelName={ i18next.t("Password") }>
                                        <input type="password" onKeyUp={(e)=> { if (e.keyCode === 13) {
                                            this.authenticate_tasker();
                                        } }} maxLength="30" placeholder=" " onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />
                                        <p className="text-danger">{this.state.password_err}</p>
                                    </FloatingInputs>

                                    <div className="d-flex justify-content-center rememberMe">
                                        <div className="align-self-center">
                                        <Checkbox checked={this.state.remember_me} className="font-sm" value={this.state.remember_me} onChange={ this.set_remember_me }>{ i18next.t("Remember me") }</Checkbox>
                                        </div>
                                        <div className="align-self-center">
                                            <Link to="/forgotPassword/tasker">
                                                <p className="mb-0 font-sm cursorPointer forgotPasswordTxt txtClr">{ i18next.t("Forgot password") } ?</p>
                                            </Link>
                                        </div>
                                    </div>

                                    <Button onClick={this.authenticate_tasker} size="large" className="PrimaryBtn lg my-3" block>{ i18next.t("Login") }</Button>
                                    <MockLoginHint role="tasker" />
                                    {/* <Button onClick={ (e)=> { e.stopPropagation(); this.setState({ form_has_err : true }); this.firebaseui_loads(); } } size="large" className="PrimaryBtn lg" block>{ i18next.t("Login with Mobile") }</Button> */}
                                    <p className="text-danger">{this.state.login_err}</p>
                                    <p className="text-success">{this.state.login_succ}</p>
                                    <p className="mb-0 text-center">{ i18next.t("Haven't account") } ? <Link to="/tasker/tasker-signup">{ i18next.t("Signup") }</Link></p>

                                </form>
                            </div>
                            :
                            <div className="authenticateField mb-4">
                                <div className="d-flex p-3 align-items-center hover-cont"
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
                            {/*<div className="authenticateField">
                                <div className="text-center p-3">
                                    <p className="mb-0"> {i18next.t("Login with Mobile")}</p>                                    
                                    <div className="d-flex justify-content-center mt-3">
                                        <div className="socialIcon cursorPointer">
                                            <img onClick={ (e)=> { e.stopPropagation(); this.setState({ form_has_err : true }); this.firebaseui_loads(); } } src={require("../../assets/icons/social/phone.png")} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default TaskerLogin;