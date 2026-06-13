import React, { Component } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import MetaDecorator from '../../../components/MetaDecorator';  
import Loader from "react-loader-spinner";
import i18next from 'i18next';

const { TabPane } = Tabs;
class UserMyBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ongoing_paginate : 0,
            completed_paginate : 0,
            booking_info_ongoing : [],
            booking_info_completed : [],
            is_loading : true,
            has_loadmore : true,
            has_loadmore1 : true,
            default_panel_active : "1",
        };
    }
    componentDidMount = () => {
        if(this.props.location.state !== undefined) {
            if(this.props.location.state.status_of_booking === 'completed' || this.props.location.state.status_of_booking === 'cancelled' || this.props.location.state.status_of_booking === 'refunded') {
                this.setState({
                    default_panel_active : "2"
                })
            }
        }
        this.set_general_info();
    }
    set_general_info = () => {
        var user_info = JSON.parse(localStorage.getItem("user"));
        var general_info = JSON.parse(localStorage.getItem("general_info"));
        this.setState({
            general_info : general_info,
            user_info : user_info
        },()=>{
            this.get_ongoing_booking_details();
            this.get_completed_booking_details();
        })
    }
    get_ongoing_booking_details = () => {
        var booking_info = this.state.booking_info_ongoing;
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams()
        params.append('user_id', this.state.user_info && this.state.user_info.user_id)
        params.append('limit', '10')
        params.append('offset', this.state.ongoing_paginate)
        params.append('type', 'ongoing')
         
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/bookings`,params,config)
        .then (res=>{ 
            if(res.data.status_code === 200) {
                const monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                // eslint-disable-next-line
                res.data.items.map((j,k) => {
                    var msg_chat = new Date(j.date);
                    var elapsed_date = '';
                    var month_name = monthNames[msg_chat.getMonth()];
                    var year = msg_chat.getFullYear();
                    var date = msg_chat.getDate();
                    elapsed_date = date+'.'+month_name+'.'+year;
                    res.data.items[k].formatted_date = elapsed_date;
                    
                })
                booking_info.push(res.data.items);
                if(res.data.items.length < 10) {
                    this.setState({
                        has_loadmore : false
                    })    
                }
                var result = booking_info.flat();
                this.setState({ booking_info_ongoing: result });
            }
            else if(res.data.status_code === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
            else {
                this.setState({
                    has_loadmore : false
                })
            }
        })
    }
    get_completed_booking_details = () => {
        var booking_info = this.state.booking_info_completed;
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams()
        params.append('user_id', this.state.user_info && this.state.user_info.user_id)
        params.append('limit', '10')
        params.append('offset', this.state.completed_paginate)
        params.append('type', 'completed')
         
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/bookings`,params,config)
        .then (res=>{ 
            if(res.data.status_code === 200) {
                const monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                // eslint-disable-next-line
                res.data.items.map((j,k)=>{
                    var msg_chat = new Date(j.date);
                    var elapsed_date = '';
                    var month_name = monthNames[msg_chat.getMonth()];
                    var year = msg_chat.getFullYear();
                    var date = msg_chat.getDate();
                    elapsed_date = date+'.'+month_name+'.'+year;
                    res.data.items[k].formatted_date = elapsed_date;
                    
                })
                if(res.data.items.length < 10) {
                    this.setState({
                        has_loadmore1 : false
                    })    
                }
                booking_info.push(res.data.items);
                var result = booking_info.flat();
                this.setState({ booking_info_completed: result, is_loading : false });
            }
            else if(res.data.status_code === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
            else {
                this.setState({
                    is_loading : false,
                    has_loadmore1 : false
                })
            }
        })
    }
    booking_view = (id) => {
        var obj = {};
        obj.booking_id = id;
        this.props.history.push("/user/my-booking/detail",obj);
    }
    render() {
        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title='| Need Page' description="IDemand User Need Page"/>
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
                        <div className="pt-5">
                            <h4 className="fM mb-3">{ i18next.t('My Bookings') }</h4>
                            <Tabs defaultActiveKey={ this.state.default_panel_active } className="bookingTab">
                                <TabPane tab={ i18next.t("Ongoing") } key="1">
                                    { this.state.booking_info_ongoing && this.state.booking_info_ongoing.length > 0 ? this.state.booking_info_ongoing.map((i) => {
                                        return (
                                            <div key={i} className="cardTwoStyle" onClick= { (e)=> { e.stopPropagation(); this.booking_view(i.item_id); } }>
                                                
                                                    <div className="row cursorPointer">
                                                        <div className="col-sm-9 col-md-10">
                                                            <div className="row">
                                                                <div className="col-sm-4 col-lg-3">
                                                                    <img alt="" className="rounded imgBg" src={i.item_image} height={100} />
                                                                </div>
                                                                <div className="col-sm-8 col-lg-9">
                                                                    <div className="detailsSection mt-3 mt-sm-0">
                                                                        <div className="detailsOne text-truncate">
                                                                        {i.item_name}
                                                                        </div>
                                                                            {/* <div className="calendarIcon align-self-center mr-2 mt-n1"></div> */}
                                                                            <div className="align-self-center font-sm mb-1">{i.formatted_date}</div>
                                                                            <div className="align-self-center font-sm mb-1"> </div>
                                                                                <div className="align-self-center font-sm mb-1">ID: <span>#{i.reference_id && i.reference_id.toUpperCase()}</span></div>

                                                                        <div className="detailsThree mb-0">
                                                                            {/* <div className="locationIcon align-self-center mr-2 mt-n1"></div> */}
                                                                            <div className="align-self-center text-truncate">  </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className="col-sm-3 col-md-2">
                                                            <div className="mt-3 mt-lg-0 text-right d-flex flex-wrap align-items-center justify-content-between d-lg-block">
                                                                <div className="detailsSection  text-left text-sm-right mb-lg-2">
                                                                    <div className="detailsSix mb-2">
                                                                        { this.state.general_info && this.state.general_info.currency_symbol } { i.price } 
                                                                    </div>
                                                                    {
                                                                        i.status === 'requested' && 
                                                                        <p className="mb-0 fM greenTxtClr">{ i18next.t('Pre Booking') }</p>

                                                                    }
                                                                    {
                                                                        i.status === 'accepted' && 
                                                                        <p className="mb-0 fM greenTxtClr">{ i18next.t('Accepted') }</p>
                                                                    }
                                                                    {
                                                                        i.status === 'started' && 
                                                                        <p className="mb-0 fM greenTxtClr">{ i18next.t('In-progress') }</p>
                                                                    }
                                                                    {
                                                                        i.status === 'paid' && 
                                                                        <p className="mb-0 fM greenTxtClr">{ i18next.t('Paid') }</p>
                                                                    }
                                                                </div>
                                                                

                                                            </div>

                                                        </div>
                                                    </div>
                                            

                                            </div>
                                        )
                                    })
                                    :
                                    // <div>
                                    //     <p className="text-center">No More Ongoing Bookings!</p>
                                    // </div>

                                    <div className="d-grid place-items-center vh-50">
                                        <div>
                                            <img src={require("../../../assets/images/placeholder_logos(2).png")} alt=""
                                                className="placelogo-cls " />
                                            <div className="text-center font-xl py-3 fM">{ i18next.t('No Ongoing Booking Found!') }</div>   
                                        </div>     
                                    </div>
                                }
                                {
                                    this.state.has_loadmore === true &&
                                    <div className="m-3">
                                        <button onClick={ (e)=> { e.stopPropagation(); this.setState({ ongoing_paginate : this.state.ongoing_paginate + 10 },()=> {
                                            this.get_ongoing_booking_details();
                                        });   }  } type="button" className="loadMoreServices border-0 w-100">{ i18next.t('Load more') }</button>
                                    </div>
                                }
                                


                                </TabPane>

                                <TabPane tab={ i18next.t("Completed") } key="2">
                                    {/* eslint-disable-next-line */}
                                    {this.state.booking_info_completed && this.state.booking_info_completed.length > 0 ? this.state.booking_info_completed.map((i) => {
                                        if((i.item_type === 'marketplace') || (i.item_type === 'professional') || (i.item_type === 'userneeds' && i.status !== 'cancelled')) {
                                        return (
                                            <div key={i} className="cardTwoStyle" onClick={ (e)=>{  e.stopPropagation(); this.booking_view(i.item_id); } }>
                                                    <div className="row cursorPointer">
                                                        <div className="col-sm-9 col-md-10">
                                                            <div className="row">
                                                                <div className="col-sm-4 col-lg-3">
                                                                    <img alt="" className="rounded imgBg" src={ i.item_image } height={100} />
                                                                </div>
                                                                <div className="col-sm-8 col-lg-9">
                                                                    <div className="detailsSection mt-3 mt-sm-0">
                                                                        <div className="detailsOne text-truncate">
                                                                        { i.item_name }
                                                                        </div>

                                                                            <div className="align-self-center font-sm mb-1">{ i.formatted_date }</div>
                                                                            <div className="align-self-center font-sm mb-1"></div>
                                                                                <div className="align-self-center font-sm mb-1">ID: <span>#{i.reference_id}</span></div>

                                                                        <div className="detailsThree mb-0">
                                                                            {/* <div className="locationIcon align-self-center mr-2 mt-n1"></div> */}
                                                                            <div className="align-self-center text-truncate"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className="col-sm-3 col-md-2">
                                                            <div className="mt-3 mt-lg-0 text-right d-flex flex-wrap align-items-center justify-content-between d-lg-block">
                                                                <div className="detailsSection text-left text-sm-right mb-lg-2">
                                                                    <div className="detailsSix">
                                                                        { this.state.general_info && this.state.general_info.currency_symbol } { i.price } 
                                                        </div>
                                                            {
                                                                i.status === 'completed' ?
                                                                <p className="mb-0 fM greenTxtClr">{ i18next.t('Completed') }</p>
                                                                :
                                                                i.status === 'cancelled' ?  
                                                                <p className="mb-0 fM redTxtClr">{ i18next.t('Cancelled') }</p>
                                                                :
                                                                i.status === 'refunded' &&  
                                                                <p className="mb-0 fM redTxtClr">{ i18next.t('Refunded') }</p>
                                                            }
                                                                </div>
                                                                

                                                            </div>

                                                        </div>
                                                    </div>
                                               

                                            </div>
                                        )
                                        }
                                    })
                                :
                                    <div className="d-grid place-items-center vh-50">
                                        <div>
                                            <img src={require("../../../assets/images/placeholder_logos(2).png")} alt=""
                                                className="placelogo-cls " />
                                            <div className="text-center font-xl py-3 fM">{ i18next.t('No Completed Booking Found!') }</div>   
                                        </div>     
                                    </div>
                                }
                                    {
                                        this.state.has_loadmore1 === true &&
                                        <div className="m-3">
                                            <button onClick={ (e)=> { e.stopPropagation(); this.setState({ completed_paginate : this.state.completed_paginate + 10 },()=> {
                                                this.get_completed_booking_details();
                                            });   }  } type="button" className="loadMoreServices border-0 w-100">{ i18next.t('Load more') }</button>
                                        </div>
                                    }
                                    
                                </TabPane>
                            </Tabs>
                        
                        </div>
                    </div>
                }
                
               
                </div>
            </React.Fragment>
        );
    }
}

export default UserMyBooking;