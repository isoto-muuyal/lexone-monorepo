import React from "react";
import FloatingInputs from "../../components/FloatingLabel";
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import MetaDecorator from '../../components/MetaDecorator';
import {loggedin} from '../../redux/actions';
import {connect} from 'react-redux';
import Swal from 'sweetalert2';
import i18next from "i18next";
const mapStateToProps=(props)=> {
    return {
        loginvalue : props.isLogged
    }
}
const mapDispatchToProps=(dispatch)=> {
    return {
        loggedin : (userdata)=>dispatch(loggedin(userdata))
    }
}

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

class UpdateBio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio_err : ''
        }
    }
    componentDidMount = () => {
        this.get_basic_details();
    }
    get_basic_details = () => {
        var user_info = this.props.loginvalue && this.props.loginvalue;
        this.setState({
            user_info : user_info
        })
    }
    update_bio = () => {
        var err = 0;
        if(this.state.user_info.about.trim() === '') {
            this.setState({
                bio_err : i18next.t('Bio is required!'),
            })
            err++;
        }
        else {
            this.setState({
                bio_err :''
            })
        }
        if(err === 0) {
            var user_info = this.state.user_info && this.state.user_info; 
            const config = {
                headers : {
                    'Content-type' : 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams()
            params.append('user_id', user_info.user_id);
            params.append('about', user_info.about);
            
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/profile`, 
            params,config)
            .then(res => {
                if(res.status === 200) {
                    if(res.data.status_code === 200){
                        // history.replaceState('/user/user-login/1');
                        
                        localStorage.removeItem('user');
                        this.setState({ user_info : user_info });
                        this.props.loggedin(user_info);
                        localStorage.setItem('user', JSON.stringify(user_info));
                        Toast.fire({
                            icon: 'success',
                            title: i18next.t('Updated successfully')
                        });
                        var from_new = this.props.location.state;
                        if(from_new !== undefined) {
                            this.props.history.push('/tasker/my-verification', from_new);
                        }
                    }
                    else if(res.data.status_code === 400){
                        this.setState({form_has_err : false});
                        Toast.fire({
                            icon: 'warning',
                            title: res.data.message
                        });
                    }
                    else if(res.data.status_code === 401) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('user');
                        this.props.history.push('/');
                        window.location.reload(false);
                    }
                    else {
                        Toast.fire({
                            icon: 'warning',
                            title: 'Something Went Wrong!'
                        });
                        this.setState({form_has_err: false});
                    }
                }
                else {
                    this.setState({form_has_err: false});
                    Toast.fire({
                        icon: 'warning',
                        title: 'Something Went Wrong!'
                    });
                }
            })
        }
    }
    get_back = () => {
        var obj = this.props.location.state && this.props.location.state;
        this.props.history.push('/tasker/add-services', obj);
    }
    render() {
        return (
            <React.Fragment>
                <MetaDecorator title='| Tasker Bio' description="Update Tasker Bio"/>
                <div className="container">
                    <div className="my-5">
                            
                        <div className="authenticateWidth user ">
                            <div className="d-flex justify-content-between mb-3">
                                <div className="align-self-center">  <h4 className="fB mb-0">{i18next.t("Update Bio")}</h4></div>

                                {
                                this.props.location.state !== undefined &&
                                    <div className="d-flex p-3 align-items-center hover-cont" onClick={ ()=>{ this.get_back(); }  }> 
                                        <ArrowLeftOutlined  />
                                        &nbsp;
                                        <span>{i18next.t("Back")} </span>
                                    </div>
                                }
                            </div>
                          
                            <div className="authenticateField mb-4">
                                
                                <form action="" className="floatingLabelStyle py-5 px-2 p-sm-5 mt-2 px-sm-5 text-center">
                                        <div className="col-12">
                                            <FloatingInputs labelName="Bio">
                                                <textarea onChange={ (e) => { let profile_info = {...this.state.user_info}; profile_info.about = e.target.value; this.setState({ user_info : profile_info }) } } placeholder=" " value={this.state.user_info && this.state.user_info.about === 'null' ? '' : this.state.user_info && this.state.user_info.about} maxLength="1000"/>
                                                <p className="text-danger">{ this.state.bio_err }</p>
                                            </FloatingInputs>
                                        </div>

                                    <Button onClick={this.update_bio} size="large" className="PrimaryBtn lg my-4" block>{i18next.t("Next")}</Button>
                                   
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(UpdateBio);