import React from "react";
import { Drawer, Button, Menu } from 'antd';
import { Link } from "react-router-dom";
import EditProfileSettings from './editSettings/editProfileSettings'
import SimpleBar from "simplebar-react";
import ChangePassword from "./editSettings/ChangePassword";
import UserAccountSetting from "./editSettings/UserAccountSetting";
import axios from "axios";
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loggedin } from '../../redux/actions';
import { connect } from 'react-redux';
import Loader from "react-loader-spinner";
import i18next from 'i18next';

const mapStateToProps = (props) => {
    return {
        loginvalue: props.isLogged
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        loggedin: (userdata) => dispatch(loggedin(userdata))
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

class ProfileSideBar extends React.Component {
    state = {
        visible: false,
        childrenDrawer: false,
        childrenDrawer2: false,
        ChngPwdDrawer: false,
        AcSettingDrawer: false,
        showDeactiveDrawer: false,
        access_to_change_password: true,
        logout_err: '',
        noti_paginate: 0,
        notifications: [],
        has_loadmore: true,
        noti_loading: true
    };
    UNSAFE_componentWillMount = () => {
        this.save_user_info_from_redux();
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../assets/images/default_user_image_rectangle.png");
    }
    save_user_info_from_redux = () => {
        var user_info = this.props.loginvalue && this.props.loginvalue;
        this.setState({ user_info: user_info })
    }
    get_notifications = () => {
        var user_info = JSON.parse(localStorage.getItem('user'));
        var per_page = 10;
        var noti_paginate = this.state.noti_paginate && this.state.noti_paginate;
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/notifications/${user_info.user_id}/${noti_paginate}/${per_page}`)
            .then(res => {
                console.log('notificaiton data');
                console.log(res.data);
                if (res.data.status_code === 200) {
                    if (res.data.items && res.data.items.length < per_page) {
                        this.setState({
                            has_loadmore: false
                        })
                    }
                    var notifications = this.state.notifications && this.state.notifications;
                    notifications.push(res.data.items);
                    var result = notifications.flat();
                    this.setState({
                        notifications: result,
                        noti_loading: false
                    })
                }
                else if (res.data.status_code === 400) {
                    this.setState({
                        has_loadmore: false,
                        noti_loading: false
                    })
                }
                else if (res.data.status_code === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    this.props.history.push('/');
                    window.location.reload(false);
                }
            });
    }
    logout = () => {
        var user_id = this.props.userInfo.user_id;
        const config = {
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('user_id', user_id);
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/signout`, params, config).then(res => {
            console.log(res);
            if (res.data.status_code === 200) {
                this.props.history.push('/');
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                this.props.loggedin({});
                window.location.reload(false);
            }
            else {
                this.setState({ logout_err: res.data.message }, () => {
                    this.props.history.push('/');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    this.props.loggedin({});
                    window.location.reload(false);
                });
            }
        })
    }

    AccountDelete = () => {
        Swal.fire({
            title: i18next.t('Are you sure?'),
            text: i18next.t("You want to Delete Your Account!"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                var user_id = this.props.userInfo.user_id;
                const config = {
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                }
                const params = new URLSearchParams();
                params.append('user_id', user_id);
                axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/deleteaccount`, params, config).then(res => {
                    console.log(res);
                    if (res.data.status_code === 200) {
                        Toast.fire({
                            icon: 'success',
                            title: i18next.t(res.data.message)
                        });
                        this.props.history.push('/user/user-login');
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('user');
                        window.location.reload(false);
                        
                    }
                    else {
                        Toast.fire({
                            icon: 'error',
                            title: i18next.t(res.data.message)
                        });                      
                    }
                })
            }
        });
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    showChildrenDrawer = () => {
        this.setState({
            noti_loading: true
        }, () => {
            this.get_notifications();
            this.setState({
                childrenDrawer: true,
            });
        })
    };

    onChildrenDrawerClose = () => {
        this.setState({
            childrenDrawer: false,
        });
    };

    showChildrenDrawer2 = () => {
        this.setState({
            childrenDrawer2: true,
        });
    };

    onChildrenDrawerClose2 = () => {
        this.setState({
            childrenDrawer2: false,
        });
    };


    showChngPwdDrawer = () => {
        this.setState({
            ChngPwdDrawer: true,
        });
    };

    onChngPwdDrawerClose = () => {
        this.setState({
            ChngPwdDrawer: false,
        });
    };

    showAcSettingDrawer = () => {
        this.setState({
            AcSettingDrawer: true,
        });
    };

    onAcSettingClose = () => {
        this.setState({
            AcSettingDrawer: false,
        });
    };

    showDeactiveDrawer = () => {
        this.setState({
            showDeactiveDrawer: true,
        });
    };

    onDeactiveClose = () => {
        this.setState({
            showDeactiveDrawer: false,
        });
    };

    hide_change_password_btn = () => {
        this.setState({
            access_to_change_password: false,
        });
    }
    confirmDeactivate = () => {
        Swal.fire({
            title: i18next.t('Are you sure?'),
            text: i18next.t("You want to De-Activate Your Account!"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                var user_id = this.props.userInfo.user_id;
                const config = {
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                }
                const params = new URLSearchParams();
                params.append('user_id', user_id);
                axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/deactivateaccount`, params, config)
                    .then(res => {
                        console.log(res);
                        if (res.data.status_code === 200) {
                            Swal.fire(
                                'De-Activated!',
                                res.data.message,
                                'success'
                            )
                            localStorage.removeItem('user');
                            localStorage.removeItem('access_token');
                            this.props.history.push('/');
                            window.location.reload(false);
                        }
                        else {
                            Toast.fire({
                                icon: 'warning',
                                title: i18next.t("Something Went Wrong, Try Again")
                            });
                        }
                    })

            }
        })
    }
    CloseChangePassword = () => {
        this.setState({
            ChngPwdDrawer: false
        })
    }
    parseISOString = (s) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var raw_date = new Date(s);
        var month_name = monthNames[raw_date.getMonth()];
        var year = raw_date.getFullYear();
        var date = raw_date.getDate();
        return date + '.' + month_name + '.' + year;
    }
    get_to_booking_page = (id) => {
        var obj = {};
        obj.booking_id = id;
        this.onChildrenDrawerClose();
        this.onClose();
        this.props.history.push("/user/my-booking/detail", obj);
    }
    render() {
        return (
            <React.Fragment>
                <div className="align-self-center cursorPointer" onClick={this.showDrawer}>
                    <img className="profile-sm imgBg" src={this.props.loginvalue && this.props.loginvalue.user_image} onError={this.service_image_err} height={40} width={55} alt="" />
                </div>

                <Drawer
                    destroyOnClose={true}
                    maskStyle={{ opacity: 0.1, transition: "unset", animation: "none" }}
                    className="profileRightSideBar"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >

                    <div className="contents">
                        <div className="border-bottom">
                            <div className="row mx-0 px-4 p-3">
                                <div className="col-8 pl-0">
                                    <div className="text-truncate userNameHere">{this.props.loginvalue.name}</div>
                                    {/* <div className="text-truncate userLocationHere"> Madurai, Tamilnadu </div> */}
                                </div>
                                <div className="col-4 pr-0">
                                    <div className="userImageHere text-right">
                                        <img className="profile-sm imgBg" src={this.props.loginvalue.user_image} onError={this.service_image_err} height={40} width={55} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="menuSide">
                            <SimpleBar style={{ height: 'calc( 100vh - 190px)', overflowX: 'hidden' }}>
                                <Menu onClick={this.handleClick} mode="inline">

                                    <Menu.Item key="1" onClick={this.showChildrenDrawer2}>
                                        <span className="fM">{i18next.t("Edit Profile")}</span>
                                    </Menu.Item>
                                    <Menu.Item key="2" onClick={this.showAcSettingDrawer}>
                                        <span className="fM">{i18next.t("My Account")}</span>
                                    </Menu.Item>
                                    <Menu.Item key="4" onClick={this.onClose}>
                                        <Link to="/user/my-needs">
                                            <span className="fM">{i18next.t("My Jobs")}</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="3" onClick={this.onClose}>
                                        <Link to="/user/my-booking">
                                            <span className="fM">{i18next.t("My Bookings")}</span>
                                        </Link>
                                    </Menu.Item>

                                    <Menu.Item key="5" onClick={(e) => { this.setState({ notifications: [] }, () => { this.showChildrenDrawer(); }); }}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fM">{i18next.t("Notifications")}</span>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item key="6" onClick={this.onClose}>
                                        <Link to="/chat">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fM">{i18next.t("Chats")}</span>
                                                {/* <span className="alertBadge"></span> */}

                                            </div>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="7" onClick={this.onClose}>
                                        <Link to="/contactus/help">
                                            <span className="fM">{i18next.t("Help")}</span>
                                        </Link>
                                    </Menu.Item>
                                </Menu>
                            </SimpleBar>

                            <div className="px-4 mb-3">

                                <Button onClick={this.AccountDelete} className="PrimaryBtn lg" block>{i18next.t("Delete Account")}</Button>
                                <p className="text-danger">{this.state.logout_err}</p>

                            </div>

                            <div className="px-4 mb-4">

                                <Button onClick={this.logout} className="PrimaryBtn lg" block>{i18next.t("Logout")}</Button>
                                <p className="text-danger">{this.state.logout_err}</p>

                            </div>
                        </div>

                    </div>

                    {/* Notification sidebar */}
                    <Drawer
                        closable={false}
                        maskStyle={{ opacity: 0.1, transition: "unset", animation: "none" }}
                        className="notificationRightBar"
                        onClose={this.onChildrenDrawerClose}
                        visible={this.state.childrenDrawer}
                    >
                        <div>

                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <button className="closeBtn mr-3" onClick={this.onChildrenDrawerClose}></button>
                                    <h5 className="mb-0">{i18next.t("Notifications")}</h5>
                                </div>
                                {/* <button className="delBtn"></button> */}
                            </div>
                            {
                                this.state.noti_loading === true ?
                                    <div className="rightSide col-sm-12  centerloader">
                                        <Loader
                                            type="ThreeDots"
                                            color="#0313FC"
                                            height={50}
                                            width={50}
                                        />
                                    </div>
                                    :
                                    <div style={{ height: '91vh', overflowX: 'hidden' }}>
                                        <div className="notificationFieldHolder">
                                            {
                                                this.state.notifications && this.state.notifications.length > 0 ?
                                                    <>
                                                        {this.state.notifications.map((i, k) => {
                                                            return (

                                                                <div className="cardOneStyle new p-3" >

                                                                    <div className="detailsSection mb-2">
                                                                        <div className="row" onClick={(e) => { if (i.log_type === 'booking') { this.get_to_booking_page(i.item_id); } }}>
                                                                            <div className="col-3 col-sm-4 align-self-center">
                                                                                <div className="d-flex justify-content-center">
                                                                                    <img className="profile-sm w-75 imgBg wid-sm-100" src={i.user_image} height={40} onError={this.service_image_err} alt="" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-9 col-sm-8 pl-0">
                                                                                <div className="details d-flex justify-content-between">
                                                                                    <div className="overflow-hidden">
                                                                                        <div className="detailOne text-truncate">{i.name}</div>
                                                                                        {
                                                                                            i.log_type === 'booking' &&
                                                                                            <>
                                                                                                <p className="mb-0 text-truncate lightTxtClr fM"> <span>{i.service_names.toString()}</span></p>

                                                                                                <p className="mb-0 lightTxtClr fM white-nowrap">ID: <span>{i.reference_id}</span></p>
                                                                                            </>
                                                                                        }

                                                                                    </div>
                                                                                    <div className="font-sm fM flex-0">{this.parseISOString(i.date)}</div>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                    <div className="detailThree">
                                                                        {i.description}
                                                                    </div>

                                                                </div>

                                                            )
                                                        })}

                                                        {
                                                            this.state.has_loadmore === true &&
                                                            <div className="m-3">
                                                                <button onClick={(e) => {
                                                                    e.stopPropagation(); this.setState({ noti_paginate: this.state.noti_paginate + 10 }, () => {
                                                                        this.get_notifications();
                                                                    });
                                                                }} type="button" className="loadMoreServices border-0 w-100">
                                                                    {i18next.t("Load more")}
                                                                </button>
                                                            </div>
                                                        }
                                                    </>
                                                    :

                                                    <div className="d-flex justify-content-center 
                                    align-items-center flex-column vh-75">
                                                        <img src={require("../../assets/images/placeholder_logos(2).png")} alt="" className="notfi_placelogo-cls " />
                                                        <div className="text-center font-xl  fM">
                                                            {i18next.t("Notification is Empty!")}
                                                        </div>
                                                    </div>
                                            }


                                        </div>
                                    </div>
                            }

                        </div>
                    </Drawer>

                    {/* Profile sidebar */}
                    <Drawer
                        closable={false}
                        maskStyle={{ opacity: 0.1, transition: "unset", animation: "none" }}
                        className="editSettingsRightBar"
                        onClose={this.onChildrenDrawerClose2}
                        visible={this.state.childrenDrawer2}
                    >

                        <div className="editProfile py-3 px-3 px-md-4">
                            <div className="headerContent d-flex align-items-center flex-0">
                                <button className="closeBtn mr-3" onClick={this.onChildrenDrawerClose2}></button>
                                <p className="mb-0 fM">{i18next.t("Edit Profile")}</p>
                            </div>
                            <div className="px-0 text-right change_pwd_div">
                                {this.state.access_to_change_password === true &&
                                    <Button className="PrimaryBtn lg mb-sm-0 fM" onClick={this.showChngPwdDrawer}>{i18next.t("Change Password")} </Button>
                                }

                            </div>
                        </div>
                        <EditProfileSettings access_change_password={this.hide_change_password_btn} userInfo={this.props.loginvalue} />

                    </Drawer>

                    {/* Change password sidebar */}
                    <Drawer
                        closable={false}
                        maskStyle={{ opacity: 0.1, transition: "unset", animation: "none" }}
                        className="editSettingsRightBar"
                        onClose={this.onChngPwdDrawerClose}
                        visible={this.state.ChngPwdDrawer}
                    >

                        <div className="editProfile py-3 px-3 px-md-4">
                            <div className="headerContent d-flex align-items-center flex-0 mb-0">
                                <button className="closeBtn mr-3" onClick={this.onChngPwdDrawerClose}></button>
                                <p className="mb-0 fM">{i18next.t("Change Password")}</p>
                            </div>
                            {/* <div className="col-sm-4 px-0 text-right">
                                <Button className="PrimaryBtn lg mb-sm-0 fM" onClick={this.showChildrenDrawer}>Back </Button>
                            </div> */}
                        </div>

                        <ChangePassword changePasswordClose={this.CloseChangePassword} userInfo={this.props.userInfo} />
                    </Drawer>

                    {/* Accound setting sidebar */}
                    <Drawer
                        closable={false}
                        maskStyle={{ opacity: 0.1, transition: "unset", animation: "none" }}
                        className="editSettingsRightBar"
                        onClose={this.onAcSettingClose}
                        visible={this.state.AcSettingDrawer} >

                        <div className="editProfile py-3 px-3 px-md-4">
                            <div className="headerContent d-flex align-items-center flex-0">
                                <button className="closeBtn mr-3" onClick={this.onAcSettingClose}></button>
                                <p className="mb-0 fM">{i18next.t("My Account")}</p>
                            </div>
                            <div className="px-0 text-right change_pwd_div">
                                <Button onClick={this.confirmDeactivate} className="PrimaryBtn lg mb-sm-0 fM" >{i18next.t("Deactive Account")} </Button>
                            </div>
                        </div>
                        <UserAccountSetting userInfo={this.props.userInfo} />
                    </Drawer>

                    {/* Deactivate sidebar */}
                    <Drawer
                        closable={false}
                        maskStyle={{ opacity: 0.1, transition: "unset", animation: "none" }}
                        className="editSettingsRightBar"
                        onClose={this.onDeactiveClose}
                        visible={this.state.showDeactiveDrawer} >

                        <div className="editProfile py-3 px-3 px-md-4">
                            <div className="headerContent d-flex align-items-center flex-0 mb-0">
                                <button className="closeBtn mr-3" onClick={this.onDeactiveClose}></button>
                                <p className="mb-0 fM">{i18next.t("Account Status")}</p>
                            </div>

                        </div>
                    </Drawer>

                </Drawer>

            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfileSideBar));