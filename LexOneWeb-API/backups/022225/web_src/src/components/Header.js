import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { Menu, Dropdown, Button } from 'antd';
import TopCategories from "./headerModules/topCategories";
import ProfileSideBar from './headerModules/profileSideBar';
import TaskerSideBar from '../components/TaskerHeaderModules/TaskerSidebar';
import axios from 'axios';
import {loggedin} from '../redux/actions';
import {connect} from 'react-redux';
import socketIOClient from 'socket.io-client';
import MyAutoComplete from './FileAutoComplete';
import firebase from 'firebase';
import i18next from 'i18next';
import Swal from 'sweetalert2';

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

const socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);

const mapStateToProps=(props)=> {
    return {
        loginvalue : props.isLogged
    }
}

const mapDispatchToProps=(dispatch)=> {
    return {
        loggedin : (userdata)=>dispatch(loggedin(userdata))
    }
}

const NavLocationSearch = (props) => {

    return (
        <>
            <div className={"position-relative locationSearchTop mr-auto " + (props.hideOnResponsive ? "d-none d-md-flex " : "")
                + (props.showOnResponsive ? " d-flex d-md-none " : "")} >
                <div className="search pr-2 w-100 ml-md-2 ml-0">
                   
                      <MyAutoComplete />
                </div>
            </div>

        </>
    );
}

const TaskThings = (props) => {
    var user_info = {}
    if(localStorage.getItem('user') !== null) {
        user_info = JSON.parse(localStorage.getItem('user'));
    }
    return (
        <div className={"" + (props.hideOnResponsive ? "d-none d-md-flex " : "")
        + (props.showOnResponsive ? " d-flex d-md-none " : "")} >
        <Dropdown
            getPopupContainer={() => document.getElementById('area')}
            trigger={['click']}
            placement="bottomRight"
            overlay={
                <Menu>
                    <Menu.Item key="0">
                        <Link to={ user_info && Object.keys(user_info).length === 0 && user_info.constructor === Object ? {pathname:"/user/user-login", state: { pre_url : '/user/post-task', allocated_services : [] }} : "/user/post-task" }> {i18next.t('Post a Task')} </Link>
                    </Menu.Item>
                    {
                        (user_info && Object.keys(user_info).length === 0 && user_info.constructor === Object) &&
                        <Menu.Item key="1">
                            <Link to="/tasker/tasker-login">{i18next.t('Become a Tasker')} </Link>
                        </Menu.Item>
                    }
                </Menu>
            }>

            <span className="ant-dropdown-link d-flex align-items-center cursorPointer">{i18next.t('Tasks')}   <div className="downIcon ml-2" /> </span>
        </Dropdown>
        </div>
    )
}

class Header extends React.Component {
    constructor (props) {
        super(props);
        //Auto Logout
        this.state = {
            logginStatus : false
          }
        //   this.events = [
        //     "load",
        //     "mousemove",
        //     "mousedown",
        //     "click",
        //     "scroll",
        //     "keypress"
        //   ];
          
        //   this.warn = this.warn.bind(this);
        //   this.logout = this.logout.bind(this);
        //   this.resetTimeout = this.resetTimeout.bind(this);
      
        //   for (var i in this.events) {
        //     window.addEventListener(this.events[i], this.resetTimeout);
        //   }
          
        //   this.setTimeout();
        //Auto Logout
    }
    //Auto Logout
    // clearTimeout() {
    //     if (this.warnTimeout) clearTimeout(this.warnTimeout);

    //     if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
    // }

    // setTimeout() {
    //     if(this.state.logginStatus === true) {
    //         this.warnTimeout = setTimeout(this.warn, 300 * 1000);

    //         this.logoutTimeout = setTimeout(this.logout, 1200 * 1000);
    //     }
    // }

    // resetTimeout() {
    //     if(this.state.logginStatus === true) {
    //         this.clearTimeout();
    //         this.setTimeout();
    //     }
    // }

    // warn() {
    //     if(this.state.logginStatus === true) {
    //         console.log("You will be logged out automatically in 1 minute.");
    //     }
    // }

