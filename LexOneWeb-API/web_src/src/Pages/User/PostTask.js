import React, { Component } from 'react';
import { DatePicker, Input, Button, Select, Modal } from 'antd';
import FloatingInputs from "../../components/FloatingLabel";
import { ArrowLeftOutlined,LoadingOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import axios from "axios";
import Map from '../../components/Map';
import {connect} from 'react-redux';
import Swal from 'sweetalert2';
import moment from 'moment';
import i18next from 'i18next';
import { PLACEHOLDER_OFFICE_ADDRESS, PLACEHOLDER_OFFICE_LAT, PLACEHOLDER_OFFICE_LON } from '../../lexOnePlaceholder';

const { Option } = Select;

const { TextArea } = Input;

const mapStateToProps=(props)=> {
    return {
        user_location : props.userLocation
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


class PostTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: undefined,
            date_format : 'DD-MM-YYYY',
            categories : [],
            sub_categories : [],
            services : [],
            is_location_ModalVisible : false,
            // LexOne: location inputs are hidden in the UI; pre-populate the
            // state with the placeholder so the form-level validations pass.
            location1 : PLACEHOLDER_OFFICE_ADDRESS,
            location2 : PLACEHOLDER_OFFICE_ADDRESS,
            source_lat : PLACEHOLDER_OFFICE_LAT,
            source_lng : PLACEHOLDER_OFFICE_LON,
            dest_lat : PLACEHOLDER_OFFICE_LAT,
            dest_lng : PLACEHOLDER_OFFICE_LON,
            show_hide_map : false,
            chosen_subcat : 'Select Sub Category',
            chosen_service : 'Select Service',
            is_disabled : false,
        }
    }
    onChange = value => {
        this.setState({ value });
    };
    UNSAFE_componentWillMount = () => {
        this.get_categories();
    }
    get_categories = () => {
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        var user_info = JSON.parse(localStorage.getItem('user'));
        this.setState({ general_info : general_info, user_info : user_info },()=>{
            if(general_info.instant_location === "true") {
                this.get_geo_location();
            }
        })
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/categories`)
        .then(res => {
            if(res.data.status_code === 200) {
                this.setState({ 
                    categories : res.data.category,
                });
            }
            else {
                console.log(res.data.message);
            }
        })
    }
    getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }
    
    deg2rad = (deg) => {
        return deg * (Math.PI/180)
    }
    get_subcategories = (value) => {
        const config = {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        }
        this.setState({ chosen_cat : value,chosen_subcat : 'Select Sub Category',chosen_service : 'Select Service',sub_categories : [], services : [] },()=>{
            var cat_id = value;
            if(cat_id !== '') {
                const params = new URLSearchParams()
                params.append('category_id', cat_id)
                axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/category_by_id`,params,config)
                .then (res=>{
                    console.log('bread_1');
                    console.log(res.data)
                    if(res.data.status_code === 200) {
                        this.setState({ 
                            category_info : res.data.category[0],
                        })
                    }
                });
            }
        });
        
        var cat_id = value;
        if(cat_id !== '') {
            const params = new URLSearchParams()
            params.append('category_id', cat_id)
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/category_by_id`,params,config)
            .then (res=>{
                if(res.data.status_code === 200) {
                    this.setState({ 
                        category_type : res.data.category[0].parent_category_type,
                    })
                }
            });
        }
        const params1 = new URLSearchParams();
        params1.append('parent_category_id' , value);
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/subcategories`,params1,config)
        .then(res => {
            // console.log('result is here');
            // console.log(res);
            if(res.data.status_code === 200) {
                this.setState({ 
                    sub_categories : res.data.subcategory
                });
            }
            else {
                console.log(res.data.message);
            }
        })
    }
    location_modal_close = () => {
        this.setState({ 
            is_location_ModalVisible : false,
            show_hide_map : false,
        });
    }
    set_location = () => {
        var location_type = this.state.general_info && this.state.general_info.instant_location;
        var location_input_id = this.state.location_input_id;
        if(location_type === 'true') {
            if(location_input_id === 1) {
                this.setState({ 
                    location1 : this.props.user_location.address && this.props.user_location.address,
                    source_lat : this.props.user_location.lat && this.props.user_location.lat,
                    source_lng : this.props.user_location.lng && this.props.user_location.lng ,
                    is_location_ModalVisible : false,
                    show_hide_map : false,
                })
            }
            else {
                this.setState({ 
                    location2 : this.props.user_location.address && this.props.user_location.address,
                    dest_lat : this.props.user_location.lat && this.props.user_location.lat,
                    dest_lng : this.props.user_location.lng && this.props.user_location.lng,
                    is_location_ModalVisible : false,
                    show_hide_map : false,
                })
            }
        }
        else {
            var exist_city = this.state.general_info.cities.includes(this.state.manual_location);
            if(!exist_city) {
                this.setState({ ex_location_err : i18next.t('Entered location is not exist!') });
            }
            else {
                if(location_input_id === 1) {
                    this.setState({ location1 : this.state.manual_location, manual_location : '',is_location_ModalVisible : false,show_hide_map : false, ex_location_err : '' })
                }
                else {
                    this.setState({ location2 : this.state.manual_location, manual_location : '',is_location_ModalVisible : false,show_hide_map : false, ex_location_err : '' })
                }
            }
        }
    }
    

    get_geo_location = () => {
        if(localStorage.getItem('user') === null) {
            this.props.history.push("/user/user-login");
        }
        else if(localStorage.getItem('user') !== null) {
            var userinfo = JSON.parse(localStorage.getItem('user'));
            if(userinfo.type !== 'user') {
                this.props.history.push("/tasker");
            }
        }
        var rm = this;
        rm.setState({ lat:30.000000,lon:31.000000 });
        var init_pos = {
            lat : 30.000000,
            lng : 31.000000
        }
        rm.setState({ position : init_pos, gps_flag : false });
        // navigator.geolocation.getCurrentPosition(function(position) {
        //     var latitude = position.coords.latitude;
        //     var longitude = position.coords.longitude;
        //     rm.setState({ lat:latitude,lon:longitude });
        //     var pos = {
        //         lat : latitude,
        //         lng : longitude
        //     }
        //     rm.setState({ 
        //         position : pos, 
        //         gps_flag : true 
        //     });
        // }, function(error) {
        //     console.log('safari_error',error);
        //     Toast.fire({
        //         icon: 'warning',
        //         title: "Please allow location, on Browser!"
        //     });
        // });
    }
    date_of_service = (date, dateString) =>  {
        this.setState({
            date_of_service : date
        })
    }
    get_service = (value) => {
        this.setState({ chosen_service : value });
    }
    get_services = (value) => {
        this.setState({
            chosen_service : "Select Service",
            services : []
        })
        const config = {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('parent_category_id' , this.state.chosen_cat);
        params.append('subcategory_id' , value);
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/services`,params,config)
        .then(res => {
            console.log('result is here');
            console.log(res);
            if(res.data.status_code === 200) {
                this.setState({ services : res.data.services, chosen_subcat : value });
            }
            else {
                console.log(res.data.message);
            }
        })
    }
    save_need = () => {
        this.setState({
            is_disabled : true,
        })
        var user_info = JSON.parse(localStorage.getItem('user'));
        var err = 0;
        var before_decimal = 6;
        var after_decimal = 2;
        if(this.state.need_price && this.state.need_price.trim() !== '') {
            var price = this.state.need_price && this.state.need_price;
            var split_price = price.split('.');
        }

        if(!this.state.task_name || (this.state.task_name && this.state.task_name === '')) {
            this.setState({ task_name_err : i18next.t("Task Name is required!"),is_disabled : false, });
            this.task_name.scrollIntoView({ behavior: "smooth" });
            err++;
        }
        else {
            this.setState({ task_name_err : "" });
        }
        if(!this.state.chosen_cat || (this.state.chosen_cat && (this.state.chosen_cat === '' || this.state.chosen_cat === 'Select Category'))) {
            this.setState({ cat_err : i18next.t("Category is required!"),is_disabled : false, });
            this.task_name.scrollIntoView({ behavior: "smooth" });
            err++;
        }
        else {
            this.setState({ cat_err : "" });
        }
        if(!this.state.chosen_subcat || (this.state.chosen_subcat && (this.state.chosen_subcat === '' || this.state.chosen_subcat === 'Select Sub Category'))) {
            this.setState({ sub_cat_err : i18next.t("Sub Category is required!"),is_disabled : false, });
            this.task_name.scrollIntoView({ behavior: "smooth" });
            err++;
        }
        else {
            this.setState({ sub_cat_err : "" });
        }
        if(!this.state.chosen_service || (this.state.chosen_service && (this.state.chosen_service === ''  || this.state.chosen_service === 'Select Service'))) {
            this.task_name.scrollIntoView({ behavior: "smooth" });
            this.setState({ service_err : i18next.t("Service is required!"),is_disabled : false, });
            err++;
        }
        else {
            this.setState({ service_err : "" });
        }
        
        if(this.state.category_info && (this.state.category_info.location_type === 'home' || this.state.category_info.location_type === 'transport')) {
            if(!this.state.location1 || (this.state.location1 && this.state.location1 === '')) {
                this.setState({ location1_err : i18next.t('Location is required!'),is_disabled : false,  });
                this.task_name.scrollIntoView({ behavior: "smooth" });
                err++;
            }
            else {
                this.setState({ location1_err : ''  });
            }
        }
        if(this.state.category_info && this.state.category_info.location_type === 'transport') {
            if(!this.state.location2 || (this.state.location2 && this.state.location2 === '')) {
                this.setState({ location2_err : i18next.t('Location is required!'),is_disabled : false,  });
                this.task_name.scrollIntoView({ behavior: "smooth" });
                err++;
            }
            else if((this.state.location2 && this.state.location2) === (this.state.location1 && this.state.location1)) {
                this.setState({ location2_err : i18next.t('Location should be different!'),is_disabled : false,  });
                this.task_name.scrollIntoView({ behavior: "smooth" });
                err++;
            }
            else if(this.state.general_info && this.state.general_info.instant_location === 'true') {
                var distance =  this.getDistanceFromLatLonInKm(
                    parseFloat(this.state.source_lat),
                    parseFloat(this.state.source_lng),
                    parseFloat(this.state.dest_lat),
                    parseFloat(this.state.dest_lng),
                );
                this.task_name.scrollIntoView({ behavior: "smooth" });
                var distance_limit = parseFloat(this.state.general_info.max_ride_distance);
                if(distance > distance_limit) {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Service Exceeds the Limit!'
                    });
                    this.setState({
                        location2_err : "Service Exceeds the Limit!",
                        is_disabled : false,
                    })
                    err++;
                } 
                else {
                    this.setState({
                        location2_err : ""
                    })
                }
            }
            else {
                this.setState({ location2_err : ''  });
            }
        }
        var current_date = new Date();
        var chosen_date = new Date(this.state.date_of_service);
        chosen_date.setHours(0,0,0,0);
        if(!this.state.date_of_service || (this.state.date_of_service && this.state.date_of_service === '')) {
            this.setState({ date_err : i18next.t('Date is required!'),is_disabled : false,  });
            this.task_name.scrollIntoView({ behavior: "smooth" });
            err++;
        }
        else if(this.state.date_of_service && chosen_date < current_date) {
            this.setState({ date_err : i18next.t('Choose Future Date!'),is_disabled : false,  });
            this.task_name.scrollIntoView({ behavior: "smooth" });
            err++;
        }
        else {
            this.setState({ date_err : ''  });
        }
        if(!this.state.need_description || (this.state.need_description && this.state.need_description === '')) {
            this.setState({ need_description_err : i18next.t("Description is required!"),is_disabled : false, });
            err++;
        }
        else {
            this.setState({ need_description_err : "" });
        }
        var price_in_int = parseFloat(this.state.need_price && this.state.need_price).toFixed(2);
        if(!this.state.need_price || (this.state.need_price && this.state.need_price === '')) {
            this.setState({ need_price_err : i18next.t("Price is required!"),is_disabled : false, });
            err++;
        }
        else if(price_in_int < parseFloat(this.state.general_info.minimum_payment_price)) {
            var min_err = this.state.general_info && this.state.general_info.currency_symbol+' '+this.state.general_info.minimum_payment_price+' '+i18next.t("is Minimum Value of service");
            this.setState({ need_price_err : min_err,is_disabled : false, });
            err++;
        }
        else if (split_price[0] && split_price[0].length > before_decimal) {
            this.setState({ need_price_err : i18next.t('Valid format is (123456.12)'),is_disabled : false, });
            err++;
        }
        else if (split_price[1] && split_price[1].length > after_decimal) {
            this.setState({ need_price_err : i18next.t('Valid format is (123456.12)'),is_disabled : false, });
            err++;
        }
        else {
            this.setState({ need_price_err : "" });
        }
        if(err === 0) {
            
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            
            const params = new URLSearchParams()
            params.append('date', this.state.date_of_service && this.state.date_of_service)
            params.append('parent_category_id', this.state.category_info && this.state.category_info.parent_category_id)
            params.append('subcategory_id', this.state.chosen_subcat && this.state.chosen_subcat)
            params.append('user_id', user_info.user_id)
            params.append('price', this.state.need_price)
            params.append('service_id', this.state.chosen_service)
            params.append('description', this.state.need_description)
            params.append('location_type', this.state.category_info && this.state.category_info.location_type)
            params.append('name', this.state.task_name ? this.state.task_name : '')

            // LexOne: client doesn't supply an address — every request is anchored
            // to the lawyer's office. Send the placeholder so the existing API
            // addneed endpoint still validates without backend changes.
            params.append('source_location', PLACEHOLDER_OFFICE_ADDRESS)
            params.append('source_lat', PLACEHOLDER_OFFICE_LAT)
            params.append('source_lon', PLACEHOLDER_OFFICE_LON);
            if(this.state.category_info && this.state.category_info.location_type === 'transport') {
                params.append('dest_location', PLACEHOLDER_OFFICE_ADDRESS)
                params.append('dest_lat', PLACEHOLDER_OFFICE_LAT)
                params.append('dest_lon', PLACEHOLDER_OFFICE_LON)
            }
            console.log('params are here');
            console.log(params);
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/addneed`, 
            params,config)
            .then(res => {
                if(res.status === 200) {
                    if(res.data.status_code === 200){
                        
                        Toast.fire({
                            icon: 'success',
                            title: i18next.t('Job Posted Successfully!')
                        });
                        var obj = {};
                        obj.need_id = res.data.item_id;
                        this.props.history.push('/user/my-needs',obj);

                    }   
                    else if(res.data.status_code === 401) {
                        this.setState({
                            is_disabled : false,
                        })
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('user');
                        this.props.history.push('/');
                        window.location.reload(false);
                    }
                    else {
                        this.setState({
                            is_disabled : false,
                        })
                        Toast.fire({
                            icon: 'warning',
                            title: "Something Went wrong!"
                        });
                    }
                }
            })
        }

    }
    isNumber = (e) => {
        var rgx = /^[0-9]*\.?[0-9]*$/;
        var split_price = e.target.value.split('.');
        if (rgx.test(e.target.value)) {
            if( (split_price[0] && split_price[0].length !== undefined && split_price[0].length <= 6) ) {
                if(!split_price[1]) {
                    this.setState({need_price: e.target.value})
                }
                else {
                    if( (split_price[1] && split_price[1].length !== undefined && split_price[1].length <= 2) ) {
                        this.setState({need_price: e.target.value})
                    }
                }
                
            }
        }
        if(e.target.value.length === 0) {
            this.setState({need_price: e.target.value})
        }
    }
    disabledDate = (current) => {
        return moment() >= current || moment().add(1, 'month')  <= current;
    }
    trigger_location_autocomplete = () => {
        // alert('autohi');
        this.autocomplete(document.getElementById("manual_location"), this.state.general_info.cities);
        var el = document.getElementById('manual_location');
        el.dispatchEvent(new Event('input'));
    }
    autocomplete(inp, arr) {
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
                    rm.setState({ manual_location : inp.value});
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
    get_to_back = () => {
        this.props.history.goBack();
    }
    render() {
        return (
            <React.Fragment>

                <div className="container">
                    <div className="pt-5">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 class="fM" ref={(el) => {  this.task_name = el; }}>{ i18next.t('Post a Task') }</h4>
                            <div className="d-flex p-3 align-items-center hover-cont" onClick={ this.get_to_back }> 
                                <ArrowLeftOutlined  />
                                &nbsp;
                                <span>{ i18next.t("Back") } </span>
                            </div>
                        </div>
                        {/* <div className="pl-0 pl-md-5"> */}
                        <div>
                            <p className="my-4 fM">{ i18next.t('Describe Your Task') } </p>

                            <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 px-0">

                                <div className="">
                                    <p className="mb-2">{ i18next.t('Task Name') } </p>
                                    <div className="mb-3">
                                        <Input size="large" maxLength="60" placeholder={ i18next.t("Enter task Name") } onChange={ (e)=>{ this.setState( { task_name : e.target.value }) } } value={ this.state.task_name }/>
                                        <p className="text-danger">{ this.state.task_name_err }</p>
                                    </div>

                                    <p className="mb-2" ref={(input) => { this.category_id = input; }}>{ i18next.t("Select Category") } </p>
                                    <div className="mb-3">
                                
                                        <Select className="mb-3 w-100" defaultValue={ i18next.t("Select Category") } onChange={this.get_subcategories}>
                                            {
                                                this.state.categories.length > 0 &&
                                                this.state.categories.map((i,k) => {
                                                    return (
                                                    <Option key={k} value={i.parent_category_id}>{i.parent_category_name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <p className="text-danger">{ this.state.cat_err }</p>
                                    </div>
                                    <p className="mb-2" ref={(input) => { this.sub_category_id = input; }}>{ i18next.t("Select Sub Category") } </p>
                                    <div className="mb-3">
                                        <Select className="mb-3 w-100" defaultValue={i18next.t("Select Sub Category")} value={this.state.chosen_subcat} onChange={this.get_services}>
                                            {
                                                this.state.sub_categories.length > 0 &&
                                                this.state.sub_categories.map((i,k) => {
                                                    return (
                                                        <Option key={k} value={i.subcategory_id}>{i.subcategory_name}</Option>
                                                    )
                                                })
                                            }
                                            
                                        </Select>
                                        <p className="text-danger">{ this.state.sub_cat_err }</p>

                                    </div>
                                    <p className="mb-2" ref={(input) => { this.service_id = input; }}>{ i18next.t("Select Service") } </p>
                                    <div className="mb-3">
                                        <Select className="mb-3 w-100" defaultValue={ i18next.t("Select Service") } value={this.state.chosen_service} onChange={this.get_service}>
                                            {
                                                this.state.services.length > 0 &&
                                                this.state.services.map((i,k) => {
                                                    return (
                                                        <Option key={k} value={i.service_id}>{i.service_name}</Option>
                                                    )
                                                })
                                            }
                                            
                                        </Select>
                                        <p className="text-danger">{ this.state.service_err }</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="mb-2" ref={(input) => { this.service_date = input; }}>{ i18next.t("Say Where & When") }  </p>
                                    <div className="mb-3">
                                        <DatePicker inputReadOnly={true}  disabledDate={this.disabledDate} onChange={this.date_of_service} format={this.state.date_format} size="large" placeholder={ i18next.t("Choose your date") } />
                                        <p className="text-danger">{ this.state.date_err }</p>
                                    </div>
                                    {/* LexOne: client no longer enters an address — wrapper hidden, payload uses placeholder. */}
                                    <div ref={(input) => { this.location1 = input; }} style={{ display: 'none' }}>
                                    {
                                        this.state.category_info &&
                                        (this.state.category_info.location_type === 'transport' ||  this.state.category_info.location_type === 'home') &&
                                            <div className="mb-3">
                                            <Input size="large"  onChange={(e) =>  this.setState({location1 : e.target.value})} value={ this.state.location1 && this.state.location1 } autoComplete="off" onMouseDown = {(e)=> { if(this.state.general_info && this.state.general_info.instant_location === "true" && this.state.source_lat) { this.setState({ position : { lat : this.state.source_lat,lng : this.state.source_lng, } }) } this.setState({ manual_location : this.state.location1,show_hide_map : true,is_location_ModalVisible : true, location_input_id : 1 }) }} addonBefore={<div className="locationIcon" ></div>} placeholder={ this.state.category_info && this.state.category_info.location_type === 'transport' ? i18next.t("Enter Pickup Location") : i18next.t("Enter Location") } readOnly />
                                            <p className="text-danger">{this.state.location1_err}</p>
                                            </div>
                                    }
                                    {
                                        this.state.category_info &&
                                        (this.state.category_info.location_type === 'transport') &&
                                        <div className="mb-3">
                                            <Input size="large" onChange={(e) => this.setState({location2 : e.target.value})} value={ this.state.location2 && this.state.location2 } autoComplete="off" onMouseDown={ (e)=> { if(this.state.general_info && this.state.general_info.instant_location === "true" && this.state.dest_lat) { this.setState({ position : { lat : this.state.dest_lat,lng : this.state.dest_lng, } }) } this.setState({  manual_location : this.state.location2,show_hide_map : true,is_location_ModalVisible : true, location_input_id : 2 }) } } addonBefore={<div className="DroplocationIcon" ></div>} placeholder={ this.state.category_info && this.state.category_info.location_type === 'transport' ? i18next.t("Enter Drop Location") : i18next.t("Enter Location") } readOnly />
                                            <p className="text-danger">{this.state.location2_err}</p>
                                        </div>
                                    }
                                    </div>
                                </div>

                                {/*  */}


                                <div className="col-12 px-0">
                                    <p class="mb-2">{ i18next.t("Price") } </p>
                                    <Input inputMode="decimal" addonBefore={<div className="">{this.state.general_info && this.state.general_info.currency_symbol }</div>} size="large"  placeholder={ this.state.general_info && i18next.t("Minimum price is")+" "+this.state.general_info.currency_symbol+" "+this.state.general_info.minimum_payment_price } onChange={ this.isNumber } value={ this.state.need_price && this.state.need_price }/>
                                    <p className="text-danger">{ this.state.need_price_err }</p>
                                </div>
                                <div className="col-12 px-0">
                                    <p className="mt-4 mb-2">{ i18next.t("Tell us the details of your task") } </p>
                                    <TextArea
                                        placeholder={ i18next.t("Enter your details of your task") }
                                        autosize={{ minRows: 4, maxRows: 5 }}
                                        onChange={ (e)=>{ this.setState({ need_description : e.target.value }) } }
                                        value={ this.state.need_description && this.state.need_description }
                                    />
                                    <p className="text-danger">{ this.state.need_description_err }</p>
                                </div>

                                <div className="col-12 px-0">
                                    <div className="row mt-4">
                                        <div className="col-6 pr-0">
                                            <Button onClick={ (e)=> { e.stopPropagation(); this.props.history.goBack(); } } size="large" className="SecoundaryBtn lg fM  none" block>{ i18next.t("Cancel") }</Button>
                                        </div>
                                        <div className="col-6 align-self-center pl-sm-2">
                                                <Button disabled={this.state.is_disabled} onClick={ this.save_need } size="large" className="Btns PrimaryBtn lg fM mb-2 mb-sm-0" block>{ this.state.is_disabled === true ? <LoadingOutlined /> : i18next.t("Post") }</Button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                    <Modal title={ i18next.t("Enter Location")} onCancel={this.location_modal_close} footer={[<Button onClick={this.set_location}>{ i18next.t("Set Location")}</Button>]} visible={this.state.is_location_ModalVisible} >
                        {
                            this.state.general_info && this.state.general_info.instant_location === "true" ?  
                            <>
                            
                            <div className="h-330">
                                {
                                    this.state.show_hide_map === true &&
                                <Map
                                    google={this.props.google}
                                    center={ this.state.position && this.state.position }
                                    height='300px'
                                    zoom={ this.state.position && this.state.position.lat === 30.000000 && this.state.position.lng === 31.000000 ? 0 : 15 }
                                />
                                }
                            </div>
                            <div>
                                {/* <Button onClick={this.get_geo_location} type="primary" shape="circle" icon={<AimOutlined />} size="large" /> */}
                            </div>
                            </>
                            : 
                            <div  className="floatingLabelStyle p-4 py-5 px-sm-5 text-center">
                                <div>
                                    <FloatingInputs labelName={ i18next.t("Search Location")}>
                                    
                                        <input type="text" id="manual_location" placeholder=" " onChange={(e) => this.setState({ manual_location : e.target.value})} onMouseEnter={ this.trigger_location_autocomplete } autoComplete="off" value={this.state.manual_location} />
                                        <p className="text-danger">{ this.state.ex_location_err && this.state.ex_location_err }</p>
                                    </FloatingInputs>
                                
                                </div>
                                
                            </div>
                        }
                        
                        
                    </Modal>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps,null,null,{forwardRef:true})(withRouter(PostTask));
