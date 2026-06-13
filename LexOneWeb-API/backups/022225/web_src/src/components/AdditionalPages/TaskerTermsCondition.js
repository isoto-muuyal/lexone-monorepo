import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import i18next from 'i18next';

class TaskerTermaCondition extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount = () => {
        this.get_helps();
    }
    get_helps = () =>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/helps/tasker`)
        .then(res => {
            if(res.data.status_code === 200)
            {
                this.setState({ help_info : res.data });
            }
            else {
                this.setState({ help_info : {} });
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="pt-5">

                        <div className="row px-3">
                            <div className="col-sm-4 col-md-3 col-lg-3 col-xl-2 pb-4 pb-lg-0 px-0">
                                <NavLink to="/contactus" className=""> <p className="txtClr mb-2 fM">{ i18next.t("Contact Us") }</p></NavLink>
                                <NavLink to="/privacy-policy" className=""> <p className="txtClr mb-2 fM">{ i18next.t("Privacy Policy") }</p></NavLink>
                                <NavLink to="/terms-condition" className=""> <p className="mb-2 fM">{ i18next.t("Terms and Condition") }</p></NavLink>
                            </div>
                            <div className="col-sm-8 col-md-9 col-lg-9 col-xl-10 pl-0 pl-sm-3 pl-lg-0 pr-0">
                                 
                                <>
                                <h5 className="fM font-xxl">{ this.state.help_info && this.state.help_info.items[0].name }</h5>
                                <div className="mb-2" dangerouslySetInnerHTML={{__html: this.state.help_info && this.state.help_info.items[0].description }}>
                                </div>
                                </>
                                

                            </div>
                        </div>
                       
                    </div>
                </div>
               
            </React.Fragment>
        );
    }
}

export default withRouter(TaskerTermaCondition);