    // logout() {
    //     // Send a logout request to the API
    //     if(this.state.logginStatus === true) {
    //         if(localStorage.getItem('user') !== null) {
    //             var user_info = JSON.parse(localStorage.getItem('user'));
    //             console.log('user_infofor logout');
    //             console.log(user_info);
    //             var user_id = user_info.user_id;
    //             var user_type = user_info.type;
    //             const config = {
    //                 headers : {
    //                     'Content-type' : 'application/x-www-form-urlencoded'
    //                 }
    //             }
    //             var url = '';
    //             var redirect_uri = '';
    //             if(user_type === 'user') {
    //                 url = `${process.env.REACT_APP_BASE_URL}/web/api/v1/user/signout`;
    //                 redirect_uri = '/';
    //             }
    //             else {
    //                 url = `${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/signout`;
    //                 redirect_uri = '/tasker/tasker-login';
    //             }
    //             const params = new URLSearchParams();
    //             params.append('user_id',user_id);
    //             axios.post(url,params,config).then(res => {
    //                 console.log(res);
    //                 if(res.data.status_code === 200)
    //                 {
    //                     localStorage.removeItem('access_token');
    //                     localStorage.removeItem('user');
    //                     this.props.loggedin({});
    //                     this.props.history.push(redirect_uri);
    //                     window.location.reload(false);
    //                 }
    //                 else {
    //                     alert(res.data.message);
    //                 }
    //             })
    //             console.log("Sending a logout request to the API...");
    //             this.setState({ logginStatus: false });
    //         }
    //     }
    //     // this.destroy(); // Cleanup
    // }

    // destroy() {
    //     this.clearTimeout();

    //     for (var i in this.events) {
    //         window.removeEventListener(this.events[i], this.resetTimeout);
    //     }
    // }    
    
    //Auto Logout End Here..

