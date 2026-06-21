import React, { Component } from 'react';
import LexOneWelcome from '../components/HomePage/LexOneWelcome';
import LexOneDashboard from '../components/HomePage/LexOneDashboard';
import axios from 'axios';
import MetaDecorator from '../components/MetaDecorator';
import Loader from "react-loader-spinner";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            home : {},
            is_loading : true,
        }
    }
    componentDidMount = () => {
        this.get_home_page_contents();
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
                    this.setState({home:res.data, is_loading: false},()=>{
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
                else {
                    this.setState({ is_loading: false });
                }
            }
            else {
                this.setState({ is_loading: false });
            }
        })
        .catch(()=>{
            this.setState({ is_loading: false });
        }) 
    }
    render() {
        const user_info = localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : null;
        const is_logged_in_user = user_info !== null && user_info.type === 'user';
        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title=' | Find and Hire Lawyers' description="LexOne — search, compare, and hire verified lawyers in Mexico." />
                {
                    this.state.is_loading === true ?
                    <div>
                        <Loader
                            type="ThreeDots"
                            color="#C09B4B"
                            height={100}
                            width={100}
                        />
                    </div>
                    :
                    is_logged_in_user ? <LexOneDashboard /> : <LexOneWelcome />
                }
                </div>
            </React.Fragment>
        );
    }
}

export default Home;
