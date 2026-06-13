import React, { Component } from 'react';
import Breadcremb from '../../../components/BreadCremb';
import axios from 'axios';
import i18next from 'i18next';
class MyServiceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            services : []
        }
    }
    componentDidMount = () => {
        this.get_services_by_category_id();
    }
    get_services_by_category_id = () => {
        var cat_id = this.props.match.params.cat_id;
        var user_info = JSON.parse(localStorage.getItem('user'));
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        this.setState({ user_info : user_info, general_info : general_info })
        const config = {
            headers : {
                "Content-type" : "application/x-www-form-urlencoded"
            }
        }

        const params = new URLSearchParams();
        params.append('parent_category_id',cat_id);
        params.append('user_id',user_info.user_id);

        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/services`,params,config)
        .then(res => {
            if(res.data.status_code === 200) {
                if(res.data.services.length > 0) {
                    this.setState({ services : res.data.services })
                }
                else {
                    this.props.history.push('/tasker/my-services');
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
        ev.target.src = require("../../../assets/images/default_service_image.png");
    }
    view_service = (i) => {
        var new_state = this.state.services[i];
        new_state.parent_category_id = this.props.match.params.cat_id;
        this.setState({ new_state : new_state });
        this.props.history.push('/tasker/my-service/view', new_state);
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="pt-5">
                    <Breadcremb flag="others" bredcrumb1_link="/tasker" bredcrumb1="Home" bredcrumb2_link="/tasker/my-services" bredcrumb2="My Service" />
                        <h4 className="title fM mb-3">{ i18next.t('Services Details') }</h4>

                        { this.state.services && this.state.services.map((i,k) => {
                            return (
                                <div className="serviceDetail">
                                    <div className="cardTwoStyle">
                                        
                                            <div className="row" onClick={ (e)=> { e.stopPropagation(); this.view_service(k); } }>
                                                <div className="col-sm-9 col-lg-10">
                                                    <div className="row">
                                                        <div className="col-sm-4 col-lg-3">
                                                            <img onError={this.service_image_err} alt="" className="rounded imgBg" src={i.service_image} height={100} />
                                                        </div>
                                                        <div className="col-sm-8 col-lg-9">
                                                            <div className="detailsSection mt-3 mt-sm-0">
                                                                <div className="fM text-truncate mb-1">
                                                                    {i.service_name}
             </div>

                                                                <p className="font-sm mb-0">{i.subcategory_name} - {i.service_name} </p>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-sm-3 col-lg-2">
                                                    <div className="mt-3 mt-sm-0 text-md-right">
                                                        <div className="detailsSection overflow-hidden mb-lg-2">
                                                            <div className="detailsSix text-truncate mb-2">
                                                                <span> { this.state.general_info && this.state.general_info.currency_symbol } { i.service_price }</span> / { i.service_pricing }
                                 </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            )
                        })}

                       

                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export default MyServiceDetail;