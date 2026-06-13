import React, { Component } from 'react';
import Swal from 'sweetalert2'; 
import axios from 'axios';
import Loader from "react-loader-spinner";

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

class UpdatePayoutInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_loading : true,
            call_once : false
        }
    }
    componentDidMount = () => {
        this.get_payout_by_id();
    }
   
    get_payout_by_id = () => {
        if(this.state.call_once === false) {
            if(localStorage.getItem('user') === null) {
                this.props.history.push('/tasker/tasker-login');
                window.location.reload(false);
            }
            else {
                var user_info = JSON.parse(localStorage.getItem('user'));
                var tasker_id = user_info.user_id;
                
                var token = new URLSearchParams(this.props.location.search).get("code");
                axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/stripestatus/${tasker_id}`)
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
                // axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/mapconnectaccount/${tasker_id}/${token}`)
                // .then (res=>{
                //     this.setState({
                //         call_once : true
                //     },()=>{
                //         if(res.data.status_code === 200) {
                //             Toast.fire({
                //                 icon: 'success',
                //                 title: 'Payout Information Updated Successfully!'
                //             });
                //             this.props.history.push('/tasker');
                //         }
                //         else {
                //             Toast.fire({
                //                 icon: 'warning',
                //                 title: 'Fail to update Payout Information!'
                //             });
                //             this.props.history.push('/tasker');
                //         }
                //     })
                // });
            }
            
        }
    }   

    render() {
        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                    <div>
                        <Loader
                            type="ThreeDots"
                            color="#10AB81"
                            height={100}
                            width={100}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UpdatePayoutInfo;