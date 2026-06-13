import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Rate } from 'antd';
import Breadcremb from '../../../components/BreadCremb';
import axios from 'axios';
import MetaDecorator from '../../../components/MetaDecorator';
import Loader from "react-loader-spinner";
import i18next from "i18next";

class SubCategoryLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            general_info:{},
            service_calc: [],
            category_info : {},
            user_info : {},
            show: true,
            howit_active : true,
            about_active : false,
            review_active : false,
            faq_active : false,
            review_page : 0,
            cat_reviews : [],
            loop_index : 0,
            is_loading : true,
            has_loadmore : true
        }
    }
    
    componentDidMount () {
        const general_info = JSON.parse(localStorage.getItem('general_info'));
        this.setState({ 
            general_info : general_info,
            cat_id : this.props.match.params && this.props.match.params.cat_id ,
            user_info : JSON.parse(localStorage.getItem('user'))
        },()=>{
            this.get_category_by_id();
            this.get_reviews_by_category_id();
            this.get_subcategory_by_id();
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.cat_id !== this.props.match.params.cat_id) {
            
            const cat_id = nextProps.match.params.cat_id;
            this.setState({
                cat_id : cat_id,
                cat_reviews : [],
                review_page : 0,
                category_info : {},
                subcat_data : {},
                subcategories : []
            },()=> {
                this.get_category_by_id();
                this.get_reviews_by_category_id();
                this.get_subcategory_by_id();
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
                    this.setState({ category_info : res.data.category[0] })
                    
                }
            });
        }
    }

    image_load_err = (ev) => {
        ev.target.src = require('../../../assets/images/default_service_image.png');
    }
    
    get_subcategory_by_id = () => {
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
                            subcat_data : res.data,
                            is_loading : false
                        })
                    }
                    else {
                        this.props.history.push('/unknown')
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
    time_elapsed = () => {
        var i = this.state.loop_index;
        var state = this.state.cat_reviews;
        var time = state[0][i].date;

        var formatted_date = new Date(time);
        alert(formatted_date);
        state[0][i].date = formatted_date;
        this.setState({ cat_reviews : state, loop_index : i+1 })
    }
    render() {
        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title='| subcategory lists' description="Your needs are categorized"/>
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
                                        {/* eslint-disable-next-line */}
                                        <a href="javascript:;" onClick={ (e) => { e.stopPropagation(); this.show_blocks_based_on_flag('how_it_works'); } } className={ this.state.howit_active === true ? 'active' : '' }><p className="mb-0 ">{i18next.t('How It Work')}</p></a>
                                        {/* eslint-disable-next-line */}
                                        <a href="javascript:;" onClick={ (e) => { e.stopPropagation(); this.show_blocks_based_on_flag('about'); } } className={ this.state.about_active === true ? 'active' : '' }><p className="mb-0">{i18next.t('About')}</p></a>
                                        {  
                                            this.state.category_info && this.state.category_info.parent_category_type === 'professional' &&
                                            
                                            <a onClick={ (e) => { e.stopPropagation(); this.show_blocks_based_on_flag('review'); } } className={ this.state.review_active === true ? 'active' : '' } ><p className="mb-0">{i18next.t('Review')}</p></a> // eslint-disable-line
                                        }
                                        {/* eslint-disable-next-line */}
                                        <a href="javascript:;" onClick={ (e) => { e.stopPropagation(); this.show_blocks_based_on_flag('faq'); } } className={ this.state.faq_active === true ? 'active' : '' }><p className="mb-0">{i18next.t('FAQ')}</p></a>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="container">
                            <div className="mb-3">
                                <Breadcremb flag="services" category_id={this.state.cat_id && this.state.cat_id} />
                            </div>
                            <div className="innerContent">
                                <div className="row">
                                    <div className="col-lg-7 col-md-12 tab-content">
                                        { this.state.subcat_data && 
                                        <section className="">
                                            {
                                                this.state.howit_active === true ?
                                                <div className="border roundedFivePx">
                                                    <h5 className="fM mb-0 p-3 border-bottom">{i18next.t('How It Work')}</h5>
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
                                                
                                                    <h5 className="fM mb-0 p-3 border-bottom">{i18next.t('About')}</h5>

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
                                                    <h5 className="fM mb-0 p-3 border-bottom">{i18next.t('Review')}</h5>
                                                    <div className="p-3">
                                                    { this.state.cat_reviews[0] ? this.state.cat_reviews[0].map((i,k) => {
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
                                                                            <div className="singleStar align-self-center"><Rate disabled allowHalf defaultValue = {parseFloat(i.rating)} /> </div>
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
                                                                className="placelogo-cls "  />
                                                            <div className="text-center font-xl py-3 fM">{i18next.t('No Reviews Found!')}</div>   
                                                        </div>     
                                                    </div>
                                                    }
                                                    </div>
                                                    {
                                                        this.state.has_loadmore === true &&
                                                        <div className="m-3">
                                                            <button onClick={ (e)=> { e.stopPropagation(); this.get_reviews_by_category_id();  }  } type="button" className="loadMoreServices border-0 w-100">{i18next.t('Load more')}</button>
                                                        </div>
                                                    }
                                                    
                                                </div>
                                                :
                                                this.state.faq_active === true  &&
                                                <div className="border roundedFivePx">
                                                    <h5 className="fM mb-0 p-3 border-bottom">{i18next.t('FAQ')}</h5>

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
                                            <h5 class="title">{ this.state.category_info && this.state.category_info.parent_category_name }</h5>
                                            <div>
                                                <div class="content" style={{ maxHeight: '60vh', overflowX: 'hidden' }}>
                                                    {
                                                    this.state.subcategories && this.state.subcategories.length > 0 ?

                                                    this.state.subcategories.map((i) => {
                                                        
                                                        return (
                                                            <div key={i.subcategory_id} >
                                                                <Link className="hover-cont" to={ this.state.category_info && this.state.category_info.parent_category_type === "professional" ? "/user/professional-view/"+this.state.category_info.parent_category_id+"/"+i.subcategory_id : "/user/marketplace-view/"+this.state.category_info.parent_category_id+"/"+i.subcategory_id}>
                                                                <div className="row">
                                                                    <div className="col-sm-8 pr-0 d-flex align-items-center">
                                                                        <div className="mr-3">
                                                                            <img onError={this.image_load_err} src={i.subcategory_image} alt="" className="imgBg profile-sm" />
                                                                        </div>
                                                                        <div className="font-sm overflow-hidden">
                                                                            <p className="mb-1 text-truncate">{i.subcategory_name}</p>
                                                                            
                                                                      
                                                                        </div>
                                                                    </div>
                                                                    <div key={i.service_id} className="col-sm-4 align-self-end">
                                                                        
                                                                    </div>
                                                                </div>
                                                                <hr />
                                                                </Link>
                                                                
                                                            </div>
                                                        )
                                                    })
                                                    :
                                                    <div className="centerloader">
                                                        No subcategory found!
                                                    </div>
                                                    }
                                                </div>
                                            </div>
                                        </section>
                                        
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

export default SubCategoryLists;