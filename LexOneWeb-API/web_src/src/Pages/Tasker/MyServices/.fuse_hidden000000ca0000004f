import React, { Component } from 'react';
import Breadcrumb from '../../../components/BreadCremb';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
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

// const { Option } = Select;
class MyServiceView extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount = () => {

        var state = this.props.location.state;
        this.setState({ service_state : state },()=>{
            this.get_category();
        });
    }
    get_category = () => {
        var cat_id = this.state.service_state.parent_category_id;
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        var user_info = JSON.parse(localStorage.getItem('user'));
        this.setState({ general_info : general_info, user_info : user_info })
        const config = {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams()
        params.append('category_id', cat_id)
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/category_by_id`,params,config)
        .then (res=>{
            if(res.data.status_code === 200) {
                this.setState({ 
                    category_type : res.data.category[0].parent_category_type,
                    category_name : res.data.category[0].parent_category_name
                })
            }
        });
    }
    save_service = () => {
        var err=0;
        var before_decimal = 6;
        var after_decimal = 2;
        if(this.state.service_state && this.state.service_state.service_price.trim() !== '') 
        {
            var price = this.state.service_state && this.state.service_state.service_price;
            var split_price = price.split('.');
        }

        if(this.state.service_state && this.state.service_state.service_price.trim() === ''){
            Toast.fire({
                icon: 'warning',
                title: i18next.t('Price Missing!')
            });
            err++;
        }
        else if(this.state.service_state && this.state.service_state.service_price === '0') {
            Toast.fire({
                icon: 'warning',
                title: i18next.t('Price should not be zero!')
            });
            err++;
        }
        else if (split_price[0] && split_price[0].length > before_decimal) {
            Toast.fire({
                icon: 'warning',
                title: i18next.t('Valid format is (123456.12)')
            });
            err++;
        }
        else if (split_price[1] && split_price[1].length > after_decimal) {
            Toast.fire({
                icon: 'warning',
                title: i18next.t('Valid format is (123456.12)')
            });
            err++;
        }
        if(err === 0) {
            var service_arr = [];
            service_arr.push({ 
                service_id : this.state.service_state.service_id,
                service_price : this.state.service_state.service_price
            })
            const config = {
                headers : {
                    'Content-type' : 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams();
            params.append('parent_category_id' , this.state.service_state.parent_category_id);
            params.append('subcategory_id' , this.state.service_state.subcategory_id);
            params.append('user_id' , this.state.user_info.user_id);
            params.append('services' , JSON.stringify(service_arr));
            params.append('type' , 'edit');
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/addservice`,params,config)
            .then(res => {
                console.log('result is here');
                console.log(res);
                if(res.data.status_code === 200) {
                    Toast.fire({
                        icon: 'success',
                        title: res.data.message
                    });
                    this.props.history.push('/tasker/my-services');
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
        
    }
    delete_service = () => {
        Swal.fire({
            title: i18next.t('Are you sure?'),
            text: i18next.t("You want to Remove this Service!"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                var user_id = this.state.user_info.user_id;
                const config = {
                    headers : {
                        'Content-type' : 'application/x-www-form-urlencoded'
                    }
                }
                const params = new URLSearchParams();
                params.append('user_id',user_id);
                params.append('parent_category_id',this.state.service_state.parent_category_id);
                params.append('subcategory_id',this.state.service_state.subcategory_id);
                params.append('service_id',this.state.service_state.service_id);
                axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/deleteservice`,params,config)
                .then(res => {
                    console.log(res);
                    if(res.data.status_code === 200)
                    {
                        Swal.fire(
                            'Removed!',
                            res.data.message,
                            'success'
                        )
                        this.props.history.push('/tasker/my-services');
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
                            title: 'Something Went Wrong Try Again..'
                        });
                    }
                })
                
            }
        })
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="pt-5">
                        <Breadcrumb />
                        <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 px-0">
                            <h4 className="title fM mb-4">{ this.state.service_state && this.state.service_state.service_name}</h4>

                            <Form.Item label="Main Category" className="mb-4 fM">
                                <Input className="lightTxtClr" size="large" value={this.state.category_name} readOnly />
                            </Form.Item>
                            <Form.Item label="Sub Category" className="mb-4 fM">
                                <Input className="lightTxtClr" size="large" value={ this.state.service_state && this.state.service_state.subcategory_name} readOnly />
                            </Form.Item>
                            <Form.Item label="Service" className="mb-4 fM">
                                <Input className="lightTxtClr" size="large" value={ this.state.service_state && this.state.service_state.service_name} readOnly />
                            </Form.Item>
                            <section className="mb-5 priceInput">
                                <p class="mb-3 fM">{ i18next.t('Price') }</p>
                                {/* <Input placeholder="Enter Price" size="large" addonAfter={<Select defaultValue="INR" >
                                    <Option value="inr">INR</Option>
                                    <Option value="usd">USD</Option>
                                </Select>} /> */}
                                {
                                    this.state.category_type &&
                                    this.state.category_type === 'professional' ?
                                    <Input className="lightTxtClr" size="large" placeholder={ i18next.t("Enter Price") } value={ this.state.service_state && this.state.service_state.service_price} readOnly />
                                    :
                                    <Input inputMode="decimal" size="large" placeholder={ i18next.t("Enter Price") } onChange={ (e)=> { var state = {...this.state.service_state}; var rgx = /^[0-9]*\.?[0-9]*$/; var split_price = e.target.value.split('.'); if (rgx.test(e.target.value) === true) { 
                                        if( (split_price[0] && split_price[0].length !== undefined && split_price[0].length <= 6) ) {
                                        if(!split_price[1]) {
                                            state.service_price = e.target.value; this.setState({ service_state : state })
                                        }
                                        else {
                                            if( (split_price[1] && split_price[1].length !== undefined && split_price[1].length <= 2) ) {
                                                state.service_price = e.target.value; this.setState({ service_state : state })
                                            }
                                        }
                                        
                                    } } 
                                    if(e.target.value.length === 0) {
                                        state.service_price = e.target.value;
                                        this.setState({service_state: state})
                                    } } } value={ this.state.service_state && this.state.service_state.service_price } />
                                }
                                
                                <span className="dolorSign">{this.state.general_info && this.state.general_info.currency_symbol}</span>
                            </section>

                            <div className="row mt-4">
                                <div className="col-6 col-lg-4 pr-0">
                                <Button type="submit" className="w-100" onClick={this.delete_service}>
                                        <Button size="large" className="SecoundaryBtn lg fM  " block>{ i18next.t("Delete") }</Button>
                                  </Button>
                                </div>
                                {
                                    this.state.category_type &&
                                    this.state.category_type !== 'professional' ?
                                    <div className="col-6 col-lg-4  align-self-center">
                                        <Button size="large" onClick={this.save_service} className="Btns PrimaryBtn lg fM " block>{ i18next.t("Save") }</Button> 
                                    </div>
                                    :
                                    <div className="col-6 col-lg-4  align-self-center">
                                        <Button size="large" onClick={this.props.history.goBack} className="Btns PrimaryBtn lg fM " block>{ i18next.t("Back") }</Button> 
                                    </div>
                                }
                                
                            </div>
                        </div>
                      
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(MyServiceView);