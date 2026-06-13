import React, { Component } from 'react';
import FloatingInputs from "../../../components/FloatingLabel";
import { withRouter } from "react-router-dom";
import { Button } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import SimpleBar from "simplebar-react";
import axios from 'axios';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Swal from 'sweetalert2';
import {loggedin} from '../../../redux/actions';
import {connect} from 'react-redux';
import i18next from 'i18next';

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

class EditProfileSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            imagePreviewUrl: '',
            value: '',
            user_info : this.props.userInfo,
            set_user_info: {},
            m_ex_err : 0,
            mobile_err : '',
            name_err : '',
            form_has_err : false,
            uiconfig_state : {},
            
        };
        this._handleImageChange = this._handleImageChange.bind(this);
    }
    componentDidMount = () => {
        this.get_profile_info_by_user();
    }
    if_password_less_hide_change_password = () => {
        if(this.state.set_user_info && this.state.set_user_info.password_less_login === "true") {
            this.span.click();
        }
    }
    mobile_already_exists = () => { 
        var mobile = this.state.set_user_info.mobile;
        if(mobile.trim() !== '') { 
            if(this.state.set_user_info.mobile !== this.state.user_info.mobile) {
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
                    else if(res.data.status_code === 401) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('user');
                        this.props.history.push('/');
                        window.location.reload(false);
                    }
                    else {
                        this.setState({t_and_c_err: 'Something Went Wrong!'});
                        this.setState({m_ex_err: 1});
                    }
                })
            }
            else {
                this.setState({m_ex_err: 0});
            }
        }
    }
    profile_validation = () => {
        var err = 0;
        if(this.state.set_user_info.name === '') {
            this.setState({ name_err : i18next.t('Name is required!') });
            err++;
        }
        else {
            this.setState({ name_err : '' });
        }

        if(this.state.set_user_info.mobile === '') {
            this.setState({ mobile_err : i18next.t('Mobile is required!') });
            err++;
        }
        else if(this.state.m_ex_err !== 0) {
            this.setState({mobile_err: i18next.t('Mobile Already exists')});
            err++;
        }
        else {
            this.setState({mobile_err: ''});
        }

        if(err === 0) {
            this.update_profile_info();
        }
        else {
            this.setState({
                form_has_err : false
            });
        }
    }
    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        if (validImageTypes.includes(file.type)) {
            if(file.size <= 2001000) {
                reader.onloadend = () => {
                    this.setState({
                        file: file,
                        imagePreviewUrl: reader.result
                    });
                }
                reader.readAsDataURL(file)
                this.update_profile_picture();
            }
            else {
                Toast.fire({
                    icon: 'warning',
                    title: i18next.t('Upload file size should be less than 2MB!')
                });
            }
        }
        else {
            Toast.fire({
                icon: 'warning',
                title: i18next.t('Upload only Images!')
            });
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
                    var set_user_info = rm.state.set_user_info;
                    set_user_info.mobile = verified_phone_no;
                    rm.setState({ set_user_info : set_user_info, form_has_err : false });
                    rm.mobile_already_exists();
                }	
            }
        };
        this.setState({ uiconfig_state : uiconfig })
    }
    update_profile_info = () => {
        var user_info = this.state.set_user_info;
        var pre_user_info = this.state.user_info;

        const config = {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        }
        if(user_info.name !== pre_user_info.name || user_info.mobile !== pre_user_info.mobile) {
            const params = new URLSearchParams()
            params.append('user_id', user_info.user_id);
            params.append('mobile', user_info.mobile);
            params.append('name', user_info.name);
            
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/profile`, 
            params,config)
                .then(res => {
                    console.log(res);
                    if(res.status === 200) {
                        if(res.data.status_code === 200){
                            // history.replaceState('/user/user-login/1');
                            
                            localStorage.removeItem('user');
                            var set_user_info = this.state.user_info;
                            console.log('updaet_phone');
                            console.log(set_user_info);
                            set_user_info.mobile = user_info.mobile;
                            set_user_info.name = user_info.name;
                            this.setState({ user_info : set_user_info });
                            this.props.loggedin(set_user_info);
                            localStorage.setItem('user', JSON.stringify(set_user_info));
                            Toast.fire({
                                icon: 'success',
                                title: i18next.t('Updated successfully')
                            });
                        }
                        else if(res.data.status_code === 400){
                            this.setState({form_has_err : false});
                            Toast.fire({
                                icon: 'warning',
                                title: res.data.message
                            });
                        }
                        else if(res.data.status_code === 401) {
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('user');
                            this.props.history.push('/');
                            window.location.reload(false);
                        }
                        else {
                            Toast.fire({
                                icon: 'warning',
                                title: 'Something Went Wrong!'
                            });
                            this.setState({form_has_err: false});
                        }
                    }
                    else {
                        this.setState({form_has_err: false});
                        Toast.fire({
                            icon: 'warning',
                            title: 'Something Went Wrong!'
                        });
                    }
                })
                
        }
        else {
            this.setState({form_has_err: false});
            Toast.fire({
                icon: 'success',
                title: i18next.t('Updated successfully')
            });
        }
    }
    update_profile_picture = () => {
        var user_info = this.state.user_info;
        var user_id = this.state.user_info.user_id;
        const fileInput = document.querySelector("#image");
        const formData = new FormData();

        formData.append("image", fileInput.files[0]);
        formData.append("user_id", user_id);
        console.log('pro_pic');
        console.log(fileInput.files[0]);
        
        axios({
            method: "post",
            url: `${process.env.REACT_APP_MEDIA_URL}/api/v1/user/profileupload`,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then (res => {
            console.log(res);
            if(res.data.status_code === 200) {
                localStorage.removeItem('user');
                user_info.user_image = res.data.image;
                localStorage.setItem('user',JSON.stringify(user_info));
                this.props.loggedin(user_info);
                this.setState({ imagePreviewUrl : res.data.image });
                Toast.fire({
                    icon: 'success',
                    title: i18next.t('Uploaded Successfully!')
                });
            } 
            else if(res.data.status_code === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
            else {
                Toast.fire({
                    icon: 'warning',
                    title: i18next.t('Image fail to upload!')
                });
            }
        })
    }
    onChange = (event, { newValue, method }) => {
        this.setState({
            value: newValue
        });
    };

    get_profile_info_by_user = () => {
        var user_id = this.state.user_info.user_id;
        const config = {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('user_id',user_id);
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/profile`,params, config)
        .then (res => {
            if(res.data.status_code === 200) {
                this.setState({ set_user_info : res.data,imagePreviewUrl : res.data.user_image });
                this.if_password_less_hide_change_password();
            } 
            else if(res.data.status_code === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
        })
    }
    user_image_err = (ev) => {
        ev.target.src = require("../../../assets/images/default_user_image_rectangle.png");
    }
    openFile = () => {
        if(this.user_profile_input !== undefined) {
            this.user_profile_input.click();
        }
    }
    render() {
        
        let { imagePreviewUrl } = this.state;
        let $imagePreview = (<img onError={this.user_image_err} src={require("../../../assets/images/default_user_image_rectangle.png")} alt=""/>);;
        if (imagePreviewUrl) {
            $imagePreview = (<img onError={this.user_image_err} src={imagePreviewUrl} alt=""/>);
        }

        // const { value, suggestions } = this.state;
        // const inputProps = {
        //     placeholder: "Type 'c'",
        //     value,
        //     onChange: this.onChange
        // };

        return (
            <React.Fragment>
                <div className="">

                    <SimpleBar style={{ height: 'calc(100vh - 73px)', overflowX: 'hidden' }}>
                        <div className="px-3 px-md-4 py-3">

                            <div className="profileUpload">
                                <form>
                                    <input ref={ (el)=>{this.user_profile_input = el; } } type="file" id="image" onChange={this._handleImageChange} accept="image/*"/>
                                    <button type="button" style={{
                                        borderWidth:1,
                                        borderColor:'rgba(0,0,0,0.2)',
                                        display:'flex',
                                        alignItems:'center',
                                        justifyContent:'center',
                                        padding: 5,
                                        width: 30,
                                        height: 30,
                                        backgroundColor:'#10AB81',
                                        borderRadius:50,
                                        color:'#fff'
                                    }} onClick={this.openFile} className=""><EditOutlined /></button>
                                </form>
                                {$imagePreview}
                            </div>

                            <div className="forms mt-5">
                                <form action="" className="floatingLabelStyle">
                                    { this.state.form_has_err === false ? 
                                    <div className="row">
                                        <div className="col-12">
                                            <FloatingInputs labelName={i18next.t("Name")} >
                                                <input type="text" placeholder=" " onChange={ (e) => { let profile_info = {...this.state.set_user_info}; profile_info.name = e.target.value; this.setState({ set_user_info : profile_info }) } } value={this.state.set_user_info && this.state.set_user_info.name} maxLength="50"/>
                                                <p className="text-danger">{this.state.name_err}</p>
                                                {/* <Require /> */}
                                            </FloatingInputs>

                                        </div>
                                        <div className="col-12">
                                            <FloatingInputs labelName={i18next.t("Email")}>
                                                <input type="email" placeholder=" " value={this.state.set_user_info.email} maxLength="100"/>
                                            </FloatingInputs>
                                        </div>
                                        <div className="col-12">
                                            <FloatingInputs labelName={i18next.t("Mobile Number")}>
                                                <input type="text" placeholder=" " onFocus={()=> { this.setState({ form_has_err : true }); this.firebaseui_loads(); } } value={this.state.set_user_info.mobile}/>
                                                <p className="text-danger">{this.state.mobile_err}</p>
                                            </FloatingInputs>
                                        </div>
                                        {/* <div className="col-12">
                                            <FloatingInputs labelName="Location">
                                                <input type="text" placeholder=" " />
                                            </FloatingInputs>
                                        </div> */}

                                        {/* <Autosuggest
                                            suggestions={suggestions}
                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                            getSuggestionValue={getSuggestionValue}
                                            renderSuggestion={renderSuggestion}
                                            inputProps={inputProps} /> */}


                                        {/* <div className="col-12">
                                            <FloatingInputs labelName="Bio">
                                                <textarea placeholder=" " />
                                            </FloatingInputs>
                                        </div> */}
                                        <div className="col-12">
                                            <div className="col-sm-4 pl-sm-2 align-self-center">
                                                <Button onClick={this.profile_validation} className="PrimaryBtn lg mb-2 mb-sm-0" block>{ i18next.t("Update") } </Button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                    <div className="d-flex p-3 align-items-center hover-cont" onClick={ ()=>{ this.setState({ form_has_err : false }) }  }> 
                                        <ArrowLeftOutlined  />
                                        &nbsp;
                                        <span>{ i18next.t("Back") } </span>
                                    </div>
                                    <div className="floatingLabelStyle p-4 py-5 px-sm-5 text-center">
                                        
                                        <StyledFirebaseAuth uiConfig={this.state.uiconfig_state} firebaseAuth={firebase.auth()}/>
                                    </div>
                                    </div>
                                    }
                                </form>
                            </div>
                            <span ref={span => this.span = span} onClick={this.props.access_change_password}></span>
                        </div>
                    </SimpleBar>
                </div>
            </React.Fragment>

        );
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(EditProfileSettings));