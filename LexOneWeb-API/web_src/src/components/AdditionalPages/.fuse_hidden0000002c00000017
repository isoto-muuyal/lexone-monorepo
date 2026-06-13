import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import Footer from '../Footer';
import i18next from 'i18next';

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="pt-5">

                        <div className="row px-3">
                            <div className="col-sm-4 col-md-3 col-lg-3 col-xl-2 pb-4 pb-lg-0 px-0">
                                <NavLink to="/ContactUS" className=""> <p className="txtClr mb-2 fM">{ i18next.t('Contact Us') }</p></NavLink>
                                <NavLink to="" className=""> <p className=" mb-2 fM">{ i18next.t('Help') }</p></NavLink>
                                <NavLink to="/PrivacyPolicy" className=""> <p className="txtClr mb-2 fM">{ i18next.t('Privacy Policy') }</p></NavLink>
                                <NavLink to="/TermsCondition" className=""> <p className="txtClr mb-2 fM">{ i18next.t('Terms and Condition') }</p></NavLink>
                            </div>
                            <div className="col-sm-8 col-md-9 col-lg-9 col-xl-10 pl-0 pl-sm-3 pl-lg-0 pr-0">
                                <h5 className="fM font-xxl">{ i18next.t('Help') }</h5>
                                <div className="mb-2">
                                    <p className="title fM mb-2">{ i18next.t('Why do Use it?') }</p>
                                    <p className="content">is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                </div>
                                <div className="mb-2">
                                    <p className="title fM mb-2">Where does it come from?</p>
                                    <p className="content">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur,</p>
                                </div>

                            </div>
                        </div>
                       
                    </div>
                </div>
                <Footer />
               
            </React.Fragment>
        );
    }
}

export default Help;