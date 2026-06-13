import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { withRouter } from "react-router-dom";
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

class ContactUs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formLayout: 'vertical',
            content: '',
            content_err: '',
            name_err: '',
            email_err: '',
            mobile_err: '',
            charLimit: 250,
            is_help : false,
            active_class : 'active'
        }
    }
    UNSAFE_componentWillMount = () => {
        if(this.props.match.params.helps_flag) {
            this.setState({
                url_params : this.props.match.params.helps_flag,
            })
        }
        this.get_helps();
    }
    componentDidMount = () => {
        this.set_user_details();
    }
    set_user_details = () => {
        if(localStorage.getItem('user') === null) {
            this.setState({
                user_logged : false
            })
        }
        else {
            this.setState({
                user_logged : true
            })
        }
        if(this.props.user_info) {
            this.setState({
                name : this.props.user_info.name ? this.props.user_info.name : '',
                mobile : this.props.user_info.mobile ? this.props.user_info.mobile : '',
                email : this.props.user_info.email ? this.props.user_info.email : '',
            })
        }
        else {
            this.setState({
                name : '',
                mobile : '',
                email : '',
            })
        }
    }
    get_helps = () => {
        var url = '';
        var user_info = JSON.parse(localStorage.getItem('user'))
        // console.log('this is a new user')
        // console.log(user_info)
        var user_type = user_info ? user_info.type : '';
        if(user_type !== '') {
          if(user_type === 'user') {
            url = `${process.env.REACT_APP_BASE_URL}/web/api/v1/helps/user`;
          }
          else {
            url = `${process.env.REACT_APP_BASE_URL}/web/api/v1/helps/tasker`;
          }
        }
        else {
          url = `${process.env.REACT_APP_BASE_URL}/web/api/v1/helps/user`;
        }
        axios.get(url)
        .then(res => {
            if(res.data.status_code === 200)
            {
                this.setState({ help_info : res.data.items },()=>{
                    this.get_url();
                });
            }
            else {
                this.setState({ help_info : [] },()=>{
                    this.get_url();
                });
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            url_params : nextProps.match.params.helps_flag,
        },()=>{
            this.get_url();
        })
    }
    get_url = () => {
        if(this.state.url_params) {
            var url_flag = this.state.url_params;
            if(url_flag === 'form') {
                this.view_helps(false,''); 
            }
            else {
                var help_arr = this.state.help_info && this.state.help_info;
                var name = '';
                if(help_arr.length > 0) {
                    name = help_arr[1].name;
                    this.view_helps(true,name); 
                }
                else {
                    this.view_helps(false,''); 
                }
            }
        }
    }
    contactus_submit = () => {
        var err = 0;
        // eslint-disable-next-line
        const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        var rm= this.state;
        if(rm.name === '')
        {
            this.setState({ name_err : i18next.t('Name is required!') })
            err++;
        }
        else {
            this.setState({ name_err : '' })
        }
        if(rm.email === '')
        {
            this.setState({ email_err : i18next.t('Email is required!') })
            err++;
        }
        else if(!validEmailRegex.test(rm.email)) {
            this.setState({email_err: i18next.t('Email is Invalid')});
            err++;
        }
        else {
            this.setState({ email_err : '' })
        }
        if(rm.mobile === '')
        {
            this.setState({ mobile_err : i18next.t('Mobile Number is required!') })
            err++;
        }
        else {
            this.setState({ mobile_err : '' })
        }
        if(rm.content === '')
        {
            this.setState({ content_err : i18next.t('Message is required!') })
            err++;
        }
        else {
            this.setState({ content_err : '' })
        }
        if(err === 0) {
            const config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            const params = new URLSearchParams();
            params.append('user_id', this.props.user_info.user_id);
            params.append('name', rm.name);
            params.append('mobile', rm.mobile);
            params.append('email', rm.email);
            params.append('description', rm.content);
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/contactus`,params, config)
            .then (res => {
                if(res.data.status_code === 200) {
                    Toast.fire({
                        icon: 'success',
                        title: res.data.message
                    });
                    if(this.state.user_logged && this.state.user_logged === true) {
                        this.setState({ 
                            content : '',
                            name_err : '',
                            mobile_err : '',
                            email_err : '',
                            content_err : '',                   
                        })
                    }
                    else {
                        this.setState({ 
                            email : '',
                            mobile : '',
                            name : '',
                            content : '',
                            name_err : '',
                            mobile_err : '',
                            email_err : '',
                            content_err : '',                  
                        })
                    }
                    
                } 
                else {
                    Toast.fire({
                        icon: 'warning',
                        title: res.data.message
                    });
                }
            })
        }
        else{

        }
    }
    isNumber = (e) => {
        // eslint-disable-next-line
        var rgx = /^[\+\d]?(?:[\d-.\s()]*)$/;
        if (rgx.test(e.target.value)) {
            this.setState({mobile: e.target.value})
        }
        if(e.target.value.length === 0) {
            this.setState({mobile: e.target.value})
        }
    }
    view_helps = (flag,help_flag) => {

        console.log('flag',flag);
        console.log('help_flag',help_flag);
        if(flag === false) {
            this.setState({
                is_help : flag,
                active_class : 'contact',
            })
        }
        else {
            var help_arr = this.state.help_info && this.state.help_info;
            var help_index = help_arr.findIndex(x => x.name === help_flag);
            var content_of_helps = help_arr[help_index].description;
            var name_of_helps = help_arr[help_index].name;
            this.setState({
                is_help : flag,
                content_of_helps : content_of_helps,
                name_of_helps : name_of_helps,
                active_class : name_of_helps,
            })
        }
        
    }
    render() {
        const { TextArea } = Input;
        return (
            <React.Fragment>
                <div className="container">
                    <div className="pt-5">
                        <div className="row px-3">
                            <div className="col-sm-4 col-md-3 col-lg-3 col-xl-2 pb-4 pb-lg-0 px-0">
                                {/* eslint-disable-next-line */}
                                <a onClick={ ()=> { this.view_helps(false,''); } } className={ this.state.active_class === 'contact' ? 'active_help' : '' }> <p className="mb-2 fM">{ i18next.t("Contact Us") }</p></a>
                                {
                                    this.state.help_info && this.state.help_info.length > 0 && this.state.help_info.map((i,k)=>{
                                        return(
                                            <span key={ k }>
                                            {/* eslint-disable-next-line */}
                                            <a onClick={ ()=>{ this.view_helps(true,i.name); } } className={ this.state.active_class === i.name ? 'active_help' : '' }> <p className="mb-2 fM">{ i.name }</p></a>
                                            </span>
                                        )
                                    })
                                }
                            </div>
                            {
                                this.state.is_help === false ?
                                <div className="col-sm-8 col-md-9 col-lg-9 col-xl-10 pl-0 pl-sm-3 pl-lg-0 pr-0">
                                <div className="contactUs">
                                    <div className="form p-4 boxShadow">
                                        <div className="mb-4">
                                            <p className="mb-1 fM">{ i18next.t("EMAIL TO SUPPORT TEAM") }</p>
                                            <p className="mb-1">{ i18next.t("We'll get back to you as soon as possible.") }</p>
                                        </div>
                                        <Form>
                                            <Form.Item label={ i18next.t("Your Name") }className="mb-4 fM">
                                                <Input onChange={ (e)=> {  this.setState({ name : e.target.value }) } } size="large" placeholder={ i18next.t("Enter Your Name") } value={this.state.name} />
                                                <p className="text-danger">{ this.state.name_err }</p>
                                            </Form.Item>

                                            <Form.Item label={ i18next.t("Your Mobile Number") } className="mb-4 fM">
                                                <Input size="large" onChange={ this.isNumber  } placeholder={ i18next.t("Enter Your Mobile Number") }  value={this.state.mobile} maxLength="15"/>
                                                <p className="text-danger">{ this.state.mobile_err }</p>
                                            </Form.Item>

                                            <Form.Item label={ i18next.t("Your Email") } className="mb-4 fM">
                                                <Input  size="large" onChange={ (e)=> {  this.setState({ email : e.target.value }) } } placeholder={ i18next.t("Enter Your Email") } value={this.state.email} readOnly = { this.state.user_logged && this.state.user_logged} />
                                                <p className="text-danger">{ this.state.email_err }</p>
                                            </Form.Item>

                                            {/* <Form.Item label="Your Email" className="mb-1 fM">
                                                <Input size="large" placeholder="Enter Your Email" />
                                            </Form.Item> */}
                                            <Form.Item label={ i18next.t("Message") } className="mb-1 fM">

                                                <TextArea maxLength="250" name='content' onChange={(e) => this.setState({ content: e.target.value })} placeholder={ i18next.t("Type Your message") } autosize={{ minRows: 4, maxRows: 5 }} value={this.state.content}>
                                                </TextArea>
                                                <p className="text-danger">{ this.state.content_err }</p>
                                            </Form.Item>
                                            <p className="mb-5 color2 fS-sm">({ i18next.t("Maximum") } {this.state.charLimit - this.state.content.length} { i18next.t("characters only") })</p>

                                            <Form.Item >
                                                <Button onClick={ this.contactus_submit } className=" PrimaryBtn lg" type="primary">{ i18next.t("Send") }</Button>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                                :
                                <div className="col-sm-8 col-md-9 col-lg-9 col-xl-10 pl-0 pl-sm-3 pl-lg-0 pr-0">
                                    <>
                                    <h5 className="fM font-xxl">{ this.state.name_of_helps && this.state.name_of_helps}</h5>
                                    <div className="mb-2" dangerouslySetInnerHTML={{__html:this.state.content_of_helps && this.state.content_of_helps }}>
                                    </div>
                                    </>
                                </div>
                            }
                            
                        </div>
                      
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(ContactUs);