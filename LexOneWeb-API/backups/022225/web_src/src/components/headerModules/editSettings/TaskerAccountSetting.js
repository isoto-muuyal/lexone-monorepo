import React, { Component } from 'react';
import SimpleBar from 'simplebar-react';
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
const Notification = (i) => {
    return (
        <p className="mb-0">{i.name}</p>
    )
}

class TaskerAccountSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: null,
            PaymentDrawer: false,
            user_info : this.props.userInfo,
        }
    }
    componentDidMount = () => {
        this.get_profile_info_by_user();
    }
    showPaymentDrawer = () => {
        this.props.close();
        this.setState({
            showPaymentDrawer: true,
        });
    };
    onPaymentClose = () => {
        this.props.open();
        this.setState({
            showPaymentDrawer: false,
        });
    };
    onToggleSwitchChange = (flag) => {
        const config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        const params = new URLSearchParams();
        params.append('user_id', this.state.user_info.user_id);
        if(flag === 'book_noti') {
            this.setState({
                checked_book_noti: !this.state.checked_book_noti
            });
            params.append('booking_notification', !this.state.checked_book_noti === true ? 'true' : 'false');
        }
        else if (flag === 'chat_noti') {
            this.setState({ checked_chat_noti : !this.state.checked_chat_noti });
            
            params.append('chat_notification', !this.state.checked_chat_noti === true ? 'true' : 'false' );
        }
        else if (flag === 'book_email') {
            this.setState({
                checked_book_email: !this.state.checked_book_email
            });
            params.append('booking_email', !this.state.checked_book_email === true ? 'true' : 'false' );
        }
        else if (flag === 'payment_email') {
            this.setState({
                checked_payment_email: !this.state.checked_payment_email
            });
            params.append('payment_email', !this.state.checked_payment_email === true ? 'true' : 'false');
        }
        else if (flag === 'avail') {
            this.setState({
                checked_avail: !this.state.checked_avail
            });
            params.append('work_mode', !this.state.checked_avail === true ? 'true' : 'false');
        }

        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/profile`,params, config)
        .then (res => {
            console.log(res);
            if(res.data.status_code === 200) {
                Toast.fire({
                    icon: 'success',
                    title: i18next.t('Updated successfully')
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
                    title: res.data.message
                });
            }
        })
    }
    get_profile_info_by_user = () => {
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
            console.log('test acc');
            console.log(res.data);
            if(res.data.status_code === 200) {
                this.setState({ 
                    checked_book_email : res.data.booking_email === 'true' ? true : false,
                    checked_book_noti : res.data.booking_notification === 'true' ? true : false,
                    checked_chat_noti : res.data.chat_notification === 'true' ? true : false,
                    checked_payment_email : res.data.payment_email === 'true' ? true : false,
                    checked_avail : res.data.work_mode === 'true' ? true : false,
                })
            } 
            else if(res.data.status_code === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.history.push('/');
                window.location.reload(false);
            }
        })
    }
    open_payment_link = () =>{
        // var general_info = JSON.parse(localStorage.getItem('general_info'));
        // var path = process.env.REACT_APP_FRONT_BASE_URL;
        // var client_id = general_info.stripe_clientid;
        // window.location.href = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=${path}/&client_id=${client_id}`;
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
    render() {
        return (
            <React.Fragment>
                <SimpleBar style={{ height: 'calc(100vh - 173px)', overflowX: 'hidden' }}>
                    <div className="p-3 px-md-4">
                        <section className="mb-4">
                            <h6 className="fM mb-4">{i18next.t('Availability')}</h6>
                            <div className="d-flex justify-content-between mb-3">
                                <Notification name={i18next.t("Make me available")} />
                                <div className='ToggleSwitch ToggleSwitch__rounded'>
                                    <div className='ToggleSwitch__wrapper'>
                                        <div className={`Slider ${this.state.checked_avail && 'isChecked'}`} onClick={ (e) => { e.stopPropagation(); this.onToggleSwitchChange('avail'); }  }></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <hr />
                        <section className="mb-4">
                            <h6 className="fM mb-4">{i18next.t('Notification Setting')}</h6>
                            <div className="d-flex justify-content-between mb-3">
                                <Notification name={i18next.t("Chat")} />
                                <div className='ToggleSwitch ToggleSwitch__rounded'>
                                    <div className='ToggleSwitch__wrapper'>
                                        <div className={`Slider ${this.state.checked_chat_noti && 'isChecked'}`} onClick={ (e) => { e.stopPropagation(); this.onToggleSwitchChange('chat_noti'); }  }></div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between">
                                <Notification name={i18next.t("Booking")} />
                                <div className='ToggleSwitch ToggleSwitch__rounded'>
                                    <div className='ToggleSwitch__wrapper'>
                                        <div className={`Slider ${this.state.checked_book_noti && 'isChecked'}`} onClick={ (e) => { e.stopPropagation(); this.onToggleSwitchChange('book_noti'); } }></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <hr />
                        <section>
                            <h6 className="fM mb-4">{i18next.t("Email Setting")}</h6>
                            <div className="d-flex justify-content-between mb-3">
                                <Notification name={i18next.t("Booking")} />
                                <div className='ToggleSwitch ToggleSwitch__rounded'>
                                    <div className='ToggleSwitch__wrapper'>
                                        <div className={`Slider ${this.state.checked_book_email && 'isChecked'}`} onClick={ (e) => { e.stopPropagation(); this.onToggleSwitchChange('book_email'); } }></div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <Notification name={i18next.t("Payment")} />
                                <div className='ToggleSwitch ToggleSwitch__rounded'>
                                    <div className='ToggleSwitch__wrapper'>
                                        <div className={`Slider ${this.state.checked_payment_email && 'isChecked'}`} onClick={ (e) => { e.stopPropagation(); this.onToggleSwitchChange('payment_email'); } }></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <hr />
                        <section>
                            <h6 className="fM mb-4">{i18next.t("Payment Setting")}</h6>
                            <div className="d-flex justify-content-between cursorPointer" onClick={this.open_payment_link}>
                                <p className="mb-0">{i18next.t("Modify your payment settings")}</p>
                                <div className="RightArrow" />
                            </div>
                        </section>
                    </div>
                </SimpleBar>
            </React.Fragment>
        );
    }
}

export default TaskerAccountSetting;