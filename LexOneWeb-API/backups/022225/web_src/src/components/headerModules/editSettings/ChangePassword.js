import React, { Component } from 'react';
import FloatingInputs from "../../../components/FloatingLabel";
import { Button } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import i18next from 'i18next';
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

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            old_password : '',
            new_password : '',
            confirm_password : '',
            old_password_err : '',
            new_password_err : '',
            confirm_password_err : ''
        }
    }
    update_new_password = () => {
        var err = 0;
        var st = this.state;
        if(st.old_password === '')
        {
            this.setState({ old_password_err : i18next.t('Current Password is required!') });
            err++;
        }
        else {
            this.setState({ old_password_err : '' });
        }

        if(st.new_password === '') {
            this.setState({new_password_err:i18next.t('New Password is required!')});
            
            err++;
        }
        else if(st.new_password.length < 6) {
            this.setState({new_password_err:i18next.t('New Password Must be in above 6 Characters')});
            err++;
        }
        else {
            this.setState({new_password_err:''});
        }

        if(st.confirm_password === '')
        {
            this.setState({ confirm_password_err : i18next.t('Confirm Password is required!') });
            err++;
        }
        else if(st.new_password !== st.confirm_password) 
        {
            this.setState({ confirm_password_err : i18next.t('Password is Mismatch!') });
            err++;
        }
        else {
            this.setState({ confirm_password_err : '' });
        }

        if(err === 0) {
            if(st.new_password !== st.old_password) {
                const config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                var url = '';
                if(this.props.userInfo.type === 'tasker') {
                    url = `${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/resetpassword`;
                }
                else {
                    url = `${process.env.REACT_APP_BASE_URL}/web/api/v1/user/resetpassword`;
                }
                const params = new URLSearchParams()
                params.append('user_id', this.props.userInfo.user_id);
                params.append('current_password', st.old_password);
                params.append('new_password', st.new_password);

                axios.post(url, 
                params,config)
                    .then(res => {
                        console.log(res);
                        console.log(res.data);
                        if(res.data.status_code === 200){
                            // history.replaceState('/user/user-login/1');
                            this.setState({
                                old_password : '', 
                                new_password : '',
                                confirm_password : '',
                                old_password_err : '', 
                                new_password_err : '',
                                confirm_password_err : '',
                            });
                            Toast.fire({
                                icon: 'success',
                                title: res.data.message
                            });
                            this.props.changePasswordClose();
                        }
                        else if(res.data.status_code === 400){
                            this.setState({old_password_err : res.data.message});
                        }
                        else if(res.data.status_code === 401) {
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('user');
                            this.props.history.push('/');
                            window.location.reload(false);
                        }
                        else {
                            this.setState({t_and_c_err: 'Something Went Wrong!'});
                        }
                    })
            }
            else {
                this.setState({new_password_err : i18next.t('No Changes Deducted!')});
            }
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className="px-3 px-md-4 py-2">
                    <div className="forms mt-4">
                        <form action="" className="floatingLabelStyle">
                            <div className="row">
                                <div className="col-12">
                                    <FloatingInputs labelName={i18next.t("Enter Current Password")}>
                                      
                                        <input type="password" placeholder=" " onChange={ (e)=> { this.setState({ old_password : e.target.value }) } } value={this.state.old_password} />
                                        <p className="text-danger">{this.state.old_password_err}</p>
                                    </FloatingInputs>
                                </div>
                                <div className="col-12">
                                    <FloatingInputs labelName={i18next.t("Enter New Password")}>
                                        <input type="password" placeholder=" " onChange={ (e)=> { this.setState({ new_password : e.target.value }) } } value={this.state.new_password} />
                                        <p className="text-danger">{this.state.new_password_err}</p>
                                    </FloatingInputs>
                                </div>
                                <div className="col-12">
                                    <FloatingInputs labelName={i18next.t("Enter Confirm Password")}>
                                        <input type="password" placeholder=" " onChange={ (e)=> { this.setState({ confirm_password : e.target.value }) } } value={this.state.confirm_password} />
                                        <p className="text-danger">{this.state.confirm_password_err}</p>
                                    </FloatingInputs>
                                </div>


                                <div className="col-12">
                                    <div className="col-sm-4 px-0 align-self-center">
                                        <Button onClick={ this.update_new_password } className="PrimaryBtn lg mb-2 mb-sm-0" block>{i18next.t("Save")}</Button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ChangePassword;