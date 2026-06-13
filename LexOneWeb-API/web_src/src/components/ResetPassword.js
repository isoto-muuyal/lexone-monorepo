import React, { Component } from 'react';
import { Button } from 'antd';
import axios from 'axios';
import i18next from "i18next";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            new_password : '',
            new_password_err : '',
            confirm_password : '',
            confirm_password_err : '',
            reset_response : '',
            rested : false,
            alert_type : 'success'
        }
    }
    componentDidMount = () => {
        this.verify_token();
    }
    verify_token = () => {
        var user_id = this.props.match.params.user_id;
        var token = this.props.match.params.token;
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        
        const params = new URLSearchParams()
        params.append('user_id', user_id)
        params.append('token', token)
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/checkresetpasswordtoken`, 
        params,config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                if(res.data.status_code === 200) {
                    this.setState({ alert_type : 'success',reset_response : res.data.message, rested: false });
                }
                else {
                    this.setState({ alert_type : 'danger',reset_response : res.data.message, rested: true });
                }
            })

    }
    reset_password = () => {
        var err = 0;
        var user_id = this.props.match.params.user_id;
        var token = this.props.match.params.token;
        if(this.state.new_password === '') {
            this.setState({new_password_err : i18next.t("Password is required!")});
            err++;
        }
        else if(parseInt(this.state.new_password.length) < 6) {
            this.setState({new_password_err : i18next.t("Password Must be in above 6 Characters")});
            err++;
        }
        else {
            this.setState({new_password_err : ''});
        }
        if(this.state.confirm_password === '') {
            this.setState({ confirm_password_err : i18next.t("Make Sure Your Password is Correct!") });
            err++;
        }
        else if(this.state.confirm_password !== this.state.new_password) {
            this.setState({ confirm_password_err : i18next.t("Whoops! Your Password is Mismatch, Try again") });
            err++;
        }
        else {
            this.setState({confirm_password_err : ''});
        }

        if(err === 0) {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            
            const params = new URLSearchParams()
            params.append('user_id', user_id)
            params.append('token', token)
            params.append('password', this.state.new_password)
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/forgetresetpassword`, 
            params,config)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    if(res.data.status_code === 200) {
                        this.setState({ alert_type : 'success',reset_response : res.data.message, rested: true },()=>{
                            setTimeout(() => { 
                                if(res.data.role === 'user') {
                                    this.props.history.push('/user/user-login');
                                }
                                else {
                                    this.props.history.push('/tasker/tasker-login');
                                }
                            }, 2000);
                        });
                    }
                    else {
                        this.setState({ alert_type : 'danger',reset_response : res.data.message, rested: true },()=>{
                            setTimeout(() => { if(res.data.role === 'user') {
                                this.props.history.push('/forgotPassword/user');
                            }
                            else {
                                this.props.history.push('/forgotPassword/tasker');
                            } }, 2000);
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
                            <h4 className="fB  mb-3">{i18next.t("Reset Password")}</h4>
                            <div className="authenticateField">
                                {
                                    this.state.rested === false ?
                                    <form onSubmit={ this.reset_password } className="floatingLabelStyle p-4">
                                        <p className="">{i18next.t("New Password")}</p>
                                        <input className="border-bottom border-top-0 border-right-0 border-left-0 w-100" type="password" value={this.state.new_password} onChange={(e) => { this.setState({new_password : e.target.value}) }} placeholder={i18next.t("New Password")} />
                                        <p className="text-danger">{this.state.new_password_err}</p>

                                        <p className="">{i18next.t("Confirm Password")}</p>
                                        <input className="border-bottom border-top-0 border-right-0 border-left-0 w-100" type="password" value={this.state.confirm_password} onChange={(e) => { this.setState({confirm_password : e.target.value}) }} placeholder={i18next.t("Confirm Password")} />
                                        <p className="text-danger">{this.state.confirm_password_err}</p>
                                        <div className="d-flex mt-4">
                                            <Button size="large" onClick={this.reset_password} className="PrimaryBtn lg fM w-50 mr-1">{i18next.t("Reset")}</Button>

                                            
                                        </div>
                                    </form>
                                    :
                                    <div className={ "alert alert-"+this.state.alert_type }>{ this.state.reset_response }</div>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ResetPassword;