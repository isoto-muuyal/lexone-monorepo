import React from "react";
import { Drawer, Button, Menu, Rate } from 'antd';
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import TaskerEditProfileSettings from "../headerModules/editSettings/TaskereditProfileSettings";
import ChangePassword from "../headerModules/editSettings/ChangePassword";
import TaskerAccountSetting from "../headerModules/editSettings/TaskerAccountSetting";
import axios from "axios";
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import Loader from "react-loader-spinner";
import i18next from 'i18next';

const mapStateToProps = (props) => {
    return {
        loginvalue: props.isLogged
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

class TaskerSideBar extends React.Component {
    state = {
        visible: false,
        childrenDrawer: false,
        childrenDrawer2: false,
        ChngPwdDrawer: false,
        AcSettingDrawer: false,
        showDeactiveDrawer: false,
        logout_err: '',
        tasker_info: {},
        noti_paginate: 0,
        notifications: [],
        has_loadmore: true,
        review_has_loadmore: true,
        tasker_reviews: [],
        review_page: 0,
        noti_loading: true,
        show_review_drawer: false,
        review_loading: true
    };
    componentDidMount = () => {
        this.get_tasker_profile();
    }
    get_reviews_by_tasker_id = () => {
        var tasker_id = this.state.tasker_info && this.state.tasker_info.user_id;
        var review_page = this.state.review_page;
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/reviews/tasker/${tasker_id}/${review_page}/10`)
            .then(res => {
                console.log('result category');
                console.log(res);
                if (res.data.status_code === 200) {
                    var all_reviews = this.state.tasker_reviews;
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                    res.data.items.length > 0 &&
                        res.data.items.map((j, k) => { // eslint-disable-line
                            console.log('each')
                            console.log(j.date);
                            var alt_date = new Date(j.date);
                            var elapsed_date = '';
                            var month_name = monthNames[alt_date.getMonth()];
                            var year = alt_date.getFullYear();
                            var date = alt_date.getDate();
                            elapsed_date = date + '.' + month_name + '.' + year;

                            res.data.items[k].formatted_date = elapsed_date

                        })
                    all_reviews.push(res.data.items);
                    var result = all_reviews.flat();
                    this.setState({
                        tasker_reviews: result,
                        review_loading: false
                    })
                    if (res.data.items.length === 0 || res.data.items.length < 10) {
                        this.setState({
                            review_has_loadmore: false
                        })
                    }
                }
                else {
                    this.setState({
                        review_has_loadmore: false,
                        review_loading: false
                    })
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
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/signout`, params, config).then(res => {
            if (res.data.status_code === 200) {
                this.props.history.push('/tasker/tasker-login');
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.reload(false);
            }
            else {
                this.setState({ logout_err: res.data.message }, () => {
                    this.props.history.push('/tasker/tasker-login');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
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
                axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/deleteaccount`, params, config).then(res => {
                    console.log(res);
                    if (res.data.status_code === 200) {
                        Toast.fire({
                            icon: 'success',
                            title: i18next.t(res.data.message)
                        });
                        this.props.history.push('/tasker/tasker-login');
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
        })

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
    closeReviewDrawer = () => {
        this.setState({
            show_review_drawer: false
        })
    }
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
    get_notifications = () => {
        var user_info = JSON.parse(localStorage.getItem('user'));
        var per_page = 10;
        var noti_paginate = this.state.noti_paginate && this.state.noti_paginate;
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/notifications/${user_info.user_id}/${noti_paginate}/${per_page}`)
            .then(res => {
                console.log('notificaiton data');
                console.log(res.data);
                if (res.data.status_code === 200) {
                    if (res.data.items && res.data.items.length < 10) {
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
                axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/deactivateaccount`, params, config)
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
                                title: 'Something Went Wrong Try Again..'
                            });
                        }
                    })

            }
        })
    }

    get_tasker_profile = () => {
        var user_id = this.props.userInfo && this.props.userInfo.user_id;
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/user/taskerprofile/${user_id}`)
            .then(res => {
                if (res.data.status_code === 200) {
                    this.setState({ tasker_info: res.data });
                }
                else if (res.data.status_code === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    this.props.history.push('/');
                    window.location.reload(false);
                }
                else {
                    this.setState({ tasker_info: {} });
                }
            });
    }
    CloseChangePassword = () => {
        this.setState({
            ChngPwdDrawer: false
        })
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../assets/images/default_user_image_rectangle.png");
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
        this.props.history.push("/tasker/my-booking/detail", obj);
    }
    show_reviews = () => {
        this.setState({
            review_loading: true,
            show_review_drawer: true,
            review_page: 0,
            tasker_reviews: []
        }, () => {
            this.get_reviews_by_tasker_id();
        })
    }
    render() {
        return (
            <React.Fragment>
                <div className="align-self-center cursorPointer" onClick={this.showDrawer} width={55}>
                    <img className="profile-sm imgBg" src={this.props.loginvalue && this.props.loginvalue.user_image} onError={this.service_image_err} height={40} alt="" />
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
                                    <div className="text-truncate userNameHere">{this.props.loginvalue && this.props.loginvalue.name}</div>
                                    <p className="my-1 font-sm text-truncate">{this.props.loginvalue && this.props.loginvalue.location}</p>
                                    {
                                        this.state.tasker_info && this.state.tasker_info.rating > 0 &&
                                        <div onClick={this.show_reviews}>
                                            <Rate disabled allowHalf defaultValue={parseFloat(this.state.tasker_info.rating)} />
                                        </div>
                                    }

                                </div>
                                <div className="col-4 pr-0">
                                    <div className="userImageHere text-right" width={55}>
                                        <img className="profile-sm imgBg" src={this.props.loginvalue && this.props.loginvalue.user_image} onError={this.service_image_err} height={40} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="menuSide">
                            <div style={{ height: 'calc( 100vh - 210px)', overflowX: 'hidden' }}>
                                <Menu onClick={this.handleClick} mode="inline">
                                    <Menu.Item key="1">
                                        <span onClick={this.showChildrenDrawer2} className="fM">{i18next.t("Edit Profile")}</span>

                                    </Menu.Item>
                                    <Menu.Item key="8" onClick={this.onClose}>
                                        <Link to="/tasker/user-jobs">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fM">{i18next.t("User Jobs")}</span>
                                                {/* <span className="alertBadge"></span> */}
                                            </div>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="2" onClick={this.showAcSettingDrawer}>
                                        <span className="fM">{i18next.t("My Account")}</span>
                                    </Menu.Item>

                                    <Menu.Item key="3" onClick={this.onClose}>
                                        <Link to="/tasker/my-booking" >
                                            <span className="fM">{i18next.t("My Tasks")}</span>
                                        </Link>
                                    </Menu.Item>

                                    <Menu.Item key="4" onClick={this.onClose}>
                                        <Link to="/tasker/my-services">
                                            <span className="fM">{i18next.t("My Services")}</span>
                                        </Link>
                                    </Menu.Item>

                                    <Menu.Item key="5" onClick={this.onClose}>
                                        <Link to="/tasker/my-portfolio">
                                            <span className="fM">{i18next.t("My Portfolio")}</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="6" onClick={this.onClose}>
                                        <Link to="/tasker/my-verification">
                                            <span className="fM">{i18next.t("My Verification")}</span>
                                        </Link>
                                    </Menu.Item>

                                    <Menu.Item key="7" onClick={(e) => { this.setState({ notifications: [] }, () => { this.showChildrenDrawer(); }); }}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fM">{i18next.t("Notifications")}</span>
                                        </div>
                                    </Menu.Item>

                                    <Menu.Item key="8" onClick={this.onClose}>
                                        <Link to="/chat">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fM">{i18next.t("Chats")}</span>
                                                {/* <span className="alertBadge"></span> */}
                                            </div>
                                        </Link>
                                    </Menu.Item>

                                    <Menu.Item key="9" onClick={this.onClose}>
                                        <Link to="/contactus/help">
                                            <span className="fM">{i18next.t("Help")}</span>
                                        </Link>
                                    </Menu.Item>


                                </Menu>
                            </div>
                            <div className="logoutBtn px-4 mb-2">

                                <Button onClick={this.AccountDelete} className="PrimaryBtn lg" block>{i18next.t("Delete Account")}</Button>
                                <p className="text-danger">{this.state.logout_err}</p>

                            </div>
                            <div className="logoutBtn px-4 mb-4">
                                <p className="text-danger text-center">{this.state.logout_err}</p>
                                <Button onClick={this.logout} className="PrimaryBtn lg" block>{i18next.t("Logout")}</Button>

                            </div>
                        </div>

                    </div>

                    <Drawer
                        closable={false}
                        maskStyle={{ opacity: 0.1, transition: "unset", animation: "none" }}
                        className="notificationRightBar"
                        onClose={this.onChildrenDrawerClose}
                        visible={this.state.childrenDrawer}
                    >
                        <div>

                            <div className="py-3 px-3 border-bottom d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <button className="closeBtn mr-3" onClick={this.onChildrenDrawerClose}></button>
                                    <h5 className="mb-0">{i18next.t("Notifications")}</h5>
                                </div>
                                {/* <button className="delBtn"></button> */}
                            </div>
                            {
                                this.state.noti_loading === true ?
                                    <div className="rightSide col-sm-12 centerloader">
                                        <Loader
                                            type="ThreeDots"
                                            color="#10AB81"
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
                                                        {
                                                            this.state.notifications.map((i, k) => {
                                                                return (
                                                                    <div className="cardOneStyle new p-3">
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
                                <Button className="PrimaryBtn lg mb-sm-0 fM" onClick={this.showChngPwdDrawer}>{i18next.t("Change Password")} </Button>
                            </div>
                        </div>
                        {/* <EditProfileSettings /> */}
                        <TaskerEditProfileSettings userInfo={this.props.loginvalue && this.props.loginvalue} />

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
                                <p className="mb-0 fM">{i18next.t("My Account")} </p>
                            </div>
                            <div className="px-0 text-right change_pwd_div">
                                <Button className="PrimaryBtn lg mb-sm-0 fM" onClick={this.confirmDeactivate}>{i18next.t("Deactive Account")} </Button>
                            </div>
                        </div>
                        <TaskerAccountSetting close={this.onAcSettingClose} open={this.showAcSettingDrawer} userInfo={this.props.userInfo} />
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
                                <p className="mb-0 fM">{i18next.t("Account Status")}Account Status</p>
                            </div>

                        </div>
                    </Drawer>

                    {/* Reviews sidebar */}
                    <Drawer
                        closable={false}
                        maskStyle={{ opacity: 0.1, transition: "unset", animation: "none" }}
                        className="editSettingsRightBar"
                        onClose={this.closeReviewDrawer}
                        visible={this.state.show_review_drawer}
                    >

                        <div className="editProfile py-3 px-3 px-md-4">
                            <div className="headerContent d-flex align-items-center flex-0 mb-0">
                                <button className="closeBtn mr-3" onClick={this.closeReviewDrawer}></button>
                                <p className="mb-0 fM">{i18next.t("Reviews")}</p>
                            </div>
                        </div>
                        {
                            this.state.review_loading === true ?
                                <div className="rightSide col-sm-12 centerloader">
                                    <Loader
                                        type="ThreeDots"
                                        color="#10AB81"
                                        height={50}
                                        width={50}
                                    />
                                </div>
                                :

                                <React.Fragment>
                                    <SimpleBar style={{ height: '91vh', overflowX: 'hidden' }}>
                                        {

                                            this.state.tasker_reviews && this.state.tasker_reviews.length > 0 ?
                                                <>
                                                    {
                                                        this.state.tasker_reviews.map((j, k) => {
                                                            return (
                                                                <>
                                                                    <div className="row mb-3 p-3">
                                                                        <div className="d-flex col-lg-8 col-xl-9">
                                                                            <div className="pl-0 pr-3 mt-1">
                                                                                <img className="profile-sm imgBg" src={j.user_image} height={35} width={55} alt="" />
                                                                            </div>

                                                                            <div className="pr-2 mr-auto">
                                                                                <div className="details">
                                                                                    <div className="detailOne">{j.name}</div>
                                                                                    <div className="font-sm lightTxtClr"></div>
                                                                                    <div className="detailTwo d-flex">
                                                                                        <div className="singleStar align-self-center"><Rate disabled allowHalf defaultValue={parseFloat(j.rating)} /> </div>
                                                                                        <div className="d-flex align-items-center">
                                                                                            <span className="align-self-center m-t-5 mx-2 "> </span>
                                                                                            <span></span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="font-sm mt-1">{j.description}</div>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        <div className="col-lg-4 col-xl-3 pt-md-0 pt-2">
                                                                            <div className="font-sm text-right">{j.formatted_date}</div>
                                                                        </div>
                                                                    </div>

                                                                    <hr />
                                                                </>
                                                            )

                                                        })
                                                    }
                                                    {
                                                        this.state.review_has_loadmore === true &&
                                                        <div className="m-3">
                                                            <button onClick={(e) => {
                                                                e.stopPropagation(); this.setState({ review_page: this.state.review_page + 10 }, () => {
                                                                    this.get_reviews_by_tasker_id();
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
                                                        {i18next.t("Review is Empty!")}
                                                    </div>
                                                </div>

                                        }
                                    </SimpleBar>
                                </React.Fragment>
                        }
                    </Drawer>

                </Drawer>

            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(withRouter(TaskerSideBar));