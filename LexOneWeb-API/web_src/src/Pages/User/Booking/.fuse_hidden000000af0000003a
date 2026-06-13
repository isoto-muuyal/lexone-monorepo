import React, { Component } from 'react';
import { DatePicker, Input, Button, Modal, Select } from 'antd';
import {CloseCircleOutlined,LoadingOutlined} from '@ant-design/icons';
import FloatingInputs from "../../../components/FloatingLabel";
import { withRouter } from "react-router-dom";
import Breadcremb from '../../../components/BreadCremb';
import axios from 'axios';
import Map from '../../../components/Map';
import {connect} from 'react-redux';
import Swal from 'sweetalert2';
import socketIOClient from 'socket.io-client';
import moment from "moment";
import i18next from 'i18next';
import Loader from'react-loader-spinner';
import MetaDecorator from '../../../components/MetaDecorator';

const socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);

const { Option } = Select;

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

const { TextArea } = Input;

const mapStateToProps=(props)=> {
    return {
        user_location : props.userLocation
    }
}


class Booking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicks: 0,
            show: true,
            pro_services_state : (props.location && props.location.state) || {},
            selected_items : [],
            is_location_ModalVisible : false,
            date_format : 'DD-MM-YYYY',
            description : '',
            category_id : '',
            sub_category_id : '',
            availableTasker_modal : false,
            sorting_tasker_flag : 0,
            location1 : '',
            location2 : '',
            is_loading : true,
            show_hide_map : false,
            is_disabled : false
        }
    }
    UNSAFE_componentWillMount = () => {
        if(localStorage.getItem('user') !== null) {
            var user_info = JSON.parse(localStorage.getItem('user'));
            var general_info = JSON.parse(localStorage.getItem('general_info'));
            socket.emit("liveMe",{"user_id":user_info.user_id});
            socket.emit("joinChat",{"chat_id":user_info.user_id});
            this.get_category_by_id();
            if(general_info.instant_location === 'true') {
                this.get_geo_location();
            }
        }
    }
    date_of_service = (date, dateString) =>  {
        this.setState({
            date_of_service : date
        })
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../../assets/images/default_service_image.png");
    }
    location_modal_close = () => {
        this.setState({ 
            is_location_ModalVisible : false,
            show_hide_map : false 
        });
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
                    show_hide_map : false
                })
            }
            else {
                this.setState({ 
                    location2 : this.props.user_location.address && this.props.user_location.address,
                    dest_lat : this.props.user_location.lat && this.props.user_location.lat,
                    dest_lng : this.props.user_location.lng && this.props.user_location.lng,
                    is_location_ModalVisible : false,
                    show_hide_map : false
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
                    this.setState({ location1 : this.state.manual_location, manual_location : '',is_location_ModalVisible : false, ex_location_err : '',
                    show_hide_map : false })
                }
                else {
                    this.setState({ location2 : this.state.manual_location, manual_location : '',is_location_ModalVisible : false, ex_location_err : '',
                    show_hide_map : false })
                }
            }
        }
        
    }
    get_state_and_split_category = () => {
        var general_info = JSON.parse(localStorage.getItem('general_info'))
        this.setState({general_info : general_info})
        var state = this.props.location.state;
        var selected_items = this.state.selected_items;
        var sum_of_booking_amount = 0;
        var category_info = this.state.category_info && this.state.category_info;
       
        for (let index = 0; index < state.length; index++) {
            const each_element = state[index];
            if(category_info.parent_category_type === 'professional') {
                if(each_element.per_count !== 0) {
                    each_element.is_tasker_available = true;
                    selected_items.push(each_element);
                    sum_of_booking_amount = sum_of_booking_amount + each_element.sum_with_count;
                }
            }
            else {
                selected_items.push(each_element);
                sum_of_booking_amount = sum_of_booking_amount + each_element.sum_with_count;
            }
            
        }

        this.setState({ 
            selected_items : selected_items, 
            items_total_amount : sum_of_booking_amount,
        });

        var amount_to_be_paid = (sum_of_booking_amount * general_info.site_tax / 100) + (sum_of_booking_amount * general_info.site_commission / 100) + sum_of_booking_amount;
        this.setState({ amount_to_be_paid : parseFloat(amount_to_be_paid).toFixed(2)},()=>{
            this.setState({
                is_loading : false
            })
        })

    }
    get_category_by_id = () => {
        var state = this.props.location && this.props.location.state;
        var category_id = state && state[0].category_id;
        var sub_category_id = state && state[0].sub_category_id;
        if(category_id === undefined) {
            this.props.history.push('/user/my-booking');
        }
        this.setState({
            category_id : category_id,
            sub_category_id : sub_category_id
        })
        if(category_id !== '') {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams()
            params.append('category_id', category_id)
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/category_by_id`,params,config)
            .then (res=>{
                if(res.data.status_code === 200) {
                    this.setState({ 
                        category_info : res.data.category[0]
                    },()=>{
                        if(res.data.category[0].parent_category_type === 'marketplace') {
                            this.setState({ no_of_service_unit : 1 });
                        }
                        this.get_state_and_split_category();
                    })
                    
                }
            });
        }
    }
    IncrementItem = () => {
        if(parseInt(this.state.no_of_service_unit) < 10) {
            this.setState({ no_of_service_unit: this.state.no_of_service_unit + 1 });
        }
        else {
            Toast.fire({
                icon: 'warning',
                title: i18next.t('Maximum limit reached')
            });
        }
    }
    DecreaseItem = () => {
        if(this.state.no_of_service_unit !== 1) {
            this.setState({ no_of_service_unit: this.state.no_of_service_unit - 1 });
        }
    }

    trigger_location_autocomplete = () => {
        // alert('autohi');
        this.autocomplete(document.getElementById("manual_location"), this.state.general_info.cities);
        var el = document.getElementById('manual_location');
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
    get_geo_location = () => {
        var rm = this;
        rm.setState({ lat:30.000000,lon:31.000000 });
        var init_pos = {
            lat : 30.000000,
            lng : 31.000000
        }
        rm.setState({ position : init_pos, gps_flag : false });
        // if ("geolocation" in navigator) {
        //     navigator.geolocation.getCurrentPosition((position) =>  {
        //         var latitude = position.coords.latitude;
        //         var longitude = position.coords.longitude;
        //         rm.setState({ lat:latitude,lon:longitude });
        //         var pos = {
        //             lat : latitude,
        //             lng : longitude
        //         }
        //         rm.setState({ position : pos, gps_flag : true });
        //     });
        // } else {
        //     alert("Sorry Not available!");
        // }
    }

    book_professional_service = () => {
        var err = 0;
        var current_date = new Date();
        var chosen_date = new Date(this.state.date_of_service);
        console.log('current_date',current_date);
        console.log('chosen_date',chosen_date);
        this.setState({
            is_disabled : true,
        })
        if(!this.state.date_of_service || (this.state.date_of_service && this.state.date_of_service === '')) {
            this.setState({ date_of_service_err : i18next.t('Date is required!'),is_disabled : false,  });
            err++;
        }
        else if(this.state.date_of_service && chosen_date < current_date) {
            this.setState({ date_of_service_err : i18next.t('Choose Future Date!'),is_disabled : false,  });
            err++;
        }
        else {
            this.setState({ date_of_service_err : ''  });
        }

        if(this.state.category_info && (this.state.category_info.location_type === 'home' || this.state.category_info.location_type === 'transport')) {
            if(!this.state.location1 || (this.state.location1 && this.state.location1 === '')) {
                this.setState({ location1_err : i18next.t('Location is required!'),is_disabled : false,  });
                err++;
            }
            else {
                this.setState({ location1_err : ''  });
            }
        }
        if(this.state.category_info && this.state.category_info.location_type === 'transport') {
            
            if(!this.state.location2 || (this.state.location2 && this.state.location2 === '')) {
                this.setState({ location2_err : i18next.t('Location is required!'),is_disabled : false,  });
                err++;
            }
            else if((this.state.location2 && this.state.location2) === (this.state.location1 && this.state.location1)) {
                this.setState({ location2_err : i18next.t('Location should be different!'),is_disabled : false,  });
                err++;
            }
            else if(this.state.general_info && this.state.general_info.instant_location === 'true') {
                var distance =  this.getDistanceFromLatLonInKm(
                    parseFloat(this.state.source_lat),
                    parseFloat(this.state.source_lng),
                    parseFloat(this.state.dest_lat),
                    parseFloat(this.state.dest_lng),
                );
                var distance_limit = parseFloat(this.state.general_info.max_ride_distance);
                if(distance > distance_limit) {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Service Exceeds the Limit!'
                    });
                    this.setState({ location2_err : 'Service Exceeds the Limit!',is_disabled : false,  });
                    err++;
                } 
                else {
                    this.setState({ location2_err : ''  });
                }
            }
            else {
                this.setState({ location2_err : ''  });
            }
        }

        if(!this.state.description || (this.state.description && this.state.description === '')) {
            this.setState({ description_err : i18next.t('Description is required!'),is_disabled : false,  });
            err++;
        }
        else {
            this.setState({ description_err : ''  });
        }
        if(parseFloat(this.state.items_total_amount) < parseFloat(this.state.general_info.minimum_payment_price)) {
            var min_err = i18next.t('Book Service more than minimum amount')+' '+this.state.general_info.currency_symbol+' '+this.state.general_info.minimum_payment_price+'!';
            Toast.fire({
                icon: 'warning',
                title: min_err
            });
            this.setState({
                is_disabled : false,
            })
            err++;
        }
        if(err === 0) {
            var user_info = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            
            const params = new URLSearchParams()
            params.append('date', this.state.date_of_service && this.state.date_of_service)
            params.append('parent_category_id', this.state.category_info && this.state.category_info.parent_category_id)
            params.append('subcategory_id', this.state.selected_items && this.state.selected_items[0].sub_category_id)
            params.append('total', parseFloat(this.state.amount_to_be_paid).toFixed(2))
            params.append('user_id', user_info.user_id)
            params.append('price', parseFloat(this.state.items_total_amount).toFixed(2))
            params.append('description', this.state.description)
            params.append('location_type', this.state.category_info && this.state.category_info.location_type)

            params.append('source_location', this.state.location1 ? this.state.location1 : '')
            params.append('source_lat', this.state.source_lat ? this.state.source_lat : '')
            params.append('source_lon', this.state.source_lng ? this.state.source_lng : '')
            if(this.state.category_info && this.state.category_info.location_type === 'transport') {
                params.append('dest_location', this.state.location2 ? this.state.location2 : '')
                params.append('dest_lat', this.state.dest_lat ? this.state.dest_lat : '')
                params.append('dest_lon', this.state.dest_lng ? this.state.dest_lng : '')
            }
            const set_service = [];
            for (let index = 0; index < this.state.selected_items.length; index++) {
                const services = this.state.selected_items[index];
                const service = {};
                service.is_new = false;
                service.isNotAvailable = false;
                service.service_id = services.service_id;
                service.service_image = services.service_image;
                service.service_name = services.service_name;
                service.service_price = services.service_price;
                service.service_pricing = services.service_pricing;
                service.service_quantity = services.per_count;
                service.service_total_price = services.sum_with_count;
                set_service.push(service);
            }
            params.append('services', JSON.stringify(set_service))

            let currency_code = this.state.general_info.currency_code;
            params.append('currency_code',currency_code);

            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/bookservice`, 
            params,config)
            .then(res => {
                console.log('book service');
                console.log(res);
                if(res.status === 200) {
                    if(res.data.status_code === 200){
                        var chk_pushed = 0;
                        this.setState({
                            is_disabled : false,
                        })
                        this.props.history.push('/user/my-booking/detail', res.data);
                        chk_pushed = 1;
                        if(res.data.session_url){
                            if(chk_pushed === 1) {
                                window.location.href = res.data.session_url; 
                            }
                        }
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
                    else if(res.data.status_code === 400) {
                        this.setState({
                            is_disabled : false,
                        })
                        Toast.fire({
                            icon: 'warning',
                            title: res.data.message
                        });
                    }
                    else if(res.data.status_code === 399) {
                        Toast.fire({
                            icon: 'warning',
                            title: res.data.message
                        });
                        var unavailable_service = res.data.unavailable_services;
                        var selected_service = this.state.selected_items && this.state.selected_items;
                        if(unavailable_service.length > 0) {
                            for (let index = 0; index < unavailable_service.length; index++) {
                                const each_service = unavailable_service[index];
                                var current_service_index = selected_service.findIndex(x => x.service_id === each_service);
                                selected_service[current_service_index].is_tasker_available = false;
                            }
                            this.setState({
                                selected_service : selected_service,
                                is_disabled : false,
                            })
                        }
                    }
                    else {
                        Toast.fire({
                            icon: 'warning',
                            title: res.data.message
                        });
                        this.setState({
                            is_disabled : false,
                        })
                    }
                }
            })
        }
    }
    sort_technicians = (value) => {
        this.setState({ 
            sorting_tasker_flag : value
        },()=>{
            this.hire_market_place_service();
        })
    }
    book_marketplace_service_tasker = (i) => {
        this.setState({
            is_disabled : true,
        })
        var tasker_info = this.state.availableTaskers && this.state.availableTaskers[i];
        var user_info = JSON.parse(localStorage.getItem('user'));
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        var per_hour_price = tasker_info.price;
        var no_of_service_unit = this.state.no_of_service_unit && this.state.no_of_service_unit;
        var site_commission = this.state.general_info && this.state.general_info.site_commission;
        var site_tax = this.state.general_info && this.state.general_info.site_tax;

        var service_price = parseFloat(per_hour_price) * parseFloat(no_of_service_unit);

        var site_commission_amnt = parseFloat(service_price) * parseFloat(site_commission) / 100;
        var site_tax_amnt = parseFloat(service_price) * parseFloat(site_tax) / 100;

        var total_amount_to_be_paid = parseFloat(service_price) + parseFloat(site_commission_amnt) + parseFloat(site_tax_amnt);
        var err = 0;
        if(parseFloat(service_price) < parseFloat(this.state.general_info.minimum_payment_price)) {
            var min_err = i18next.t('Book Service more than minimum amount')+' '+this.state.general_info.currency_symbol+' '+this.state.general_info.minimum_payment_price+'!';
            Toast.fire({
                icon: 'warning',
                title: min_err
            });
            this.setState({
                is_disabled : false,
            })
            err++;
        }
        if(err === 0) {
            const params = new URLSearchParams()
            params.append('date', this.state.date_of_service && this.state.date_of_service)
            params.append('parent_category_id', this.state.category_info && this.state.category_info.parent_category_id)
            params.append('subcategory_id', this.state.selected_items && this.state.selected_items[0].sub_category_id)
            params.append('total', parseFloat(total_amount_to_be_paid).toFixed(2))
            params.append('user_id', user_info.user_id)
            params.append('tasker_id', tasker_info.user_id)
            params.append('price', parseFloat(service_price).toFixed(2))
            params.append('description', this.state.description)
            params.append('location_type', this.state.category_info && this.state.category_info.location_type)

            params.append('source_location', this.state.location1 ? this.state.location1 : '')
            params.append('source_lat', this.state.source_lat ? this.state.source_lat : '')
            params.append('source_lon', this.state.source_lng ? this.state.source_lng : '')
            if(this.state.category_info && this.state.category_info.location_type === 'transport') {
                params.append('dest_location', this.state.location2 ? this.state.location2 : '')
                params.append('dest_lat', this.state.dest_lat ? this.state.dest_lat : '')
                params.append('dest_lon', this.state.dest_lng ? this.state.dest_lng : '')
            }
            
            const set_service = [];
            for (let index = 0; index < this.state.selected_items.length; index++) {
                const services = this.state.selected_items[index];
                const service = {};
                service.is_new = false;
                service.isNotAvailable = false;
                service.service_id = services.service_id;
                service.service_image = services.service_image;
                service.service_name = services.service_name;
                service.service_price = tasker_info.price;
                service.service_pricing = services.service_pricing;
                service.service_quantity = no_of_service_unit;
                service.service_total_price = service_price;
                set_service.push(service);
            }
            console.log('services',JSON.stringify(set_service))
            params.append('services', JSON.stringify(set_service))
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/bookservice`, 
            params,config)
            .then(res => {
                console.log('book service');
                console.log(res);
                if(res.status === 200) {
                    if(res.data.status_code === 200){
                        const params1 = new URLSearchParams()
                        params1.append('user_id', user_info.user_id)
                        params1.append('booking_id', res.data && res.data.booking_id)
                        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/createchat`, 
                        params1,config)
                        .then(res1=>{
                            if(res1.data.status_code === 200) {
                                var message_obj = {};
                                var message = {};
                                message.attachment = '';
                                message.booking_id = res.data.booking_id;
                                message.isActive = "true";
                                message.lat = "";
                                message.lon = "";
                                message.message = "Request for Service";
                                message.quote_price = service_price;
                                message.type = "request";

                                message_obj.message = message;
                                message_obj.chat_id = res1.data.chat_id;
                                message_obj.date = new Date();
                                message_obj.message_id = user_info.user_id+''+Math.floor(1000000000 + Math.random() * 9000000000);
                                message_obj.message_type = 'request';
                                message_obj.receiver_id = tasker_info.user_id;
                                message_obj.type = 'bookingchat';
                                message_obj.user_id = user_info.user_id;
                                message_obj.user_image = user_info.user_image;
                                message_obj.user_name = user_info.name;
                                this.setState({
                                    is_disabled : false,
                                })

                                socket.emit('sendMessage',message_obj);
                                this.props.history.push('/user/my-booking/detail', res.data);
                            }
                        })
                        // Toast.fire({
                        //     icon: 'success',
                        //     title: 'Booking Successfully!'
                        // });
                        
                    }   
                    else if(res.data.status_code === 401) {
                        this.setState({
                            is_disabled : true,
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
                            title: res.data.message
                        });
                    }
                }
            })
        }
    }
    hire_market_place_service = () => {
        var err = 0;
        var current_date = new Date();
        var chosen_date = new Date(this.state.date_of_service);
        this.setState({
            is_disabled : true,
        })
        if(!this.state.date_of_service || (this.state.date_of_service && this.state.date_of_service === '')) {
            this.setState({ date_of_service_err : i18next.t('Date is required!'),is_disabled : false  });
            err++;
        }
        else if(this.state.date_of_service && chosen_date !== current_date && chosen_date < current_date) {
            this.setState({ date_of_service_err : i18next.t('Choose Future Date!'),is_disabled : false  });
            err++;
        }
        else {
            this.setState({ date_of_service_err : ''  });
        }

        if(this.state.category_info && (this.state.category_info.location_type === 'home' || this.state.category_info.location_type === 'transport')) {
            if(!this.state.location1 || (this.state.location1 && this.state.location1 === '')) {
                this.setState({ location1_err : i18next.t('Location is required!'),is_disabled : false  });
                err++;
            }
            else {
                this.setState({ location1_err : ''  });
            }
        }
        if(this.state.category_info && this.state.category_info.location_type === 'transport') {
            if(!this.state.location2 || (this.state.location2 && this.state.location2 === '')) {
                this.setState({ location2_err : i18next.t('Location is required!'),is_disabled : false  });
                err++;
            }
            else if((this.state.location2 && this.state.location2) === (this.state.location1 && this.state.location1)) {
                this.setState({ location2_err : i18next.t('Location should be different!'),is_disabled : false  });
                err++;
            }
            else if(this.state.general_info && this.state.general_info.instant_location === 'true') {
                var distance =  this.getDistanceFromLatLonInKm(
                    parseFloat(this.state.source_lat),
                    parseFloat(this.state.source_lng),
                    parseFloat(this.state.dest_lat),
                    parseFloat(this.state.dest_lng),
                );
                var distance_limit = parseFloat(this.state.general_info.max_ride_distance);
                if(distance > distance_limit) {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Service Exceeds the Limit!'
                    });
                    this.setState({ location2_err : 'Service Exceeds the Limit!',is_disabled : false  });
                    err++;
                } 
                else {
                    this.setState({ location2_err : ''  });
                }
            }
            else {
                this.setState({ location2_err : ''  });
            }
        }

        if(!this.state.description || (this.state.description && this.state.description === '')) {
            this.setState({ description_err : i18next.t('Description is required!'),is_disabled : false  });
            err++;
        }
        else {
            this.setState({ description_err : ''  });
        }
        
        if(err === 0) {
            var user_info = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            
            const params = new URLSearchParams()
            params.append('user_id', user_info.user_id)
            params.append('service_id', this.state.selected_items && this.state.selected_items[0].service_id)
            params.append('description', this.state.description)
            
            params.append('parent_category_id', this.state.category_info && this.state.category_info.parent_category_id)
            
            params.append('location_type', this.state.category_info && this.state.category_info.location_type)

            params.append('source_location', this.state.location1 ? this.state.location1 : '')
            params.append('source_lat', this.state.source_lat ? this.state.source_lat : '')
            params.append('source_lon', this.state.source_lng ? this.state.source_lng : '')
            if(this.state.category_info && this.state.category_info.location_type === 'transport') {
                params.append('dest_location', this.state.location2 ? this.state.location2 : '')
                params.append('dest_lat', this.state.dest_lat ? this.state.dest_lat : '')
                params.append('dest_lon', this.state.dest_lng ? this.state.dest_lng : '')
            }
            
            params.append('sort', this.state.sorting_tasker_flag)
            params.append('page', '1')
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/hiretaskers`, 
            params,config)
            .then(res => {
                console.log('book service');
                console.log(res);
                if(res.status === 200) {
                    if(res.data.status_code === 200){
                        
                        if(res.data.items.length > 0) {
                            var filtered_available_tasker = res.data.items.reduce((unique, o) => {
                                if(!unique.some(obj => obj.user_id === o.user_id )) {
                                  unique.push(o);
                                }
                                return unique;
                            },[]);
                        }
                        this.setState({
                            availableTaskers : filtered_available_tasker,
                            availableTasker_modal : true,
                            is_disabled : false
                        })
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
                            title: res.data.message
                        });
                    }
                }
            })
        }
    }
    available_tasker_modal_close = () => {
        this.setState({
            availableTasker_modal : false
        })
    }
    disabledDate = (current) => {
        
        return moment() >= current || moment().add(1, 'month')  <= current;
    }
    tasker_view = (id) => {
        const win = window.open(`${process.env.REACT_APP_FRONT_BASE_URL}/user/tasker-view/${id}`, "_blank");
        win.focus();
    }
    remove_service_items = (i) => {
        var selected_items = this.state.selected_items && this.state.selected_items;

        if (i > -1) {
            selected_items.splice(i, 1);
        }
        this.setState({
            selected_items : selected_items
        },()=>{
            var altered_selected_items = this.state.selected_items;
            var sum_of_booking_amount = 0;
            var category_info = this.state.category_info && this.state.category_info;
            if(altered_selected_items.length > 0) {
                for (let index = 0; index < altered_selected_items.length; index++) {
                    const each_element = altered_selected_items[index];
                    if(category_info.parent_category_type === 'professional') {
                        if(each_element.per_count !== 0) {
                            sum_of_booking_amount = sum_of_booking_amount + each_element.sum_with_count;
                        }
                    }
                }
    
                this.setState({ 
                    items_total_amount : sum_of_booking_amount,
                });
    
                var amount_to_be_paid = (sum_of_booking_amount * this.state.general_info.site_tax / 100) + (sum_of_booking_amount * this.state.general_info.site_commission / 100) + sum_of_booking_amount;
                this.setState({ 
                    amount_to_be_paid : parseFloat(amount_to_be_paid).toFixed(2)
                })
            }
        })
          
    }
    render() {
        return (
            <React.Fragment>
            <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title='| User Booking' description="IDemand Booking Page"/>
                {
                    this.state.is_loading === true ?
                    <div>
                        <Loader
                            type="ThreeDots"
                            color="#10AB81"
                            height={100}
                            width={100}
                        />
                    </div>
                    :
                    <div className="container">
                        <div className="pt-5">
                        <Breadcremb flag="category" category_id={ this.state.category_id && this.state.category_id } sub_category_id={ this.state.sub_category_id && this.state.sub_category_id } />
                    
                                <h5 className="my-4 fM">{i18next.t('Describe Your Task')} </h5>
                                <div className="row">
                                    <div className="col-12 col-lg-6 col-xl-6">
                                        <div className="col-12 px-0 mb-4">
                                            <p className="mb-3 fM">{i18next.t('Where & When')} </p>
                                            <div className="mb-3">
                                                <DatePicker inputReadOnly={true} disabledDate={this.disabledDate} onChange={this.date_of_service} format={this.state.date_format} />
                                                <p className="text-danger">{ this.state.date_of_service_err && this.state.date_of_service_err }</p>
                                            </div>
                                                {/* <input type="text"  /> */}
                                                {
                                                    this.state.category_info &&
                                                    (this.state.category_info.location_type === 'transport' ||  this.state.category_info.location_type === 'home') &&
                                                    <div className="mb-3">
                                                        <Input size="large" onMouseDown={(e)=> { if(this.state.general_info && this.state.general_info.instant_location === "true" && this.state.source_lat) { this.setState({ position : { lat : this.state.source_lat,lng : this.state.source_lng, } }) } this.setState({ manual_location : this.state.location1, show_hide_map : true,is_location_ModalVisible : true, location_input_id : 1 }) }} onChange={(e) => this.setState({location1 : e.target.value})} value={ this.state.location1 && this.state.location1 } autoComplete="off" addonBefore={<div className="locationIcon" ></div>} placeholder={ this.state.category_info && this.state.category_info.location_type === 'transport' ? i18next.t('Enter Pickup Location') : i18next.t("Enter Location") } readOnly />
                                                        <p className="text-danger">{this.state.location1_err}</p>
                                                    </div>
                                                }
                                                {
                                                    this.state.category_info &&
                                                    (this.state.category_info.location_type === 'transport') &&
                                                    <div className="mb-3">
                                                        <Input size="large" onMouseDown={(e)=> { if(this.state.general_info && this.state.general_info.instant_location === "true" && this.state.dest_lat) { this.setState({ position : { lat : this.state.dest_lat,lng : this.state.dest_lng, } }) } this.setState({ manual_location : this.state.location2,show_hide_map : true,is_location_ModalVisible : true, location_input_id : 2 }) }} onChange={(e) => this.setState({location2 : e.target.value})} value={ this.state.location2 && this.state.location2 } autoComplete="off" addonBefore={<div className="DroplocationIcon" ></div>} placeholder={ this.state.category_info && this.state.category_info.location_type === 'transport' ? i18next.t("Enter Drop Location") : i18next.t("Enter Location") } readOnly />
                                                        <p className="text-danger">{this.state.location2_err}</p>
                                                    </div>
                                                }
                                                
                                        </div>
                                        {
                                            this.state.category_info &&
                                            this.state.category_info.parent_category_type === 'professional' ?
                                            <div className="col-12 px-0 mb-4">
                                                {/* <p className="mb-3 fM">Unit </p> */}
                                                <section>
                                                    {
                                                        this.state.selected_items &&
                                                        this.state.selected_items.map((i,k) => (
                                                            <div className="d-flex jusity-content-between flex-wrap border-bottom py-3" key={k}>
                                                                <div className="d-flex flex-fill align-items-center">
                                                                    <div className="mr-3">
                                                                        <img onError={ this.service_image_err }  src={i.service_image} alt="" className="imgBg profile-sm" />
                                                                    </div>
                                                                    <div className="">
                                                                        <p className="mb-1">{i.service_name}</p>
                                                                        <p className="mb-0 fM">{ this.state.general_info && this.state.general_info.currency_symbol } <span>{i.service_price}</span> X <span>{i.per_count}</span> / <span>{i.service_pricing}</span></p>
                                                                    </div>
                                                                </div>
                                                                <div className="d-flex align-items-center flex-fill justify-content-end"><p className="mb-0 mr-2 fM font-lg white-nowrap">{this.state.general_info.currency_symbol} { parseFloat(i.sum_with_count).toFixed(2) }</p>
                                                                {
                                                                    i.is_tasker_available === false &&
                                                                    <CloseCircleOutlined onClick={ ()=>{ this.remove_service_items(k); } } className="text-danger cursorPointer"/>
                                                                }
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                    
                                                </section>
                                                
                                            </div>
                                            :
                                            this.state.selected_items &&
                                            this.state.selected_items.map((i,k) => (
                                            <div className="col-12 px-0 mb-4">
                                                {/* <p className="mb-3 fM">{ i.service_pricing } </p> */}
                                                <p className="mb-1">{i.service_name}</p>
                                                <div className="quantity d-flex justify-content-start mr-3">
                                                    <button className="decrement" onClick={this.DecreaseItem} />
                                                    <button className="countBtn"> {this.state.show ? <span>{ this.state.no_of_service_unit+' / '+i.service_pricing }</span> : ''}</button>
                                                    <button className="increment" onClick={this.IncrementItem} />
                                                </div>
                                            </div>
                                            ))
                                        }
                                        

                                        <div className="col-12 px-0 mb-4">
                                            <p className="mb-3 fM">{ i18next.t("Description") }</p>
                                            <TextArea
                                                maxLength={300} 
                                                placeholder={ i18next.t("Enter your details of your task") }
                                                onChange={(e)=> { this.setState({ description : e.target.value }) }}
                                                value={ this.state.description }
                                            />
                                            <p className="text-danger">{ this.state.description_err && this.state.description_err }</p>
                                        </div>

                                        <div className="col-12">
                                            <div className="row flex-column-reverse flex-sm-row">
                                                <div className="col-12 col-sm-6 px-0 pr-sm-2  pl-sm-0 py-2">
                                                    <Button size="large" className="SecoundaryBtn lg fM  none" onClick={this.props.history.goBack} block>{ i18next.t("Cancel") }</Button>
                                                </div>
                                                {
                                                    this.state.category_info &&
                                                    this.state.category_info.parent_category_type === 'professional' ?
                                                    <div className="col-12 col-sm-6 px-0 pr-sm-0  pl-sm-2 align-self-center">
                                                    {/* <Link to="/User/MyBooking/Detail"> */}
                                                            <Button onClick={this.book_professional_service} size="large" disabled={this.state.is_disabled} className=" PrimaryBtn lg fM mb-2 mb-sm-0" block>{ this.state.is_disabled === true ? <LoadingOutlined /> : i18next.t("Book now") }</Button>
                                                        {/* </Link> */}
                                                    </div>
                                                    :
                                                    <div className="col-12 col-sm-6 px-0 pr-sm-0  pl-sm-2 align-self-center">
                                                    {/* <Link to="/User/MyBooking/Detail"> */}
                                                            <Button onClick={ (e)=>{ e.stopPropagation();this.hire_market_place_service(); } } size="large" disabled={this.state.is_disabled} className=" PrimaryBtn lg fM mb-2 mb-sm-0" block>{ this.state.is_disabled === true ? <LoadingOutlined /> : i18next.t("Hire now") }  </Button>
                                                        {/* </Link> */}
                                                    </div>
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        this.state.category_info && 
                                        this.state.category_info.parent_category_type === 'professional' &&

                                    
                                    <div className="col-12 col-lg-6 col-xl-6 mt-4 mt-lg-0">
                                    <section className="paymentBox">
                                        <h5 className="title">{ i18next.t("Payment Summary") }</h5>
                                        <div className="content">
                                            <div className="row align-items-center" >
                                                <p className="col-8">
                                                    <div className="text-truncate fM">
                                                    { i18next.t("Booking Amount + IVA") }</div>
                                                </p><p className="col-4">

                                                    <div className="text-right fM">{ this.state.general_info && this.state.general_info.currency_symbol }
                                                        { 
                                                            (parseFloat(this.state.items_total_amount) + 
                                                            parseFloat(this.state.items_total_amount * this.state.general_info.site_tax / 100)).toFixed(2) 
                                                        }</div>
                                                </p>
                                                <p className="col-8">
                                                    <div className="text-truncate fM"> { i18next.t("Commission") }</div>
                                                </p>
                                                <p className="col-4">
                                                    <div className="text-right fM"> { this.state.general_info && this.state.general_info.currency_symbol} {
                                                        this.state.general_info &&
                                                        parseFloat(this.state.items_total_amount * this.state.general_info.site_commission / 100).toFixed(2)
                                                    } </div>
                                                </p>
                                                
                                                {/* <p className="col-8 mb-0">
                                                    <div className="text-truncate fM"> { i18next.t("Tax") }</div>
                                                </p><p className="col-4 mb-0">
                                                    <div className="text-right fM"> { this.state.general_info && this.state.general_info.currency_symbol} {
                                                        this.state.general_info &&
                                                        parseFloat(this.state.items_total_amount * this.state.general_info.site_tax / 100).toFixed(2) 
                                                    } </div>
                                                </p> */}
                                                </div>
                                                <hr/>
                                            <div className="row"><p className="col-8 mb-0"><div className="text-truncate fM">{ i18next.t("Amount to be paid") }</div></p><p className="col-4 mb-0"> <div className="text-right fM font-lg">{ this.state.general_info && this.state.general_info.currency_symbol} {
                                                        this.state.amount_to_be_paid
                                                    } </div>  </p></div>
                                        </div>

                                    </section>
                                    </div>
                                    }
                                </div>
                        
                                <Modal title={ i18next.t("Enter Location") } onCancel={this.location_modal_close} footer={[<Button onClick={this.set_location}>{ i18next.t("Set Location") }</Button>]} visible={this.state.is_location_ModalVisible} className="locationModal">
                                    {
                                        this.state.general_info && this.state.general_info.instant_location === "true" ?  
                                        <>
                                        
                                        <div className="h-300">
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
                                        
                                        </div>
                                        </>
                                        : 
                                        <div  className="floatingLabelStyle p-4 py-5 px-sm-5 text-center">
                                            <div>
                                                <FloatingInputs labelName={ i18next.t("Search Location") }>
                                                
                                                    <input type="text" id="manual_location" placeholder=" " onChange={(e) => this.setState({ manual_location : e.target.value})} onMouseEnter={  this.trigger_location_autocomplete } autoComplete="off" value={this.state.manual_location} />
                                                    <p className="text-danger">{ this.state.ex_location_err && this.state.ex_location_err }</p>
                                                </FloatingInputs>
                                            
                                            </div>
                                            
                                        </div>
                                    }
                                    
                                    
                                </Modal>

                                <Modal width={1000} title={ i18next.t("Available Taskers") } onCancel={this.available_tasker_modal_close} footer={[<Button onClick={this.available_tasker_modal_close}>{ i18next.t("Close") }</Button>]} visible={this.state.availableTasker_modal} >
                                    <section className="">
                                        <div className="technician">
                                            <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                <p className="mb-0">{ i18next.t("You can chat with your Tasker. Adjust task details, or change task time after booking.") }</p>
                                                <div className="d-flex align-items-center justify-content-end flex-fill pt-xl-0 pt-3">
                                                    <div id="checkboxes" className=" mr-3">
                                                        {/* <input type="checkbox" name="list" value="1" id="1" />
                                                        <label className="whatever mb-0" for="1"></label> */}
                                                    </div>

                                                    {/*<div>
                                                        <Select defaultValue="Sort by" style={{ width: 160 }} onChange={this.sort_technicians}>
                                                            <Option value="0">{i18next.t("Price ( low - high )")}</Option>
                                                            <Option value="1">{i18next.t("Price ( high - low )")}</Option>
                                                            <Option value="2">{i18next.t("% Of Positive Review")}</Option>
                                                            <Option value="3">{i18next.t("# Completed Task")}</Option>
                                                        </Select>
                                                    </div>*/}

                                                    <div>
                                                        <Select getPopupContainer={(triggerNode) => {return triggerNode.parentNode;}}
                                                            defaultValue="Sort by" style={{ width: 160 }} onChange={this.sort_technicians}>
                                                            <Option value="0">{i18next.t("Price ( low - high )")}</Option>
                                                            <Option value="1">{i18next.t("Price ( high - low )")}</Option>
                                                            <Option value="2">{i18next.t("% Of Positive Review")}</Option>
                                                            <Option value="3">{i18next.t("# Completed Task")}</Option>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mt-4 modal-center">
                                            {
                                                this.state.availableTaskers &&
                                                this.state.availableTaskers.map((i,k)=>(
                                                <div className="col-md-6 col-sm-12" key={k}>
                                                        <div className="cardTwoStyle" onClick={ (e)=>{ e.stopPropagation(); this.tasker_view(i.user_id); } }>
                                                            <div className="row">
                                                                <div className="col-lg-8 cursorPointer">
                                                                    <div className="row">
                                                                        <div className="col-sm-4 col-lg-4">
                                                                            <img onError={ this.service_image_err } alt="" className="rounded imgBg" src={i.user_image} height={100} />
                                                                        </div>
                                                                        <div className="col-sm-8 col-lg-8">
                                                                            <div className="detailsSection mt-3 mt-sm-0">
                                                                                <div className="fM text-truncate">
                                                                                { i.name }
                                                                                </div>


                                                                                <div className="detailsThree my-2">
                                                                                    <span className="greenStar" />
                                                                                    <div className="align-self-center"><span className="greenTxtClr fM">{i.rating}</span> ( { i.reviews } {i18next.t("Reviews")} )</div>
                                                                                </div>
                                                                                <p className="mb-0 font-sm">{ i.completed_tasks } {i18next.t("Jobs")}</p>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-4">
                                                                    <div className="mt-3 mt-lg-0 text-right d-flex justify-content-between d-lg-block">
                                                                        <div className="detailsSection text-right mb-lg-2">
                                                                            <div className="detailsSix text-truncate">
                                                                                <span> { this.state.general_info && this.state.general_info.currency_symbol }{ i.price } </span> / { this.state.selected_items && this.state.selected_items[0].service_pricing }
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <Button disabled={ this.state.is_disabled } onClick={ (e)=> {
                                                                            e.stopPropagation();
                                                                            this.book_marketplace_service_tasker(k);
                                                                        } } className="Btns PrimaryBtn lg">{i18next.t("Hire")}</Button>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                </div>
                                                ))
                                            }
                                               
                                            </div>


                                        </div>
                                    </section>
                                </Modal>
                        </div>
                    </div>
                }
            </div>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps,null,null,{forwardRef:true})(withRouter(Booking));