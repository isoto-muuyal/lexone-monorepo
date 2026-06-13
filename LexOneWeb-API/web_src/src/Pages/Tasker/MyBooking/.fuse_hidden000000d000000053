import React from 'react';
import { Input, Button, Modal } from 'antd';
import Breadcremb from '../../../components/BreadCremb';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import MetaDecorator from '../../../components/MetaDecorator';  
import Loader from "react-loader-spinner";
import i18next from 'i18next';


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

export default class TaskerBookingConfirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            onlyNumber: '',
            otp_value : '',
            otp_value_err : '',
            is_loading : true
        }
    }
    showOtpModal = () => {
        this.setState({
            visible: true,
        });
    };
    componentDidMount = () => {
        this.get_booking_by_id();
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../../assets/images/default_service_image.png");
    }
    get_chats = (chat_id) => {
        var obj = {};
        obj.chat_id = chat_id;
        this.props.history.push('/chat', obj);
    }
    get_booking_by_id = () => {
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        var user_info = JSON.parse(localStorage.getItem('user'));
        
        const config = {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('user_id',user_info.user_id);
        params.append('booking_id',this.props.location.state.booking_id);

        this.setState({ initial_state : this.props.location.state, general_info : general_info,user_info : user_info })
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/bookingdetails`,params,config)
        .then(res => {
            if(res.data.status_code === 200)
            {
                var booking_details = res.data;
                var raw_date =res.data.date;
                let date = new Date(raw_date);

                let formatted_date =date.getDate() + "/"+ parseInt(date.getMonth()+1) +"/"+date.getFullYear();
                booking_details.formatted_date = formatted_date;
                this.setState({ booking_details : booking_details,is_loading : false });
            }
            else if(res.data.status_code === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
        });
    }
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleChange(evt) {
        const onlyNumber = (evt.target.validity.valid) ? evt.target.value : this.state.onlyNumber;
        this.setState({ onlyNumber });
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
                var booking_id = this.props.location.state && this.props.location.state.booking_id;
                const config = {
                    headers : {
                        'Content-type' : 'application/x-www-form-urlencoded'
                    }
                }
                const params = new URLSearchParams();
                params.append('user_id',user_id);
                params.append('booking_id',booking_id);
                params.append('status','cancelled');
                axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/bookingstatus`,params,config)
                .then(res => {
                    console.log(res);
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
    accept_task = () => {
        Swal.fire({
            title: i18next.t('Are you sure?'),
            text: i18next.t("You want to Accept this Booking!"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                var user_id = this.state.user_info && this.state.user_info.user_id;
                var booking_id = this.props.location.state && this.props.location.state.booking_id;
                const config = {
                    headers : {
                        'Content-type' : 'application/x-www-form-urlencoded'
                    }
                }
                const params = new URLSearchParams();
                params.append('user_id',user_id);
                params.append('booking_id',booking_id);
                params.append('status','accepted');
                params.append('price',this.state.booking_details && this.state.booking_details.price);
                axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/bookingstatus`,params,config)
                .then(res => {
                    console.log(res);
                    if(res.data.status_code === 200)
                    {
                        Swal.fire(
                            'Accepted',
                            res.data.message,
                            'success'
                        )
                        var booking_details = this.state.booking_details && this.state.booking_details;
                        booking_details.booking_status = 'accepted';
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
    isNumber = (e) => {
        var rgx = /^[0-9]*\.?[0-9]*$/;
        if (rgx.test(e.target.value) === true) {
            this.setState({otp_value: e.target.value})
        }
    }
    start_task = () => {
        const config = {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('user_id', this.state.user_info && this.state.user_info.user_id);
        params.append('booking_id',this.props.location.state.booking_id);
        params.append('status','started');
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/bookingstatus`,params,config)
        .then(res => { 
            if(res.data.status_code === 200) {
                Toast.fire({
                    icon: 'success',
                    title: res.data.message
                });
                var booking_details = this.state.booking_details && this.state.booking_details;
                booking_details.booking_status = 'started';
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
        })
    }
    verify_otp = () => {
        var err = 0;
        if(this.state.otp_value === '') {
            this.setState({ otp_value_err : i18next.t("OTP is required") });
            err++;
        }
        else {
            this.setState({ otp_value_err : "" });
        }
        if(err === 0) {
            const config = {
                headers : {
                    'Content-type' : 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams();
            params.append('user_id', this.state.user_info && this.state.user_info.user_id);
            params.append('booking_id',this.props.location.state.booking_id);
            params.append('status','completed');
            params.append('otp',this.state.otp_value);
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/bookingstatus`,params,config)
            .then(res => { 
                if(res.data.status_code === 200) {
                    Toast.fire({
                        icon: 'success',
                        title: res.data.message
                    });
                    this.setState({ visible : false });
                    var booking_details = this.state.booking_details && this.state.booking_details;
                    booking_details.booking_status = 'completed';
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
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/createchat`, 
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
    get_to_bookings = () => {
        var obj = {};
        obj.status_of_booking = this.state.booking_details &&
        this.state.booking_details.booking_status;
        this.props.history.push('/tasker/my-booking',obj);
    }
    render() {

        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title='| Tasker Booking' description="IDemand Booking Details"/>
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
                        <div className="pt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Breadcremb flag="others" bredcrumb1={ this.state.booking_details && this.state.booking_details.parent_category_name } bredcrumb2={ this.state.booking_details && this.state.booking_details.subcategory_name } />
                                <div className="d-flex align-items-center hover-cont" onClick={ this.get_to_bookings  }> 
                                    <ArrowLeftOutlined  />
                                    &nbsp;
                                    <span>{ i18next.t('Back') } </span>
                                </div>
                            </div>
                            <div className="cardTwoStyle">
                                    <div className="row">
                                        <div className="col-md-9 col-sm-8">
                                            <div className="row">
                                                <div className="col-sm-4 col-lg-3">
                                                    <img alt="" className="rounded imgBg" src={this.state.booking_details && this.state.booking_details.user.image} onError={ this.service_image_err } height={100} />
                                                </div>
                                                <div className="col-sm-8 col-lg-9">
                                                    <div className="detailsSection mt-3 mt-sm-0">
                                                        <div className="fM mb-3 text-truncate">
                                                            { this.state.booking_details && this.state.booking_details.user.name }
                                                        </div>
                                                        <p className="mb-2 d-flex align-items-center font-sm"><span className="phoneIcon d-block mr-2" />{ this.state.booking_details && this.state.booking_details.user.phone }</p>
                                                        <p className="font-sm">ID: <span># { this.state.booking_details && this.state.booking_details.reference_id.toUpperCase() }</span></p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-md-3 col-sm-4">
                                            <div className="mt-3 mt-sm-0 text-sm-right">
                                                <div className="detailsSection overflow-hidden mb-lg-2">
                                                    <div className="detailsSix text-truncate mb-2">
                                                        <span> { this.state.general_info && this.state.general_info.currency_symbol } { this.state.booking_details && this.state.booking_details.price  } </span></div>
                                                    {
                                                        this.state.booking_details &&
                                                        this.state.booking_details.booking_status === 'paid' &&
                                                        <h5 className="mb-0 fM greenTxtClr">{ i18next.t('Paid') }</h5>
                                                    }
                                                    {
                                                        this.state.booking_details &&
                                                        this.state.booking_details.booking_status === 'completed' &&
                                                        <h5 className="mb-0 fM greenTxtClr">{ i18next.t('Completed') }</h5>
                                                    }
                                                    {
                                                        this.state.booking_details &&
                                                        this.state.booking_details.booking_status === 'requested' &&
                                                        <h5 className="mb-0 fM blueTxtClr">{ i18next.t('Payment Pending') }</h5>
                                                    }
                                                    {
                                                        this.state.booking_details &&
                                                        this.state.booking_details.booking_status === 'cancelled' &&
                                                        <h5 className="mb-0 fM redTxtClr">{ i18next.t('Cancelled') }</h5>
                                                    }
                                                    {
                                                        this.state.booking_details &&
                                                        this.state.booking_details.booking_status === 'accepted' &&
                                                        <h5 className="mb-0 fM greenTxtClr">{ i18next.t('Accepted') }</h5>
                                                    }
                                                    {
                                                        this.state.booking_details &&
                                                        this.state.booking_details.booking_status === 'refunded' &&
                                                        <h5 className="mb-0 fM greenTxtClr">{ i18next.t('Refunded') }</h5>
                                                    }
                                                </div></div>

                                        </div>
                                    </div>
                            </div>

                            <div className="row">
                            <div className="col-md-6">
                                    <div className="col-12 px-0 mb-4">
                                        <p className="mb-3 fM">{ i18next.t('Where & When') } </p>
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
                                                <div className="d-flex align-items-center flex-fill justify-content-end"><p className="mb-0 fM font-lg white-nowrap">{ this.state.general_info && this.state.general_info.currency_symbol } { i.service_price * i.service_quantity }</p></div>
                                            </div>
                                        ))
                                        
                                        }
                                            
                                        </section>

                                    </div>

                                    <div className="col-12 px-0 mb-5">
                                        <p className="mb-3 fM">{ i18next.t('Description') }</p>
                                        <TextArea value={ this.state.booking_details && this.state.booking_details.description } readOnly={true}
                                            placeholder="Enter your details of your task"
                                            autosize={{ minRows: 4, maxRows: 5 }}
                                        />
                                    </div>
                                    {/* <div className="col-12 px-0 mb-5">
                                        <div className="d-flex justify-content-between border p-3 rounded">
                                            <h5 className="mb-0 fM">OTP</h5>
                                            <h5 className="mb-0 greenTxtClr fM">{ this.state.booking_details && this.state.booking_details.otp }</h5>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="col-md-6">
                                    <section className="paymentBox">
                                        <h5 className="title">{ i18next.t('Payment Summary') }</h5>
                                        <div className="content">
                                            <div className="row align-items-center" >
                                                <p className="col-8">
                                                    <div className="text-truncate fM">
                                                    { i18next.t('Booking Amount + IVA') }</div>
                                                </p><p className="col-4">
                                                    <div className="text-right fM">{ this.state.general_info && this.state.general_info.currency_symbol }
                                                    { 
                                                            (parseFloat(this.state.booking_details.price) + 
                                                            parseFloat(this.state.booking_details.tax)).toFixed(2) 
                                                        }</div>
                                                </p>
                                                <p className="col-8">
                                                    <div className="text-truncate fM"> { i18next.t('Commission') }</div>
                                                </p>
                                                <p className="col-4">
                                                    <div className="text-right fM"> { this.state.general_info && this.state.general_info.currency_symbol } { this.state.booking_details && this.state.booking_details.commission } </div>
                                                </p>
                                                
                                                {/* <p className="col-8 mb-0">
                                                    <div className="text-truncate fM"> { i18next.t('Tax') }</div>
                                                </p><p className="col-4 mb-0">
                                                    <div className="text-right fM"> { this.state.general_info && this.state.general_info.currency_symbol } { this.state.booking_details && this.state.booking_details.tax } </div>
                                                </p> */}
                                                </div>
                                                <hr/>
                                            <div className="row"><p className="col-8 mb-0"><div className="text-truncate fM">{ i18next.t('Amount to be paid') }</div></p><p className="col-4 mb-0"> <div className="text-right fM font-lg">{ this.state.general_info && this.state.general_info.currency_symbol } { this.state.booking_details && this.state.booking_details.total } </div>  </p></div>

                                            {
                                                this.state.booking_details && this.state.booking_details.reward.status === "true" &&
                                                <div className="row"><p className="col-8 mb-0"><div className="text-truncate fM">Tips</div></p><p className="col-4 mb-0"> <div className="text-right fM font-lg">{ this.state.general_info && this.state.general_info.currency_symbol } { this.state.booking_details && this.state.booking_details.reward.amount } </div>  </p></div>
                                            }
                                        </div>

                                    </section>
                                    {
                                        this.state.booking_details &&
                                        this.state.booking_details.booking_type === 'professional' &&
                                        <>
                                        {
                                            this.state.booking_details && this.state.booking_details.booking_status === 'requested' ? 
                                                <div className="row mt-5">
                                                    <div className="col-12">
                                                        <Button size="large" className="SecoundaryBtn lg fM" onClick={this.cancel_booking} block>{ i18next.t("Cancel") }</Button>
                                                    </div>
                                                </div>
                                            :
                                            this.state.booking_details && this.state.booking_details.booking_status === 'paid' ? 
                                            <div className="row mt-5">
                                                <div className="col-6">
                                                    <Button size="large" className="SecoundaryBtn lg fM" onClick={this.get_pro_chat}  block>{ i18next.t("Chat") }</Button>
                                                </div>
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.start_task(); } } block>{ i18next.t("Start") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details && this.state.booking_details.booking_status === 'started'  &&
                                            <div className="row mt-5">
                                                <div className="col-6 align-self-center">
                                                    <Button size="large" className="SecoundaryBtn lg fM mb-2 mb-sm-0" onClick={this.get_pro_chat} block>{ i18next.t("Chat") }</Button>
                                                </div>
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={this.showOtpModal} block>{ i18next.t("Complete") }</Button>
                                                </div>
                                            </div>
                                        }
                                        </>
                                    }
                                    {
                                        this.state.booking_details &&
                                        this.state.booking_details.booking_type === 'marketplace' &&
                                        <>
                                        {
                                            this.state.booking_details && this.state.booking_details.booking_status === 'requested' ? 
                                                <div className="row mt-5">
                                                    <div className="col-6">
                                                        <Button size="large" className="SecoundaryBtn lg fM" onClick={this.cancel_booking} block>{ i18next.t("Cancel") }</Button>
                                                    </div>
                                                    <div className="col-6 pl-0 align-self-center">
                                                        <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                    </div>
                                                </div>
                                            :
                                            this.state.booking_details && this.state.booking_details.booking_status === 'accepted' ? 
                                                <div className="row mt-5">
                                                    <div className="col-6">
                                                        <Button size="large" className="SecoundaryBtn lg fM" onClick={this.cancel_booking} block>{ i18next.t("Cancel") }</Button>
                                                    </div>
                                                    <div className="col-6 pl-0 align-self-center">
                                                        <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                    </div>
                                                </div>
                                            :
                                            this.state.booking_details && this.state.booking_details.booking_status === 'paid' ? 
                                            <div className="row mt-5">
                                                <div className="col-6">
                                                    <Button size="large" className="SecoundaryBtn lg fM" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                </div>
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.start_task(); } } block>{ i18next.t("Start") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details && this.state.booking_details.booking_status === 'started'  &&
                                            <div className="row mt-5">
                                                <div className="col-6 align-self-center">
                                                    <Button size="large" className="SecoundaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                </div>
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={this.showOtpModal} block>{ i18next.t("Complete") }</Button>
                                                </div>
                                            </div>
                                        }
                                        </>
                                    }
                                    {
                                        this.state.booking_details &&
                                        this.state.booking_details.booking_type === 'userneeds' &&
                                        <>
                                        {
                                            this.state.booking_details && this.state.booking_details.booking_status === 'requested' ? 
                                                <div className="row mt-5">
                                                    <div className="col-6">
                                                        <Button size="large" className="SecoundaryBtn lg fM" onClick={this.cancel_booking} block>{ i18next.t("Cancel") }</Button>
                                                    </div>
                                                    <div className="col-6 pl-0 align-self-center">
                                                        <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                    </div>
                                                </div>
                                            :
                                            this.state.booking_details && this.state.booking_details.booking_status === 'accepted' ? 
                                                <div className="row mt-5">
                                                    <div className="col-6">
                                                        <Button size="large" className="SecoundaryBtn lg fM" onClick={this.cancel_booking} block>{ i18next.t("Cancel") }</Button>
                                                    </div>
                                                    <div className="col-6 pl-0 align-self-center">
                                                        <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                    </div>
                                                </div>
                                            :
                                            this.state.booking_details && this.state.booking_details.booking_status === 'paid' ? 
                                            <div className="row mt-5">
                                                <div className="col-6">
                                                    <Button size="large" className="SecoundaryBtn lg fM" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                </div>
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.start_task(); } } block>{ i18next.t("Start") }</Button>
                                                </div>
                                            </div>
                                            :
                                            this.state.booking_details && this.state.booking_details.booking_status === 'started'  &&
                                            <div className="row mt-5">
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="SecoundaryBtn lg fM mb-2 mb-sm-0" onClick={ (e)=> { e.stopPropagation(); this.get_chats(this.state.booking_details && this.state.booking_details.chat_id); } } block>{ i18next.t("Chat") }</Button>
                                                </div>
                                                <div className="col-6 pl-0 align-self-center">
                                                    <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={this.showOtpModal} block>{ i18next.t("Complete") }</Button>
                                                </div>
                                            </div>
                                        }
                                        </>
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                }
                
                <Modal className=""
                    centered
                    footer={null}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}>
                    <h3 className="pb-3 fM">{ i18next.t("OTP") } </h3>


                    <p className="fM mb-0">{ i18next.t("Enter your OTP") }</p>
                    <div className="position-relative my-3">
                        {/* <span className="dolorSign">$ </span> */}
                        <input className="w-100 border p-2 " inputMode="decimal" placeholder={ i18next.t("Enter OTP") } onChange={ this.isNumber } value={ this.state.otp_value && this.state.otp_value } maxLength="4" 
                         />
                         <p className="text-danger">{ this.state.otp_value_err && this.state.otp_value_err }</p>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button className="btn PrimaryBtn lg" type="button" onClick={this.verify_otp}>{ i18next.t("Done") }</button>
                    </div>
                </Modal>
                </div>
            </React.Fragment>

        )
    }
}