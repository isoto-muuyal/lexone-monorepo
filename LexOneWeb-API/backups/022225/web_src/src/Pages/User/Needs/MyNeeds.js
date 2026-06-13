import React, { Component } from 'react';
import axios from 'axios';
import MetaDecorator from '../../../components/MetaDecorator';  
import Loader from "react-loader-spinner";
import {Link} from "react-router-dom";
import { PlusCircleOutlined } from '@ant-design/icons';
import i18next from "i18next";

class MyNeeds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paginate_of_needs : 0,
            my_needs : [],
            is_loading : true,
            has_loadmore : true
        }
    }
    componentDidMount = () =>{
        this.get_all_need();
    }
    edit_need = (id) => {
        // var obj = {};
        // obj.need_id = id;
        this.props.history.push('/user/edit-need',id);
    }
    get_all_need = () =>{
        var user_info = JSON.parse(localStorage.getItem('user'));
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        this.setState({ user_info : user_info,general_info : general_info });
        var paginate_of_needs = this.state.paginate_of_needs;
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        
        const params = new URLSearchParams()
        params.append('user_id', user_info.user_id);
        params.append('limit', 10);
        params.append('offset', paginate_of_needs);
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/needs`, 
            params,config)
            .then(res => {

                if(res.data.status_code === 200) {
                    for (let index = 0; index < res.data.items.length; index++) {
                        var today = new Date(res.data.items[index].date);
                        var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                        res.data.items[index].formatted_date = date;
                        
                    }
                    var my_needs = this.state.my_needs;
                    my_needs.push(res.data.items);
                    var flatted = my_needs.flat();

                    this.setState({ 
                        my_needs : flatted,
                        is_loading : false
                    })
                    if(res.data.items.length === 0 || res.data.items.length < 10) {
                        this.setState({
                            has_loadmore : false
                        })
                    }
                }
                else if(res.data.status_code === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    this.props.history.push('/');
                    window.location.reload(false);
                }
                else {
                    this.setState({
                        has_loadmore : false,
                        is_loading : false
                    })
                }
            })
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../../assets/images/default_service_image.png");
    }
    get_to_back = () => {
        this.props.history.goBack();
    }
    render() {
        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title='| Job Page' description="IDemand User Job Page"/>
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
                        
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 class="fM">{ i18next.t("My Jobs") }</h4>
                            {/* <div className="d-flex p-3 align-items-center hover-cont" onClick={ this.get_to_back }> 
                                <ArrowLeftOutlined  />
                                &nbsp;
                                <span>{ i18next.t("Back") } </span>
                            </div> */}
                        </div>
                            {  this.state.my_needs && this.state.my_needs.length > 0 ? this.state.my_needs.map((i,k) => {
                                return (
                                    <div key={k} className="cardTwoStyle" onClick={ (e)=> { e.stopPropagation(); this.edit_need(i); }  }>
                                            <div className="row cursorPointer">
                                                <div className="col-sm-9 col-md-10">
                                                    <div className="row">
                                                        <div className="col-sm-4 col-lg-3">
                                                            <img alt="" className="rounded imgBg" onError={ this.service_image_err } src={ i.service_image } height={100} />
                                                        </div>
                                                        <div className="col-sm-8 col-lg-9">
                                                            <div className="detailsSection mt-3 mt-sm-0">
                                                                <div className="detailsOne text-truncate">
                                                                { i.name }
                                                            </div>

                                                                <div className="detailsTwo">
                                                                    {/* <div className="calendarIcon align-self-center mr-2 mt-n1"></div> */}
                                                                    <div className="align-self-center">{ i.formatted_date }</div>
                                                                </div>

                                                                <div className="detailsThree mb-0">
                                                                    {/* <div className="locationIcon align-self-center mr-2 mt-n1"></div> */}
                                                                    <div className="align-self-center text-truncate"> {  i.description } </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="col-sm-3 col-md-2">
                                                    <div className="mt-3 mt-lg-0 text-right d-flex flex-wrap align-items-center justify-content-between d-lg-block">
                                                        <div className="detailsSection text-left text-sm-right mb-lg-2">
                                                            <div className="detailsSix mb-2">
                                                                { this.state.general_info && this.state.general_info.currency_symbol } { i.booking_price }
                                                            </div>
                                                            {
                                                                i.due_status === 'true' && i.active_status === 'true' &&
                                                                <p className="mb-0 fM redTxtClr">{ i18next.t("Expired") }</p>

                                                            }
                                                            {
                                                                i.due_status === 'false' && i.active_status === 'true' &&
                                                                <p className="mb-0 fM greenTxtClr">{ i18next.t("Active") }</p>
                                                            }
                                                            {
                                                                i.active_status === 'false' &&
                                                                <p className="mb-0 fM blueTxtClr">{ i18next.t("Pending") }</p>
                                                            }
                                                        </div>
                                                        {/* <div className="d-flex justify-content-end mt-2">
                                                                <Button className="Btns mr-3 px-sm-4 px-3" onClick={this.showReviewModal}>Review</Button>
                                                                <Button className="Btns primaryClr px-sm-4 px-3" onClick={this.showRewardModal}>Reward</Button>
                                                            </div> */}

                                                    </div>

                                                </div>
                                            </div>
                                        
                                    

                                    </div>
                                )
                            })
                            :
                            <div className="d-grid place-items-center vh-50">
                                <div>
                                    <img src={require("../../../assets/images/placeholder_logos(2).png")} alt=""
                                        className="placelogo-cls " />
                                    <div className="text-center py-3 fM">
                                        <h5>{ i18next.t("No Jobs Found!") }</h5>
                                        <Link to="/user/post-task">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <PlusCircleOutlined className="mx-2" />
                                                <span>{ i18next.t('Post a Task') }</span>
                                            </div>
                                        </Link>
                                    </div>   
                                </div>     
                            </div>
                            }

                        </div>
                        {
                            this.state.has_loadmore === true &&
                            <div className="m-3">
                                <button onClick={ (e)=> { e.stopPropagation(); this.setState({ paginate_of_needs : this.state.paginate_of_needs + 10 },()=> {
                                    this.get_all_need();
                                });   }  } type="button" className="loadMoreServices border-0 w-100">{ i18next.t("Load more") }</button>
                            </div>
                        }
                        
                    </div>
                }
                </div>
            </React.Fragment>
        );
    }
}

export default MyNeeds;