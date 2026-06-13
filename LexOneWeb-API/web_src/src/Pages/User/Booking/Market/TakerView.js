import React, { Component } from 'react';
import { Rate } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TaskerImageSlide from "../../../../components/TaskerImageSlide";
import axios from 'axios';
import MetaDecorator from '../../../../components/MetaDecorator';  
import Loader from "react-loader-spinner";
import i18next from 'i18next';

class TaskerView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            is_loading : true,
            review_has_loadmore : true,
            tasker_reviews : [],
            review_page : 0,
        }
    }
    componentDidMount = () => {
        this.get_taker_profile();
        this.get_reviews_by_tasker_id();
    }
    tasker_image_err = (ev) => {
        ev.target.src = require("../../../../assets/images/default_user_image_rectangle.png");
    }
    get_reviews_by_tasker_id = () => {
        var tasker_id = this.props.match.params.tasker_id && this.props.match.params.tasker_id;
        var review_page = this.state.review_page;
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/reviews/tasker/${tasker_id}/${review_page}/5`)
        .then (res=>{
            console.log('result category');
            console.log(res);
            if(res.data.status_code === 200) {
                var all_reviews = this.state.tasker_reviews;
                const monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                
                res.data.items.length > 0 && 
                res.data.items.map((j,k)=>{ // eslint-disable-line
                    console.log('each')
                    console.log(j.date);
                    var alt_date = new Date(j.date);
                    var elapsed_date = '';
                    var month_name = monthNames[alt_date.getMonth()];
                    var year = alt_date.getFullYear();
                    var date = alt_date.getDate();
                    elapsed_date = date+'.'+month_name+'.'+year;
                    
                    res.data.items[k].formatted_date = elapsed_date 
                    
                })
                all_reviews.push(res.data.items);
                var result = all_reviews.flat();
                this.setState({ 
                    tasker_reviews : result,
                    review_loading : false
                })
                if(res.data.items.length === 0 || res.data.items.length < 5) {
                    this.setState({
                        review_has_loadmore : false
                    })
                } 
            }
            else {
                this.setState({
                    review_has_loadmore : false,
                    review_loading : false
                })
            }
        });
    }
    get_taker_profile = () => {
        var user_info = JSON.parse(localStorage.getItem('user'));
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        this.setState({ user_info : user_info, general_info : general_info });
        var tasker_id = this.props.match.params.tasker_id && this.props.match.params.tasker_id;
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/taskerprofile/${tasker_id}`)
        .then(res => {
            if(res.data.status_code === 200)
            {
                // const monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                // res.data.recent_reviews.length > 0 && 
                // res.data.recent_reviews.map((j,k)=>{ // eslint-disable-line
               
                //     var alt_date = new Date(j.date);
                //     var elapsed_date = '';
                //     var month_name = monthNames[alt_date.getMonth()];
                //     var year = alt_date.getFullYear();
                //     var date = alt_date.getDate();
                //     elapsed_date = date+'.'+month_name+'.'+year;
                    
                //     res.data.recent_reviews[k].formatted_date = elapsed_date 
                    
                // })
                this.setState({ tasker_profile : res.data, is_loading : false })
            }
        });
    }
    get_to_back = () => {
        this.props.history.goBack();
    }
    render() {
        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title='| Tasker View' description="IDemand Tasker Details"/>
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
                                <h4 class="title fM mb-2">{ i18next.t('Tasker Details') }</h4>
                                <div className="d-flex align-items-center hover-cont" onClick={ this.get_to_back }> 
                                    <ArrowLeftOutlined  />
                                    &nbsp;
                                    <span>{ i18next.t("Back") } </span>
                                </div>
                            </div>
                            <section className="cardTwoStyle">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <div className="row">
                                                <div className="col-sm-4 col-lg-3">
                                                    <img alt="" className="rounded imgBg" src={ this.state.tasker_profile && this.state.tasker_profile.user_image } onError={this.tasker_image_err} height={100} />
                                                </div>
                                                <div className="col-sm-8 col-lg-9">
                                                    <div className="detailsSection mt-3 mt-sm-0">
                                                        <div className="fM text-truncate">
                                                            {this.state.tasker_profile && this.state.tasker_profile.name}
                                                        </div>


                                                        <div className="detailsThree my-2">
                                                            <span className="greenStar" />
                                                            <div className="align-self-center"><span className="greenTxtClr fM">{this.state.tasker_profile && this.state.tasker_profile.rating}</span> ( {this.state.tasker_profile && this.state.tasker_profile.reviews} { i18next.t("Reviews") } )</div>
                                                        </div>
                                                        <p className="mb-0 font-sm">{this.state.tasker_profile && this.state.tasker_profile.completed_jobs} { i18next.t("Jobs") }</p>
                                                        <p className="mb-0 font-sm">{this.state.tasker_profile && this.state.tasker_profile.mobile} </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-lg-2">
                                            <div className="mt-3 mt-lg-0 text-right d-flex justify-content-between d-lg-block">
                                                <div className="detailsSection text-right overflow-hidden mb-lg-2">
                                                    {/* <div className="detailsSix text-truncate">
                                                        <span> $ 129</span> / Hr
                                                    </div> */}
                                                </div>
                                                {/* <Link to="/User/MarketBooking">
                                                    <Button className="Btns PrimaryBtn w-100">Hire</Button>
                                                </Link> */}
                                            </div>

                                        </div>
                                    </div>

                                <div className="my-3">

                                    {
                                        this.state.tasker_profile && this.state.tasker_profile.about !== '' &&
                                        <div className="mb-4">
                                            <p className="mb-2 fM">About Me :</p>
                                            <p className="mb-0">{this.state.tasker_profile && this.state.tasker_profile.about} </p>
                                        </div>
                                    }
                                    
                                    {
                                        this.state.tasker_profile && this.state.tasker_profile.portfolio.length > 0 &&
                                        <div className="mb-4">
                                            <p className="mb-2 fM">{ i18next.t("Tasker Images") }</p>

                                            <TaskerImageSlide tasker_image = {this.state.tasker_profile && this.state.tasker_profile.portfolio}/>
                                        </div>
                                    }
                                    
                                </div>
                                {
                                    this.state.tasker_reviews && this.state.tasker_reviews.length > 0 &&
                                    <>
                                    <p className="mb-2 fM">{ i18next.t("Reviews") } :</p>
                                    {
                                        this.state.tasker_reviews.map((j,k) => {
                                            return (
                                                <React.Fragment>
                                                    <div className="row mb-3" key={k}>
                                                        <div className="d-flex col-lg-8 col-xl-9">
                                                            <div className="pl-0 pr-3 mt-1">
                                                                <img className="profile-sm imgBg" src={j.user_image} height={35} width={55} alt="" />
                                                            </div>

                                                            <div className="pr-2 mr-auto">
                                                                <div className="details">
                                                                    <div className="detailOne">{j.name}</div>
                                                                    <div className="font-sm lightTxtClr"></div>
                                                                    <div className="detailTwo d-flex">
                                                                        <div className="singleStar align-self-center"><Rate disabled allowHalf defaultValue={parseFloat(j.rating)}  /> </div>
                                                                        <div className="d-flex align-items-center">
                                                                            <span className="align-self-center m-t-5 mx-2 "> </span>
                                                                            <span></span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="font-sm mt-1 text-break">{j.description}</div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-lg-4 col-xl-3 pt-md-0 pt-2">
                                                            <div className="font-sm text-right">{j.formatted_date}</div>
                                                        </div>
                                                    </div>

                                                    <hr />
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                    {
                                        this.state.review_has_loadmore === true &&
                                        <div className="m-3">
                                            <button onClick={ (e)=> { e.stopPropagation(); this.setState({ review_page : this.state.review_page + 5 },()=> {
                                            this.get_reviews_by_tasker_id();
                                            });   }  } type="button" className="loadMoreServices border-0 w-100">
                                            {i18next.t("Load more")}
                                            </button>
                                        </div>
                                    }
                                    </>
                                }   
                                

                                {/* <div className="loadMoreServices mb-0">Load more Reviews</div> */}


                            </section>
                        
                        </div>
                    </div>
                }
                </div>
            </React.Fragment>
        );
    }
}

export default TaskerView;