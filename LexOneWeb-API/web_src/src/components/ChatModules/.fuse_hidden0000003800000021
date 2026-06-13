import React, { Component } from 'react';
import { Button, Modal, Menu, Dropdown, Input } from "antd";
import Map from '../Map';
import { Link } from "react-router-dom";
import SimpleBar from 'simplebar-react';
import axios from 'axios';
import {connect} from 'react-redux';
import socketIOClient from 'socket.io-client';
import Swal from 'sweetalert2';
import Loader from "react-loader-spinner";
import moment from 'moment';
import i18next from 'i18next';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { LoadingOutlined } from '@ant-design/icons';
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

const mapStateToProps=(props)=> {
    return {
        user_location : props.userLocation
    }
}

const socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);
class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal2Visible: false,
            chat_msg_paginate : 0,
            is_location_ModalVisible : false,
            quote_price_modal : false,
            position : {},
            messages_info : [],
            text_message : '',
            tasker_quoted_price : '',
            tasker_quoted_price_err : '',
            tasker_quoted_desc : '',
            scroll_bottom : false,
            chat_list_loading : true,
            chat_msg_loading : true,
            chat_list_info : {},
            click_flag : true,
            movesides: false,
            show_view_location_modal : false,
            uploading_file : false,
            tasker_btn_load : false,
            quote_btn_load : false,
            user_btn_load : false,
            is_disabled : false,
        }
        this.get_chat_message_by_chat_id = this.get_chat_message_by_chat_id.bind(this);
        this.get_chat_list = this.get_chat_list.bind(this);
        this.tasker_price_isok = this.tasker_price_isok.bind(this);
        socket.on('receiveMessage', (data)=> { 
            console.log('receive_data', data);
            if(data.type !== 'onlineStatus' && data.type !== 'updateChat' && data.type !== 'bookingStatus' && data.type !== 'blockChat' && data.type !== 'getLocation') {
                if(data.message_type === 'text' || data.message_type === 'quote' || data.message_type === 'accept' || data.message_type === 'cancel' || data.message_type === 'location' || data.message_type === 'image') {
                    this.get_chat_list('socket_call');
                } 
                if(this.state.message_chat_id === data.chat_id) {
                    var messages_info = this.state.messages_info;
                
                    var date = new Date(data.date);

                    var elapsed_date = this.formatAMPM(date);
                    data.formatted_date = elapsed_date;
                    messages_info.push(data);
                    this.setState({ scroll_bottom : true },()=>{
                        this.setState({ scroll_bottom : false })
                    })   
                }
                
            }
            else if(data.type === 'onlineStatus') {
                
                var elapsed_date1 = '';
               
                if(data.status === 0) {
                    var last_seen = new Date(data.last_seen);
                    moment.locale('en');
                    elapsed_date1 = moment(last_seen).fromNow();
                   
                }
                data.formatted_date = elapsed_date1;
               
                this.setState({ onlineStatus : data });
            }
            else if(data.type === 'bookingStatus') {
                this.setState({
                    booking_status_info : data
                })
            }
            else if(data.type === 'blockChat') {
                var chat_info = this.state.chat_info && this.state.chat_info;
                chat_info.block = data.blocked;
                chat_info.blocked_by = data.user_id;
                this.setState({
                    chat_info : chat_info
                })
            }
        }); 
    }
    conversation_move =()=> {
        this.setState({movesides: !this.state.movesides})
    }
    componentDidMount = () => {
        if(localStorage.getItem('user') !== null) {
            var user_info = JSON.parse(localStorage.getItem('user'));
            socket.emit("liveMe",{"user_id":user_info.user_id});
            socket.emit("joinChat",{"chat_id":user_info.user_id});
        }
        else {
            this.props.history.push('/');
            window.location.reload(false);
        }
        
        // socket.emit("joinChat",{"chat_id":user_info.user_id});
        this.get_chat_list();
        if( this.state.chat_msg_loading === false ) {
            this.scrollToBottom();
        }
    }
    componentDidUpdate() {
        if(this.state.scroll_bottom === true) {
            this.scrollToBottom();
        }
    }
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView();
    }
    UNSAFE_componentWillMount = () => {
        var user_info = JSON.parse(localStorage.getItem('user'));
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        this.setState({
            user_info : user_info,
            general_info : general_info
        })
    }
    booking_page = () =>{
        var obj = {};
        obj.booking_id = this.state.current_chat_booking_id && this.state.current_chat_booking_id;
        
        this.props.history.push("/user/my-booking/detail",obj);
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../assets/images/default_user_image_rectangle.png");
    }
    handleScroll = e => {
        let element = e.target
        if (element.scrollTop === 0) {
            this.setState({ chat_msg_paginate : this.state.chat_msg_paginate + 10  },()=>{
                if(this.state.chat_type && this.state.chat_type !== 'admin') {
                    this.get_chat_message_by_chat_id('scroll');
                }
                else {
                    this.get_admin_messages('scroll');
                }
                
            })
        }
    }
    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible });
    }
    get_chat_list = (call_flag = 'direct_call') => {
        
        var user_info = JSON.parse(localStorage.getItem('user'));
        var user_id = user_info.user_id;
        var url = '';
        if(user_info.type === 'tasker') {
            url = `${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/chats/${user_id}/android`;
        }
        else {
            url = `${process.env.REACT_APP_BASE_URL}/web/api/v1/user/chats/${user_id}/android`;
        }
        axios.get(url)
        .then(res => {
            if(res.data.status_code === 200)
            {
                res.data.chats.length > 0 && res.data.chats.map((j,k)=>{ // eslint-disable-line
                    if(j.date !== '') {
                        var msg_chat = new Date(j.date);
                        var elapsed_date = '';
                        const monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        var month_name = monthNames[msg_chat.getMonth()];
                        var month = msg_chat.getMonth();
                        var year = msg_chat.getFullYear();
                        var date = msg_chat.getDate();
                        elapsed_date = date+'.'+month_name+'.'+year;
                        
                        
                        res.data.chats[k].formatted_date = elapsed_date;
                    } 
                })
                var first_view_chat_id = '';
                if(this.props.location.state) {
                    first_view_chat_id = this.props.location.state.chat_id;
                    this.setState({
                        chat_type : 'user'
                    });
                }
                else {
                    if(res.data.chats.length > 1) {
                        first_view_chat_id = res.data.chats.length > 1 ? res.data.chats[1].chat_id : '';
                        this.setState({
                            chat_type : res.data.chats[1].chat_type
                        });
                    }
                    else {
                        first_view_chat_id = '';
                        this.setState({
                            chat_type : res.data.chats[0].chat_type
                        });
                    }
                }
                this.setState({ chat_list_info : res.data,message_chat_id : call_flag !== 'socket_call' ? first_view_chat_id : this.state.message_chat_id },()=>{
                    if(first_view_chat_id !== '') {
                        if(call_flag !== 'socket_call') {
                            this.get_chat_message_by_chat_id('click');
                        }
                        else {
                            var sock_chat_id = this.state.message_chat_id && this.state.message_chat_id;
                            var chat_list_info = this.state.chat_list_info && this.state.chat_list_info;

                            if(chat_list_info.chats.length > 1) {
                                var current_chat_index = chat_list_info.chats.findIndex(x => x.chat_id === sock_chat_id);
                                if(current_chat_index !== undefined || current_chat_index !== "") {
                                    chat_list_info.chats[current_chat_index].unread_count = "0";
                                    this.setState({
                                        chat_list_info : chat_list_info
                                    })
                                }
                            }
                        }
                    }
                    else {
                        this.get_admin_messages('click');
                    }
                });
            }
            else if(res.data.status_code === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
            this.setState({
                chat_list_loading : false
            })
        },()=>{
            this.scrollToBottom();
        });
    }    
    formatAMPM = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();    
        const ampm = hours >= 12 ? 'pm' : 'am';
      
        hours %= 12;
        hours = hours || 12;    
        minutes = minutes < 10 ? `0${minutes}` : minutes;
      
        const strTime = `${hours}:${minutes} ${ampm}`;
      
        return strTime;
    };
    async get_chat_message_by_chat_id(scroll_flag){
        
         
        var chat_id = this.state.message_chat_id && this.state.message_chat_id;
        socket.emit("joinChat",{"chat_id":chat_id});
        
        var chat_msg_paginate = this.state.chat_msg_paginate;
        var user_info = JSON.parse(localStorage.getItem('user'));
        var user_id = user_info.user_id;
        socket.emit("sendMessage", { type : "resetUnread", user_id : user_id, chat_id : chat_id });

        var chat_list_info = this.state.chat_list_info && this.state.chat_list_info;

        if(chat_list_info.chats.length > 1) {
            var current_chat_index = chat_list_info.chats.findIndex(x => x.chat_id === chat_id);
            if(current_chat_index !== undefined || current_chat_index !== "") {
                chat_list_info.chats[current_chat_index].unread_count = "0";
                this.setState({
                    chat_list_info : chat_list_info
                })
            }
        }
        

        var url = '';
        if(user_info.type === 'tasker') {
            url = `${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/chatinfo`;
        }
        else {
            url = `${process.env.REACT_APP_BASE_URL}/web/api/v1/user/chatinfo`;
        }
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        const params = new URLSearchParams()
        params.append('user_id', user_id)
        params.append('chat_id', chat_id)

        await axios.post(url,params,config)
        .then(res => {
            if(res.data.status_code === 200)
            {
                socket.emit('sendMessage',{
                    "type":"onlineStatus",
                    "user_id": user_id,
                    "receiver_id":res.data.user_id
                });
                socket.emit('sendMessage',{
                    "type":"bookingStatus",
                    "user_id": user_id,
                    "booking_id":res.data.booking_id
                });
                this.setState({ 
                    message_receiver_id : res.data.user_id,
                    current_chat_booking_id : res.data.booking_id,
                    current_chat_id : chat_id,
                });
                
                this.setState({ chat_info : res.data },async()=> {
                    var paginate = chat_msg_paginate;
                    var messages = this.state.messages_info;
                    var url1 = '';
                    if(user_info.type === 'tasker') {
                        url1 = `${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/messages/${chat_id}/${paginate}/10`;
                    }
                    else {
                        url1 = `${process.env.REACT_APP_BASE_URL}/web/api/v1/user/messages/${chat_id}/${paginate}/10`;
                    }
                    await axios.get(url1)
                    .then(async res0 => {
                        if(res0.data.status_code === 200)
                        {
                            const monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            await res0.data.messages.map((j,k)=>{ // eslint-disable-line
                                var msg_chat = new Date(j.date);
                                var elapsed_date = '';
                                if(j.message_type === 'date') {
                                    
                                    var month_name = monthNames[msg_chat.getMonth()];
                                    var month = msg_chat.getMonth();
                                    var year = msg_chat.getFullYear();
                                    var date = msg_chat.getDate();
                                    elapsed_date = date+'.'+month_name+'.'+year;
                                
                                    
                                }
                                else {
                                    elapsed_date = this.formatAMPM(msg_chat);
                                   
                                    
                                }
                                if(j.booking_type !== 'date') {
                                    if(k === 1) {
                                        var booking_id =  j.message && j.message.booking_id;
                                        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/bookingdetails/${booking_id}`)
                                        .then(res1 => {
                                            if(res1.data.status_code === 200)
                                            {
                                                this.setState({
                                                    booking_details : res1.data
                                                })
                                                
                                                // var service_id =res1.data.services[0].service_id;
                                                // if(service_id !== '') {
                                                    
                                                //     const params1 = new URLSearchParams()
                                                //     params1.append('service_id', service_id)
                                                //     axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/service_by_id`,params1,config)
                                                //     .then (res2=>{
                                                //         if(res2.data.status_code === 200) {
                                                //             res0.data.messages[k].message.booked_service_name = res2.data.category[0].service_name;
                                                //             res0.data.messages[k].message.booked_service_image = res2.data.category[0].service_image;
                                                //         }
                                                //     });
                                                // }
                                            }
                                        });
                                    }
                                }
                                res0.data.messages[k].formatted_date = elapsed_date 
                               
                                
                            })
                            messages.unshift(res0.data.messages);
                            var result = messages.flat();
                            this.setState({ click_flag : true,messages_info : result },()=>{
                                this.setState({ chat_msg_loading : false },()=>{
                                    if(scroll_flag === 'click') {
                                        this.setState({
                                            scroll_bottom : true,
                                        },()=>{
                                            this.setState({ scroll_bottom : false })
                                        })
                                    }
                                })
                            });
                            
                        }
                        else {
                            this.setState({ click_flag : true,chat_msg_loading : false })
                        }
                    });
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
    view_booking_details = (id) => {
        var obj = {};
        var user_info = this.state.user_info && this.state.user_info;
        if(
            (this.state.booking_details && this.state.booking_details.booking_type !== "userneeds") || 
            (this.state.booking_details && this.state.booking_details.booking_type === "userneeds" && user_info.type === 'user' && (this.state.booking_details.booking_status === "accepted" || this.state.booking_details.booking_status === "paid" || this.state.booking_details.booking_status === "cancelled" || this.state.booking_details.booking_status === "completed" || this.state.booking_details.booking_status === "refunded") && this.state.booking_details.tasker.id === this.state.message_receiver_id) || 
            (this.state.booking_details && this.state.booking_details.booking_type === "userneeds" && user_info.type === 'tasker' && (this.state.booking_details.booking_status === "accepted" || this.state.booking_details.booking_status === "paid" || this.state.booking_details.booking_status === "cancelled" || this.state.booking_details.booking_status === "completed" || this.state.booking_details.booking_status === "refunded") && this.state.booking_details.tasker.id === user_info.user_id)
        ) { 
            obj.booking_id = id;
            if(user_info.type === 'user') {
                
                this.props.history.push('/user/my-booking/detail', obj);
            }
            else {
                this.props.history.push('/tasker/my-booking/detail', obj);
            }
        }
        else if(this.state.booking_details && this.state.booking_details.booking_type === "userneeds" && user_info.type === 'tasker' && this.state.booking_details.booking_status === "requested") {
            obj.item_id = id;
            this.props.history.push('/browse-task/detail', obj);
        }
        else {
            this.props.history.push('/chat');
        }
    }
    open_map_modal = (lat,lon) => {
        var pos = {
            lat : lat,
            lng : lon
        }
        this.setState({ position : pos },()=> {
            this.setState({ is_location_ModalVisible :true })
        });
    }
    location_modal_close = () => {
        this.setState({ is_location_ModalVisible : false });
    }
    send_text_message = () => {
        var err = 0;
        if(this.state.text_message.trim() === '') {
            Toast.fire({
                icon: 'warning',
                title: i18next.t('Enter Message!')
            });
            err++;
        }
        if(err === 0) {
            var message_obj = {};
            var message = {};

            message.type = "text";
            message.message = this.state.text_message;
            message.attachment = '';
            message.lat = '';
            message.lon = '';
            message.quote_price = "";
            message.isActive = "true";
            message.booking_id = this.state.current_chat_booking_id && this.state.current_chat_booking_id;

            message_obj.message_id = this.state.user_info.user_id+''+Math.floor(1000000000 + Math.random() * 9000000000);
            message_obj.type = "bookingchat";
            message_obj.user_id = this.state.user_info.user_id;
            message_obj.user_name = this.state.user_info.name;
            message_obj.receiver_id = this.state.message_receiver_id && this.state.message_receiver_id;
            message_obj.chat_id = this.state.current_chat_id && this.state.current_chat_id;

            var today = new Date();

            message_obj.date = today;
            message_obj.message_type = "text";
            message_obj.message = message;

            socket.emit('sendMessage',message_obj);
            
        
            const elapsed_date = this.formatAMPM(today);
            message_obj.formatted_date = elapsed_date;
            this.state.messages_info.push(message_obj);

            var chat_list_info = this.state.chat_list_info && this.state.chat_list_info.chats; 
            var current_chat_index = chat_list_info.findIndex(x => x.chat_id === this.state.current_chat_id);

            chat_list_info[current_chat_index].message.message = this.state.text_message;

            this.setState({ text_message : '', scroll_bottom : true },()=>{
                this.setState({ scroll_bottom : false })
            });
            message_obj = {};
        }
        this.chat_text.focus();
    }
    quote_price_modal_close = () => {
        this.setState({ quote_price_modal : false  })
    }
    send_quote_price = () => {
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
            this.setState({ tasker_quoted_price_err : i18next.t("Price is required!"),is_disabled : false, });
            err++;
        }
        else if(parseFloat(this.state.tasker_quoted_price) < parseFloat(this.state.general_info.minimum_payment_price)) {
            var min_err = this.state.general_info && this.state.general_info.currency_symbol+' '+this.state.general_info.minimum_payment_price+' '+i18next.t("is Minimum Value of service");
            this.setState({ tasker_quoted_price_err : min_err,is_disabled : false, });
            err++;
        }
        else if (split_price[0] && split_price[0].length > before_decimal) {
            this.setState({ tasker_quoted_price_err : i18next.t('Valid format is (123456.12)'),is_disabled : false, });
            err++;
        }
        else if (split_price[1] && split_price[1].length > after_decimal) {
            this.setState({ tasker_quoted_price_err : i18next.t('Valid format is (123456.12)'),is_disabled : false, });
            err++;
        }
        else {
            this.setState({ tasker_quoted_price_err : "" });
        }
        if(this.state.tasker_quoted_desc === '') {
            this.setState({ tasker_quoted_desc_err : i18next.t("Description is required!"),is_disabled : false, });
            err++;
        }
        else {
            this.setState({ tasker_quoted_desc_err : "" });
        }
        if(err === 0) {
        
            var quoted_obj = {};

            var message = {};

            message.type = "quote";
            message.description = this.state.tasker_quoted_desc;
            message.attachment = '';
            message.lat = '';
            message.lon = '';
            message.price = this.state.tasker_quoted_price;
            message.quote_price = (this.state.tasker_quoted_price).toString();
            message.isActive = "true";
            message.booking_id = this.state.current_chat_booking_id && this.state.current_chat_booking_id;

            
            quoted_obj.type = "bookingchat";
            quoted_obj.message_id = this.state.user_info.user_id+''+Math.floor(1000000000 + Math.random() * 9000000000);
            quoted_obj.user_id = this.state.user_info.user_id;
            quoted_obj.user_name = this.state.user_info.name;
            quoted_obj.receiver_id = this.state.message_receiver_id && this.state.message_receiver_id;
            quoted_obj.chat_id = this.state.current_chat_id && this.state.current_chat_id;

            var today = new Date();

            quoted_obj.date = today;
            quoted_obj.message_type = "quote";
            
            quoted_obj.message = message;


            
            socket.emit("sendMessage",quoted_obj);

            var raw_date = new Date();
            quoted_obj.formatted_date = this.formatAMPM(raw_date);
           
            this.state.messages_info.push(quoted_obj);
            this.setState({
                scroll_bottom : true
            },()=>{
                this.setState({ scroll_bottom : false })
            })
            this.setState({
                tasker_quoted_price_err : '',
                tasker_quoted_price : '',
                tasker_quoted_desc : '',
                tasker_quoted_desc_err : '',
                quote_price_modal : false,
                is_disabled : false,
            },()=>{
                var chat_list_info = this.state.chat_list_info && this.state.chat_list_info.chats; 
                var current_chat_index = chat_list_info.findIndex(x => x.chat_id === this.state.current_chat_id);

                // chat_list_info[current_chat_index].message.message = 'quoted price '+message.quote_price+' for your booking';
                chat_list_info[current_chat_index].message.message = i18next.t('quoted price')+message.quote_price+i18next.t('for your booking') ;
                // i18next.t('Quote Already Accepted By User!')
            })
        }
    }
    async tasker_price_isok(price,description,message_id){
        this.setState({
            tasker_btn_load : true,
        })
        
        var booking_id = this.state.current_chat_booking_id && this.state.current_chat_booking_id;
        await axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/bookingdetails/${booking_id}`)
        .then(async res1 => {
            if(res1.data.status_code === 200)
            {
                var booking_status_info = this.state.booking_status_info && this.state.booking_status_info;
                booking_status_info.status = res1.data.booking_status;
                this.setState({
                    booking_details : res1.data,
                    booking_status_info : booking_status_info,
                    tasker_btn_load : false,
                },async ()=>{
                    if(res1.data.booking_status !== 'accepted') {
                        var quoted_obj = {};
                        var message = {};
                        var booking_info = this.state.booking_status_info && this.state.booking_status_info;
                        var user_info = this.state.user_info && this.state.user_info;
                        await socket.emit("sendMessage",{ type : "quoteConfirmed",user_id : user_info.user_id, booking_id : booking_info.booking_id, price : price,receiver_id : this.state.message_receiver_id && this.state.message_receiver_id });

                        message.type = "accept";
                        message.message = '';
                        message.description = description;
                        message.attachment = '';

                        message.lat = '';
                        message.lon = '';
                        message.quote_price = (price).toString();
                        message.price = price;
                        message.isActive = "true";
                        message.booking_id = this.state.current_chat_booking_id && this.state.current_chat_booking_id;

                        quoted_obj.message_id = this.state.user_info.user_id+''+Math.floor(1000000000 + Math.random() * 9000000000);
                        quoted_obj.user_id = this.state.user_info.user_id;
                        quoted_obj.user_name = this.state.user_info.name;
                        quoted_obj.receiver_id = this.state.message_receiver_id && this.state.message_receiver_id;
                        quoted_obj.chat_id = this.state.current_chat_id && this.state.current_chat_id;

                        var today = new Date();
                        

                        quoted_obj.date = today;
                        quoted_obj.message_type = "accept";
                        quoted_obj.type = "bookingchat";
                        quoted_obj.message = message;

                        
                        socket.emit("sendMessage",quoted_obj);

                        var messages_info = this.state.messages_info;
                        quoted_obj.formatted_date = this.formatAMPM(today);
                        messages_info.push(quoted_obj);

                        var current_msg_index = messages_info.findIndex(x => x.message_id === message_id);
                        messages_info[current_msg_index].message.isActive = "false";

                        this.setState({
                            messages_info : messages_info,
                            scroll_bottom : false
                        },async ()=>{
                            // await socket.emit('sendMessage',{
                            //     "type":"bookingStatus",
                            //     "user_id": this.state.message_receiver_id,
                            //     "booking_id":this.state.current_chat_booking_id
                            // });
                            var chat_list_info = this.state.chat_list_info && this.state.chat_list_info.chats; 
                            var current_chat_index = chat_list_info.findIndex(x => x.chat_id === this.state.current_chat_id);

                            chat_list_info[current_chat_index].message.message = 'Service request has been accepted';
                            this.setState({ scroll_bottom : false })
                            var update_message = {};
                            var update_obj = {}; 
                            update_message.isActive = "false";
                            update_message.attachment = "";
                            update_message.booking_id = this.state.current_chat_booking_id && this.state.current_chat_booking_id;
                            update_message.lat = "";
                            update_message.lon = "";
                            update_message.message = messages_info[current_msg_index].message.message;
                            update_message.quote_price = (messages_info[current_msg_index].message.quote_price).toString();
                            update_message.type = "request";

                            update_obj.message_id = message_id;
                            update_obj.chat_id = this.state.current_chat_id && this.state.current_chat_id;
                            update_obj.message_type = 'request';
                            update_obj.user_id = this.state.message_receiver_id && this.state.message_receiver_id;
                            update_obj.date = messages_info[current_msg_index].date;
                            update_obj.user_name = messages_info[current_msg_index].user_name;
                            update_obj.user_image = messages_info[current_msg_index].user_image;
                            update_obj.receiver_id = this.state.user_info.user_id;
                            update_obj.type = 'updateChat';
                            update_obj.message = update_message;
                            socket.emit("sendMessage",update_obj);
                        })
                    }
                    else {
                        Toast.fire({
                            icon: 'warning',
                            title: i18next.t('Quote Already Accepted By User!')
                        });
                    }
                })
            }
            else if(res1.data.status_code === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
            else {
                this.setState({
                    tasker_btn_load : false,
                })
            }
        });
    }
    quote_price_request_ans = (booking_info,flag) => {
        this.setState({
            user_btn_load : true,
        })
        var booking_id = this.state.current_chat_booking_id && this.state.current_chat_booking_id;
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/bookingdetails/${booking_id}`)
        .then(res1 => {
            if(res1.data.status_code === 200)
            {
                var booking_status_info = this.state.booking_status_info && this.state.booking_status_info;
                booking_status_info.status = res1.data.booking_status;
                this.setState({
                    booking_details : res1.data,
                    booking_status_info : booking_status_info,
                    user_btn_load : false,
                },()=>{
                    if(res1.data.booking_status !== 'accepted') {
                        var quoted_obj = {};
                        var message = {};
                        var update_message = {};
                        var update_msg_obj = {};
                        var user_info = this.state.user_info && this.state.user_info;
                        var booking_status_info = this.state.booking_status_info && this.state.booking_status_info;
                        if(flag === 'accept') {
                            if(this.state.chat_info && this.state.chat_info.booking_type === 'marketplace') {
                                socket.emit("sendMessage",{ type : "quoteConfirmed",user_id : user_info.user_id, booking_id : booking_info.message.booking_id, price : booking_info.message.quote_price, receiver_id : this.state.message_receiver_id && this.state.message_receiver_id });
                            }
                            else {
                                socket.emit("sendMessage",{ type : "acceptNeed",user_id : user_info.user_id, booking_id : booking_info.message.booking_id, price : booking_info.message.quote_price, tasker_id : this.state.message_receiver_id && this.state.message_receiver_id, receiver_id : this.state.message_receiver_id && this.state.message_receiver_id });
                            }
                            booking_status_info.status = 'accepted';
                            this.setState({
                                booking_status_info : booking_status_info
                            },()=>{
                                // socket.emit('sendMessage',{
                                //     "type":"bookingStatus",
                                //     "user_id": this.state.message_receiver_id,
                                //     "booking_id":booking_info.message.booking_id
                                // });
                            })
                        }
                        message.type = flag;
                        message.message = '';
                        message.description = booking_info.message.description;
                        message.attachment = '';
                        message.lat = '';
                        message.lon = '';
                        message.quote_price = (booking_info.message.quote_price).toString();
                        message.price = booking_info.message.price;
                        message.isActive = "false";
                        message.booking_id = this.state.current_chat_booking_id && this.state.current_chat_booking_id;

                        quoted_obj.message_id = this.state.user_info.user_id+''+Math.floor(1000000000 + Math.random() * 9000000000);
                        quoted_obj.user_id = this.state.user_info.user_id;
                        quoted_obj.user_name = this.state.user_info.name;
                        quoted_obj.receiver_id = this.state.message_receiver_id && this.state.message_receiver_id;
                        quoted_obj.chat_id = this.state.current_chat_id && this.state.current_chat_id;

                        var today = new Date();

                        quoted_obj.date = today;
                        quoted_obj.message_type = flag;
                        quoted_obj.type = "bookingchat";
                        quoted_obj.message = message;

                    
                        socket.emit("sendMessage",quoted_obj);

                        var messages_info = this.state.messages_info;
                        
                        quoted_obj.formatted_date = this.formatAMPM(today);

                        messages_info.push(quoted_obj);
                        
                        var current_msg_index = messages_info.findIndex(x => x.message_id === booking_info.message_id);
                        messages_info[current_msg_index].message.isActive = "false";
                        this.setState({
                            messages_info : messages_info,
                            scroll_bottom : true
                        },()=>{
                            this.setState({ scroll_bottom : false })
                            update_message.type = 'quote';
                            update_message.description = booking_info.message.description;
                            update_message.price = booking_info.message.quote_price;
                            update_message.quote_price = (booking_info.message.quote_price).toString();
                            update_message.attachment = '';
                            update_message.lat = '';
                            update_message.lon = '';
                            update_message.isActive = "false";
                            update_message.booking_id = this.state.current_chat_booking_id && this.state.current_chat_booking_id;

                            update_msg_obj.message_id = booking_info.message_id;
                            update_msg_obj.date = booking_info.date;
                            update_msg_obj.user_id = this.state.message_receiver_id && this.state.message_receiver_id;
                            update_msg_obj.user_image = booking_info.user_image;
                            update_msg_obj.user_name = booking_info.user_name;
                            update_msg_obj.receiver_id = this.state.user_info.user_id;
                            update_msg_obj.chat_id = this.state.current_chat_id && this.state.current_chat_id;
                            update_msg_obj.message_type = 'quote';
                            update_msg_obj.type = "updateChat";
                            update_msg_obj.message = update_message;
                            socket.emit("sendMessage",update_msg_obj);

                            var chat_list_info = this.state.chat_list_info && this.state.chat_list_info.chats; 
                            var current_chat_index = chat_list_info.findIndex(x => x.chat_id === this.state.current_chat_id);

                            if(flag === 'accept') {
                                chat_list_info[current_chat_index].message.message = 'Service request has been accepted';
                            }
                            else {
                                chat_list_info[current_chat_index].message.message = 'Service request has been Declined';
                            }
                            
                        })
                    }
                    else {
                        Toast.fire({
                            icon: 'warning',
                            title: i18next.t('Quote Already Accepted By Tasker!')
                        });
                    }
                })
            }
            else if(res1.data.status_code === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
            else {
                this.setState({
                    user_btn_load : false,
                })
            }
        });
    }
    quote_price = (booking_info) => {
        this.setState({
            quote_btn_load : true,
        })
        var booking_id = this.state.current_chat_booking_id && this.state.current_chat_booking_id;
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/bookingdetails/${booking_id}`)
        .then(res1 => {
            if(res1.data.status_code === 200)
            {
                var booking_status_info = this.state.booking_status_info && this.state.booking_status_info;
                booking_status_info.status = res1.data.booking_status;
                this.setState({
                    booking_details : res1.data,
                    booking_status_info : booking_status_info,
                    quote_btn_load : false,
                },()=>{
                    if(res1.data.booking_status !== 'accepted') {
                        var booking_info_obj = booking_info;
                        this.setState({ quote_price_booking_info : booking_info_obj, quote_price_modal : true });
                    }
                    else {
                        Toast.fire({
                            icon: 'warning',
                            title: i18next.t('Quote Already Accepted By User!')
                        });
                    }
                })
            }
            else if(res1.data.status_code === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
            else {
                this.setState({
                    quote_btn_load : false,
                })
            }
        });
        
    }
    block_user = (flag) => {
        var obj = {};
        obj.type = "blockChat";
        obj.user_id = this.state.user_info && this.state.user_info.user_id; 
        obj.chat_id = this.state.current_chat_id && this.state.current_chat_id;
        obj.blocked = flag;
        socket.emit("sendMessage",obj);
        var chat_info = this.state.chat_info && this.state.chat_info;
        chat_info.block = flag;
        chat_info.blocked_by = obj.user_id;
        this.setState({
            chat_info : chat_info
        })
    }
    upload_files = () => {
        this.setState({
            uploading_file : true,
        })
        var user_info = this.state.user_info && this.state.user_info;
        var user_id = user_info.user_id;
        const fileInput = document.querySelector("#upload-files");
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        if (validImageTypes.includes(fileInput.files[0].type)) {
            if(fileInput.files[0].size <= 2001000) {
                const formData = new FormData();
                formData.append("media", fileInput.files[0]);
                formData.append("user_id", user_id);
                var url = '';
                if(user_info.type === 'tasker') {
                    url = `${process.env.REACT_APP_MEDIA_URL}/api/v1/tasker/chatupload`;
                }
                else {
                    url = `${process.env.REACT_APP_MEDIA_URL}/api/v1/user/chatupload`;
                }
                axios({
                    method: "post",
                    url: url,
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then (res => {
                    if(res.data.status_code === 200) {
                        var msg_obj = {};
                        var msg = {};
                        msg.attachment = res.data.media_url;
                        msg.booking_id = this.state.current_chat_booking_id && this.state.current_chat_booking_id;
                        msg.duration = "";
                        msg.lat = "";
                        msg.lon = "";
                        msg.message = "Image";
                        msg.quote_price = "";
                        msg.type = "image";

                        msg_obj.chat_id = this.state.current_chat_id && this.state.current_chat_id;
                        msg_obj.date = new Date();
                        msg_obj.message = msg;
                        msg_obj.message_id = user_info.user_id+''+Math.floor(1000000000 + Math.random() * 9000000000);
                        msg_obj.message_type = "image";
                        msg_obj.receiver_id = this.state.message_receiver_id && this.state.message_receiver_id;
                        msg_obj.type = "bookingchat";
                        msg_obj.user_id = user_info.user_id;
                        msg_obj.user_image = user_info.user_image;
                        msg_obj.user_name = user_info.name;

                        socket.emit('sendMessage',msg_obj);

                        msg_obj.formatted_date = this.formatAMPM(msg_obj.date);

                        var messages_info = this.state.messages_info && this.state.messages_info;

                        messages_info.push(msg_obj);

                        var chat_list_info = this.state.chat_list_info && this.state.chat_list_info.chats; 
                        var current_chat_index = chat_list_info.findIndex(x => x.chat_id === this.state.current_chat_id);

                        chat_list_info[current_chat_index].message.message = 'Image';

                        this.setState({
                            messages_info : messages_info,
                            scroll_bottom : true,
                            uploading_file : false, 
                        },()=>{
                            this.setState({ scroll_bottom : false })
                        })
                    } 
                    else {
                        Toast.fire({
                            icon: 'warning',
                            title: i18next.t('Image fail to upload!')
                        });
                        this.setState({
                            uploading_file : false,
                        })
                    }
                })
            }
            else {
                Toast.fire({
                    icon: 'warning',
                    title: i18next.t('Upload file size should be less than 2MB!')
                });
                this.setState({
                    uploading_file : false,
                })
            }
        }
        else {
            Toast.fire({
                icon: 'warning',
                title: i18next.t('Upload only Images!')
            });
            this.setState({
                uploading_file : false,
            })
        }
    }
    send_location_modal_open = () =>{
        var rm = this;
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            rm.setState({ lat:latitude,lon:longitude });
            var pos = {
                lat : latitude,
                lng : longitude
            }
            rm.setState({ position : pos,is_location_ModalVisible : true });
        }, function(error) {
            
            Toast.fire({
                icon: 'warning',
                title: "Please allow location, on Browser!"
            });
        });
    }
    send_location = () =>{
        var user_info = this.state.user_info && this.state.user_info;
        var msg_obj = {};
        var msg = {};
        msg.attachment = "";
        msg.booking_id = this.state.current_chat_booking_id && this.state.current_chat_booking_id;
        msg.duration = "";
        msg.lat = this.props.user_location.lat && this.props.user_location.lat;
        msg.lon = this.props.user_location.lng && this.props.user_location.lng;
        msg.message = "Location";
        msg.quote_price = "";
        msg.type = "location";

        msg_obj.chat_id = this.state.current_chat_id && this.state.current_chat_id;
        msg_obj.date = new Date();
        msg_obj.message = msg;
        msg_obj.message_id = user_info.user_id+''+Math.floor(1000000000 + Math.random() * 9000000000);
        msg_obj.message_type = "location";
        msg_obj.receiver_id = this.state.message_receiver_id && this.state.message_receiver_id;
        msg_obj.type = "bookingchat";
        msg_obj.user_id = user_info.user_id;
        msg_obj.user_image = user_info.user_image;
        msg_obj.user_name = user_info.name;

        socket.emit('sendMessage',msg_obj);

        msg_obj.formatted_date = this.formatAMPM(msg_obj.date);

        var messages_info = this.state.messages_info && this.state.messages_info;

        messages_info.push(msg_obj);

        this.setState({
            messages_info : messages_info,
            is_location_ModalVisible : false,
            scroll_bottom : true,
        },()=>{
            this.setState({ scroll_bottom : false })
            var chat_list_info = this.state.chat_list_info && this.state.chat_list_info.chats; 
            var current_chat_index = chat_list_info.findIndex(x => x.chat_id === this.state.current_chat_id);

            chat_list_info[current_chat_index].message.message = 'location';
        })
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
    get_admin_messages = (scroll_flag) =>{
        var user_info = this.state.user_info && this.state.user_info;
        var messages = this.state.messages_info;
        var chat_msg_paginate = this.state.chat_msg_paginate && this.state.chat_msg_paginate;
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/adminnotifications/${user_info.type}/web/${chat_msg_paginate}/10`)
        .then(async res => {
            if(res.data.status_code === 200)
            {
                const monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                await res.data.messages.map((j,k)=>{ // eslint-disable-line
                    var msg_chat = new Date(j.date);
                    var elapsed_date = '';
                    var month_name = monthNames[msg_chat.getMonth()];
                    var year = msg_chat.getFullYear();
                    var date = msg_chat.getDate();
                    var hours = msg_chat.getHours();
                    var minutes = ("00" + msg_chat.getMinutes()).slice(-2);
                    
                        elapsed_date = date+'.'+month_name+'.'+year+' '+hours+':'+minutes;
                   
                    
                    res.data.messages[k].formatted_date = elapsed_date;
                })
                var reversed_array = res.data.messages.reverse();
                // var messages_info = this.state.messages_info && this.state.messages_info;
                messages.unshift(reversed_array);
                
                var result = messages.flat();
                // messages_info.push(res.data.messages);
                // var result = messages_info.flat();
                this.setState({
                    messages_info: result,
                })
            }
            this.setState({
                chat_msg_loading : false,
            },()=>{
                if(scroll_flag === 'click') {
                    this.setState({
                        scroll_bottom : true,
                    },()=>{
                        this.setState({ scroll_bottom : false })
                    })
                } 
            })
        });
    }
    get_to_contactus_page = () => {
        this.props.history.push('/contactus/form');
    }
    enter_to_send_msg = (evt) => {
        if (evt.keyCode === 13 && !evt.shiftKey) {
            if(this.state.text_message.trim() === '') {
                this.setState({
                    text_message : ''
                })
            }
            this.send_text_message();
        }
    }
    view_map_modal = (i) => {
        this.setState({
            view_lat : i.message.lat,
            view_lon : i.message.lon,
            show_view_location_modal : true,
        })
    }
    view_location_modal_close = () => {
        this.setState({
            show_view_location_modal : false,
        })
    }
    render() {
        let btn_class = this.state.movesides === true ? "moveRight" : "moveLeft";
        return (
            <React.Fragment>
                {/* <UserHeader /> */}
                <div className="chatLayouter chatmargin">
                    <div className="row">
                        <section className="leftSide col-lg-3 col-md-4 col-sm-12 pr-0" >

                            <div className="head p-3">

                                <h3 class="fB mb-3">{ i18next.t('Chat') }</h3>

                                <div className="locationSearchTop mr-auto">
                                    {/* <div className="searchIcon" />
                                    <input type="text" className="locationSearcher" placeholder="Search People" /> */}
                                </div>

                            </div>
                            <SimpleBar style={{ height: 'calc(100vh - 173px)', overflowX: 'hidden' }}>
                                {
                                    this.state.chat_list_loading === true ?
                                    <div className="loadercls">
                                        <Loader
                                            type="ThreeDots"
                                            color="#10AB81"
                                            height={30}
                                            width={30}
                                        />
                                    </div>
                                    :
                                
                                <div className="chatUsers">
                                    {
                                        this.state.chat_list_info &&
                                        this.state.chat_list_info.chats.map((i,k)=> (
                                            <>
                                            {
                                                i.chat_type === 'admin' ?
                                            
                                            <div className={ i.chat_id === this.state.message_chat_id ? "cardOneStyle p-3 active_chat" : "cardOneStyle p-3" } key={k} onClick={(e)=>{ e.stopPropagation(); this.setState({ chat_msg_loading : true,message_chat_id : i.chat_id,chat_type : i.chat_type,messages_info : [], chat_msg_paginate : 0 },()=>{  this.get_admin_messages('click'); });  this.conversation_move();}}>
                                                <div className="detailsSection">
                                                    <div className="d-flex">
                                                        <div className="mr-3 position-relative">
                                                            <img className="profile-sm imgBg" src={require("../../assets/icons/id_logo.png")} height={40} width={55} alt="" />
                                                            {/* <div className="onlineStatus online" /> */}
                                                        </div>

                                                        <div className="details overflow-hidden w-100">
                                                            <div className="detailOne text-truncate ">{ i18next.t('Tudofyapp Team') }</div>
                                                            <div className="detailTwo text-truncate mb-1">{ i18next.t('Welcome to the Tudofyapp services') } </div>
                                                            <div className="font-vsm">{ i.formatted_date }</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div onClick={ (e)=>{ e.stopPropagation(); if(this.state.click_flag === true) { this.setState({ click_flag : false,chat_msg_loading : true,chat_type : i.chat_type,message_chat_id : i.chat_id,messages_info : [], chat_msg_paginate : 0 },()=> { this.get_chat_message_by_chat_id('click'); } ); }  this.conversation_move();  } } className={ i.chat_id === this.state.message_chat_id ? "cardOneStyle p-3 active_chat" : "cardOneStyle p-3" } key={k}>
                                                <div className="detailsSection">
                                                    <div className="d-flex">

                                                        <div className="mr-3 position-relative">
                                                            <img className="profile-sm imgBg" src={ i.user_image } height={40} onError={ this.service_image_err } width={55} alt="" />
                                                            <div className={ i.block === "false" && i.status === 1 ?  "onlineStatus online" : "onlineStatus away" }  />
                                                        </div>

                                                        <div className="details overflow-hidden w-100">
                                                            <div className="detailOne text-truncate">{ i.name }</div>
                                                            {
                                                                i.booking_id && i.message.message === '' ? 
                                                                <>
                                                                {
                                                                    i.booking_status === "requested" ?
                                                                    <>
                                                                    <div className="detailTwo text-truncate mb-1"> { i18next.t('Request for service Booking') } </div>
                                                                    
                                                                    </>
                                                                    :
                                                                    <div className="detailTwo text-truncate mb-1"> { i18next.t('Service Booking status.') } </div>
                                                                }
                                                                
                                                                </>
                                                                :
                                                                <div className="detailTwo text-truncate mb-1"> { i.message.message }</div>
                                                            }
                                                            <div className="font-vsm">{ i.formatted_date }</div>
                                                            
                                                            <div className="detailTwo text-truncate mb-1"> # {i.reference_id} </div>
                                                        </div>
                                                        {
                                                            i.unread_count !== '0' &&
                                                            
                                                            <div className="msgNotifi">{i.unread_count}</div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            }
                                            </>
                                        ))
                                    }
                                    
                                </div>
                                }
                            </SimpleBar>

                        </section>
                        {
                            this.state.chat_msg_loading === true ?
                            <div className={"rightSide col-lg-9 col-md-8 col-sm-12 pl-sm-0 centerloader vh-100 "+ btn_class }>
                                <Loader
                                    type="ThreeDots"
                                    color="#10AB81"
                                    height={50}
                                    width={50}
                                />
                                <div style={{ float:"left", clear: "both" }}
                                    ref={(el) => {  this.messagesEnd = el; }}>
                                </div>
                            </div>
                            :
                            <>
                            {
                                this.state.chat_type && this.state.chat_type !== 'admin' ?
                            
                                <section className={"rightSide col-lg-9 col-md-8 col-sm-12 p-1 pl-sm-0 "+ btn_class }>
                                    <div className="head d-flex justify-content-between align-items-center px-4 py-3">
                                        <div className="d-flex align-items-center">
                                                <div onClick={this.conversation_move} className="backArrow d-block d-md-none mr-3 cursorPointer" />
                                            <div className="cardOneStyle">
                                                <div className="detailsSection">
                                                    <div className="d-flex">
                                                        <div className="align-self-center mr-3">
                                                            <div className="d-flex justify-content-end">
                                                                <img className="profile-sm imgBg" src={ this.state.chat_info && this.state.chat_info.user_image } onError={ this.service_image_err } height={40} width={55} alt="" />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <div className="details">
                                                                <div className="detailOne text-truncate fM">{ this.state.chat_info && this.state.chat_info.name }</div>
                                                                {
                                                                    this.state.chat_info && this.state.chat_info.block === "false" &&
                                                                    <div className="font-sm text-truncate"> { (this.state.onlineStatus && this.state.onlineStatus.status === 1) ? 'Online' : (this.state.onlineStatus && this.state.onlineStatus.formatted_date)  && this.state.onlineStatus.formatted_date } </div>
                                                                
                                                                }
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            this.state.chat_info && this.state.chat_info.block === "false"  ?
                                            <Dropdown overlay={
                                            <Menu>
                                                <Menu.Item key="0">
                                                    <div className="" onClick={ (e)=>{ e.stopPropagation(); this.block_user('true'); } }> { i18next.t('Block') }</div>
                                                </Menu.Item>
                                            </Menu>
                                            } trigger={['click']} className="noBgDropdown">
                                                <Link className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <div className="ThreeDot" />
                                                </Link>
                                            </Dropdown>
                                            :
                                            this.state.user_info && this.state.chat_info && this.state.chat_info.block === "true" && this.state.chat_info.blocked_by === this.state.user_info.user_id  &&
                                            <Dropdown overlay={
                                            <Menu>
                                                <Menu.Item key="0">
                                                    <div className="" onClick={ (e)=>{ e.stopPropagation(); this.block_user('false'); } }> { i18next.t('Unblock') }</div>
                                                </Menu.Item>
                                            </Menu>
                                            } trigger={['click']} className="noBgDropdown">
                                                <Link className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <div className="ThreeDot" />
                                                </Link>
                                            </Dropdown>
                                        }
                                        

                                    </div>
                                    <div className="chatConversion">
                                        
                                        <SimpleBar style={{ height: 'calc(100vh - 235px)', overflowX: 'hidden' }} onScroll={this.handleScroll}>
                                            <div className="d-flex flex-column py-3 px-4" >
                                            {
                                                
                                                this.state.messages_info && this.state.messages_info.length > 0 &&
                                                this.state.messages_info.map((i,k)=> (
                                                    <>
                                                    { 
                                                        i.message_type === 'date' ?
                                                        <div className="dateShower" key={k}> { i.formatted_date } </div>
                                                        :
                                                        (i.message_type === 'cancel' || i.message_type === 'accept') ?
                                                        <div className="requestBox" key={k}>
                                                            {
                                                                i.message_type === 'cancel' ?
                                                                <div className="parent sender cursorPointer" onClick= { ()=>{ this.view_booking_details(i.message.booking_id) } }>
                                                                    <div className="d-flex">
                                                                        <div className="mr-3">
                                                                            <img src={ this.state.chat_info && this.state.chat_info.service_image } className="profile md imgBg" alt="" />
                                                                        </div>
                                                                        <div className="overflow-hidden">
                                                                            <p className="mb-0  fM primaryClr">{ i18next.t('Request is Decline') }</p>
                                                                            <p className="mb-0 text-truncate fM">Price: <span> {  this.state.general_info && this.state.general_info.currency_symbol }  { i.message.quote_price }</span></p>
                                                                            <p className="mb-0 text-truncate font-vsm">{ i.formatted_date }</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                :
                                                                i.message_type === 'accept' &&
                                                                <>
                                                                <div className="parent receiver cursorPointer" onClick= { ()=>{ this.view_booking_details(i.message.booking_id) } }>
                                                                    <div className="d-flex">
                                                                        <div className="mr-3">
                                                                            <img src={ this.state.chat_info && this.state.chat_info.service_image }  className="profile md imgBg" alt="" />
                                                                        </div>
                                                                        <div className="overflow-hidden">
                                                                            <p className="mb-0 fM greenTxtClr">{ i18next.t('Request is Accepted') }</p>
                                                                            <p className="mb-0 text-truncate fM">Price: <span>{  this.state.general_info && this.state.general_info.currency_symbol }  { i.message.quote_price }</span></p>
                                                                            <p className="mb-0 text-truncate font-vsm">{ i.formatted_date }</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {
                                                                    this.state.user_info && this.state.user_info.type === 'user' && (this.state.booking_status_info && this.state.booking_status_info.status !== 'paid' && this.state.booking_status_info.status !== 'started' && this.state.booking_status_info.status !== 'completed' && this.state.booking_status_info.status !== 'refunded'&& this.state.booking_status_info.status !== 'cancelled') &&
                                                                    
                                                                        <button className="Btns success rounded px-5" type="button" onClick={ this.booking_page }>{ i18next.t('Paynow') }</button>
                                                                }
                                                                </>
                                                            }
                                                        </div>
                                                        :
                                                        <div key={k} className={ i.user_id === this.state.user_info.user_id ? "sendingSection" : "receivedSection" }>
                                                            {
                                                                i.message_type === 'request' ?
                                                                <>
                                                                <div className="parent cursorPointer" onClick={ (e)=>{ e.stopPropagation(); this.view_booking_details(i.message.booking_id) } }> 
                                                                    <h6 className="mb-0 fM text-truncate">
                                                                        {
                                                                            this.state.user_info &&
                                                                            this.state.user_info.type === 'user' ?              
                                                                            i18next.t("Send request")
                                                                            :
                                                                            i18next.t("Request received")        
                                                                        }
                                                                        
                                                                    </h6>
                                                                    <div className="d-flex my-3">
                                                                        <div className="mr-2">
                                                                            <img src={ this.state.chat_info && this.state.chat_info.service_image } className="profile md imgBg" alt="" />
                                                                        </div>
                                                                        <p className="mb-0 text-truncate fM">{ this.state.chat_info && this.state.chat_info.service_name }</p>
                                                                    </div>
                                                                    <div className="priceBox mb-3">
                                                                        <h5 className="fM mb-0">{ i18next.t("Price")  }</h5>
                                                                        <h5 className="fM mb-0 primaryClr">{ this.state.general_info && this.state.general_info.currency_symbol } { i.message.quote_price }</h5>
                                                                    </div>
                                                                    <p className="mb-0"><span className="fM"></span> { i.message.message }</p>
                                                                </div>
                                                                {
                                                                    this.state.chat_info && this.state.chat_info.block === 'false' &&
                                                                    this.state.user_info && this.state.user_info.type === 'tasker' && 
                                                                    this.state.booking_status_info && 
                                                                    this.state.booking_status_info.status !== "refunded" &&this.state.booking_status_info.status !== "cancelled" && this.state.booking_status_info.status !== "completed" && this.state.booking_status_info.status !== "accepted" && this.state.booking_status_info.status !== "paid" && this.state.booking_status_info.status !== "started" &&
                                                                    i.message.isActive === "true" && 
                                                                    
                                                                    <div className="parent py-0">
                                                                        <div className="PayStatus">
                                                                            <button disabled = { this.state.tasker_btn_load } onClick={ (e)=> { e.stopPropagation(); this.tasker_price_isok(i.message.quote_price,i.message.description,i.message_id); } } className="fM greenTxtClr  border-right" type="button">{ this.state.tasker_btn_load === true ? <LoadingOutlined /> : i18next.t("Accept") }</button>
                                                                            <button disabled = { this.state.tasker_btn_load } className="fM" onClick={ (e)=> { e.stopPropagation(); this.quote_price(i); } } type="button">{ this.state.quote_btn_load === true ? <LoadingOutlined /> : i18next.t("Quote Price") }</button>
                                                                        </div>
                                                                    </div>
                                                                }
                                                                <div className="timeStamp"> { i.formatted_date } </div>
                                                                </>
                                                                :
                                                                i.message_type === 'quote' ?
                                                                <>
                                                                <div className="parent cursorPointer" onClick= { ()=>{ this.view_booking_details(i.message.booking_id) } }  >
                                                                    <h6 className="mb-0 fM text-truncate">
                                                                    { i18next.t("Request Quoted") }
                                                                    </h6>

                                                                    <div className="d-flex my-3">
                                                                        <div className="mr-2">
                                                                            <img src={this.state.chat_info && this.state.chat_info.service_image} className="profile md imgBg" alt="" />
                                                                        </div>
                                                                        <p className="mb-0 text-truncate fM">{this.state.chat_info && this.state.chat_info.service_name}</p>
                                                                    </div>
                                                                    <div className="priceBox mb-3">
                                                                        <h5 className="fM mb-0">Price</h5>
                                                                        <h5 className="fM mb-0 primaryClr">{ this.state.general_info && this.state.general_info.currency_symbol } { i.message.quote_price }</h5>
                                                                    </div>
                                                                    <p className="mb-0"><span className="fM">{ i18next.t("Message") } :</span> { i.message.description }</p>
                                                                </div>
                                                                {
                                                                    this.state.chat_info && this.state.chat_info.block === 'false' &&
                                                                    (this.state.user_info && this.state.user_info.type === 'user') && this.state.booking_status_info && 
                                                                    this.state.booking_status_info.status !== 'completed' && this.state.booking_status_info.status !== 'accepted' && this.state.booking_status_info.status !== 'cancelled' && this.state.booking_status_info.status !== 'paid' && this.state.booking_status_info.status !== 'started' &&
                                                                    i.message.isActive === "true" && 
                                                                    <div className="parent py-0">
                                                                        <div className="PayStatus">
                                                                            <button disabled = { this.state.user_btn_load } onClick={ (e)=> { e.stopPropagation(); this.quote_price_request_ans(i,'accept'); } } className="fM greenTxtClr  border-right" type="submit">{ this.state.user_btn_load === true ? <LoadingOutlined /> : i18next.t("Accept") }</button>
                                                                            <button disabled = { this.state.user_btn_load } className="fM primaryClr" onClick={ (e)=> { e.stopPropagation(); this.quote_price_request_ans(i,'cancel'); } } type="submit">{ this.state.user_btn_load === true ? <LoadingOutlined /> : i18next.t("Decline") }</button>
                                                                        </div>
                                                                    </div>
                                                                }
                                                                <div className="timeStamp">{ i.formatted_date } </div>
                                                                </>
                                                                :
                                                                i.message_type === 'image' ?
                                                                <>
                                                                <div className="parent cursorPointer">
                                                                <Zoom>
                                                                    <img alt="" src={ i.message.attachment } className="chat_image"/>
                                                                </Zoom>
                                                                </div>
                                                                <div className="timeStamp"> { i.formatted_date } </div>
                                                                </>
                                                                :
                                                                i.message_type === 'audio' ?
                                                                <>
                                                                <div className="parent cursorPointer">
                                                                <audio controls>
                                                                <source src={ i.message.attachment } type="audio/mpeg"/>
                                                                </audio>
                                                                </div>
                                                                <div className="timeStamp"> { i.formatted_date } </div>
                                                                </>
                                                                :
                                                                i.message_type === 'location' ?
                                                                <>
                                                                
                                                                <div className="parent cursorPointer" onClick={ ()=>{ this.view_map_modal(i) }  }>
                                                                    
                                                                    <img src={ `https://maps.googleapis.com/maps/api/staticmap?size=600x300&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&markers=color:red%7Clabel:%7C${i.message.lat},${i.message.lon}` } alt="" />
                                                                </div>
                                                                <div className="timeStamp">{ i.formatted_date }</div>
                                                                </>
                                                                :
                                                                i.message_type === 'text' &&
                                                                <>
                                                                <div className="parent white-spaces">
                                                                    { i.message.message }
                                                                </div>
                                                                
                                                                <div className="timeStamp"> { i.formatted_date }  </div>
                                                                </>
                                                                
                                                                
                                                            }
                                                            
                                                        </div>
                                                    }
                                                    </>
                                                ))
                                            }

                                                

                                            </div>
                                            <div style={{ float:"left", clear: "both" }}
                                                ref={(el) => {  this.messagesEnd = el; }}>
                                            </div>
                                        </SimpleBar>
                                    </div>
                                    {
                                        this.state.chat_info && this.state.chat_info.block === "false" && this.state.chat_info.booking_type !== "userneeds" && this.state.booking_status_info && this.state.booking_status_info.status !== "completed" && this.state.booking_status_info.status !== "cancelled" ?

                                        <div className="typingArea">
                                            <div className="chatBoxInput">
                                                <div className="d-flex w-100">
                                                    <textarea ref={(input) => { this.chat_text = input; }} onChange={ (e)=> { e.stopPropagation(); e.preventDefault(); this.setState({ text_message : e.target.value }) } } onKeyUp={ this.enter_to_send_msg } placeholder={ i18next.t("Write something...") }  value={this.state.text_message}></textarea>
                                                    <div className={this.state.text_message.length > 0 
                                                          ? "d-none d-sm-flex align-items-center mx-2 mx-sm-3" : "d-flex  align-items-center mx-2 mx-sm-3"} >
                                                        {
                                                            this.state.uploading_file === false ?
                                                            <>
                                                                <label for="upload-files" className="pinIcon mb-0 mr-2 mr-sm-3"></label>
                                                                <input type="file" name="files" accept="image/png, image/gif, image/jpeg" id="upload-files" onChange={ this.upload_files } className="d-none" />
                                                            </>
                                                            :
                                                            <LoadingOutlined style={{ fontSize: 26 }} className="primaryClr mb-0 mr-2 mr-sm-3"/>
                                                        }
                                                    <div />  
                                                        <div className="locationIcon" onClick={() => this.send_location_modal_open()} />
                                                    </div>
                                                </div>
                                                
                                                <div className={this.state.text_message.length > 0 
                                                          ? "d-flex  align-items-center fullWidth" : "d-none d-sm-flex align-items-center fullWidth"}>
                                                    <Button type="button" onClick={ this.send_text_message } className="PrimaryBtn lg" block>{ i18next.t("Send") }</Button>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        this.state.chat_info && this.state.chat_info.block === "false" && this.state.chat_info.booking_type === "userneeds" && this.state.booking_status_info && this.state.booking_status_info.status !== "completed" && this.state.booking_status_info.status !== "cancelled" && this.state.booking_details && Object.keys(this.state.booking_details.tasker).length === 0 ?
                                        <div className="typingArea">
                                            <div className="chatBoxInput">
                                                <div className="d-flex w-100">
                                                    <textarea ref={(input) => { this.chat_text = input; }} onChange={ (e)=> { e.stopPropagation(); e.preventDefault(); this.setState({ text_message : e.target.value }) } } onKeyUp={ this.enter_to_send_msg } placeholder={ i18next.t("Write something...") } value={this.state.text_message}></textarea>
                                                    <div className={this.state.text_message.length > 0 
                                                          ? "d-none d-sm-flex align-items-center mx-2 mx-sm-3" : "d-flex  align-items-center mx-2 mx-sm-3"} >
                                                    {
                                                        this.state.uploading_file === false ?
                                                        <>
                                                            <label for="upload-files" className="pinIcon mb-0 mr-2 mr-sm-3"></label>
                                                            <input type="file" accept="image/png, image/gif, image/jpeg" name="files" id="upload-files" onChange={ this.upload_files } className="d-none" />
                                                        </>
                                                        :
                                                        <LoadingOutlined style={{ fontSize: 26 }} className="primaryClr mb-0 mr-2 mr-sm-3"/>
                                                    }
                                                    <div />
                                                    <div className="locationIcon" onClick={() => this.send_location_modal_open()} />
                                                    </div>
                                                </div>
                                                <div className={this.state.text_message.length > 0 
                                                          ? "d-flex  align-items-center fullWidth" : "d-none d-sm-flex align-items-center fullWidth"}>
                                                    <Button type="button" onClick={ this.send_text_message } className="PrimaryBtn lg" block>{ i18next.t("Send") }</Button>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        this.state.user_info && this.state.booking_details && this.state.chat_info && this.state.chat_info.block === "false" && this.state.chat_info.booking_type === "userneeds" && this.state.booking_status_info && this.state.booking_status_info.status !== "completed" && this.state.booking_status_info.status !== "cancelled" && ( (this.state.user_info.type === 'tasker' && Object.keys(this.state.booking_details.tasker).length !== 0 && (this.state.user_info.user_id === this.state.booking_details.tasker.id) ) || (this.state.user_info.type === 'user' && Object.keys(this.state.booking_details.tasker).length !== 0 && (this.state.message_receiver_id === this.state.booking_details.tasker.id)))  ?
                                        <div className="typingArea">
                                            <div className="chatBoxInput">
                                                <div className="d-flex w-100">
                                                    <textarea ref={(input) => { this.chat_text = input; }} onChange={ (e)=> { e.stopPropagation(); e.preventDefault(); this.setState({ text_message : e.target.value }) } } onKeyUp={ this.enter_to_send_msg } placeholder={ i18next.t("Write something...") } value={this.state.text_message}></textarea>
                                                    <div className={this.state.text_message.length > 0 
                                                          ? "d-none d-sm-flex align-items-center mx-2 mx-sm-3" : "d-flex  align-items-center mx-2 mx-sm-3"} >
                                                    {
                                                        this.state.uploading_file === false ?
                                                        <>
                                                            <label for="upload-files" className="pinIcon mb-0 mr-2 mr-sm-3"></label>
                                                            <input type="file" accept="image/png, image/gif, image/jpeg" name="files" id="upload-files" onChange={ this.upload_files } className="d-none" />
                                                        </>
                                                        :
                                                        <LoadingOutlined style={{ fontSize: 26 }} className="primaryClr mb-0 mr-2 mr-sm-3"/>
                                                    }
                                                    <div />
                                                        <div className="locationIcon" onClick={() => this.send_location_modal_open()} />
                                                    </div>
                                                </div>
                                                <div className={this.state.text_message.length > 0 
                                                          ? "d-flex  align-items-center fullWidth" : "d-none d-sm-flex align-items-center fullWidth"}>
                                                    <Button type="button" onClick={ this.send_text_message } className="primaryBtn lg" block>{ i18next.t("Send") } </Button>
                                                </div>
                                            </div>
                                        </div>

                                        :
                                        this.state.chat_info && this.state.chat_info.block === "true" ?
                                        <div className="typingArea">
                                            <div className="chatBoxInput">
                                                    {
                                                        this.state.user_info && this.state.user_info.type === "tasker" && this.state.chat_info.blocked_by === this.state.user_info.user_id ? 
                                                        
                                                        <div className="blocker-div">
                                                            <strong>{ i18next.t("Chat blocked by You") }</strong>
                                                        </div>
                                                        :
                                                        this.state.user_info && this.state.user_info.type === "user" && this.state.chat_info.blocked_by === this.state.user_info.user_id ? 
                                                        <div className="blocker-div">
                                                            <strong>{ i18next.t("Chat blocked by You") }</strong>
                                                        </div>
                                                        :
                                                        this.state.user_info && this.state.user_info.type === "user" && this.state.chat_info.blocked_by !== this.state.user_info.user_id ? 
                                                    
                                                        <div className="blocker-div">
                                                            <strong>{ i18next.t("Chat blocked by Tasker") }</strong>
                                                        </div>
                                                        :
                                                        this.state.user_info && this.state.user_info.type === "tasker" && this.state.chat_info.blocked_by !== this.state.user_info.user_id &&
                                                    
                                                        <div className="blocker-div">
                                                            <strong>{ i18next.t("Chat blocked by User") }</strong>
                                                        </div>
                                                    }
                                            </div>
                                        </div>
                                        :
                                        this.state.chat_info && this.state.chat_info.userStatus === 2 ?
                                        <div className="typingArea">
                                            <div className="chatBoxInput">
                                                    {
                                                         <div className="blocker-div">
                                                             <strong>{ i18next.t("This Account has been deleted.") }</strong>
                                                          </div>                                                       
                                                    }
                                            </div>
                                        </div>
                                        :
                                        <div className="typingArea">
                                            <div className="chatBoxInput">
                                            {
                                                this.state.booking_details && this.state.user_info && this.state.user_info.type ===  'tasker' && this.state.chat_info && this.state.booking_status_info && this.state.chat_info.booking_type === "userneeds" && Object.keys(this.state.booking_details.tasker).length !== 0 && ((this.state.user_info.user_id) !== (this.state.booking_details.tasker.id)) ?
                                        
                                                <div className="blocker-div">
                                                    <strong>{ i18next.t("Expired") }</strong>
                                                </div>
                                                :
                                                this.state.booking_details && this.state.user_info && this.state.user_info.type ===  'user' && this.state.chat_info && this.state.booking_status_info && this.state.chat_info.booking_type === "userneeds" && Object.keys(this.state.booking_details.tasker).length !== 0 && (this.state.message_receiver_id !== this.state.booking_details.tasker.id) ?
                                        
                                                <div className="blocker-div">
                                                    <strong>{ i18next.t("Expired") }</strong>
                                                </div>
                                                :
                                                this.state.booking_status_info && this.state.booking_status_info.status === 'completed' ?
                                                
                                                <div className="blocker-div">
                                                    <strong>{ i18next.t("Service Completed") }</strong>
                                                </div>
                                                :
                                                this.state.booking_status_info && this.state.booking_status_info.status === 'cancelled' &&
                                                
                                                <div className="blocker-div">
                                                    <strong>{ i18next.t("Service Cancelled") }</strong>
                                                </div>
                                            }
                                            </div>
                                        </div>
                                        
                                    }
                                </section>
                                :
                                <section className={"rightSide col-lg-9 col-md-8 col-sm-12 pl-sm-0 "+ btn_class }>
                                    <div className="head d-flex justify-content-between align-items-center px-4 py-3">
                                        <div className="d-flex align-items-center">
                                                <div onClick={this.conversation_move} className="backArrow d-block d-md-none mr-3" />
                                            <div className="cardOneStyle">
                                                <div className="detailsSection">
                                                    <div className="d-flex">
                                                        <div className="align-self-center mr-3">
                                                            <div className="d-flex justify-content-end">
                                                                <img className="profile-sm imgBg" src={require("../../assets/icons/id_logo.png")} height={40} width={55} alt="" />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <div className="details">
                                                                <div className="detailOne text-truncate fM">{ i18next.t("Tudofyapp team") }</div>
                                                                <div className="font-sm text-truncate">  </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="chatConversion">
                                        <SimpleBar style={{ height: 'calc(100vh - 235px)', overflowX: 'hidden' }} onScroll={this.handleScroll}>
                                            <div className="d-flex flex-column py-3 px-4">
                                                {/* <div className="dateShower"> Today </div> */}
                                            {
                                                this.state.messages_info && this.state.messages_info.length > 0 &&
                                                this.state.messages_info.map((i,k)=> (
                                                    <>
                                                    { 
                                                    <div className="receivedSection">
                                                        <div className="parent">
                                                            <span>{i.message && i.message.message}</span>
                                                        </div>
                                                        <div className="timeStamp"> { i.formatted_date }  </div>
                                                    </div>
                                                    }
                                                    </>
                                                ))
                            
                                            }
                                            </div>
                                            <div style={{ float:"left", clear: "both" }}
                                                ref={(el) => {  this.messagesEnd = el; }}>
                                            </div>
                                        </SimpleBar>
                                    </div>
                                    <div className="typingArea">
                                        <div className="chatBoxInput">
                                            <div className="contact-block-div" onClick={ this.get_to_contactus_page }>
                                                <strong>{ i18next.t("Contact us") }</strong>
                                            </div>
                                        </div>
                                    </div>

                                </section>
                            }
                            </>
                        }
                        
                        
                        <Modal title="Location" onCancel={this.location_modal_close} footer={[<Button onClick={this.send_location}>{ i18next.t("Send Location") }</Button>,<Button onClick={this.location_modal_close}>{ i18next.t("Close") }</Button>]} visible={this.state.is_location_ModalVisible} >
                                <div className="h-330">
                                    <Map
                                        google={ this.props.google && this.props.google }
                                        center={ this.state.position && this.state.position }
                                        height='300px'
                                        zoom={15}
                                    />
                                </div>
                        </Modal>

                        <Modal title="View Location" footer={[<Button onClick={this.view_location_modal_close}>{ i18next.t("Close") }</Button>]} onCancel={this.view_location_modal_close} visible={this.state.show_view_location_modal} >
                                <div className="h-330">
                                    {
                                        this.state.show_view_location_modal === true &&
                                        <Map
                                            google={ this.props.google && this.props.google }
                                            center={ this.state.view_lat && { lat : parseFloat(this.state.view_lat), lng : parseFloat(this.state.view_lon) } }
                                            height='300px'
                                            zoom={15}
                                        />
                                    }
                                    
                                </div>
                        </Modal>

                        <Modal title="Quote your price" onCancel={this.quote_price_modal_close} footer={[<Button className="Btns PrimaryBtn lg" disabled={this.state.is_disabled} onClick={this.send_quote_price}>{ this.state.is_disabled === true ? <LoadingOutlined /> : i18next.t("Send") }</Button>,<Button onClick={this.quote_price_modal_close} className="md">{ i18next.t("Close") }</Button>]} visible={this.state.quote_price_modal} >

                            <div className="parent"> 
                                {/* <h6 className="mb-0 fM text-truncate">Send request for Cleaning</h6> */}
                                <div className="d-flex my-3">
                                    <div className="mr-2">
                                        <img src={ this.state.chat_info && this.state.chat_info.service_image } className="profile md imgBg" alt="" />
                                    </div>
                                    <p className="mb-0 text-truncate fM">{ this.state.chat_info && this.state.chat_info.service_name  ? this.state.chat_info && this.state.chat_info.service_name  : 'empty' }</p>
                                </div>
                                <div className="priceBox mb-3">
                                    <h5 className="fM mb-0">Ask Price</h5>
                                    <h5 className="fM mb-0 primaryClr">{ this.state.general_info && this.state.general_info.currency_symbol } { this.state.quote_price_booking_info && this.state.quote_price_booking_info.message.quote_price  }</h5>
                                </div>
                                <p className="mb-0"><span className="fM">{ i18next.t("Description") } :</span> { this.state.quote_price_booking_info && this.state.quote_price_booking_info.message.message }</p>
                            </div>

                            <div>
                                <p className="mb-3 fM">{ i18next.t("Your offer Price") } </p>
                                <Input inputMode="decimal" size="large" onChange={ this.isNumber } value={ this.state.tasker_quoted_price && this.state.tasker_quoted_price } autoComplete="off" addonBefore={<div className="">{ this.state.general_info && this.state.general_info.currency_symbol }</div>} placeholder={ i18next.t("Minimum price is")+" "+this.state.general_info.currency_symbol+" "+this.state.general_info.minimum_payment_price }/>
                                <p className="text-danger">{this.state.tasker_quoted_price_err}</p>
                                <p className="mb-3 fM">{ i18next.t("Description") }</p>
                                <TextArea
                                    placeholder={ i18next.t("Enter details") }
                                    onChange={(e)=> { this.setState({ tasker_quoted_desc : e.target.value }) }}
                                    value={ this.state.tasker_quoted_desc }
                                />
                                <p className="text-danger">{ this.state.tasker_quoted_desc_err && this.state.tasker_quoted_desc_err }</p>
                            </div>
                        </Modal>
                    </div>
                </div>

            </React.Fragment>

        );
    }
}

export default connect(mapStateToProps,null,null,{forwardRef:true})(Chat);