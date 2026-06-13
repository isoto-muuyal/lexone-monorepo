import React, { Component } from 'react';
import axios from 'axios';
import MetaDecorator from '../../../components/MetaDecorator';  
import Loader from "react-loader-spinner";

class UpdatePaymentStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount = () => {
        this.get_booking_by_id();
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../../assets/images/default_service_image.png");
    }
    get_booking_by_id = () => {
        var user_info = JSON.parse(localStorage.getItem('user'));
        var general_info = JSON.parse(localStorage.getItem('general_info'))
        let payment_type = this.props.match && this.props.match.params && this.props.match.params.payment_type;


        let booking_id = this.props.match && this.props.match.params && this.props.match.params.booking_id;
        let session_id = this.props.match && this.props.match.params && this.props.match.params.session_id;
        let currency_code = general_info.currency_code;
        let language = general_info.user_terms.lang;

        if(payment_type === 'reward'){
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams()
             params.append('user_id', user_info.user_id);
             params.append('booking_id', booking_id);
             params.append('session_id', session_id);
             params.append('currency_code', currency_code);
             
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/retrieverewardsessions`,params,config)
            .then (res=>{
                this.props.history.push('/user/my-booking/detail', res.data);
            });
        }else if(payment_type === 'booking'){
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams()
             params.append('user_id', user_info.user_id);
             params.append('booking_id', booking_id);
             params.append('session_id', session_id);
             params.append('currency_code',currency_code);
             params.append('language',language);
             
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/retrievesessions`,params,config)
            .then (res=>{
                if(res.data.status_code === 200){
                    this.props.history.push('/user/my-booking/detail', res.data);
                }
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className={ "loadercls" }>
                <MetaDecorator title='| Updating Payment status' description="Booking Payment Progress"/>
                    <div>
                        <Loader
                            type="ThreeDots"
                            color="#0313FC"
                            height={100}
                            width={100}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UpdatePaymentStatus;