import React, { Component } from 'react';
import { Link } from "react-router-dom";
import FloatingInputs from "../../components/FloatingLabel";
import { ArrowLeftOutlined,RightOutlined } from '@ant-design/icons';
import { Checkbox, Button } from 'antd';
import axios from 'axios';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import MetaDecorator from '../../components/MetaDecorator';
import Swal from 'sweetalert2';
import Loader from "react-loader-spinner";
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
class TaskerSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name : '',
            email : '',
            mobilenumber : '',
            password : '',
            location : '',
            lat : '',
            lon : '',
            c_password : '',
            t_and_c : false,
            name_err : '',
            email_err : '',
            mobile_err : '',
            location_err : '',
            password_err : '',
            c_password_err : '',
            t_and_c_err : '',
            form_has_err : false,
            m_ex_err : 0,
            e_ex_err : 0,
            uiconfig_state : {},
            general_info : {},
            loc_readonly : false,
            is_loading : false
        }
    }
    componentDidMount = () => {
        const general_info = JSON.parse(localStorage.getItem('general_info'));
        this.setState({ general_info : general_info });
        // this.state.general_info.instant_location === "false" ? this.autocomplete(document.getElementById("myInput"), this.state.general_info.cities) : ds;
    }
    trigger_location_autocomplete = () => {
        this.autocomplete(document.getElementById("location"), this.state.general_info.cities);
        var el = document.getElementById('location');
        el.dispatchEvent(new Event('input'));
    }
    get_geo_location = () => {
        var rm = this;
        this.setState({
            is_loading :true
        })
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            rm.setState({ lat:latitude,lon:longitude });
            
            const config = {
                headers : { 'Content-Type' : 'application/x-www-form-urlencoded' } 
            }
            var api_key = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
            
            console.log('loc ',latitude);
            console.log('lat ',longitude);
            var instance = axios.create();
            delete instance.defaults.headers.common['Authorization'];
            instance.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&key='+api_key,config)
            .then(response => {
                rm.setState({ location : response.data.results[0].formatted_address, loc_readonly : true,is_loading : false })
                
            })
            .catch(err => {
                rm.setState({
                    is_loading :false,
                    location_err : i18next.t("Please allow location, on Browser!")
                })
                console.log(err)                     //Axios entire error message
            })
        }, function(error) {
            console.log('safari_error',error);
            Toast.fire({
                icon: 'warning',
                title: "Please allow location, on Browser!"
            });
        });
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
                    defaultCountry: 'IN'
                }
            ],
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    var verified_phone_no = authResult['user']['phoneNumber'];
                    rm.setState({ mobilenumber : verified_phone_no,form_has_err : false })
                    rm.mobile_already_exists();
                }	
            }
        };
        rm.setState({
            uiconfig_state : uiconfig,
        });
        
    }
    save_tasker = () => {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
       
        const params = new URLSearchParams()
        params.append('password', this.state.password)
        params.append('location', this.state.location)
        params.append('lat', this.state.lat)
        params.append('lon', this.state.lon)
        params.append('name', this.state.name)
        params.append('mobile', this.state.mobilenumber)
        params.append('email', this.state.email)
        params.append('device_token', 'dfsf')
        params.append('device_platform', 'web')
        params.append('language_type', 'en')
        params.append('device_mode', '0')
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/signup`, 
        params,config)
            .then(res => {
                console.log(res);
                if(res.status === 200) {
                    if(res.data.status_code === 200){
                        this.setState({t_and_c_err: ''});
                        // history.replaceState('/user/user-login/1');
                        // this.setState({t_and_c_err: 'Tasker Created Successfully...'});
                       
                        Toast.fire({
                            icon: 'success',
                            title: 'Your Account has been to created!'
                        });
                        const params1 = new URLSearchParams();
                        params1.append('email' , this.state.email);
                        params1.append('password' , this.state.password);
                        params1.append('login_id' , this.state.email);
                        params1.append('login_type' , 'email');
                        params1.append('device_token' , '4sdf8s4fsf1s8f4d4wfw');
                        params1.append('device_mode' , '1');
                        params1.append('device_platform' , 'web');

                        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/signin`,params1,config).then(res => {
                            console.log(res);
                            // console.log(res.data);
                            if(res.data.status_code === 200)
                            {   localStorage.setItem('user',JSON.stringify(res.data));
                                localStorage.setItem('access_token',res.data.access_token);
                                this.setState({
                                    name : '',
                                    email : '',
                                    mobilenumber : '',
                                    location : '',
                                    lat : '',
                                    lon : '',
                                    password : '',
                                    c_password : '',
                                    t_and_c : false
                                },()=>{
                                    this.props.history.push('/tasker/add-services',{ is_new : 1 });
                                    window.location.reload(false);
                                });
                                
                            }
                            else
                            {
                                this.setState({login_err : res.data.message});
                            }
                        })
                    }
                    else {
                        this.setState({t_and_c_err: res.data.message});
                        this.props.history.push('/tasker/tasker-signup');
                    }
                }
                else {
                    this.props.history.push('/tasker/tasker-signup');
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
                    console.log(res);
                    console.log(res.data);
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
                        this.setState({mobile_err: ''});
                    }
                })
        }
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
                if ((arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase())) {
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
                    rm.setState({location : inp.value});
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
                        this.setState({e_ex_err: 0});
                        this.setState({email_err: ''});
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
    taskerSignup_submit = event => {
        event.preventDefault();
        var err = 0;
        
        const user = {
            password: this.state.password,
            login_type: 'email',
            name: this.state.name,
            mobile: this.state.mobilenumber,
            email: this.state.email,
            location: this.state.location
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
            this.setState({email_err: i18next.t('Email is Invalid')});
            err++;
        }
        else if(this.state.e_ex_err !== 0) {
            this.setState({email_err: i18next.t('Email Already exists')});
            err++;
        }
        else {
            this.setState({email_err: ''});
        }
        if(user.location === '') {
            this.setState({location_err:i18next.t('Location is required!')});
            err++;
        }
        else if(this.state.general_info && this.state.general_info.instant_location === 'false') {
            var exist_city = this.state.general_info.cities.includes(user.location);
            if(!exist_city) {
                this.setState({location_err:i18next.t('Entered location is not exist!')});
                err++;
            }
            else {
                this.setState({location_err:''});
            }
        }
        else {
            this.setState({location_err:''});
        }
        if(user.mobile === '') {
            this.setState({mobile_err: i18next.t('Mobile Number is required!')});
            err++;
        }
        else if(isNaN(user.mobile)) {
            this.setState({mobile_err:'Enter Number Only!'});
            err++;
        }
        else if(this.state.m_ex_err !== 0) {
            this.setState({mobile_err: i18next.t('Mobile Number Already exists') });
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
            this.setState({c_password_err:i18next.t('Make Sure Your Password is Correct!')});
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
            
            this.save_tasker();
        }
        else {
            this.setState({
                form_has_err : false
            });
        }
    }
    render() {
        return (
            <React.Fragment>
                <MetaDecorator title='| Tasker Signup' description="IDemand Tasker Signup Page"/>
                <div className="container">
                    <div className="my-5">
                        <div className="authenticateWidth user">
                            
                            <div className="d-flex justify-content-between mb-3">
                                <div className="align-self-center">  <h4 className="fB mb-0">{ i18next.t('Signup to Join') }</h4></div>
                                <div className="align-self-center">   <Link to="/user/user-login">  <div className='d-flex'><h6 className="mb-0 fM primaryClr">{i18next.t('User Login')} </h6> <RightOutlined className="primaryClr align-self-end ml-1" /> </div></Link></div>
                            </div>
                            { this.state.form_has_err === false ? 
                            <div className="authenticateField mb-4">
                                <div className="d-flex justify-content-around border-bottom p-3">
                                    <span ><Link to="/tasker/tasker-login" className="txtClr fM">{ i18next.t('Login') }</Link></span>
                                    <span className="primaryClr fM">{ i18next.t('Signup') }</span>
                                </div>
                                <form  className="floatingLabelStyle p-4 py-5 px-sm-5">
                                    <FloatingInputs labelName={ i18next.t('Name') }>
                                        <input type="text" name="name" placeholder=" " onChange={(e) => this.setState({name : e.target.value.replace(/[^\w\s]/gi, "")})} value={this.state.name} maxLength="50"/>
                                        <p className="text-danger" id="name_err">{this.state.name_err}</p>
                                    </FloatingInputs>

                                    <FloatingInputs labelName={ i18next.t('Email') }>
                                        {/* <span className="tick"></span> */}
                                        <input type="email" name="email" placeholder=" " onChange={(e) => this.setState({email : e.target.value})} value={this.state.email} onBlur={this.email_already_exists} maxLength="100"/>
                                        <p className="text-danger" id="email_err">{this.state.email_err}</p>
                                    </FloatingInputs>

                                    {/* LexOne: this is the lawyer's office address. */}
                                    <FloatingInputs labelName={ i18next.t('Office address') }>

                                        <input type="text" name="location" id="location" onFocus={ this.state.general_info.instant_location === 'false' ? this.trigger_location_autocomplete : this.get_geo_location } onChange={(e) => this.setState({location : e.target.value})} readOnly={this.state.loc_readonly} placeholder=" " value={this.state.location} autoComplete="off" />
                                        {
                                            this.state.is_loading === true &&
                                            <Loader
                                            className="loc-loader"
                                                type="ThreeDots"
                                                color="#0313FC"
                                                height={20}
                                                width={20}
                                            />
                                        }
                                        
                                        <p className="text-danger" id="location_err">{this.state.location_err}</p>
                                    </FloatingInputs>

                                    <FloatingInputs labelName={ i18next.t("Mobile Number") }>
                                        {/* <span className="tick"></span> */}
                                        <input type="text" name="mobile" onMouseDown={ (e) => { e.stopPropagation(); this.setState({ form_has_err :true }); this.firebaseui_loads(); } } placeholder=" " onChange={(e) => this.setState({mobilenumber : e.target.value})} value={this.state.mobilenumber}  />
                                        <p className="text-danger" id="mobile_err">{this.state.mobile_err}</p>
                                    </FloatingInputs>
                                    <FloatingInputs labelName={ i18next.t("Password") }>
                                        {/* <span className="tick"></span> */}
                                        <input type="password" name="password" placeholder=" " onChange={(e) => this.setState({password : e.target.value})} value={this.state.password}/>
                                        <p className="text-danger" maxLength="50" id="password_err">{this.state.password_err}</p>
                                    </FloatingInputs>
                                    <FloatingInputs labelName={ i18next.t("Confirm Password") }>
                                        {/* <span className="tick"></span> */}
                                        <input type="password" name="c_password" placeholder=" " onChange={(e) => this.setState({c_password : e.target.value})} value={this.state.c_password}/>
                                        <p className="text-danger" maxLength="50" id="c_password_err">{this.state.c_password_err}</p>
                                    </FloatingInputs>
                                    

                                    <div className="d-flex justify-content-center ">
                                        <div className="align-self-center">
                                            <Checkbox className="font-sm" name="t_and_c" onChange={(e) => this.setState({t_and_c : !this.state.t_and_c})} value={this.state.t_and_c} checked={this.state.t_and_c}>{ i18next.t("I have agree all") } <Link to="/tasker-terms-condition" target="_blank">{ i18next.t("Terms & Conditions") }</Link></Checkbox>
                                        </div>
                                    </div>
                                    <div className="w-100">
                                        
                                    </div>
                                    <p className="text-center text-danger" id="t_and_c_err">{this.state.t_and_c_err}</p>
                                    <Button onClick={this.taskerSignup_submit} size="large" className="PrimaryBtn lg fM my-4" block>{ i18next.t("Signup") }</Button>

                                    
                                    <p className="text-center mb-0 fM mt-3">{ i18next.t("Already a Tasker") } ?  <Link to="/tasker/tasker-login"> { i18next.t("Login") }</Link></p>

                                </form>
                            </div>
                            :
                            <div className="authenticateField mb-4">
                                <div className="d-flex p-3 align-items-center hover-cont"
                                onClick={ ()=>{ this.setState({ form_has_err : false }) }  }> 
                                    <ArrowLeftOutlined  />
                                    &nbsp;
                                    <span>{ i18next.t("Back") } </span>
                                </div>
                                <div className="floatingLabelStyle p-4 pb-5 text-center">
                                    <StyledFirebaseAuth uiConfig={ this.state.uiconfig_state } firebaseAuth={firebase.auth()}/>
                                </div>
                            </div>
                            }
                            
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default TaskerSignup;