import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import axios from 'axios';
import i18next from "i18next";
import Swal from 'sweetalert2';

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
class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            email_err : '',
            email_succ : '',
            e_ex_err : 0,
        }
    }
    send_recover_email = () => {
        this.setState({
            email_err : '',
            email_succ : ''
        })
        var err = 0;
        var flag = this.props.match.params.role_flag;
        const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i); //eslint-disable-line
        var end_url = '';
        end_url = 'user/forgotpassword';
        if(this.state.email === '') {
            Toast.fire({
                icon: 'warning',
                title: i18next.t("Email is required!")
            });
            err++;
        }
        else if(!validEmailRegex.test(this.state.email)) {
            Toast.fire({
                icon: 'warning',
                title: i18next.t("Email is Invalid")
            });
            err++;
        }
        else {
            this.setState({email_err : ''});
        }
        if(err === 0) {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            
            const params = new URLSearchParams()
            params.append('email', this.state.email)
            params.append('role', flag)
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/${end_url}`, 
            params,config)
            .then(res => {
                if(res.data.status_code === 200) {
                    Toast.fire({
                        icon: 'success',
                        title: i18next.t(res.data.message)
                    });
                    this.setState({ email:'' });
                }
                else {
                    Toast.fire({
                        icon: 'warning',
                        title: i18next.t(res.data.message)
                    });
                }
            })
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="pt-5">
                        <div className="authenticateWidth">
                            <h4 className="fB  mb-3">{ this.props.match.params && this.props.match.params.role_flag === 'user' ? i18next.t('User') : i18next.t('Tasker') } {i18next.t('Forgot Password')}</h4>
                            <div className="authenticateField">
                                <div className="floatingLabelStyle p-4">
                                    <p className="">{i18next.t("Enter your email address and We'll send you a link to reset your Password.")}</p>
                                    <input className="border-bottom border-top-0 border-right-0 border-left-0 w-100" type="email" value={this.state.email} onChange={(e) => { this.setState({email : e.target.value}) }} placeholder="Enter your Email address" onKeyDown={(e)=>{ e.stopPropagation(); if (e.key === 'Enter') { this.send_recover_email(); } }} autoComplete={ false } />
                                    <p className="text-danger">{this.state.email_err}</p>
                                    <p className="text-success">{this.state.email_succ}</p>
                                    <div className="d-flex mt-4">
                                        <Button  size="large" onClick={this.send_recover_email} className="PrimaryBtn lg fM w-50 mr-1">{i18next.t("Reset")}</Button>

                                        <Link  to={ this.props.match.params.role_flag === 'user' ? '/user/user-login' : '/tasker/tasker-login' } className="w-50">
                                            <Button size="large" className="SecoundaryBtn lg fM w-100 ml-1" >{ i18next.t("Back") }</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ForgotPassword;