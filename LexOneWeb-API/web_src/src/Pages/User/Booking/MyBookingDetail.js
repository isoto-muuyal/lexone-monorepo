import React, { Component } from 'react';
import { Input, Button, Modal, Rate, Tooltip } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Breadcremb from '../../../components/BreadCremb';
import axios from 'axios';
import Swal from 'sweetalert2';
import MetaDecorator from '../../../components/MetaDecorator';  
import Loader from "react-loader-spinner";
import socketIOClient from 'socket.io-client';
import i18next from 'i18next';

const socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);

const { TextArea } = Input;
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
class MyBookingDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: this.props.rating || 0,
            temp_rating: 0,
            visible: false,
            visible1: false,
            onlyNumber: '',
            review_description : '',
            review_description_err : '',
            is_loading : true
        }
        this.handleRate = this.handleRate.bind(this);
    }
    componentDidMount = () => {
        this.get_booking_by_id();
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../../assets/images/default_service_image.png");
    }
    tasker_image_err = (ev) => {
        ev.target.src = require("../../../assets/images/default_user_image_rectangle.png");
    }
    payreward = () => {
        let reward_amount = this.state.onlyNumber;
        var err = 0;
        if(reward_amount === '') {
            this.setState({ tip_err : 'Amount is required!' });
            err++;
        }
        else if(parseFloat(reward_amount) < parseFloat(this.state.general_info.minimum_payment_price)) {
            var min_err = i18next.t('Book Service more than minimum amount')+' '+this.state.general_info.currency_symbol+' '+this.state.general_info.minimum_payment_price+'!';
            this.setState({ tip_err : min_err });
            err++;
        }
        else {
            this.setState({ tip_err : '' });
        }
        if(err === 0) {
            let user_id = this.state.user_info && this.state.user_info.user_id;
            let booking_id = this.props.location && this.props.location.state.booking_id;
            let currency_code = this.state.general_info && this.state.general_info.currency_code;

            const config = {
                headers : {
                    'Content-type' : 'application/x-www-form-urlencoded'
                }
            }
                    
            const params = new URLSearchParams();
            params.append('user_id',user_id);
            params.append('amount',reward_amount);
            params.append('booking_id',booking_id);
            params.append('currency',currency_code);
            
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/createrewardPaylink`,params,config)
            .then(res => {
                if( res.data.status_code === 200 ){
                    window.location.href = res.data.url;
                }
                else if(res.data.status_code === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    this.props.history.push('/');
                    window.location.reload(false);
                }
                else if(res.data.status_code === 400) {
                    Toast.fire({
                        icon: 'warning',
                        title: res.data.message
                    });
                    window.location.reload(false);
                }
            }); 
        }
        
    }
    get_booking_by_id = () => {
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        var booking_id = '';
        var user_info = JSON.parse(localStorage.getItem('user'));
        if(this.props.location.state === undefined) {
            this.props.history.push("/user/my-booking");
        }
        else {
            booking_id = this.props.location.state.booking_id;
        }
        this.setState({ initial_state : this.props.location.state, general_info : general_info,user_info : user_info })
        if(booking_id !==  '') {
            axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/bookingdetails/${booking_id}`)
            .then(res => {
                if(res.data.status_code === 200)
                {
                    
                    var booking_details = res.data;
                    var raw_date =res.data.date;
                    let date = new Date(raw_date);

                    let formatted_date =date.getDate() + "/"+ parseInt(date.getMonth()+1) +"/"+date.getFullYear();
                    booking_details.formatted_date = formatted_date;
                    this.setState({ booking_details : booking_details,is_loading : false },()=>{
                        if(booking_details.review.status === 'true') {
                            var pre_rate = parseFloat(booking_details.review.rating);
                            var pre_review = booking_details.review.review_description;
                            this.setState({ rating : pre_rate, review_description : pre_review })
                        }
                    });
                }
                else if(res.data.status_code === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    this.props.history.push('/');
                    window.location.reload(false);
                }
            });
        }
    }
    cancel_booking = () => {
        Swal.fire({
            title: i18next.t('Are you sure?'),
            text: i18next.t("You want to Cancel this Booking!"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                var user_id = this.state.user_info && this.state.user_info.user_id;
                var booking_id = this.props.location && this.props.location.state.booking_id;
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
                    if(res.data.status_code === 200)
                    {
                        Swal.fire(
                            'Cancelled',
                            res.data.message,
                            'success'
                        )
                        var booking_details = this.state.booking_details && this.state.booking_details;
                        booking_details.booking_status = 'cancelled';
                        this.setState({
                            booking_details : booking_details
                        })
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
                            title: res.data.message
                        });
                    }
                })
                
            }
        })
    }
    showReviewModal = () => {
        this.setState({
            visible: true,
        });
    };
    showRewardModal = () => {
        this.setState({
            visible1: true,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
            visible1: false,
        });

    };

    handleMouseover(rating) {
        this.setState((prev) => ({
            rating,
            temp_rating: prev.rating
        }));
    }

    handleMouseout() {
        this.setState((prev) => ({
            rating: prev.temp_rating
        }));
    }
    createPaylink = () => {
        let booking_id = this.state.initial_state && this.state.initial_state.booking_id;
        let unit_amount = this.state.booking_details && this.state.booking_details.total;
        let user_id = this.state.user_info && this.state.user_info.user_id;
        let currency_code = this.state.general_info && this.state.general_info.currency_code;
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        const params = new URLSearchParams()
        params.append('booking_id', booking_id);
        params.append('amount', unit_amount);
        params.append('user_id',user_id);
        params.append('currency', currency_code);
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/createpaylink`, 
        params,config)
        .then(res => {
            if(res.data.status_code === 200){
                if(res.data.url){
                    window.location.href = res.data.url;
                }
            }
        });
    }
    handleRate(rating) {
        this.setState({
            rating : rating
        })
    }
    get_chats = (chat_id) => {
        var obj = {};
        obj.chat_id = chat_id;
        this.props.history.push('/chat', obj);
    }
    update_review = () => {
        var err = 0;
        if(this.state.review_description === '') {
            this.setState({ review_description_err : i18next.t("Description is required!") });
            err++;
        }
        else {
            this.setState({ review_description_err : "" });
        }
        if(err === 0) {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams()
            params.append('user_id', this.state.user_info && this.state.user_info.user_id)
            params.append('booking_id', this.props.location.state && this.props.location.state.booking_id)
            params.append('rating', this.state.rating && this.state.rating)
            params.append('description', this.state.review_description && this.state.review_description)

            if(this.state.booking_details && this.state.booking_details.review.status === 'true') {
                params.append('review_id', this.state.booking_details && this.state.booking_details.review.review_id)

            }

            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/postreview`,params,config)
            .then (res=>{ 
                if(res.data.status_code === 200) {
                    Toast.fire({
                        icon: 'success',
                        title: res.data.message
                    });
                    var booking_details = this.state.booking_details && this.state.booking_details;
                    if(booking_details.review.status === "false") {
                        booking_details.review.status = "true";
                        booking_details.review.review_id = res.data.review_id;
                        booking_details.review.message = res.data.message;
                        this.setState({ 
                            visible : false,
                            booking_details : booking_details
                        });
                    }
                    if(booking_details.review.status === "true") {
                        booking_details.review.status = "true";
                        booking_details.review.review_id = this.state.booking_details && this.state.booking_details.review.review_id;
                        booking_details.review.message = res.data.message;
                        this.setState({ 
                            visible : false,
                            booking_details : booking_details
                        });
                    }
                    
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
                        title: res.data.message
                    });
                }
            })

        }
    }
    get_to_tasker_view = (id) => {
        
        this.props.history.push('/user/tasker-view/'+id);
    }
    get_pro_chat = () =>{
        var booking_details = this.state.booking_details && this.state.booking_details;
        if(booking_details.chat_id === '') {
            var user_info = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const params1 = new URLSearchParams()
            params1.append('user_id', user_info.user_id)
            params1.append('booking_id', this.state.initial_state && this.state.initial_state.booking_id)
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/createchat`, 
            params1,config)
            .then(res1=>{
                if(res1.data.status_code === 200) {
                    this.get_chats(res1.data.chat_id);
                    booking_details.chat_id = res1.data.chat_id;
                    this.setState({
                        booking_details : booking_details
                    })
                }
                else if(res1.data.status_code === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    this.props.history.push('/');
                    window.location.reload(false);
                }
            });
        }
        else {
            this.get_chats(booking_details.chat_id);
        }
        
    }
    isNumber = (e) => {
        var rgx = /^[0-9]*\.?[0-9]*$/;
        var split_price = e.target.value.split('.');
        if (rgx.test(e.target.value)) {
            if( (split_price[0] && split_price[0].length !== undefined && split_price[0].length <= 6) ) {
                if(!split_price[1]) {
                    this.setState({onlyNumber: e.target.value})
                }
                else {
                    if( (split_price[1] && split_price[1].length !== undefined && split_price[1].length <= 2) ) {
                        this.setState({onlyNumber: e.target.value})
                    }
                }
                
            }
        }
        if(e.target.value.length === 0) {
            this.setState({onlyNumber: e.target.value})
        }
    }
    get_to_tracker = () => {
        socket.disconnect();
        var booking_details = this.state.booking_details && this.state.booking_details;
        this.props.history.push('/user/my-booking/tracker',booking_details); 
    }
    get_to_bookings = () => {
        var obj = {};
        obj.status_of_booking = this.state.booking_details &&
        this.state.booking_details.booking_status;
        this.props.history.push('/user/my-booking',obj);
    }
    render() {
        let stars = [];
        for (let i = 0; i < 5; i++) {
            let klass = "starBorder";
            if (this.state.rating >= i && this.state.rating !== null) {
                klass = "starFill";
            }
            stars.push(
                <span
                    style={{
                        display: "inline-block",
                        overflow: "hidden",
                        marginRight: "7px",
                        cursor: "pointer",
                        direction: i % 2 === 0 ? "ltr" : "rtl"
                    }}
                    className={klass}
                    onMouseOver={() => this.handleMouseover(i)}
                    onClick={() => this.rate(i)}
                    onMouseOut={() => this.handleMouseout()}
                />
            );
        }
        
        return (
            <React.Fragment>
            <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title='| User Booking View' description="IDemand Booking Details"/>
                {
                    this.state.is_loading === true ?
                    <div>
                        <Loader
                            type="ThreeDots"
                            color="#0313FC"
                            height={100}
                            width={100}
                        />
                    </div>
                    :
                    <div className="container">

                        <div className="pt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Breadcremb flag="others" bredcrumb1={ this.state.booking_details && this.state.booking_details.parent_category_name } bredcrumb2={ this.state.booking_details && this.state.booking_details.subcategory_name } bredcrumb1_link={this.state.booking_details && `/user/sub-categories/${this.state.booking_details.parent_category_id}`}  bredcrumb2_link={this.state.booking_details && this.state.booking_details.booking_type === 'marketplace' ? `/user/marketplace-view/${this.state.booking_details.parent_category_id && this.state.booking_details.parent_category_id}/${this.state.booking_details.subcategory_id && this.state.booking_details.subcategory_id}` : `/user/professional-view/${this.state.booking_details.parent_category_id && this.state.booking_details.parent_category_id}/${this.state.booking_details.subcategory_id && this.state.booking_details.subcategory_id}` }/>
                                <div className="d-flex align-items-center hover-cont" onClick={ this.get_to_bookings }> 
                                    <ArrowLeftOutlined  />
                                    &nbsp;
                                    <span>{ i18next.t("Back") } </span>
                                </div>
                            </div>
                            <div className="cardTwoStyle cursorPointer">
                                    <div className="row" onClick={ (e)=>{ e.stopPropagation(); this.get_to_tasker_view(this.state.booking_details && this.state.booking_details.tasker.id) } }>
                                        <div className="col-sm-9 col-md-10">
                                            <div className="row">
                                                <div className="col-sm-4 col-lg-3">
                                                    <img alt="" onError={ this.tasker_image_err } className="rounded imgBg" src={ this.state.booking_details && this.state.booking_details.tasker.image } height={100} />
                                                </div>
                                                <div className="col-sm-8 col-lg-9">
                                                    <div className="detailsSection mt-3 mt-sm-0">
                                                        <div className="fM text-truncate">
                                                        { this.state.booking_details && this.state.booking_details.tasker.name } 
                                                    </div>


                                                        <div className="detailsThree my-2">
                                                            <span className="greenStar" />
                                                            <div className="align-self-center"><span className="greenTxtClr fM">{ this.state.booking_details && this.state.booking_details.tasker.rating } </span> ( { this.state.booking_details && this.state.booking_details.tasker.reviews } Reviews )</div>
                                                        </div>
                                                        <p className="mb-2 font-sm">{ this.state.booking_details && this.state.booking_details.tasker.completed_tasks } Jobs</p>
                                                        <p className="mb-2 font-sm">ID: <span># { this.state.booking_details && this.state.booking_details.reference_id.toUpperCase() }</span></p>
                                                        <p className="mb-0 d-flex align-items-center font-sm"><span className="phoneIcon d-block mr-2" />{ this.state.booking_details && this.state.booking_details.tasker.phone }</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-sm-3 col-md-2">
                                            <div className="mt-3 mt-lg-0 text-md-right">
                                                <div className="detailsSection overflow-hidden mb-lg-2">
                                                    <div className="detailsSix text-truncate mb-2">
                                                        <span> { this.state.general_info && this.state.general_info.currency_symbol } { this.state.booking_details && this.state.booking_details.price }</span>
                                                    </div>         

                                                    { this.state.booking_details && this.state.booking_details.booking_status === "requested" && 
                                                        <h5 className="mb-0 fM greenTxtClr">
                                                            { i18next.t("Payment Pending") }
                                                        </h5>
                                                    }
                                                    { this.state.booking_details && this.state.booking_details.booking_status === "paid" && 
                                                        <h5 className="mb-0 fM greenTxtClr">
                                                            { i18next.t("Paid") }
                                                        </h5>
                                                    }
                                                    { this.state.booking_details && this.state.booking_details.booking_status === "accepted" && 
                                                        <h5 className="mb-0 fM greenTxtClr">
                                                            { i18next.t("Accepted") }
                                                        </h5>
                                                    }
                                                    { this.state.booking_details && this.state.booking_details.booking_status === "cancelled" && 
                                                        <h5 className="mb-0 fM redTxtClr">
                                                            { i18next.t("Cancelled") }
                                                        </h5>
                                                    }
                                                    { this.state.booking_details && this.state.booking_details.booking_status === "started" && 
                                                        <h5 className="mb-0 fM orangeTxtClr">
                                                            { i18next.t("In-Progress") }
                                                        </h5>
                                                    }
                                                    { this.state.booking_details && this.state.booking_details.booking_status === "completed" && 
                                                        <h5 className="mb-0 fM greenTxtClr">
                                                            { i18next.t("Completed") }
                                                        </h5>
                                                    }
                                                    { this.state.booking_details && this.state.booking_details.booking_status === "refunded" && 
                                                        <h5 className="mb-0 fM redTxtClr">
                                                            { i18next.t("Refunded") }
                                                        </h5>
                                                    }
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="col-12 px-0 mb-4">
                                        <div className="mb-2 fM d-flex">
                                            <span>{ i18next.t("Where & When") } </span>
                                        {
                                            this.state.booking_details &&
                                            this.state.booking_details.booking_status === 'started' && this.state.booking_details.booking_status !== 'completed' &&
                                            this.state.general_info && this.state.general_info.instant_location === 'true' &&
                                            this.state.booking_details && (this.state.booking_details.location_type === 'transport' || this.state.booking_details.location_type === 'home') &&
                                                <span class="ml-auto cursorPointer">
                                                    <Tooltip placement="topLeft" title="You Can Track your Booking Here">    
                                                        <img alt="pin_ico" style = {{ height : "30px" }}  src={ require('../../../assets/icons/pin_icon.png') } onClick={ this.get_to_tracker } />
                                                    </Tooltip>
                                                </span>
                                        }    
                                            
                                        </div>
                                        <div className="mb-3">
                                            <div className="coloredAntLookAlike  mb-3"><div className="likeInput calendarIcon"></div>{ this.state.booking_details && this.state.booking_details.formatted_date }</div>
                                        </div>
                                        <div className="">
                                        {
                                        this.state.booking_details &&
                                        (this.state.booking_details.location_type === 'transport' ||  this.state.booking_details.location_type === 'home') &&
                                            <div className="coloredAntLookAlike  mb-3"><div className="likeInput mapIcon"></div>{ this.state.booking_details && this.state.booking_details.source_location }.</div>
                                        }
                                        </div>
                                        <div className="">
                                        {
                                        this.state.booking_details &&
                                        (this.state.booking_details.location_type === 'transport') &&
                                            <div className="coloredAntLookAlike  mb-3"><div className="likeInput DroplocationIcon"></div>{ this.state.booking_details && this.state.booking_details.dest_location }.</div>
                                        }
                                        </div>
                                    </div>

                                    <div className="col-12 px-0 mb-4">
                                        {/* <p className="mb-3 fM">{ this.state.booking_details && this.state.booking_details.services[0].service_pricing } </p> */}
                                        <section>
                                        { this.state.booking_details && 
                                        this.state.booking_details.services.map((i,k)=> (
                                            <div key={k} className="d-flex jusity-content-between flex-wrap border-bottom py-2">
                                                <div className="d-flex flex-fill align-items-center">
                                                    <div className="mr-3">
                                                        <img onError={this.service_image_err} src={i.service_image} alt="" className="imgBg profile-sm" />
                                                    </div>
                                                    <div className="">
                                                        <p className="mb-1">{i.service_name}</p>
                                                        <p className="mb-0 fM">{ this.state.general_info && this.state.general_info.currency_symbol } <span>{i.service_price}</span> X <span>{ i.service_quantity } </span><span> / { i.service_pricing }</span></p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center flex-fill justify-content-end"><p className="mb-0 fM font-lg white-nowrap">{ this.state.general_info && this.state.general_info.currency_symbol } { parseFloat(i.service_price * i.service_quantity).toFixed(2) }</p></div>
                                            </div>
                                        ))
                                        
                                        }
                                            
                                        </section>

                                    </div>

                                    <div className="col-12 px-0 mb-5">
                                        <p className="mb-3 fM">Description</p>
                                        <TextArea value={ this.state.booking_details && this.state.booking_details.description } readOnly={true}
                                            placeholder="Enter your details of your task"
                                            autosize={{ minRows: 4, maxRows: 5 }}
                                        />
                                    </div>
                                    <div className="col-12 px-0 mb-5">
                                        <div className="d-flex justify-content-between border p-3 rounded">
                                            <h5 className="mb-0 fM">OTP</h5>
                                            <h5 className="mb-0 greenTxtClr fM">{ this.state.booking_details && this.state.booking_details.otp }</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <section className="paymentBox">
                                    <h5 className="title">{ i18next.t("Payment Summary") }</h5>
                                    <div className="content">
                                        <div className="row align-items-center" >
                                            <p className="col-8">
                                                <div className="text-truncate fM">
                                                { i18next.t("Booking Amount + IVA") }</div>
                                            </p><p className="col-4">
                                                <div className="text-right fM">
                                                    { this.state.general_info && this.state.general_info.currency_symbol } 
                                                   
                                                    { 
                                                            (parseFloat(this.state.booking_details.price) + 
                                                            parseFloat(this.state.booking_details.tax)).toFixed(2) 
                                                        }
                                                    </div>
                                            </p>
                                            <p className="col-8">
                                                <div className="text-truncate fM"> { i18next.t("Commission") }</div>
                                            </p>
                                            <p className="col-4">
                                                <div className="text-right fM"> { this.state.general_info && this.state.general_info.currency_symbol } { this.state.booking_details && this.state.booking_details.commission } </div>
                                            </p>
                                            
                                            {/* <p className="col-8 mb-0">
                                                <div className="text-truncate fM"> { i18next.t("Tax") }</div>
                                            </p><p className="col-4 mb-0">
                                                <div className="text-right fM"> { this.state.general_info && this.state.general_info.currency_symbol } { this.state.booking_details && this.state.booking_details.tax } </div>
                                            </p> */}
                                            </div>
                                            <hr/>
                                        <div className="row"><p className="col-8 mb-0"><div className="text-truncate fM">{ i18next.t("Amount to be paid") }</div></p><p className="col-4 mb-0"> <div className="text-right fM font-lg">{ this.state.general_info && this.state.general_info.currency_symbol } { this.state.booking_details && this.state.booking_details.total } </div>  </p></div>

                                        {
                                            this.state.booking_details && this.state.booking_details.reward.status === "true" &&
                                            <div className="row"><p className="col-8 mb-0"><div className="text-truncate fM">Tips</div></p><p className="col-4 mb-0"> <div className="text-right fM font-lg">{ this.state.general_info && this.state.general_info.currency_symbol } { this.state.booking_details && this.state.booking_details.reward.amount } </div>  </p></div>
                                        }
                                    </div>

                                    </section>
                                    {
                                        this.state.booking_details && this.state.booking_details.booking_type === 'professional' && 
                                        
                                        <>
                                        {
                                            this.state.booking_details.booking_status === 'requested' ?
                                        
                                            <div className="row mt-5">
                                                <div className="col-6">
                                                    <Button size="large" className="SecoundaryBtn lg fM" onClick={this.cancel_booking} block>{ i18next.t("Cancel") }</Button>
                                                </div>
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={this.createPaylink} block>{ i18next.t("Pay") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details.booking_status === 'paid' ?
                                            <div className="row mt-5">
                                                <div className="col-6">
                                                    <Button size="large" className="SecoundaryBtn lg fM" onClick={this.cancel_booking} block>{ i18next.t("Cancel") }</Button>
                                                </div>
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={this.get_pro_chat} block>{ i18next.t("Chat") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details.booking_status === 'started' ?
                                            <div className="row mt-5">
                                                
                                                <div className="col-12 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={this.get_pro_chat} block>{ i18next.t("Chat") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details.booking_status === 'completed' &&
                                            <div className="row mt-5">
                                                <div className={this.state.booking_details.reward.status !== "true" && this.state.booking_details.settlement && this.state.booking_details.settlement !== "true" ? "col-6" : "col-12" } >
                                                    <Button size="large" className="SecoundaryBtn lg fM" onClick={this.showReviewModal} block>{ this.state.booking_details && (this.state.booking_details.review.status === 'false') ? i18next.t("Review") : i18next.t("Edit Review") }</Button>
                                                </div>
                                                {
                                                this.state.booking_details.reward.status !== "true" && this.state.booking_details.settlement && this.state.booking_details.settlement !== "true" &&
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0 btn_cont" onClick={this.showRewardModal} block>{ i18next.t("Reward Tips") }</Button>
                                                </div>
                                                }
                                            </div>
                                        }
                                        </>
                                    }
                                    {
                                        this.state.booking_details && this.state.booking_details.booking_type === 'marketplace' &&
                                        <>
                                        {
                                            this.state.booking_details.booking_status === 'requested' ?
                                        
                                            <div className="row mt-5">
                                                <div className="col-6">
                                                    <Button size="large" className="SecoundaryBtn lg fM" onClick={this.cancel_booking} block>{ i18next.t("Cancel") }</Button>
                                                </div>
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details.booking_status === 'accepted' ?
                                            <div className="row mt-5">
                                                <div className="col-6">
                                                    <Button size="large" className="SecoundaryBtn lg fM" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } }block>{ i18next.t("Chat") }</Button>
                                                </div>
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={this.createPaylink} block>{ i18next.t("Pay") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details.booking_status === 'paid' ?
                                            <div className="row mt-5">
                                                
                                                <div className="col-12 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details.booking_status === 'started' ?
                                            <div className="row mt-5">
                                                
                                                <div className="col-12 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details.booking_status === 'completed' &&
                                            <div className="row mt-5">
                                                <div className={this.state.booking_details.reward.status !== "true" && this.state.booking_details.settlement && this.state.booking_details.settlement !== "true" ? "col-6" : "col-12" } >
                                                    <Button size="large" className="SecoundaryBtn lg fM" onClick={this.showReviewModal} block>{ this.state.booking_details && (this.state.booking_details.review.status === 'false') ? i18next.t("Review") : i18next.t("Edit Review") }</Button>
                                                </div>
                                                {
                                                this.state.booking_details.reward.status !== "true" && this.state.booking_details.settlement && this.state.booking_details.settlement !== "true" && 
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0 btn_cont" onClick={this.showRewardModal} block>{ i18next.t("Reward Tips") }</Button>
                                                </div>
                                                }
                                            </div>
                                        }
                                        </>

                                        
                                    }
                                    {
                                        this.state.booking_details && this.state.booking_details.booking_type === 'userneeds' &&
                                        <>
                                        {
                                            
                                            this.state.booking_details.booking_status === 'accepted' ?
                                            <div className="row mt-5">
                                                <div className="col-6">
                                                    <Button size="large" className="SecoundaryBtn lg fM" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } }block>{ i18next.t("Chat") }</Button>
                                                </div>
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={this.createPaylink} block>{ i18next.t("Pay") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details.booking_status === 'paid' ?
                                            <div className="row mt-5">
                                                
                                                <div className="col-12 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details.booking_status === 'started' ?
                                            <div className="row mt-5">
                                                
                                                <div className="col-12 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details.booking_status === 'completed' &&
                                            <div className="row mt-5">
                                                <div className={ this.state.booking_details.reward.status !== "true" && this.state.booking_details.settlement && this.state.booking_details.settlement !== "true" ? "col-6" : "col-12" }>
                                                    <Button size="large" className="SecoundaryBtn lg fM" onClick={this.showReviewModal} block>{ this.state.booking_details && (this.state.booking_details.review.status === 'false') ? i18next.t("Review") : i18next.t("Edit Review") }</Button>
                                                </div>
                                                {
                                                this.state.booking_details.reward.status !== "true" && this.state.booking_details.settlement && this.state.booking_details.settlement !== "true" &&
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0 btn_cont" onClick={this.showRewardModal} block>{ i18next.t("Reward Tips") }</Button>
                                                </div>
                                                }   
                                            </div>
                                        }
                                        </>

                                        
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                }
                
                <Modal className="reviewModal"
                    centered
                    footer={null}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}>
                    <h3 className="pb-3 fM"> { i18next.t("Rate & Review") }</h3>
                    <div className="d-flex mb-4">
                        <div className="pl-0 pr-3 mt-1">
                            <img className="profile-sm imgBg" src={ this.state.booking_details && (this.state.booking_details.tasker !== undefined) && this.state.booking_details.tasker.image } height={35} width={55} alt="" />
                        </div>
                        <div className="pr-3">
                            <div className="details">
                                <div className="detailOne fM">{ this.state.booking_details && (this.state.booking_details.tasker !== undefined) && this.state.booking_details.tasker.name  }</div>
                                <div className="d-flex align-items-center">

                                    <div className="detailTwo font-sm">{ i18next.t("Your Review will be Public on this Task.") }</div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div className="rating"><Rate allowHalf onChange={this.handleRate} value={ this.state.rating && parseFloat(this.state.rating) } /></div>
                        <div className="lightTxtClr font-sm">{ i18next.t("Rate") } <span>{this.state.rating}</span> { i18next.t("Out Of") } <span>5</span></div>
                    </div>
                    <textarea className="w-100 border p-2 my-4" rows="3" maxLength={500} placeholder="Type here" onChange={ (e)=> { e.stopPropagation(); this.setState({  review_description : e.target.value }) } } value={ this.state.review_description && this.state.review_description }></textarea>
                    <p className="text-danger">{ this.state.review_description_err }</p>
                    <div className="d-flex justify-content-end">
                        <button className="btn PrimaryBtn lg" onClick={ this.update_review } type="button">{ i18next.t("Post") }</button>
                    </div>
                </Modal>
                <Modal className="rewardModal"
                    centered
                    footer={null}
                    visible={this.state.visible1}
                    onCancel={this.handleCancel}>
                    <h3 className="pb-3 fM"> { i18next.t("Reward to tasker") }</h3>

                    <div className="d-flex mb-4">
                        <div className="pl-0 pr-3 mt-1">
                            <img className="profile-sm imgBg" src={ this.state.booking_details && this.state.booking_details.tasker.image } height={45} width={65} alt="" />
                        </div>
                        <div className="pr-3">
                            <div className="details">
                                <div className="detailOne fM">{ this.state.booking_details && this.state.booking_details.tasker.name }</div>
                                <div className="">
                                    <Rate allowHalf disabled defaultValue={ this.state.booking_details && this.state.booking_details.tasker.rating && parseFloat(this.state.booking_details.tasker.rating)} />
                                </div>

                            </div>
                        </div>
                    </div>
                    
                    <p className="fM mb-0">{ i18next.t("Amount") }</p>
                    <div className="position-relative my-3">
                        <span className="dolorSign">{ this.state.general_info && this.state.general_info.currency_symbol } </span>
                        <input inputMode="decimal" className="w-100 border p-2" placeholder={ this.state.general_info && i18next.t("Minimum price is")+" "+this.state.general_info.currency_symbol+" "+this.state.general_info.minimum_payment_price } onChange={ this.isNumber } value={this.state.onlyNumber} />
                        <p className="text-danger">{ this.state.tip_err }</p>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button className="btn PrimaryBtn lg" onClick={this.payreward} type="submit">{ i18next.t("Pay") }</button>
                    </div>
                </Modal>
                </div>
            </React.Fragment>

        );
    }
}

export default MyBookingDetail;