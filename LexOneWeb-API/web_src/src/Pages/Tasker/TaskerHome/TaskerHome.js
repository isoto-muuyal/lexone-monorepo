import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Select } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from '../../../../node_modules/recharts';
import RecentTaskSlider from '../../../components/HomePage/RecentTaskSlider';
import axios from 'axios';
import MetaDecorator from '../../../components/MetaDecorator';  
import Loader from "react-loader-spinner";
import i18next from "i18next";
import Swal from 'sweetalert2';
import { isMockToken, MOCK_LAWYER_PROFILE_DETAIL, MOCK_LAWYER_DASHBOARD, MOCK_CLIENTS, MOCK_APPOINTMENTS } from '../../../utils/mockAuth';


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
const { Option } = Select;
const RecentTask = (i) => {
    return (
        <div className="recentTasks homeSlide mb-5">
            <div className="mb-2">
                <div className="d-flex justify-content-between">
                    <h4 className="text-truncate fM mb-0">{i.title} </h4>
                    <Link to="/tasker/my-booking">
                        <div className="text-right defaultColor font-sm ">{ i18next.t('View all') }</div>
                    </Link>
                </div>
            </div>
            <RecentTaskSlider recent_bookings={ i.upcoming_tasks }/>
        </div>
    )
}

class TaskerHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            earn_statistics : [],
            filt_type : 'Weekly',
            is_loading : true,
            call_once : false,
            clients: [],
            appointments: [],
        }
    }
    componentDidMount = () => {
        this.get_tasker_home();
    }
    get_tasker_home = () => {
        if(localStorage.getItem('user') !== null) {
            var user_info = JSON.parse(localStorage.getItem('user'));

            if (isMockToken(localStorage.getItem('access_token'))) {
                this.setState({
                    user_info,
                    user_profile: MOCK_LAWYER_PROFILE_DETAIL,
                    home_info: MOCK_LAWYER_DASHBOARD,
                    clients: MOCK_CLIENTS,
                    appointments: MOCK_APPOINTMENTS,
                    is_loading: false,
                }, () => this.change_chart_dynamically('Weekly'));
                return;
            }

            this.setState({
                user_info : user_info
            },()=>{
                var user_id = this.state.user_info.user_id;
                const config = {
                    headers : {
                        'Content-type' : 'application/x-www-form-urlencoded'
                    }
                }
                const params = new URLSearchParams();
                params.append('user_id',user_id);
                axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/profile`,params, config)
                .then (res => {
                    if(res.data.status_code === 200) {
                        this.setState({ user_profile : res.data });
                    } 
                    else if(res.data.status_code === 401) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('user');
                        this.props.history.push('/');
                        window.location.reload(false);
                    }
                })
            })
            var user_id = user_info.user_id;
            axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/dashboard/${user_id}`)
            .then(res => {
                if(res.data.status_code === 200)
                {
                    this.setState({ home_info : res.data, is_loading : false },()=>{
                        this.change_chart_dynamically('Weekly')
                    });
                }
                else if(res.data.status_code === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    this.props.history.push('/');
                    window.location.reload(false);
                }
                else {
                    this.setState({ home_info : {}, is_loading : false });
                }
            });
        }
    }
    open_payment_link = () =>{
        // var general_info = JSON.parse(localStorage.getItem('general_info'));
        // var path = `${process.env.REACT_APP_FRONT_BASE_URL}/tasker/update-payout`;
        // var client_id = general_info.stripe_clientid;
        // // window.location.href = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=${path}/&client_id=${client_id}`;
        // window.location.href = `https://connect.stripe.com/express/oauth/authorize?response_type=code&client_id=${client_id}&scope=read_write&redirect_uri=${path}`;

        if(this.state.call_once === false) {
            if(localStorage.getItem('user') === null) {
                this.props.history.push('/tasker/tasker-login');
                window.location.reload(false);
            }
            else {
                var user_info = JSON.parse(localStorage.getItem('user'));
                var tasker_id = user_info.user_id;
                
                //var token = new URLSearchParams(this.props.location.search).get("code");

                axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/stripeurl/${tasker_id}`)
                .then (res=>{
                    this.setState({
                        call_once : true
                    },()=>{
                         console.log(res.data);
                        if(res.data.status_code === 200) {
                           window.location.href = res.data.stripe_url; 
                          
                        }
                        else {
                            Toast.fire({
                                icon: 'warning',
                                title: 'Fail to update Payout Information!'
                            });
                            this.props.history.push('/tasker');
                        }
                    })
                });
            }
            
        }
    }
    change_chart_dynamically = (value) => {
        this.setState({ filt_type : value });
        if(value === 'Weekly') {
            this.setState({ earn_statistics : this.state.home_info && this.state.home_info.earn.week })
        }
        else if (value === 'Monthly') {
            this.setState({ earn_statistics : this.state.home_info && this.state.home_info.earn.month })
        }
    }   
    render() {
        
        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title='| Tasker Home' description="IDemand Tasker Home Page"/>
                {
                    this.state.is_loading === true ?
                    <div>
                        <Loader
                            type="ThreeDots"
                            color="#0313FC"
                            height={100}
                            width={100}
                        />
                    </div>
                    :
                    <div className="container">
                        <div className="pt-5">
                            <div className="taskerHome">
                                <section className="mb-5">
                                    <h4 className="title fM">{ i18next.t('Dashboard') }</h4>
                                    <div className="box fiveColumn">
                                        <div className="row px-sm-3 px-0">
                                            <div className="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-5 mb-4 mb-xl-0">
                                                <Link to="/tasker/cases" className="my-card p-3 lexone-stat-link">
                                                    <div className="d-flex">
                                                        <div className="mt-1">
                                                            <span className="align-self-center mr-2 red"></span>
                                                        </div>
                                                        <p className="align-self-center mb-0 font-lg">{ i18next.t('Total Tasks') }</p>
                                                    </div>
                                                    <p className="font-xxl fM mb-0 mt-2">{ this.state.home_info ? this.state.home_info.total_tasks : 0 }</p>
                                                </Link>
                                            </div>
                                            <div className="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-5 mb-4 mb-xl-0">
                                                <Link to="/tasker/my-booking" className="my-card p-3 lexone-stat-link">
                                                    <div className="d-flex">
                                                        <div className="mt-1">
                                                            <span className="align-self-center mr-2 orange"></span>
                                                        </div>
                                                        <p className="align-self-center mb-0 font-lg">{ i18next.t('Accepted task') }</p>
                                                    </div>
                                                    <p className="font-xxl fM mb-0 mt-2">{ this.state.home_info ? this.state.home_info.upcoming_tasks : 0 }</p>
                                                </Link>
                                            </div>
                                            <div className="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-5 mb-4 mb-xl-0">
                                                <Link to="/tasker/my-booking" className="my-card p-3 lexone-stat-link">
                                                    <div className="d-flex">
                                                        <div className="mt-1">
                                                            <span className="mr-2 green"></span>
                                                        </div>
                                                        <p className="align-self-center mb-0 font-lg">{ i18next.t('Total Earnings') }</p>
                                                    </div>
                                                    <p className="font-xxl fM mb-0 mt-2">{this.props.general_info && this.props.general_info.currency_symbol } { this.state.home_info ? this.state.home_info.total_earnings : 0 }</p>
                                                </Link>
                                            </div>
                                            <div className="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-5 mb-4 mb-xl-0">
                                                <Link to="/tasker/my-booking" className="my-card p-3 lexone-stat-link">
                                                    <div className="d-flex">
                                                        <div className="mt-1">
                                                            <span className="align-self-center mr-2 blue"></span>
                                                        </div>
                                                        <p className="align-self-center mb-0 font-lg">{ i18next.t('Completed task') }</p>
                                                    </div>
                                                    <p className="font-xxl fM mb-0 mt-2">{ this.state.home_info ? this.state.home_info.completed_tasks : 0 }</p>
                                                </Link>
                                            </div>
                                            <div className="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-5 mb-4 mb-xl-0">
                                                <Link to="/tasker/my-booking" className="my-card p-3 lexone-stat-link">
                                                    <div className="d-flex">
                                                        <div className="mt-1">
                                                            <span className="mr-2 yellow"></span>
                                                        </div>
                                                        <p className="align-self-center mb-0 font-lg">{ i18next.t('Pending Earnings') }</p>
                                                    </div>
                                                    <p className="font-xxl fM mb-0 mt-2">{this.props.general_info && this.props.general_info.currency_symbol } { this.state.home_info ? this.state.home_info.pending_earnings : 0 }</p>
                                                </Link>
                                            </div>

                                        </div>
                                    </div>
                                </section>

                                {/* Clients section */}
                                {this.state.clients && this.state.clients.length > 0 && (
                                <section className="mb-5">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="title fM mb-0">Mis Clientes</h4>
                                        <Link to="/tasker/clients" className="defaultColor font-sm">{ i18next.t('View all') }</Link>
                                    </div>
                                    <div className="lexone-clients-grid">
                                        {this.state.clients.slice(0, 4).map(client => (
                                            <Link
                                                key={client.client_id}
                                                to={`/tasker/clients/${client.client_id}`}
                                                className="lexone-client-card"
                                            >
                                                <div className="lexone-avatar lexone-avatar-sm">
                                                    {client.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                                                </div>
                                                <div className="lexone-client-card-info">
                                                    <strong>{client.name}</strong>
                                                    <span>{client.case_ids.length} caso(s)</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                                )}

                                {/* Calendar preview */}
                                {this.state.appointments && this.state.appointments.length > 0 && (
                                <section className="mb-5">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="title fM mb-0">Próximas citas</h4>
                                        <Link to="/tasker/calendar" className="defaultColor font-sm">{ i18next.t('View all') }</Link>
                                    </div>
                                    <div className="lexone-clients-grid">
                                        {this.state.appointments.slice(0, 4).map(appt => (
                                            <Link
                                                key={appt.appointment_id}
                                                to="/tasker/calendar"
                                                className="lexone-client-card"
                                            >
                                                <div className={`lexone-appt-dot ${appt.type === 'online' ? 'online' : 'in-person'}`} />
                                                <div className="lexone-client-card-info">
                                                    <strong>{appt.title}</strong>
                                                    <span>{appt.client_name} · {appt.date}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                                )}

                                {
                                    this.state.user_profile && this.state.user_profile.payment_verified === "true" && this.state.user_profile.profile_verified === "true" ?
                                    <>
                                    <section className="mb-5">
                                        <div className="d-flex justify-content-between mb-3">
                                            <h4 className="title fM mb-0">{ i18next.t('Tasks & Earn') }</h4>
                                            <div>
                                                <Select className="" onChange={this.change_chart_dynamically} defaultValue ={ i18next.t('Weekly') }>
                                                    <Option value="Weekly">{ i18next.t('Weekly') }</Option>
                                                    <Option value="Monthly">{ i18next.t('Monthly') }</Option>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="graph p-2 p-sm-4 mb-5">

                                            <div className="d-flex">
                                                {/* <div className="tasks d-flex mr-4"><span className="align-self-center mr-2"></span><p className="align-self-center mb-0">Tasks</p></div> */}
                                                <div className="earn d-flex"><span className="align-self-center mr-2"></span><p className="align-self-center mb-0">{ i18next.t('Earns') }</p></div>
                                            </div>


                                            <div style={{ width: '99%', height: 300 }}>
                                                <ResponsiveContainer>
                                                    <AreaChart
                                                        data={this.state.earn_statistics}
                                                        margin={{
                                                            top: 10, right: 30, left: 0, bottom: 0,
                                                        }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="duration" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Area type="monotone" dataKey="earns" stackId="1" stroke="#c05afe" fill="#c05afe" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </section>
                                    <section className="mb-5">
                                    {
                                    this.state.home_info && typeof this.state.home_info.upcoming !== 'undefined' && this.state.home_info.upcoming.length > 0 &&                    
                                        <RecentTask title={ i18next.t("Upcoming Tasks") } upcoming_tasks={this.state.home_info.upcoming}/>
                                    }
                                    </section>
                                    </>
                                    :
                                    this.state.user_profile && this.state.user_profile.payment_verified === "false" ? 
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div className="emptydetail">
                                            <img src={require("../../../assets/images/deactivate.png")} alt=""
                                                className=""  />

                                            <div className="emptycontent text-center">
                                                <h3 className="title fM"> { i18next.t("Payment details") }</h3>
                                                <h5>{ i18next.t("Add Payment To Activate Your Account") }</h5>
                                                <div className="primaryClr cursorPointer" onClick={ this.open_payment_link }> { i18next.t("Click Here") } </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    this.state.user_profile && this.state.user_profile.profile_verified === "false" &&
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div className="emptydetail">
                                            <img src={require("../../../assets/images/deactivate.png")} alt=""
                                                className=""  />

                                            <div className="emptycontent text-center">
                                                <h3 className="title fM"> { i18next.t("Profile Details") }</h3>
                                                <h5>{ i18next.t("Yet to be Approved by Admin.") }</h5>
                                            </div>
                                        </div>
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                }
                </div>
            </React.Fragment>
        );
    }
}

export default TaskerHome;