import React, { Component } from 'react';
import { Select, Divider } from 'antd';
import { NavLink,withRouter } from "react-router-dom";
import axios from 'axios';
import i18next from 'i18next';
import {Adsense} from '@ctrl/react-adsense';
const { Option } = Select;

function handleChange(value) {
    if(localStorage.getItem('user') !== null) {
        var user_info = JSON.parse(localStorage.getItem('user'));

        const config = {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        }
            const params = new URLSearchParams()
            params.append('user_id', user_info.user_id);
            params.append('language_type', value);
            
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/${user_info.type}/profile`, 
            params,config)
                .then(res => {
                    if(res.status === 200) {
                        if(res.data.status_code === 200){
                            console.log(res.data)
                            localStorage.setItem('lang',value);
                            window.location.reload();
                        }
                        else if(res.data.status_code === 400){
                            console.log(res.data)
                        }
                        else if(res.data.status_code === 401) {
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('user');
                            this.props.history.push('/');
                            window.location.reload(false);
                        }
                        else {
                            console.log(res.data)
                        }
                    }
                })
                
        
    }
    else {
        localStorage.setItem('lang',value);
        window.location.reload();
    }
}
var set_lang = '';
const FooterContent = (props) => {
    console.log('props');
    console.log(props);
    set_lang = localStorage.getItem('lang') || 'en';
    
    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-3">
                        <section className="footerLinkSection pt-0">
                            <p className="footerLinks"> <NavLink className="footerNavLinks txtClr" to="/contactus/help"> { i18next.t("Help") } </NavLink></p>
                            <p className="footerLinks"> <NavLink className="footerNavLinks txtClr" to="/contactus/form"> { i18next.t("Contact us") } </NavLink></p>
                            {/* {
                                props.user_info && props.user_info.type && props.user_info.type !== 'tasker' &&
                                <p className="footerLinks"> <NavLink className="footerNavLinks txtClr" to="/tasker/tasker-login"> Became a Tasker</NavLink></p>
                            } */}
                            {
                                props.user_info && props.user_info.type === undefined &&
                                <p className="footerLinks"> <NavLink className="footerNavLinks txtClr" to="/tasker/tasker-login"> { i18next.t("Became a Tasker") }</NavLink></p>
                            }
                        </section>
                    </div>
                    <div className="col-lg-5 col-md-5">
                        <section className="footerLinkSection pt-0 pt-lg-0">
                            <p className="fontVariantTwo">{ i18next.t("Available on") }</p>
                            <div className="d-flex">
                                <a href="https://play.google.com/" target="_blank" rel="noopener noreferrer">
                                    <div className="appLinkAndroid appLinkSize">
                                        <img src={require("../assets/icons/social/appLinkAndroid.png")} className="storesicon md" alt="" />
                                    </div>
                                </a>
                                <a href="https://apps.apple.com/" rel="noopener noreferrer" target="_blank">
                                    <div className="appLinkIos appLinkSize mx-3">
                                        <img src={require("../assets/icons/social/appLinkIos.png")} className="storesicon md" alt="" />
                                    </div>
                                </a>
                            </div>
                        </section>
                    </div>
                    <div className="col-lg-3 col-md-4">
                        <Select className="mb-3 mr-4 mr-lg-0" defaultValue={ set_lang } onChange={handleChange}>
                            <Option value="en">English</Option>
                            <Option value="fr">French</Option>
                        </Select>
                        {/* <Select defaultValue="Inr" onChange={handleChange}>
                            <Option value="Eur">Eur</Option>
                            <Option value="US Dolar">US Dolar</Option>
                            <Option value="Riyath">Riyath</Option>
                        </Select> */}
                    </div>
                </div>

                <Divider />
                <div className="bottomOf d-flex flex-wrap gap-10 align-items-center justify-content-between pb-3">
                    <span>	&#169; { props.general_info && props.general_info.copyright_text }</span>

                    <div className="d-flex">
                        <a target="_blank" rel="noopener noreferrer" href={ props.general_info && props.general_info.fb_link }><div className="socialIcon fb" /></a>
                        <a target="_blank" rel="noopener noreferrer" href={ props.general_info && props.general_info.instagram_link }> 
                        <div className="socialIcon instagram" /></a>
                        <a target="_blank" rel="noopener noreferrer" href={ props.general_info && props.general_info.twitter_link }> <div className="socialIcon twitter" /></a>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }
    componentDidMount = () => {
        this.get_user_info();
    }
    get_user_info = () => {
        if(localStorage.getItem('user') !== null) {
            var user_info = JSON.parse(localStorage.getItem("user"));
            this.setState({
                user_info : user_info
            })
        }
        
    }
    render() {
        if(this.props.history.location.pathname==='/chat'){
            return null;
        }  
        return (
            <React.Fragment>
            {
                this.props.general_info && this.props.general_info.googleadsense === "true" ?
                <Adsense
                    client={ this.props.general_info && this.props.general_info.googleadclient ? this.props.general_info.googleadclient : '' }
                    slot={ this.props.general_info && this.props.general_info.googleadslot ? this.props.general_info.googleadslot : '' }
                    style={{ display: 'block' }}
                    layout="in-article"
                    format="fluid"
                /> : ''
            }
            <footer>
                <FooterContent user_info = { this.state.user_info ? this.state.user_info : {} } general_info = { this.props.general_info }/>
            </footer>
        </React.Fragment>

        );
    }
}

export default withRouter(Footer);