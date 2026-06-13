import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import HomeBanner from '../components/HomePage/HomeBanner';
import CategorySliderImg from '../components/HomePage/CategorySlider';
import ServiceSliderImg from '../components/HomePage/ServiceSlider';
import RecentTaskSliderImg from '../components/HomePage/RecentTaskSlider';
import HowDoesWork from '../components/HomePage/HowDoesWork';
import axios from 'axios';
import MetaDecorator from '../components/MetaDecorator';
import Loader from "react-loader-spinner";
import i18next from "i18next";

const CategorySlider = (i) => {
    return (
        <div className="homeSlide mb-5" key={i.item_id}>
            <div className="mb-2">
                <div className="d-flex justify-content-between">
                    <h5 className="text-truncate fB">{i.title} </h5>
                    {
                        i.cat_items && i.cat_items.length > 4 &&
                        <Link to={"/user/sub-categories/"+i.cat_type.item_id}>
                            <div className="text-right defaultColor font-sm ">{i18next.t('View all')}</div>
                        </Link>
                    }
                </div>
            </div>
            <CategorySliderImg cat_type={i.cat_type} cat_items={i.cat_items} />
        </div>
    )
}

const ServiceSlider = (i) => {
    return (
        <div className="homeSlide mb-5">
            <div className="mb-2">
                <div className="d-flex justify-content-between">
                    <h5 className="text-truncate fB">{i.title} </h5>
                </div>
            </div>
            <ServiceSliderImg service_info = {i.services_info} />
        </div>
    )
}
const RecentTask = (i) => {
    return (
        <div className="recentTasks homeSlide mb-5">
            <div className="mb-2">
                <div className="d-flex justify-content-between">
                    <h5 className="text-truncate fB">{i.title} </h5>
                    <Link to="/RecentTask/viewall">
                        <div className="text-right defaultColor font-sm "></div>
                    </Link>
                </div>
            </div>
            <RecentTaskSliderImg recent_bookings = {i} />
        </div>
    )
}
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            home : {},
            feature_items : [],
            feature_page : 0,
            is_loading : true,
            has_loadmore : true
        }
    }
    componentDidMount = () => {
        this.get_home_page_contents();
        this.get_feature_items();
    }
   
    get_home_page_contents = () => {
        var user_id = '';
        if(localStorage.getItem('user') === null) {
            user_id = '';
        }
        else {
            var user_info = JSON.parse(localStorage.getItem('user'));
            user_id = user_info.user_id;
        }
        const config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('user_id' , user_id);
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/home` , params, config)
        .then(res=>{
            if(res.status === 200) {
                if(res.data.status_code === 200) {
                    this.setState({home:res.data},()=>{
                        if(res.data.client_ip_address) {
                            localStorage.setItem('ip_address',res.data.client_ip_address);
                        }
                    });
                }
                else if(res.data.status_code === 401) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('access_token');
                    this.props.history.push('/');
                    window.location.reload(false);
                }
            }
            else {
                alert("404! , Page Not Responsive!");
            }
        })
        .catch((err)=>{
            console.log('errrrrrrrrrrrrrrrr ',err)
        }) 
    }
    get_feature_items = () => {
        var feature_page = this.state.feature_page;
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/get_home_feature_items/${feature_page}/10`)
        .then (res=>{
            console.log('result category');
            console.log(res);
            if(res.data.status_code === 200) {
                var all_feature_items = this.state.feature_items;
                all_feature_items.push(res.data.feature_items);
                const newData = all_feature_items.flat();
                this.setState({ 
                    feature_items : newData,
                });
                var rm = this;
                setTimeout(function(){ 
                    rm.setState({
                        is_loading : false
                    })
                }, 1800);
                if(res.data.feature_items.length === 0 || res.data.feature_items.length < 10) {
                    this.setState({
                        has_loadmore : false
                    })
                }
            }
            else if(res.data.status_code === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('access_token');
                this.props.history.push('/');
                window.location.reload(false);
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title=' | Home Service Categories and Lists' description="Book your needs, customize your price with taskers" />
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
                    <HomeBanner banners={this.state.home.banner_items}/>
                
                
                    <div className="container">
                        {/* Categorys Slider */}
                        <div className="mt-4">
                            <ServiceSlider services_info={this.state.home.category_items} title={ i18next.t('Services') }  />
                            {
                                typeof this.state.home.recent_items !== 'undefined' && this.state.home.recent_items.length > 0 &&
                                    <RecentTask recent_tasks={this.state.home.recent_items} title={ i18next.t('Recent Tasks') } />
                            }
                            {
                                this.state.feature_items &&
                                this.state.feature_items.map((cat) => {
                                    return cat.items && cat.items.length > 0 && (
                                        <CategorySlider cat_type = {cat} cat_items={cat.items} title={cat.item_name} key={cat.item_id} />
                                    )
                                })
                            }
                            {/* <LoadMore/> */}
                            {
                                this.state.has_loadmore === true &&
                                <div className="m-3">
                                    <button onClick={ (e)=> { e.stopPropagation(); this.setState({ feature_page : this.state.feature_page + 10 },()=> {
                                        this.get_feature_items();
                                    });   }  } type="button" className="loadMoreServices border-0 w-100 md">{ i18next.t('Load more') }</button>
                                </div>
                            }
                            
                            <HowDoesWork />
                        </div>
                    </div>
                    </>
                }
                
                </div>
            </React.Fragment>
        );
    }
}

export default Home;