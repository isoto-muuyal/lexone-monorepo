import React, { Component } from 'react';
import { Input, Button, Modal } from 'antd';
import {ArrowLeftOutlined,LoadingOutlined} from '@ant-design/icons';
import Breadcremb from '../../../components/BreadCremb';
import axios from 'axios';
import MetaDecorator from '../../../components/MetaDecorator';  
import Loader from "react-loader-spinner";
import Swal from 'sweetalert2';
import socketIOClient from 'socket.io-client';
import i18next from 'i18next';

const socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);

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

const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

const { TextArea } = Input;
class BrowseTaskDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: this.props.rating || null,
            temp_rating: null,
            visible: false,
            visible1: false,
            onlyNumber: '',
            is_loading : true,
            tasker_quoted_price : '',
            tasker_quoted_price_err : '',
            tasker_quoted_desc : '',
            tasker_quoted_desc_err : '',
            is_disabled : false,
        }
        this.send_quote_price = this.send_quote_price.bind(this)
    }
    componentDidMount = () => {
        this.get_booking_by_id();
    }
    UNSAFE_componentWillMount = () => {
        var user_info = JSON.parse(localStorage.getItem('user'));
        socket.emit("liveMe",{"user_id":user_info.user_id});
        socket.emit("joinChat",{"chat_id":user_info.user_id});
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../../assets/images/default_service_image.png");
    }
    get_booking_by_id = () => {
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        var user_info = JSON.parse(localStorage.getItem('user'));
        this.setState({ initial_state : this.props.location.state, general_info : general_info })
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        const params = new URLSearchParams()
        params.append('user_id', user_info.user_id);
        params.append('booking_id', this.props.location.state.item_id);
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/bookingdetails`,params,config)
        .then(res => {
            console.log('booking data');
            console.log(res.data);
            if(res.data.status_code === 200)
            {
                var booking_details = res.data;
                var raw_date =res.data.date;
                let date = new Date(raw_date);

                let formatted_date =date.getDate() + "/"+ parseInt(date.getMonth()+1) +"/"+date.getFullYear();
                booking_details.formatted_date = formatted_date;
                this.setState({ booking_details : booking_details,is_loading :false, tasker_quoted_price : booking_details.price });
                console.log(date)
            }
            else if(res.data.status_code === 401) {
                alert('hi1');
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
        });
    }
    showReviewModal = () => {
        this.setState({
            visible: true,
        });
    };
    showQuoteModal = () => {
        this.setState({
            visible1: true,
        });
    };

    CloseQuoteModal = e => {
        console.log(e);
        this.setState({
            visible1: false,
        });

    };

    handleChange(evt) {
        const onlyNumber = (evt.target.validity.valid) ? evt.target.value : this.state.onlyNumber;
        this.setState({ onlyNumber });
    }

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

    rate(rating) {
        this.setState({
            rating,
            temp_rating: rating
        });
    }
    get_chats = (chat_id) => {
        var obj = {};
        obj.chat_id = chat_id;
        this.props.history.push('/chat', obj);
    }
    async send_quote_price (){
        this.setState({
            is_disabled : true,
        })
        var err = 0;
        var before_decimal = 6;
        var after_decimal = 2;
        if(this.state.tasker_quoted_price && this.state.tasker_quoted_price.trim() !== '') {
            var price = this.state.tasker_quoted_price && this.state.tasker_quoted_price;
            var split_price = price.split('.');
        }

        if(this.state.tasker_quoted_price === '') {
            this.setState({
                tasker_quoted_price_err : i18next.t("Enter Price"),
                is_disabled : false,
            })
            err++;
        }
        else if(parseFloat(this.state.tasker_quoted_price) < parseFloat(this.state.general_info.minimum_payment_price)) {
            var min_err = this.state.general_info && this.state.general_info.currency_symbol+' '+this.state.general_info.minimum_payment_price+' '+i18next.t("is Minimum Value of service");
            this.setState({ tasker_quoted_price_err : min_err,is_disabled :false, });
            err++;
        }
        else if (split_price[0] && split_price[0].length > before_decimal) {
            this.setState({ tasker_quoted_price_err : i18next.t("Valid format is (123456.12)"),is_disabled :false, });
            err++;
        }
        else if (split_price[1] && split_price[1].length > after_decimal) {
            this.setState({ tasker_quoted_price_err : i18next.t("Valid format is (123456.12)"),is_disabled :false, });
            err++;
        }
        else {
            this.setState({
                tasker_quoted_price_err : ""
            })
        }
        if(this.state.tasker_quoted_desc === '') {
            this.setState({
                tasker_quoted_desc_err : i18next.t("Enter Description"),
                is_disabled :false,
            })
            err++;
        }
        else {
            this.setState({
                tasker_quoted_desc_err : ""
            })
        }

        if(err === 0) {
            var user_info = JSON.parse(localStorage.getItem('user'));
            var booking_id = this.props.location && this.props.location.state.item_id;
            var chat_id = '';
            if(this.state.booking_details && this.state.booking_details.chat_id === '') {
                const config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                const params1 = new URLSearchParams()
                params1.append('user_id', user_info.user_id)
                params1.append('booking_id', booking_id)
                await axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/createchat`, 
                params1,config)
                .then(res1=>{
                    if(res1.data.status_code === 200) {
                        chat_id = res1.data.chat_id;
                        var booking_details = this.state.booking_details && this.state.booking_details;
                        booking_details.chat_id = chat_id;
                        this.setState({
                            booking_details : booking_details
                        })
                    }
                    else if(res1.data.status_code === 401) {
                        alert('hi3');
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('user');
                        this.props.history.push('/');
                        window.location.reload(false);
                    }
                })
            }
            else {
                chat_id = this.state.booking_details.chat_id;
            }
            
            if(chat_id !== '') {
                var message_obj = {};
                var message = {};
                message.attachment = '';
                message.booking_id = booking_id;
                message.isActive = "true";
                message.lat = "";
                message.lon = "";
                message.description = this.state.tasker_quoted_desc && this.state.tasker_quoted_desc;
                message.quote_price = this.state.tasker_quoted_price && this.state.tasker_quoted_price;
                message.price = this.state.tasker_quoted_price && this.state.tasker_quoted_price;
                message.type = "quote";

                message_obj.message = message;
                message_obj.chat_id = chat_id;
                message_obj.date = new Date();
                message_obj.message_id = user_info.user_id+''+Math.floor(1000000000 + Math.random() * 9000000000);
                message_obj.message_type = 'quote';
                message_obj.receiver_id = this.state.booking_details && this.state.booking_details.user.id;
                message_obj.type = 'bookingchat';
                message_obj.user_id = user_info.user_id;
                message_obj.user_image = user_info.user_image;
                message_obj.user_name = user_info.name;

                socket.emit('sendMessage',message_obj);
                Toast.fire({
                    icon: 'success',
                    title: i18next.t('Quoted Successfully!')
                }); 

                this.setState({
                    visible1 : false,
                    tasker_quoted_desc : '',
                    tasker_quoted_price : '',
                    is_disabled :false,
                })

            }
        }
        
          
           
    }
    isNumber = (e) => {
        var rgx = /^[0-9]*\.?[0-9]*$/;
        var split_price = e.target.value.split('.');
        if (rgx.test(e.target.value)) {
            if( (split_price[0] && split_price[0].length !== undefined && split_price[0].length <= 6) ) {
                if(!split_price[1]) {
                    this.setState({tasker_quoted_price: e.target.value})
                }
                else {
                    if( (split_price[1] && split_price[1].length !== undefined && split_price[1].length <= 2) ) {
                        this.setState({tasker_quoted_price: e.target.value})
                    }
                }
                
            }
        }
        if(e.target.value.length === 0) {
            this.setState({tasker_quoted_price: e.target.value})
        }
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
                <MetaDecorator title='| Tasker Jobs' description="IDemand Tasker Jobs"/>
                {
                    this.state.is_loading === true ?
                    <div style={style}>
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
                                <Breadcremb flag="others" bredcrumb1={ this.state.booking_details && this.state.booking_details.parent_category_name } bredcrumb2={ this.state.booking_details && this.state.booking_details.subcategory_name } />
                                <div className="d-flex align-items-center hover-cont" onClick={ ()=>{ this.props.history.push('/tasker/user-jobs'); }  }> 
                                    <ArrowLeftOutlined  />
                                    &nbsp;
                                    <span>{ i18next.t('Back') } </span>
                                </div>
                            </div>

                            <div className="cardTwoStyle">

                                    <div className="row">
                                        <div className="col-sm-9 col-md-9">
                                            <div className="row">
                                                <div className="col-sm-4 col-lg-3">
                                                    <img alt="" onError={ this.service_image_err } className="rounded imgBg" src={ this.state.booking_details && this.state.booking_details.user.image } height={100} />
                                                </div>
                                                <div className="col-sm-8 col-lg-9">
                                                    <div className="detailsSection mt-3 mt-sm-0">
                                                        <div className="mb-2 fM text-truncate">
                                                        { this.state.booking_details && this.state.booking_details.user.name }
                                                        </div>
                                                        <p className="mb-2 d-flex align-items-center font-sm"><span className="phoneIcon d-block mr-2" />{ this.state.booking_details && this.state.booking_details.user.phone }</p>
                                                        <p className="mb-2 font-sm">ID: <span># { this.state.booking_details && this.state.booking_details.reference_id.toUpperCase() }</span></p>
                                                        
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-sm-3 col-md-3">
                                            <div className="mt-3 mt-lg-0 text-md-right">
                                                <div className="detailsSection overflow-hidden mb-lg-2">
                                                    <div className="detailsSix mb-2">
                                                        <span> { this.state.general_info && this.state.general_info.currency_symbol } { this.state.booking_details && this.state.booking_details.services[0].service_price }</span>    
                                    </div>          { 
                                                        this.state.booking_details && this.state.booking_details.due_status === 'expired' ?
                                                        <h5 className="mb-0 fM redTxtClr">Expired</h5>
                                                        :
                                                        this.state.booking_details.due_status === 'active' &&
                                                        <h5 className="mb-0 fM greenTxtClr">Active</h5>
                                                    }
                                                    
                                                </div>

                                            </div>

                                        </div>
                                    </div>

                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                <div className="col-12 px-0 mb-4">
                                        <p className="mb-3 fM">{ i18next.t('Task Name') } </p>
                                        <div className="mb-3">
                                            <div className="coloredAntLookAlike  mb-3"><div className="likeInput calendarIcon"></div>{ this.state.booking_details && this.state.booking_details.booking_name }</div>
                                        </div>
                                        
                                    </div>
                                    <div className="col-12 px-0 mb-4">
                                        <p className="mb-3 fM">{ i18next.t('Where & When') } </p>
                                        <div className="mb-3">
                                            <div className="coloredAntLookAlike  mb-3"><div className="likeInput calendarIcon"></div>{ this.state.booking_details && this.state.booking_details.formatted_date }</div>
                                        </div>
                                        <div className="">
                                        {
                                        this.state.booking_details &&
                                        (this.state.booking_details.location_type === 'transport' ||  this.state.booking_details.location_type === 'home') &&
                                            <div className="coloredAntLookAlike  mb-3"><div className="likeInput locationIcon"></div>{ this.state.booking_details && this.state.booking_details.source_location }.</div>
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
                                                        <p className="mb-0 fM">{ this.state.general_info && this.state.general_info.currency_symbol } <span>{i.service_price}</span> X <span>{ i.service_quantity } </span> <span> / { i.service_pricing }</span></p>
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
                                            placeholder={ i18next.t("Enter your details of your task") }
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
                                    <h5 className="title">{ i18next.t("Payment Summary") }</h5>
                                    <div className="content">
                                        <div className="row align-items-center" >
                                            <p className="col-8">
                                                <div className="text-truncate fM">
                                                { i18next.t("Booking Amount + IVA") }</div>
                                            </p><p className="col-4">
                                                <div className="text-right fM">{ this.state.general_info && this.state.general_info.currency_symbol } 
                                                { 
                                                            (parseFloat(this.state.booking_details.price) + 
                                                            parseFloat(this.state.booking_details.tax)).toFixed(2) 
                                                        }</div>
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
                                    </div>

                                </section>
                                    
                                    
                                    <div className="row mt-5">
                                        {/* <div className="col-6">
                                            <Button size="large" className="SecoundaryBtn lg fM" onClick={this.showReviewModal} block>Cancel</Button>
                                        </div> */}
                                        {
                                            this.state.booking_details && this.state.booking_details.booking_status === 'requested' &&
                                            <div className="col-12 align-self-center">
                                                <Button size="large" className="PrimaryBtn lg fM mb-2 mb-sm-0" onClick={this.showQuoteModal} block>{ i18next.t("Quote") }</Button>
                                            </div>
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                
                <Modal className="quoteModal"
                    centered
                    footer={null}
                    visible={this.state.visible1}
                    onCancel={this.CloseQuoteModal}>
                    <h4 className="pb-3 fM"> { i18next.t("Quote Your Price") }</h4>

                    <div className="d-flex mb-4">
                        <div className="pl-0 pr-3 mt-1">
                            <img className="profile-sm imgBg" src={this.state.booking_details && this.state.booking_details.services[0].service_image} height={45} width={65} alt="" />
                        </div>
                        <div className="w-100">
                            <div className="details">
                                <div className="detailOne fM mb-1">{this.state.booking_details && this.state.booking_details.services[0].service_name}</div>
                                <h5 className="mb-0 fM">{ i18next.t("Ask Price:") } <span className="primaryClr">{ this.state.general_info && this.state.general_info.currency_symbol } {this.state.booking_details && this.state.booking_details.price}</span></h5>

                            </div>
                        </div>
                    </div>
                    <p className="fM mb-0">{ i18next.t("Amount") }</p>
                    <div className="position-relative my-3">
                        <span className="dolorSign">{ this.state.general_info && this.state.general_info.currency_symbol } </span>
                        <input inputMode="decimal" className="w-100 border p-2 " placeholder={ 
                            this.state.general_info && i18next.t("Minimum price is")+" "+this.state.general_info.currency_symbol+" "+this.state.general_info.minimum_payment_price } onChange={this.isNumber} value={ this.state.tasker_quoted_price && this.state.tasker_quoted_price } autoComplete="off"/>
                    </div>
                    <p className="text-danger">{this.state.tasker_quoted_price_err}</p>
                    <textarea className="w-100 border p-2 mb-4" rows="3" placeholder={ i18next.t("Share details of your experience") } onChange={(e)=> { this.setState({ tasker_quoted_desc : e.target.value }) }}
                                    value={ this.state.tasker_quoted_desc }>{ this.state.tasker_quoted_desc }</textarea>
                                    <p className="text-danger">{ this.state.tasker_quoted_desc_err && this.state.tasker_quoted_desc_err }</p>
                    <div className="d-flex justify-content-end">
                        <button disabled={this.state.is_disabled} onClick={this.send_quote_price} className="btn PrimaryBtn lg" type="button">{ this.state.is_disabled === true ? <LoadingOutlined /> : i18next.t("Send") }</button>
                    </div>
                </Modal>
                </div>
            </React.Fragment>

        );
    }
}

export default BrowseTaskDetail;