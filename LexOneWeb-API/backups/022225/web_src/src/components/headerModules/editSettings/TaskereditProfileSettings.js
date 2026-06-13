import React, { Component } from 'react';
import FloatingInputs from "../../../components/FloatingLabel";
import { withRouter } from 'react-router';
import { Button, Modal } from 'antd';
import Map from '../../../components/Map';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import SimpleBar from "simplebar-react";
import axios from 'axios';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Swal from 'sweetalert2';
import {loggedin,user_live_location} from '../../../redux/actions';
import {connect} from 'react-redux';
import i18next from 'i18next';

const mapStateToProps=(props)=> {
    return {
        loginvalue : props.isLogged,
        user_location : props.userLocation
    }
}

const mapDispatchToProps=(dispatch)=> {
    return {
        loggedin : (userdata)=>dispatch(loggedin(userdata)),
        user_live_location : (location)=>dispatch(user_live_location(location))
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

class TaskerEditProfileSettings extends Component {
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
            bio_err : '',
            form_has_err : false,
            uiconfig_state : {},
            loc_readonly : false,
            is_location_ModalVisible : false
            // suggestions: []
        };
        this._handleImageChange = this._handleImageChange.bind(this);
    }

    componentDidMount = () => {
        this.get_profile_info_by_tasker();
        const general_info = JSON.parse(localStorage.getItem('general_info'));
        this.setState({ general_info : general_info });
    }
    UNSAFE_componentWillMount = () => {
        const general_info = JSON.parse(localStorage.getItem('general_info'));
        if(general_info.instant_location === 'true') {
            this.get_current_location();
        }
    }
    get_current_location = () => {
        var rm = this;
        var user_info = this.props.loginvalue && this.props.loginvalue;

        var init_pos = {
            lat : parseFloat(user_info.lat),
            lng : parseFloat(user_info.lon)
        }
        rm.setState({ position : init_pos });
        // if ("geolocation" in navigator) {
        //     navigator.geolocation.getCurrentPosition((position) =>  {
        //         var latitude = position.coords.latitude;
        //         var longitude = position.coords.longitude;
        //         rm.setState({ lat:latitude,lon:longitude });
        //         var pos = {
        //             lat : latitude,
        //             lng : longitude
        //         }
        //         console.log('current_locat');
        //         console.log(pos);
        //         rm.setState({ position : pos });
        //     });
        // } else {
        //     alert("Sorry Not available!");
        // }
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
    location_modal_close = () => {
        this.setState({ is_location_ModalVisible : false });
    }
    set_location = () => {
        this.setState({ is_location_ModalVisible : false });
        var location_type = this.state.general_info && this.state.general_info.instant_location;
        if(location_type === 'true') {
            var profile_info = this.state.set_user_info;
            profile_info.lat = this.props.user_location.lat && this.props.user_location.lat;
            profile_info.lon = this.props.user_location.lng && this.props.user_location.lng;
            profile_info.location = this.props.user_location.address && this.props.user_location.address;
            this.setState({ 
                set_user_info : profile_info,
                loc_readonly : true
            })
        }
    }
    update_profile_picture = () => {
        var user_info = this.state.user_info;
        var user_id = this.state.user_info.user_id;
        const fileInput = document.querySelector("#image");
        const formData = new FormData();
        console.log('taker_img');
        console.log(fileInput.files[0]);
        formData.append("image", fileInput.files[0]);
        formData.append("user_id", user_id);
        console.log('pro_pic');
        console.log(fileInput.files[0]);
        
        axios({
            method: "post",
            url: `${process.env.REACT_APP_MEDIA_URL}/api/v1/tasker/profileupload`,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then (res => {
            console.log(res);
            if(res.data.status_code === 200) {
                localStorage.removeItem('user');
                user_info.user_image = res.data.image;
                this.props.loggedin(user_info);
                localStorage.setItem('user',JSON.stringify(user_info));
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
    get_profile_info_by_tasker = () => {

        var user_id = this.state.user_info.user_id;
        const config = {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('user_id',user_id);
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/profile`,params, config)
        .then (res => {
            console.log(res.data)
            if(res.data.status_code === 200) {
                this.setState({ set_user_info : res.data, imagePreviewUrl : res.data.user_image });
            } 
            else if(res.data.status_code === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
        })
    }
    trigger_location_autocomplete = () => {
        this.autocomplete(document.getElementById("location"), this.state.general_info.cities);
        var el = document.getElementById('location');
        el.dispatchEvent(new Event('input'));
    }
    autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        var rm = this;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            // if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    let profile_info = {...rm.state.set_user_info};
                    profile_info.location = inp.value;
                    rm.setState({set_user_info : profile_info});
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode === 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode === 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode === 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt !== x[i] && elmnt !== inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
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

        if((this.state.set_user_info.location !== null && this.state.set_user_info.location.trim() === '') || this.state.set_user_info.location === null) {
            this.setState({ location_err : i18next.t('Location is required!') });
            err++;
        }
        else if(this.state.general_info && this.state.general_info.instant_location === 'false') {
            var exist_city = this.state.general_info.cities.includes(this.state.set_user_info.location);
            if(!exist_city) {
                this.setState({location_err:i18next.t('Entered location is not exist!')});
                err++;
            }
            else {
                this.setState({location_err:''});
            }
        }
        else {
            this.setState({ location_err : '' });
        }
        
        if((this.state.set_user_info.about !== null && this.state.set_user_info.about.trim() === '') || this.state.set_user_info.about === null) {
            this.setState({ bio_err : i18next.t('Bio is required!') });
            err++;
        }
        else {
            this.setState({ bio_err : '' });
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
    update_profile_info = () => {
        var user_info = this.state.set_user_info;

        const config = {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        }
            const params = new URLSearchParams()
            params.append('user_id', user_info.user_id);
            params.append('mobile', user_info.mobile);
            params.append('name', user_info.name);
            params.append('location', user_info.location);
            params.append('about', user_info.about);
            params.append('source_lat', user_info.lat);
            params.append('source_lon', user_info.lon);
            
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/profile`, 
            params,config)
                .then(res => {
                    console.log(res);
                    if(res.status === 200) {
                        if(res.data.status_code === 200){
                            // history.replaceState('/user/user-login/1');
                            
                            localStorage.removeItem('user');
                            var set_user_info = this.state.user_info;
                            set_user_info.mobile = user_info.mobile;
                            set_user_info.name = user_info.name;
                            set_user_info.location = user_info.location;
                            set_user_info.about = user_info.about;
                            set_user_info.lon = user_info.lon;
                            set_user_info.lat = user_info.lat;
                          
                            this.setState({ user_info : set_user_info });
                            this.props.loggedin(set_user_info);
                            var user_live_location = {};
                            user_live_location.lat = user_info.lat;
                            user_live_location.lng = user_info.lon;
                            user_live_location.address = user_info.location;
                            this.props.user_live_location(user_live_location);
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
                                    <input ref={ (el)=>{this.user_profile_input = el; } } type="file" id="image"  onChange={this._handleImageChange} accept="image/*"/>
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
                                            <FloatingInputs labelName={i18next.t("Name")}>
                                                <input type="text" placeholder=" " onChange={ (e) => { let profile_info = {...this.state.set_user_info}; profile_info.name = e.target.value; this.setState({ set_user_info : profile_info }) } } value={this.state.set_user_info.name} maxLength="50"/>
                                                <p className="text-danger">{this.state.name_err}</p>
                                                {/* <Require /> */}
                                            </FloatingInputs>

                                        </div>
                                        <div className="col-12">
                                            <FloatingInputs labelName={i18next.t("Email")}>
                                                <input type="email" placeholder=" " value={this.state.set_user_info.email}/>
                                            </FloatingInputs>
                                        </div>
                                        <div className="col-12">
                                            <FloatingInputs labelName={i18next.t("Mobile Number")}>

                                                <input type="text" placeholder=" " onFocus={()=> { this.setState({ form_has_err : true }); this.firebaseui_loads(); } } value={this.state.set_user_info.mobile}/>
                                                <p className="text-danger">{this.state.mobile_err}</p>
                                            </FloatingInputs>
                                        </div>
                                        <div className="col-12">
                                            <FloatingInputs labelName={i18next.t("Location")}>

                                            <input type="text" autoComplete="off" name="location" id="location" onMouseDown={ (e)=>{ e.stopPropagation(); if(this.state.general_info && this.state.general_info.instant_location === 'false') { this.trigger_location_autocomplete(); }  else{ this.setState({ is_location_ModalVisible : true }); }  } } onChange={(e) => { let profile_info = {...this.state.set_user_info}; profile_info.location = e.target.value; this.setState({ set_user_info : profile_info }) }  } readOnly={this.state.loc_readonly} placeholder=" " value={this.state.set_user_info.location} />
                                            <p className="text-danger">{this.state.location_err}</p>
                                            </FloatingInputs>
                                        </div>

                                        {/* <Autosuggest
                                            suggestions={suggestions}
                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                            getSuggestionValue={getSuggestionValue}
                                            renderSuggestion={renderSuggestion}
                                            inputProps={inputProps} /> */}


                                        <div className="col-12">
                                            <FloatingInputs labelName={i18next.t("Bio")}>
                                                <textarea onChange={ (e) => { let profile_info = {...this.state.set_user_info}; profile_info.about = e.target.value; this.setState({ set_user_info : profile_info }) } } placeholder=" " value={ this.state.set_user_info.about === 'null' ? '' : this.state.set_user_info.about }/>
                                                <p className="text-danger">{ this.state.bio_err }</p>
                                            </FloatingInputs>
                                        </div>
                                        <div className="col-12">
                                            <div className="col-sm-4 pl-sm-2 align-self-center">
                                                <Button onClick={this.profile_validation}  className="PrimaryBtn lg mb-2 mb-sm-0" block>{i18next.t("Update")} </Button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                    <div className="d-flex p-3 align-items-center hover-cont" onClick={ ()=>{ this.setState({ form_has_err : false }) }  }> 
                                        <ArrowLeftOutlined  />
                                        &nbsp;
                                        <span>{i18next.t("Back")} </span>
                                    </div>
                                    <div className="floatingLabelStyle p-4 py-5 px-sm-5 text-center">
                                        
                                        <StyledFirebaseAuth uiConfig={this.state.uiconfig_state} firebaseAuth={firebase.auth()}/>
                                    </div>
                                    </div>
                                    }
                                </form>
                            </div>
                        </div>
                        <Modal title={i18next.t("Enter Location")} onCancel={this.location_modal_close} footer={[<Button onClick={this.set_location}>{i18next.t("Set Location")}</Button>]} visible={this.state.is_location_ModalVisible} className="locationModal">
                        {
                            this.state.general_info && this.state.general_info.instant_location === "true" &&  
                            <>
                            <div className="h-300">
                                <Map
                                    google={ this.props.google }
                                    center={ this.state.position && this.state.position }
                                    height='300px'
                                    zoom={15}
                                />
                            </div>
                            <div>
                                
                            </div>
                            </>
                        }
                        </Modal>
                    </SimpleBar>
                </div>
            </React.Fragment>

        );
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TaskerEditProfileSettings));