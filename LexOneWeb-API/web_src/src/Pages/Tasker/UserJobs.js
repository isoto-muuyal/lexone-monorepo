import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import MetaDecorator from '../../components/MetaDecorator';  
import Loader from "react-loader-spinner";
import Swal from 'sweetalert2';
import i18next from 'i18next';
import { isMockToken, MOCK_LAWYER_PROFILE_DETAIL } from '../../utils/mockAuth';
import moment from 'moment';
import 'moment/locale/ar';
var lang = localStorage.getItem('lang');
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
class UserJobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paginate_of_needs : 0,
            my_needs : [],
            search_keyword : '',
            is_loading : true,
            has_loadmore : true,
        }
    }
    componentDidMount = () =>{
        var user_info = JSON.parse(localStorage.getItem('user'));
        var general_info = JSON.parse(localStorage.getItem('general_info'));

        if (isMockToken(localStorage.getItem('access_token'))) {
            this.setState({ user_info, general_info, user_profile: MOCK_LAWYER_PROFILE_DETAIL, my_needs: [], is_loading: false, has_loadmore: false });
            return;
        }

        this.setState({ user_info : user_info,general_info : general_info },()=>{
            this.get_user_profile_info();
            if(general_info.instant_location === 'true') {
                this.get_geo_location();
            }
            else {
                this.setState({ location : user_info.location },()=>{
                    this.get_all_need();
                });
            }
            
        });
        
    }
    get_user_profile_info = () => {
        var user_id = this.state.user_info.user_id;
        const config = {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('user_id',user_id);
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/profile`,params, config)
        .then (res => {
            if(res.data.status_code === 200) {
                this.setState({ user_profile : res.data },()=>{
                    if(res.data.profile_verified === "false" && res.data.payment_verified === "false") {
                        this.setState({
                            is_loading : false,
                        })
                    }
                });
            } 
            else if(res.data.status_code === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
        })
    }
    edit_need = (id) => {
        this.props.history.push('/user/edit-need',id);
    }
    get_geo_location = () => {
        var rm = this;
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            rm.setState({ lat:latitude,lon:longitude });
            
            const config = {
                headers : { 'Content-Type' : 'application/x-www-form-urlencoded' } 
            }
            var api_key = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
            var instance = axios.create();
            delete instance.defaults.headers.common['Authorization'];

            instance.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&key='+api_key,config)
            .then(response => {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
                
                rm.setState({ location : response.data.results[1].formatted_address, lat : latitude, lon : longitude },()=>{
                    rm.get_all_need();
                })
            })
            .catch(err => {
                rm.setState({
                    is_loading : false,
                    has_loadmore : false
                })
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
            })
        }, function(error) {
            console.log('safari_error',error);
            rm.setState({
                is_loading : false,
                has_loadmore : false
            })
            Toast.fire({
                icon: 'warning',
                title: "Please allow location, on Browser!"
            });
        });
        
    }
    open_payment_link = () =>{
        // var general_info = JSON.parse(localStorage.getItem('general_info'));
        // var path = process.env.REACT_APP_FRONT_BASE_URL;
        // var client_id = general_info.stripe_clientid;
        // window.location.href = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=${path}/&client_id=${client_id}`;
        if(this.state.call_once === false) {
            if(localStorage.getItem('user') === null) {
                this.props.history.push('/tasker/tasker-login');
                window.location.reload(false);
            }
            else {
                var user_info = JSON.parse(localStorage.getItem('user'));
                var tasker_id = user_info.user_id;
                
                //var token = new URLSearchParams(this.props.location.search).get("code");

                axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/stripeurl/${tasker_id}`)
                .then (res=>{
                    this.setState({
                        call_once : true
                    },()=>{
                         console.log(res.data);
                        if(res.data.status_code === 200) {
                           window.location.href = res.data.stripe_url; 
                          
                        }
                        else {
                            Toast.fire({
                                icon: 'warning',
                                title: 'Fail to update Payout Information!'
                            });
                            this.props.history.push('/tasker');
                        }
                    })
                });
            }
            
        }
    
    }
    get_all_need = () =>{
        
        var paginate_of_needs = this.state.paginate_of_needs;
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        
        const params = new URLSearchParams()
        params.append('user_id', this.state.user_info.user_id);
        params.append('limit', 5);
        params.append('search_key', this.state.search_keyword);
        params.append('offset', paginate_of_needs);
        if(this.state.general_info && this.state.general_info.instant_location === 'true') {
            params.append('source_location', this.state.location && this.state.location);
            params.append('source_lon', this.state.lon && this.state.lon);
            params.append('source_lat', this.state.lat && this.state.lat);
        }
        else {
            params.append('source_location', this.state.location);
        }
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/browseneeds`, 
            params,config)
            .then(res => {

                if(res.data.status_code === 200) {
                    for (let index = 0; index < res.data.items.length; index++) {
                        var today = new Date(res.data.items[index].date);
                        var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                        if (lang === 'ar') {
                            const parsedDate = moment(date, "DD/MM/YYYY");
                            parsedDate.locale('ar');
                            date = parsedDate.format('LL');
                        } 
                        res.data.items[index].formatted_date = date;
                        
                    }
                    var my_needs = this.state.my_needs;
                    my_needs.push(res.data.items);
                    var flatted = my_needs.flat();

                    this.setState({ 
                        my_needs : flatted,
                        is_loading : false
                    })
                    if(res.data.items.length === 0 || res.data.items.length < 5) {
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
                        is_loading : false,
                        has_loadmore : false
                    })
                }
            })
    }
    get_all_need_by_search = () =>{
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        if(this.state.search_keyword.length === 0) {
            this.setState({
                has_loadmore : true,
            })
        }
        const params = new URLSearchParams()
        params.append('user_id', this.state.user_info.user_id);
        params.append('limit', 5);
        params.append('search_key', this.state.search_keyword);
        params.append('offset', 0);
        if(this.state.general_info && this.state.general_info.instant_location === 'true') {
            params.append('source_location', this.state.location && this.state.location);
            params.append('source_lon', this.state.lon && this.state.lon);
            params.append('source_lat', this.state.lat && this.state.lat);
        }
        else {
            params.append('source_location', this.state.location);
        }
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/browseneeds`, 
            params,config)
            .then(res => {

                if(res.data.status_code === 200) {
                    for (let index = 0; index < res.data.items.length; index++) {
                        var today = new Date(res.data.items[index].date);
                        var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                        if (lang === 'ar') {
                            const parsedDate = moment(date, "DD/MM/YYYY");
                            parsedDate.locale('ar');
                            date = parsedDate.format('LL');
                        } 
                        res.data.items[index].formatted_date = date;
                        
                    }

                    this.setState({ 
                        my_needs : res.data.items
                    })
                    if(res.data.items.length === 0 || res.data.items.length < 5) {
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
            })
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../assets/images/default_service_image.png");
    }
    view_task = (i) => {
       this.props.history.push('/browse-task/detail',i);
    }
    render() {
        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title='| Tasker Search Jobs' description="IDemand Tasker Search Jobs"/>
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
                    this.state.user_profile && this.state.user_profile.payment_verified === "true" && this.state.user_profile.profile_verified === "true" ?
                    <>
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
                                <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
                                    <h4 class="title fM flex-0 mb-0">{ i18next.t("User Jobs")}</h4>
                                    <div className="searchBox">
                                        <span className="searchIcon" />
                                        <input type="search" placeholder={ i18next.t("Search your Services") } className="" onChange={(e) => this.setState({search_keyword : e.target.value})} onKeyUp={ this.get_all_need_by_search } value={ this.state.search_keyword && this.state.search_keyword } autoComplete="off"/>
                                    </div>
                                </div>
                            {/* <Input size="large"   addonBefore={<div>{<SearchOutlined/>}</div>} placeholder="Search" /> */}
                                {  this.state.my_needs && this.state.my_needs.length > 0 ? this.state.my_needs.map((i,k) => {
                                    return (
                                        <div key={k} className="cardTwoStyle" onClick={ (e)=> { e.stopPropagation(); this.view_task(i); }  }>
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
                                                                    <div className="align-self-center">{ i.parent_category_name }-{ i.service_name }</div>
                                                                    <div className="detailsTwo">
                                                                        {/* <div className="calendarIcon align-self-center mr-2 mt-n1"></div> */}
                                                                        
                                                                        <div className="align-self-center">{ i.formatted_date }</div>
                                                                    </div>

                                                                    <div className="detailsThree mb-0">
                                                                        {/* <div className="locationIcon align-self-center mr-2 mt-n1"></div> */}
                                                                        <div className="align-self-center text-truncate"> {  i.location } </div>
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
                                                                
                                                                
                                                            </div>
                                                            
                                                        </div>

                                                    </div>
                                                </div>
                                            
                                        

                                        </div>
                                    )
                                })
                            :
                            <div className="d-grid place-items-center vh-50">
                                <div>
                                    <img src={require("../../assets/images/placeholder_logos(2).png")} alt=""
                                        className="placelogo-cls "  />
                                    <div className="text-center font-xl py-3 fM">{i18next.t("No Jobs Found!")}</div>   
                                </div>     
                            </div>
                            }

                            </div>
                            {
                                this.state.has_loadmore === true &&
                                <div className="m-3">
                                    <button onClick={ (e)=> { e.stopPropagation(); this.setState({ paginate_of_needs : this.state.paginate_of_needs + 5 },()=> {
                                        this.get_all_need();
                                    });   }  } type="button" className="loadMoreServices border-0 w-100">{i18next.t("Load more")}</button>
                                </div>
                            }
                            
                        </div>
                    }
                    </>
                :
                this.state.user_profile && this.state.user_profile.payment_verified === "false" ? 
                <div className="d-flex justify-content-center align-items-center">
                    <div className="emptydetail">
                        <img src={require("../../assets/images/deactivate.png")} alt=""
                            className=""  />

                        <div className="emptycontent text-center">
                            <h3 className="title fM"> {i18next.t("Payment details")}</h3>
                            <h5>{i18next.t("Add Payment To Activate Your Account")}</h5>
                            <div className="primaryClr cursorPointer" onClick={ this.open_payment_link }>{i18next.t("CLick Here")}</div>
                        </div>
                    </div>
                </div>
                :
                this.state.user_profile && this.state.user_profile.profile_verified === "false" &&
                <div className="d-flex justify-content-center align-items-center">
                    <div className="emptydetail">
                        <img src={require("../../assets/images/deactivate.png")} alt=""
                            className=""  />
                        <div className="emptycontent text-center">
                            <h3 className="title fM"> {i18next.t("Profile Details")}</h3>
                            <h5>{i18next.t("Yet to be Approved by Admin.") }</h5>
                        </div>
                    </div>
                </div>
                }
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(UserJobs);