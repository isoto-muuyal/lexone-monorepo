import React, { Component } from 'react';
import { Button,Modal,Rate } from 'antd';
import FloatingInputs from "../../../components/FloatingLabel";
import Breadcremb from '../../../components/BreadCremb';
import axios from 'axios';
import MetaDecorator from '../../../components/MetaDecorator';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
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
class ProHowItWork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            general_info:{},
            service_calc: [],
            category_info : {},
            user_info : {},
            sum_of_service_charge : 0,
            serivce_err : '',
            show: true,
            m_ex_err : 0,
            form_has_err : false,
            is_phone_number_ModalVisible : false,
            uiconfig_state : {},
            howit_active : true,
            about_active : false,
            review_active : false,
            faq_active : false,
            review_page : 0,
            cat_reviews : [],
            is_loading : true,
            has_loadmore : true,
        }
    }
    
    componentDidMount () {
        const general_info = JSON.parse(localStorage.getItem('general_info'));
        this.setState({
            cat_id : this.props.match.params.cat_id,
            sub_cat_id : this.props.match.params.sub_cat_id,
            user_info : JSON.parse(localStorage.getItem('user')),
            general_info : general_info
        },()=> {
            this.get_service_list_by_id();
            this.get_reviews_by_category_id();
            this.get_subcategory_by_id();
            this.get_subcategory_details();
            this.get_category_by_id();
        })
        
    }
    IncrementItem = (index) => {
        var alloc_service_state = this.state.allocated_services;
        if(parseInt(alloc_service_state[index].per_count) < 10) {
            var per_price = alloc_service_state[index].service_price;
            alloc_service_state[index].per_count = alloc_service_state[index].per_count + 1;
            var price_with_qty = per_price * alloc_service_state[index].per_count;
            alloc_service_state[index].sum_with_count = price_with_qty;
            this.setState({ allocated_services : alloc_service_state });
            this.sum_all_service_cost();
        }
        else {
            Toast.fire({
                icon: 'warning',
                title: i18next.t('Maximum limit reached')
            });
        }
        
    }
    DecreaseItem = (index) => {
        var alloc_service_state = this.state.allocated_services;
        var per_price = alloc_service_state[index].service_price;
        if(alloc_service_state[index].per_count > 0) {
            alloc_service_state[index].per_count = alloc_service_state[index].per_count - 1;
            var price_with_qty = per_price * alloc_service_state[index].per_count;
            alloc_service_state[index].sum_with_count = price_with_qty;
        } 
        this.setState({ allocated_services : alloc_service_state });
        this.sum_all_service_cost();
    }
    sum_all_service_cost = () => {
        var sum = 0;
        var alloc_service_state = this.state.allocated_services;
        for (let index = 0; index < alloc_service_state.length; index++) {
            sum = sum + alloc_service_state[index].sum_with_count;
        } 
        this.setState({ sum_of_service_charge : sum.toFixed(2) });
    }
    get_service_list_by_id = () => {
        var cat_id = this.state.cat_id && this.state.cat_id;
        var sub_cat_id = this.state.sub_cat_id && this.state.sub_cat_id;
        const config = {
            headers : {
                "Content-type" : "application/x-www-form-urlencoded"
            }
        }

        const params = new URLSearchParams();
        params.append('parent_category_id',cat_id);
        params.append('subcategory_id',sub_cat_id);

        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/services`,params,config)
        .then(res => {
            if(res.data.status_code === 200) {
                this.setState({ services : res.data.services })
                this.allocate_service_states();
            }
            else {
                this.props.history.push('/unknown')
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.cat_id !== this.props.match.params.cat_id) {
            
            const cat_id = nextProps.match.params.cat_id;
            const sub_cat_id = nextProps.match.params.sub_cat_id;
            this.setState({
                cat_id : cat_id,
                sub_cat_id : sub_cat_id,
                cat_reviews : [],
                review_page : 0
            },()=> {
                this.get_service_list_by_id();
                this.get_reviews_by_category_id();
                this.get_subcategory_by_id();
                this.get_subcategory_details();
                this.get_category_by_id();
            })
        }
    }
    get_category_by_id = () => {
        var cat_id = this.state.cat_id && this.state.cat_id;
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
                if(res.data.status_code === 200) {
                    this.setState({ category_info : res.data.category[0],is_loading : false  })
                }
            });
        }
    }
    image_load_err = (ev) => {
        ev.target.src = require('../../../assets/images/default_service_image.png');
    }
    push_itemCount = () => {
        var service_calc = [];
        service_calc.push({ per_count : 0, item_price : 0, sum_with_count : 0 });
        this.setState({ service_calc : service_calc })
    }
    allocate_service_states = () => {
        if(this.props.location.state === undefined) {
            var services = this.state.services;
            var assign_serivces = [];
            if(services) {
                for (let index = 0; index < services.length; index++) {
                    assign_serivces.push({ 
                        service_index : index,
                        service_id : services[index].service_id, 
                        service_name : services[index].service_name, 
                        service_image : services[index].service_image, 
                        service_price : services[index].service_price, 
                        service_pricing : services[index].service_pricing, 
                        per_count : 0,
                        item_price : 0,
                        sum_with_count : 0,
                        category_id : this.state.cat_id && this.state.cat_id,
                        sub_category_id : this.state.sub_cat_id && this.state.sub_cat_id
                    })
                }
            }
            this.setState({ allocated_services : assign_serivces });
        }
        else {
            this.setState({
                allocated_services : this.props.location.state
            },()=>{
                this.sum_all_service_cost();
            })
        }
        
    }
    validate_professional_service = () => {
        var alloc_service_state = this.state.allocated_services;
        var has_value = 0;
        var err = 0;
        if(alloc_service_state) {
            for (let index = 0; index < alloc_service_state.length; index++) {
                if(alloc_service_state[index].per_count > 0)
                {
                    has_value++;
                }
            }
        }
        if(has_value === 0) {
            this.setState({ serivce_err : i18next.t('Select Atleast One service!') });
            err++;
        }
        else if(!this.state.user_info.mobile) {
            this.setState({is_phone_number_ModalVisible : true, update_mobile_number : '', update_mobile_number_err : '' });
            err++;
        }
        else {
            this.setState({ serivce_err : '' });
        }
        if(err === 0) {
            this.props.history.push('/user/booking', this.state.allocated_services);
        }
    }
    push_to_login_page = () => {
        var obj = {};
        obj.pre_url = this.props.location.pathname;
        obj.allocated_services = this.state.allocated_services && this.state.allocated_services;
        this.props.history.push('/user/user-login',obj);
    }
    save_phone_number_modal_close = () => {
        this.setState({is_phone_number_ModalVisible : false, form_has_err:false});
    }
    firebaseui_loads() {
        const config = {
            apiKey: 'AIzaSyDsdhQtGhqeF4Vyu27oeQFct8WnV9LdvWs',
            authDomain: 'idemand-200b7.firebaseapp.com',
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
                    // defaultNationalNumber: rm.state.update_mobile_number,
                }
            ],
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    var verified_phone_no = authResult['user']['phoneNumber'];
                    // rm.save_mobile_number();
                    rm.setState({update_mobile_number : verified_phone_no, form_has_err : false })
                }	
            }
        };
        this.setState({
            uiconfig_state : uiconfig,
        })
    }
    save_mobile_number = () => {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
       
        const params = new URLSearchParams()
        params.append('user_id', this.state.user_info.user_id);
        params.append('mobile', this.state.update_mobile_number);
        
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/profile`, 
        params,config)
            .then(res => {
                if(res.status === 200) {
                    if(res.data.status_code === 200){
                        // history.replaceState('/user/user-login/1');
                        
                        localStorage.removeItem('user');
                        var user_info = this.state.user_info;
                        user_info.mobile = this.state.update_mobile_number;
                        this.setState({ user_info : user_info, is_phone_number_ModalVisible : false });
                        localStorage.setItem('user', JSON.stringify(user_info));
                        Toast.fire({
                            icon: 'success',
                            title: i18next.t('Updated successfully')
                        });
                    }
                    else if(res.data.status_code === 400){
                        this.setState({update_mobile_number_err: res.data.message});
                        Toast.fire({
                            icon: 'warning',
                            title: res.data.message
                        });
                    }
                    else {
                        Toast.fire({
                            icon: 'warning',
                            title: 'Something Went Wrong!'
                        });
                        this.setState({update_mobile_number_err: 'Something Went Wrong!',form_has_err: false});
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
    update_mobile_number_validation = () => {
        var mobile = this.state.update_mobile_number;
        var err = 0;
        if(mobile.trim() === '') {
            this.setState({update_mobile_number_err : i18next.t('Mobile Number is required!')});
            err++;
        }
        else if(this.state.m_ex_err !== 0) {
            this.setState({update_mobile_number_err: i18next.t('Mobile Already exists')});
            err++;
        }
        else {
            this.setState({ update_mobile_number_err : '' });
        }

        if(err===0) {
            this.save_mobile_number();
        }
    }
    mobile_already_exists = () => {
        var mobile = this.state.update_mobile_number;
        
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
                    if(res.data.status_code === 200){
                        this.setState({m_ex_err: 0});
                    }
                    else if(res.data.status_code === 400){
                        this.setState({update_mobile_number_err: res.data.message});
                        this.setState({m_ex_err: 1});
                    }
                    else {
                        this.setState({update_mobile_number_err: 'Something Went Wrong!'});
                        this.setState({m_ex_err: 1});
                    }
                })
        }
    }
    get_subcategory_by_id = () => {
        var sub_cat_id = this.state.sub_cat_id && this.state.sub_cat_id;
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
                if(res.data.status_code === 200) {
                    this.setState({ subcat_info : res.data })
                }
            });
        }
    }
    show_blocks_based_on_flag = (flag) => {
        if(flag === 'how_it_works') {
            this.setState({ 
                howit_active : true,
                about_active : false,
                review_active : false,
                faq_active : false 
            })
        }
        else if(flag === 'about') {
            this.setState({ 
                howit_active : false,
                about_active : true,
                review_active : false,
                faq_active : false 
            })
        }
        else if(flag === 'review') {
            this.setState({ 
                howit_active : false,
                about_active : false,
                review_active : true,
                faq_active : false 
            })
        }
        else if(flag === 'faq') {
            this.setState({ 
                howit_active : false,
                about_active : false,
                review_active : false,
                faq_active : true 
            })
        }
    }
    get_subcategory_details = () => {
        var cat_id = this.state.cat_id && this.state.cat_id;
        if(cat_id !== '') {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams()
             params.append('parent_category_id', cat_id)
             
                axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/subcategories`,params,config)
                .then (res=>{
                if(res.data.status_code === 200) {
                    this.setState({ 
                        subcategories : res.data.subcategory,
                        subcat_data : res.data
                    })
                }
                });
        }
    }
    get_reviews_by_category_id = () => {
        var cat_id = this.state.cat_id && this.state.cat_id;
        
        var review_page = this.state.review_page;
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/reviews/category/${cat_id}/${review_page}/10`)
        .then (res=>{
        if(res.data.status_code === 200) {
            var all_reviews = this.state.cat_reviews;
            all_reviews.push(res.data.items);
            this.setState({ 
                cat_reviews : all_reviews,
                review_page : this.state.review_page + 10
            })
            if(res.data.items.length === 0 || res.data.items.length < 10) {
                this.setState({
                    has_loadmore : false
                })
            }
        }
        else {
            this.setState({
                has_loadmore : false
            })
        }
        });
    }
    render() {
        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title='| Tasker Signup' description="IDemand Tasker Signup Page"/>
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
                    <>
                    <section>
                    <div className="innerPage">
                        <div className="container">
                            <div className="d-flex flex-wrap">

                                <a onClick={ (e) => { e.stopPropagation(); this.show_blocks_based_on_flag('how_it_works'); } } className={ this.state.howit_active === true ? 'active' : '' }><p className="mb-0 ">{ i18next.t('How It Work') }</p></a>

                                <a onClick={ (e) => { e.stopPropagation(); this.show_blocks_based_on_flag('about'); } } className={ this.state.about_active === true ? 'active' : '' }><p className="mb-0">{ i18next.t('About') }</p></a>
                                {  
                                    this.state.category_info && this.state.category_info.parent_category_type === 'professional' &&

                                    <a onClick={ (e) => { e.stopPropagation(); this.show_blocks_based_on_flag('review'); } } className={ this.state.review_active === true ? 'active' : '' } ><p className="mb-0">{ i18next.t('Review') }</p></a>
                                }

                                <a onClick={ (e) => { e.stopPropagation(); this.show_blocks_based_on_flag('faq'); } } className={ this.state.faq_active === true ? 'active' : '' }><p className="mb-0">{ i18next.t('FAQ') }</p></a>
                            </div>
                        </div>
                    </div>
                    </section>
                    <div className="container">
                        <div className="mb-3">
                            <Breadcremb flag="category" category_id={this.state.cat_id && this.state.cat_id} sub_category_id={this.state.sub_cat_id && this.state.sub_cat_id} />
                        </div>
                        <div className="innerContent">
                            <div className="row">
                                <div className="col-lg-7 col-md-12">
                                { this.state.subcat_data && 
                                    <section className="">
                                        {
                                            this.state.howit_active === true ?
                                            <div className="border roundedFivePx">
                                                <h5 className="fM mb-0 p-3 border-bottom">{ i18next.t('How It Work') }</h5>
                                                <div className="py-4">
                                                    <div className="d-flex align-items-center px-3">
                                                        <div className="d-flex position-relative ckeditor_cont_div" dangerouslySetInnerHTML={{__html: this.state.subcat_data.how_it_works && this.state.subcat_data.how_it_works }} >
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            this.state.about_active === true  ? 
                                            <div className="border roundedFivePx">
                                            
                                                <h5 className="fM mb-0 p-3 border-bottom">{ i18next.t('About') }</h5>

                                                <div className="py-4">
                                                    <div className="d-flex align-items-center px-3">
                                                        <div className="d-flex position-relative ckeditor_cont_div"  dangerouslySetInnerHTML={{__html: this.state.subcat_data.about_task && this.state.subcat_data.about_task }}>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            :
                                            this.state.review_active === true  ?
                                            <div className="border roundedFivePx">
                                                <h5 className="fM mb-0 p-3 border-bottom">{ i18next.t('Review') }</h5>
                                                <div className="p-3">
                                                { this.state.cat_reviews[0] ? 
                                                this.state.cat_reviews[0].map((i,k) => {
                                                return (
                                                <React.Fragment>
                                                    <div className="row mb-3">
                                                        <div className="d-flex col-sm-9 col-lg-10">
                                                            <div className="pl-0 pr-3 mt-1">
                                                                <img className="profile-sm imgBg" onError={this.image_load_err} src={i.user_image} height={35} width={55} alt="" />
                                                            </div>

                                                            <div className="pr-2 mr-auto">
                                                                <div className="details">
                                                                    <div className="detailOne">{i.name}</div>
                                                                    <div className="font-sm lightTxtClr"></div>
                                                                    <div className="detailTwo d-flex">
                                                                        <div className="singleStar align-self-center"><Rate allowHalf defaultValue = {parseFloat(i.rating)} disabled/> </div>
                                                                        <span className="align-self-center m-t-5 ml-2"> </span>
                                                                    </div>
                                                                    <div className="font-sm mt-1">{i.description}</div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-sm-3 col-lg-2 pt-md-0 pt-3">
                                                            <div className="font-sm text-sm-right">
                                                            
                                                            {
                                                                i.elapsed_date
                                                            }
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <hr />
                                                </React.Fragment>
                                                )
                                                }
                                                )
                                                :
                                                <div className="d-grid place-items-center vh-50">
                                                    <div>
                                                        <img src={require("../../../assets/images/placeholder_logos(2).png")} alt=""
                                                            className="placelogo-cls " />
                                                        <div className="text-center font-xl py-3 fM">{ i18next.t('No Reviews Found!') }</div>   
                                                    </div>     
                                                </div>
                                                }
                                                </div>
                                                {
                                                    this.state.has_loadmore === true &&
                                                    <div className="m-3">
                                                        <button onClick={ (e)=> { e.stopPropagation(); this.get_reviews_by_category_id();  }  } type="button" className="loadMoreServices border-0 w-100">{ i18next.t('Load more') }</button>
                                                    </div>
                                                }
                                                
                                            </div>
                                            :
                                            this.state.faq_active === true  &&
                                            <div className="border roundedFivePx">
                                                <h5 className="fM mb-0 p-3 border-bottom">{ i18next.t('FAQ') }</h5>

                                                <div className="py-4">
                                                    <div className="d-flex align-items-center px-3">
                                                        <div className="d-flex position-relative ckeditor_cont_div" dangerouslySetInnerHTML={{__html: this.state.subcat_data.faq && this.state.subcat_data.faq }}>
                                                            
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        }
                                        

                                        
                                        
                                    </section>
                                    }
                                </div>
                                <div className="col-lg-5 col-md-12 mt-lg-0 mt-4">
                                    {/* <TaskBox service_info = {this.state.services} /> */}
                                    <section className="rightSideBox">
                                        <h5 class="title">{this.state.subcat_info && this.state.subcat_info.category[0].subcategory_name }</h5>
                                        <div className="rightsidebox_content">
                                            <div class="content">
                                                {
                                                this.state.allocated_services && this.state.allocated_services.length > 0 ?
                                                this.state.allocated_services.map((i) => {
                                                    
                                                    return (
                                                        <div key={i.service_id}>
                                                            <div className="row">
                                                                <div className="col-sm-8 pr-0 d-flex">
                                                                    <div className="mr-3">
                                                                        <img onError={this.image_load_err} src={i.service_image} alt="" className="imgBg profile-sm" />
                                                                    </div>
                                                                    <div className="font-sm overflow-hidden">
                                                                        <p className="mb-1 text-truncate">{i.service_name}</p>
                                                                        <p className="mb-1 fB">{this.state.general_info.currency_symbol} {i.service_price}/{i.service_pricing}</p>
                                                                        {/* <div className="d-flex">
                                                                            <span className="greenStar"></span><div className="align-self-center"><span className="greenTxtClr fM">3.6</span> ( 152 Ratings )</div>
                                                                            </div> */}
                                                                    </div>
                                                                </div>
                                                                <div key={i.service_id} className="col-sm-4 align-self-end">
                                                                    <div className="quantity d-flex">
                                                                        <button className="decrement" onClick={ (e) => { e.stopPropagation(); this.DecreaseItem(i.service_index) } } />
                                                                        <button className="countBtn"> {this.state.show ? <span>{ i.per_count === 0 ? "Add" : i.per_count }</span> : ''}</button>
                                                                        <button className="increment" onClick={ (e) => { e.stopPropagation(); this.IncrementItem(i.service_index) } } />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                        </div>
                                                    )
                                                })
                                                :
                                                <div className="centerloader">
                                                    No services found!
                                                </div>
                                                }
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <Button type="button" onClick={ this.state.user_info ? this.validate_professional_service : this.push_to_login_page } className="d-flex justify-content-between align-items-center Btns PrimaryBtn lg fM" block><span>{this.state.general_info.currency_symbol} {this.state.sum_of_service_charge}</span><span>{ this.state.user_info ? 'Next' : 'Login' }</span></Button>
                                            <p className="text-danger">{ this.state.serivce_err }</p>
                                        </div>  
                                    </section>
                                 
                                    <Modal title="Mobile Number is Required for this service!" onCancel={this.save_phone_number_modal_close} visible={this.state.is_phone_number_ModalVisible} footer={[
                                    <Button onClick={this.save_phone_number_modal_close}>Close</Button>
                                    ]}>
                                        <div  className="floatingLabelStyle p-4 py-5 px-sm-5 text-center">
                                        { this.state.form_has_err === false ? 
                                            <div>
                                            <FloatingInputs labelName="Mobile Number">
                                                <input type="text" placeholder=" " onChange={(e) => this.setState({update_mobile_number : e.target.value})} onFocus={ ()=>{ this.firebaseui_loads(); this.setState({ form_has_err : true }); }  } value={this.state.update_mobile_number} />
                                                <p className="text-danger">{this.state.update_mobile_number_err}</p>
                                            </FloatingInputs>
                                            <Button onClick={this.update_mobile_number_validation} size="large" className="PrimaryBtn lg fM my-4" block>{ i18next.t('Update') }</Button>
                                            </div>
                                            :
                                            <div className="floatingLabelStyle p-4 py-5 px-sm-5 text-center">
                                                <StyledFirebaseAuth uiConfig={this.state.uiconfig_state} firebaseAuth={firebase.auth()}/>
                                            </div>
                                        }
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>

                    </>
                }
                </div>
                </React.Fragment>
        );
    }
}

export default ProHowItWork;