    componentDidMount = () => {
        this.get_appdefault();
        this.get_basic_info();
        // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        //     this.tasker_post_location();
        // }
        
        // this.get_device_token();
        console.log('triggered');
    }
    get_basic_info = () => {
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        if(general_info !== null && Object.keys(general_info).length > 0) {
            this.setState({ general_info : general_info });  
        }
        else {
            axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/appdefaults`)
            .then(res => {
                if(res.data.status_code === 200)
                {
                    this.setState({ general_info : res.data });
                }
                else {
                    this.setState({ general_info : {} });
                }
            });
        }
    }
    logo_image_err = (ev) => {
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        console.log('general_info',general_info);
        ev.target.src = general_info.site_logo;
    }
    tasker_post_location = () => {
        if(localStorage.getItem('user') !== null) {
            var user_info = JSON.parse(localStorage.getItem('user'));
            var general_info = JSON.parse(localStorage.getItem('general_info'));
            if(user_info.type === 'tasker') {
                if(general_info.instant_location === 'true') {
                    // eslint-disable-next-line
                    let refreshIntervalId = setInterval(() => {
                        var rm = this;
                        navigator.geolocation.getCurrentPosition(function(position) {
                            var latitude = position.coords.latitude;
                            var longitude = position.coords.longitude;
                            rm.setState({ lat:latitude,lon:longitude });
                            const config = {
                                headers : { 'Content-Type' : 'application/x-www-form-urlencoded' } 
                            }
                            var api_key = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
                            var instance = axios.create();
                            delete instance.defaults.headers.common['Authorization'];

                            instance.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&key='+api_key,config)
                            .then(response => {
                                axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
                                console.log('eeeeeeeeeee',response);
                                rm.setState({ post_location : response.data.results[0].formatted_address, lat : latitude, lon : longitude },()=>{
                                    var pl_obj = {};
                                    pl_obj.type = "postLocation";
                                    pl_obj.user_id = user_info.user_id;
                                    pl_obj.lat = latitude;
                                    pl_obj.lon = longitude;
                                    pl_obj.location = response.data.results[1].formatted_address;

                                    socket.emit('sendMessage',pl_obj);
                                })
                                
                            })
                            .catch(err => {
                                axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
                                console.log(err)
                            })
                        }, function(error) {
                            console.log('safari_error',error);
                            Toast.fire({
                                icon: 'warning',
                                title: "Please allow location, on Browser!"
                            });
                        });
                        
                    }, 1000);
                    
                }
            }
        }
    }
    UNSAFE_componentWillMount = () => {
        this.get_tasker_profile();
    }
    get_tasker_profile = () => {
        if(localStorage.getItem('user') !== null) {
            var user_info = JSON.parse(localStorage.getItem('user'));
            var user_id = user_info.user_id;
            if(user_info.type === 'tasker') {
                const config = {
                    headers : {
                        'Content-type' : 'application/x-www-form-urlencoded'
                    }
                }
                const params = new URLSearchParams();
                params.append('user_id',user_id);
                axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/profile`,params, config)
                .then (res => {
                    console.log('refreshacc');
                    console.log(res.data);
                    if(res.data.status_code === 200) {
                        user_info.payment_verified = res.data.payment_verified;
                        user_info.profile_verified = res.data.profile_verified;
                        localStorage.removeItem('user');
                        localStorage.setItem('user',JSON.stringify(user_info));
                    } 
                    else if(res.data.status_code === 401) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('user');
                        this.props.history.push('/');
                        window.location.reload(false);
                    }
                })
            }
        }
        
    }
    get_appdefault = () => {
        const {pathname} = this.props.location;
        
        if (localStorage.getItem("user") === null) {
            this.props.loggedin({})
            this.setState({ logginStatus : false })
        }
        else {
            var user_info = JSON.parse(localStorage.getItem('user'));
            if(user_info.type === 'user') {
                if(pathname === '/user/user-login') {
                    this.props.history.push('/');
                }
            }
            else {
                if(pathname === '/tasker/tasker-login') {
                    this.props.history.push('/tasker');
                }
            }
            this.props.loggedin(user_info)
            this.setState({ logginStatus : true })
        }
    }
    render() {   
        return (
            <nav className="topNav" id="area">
                <div className="container">
                    <div className="d-flex header">
                        <div className="align-self-center">
                            <div className="align-self-center logo">
                                <Link to={ "/" }>
                                    <img onError={ this.logo_image_err } src={ this.state.general_info && this.state.general_info.site_logo } alt="" className="h-100 w-100" />
                                </Link>
                            </div>
                        </div>
                        {
                            this.props.user && this.props.user.type === "user" ? 
                            <TopCategories hideOnResponsive />
                            :
                            this.props.user && this.props.user.type === "tasker" ?
                            <></>
                            :
                            !this.props.user &&
                            <TopCategories hideOnResponsive />
                        }

                        <div className="align-self-center w-50">
                        {
                            this.props.user && this.props.user.type === "user" ? 
                            <NavLocationSearch hideOnResponsive />
                            :
                            !this.props.user &&
                            <NavLocationSearch hideOnResponsive />
                        }
                        </div>

                        <div className="align-self-center ml-auto mr-3">
                            {
                                this.props.user && this.props.user.type === 'user' && 
                                <TaskThings hideOnResponsive user_info = { this.props.user ? this.props.user : {} }/>
                            }
                            {
                                this.props.user === null && 
                                <TaskThings hideOnResponsive user_info = { this.props.user ? this.props.user : {} }/>
                            }
                        </div>

                        { !this.props.user ? 
                        <div className="align-self-center">
                            <Link to="/user/user-login">
                                <Button className="PrimaryBtn lg"> {i18next.t('Account')} </Button>
                            </Link>
                        </div> : [
                            (
                                this.props.user.type === "user" ? 
                                <ProfileSideBar userImage={this.props.user.user_image} userName={this.props.user.name} userInfo={this.props.user}/> 
                                :
                                <TaskerSideBar userImage={this.props.user.user_image} userName={this.props.user.name} userInfo={this.props.user}/>
                            ),
                        ]
                        
                        }

                    </div>

                    <div className={ this.props.user && this.props.user.type === "user" ? "d-md-none p-b15 pt-md-0" : this.props.user && this.props.user.type === "tasker" ? "d-none p-b15 pt-md-0" : !this.props.user && "d-md-none p-b15 pt-md-0" }>

                        <div className="d-flex justify-content-between align-self-center ml-xl-5 p-b15">
                            {
                                this.props.user && this.props.user.type === "user" ? 
                                <TopCategories showOnResponsive />
                                :
                                this.props.user && this.props.user.type === "tasker" ?
                                <></>
                                :
                                !this.props.user &&
                                <TopCategories showOnResponsive />
                            }
                            {
                                this.props.user && this.props.user.type === 'user' && 
                                <TaskThings showOnResponsive user_info = { this.props.user ? this.props.user : {} }/>
                            }
                            {
                                this.props.user === null && 
                                <TaskThings showOnResponsive user_info = { this.props.user ? this.props.user : {} }/>
                            }
                        </div>
 
                        <div className="align-self-center flex-1">
                        {
                            this.props.user && this.props.user.type === "user" ? 
                            <NavLocationSearch showOnResponsive />
                            :
                            !this.props.user &&
                            <NavLocationSearch showOnResponsive />
                        }
                        </div>

                    </div>

                </div>
            </nav>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Header));