import React, { Component } from 'react';
import { DatePicker, Input, Button, Modal } from 'antd';
import FloatingInputs from "../../components/FloatingLabel";
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from "axios";
import Map from '../../components/Map';
import {connect} from 'react-redux';
import Swal from 'sweetalert2';
import moment from 'moment';
import i18next from 'i18next';
import { PLACEHOLDER_OFFICE_ADDRESS, PLACEHOLDER_OFFICE_LAT, PLACEHOLDER_OFFICE_LON } from '../../lexOnePlaceholder';

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


class EditNeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: undefined,
            date_format : 'DD-MM-YYYY',
            categories : [],
            sub_categories : [],
            services : [],
            is_location_ModalVisible : false,
            // LexOne: pre-populate with placeholder so form validation passes.
            location1 : PLACEHOLDER_OFFICE_ADDRESS,
            location2 : PLACEHOLDER_OFFICE_ADDRESS,
            source_lat : PLACEHOLDER_OFFICE_LAT,
            source_lng : PLACEHOLDER_OFFICE_LON,
            dest_lat : PLACEHOLDER_OFFICE_LAT,
            dest_lng : PLACEHOLDER_OFFICE_LON,
            show_hide_map : false
        }
        this.get_need_by_id = this.get_need_by_id.bind(this);
    }
    onChange = value => {
        console.log(value);
        this.setState({ value });
    };
    UNSAFE_componentWillMount = () => {
        this.get_category_by_id();
        this.get_subcategory_by_id();
        this.get_service_by_id();
        this.get_need_by_id();
    }
    get_category_by_id = () => {
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        var user_info = JSON.parse(localStorage.getItem('user'));
        this.setState({ general_info : general_info, user_info : user_info },()=>{
            if(general_info.instant_location === 'true') {
                this.get_geo_location();
            }
        })
        var cat_id = this.props.location.state && this.props.location.state.parent_category_id;
        if(cat_id !== '') {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams()
             params.append('category_id', cat_id)
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/category_by_id`,params,config)
            .then (res=>{
                console.log('bread_1');
                console.log(res.data)
                if(res.data.status_code === 200) {
                    this.setState({ 
                        category_info : res.data.category[0],
                        category_name : res.data.category[0].parent_category_name
                    })
                }
            });
        }
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
    get_subcategory_by_id = () => {
        var sub_cat_id = this.props.location.state && this.props.location.state.subcategory_id;
        if(sub_cat_id !== '') {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams()
             params.append('sub_category_id', sub_cat_id)
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/sub_category_by_id`,params,config)
            .then (res=>{
                console.log(res);
                if(res.data.status_code === 200) {
                    this.setState({ subcategory_name : res.data.category[0].subcategory_name })
                }
            });
        }
    }
    get_service_by_id = () => {
        var service_id = this.props.location.state && this.props.location.state.service_id;
        if(service_id !== '') {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams()
             params.append('service_id', service_id)
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/service_by_id`,params,config)
            .then (res=>{
                console.log(res);
                if(res.data.status_code === 200) {
                    this.setState({ service_name : res.data.category[0].service_name })
                }
            });
        }
    }
    async get_need_by_id(){
        var need_info = this.props.location.state;
        await this.setState({
            task_name : need_info.name,
            chosen_cat : need_info.parent_category_id,
            chosen_subcat : need_info.subcategory_id,
            chosen_service : need_info.service_id,
            date : need_info.date,
            date_of_service : moment(need_info.date).format(this.state.date_format),
            location1 : need_info.source_location && need_info.source_location,
            source_lat : need_info.source_lat && parseFloat(need_info.source_lat), 
            source_lng : need_info.source_lon && parseFloat(need_info.source_lon), 
            location2 : need_info.dest_location && need_info.dest_location,
            dest_lat : need_info.dest_lat && parseFloat(need_info.dest_lat), 
            dest_lng : need_info.dest_lon && parseFloat(need_info.dest_lon), 
            need_price : need_info.booking_price,
            need_description : need_info.description,
            need_id : need_info.item_id
        })
    }
    
    date_of_service = (date, dateString) =>  {
        this.setState({
            date_of_service : dateString
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
                this.setState({ ex_location_err :  i18next.t('Entered location is not exist!')  });
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
    get_service = (value) => {
        this.setState({ chosen_service : value });
    }
    get_services = (value) => {
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
            if(res.data.status_code === 200) {
                this.setState({ services : res.data.services, chosen_subcat : value, chosen_service : '' });
            }
            else {
                console.log(res.data.message);
            }
        })
    }
    save_need = () => {
        var user_info = JSON.parse(localStorage.getItem('user'));
        var err = 0;
        var before_decimal = 6;
        var after_decimal = 2;
        if(this.state.need_price && this.state.need_price.trim() !== '') {
            var price = this.state.need_price && this.state.need_price;
            var split_price = price.split('.');
        }
        if(!this.state.task_name || (this.state.task_name && this.state.task_name === '')) {
            this.setState({ task_name_err : i18next.t("Task Name is required!") });
            this.task_name.scrollIntoView({ behavior: "smooth" });
            err++;
        }
        else {
            this.setState({ task_name_err : "" });
        }
        if(!this.state.chosen_cat || (this.state.chosen_cat && this.state.chosen_cat === '')) {
            this.setState({ cat_err : i18next.t("Category is required!") });
            this.task_name.scrollIntoView({ behavior: "smooth" });
            err++;
        }
        else {
            this.setState({ cat_err : "" });
        }
        if(!this.state.chosen_subcat || (this.state.chosen_subcat && this.state.chosen_subcat === '')) {
            this.setState({ sub_cat_err : i18next.t("Sub Category is required!") });
            this.task_name.scrollIntoView({ behavior: "smooth" });
            err++;
        }
        else {
            this.setState({ sub_cat_err : "" });
        }
        if(!this.state.chosen_service || (this.state.chosen_service && this.state.chosen_service === '')) {
            this.setState({ service_err : i18next.t("Service is required!") });
            this.task_name.scrollIntoView({ behavior: "smooth" });
            err++;
        }
        else {
            this.setState({ service_err : "" });
        }
        
        if(this.state.category_info && (this.state.category_info.location_type === 'home' || this.state.category_info.location_type === 'transport')) {
            if(!this.state.location1 || (this.state.location1 && this.state.location1 === '')) {
                this.setState({ location1_err : i18next.t('Location is required!')  });
                this.task_name.scrollIntoView({ behavior: "smooth" });
                err++;
            }
            else {
                this.setState({ location1_err : ''  });
            }
        }
        if(this.state.category_info && this.state.category_info.location_type === 'transport') {
            if(!this.state.location2 || (this.state.location2 && this.state.location2 === '')) {
                this.setState({ location2_err : i18next.t('Location is required!')  });
                this.task_name.scrollIntoView({ behavior: "smooth" });
                err++;
            }
            else if((this.state.location2 && this.state.location2) === (this.state.location1 && this.state.location1)) {
                this.setState({ location2_err : i18next.t('Location should be different!')  });
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
                    this.setState({ location2_err : 'Service Exceeds the Limit!'  });
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
        var current_date = new Date();
        var raw_chosen_date = this.state.date_of_service;
        var split_date1 = raw_chosen_date.split('-');
        var arranged_date = split_date1[1]+'-'+split_date1[0]+'-'+split_date1[2];
        var chosen_date = new Date(this.state.date_of_service);
        var arranged_date_men = new Date(arranged_date);

        chosen_date.setHours(0,0,0,0);
        if(!this.state.date_of_service || (this.state.date_of_service && this.state.date_of_service === '')) {
            this.setState({ date_err : i18next.t('Date is required!')  });
            this.task_name.scrollIntoView({ behavior: "smooth" });
            err++;
        }
        else if(arranged_date_men < current_date) {
            this.setState({ date_err : i18next.t('Choose Future Date!')  });
            err++;
        }
        else {
            this.setState({ date_err : ''  });
        }
        if(!this.state.need_description || (this.state.need_description && this.state.need_description === '')) {
            this.setState({ need_description_err : i18next.t("Description is required!") });
            err++;
        }
        else {
            this.setState({ need_description_err : "" });
        }
        var price_in_int = parseFloat(this.state.need_price && this.state.need_price).toFixed(2);
        if(!this.state.need_price || (this.state.need_price && this.state.need_price === '')) {
            this.setState({ need_price_err : i18next.t("Price is required!") });
            err++;
        }
        else if (split_price[0] && split_price[0].length > before_decimal) {
            this.setState({ need_price_err : i18next.t('Valid format is (123456.12)') });
            err++;
        }
        else if (split_price[1] && split_price[1].length > after_decimal) {
            this.setState({ need_price_err : i18next.t('Valid format is (123456.12)') });
            err++;
        }
        else if(price_in_int < parseFloat(this.state.general_info.minimum_payment_price)) {
            var min_err = this.state.general_info && this.state.general_info.currency_symbol+' '+this.state.general_info.minimum_payment_price+' '+i18next.t('is Minimum Value of service');
            this.setState({ need_price_err : min_err });
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
            var need_date = this.state.date_of_service && this.state.date_of_service;
            console.log('need_date',need_date);
            var split_date = need_date.split('-');
            var aligned_date = split_date[1]+'/'+split_date[0]+'/'+split_date[2];
            const params = new URLSearchParams()
            params.append('need_id', this.state.need_id && this.state.need_id)
            params.append('date', aligned_date)
            params.append('parent_category_id', this.state.category_info && this.state.category_info.parent_category_id)
            params.append('subcategory_id', this.state.chosen_subcat && this.state.chosen_subcat)
            params.append('user_id', user_info.user_id)
            params.append('price', this.state.need_price)
            params.append('service_id', this.state.chosen_service)
            params.append('description', this.state.need_description)
            params.append('location_type', this.state.category_info && this.state.category_info.location_type)
            params.append('name', this.state.task_name ? this.state.task_name : '')

            // LexOne: edit-need uses the placeholder office address. See lexOnePlaceholder.js.
            params.append('source_location', PLACEHOLDER_OFFICE_ADDRESS)
            params.append('source_lat', PLACEHOLDER_OFFICE_LAT)
            params.append('source_lon', PLACEHOLDER_OFFICE_LON);
            if(this.state.category_info && this.state.category_info.location_type === 'transport') {
                params.append('dest_location', PLACEHOLDER_OFFICE_ADDRESS)
                params.append('dest_lat', PLACEHOLDER_OFFICE_LAT)
                params.append('dest_lon', PLACEHOLDER_OFFICE_LON)
            }
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/addneed`,
            params,config)
            .then(res => {
                console.log(res);
                if(res.status === 200) {
                    if(res.data.status_code === 200){
                        Toast.fire({
                            icon: 'success',
                            title: i18next.t('Need Updated Successfully!')
                        });
                        var obj = {};
                        obj.need_id = res.data.item_id;
                        this.props.history.push('/user/my-needs',obj);

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
                            title: i18next.t("Something Went Wrong, Try Again")
                        });
                    }
                }
            })
        }

    }
    isNumber = (e) => {
        var rgx = /^[0-9]*\.?[0-9]*$/;
        // alert(e.target.value+' | '+e.target.value.length);
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
    cancel_booking = () => {
        var user_info = JSON.parse(localStorage.getItem('user'));
        Swal.fire({
            title: i18next.t('Are you sure?'),
            text: i18next.t("You want to Delete your Need!"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                var user_id = user_info.user_id;
                var booking_id = this.props.location && this.props.location.state.item_id;
                const config = {
                    headers : {
                        'Content-type' : 'application/x-www-form-urlencoded'
                    }
                }
                const params = new URLSearchParams();
                params.append('user_id',user_id);
                params.append('booking_id',booking_id);
                params.append('status','cancelled');
                axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/bookingstatus`,params,config)
                .then(res => {
                    console.log(res);
                    if(res.data.status_code === 200)
                    {
                        Swal.fire(
                            'Deleted',
                            res.data.message,
                            'success'
                        )
                        this.props.history.push('/user/my-needs');
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
                            title: i18next.t("Something Went Wrong, Try Again")
                        });
                    }
                })
                
            }
        })
    }
    disabledDate = (current) => {
        return moment() >= current || moment().add(1, 'month')  <= current;
    }
    trigger_location_autocomplete = () => {
        // alert('autohi');
        this.autocomplete(document.getElementById("manual_location1"), this.state.general_info.cities);
        var el = document.getElementById('manual_location1');
        el.dispatchEvent(new Event('input'));
    }
    autocomplete(inp, arr) {
        // alert('hi');
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
    get_to_back = () => {
        this.props.history.goBack();
    }
    render() {
        const picker_date = this.state.date_of_service ? this.state.date_of_service : '01-01-1993';
        const picker_format = this.state.date_format && this.state.date_format;
        return (
            <React.Fragment>

                <div className="container">
                    <div className="pt-5">
                        
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 class="fM" ref={(el) => {  this.task_name = el; }}>{ i18next.t("Edit a Task") }</h4>
                            <div className="d-flex p-3 align-items-center hover-cont" onClick={ this.get_to_back }> 
                                <ArrowLeftOutlined  />
                                &nbsp;
                                <span>{ i18next.t("Back") } </span>
                            </div>
                        </div>

                        {/* <div className="pl-0 pl-md-5"> */}
                        <div>
                            <p className="my-4 fM">{ i18next.t("Describe Your Task") } </p>

                            <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 px-0">
                                <div className="">
                                    <p className="mb-2">{ i18next.t("Task Name") } </p>
                                    <div className="mb-3">
                                        <Input size="large" maxLength="60" placeholder={ i18next.t("Enter task Name") } onChange={ (e)=>{ this.setState( { task_name : e.target.value }) } } value={ this.state.task_name }/>
                                        <p className="text-danger">{ this.state.task_name_err }</p>
                                    </div>

                                    <p className="mb-2" ref={(input) => { this.category_id = input; }}>{ i18next.t("Select Category") } </p>
                                    <div className="mb-3">
                                
                                        <Input size="large" readOnly value={ this.state.category_name }/>
                                        <p className="text-danger">{ this.state.cat_err }</p>
                                    </div>
                                    <p className="mb-2" ref={(input) => { this.sub_category_id = input; }}>{ i18next.t("Select Sub Category") } </p>
                                    <div className="mb-3">
                                    <Input size="large" readOnly value={ this.state.subcategory_name }/>
                                        <p className="text-danger">{ this.state.sub_cat_err }</p>

                                    </div>
                                    <p className="mb-2" ref={(input) => { this.service_id = input; }}>{ i18next.t("Select Service") }</p>
                                    <div className="mb-3">
                                    <Input size="large" readOnly value={ this.state.service_name }/>
                                        <p className="text-danger">{ this.state.service_err }</p>
                                    </div>
                                </div>

                                <div className=" mt-4">
                                    <p className="mb-2" ref={(input) => { this.service_date = input; }}>{ i18next.t("Say Where & When") } </p>
                                    <div className="mb-3">
                                        <DatePicker inputReadOnly={true} disabledDate={this.disabledDate} defaultValue={moment(picker_date, picker_format)} onChange={this.date_of_service} format={this.state.date_format} size="large" placeholder={ i18next.t("Choose your date") } />
                                        <p className="text-danger">{ this.state.date_err }</p>
                                    </div>
                                    {/* LexOne: client no longer enters an address — wrapper hidden, payload uses placeholder. */}
                                    <div ref={(input) => { this.location1 = input; }} style={{ display: 'none' }}>
                                    {
                                                this.state.category_info &&
                                                (this.state.category_info.location_type === 'transport' ||  this.state.category_info.location_type === 'home') &&
                                                    <div className="mb-3">
                                                    <Input size="large"  onChange={(e) => this.setState({location1 : e.target.value})} onMouseDown={(e)=> { if(this.state.general_info && this.state.general_info.instant_location === "true" && this.state.source_lat) { this.setState({ position : { lat : this.state.source_lat,lng : this.state.source_lng, } }) } this.setState({ manual_location : this.state.location1,show_hide_map : true, is_location_ModalVisible : true, location_input_id : 1 }) }} value={ this.state.location1 && this.state.location1 } autoComplete="off" addonBefore={<div className="locationIcon"></div>} placeholder={ this.state.category_info && this.state.category_info.location_type === 'transport' ? i18next.t("Enter Pickup Location") : i18next.t("Enter Location") } readOnly />
                                                    <p className="text-danger">{this.state.location1_err}</p>
                                                    </div>
                                            }
                                            {
                                                this.state.category_info &&
                                                (this.state.category_info.location_type === 'transport') &&
                                                <div className="mb-3">
                                                    <Input size="large"  onChange={(e) => this.setState({location2 : e.target.value})} value={ this.state.location2 && this.state.location2 } autoComplete="off" onMouseDown={(e)=> { if(this.state.general_info && this.state.general_info.instant_location === "true" && this.state.dest_lat) { this.setState({ position : { lat : this.state.dest_lat,lng : this.state.dest_lng, } }) } this.setState({ manual_location : this.state.location2,show_hide_map : true,is_location_ModalVisible : true, location_input_id : 2 }) }} addonBefore={<div className="DroplocationIcon"></div>} placeholder={ this.state.category_info && this.state.category_info.location_type === 'transport' ? i18next.t("Enter Drop Location") : i18next.t("Enter Location") } readOnly />
                                                    <p className="text-danger">{this.state.location2_err}</p>
                                                </div>
                                            }
                                    </div>
                                </div>

                                {/*  */}


                                <section className="col-12 px-0">
                                    <p class="mb-2">{ i18next.t("Price") } </p>
                                    <Input inputMode="decimal" size="large" addonBefore={<div className="">{this.state.general_info && this.state.general_info.currency_symbol }</div>} placeholder={ 
                            this.state.general_info && i18next.t("Minimum price is")+" "+this.state.general_info.currency_symbol+" "+this.state.general_info.minimum_payment_price } onChange={ this.isNumber } value={ this.state.need_price && this.state.need_price }/>
                                    <p className="text-danger">{ this.state.need_price_err }</p>
                                </section>
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
                                        <div className="col-6 col-lg-4 pr-0">
                                            <Button size="large" onClick={ this.cancel_booking } className="SecoundaryBtn lg fM  none" block>Delete</Button>
                                        </div>
                                        <div className="col-6 col-lg-4  align-self-center pl-sm-2">
                                                <Button onClick={ this.save_need } size="large" className="Btns PrimaryBtn lg fM mb-2 mb-sm-0" block>Post</Button>
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
                                    
                                        <input type="text" id="manual_location1" placeholder=" " onChange={(e) => this.setState({ manual_location : e.target.value})} onMouseEnter={ (e)=>{ e.stopPropagation(); this.trigger_location_autocomplete(); }  } autoComplete="off" value={this.state.manual_location} />
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

export default connect(mapStateToProps,null,null,{forwardRef:true})(EditNeed);