import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from "react-router-dom";
import axios from 'axios';
import MetaDecorator from '../../../components/MetaDecorator';  
import Loader from "react-loader-spinner";
import Breadcremb from '../../../components/BreadCremb';
import i18next from 'i18next';

class MyServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasker_service_category : {},
            is_loading : true,
        }
    }
    componentDidMount = () => {
        this.get_tasker_service_categories(); 
    }
    get_tasker_service_categories = () => {
        var user_info = JSON.parse(localStorage.getItem('user'));
        var user_id = user_info && user_info.user_id;

        const config = {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('user_id',user_id);
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/servicecategories`,params,config).then(res => {
            console.log(res);
            if(res.data.status_code === 200)
            {
                this.setState({
                    tasker_service_category : res.data.servicecategories,
                    is_loading : false
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
    service_image_err = (ev) => {
        ev.target.src = require("../../../assets/images/default_service_image.png");
    }
    render() {
        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title='| Tasker Jobs' description="IDemand Tasker Jobs"/>
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
                        <div className="container">
                            <div className="pt-4">
                                <Breadcremb flag="others" bredcrumb1_link="/tasker" bredcrumb1="Home" />
                                <div className="myService">
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-10 mb-3">
                                    <h4 class="title fM mb-2">{ i18next.t('My Services') }</h4>
                                    <Link to="/tasker/add-services">
                                        <div><Button className="PrimaryBtn lg fM" type="">{ i18next.t('Add New Services') }</Button></div>
                                    </Link>
                                </div>

                                <div >
                                <div className="row">
                                { 
                                    this.state.tasker_service_category.length > 0 &&
                                    this.state.tasker_service_category.map((i,k) => {
                                    return (  
                                       <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <Link className="cardhov" to= {"/tasker/my-service-detail/"+i.parent_category_id} >
                                                <div className="homeSlide">
                                                    <div className="mb-3">
                                                        <img onError={this.service_image_err} 
                                                        className="imgBg roundedFivePx" 
                                                        src={i.parent_category_image} height={135} alt="" />
                                                        <p className="text-truncate txtClr 
                                                        fM mt-2">{i.parent_category_name} </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div> 
                                    )
                                    })
                                }
                                </div>
                                {
                                    this.state.tasker_service_category.length === 0 && 
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div className="emptydetail">
                                            <img src={require("../../../assets/images/deactivate.png")} alt=""
                                                className=""  />

                                            <div className="emptycontent text-center">
                                                <h3 className="title fM"> { i18next.t('Services') }</h3>
                                                <h5>{ i18next.t('Add Your service details') }</h5>
                                                <Link to="/tasker/add-services">  { i18next.t('Click Here') }</Link>
                                            </div>
                                        </div>
                                    </div>
                                }
                                
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

export default MyServices;