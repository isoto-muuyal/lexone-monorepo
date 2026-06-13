import React, { Component } from 'react';
import { Button, Select, Checkbox, Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import Breadcremb from '../../../components/BreadCremb';
import MetaDecorator from '../../../components/MetaDecorator';  
import Loader from "react-loader-spinner";
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


const { Option } = Select;

class AddServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: [],
            categories : [],
            sub_categories : [],
            selectChild : [],
            childVal : [],
            chosen_cat : 'Select your Category',
            chosen_subcat : 'Select your Sub Category',
            service_lists : [],
            is_loading : false,
            fetch_response : true,
            is_disabled : false,
        }
        this.get_subcategories = this.get_subcategories.bind(this);
        this.get_services = this.get_services.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDeSelect = this.handleDeSelect.bind(this);
    }
    componentDidMount = () => {
        this.get_categories();
    }
    UNSAFE_componentWillMount = () => {
        var from_new = this.props.location.state;
        if(from_new !== undefined) {
            if(Object.keys(this.props.location.state).length > 1) {
                if(Object.keys(this.props.location.state.services).length > 1) {
                    this.setState({
                        is_loading : true
                    })
                }
            }
        }
        if(localStorage.getItem('user') === null) {
            this.props.history.push("/tasker/tasker-login");
        }
        else if(localStorage.getItem('user') !== null) {
            var userinfo = JSON.parse(localStorage.getItem('user'));
            if(userinfo.type !== 'tasker') {
                this.props.history.push("/");
            }
        }
    }
    async handleChange(value){
        let temp = [...this.state.selectChild];

        var ex_ser_index = temp.findIndex(x => x === value);
        console.log('exists',ex_ser_index);
        if(ex_ser_index === -1) {
            temp.push(value);
            temp = [...new Set(temp)];
            const service_id = value;

            var services_from_list = this.state.childVal && this.state.childVal; 
            var current_service_index = services_from_list.findIndex(x => x.service_id === service_id);

            var service_info = services_from_list[current_service_index];

            var service_lists = this.state.service_lists;
            service_lists.push(service_info);
        }
        this.setState({ selectChild : temp })
        console.log(temp)
        console.log(`Selected: ${value}`);

    };

    handleDeSelect = (value)=>{
        console.log(typeof value);
        let temp = [...this.state.selectChild];
        var unique = temp.filter(item => item !== value);
        //temp = [...new Set(unique)];
        // setSelectedChild(unique);
        var service_lists = this.state.service_lists;
        for (let index = 0; index < service_lists.length; index++) {
            const service = service_lists[index];
            if(service.service_id === value) {
                service_lists.splice(index, 1);
            }
        }
        this.setState({ selectChild : unique },()=>{
            this.setState({
                service_lists : service_lists
            })
        });
        console.log(`DeSelected: ${value}`);
    };
    get_categories = () => {
        var from_new = this.props.location.state;
        if(from_new !== undefined) {
            if(Object.keys(this.props.location.state).length > 1) {
                if(Object.keys(this.props.location.state.services).length > 1) {
                    this.setState({
                        chosen_cat : this.props.location.state.services.chosen_cat,
                        chosen_subcat : this.props.location.state.services.chosen_subcat,
                    },()=>{
                        this.get_subcategories(this.props.location.state.services.chosen_cat);
                    })
                }
            }
        }
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        var user_info = JSON.parse(localStorage.getItem('user'));
        this.setState({ general_info : general_info, user_info : user_info })
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/categories`)
        .then(res => {
            if(res.data.status_code === 200) {
                this.setState({ 
                    categories : res.data.category,
                });
            }
            else {
                console.log(res.data.message);
            }
        })
    }
    get_subcategories = (value) => {
        this.setState({ chosen_cat : value, selectChild : [], service_lists : [], sub_categories : [], ex_services : [], childVal : [],chosen_subcat : 'Select your Sub Category', fetch_response : true },()=>{
            const config = {
                headers : {
                    'Content-type' : 'application/x-www-form-urlencoded'
                }
            }
                var cat_id = value;
                if(cat_id !== '') {
                    const params = new URLSearchParams()
                    params.append('category_id', cat_id)
                    axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/category_by_id`,params,config)
                    .then (res=>{
                        if(res.data.status_code === 200) {
                            this.setState({ 
                                category_type : res.data.category[0].parent_category_type,
                            
                            })
                        }
                    });
                }
            
            
            const params1 = new URLSearchParams();
            params1.append('parent_category_id' , value);
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/subcategories`,params1,config)
            .then(res => {
                // console.log('result is here');
                // console.log(res);
                if(res.data.status_code === 200) {
                    this.setState({ 
                        sub_categories : res.data.subcategory
                    },()=>{
                    var from_new = this.props.location.state;
                    if(from_new !== undefined) {
                        if(Object.keys(this.props.location.state).length > 1) {
                            if(Object.keys(this.props.location.state.services).length > 1) {
                                if(this.props.location.state.services.chosen_cat === value) {
                                    this.get_services(this.props.location.state.services.chosen_subcat);
                                }
                            }
                        }
                    }
                    });
                }
                else {
                    console.log(res.data.message);
                }
            })
        })
        
    }
    get_services = (value) => {
        this.setState({ ex_services : [], service_lists : [], childVal : [], selectChild : [],fetch_response : true },()=>{
            const config = {
                headers : {
                    'Content-type' : 'application/x-www-form-urlencoded'
                }
            }
            var sub_categories = this.state.sub_categories && this.state.sub_categories; 
            var current_subcat_index = sub_categories.findIndex(x => x.subcategory_id === value);
            this.setState({
                sub_category_name : sub_categories[current_subcat_index].subcategory_name
            });
            const params = new URLSearchParams();
            params.append('parent_category_id' , this.state.chosen_cat);
            params.append('subcategory_id' , value);
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/services`,params,config)
            .then(res => {
                console.log('result is here');
                console.log(res);
                if(res.data.status_code === 200) {
                    this.setState({ childVal : res.data.services, chosen_subcat : value },()=>{
                        this.get_tasker_services();
                    });
                }
                else {
                    console.log(res.data.message);
                }
            })
        })
        
    }
    get_tasker_services = () => {
        var cat_id  = this.state.chosen_cat && this.state.chosen_cat; 
        var sub_cat_id  = this.state.chosen_subcat && this.state.chosen_subcat; 
        if(cat_id !== '' && sub_cat_id !== '') {
            const config = {
                headers : {
                    'Content-type' : 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams();
            params.append('parent_category_id' , cat_id);
            params.append('user_id' , this.state.user_info && this.state.user_info.user_id);
            params.append('subcategory_id' , sub_cat_id);
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/services`,params,config)
            .then(res => {
                if(res.data.status_code === 200) {
                    this.setState({ ex_services : res.data.services },()=>{
                        var selectChild = this.state.selectChild && this.state.selectChild;
                        var service_lists = this.state.service_lists && this.state.service_lists;
                        for (let index = 0; index < res.data.services.length; index++) {
                            const element = res.data.services[index];
                            if(element.is_new === "false") {
                                var service_obj = {};
                                service_obj.service_id = element.service_id;
                                service_obj.service_name = element.service_name;
                                service_obj.service_price = element.service_price;
                                service_obj.service_pricing = element.service_pricing;

                                selectChild.push(element.service_id);
                                service_lists.push(service_obj);
                            }
                            
                        }
                        this.setState({
                            selectChild : selectChild,
                            service_lists : service_lists,
                            sub_category_name : res.data.services && res.data.services.length > 0 && res.data.services[0].subcategory_name,
                            is_loading : false,
                            fetch_response : false
                        })
                    });
                }
                else if(res.data.status_code === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    this.props.history.push('/');
                    window.location.reload(false);
                }
            })
        }
    }
    set_price_by_service = (k,price) => {
        var selected_services = this.state.service_lists;
        var rgx = /^[0-9]*\.?[0-9]*$/;
        var split_price = price.split('.');
        if (rgx.test(price) === true) {
            if( (split_price[0] && split_price[0].length !== undefined && split_price[0].length <= 6) ) {
                if(!split_price[1]) {
                    selected_services[k].service_price = price;
                    this.setState({ service_lists : selected_services })
                }
                else {
                    if( (split_price[1] && split_price[1].length !== undefined && split_price[1].length <= 2) ) {
                        selected_services[k].service_price = price;
                        this.setState({ service_lists : selected_services })
                    }
                }
                
            }
        }
        if(price.length === 0) {
            selected_services[k].service_price = price;
            this.setState({service_lists: selected_services})
        }
    }
    save_services = () => {
        this.setState({
            is_disabled : true,
        })
        var service_list = this.state.service_lists;
        var minimum_payment_price = this.state.general_info && this.state.general_info.minimum_payment_price;
        var service_list_arr = [];
        var err = 0;
        var err1 = 0;
        var err2 = 0;
        var err3 = 0;
        for (let index = 0; index < service_list.length; index++) {
            const service = service_list[index];
            var service_info = {};
            service_info.service_id = service.service_id;
            service_info.service_price = service.service_price;
            var before_decimal = 6;
            var after_decimal = 2;
            if(service_info.service_price && service_info.service_price.trim() !== '') {
                var price = service_info.service_price && service_info.service_price;
                var split_price = price.split('.');
            }
            
            if(service_info.service_price.trim() === '') {
                err++;
            }
            else if(parseFloat(price) < parseFloat(minimum_payment_price)) {
                err3++;
            } 
            else if (split_price[0] && split_price[0].length > before_decimal) {
                err1++;
            }
            else if (split_price[1] && split_price[1].length > after_decimal) {
                err1++;
            }
            else if(service_info.service_price.trim() === '0') {
                err2++;
            }
            service_list_arr.push(service_info);
        }
        if(err !== 0) {
            Toast.fire({
                icon: 'warning',
                title: i18next.t('Price Missing!')
            });
            this.setState({
                is_disabled : false,
            })
        }
        else if(err1 !== 0) {
            Toast.fire({
                icon: 'warning',
                title: i18next.t('Valid format is (123456.12)')
            });
            this.setState({
                is_disabled : false,
            })
        }
        else if(err2 !== 0) {
            Toast.fire({
                icon: 'warning',
                title: i18next.t('Price should not be zero')
            });
            this.setState({
                is_disabled : false,
            })
        }
        else if(err3 !== 0) {
            var min_err = this.state.general_info && this.state.general_info.currency_symbol+' '+this.state.general_info.minimum_payment_price+' '+i18next.t("is Minimum Value of service");
            Toast.fire({
                icon: 'warning',
                title: min_err
            });
            this.setState({
                is_disabled : false,
            })
        }
        else {
            const config = {
                headers : {
                    'Content-type' : 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams();
            params.append('parent_category_id' , this.state.chosen_cat);
            params.append('subcategory_id' , this.state.chosen_subcat);
            params.append('user_id' , this.state.user_info.user_id);
            params.append('services' , JSON.stringify(service_list_arr));
            params.append('type' , 'add');
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/addservice`,params,config)
            .then(res => {
                console.log('result is here');
                console.log(res);
                if(res.data.status_code === 200) {
                    Toast.fire({
                        icon: 'success',
                        title: res.data.message
                    });
                    var from_new = this.props.location.state;
                    if(from_new === undefined) {
                        this.props.history.push('/tasker/my-services');
                    }
                    else {
                        var progress_obj = {};
                        progress_obj.is_new = 1;
                        progress_obj.services = { chosen_cat : this.state.chosen_cat, chosen_subcat : this.state.chosen_subcat }
                        this.props.history.push('/tasker/update-bio', progress_obj);
                    }
                    
                }
                else {
                    Toast.fire({
                        icon: 'warning',
                        title: res.data.message
                    });
                    this.setState({
                        is_disabled : false,
                    })
                }
            })
        }
        
    }
    render() {
        return (
            <React.Fragment>
                <div className={ this.state.is_loading === true ?  "loadercls"  : "" }>
                <MetaDecorator title=' | Add Service Categories and Lists' description="This is the site is like JD" />
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
                        <div className="pt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Breadcremb flag="others" bredcrumb1_link="/tasker" bredcrumb1="Home" bredcrumb2_link="/tasker/my-services" bredcrumb2="My Service" />
                                
                            </div>
                            <h4 class="title fM mb-4">Select your Services</h4>
                            <div className="row">
                                <div className="col-lg-6">
                                    <p class="mb-3 fM">Select Category</p>
                                    <Select className="mb-3 w-100" defaultValue="Select your Category" value={this.state.chosen_cat} onChange={this.get_subcategories}>
                                        {
                                            this.state.categories.length > 0 &&
                                            this.state.categories.map((i,k) => {
                                                return (
                                                <Option key={k} value={i.parent_category_id}>{i.parent_category_name}</Option>
                                                )
                                            })
                                        }
                                        
                                    </Select>

                                    <p class="mb-3 fM">Sub Category</p>
                                    <Select className="mb-3 w-100" value={this.state.chosen_subcat} onChange={this.get_services}>
                                        {
                                            this.state.sub_categories.length > 0 &&
                                            this.state.sub_categories.map((i,k) => {
                                                return (
                                                    <Option key={k} value={i.subcategory_id}>{i.subcategory_name}</Option>
                                                )
                                            })
                                        }
                                        
                                    </Select>

                                    <p class="mb-3 fM">Child Category</p>
                                    <Select
                                        mode="multiple"
                                        removeMode={[]}
                                        placeholder="Select your Child category"
                                        value={this.state.selectChild}
                                        defaultValue={ this.state.selectChild && this.state.selectChild }
                                        onSelect={this.handleChange}
                                        style={{ width: "100%" }}
                                        onDeselect={this.handleDeSelect}
                                        disabled={this.state.fetch_response}
                                    >
                                        {this.state.childVal.map((child, i) => (
                                            <Option key={child.service_id}>
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="d-flex">
                                                        <Checkbox checked={this.state.selectChild.includes(child.service_id)} />
                                                        <span className="mx-2"> {child.service_name}</span>{" "}
                                                    </div>
                                                    {
                                                        this.state.category_type &&
                                                        this.state.category_type !== 'marketplace' &&
                                                        <span className="fM primaryClr">$ {child.service_price}/{child.service_pricing}</span>
                                                    }
                                                    
                                                </div>
                                            </Option>
                                        ))}
                                    </Select>

                                </div>
                                <div className="col-lg-6 mt-4 mt-lg-0">
                                    {
                                        this.state.selectChild && this.state.selectChild.length > 0 &&
                                        <>
                                        <section className="paymentBox">
                                            <h5 className="title"> { this.state.sub_category_name && this.state.sub_category_name }</h5>
                                            <div className="content">
                                                {
                                                    this.state.service_lists &&
                                                    this.state.service_lists.map((i,k) => (
                                                        
                                                            <div key={k}>
                                                                <p className="mb-1">{ this.state.service_lists[k] && this.state.service_lists[k].service_name  }</p>
                                                                {
                                                                    this.state.category_type === 'professional' ?
                                                                <Input size="large" addonBefore={<div className="">{this.state.general_info && this.state.general_info.currency_symbol }</div>} addonAfter={<div className="">{this.state.service_lists[k] && this.state.service_lists[k].service_pricing  }</div>}placeholder="Enter price" value={this.state.service_lists[k] && this.state.service_lists[k].service_price} 
                                                                onChange={(e)=>{ e.stopPropagation(); this.set_price_by_service(k,e.target.value); }} required readOnly />
                                                                :
                                                                <Input inputMode="decimal" size="large" addonBefore={<div className="">{this.state.general_info && this.state.general_info.currency_symbol }</div>} addonAfter={<div className="">{this.state.service_lists[k] && this.state.service_lists[k].service_pricing  }</div>}placeholder={ i18next.t("Minimum price is")+" "+this.state.general_info.currency_symbol+" "+this.state.general_info.minimum_payment_price } value={this.state.service_lists[k] && this.state.service_lists[k].service_price} 
                                                                onChange={(e)=>{ e.stopPropagation(); this.set_price_by_service(k,e.target.value); }} required  />
                                                                }
                                                                
                                                                <hr />
                                                            </div>
                                                        
                                                        
                                                    ))
                                                }
                                                
                                            
                                            </div>
                                        </section>
                                            <Button disabled={this.state.is_disabled} onClick={this.save_services} className="PrimaryBtn lg fM mt-4" type="" block>{ this.state.is_disabled === true ? <LoadingOutlined /> : this.props.location.state === undefined ? i18next.t("Save") : i18next.t("Next") }</Button>
                                        </>
                                    }
                                    
                                    
                                </div>
                            </div>

                        </div>
                    </div>
                }
                </div>
            </React.Fragment >
        );
    }
}

export default AddServices;