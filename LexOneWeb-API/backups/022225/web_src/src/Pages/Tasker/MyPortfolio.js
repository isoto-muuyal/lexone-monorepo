import React, { Component } from 'react';
import { Upload, Button } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from "react-loader-spinner";
import { ArrowLeftOutlined } from '@ant-design/icons';
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

const fileList = [


];

class MyPortfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            is_loading : false,
            call_upload : true,
            is_uploading: false
        }
    }
    componentDidMount = () => {
        this.get_existing_documents();
        this.setState({ general_info : JSON.parse(localStorage.getItem('general_info')) })
    }
    get_existing_documents = () => {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
        var user_info = JSON.parse(localStorage.getItem('user'));
        var user_id = user_info && user_info.user_id; 
        var type = "portfolio";
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
       
        const params = new URLSearchParams()
        params.append('user_id', user_id);
        params.append('type', type);
        
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/media`, 
        params,config)
            .then(res => {
                console.log('exist_docs');
                console.log(res);
                if(res.data.status_code === 200) 
                {
                    var ex_imgs = res.data.items;
                    var state_ar = this.state.fileList;
                    if(ex_imgs.length > 0) {
                        for (let index = 0; index < ex_imgs.length; index++) {
                            // img_li.uid = ex_imgs[index].item_id,
                            // img_li.name = ex_imgs[index].item_name,
                            // img_li.url = ex_imgs[index].item_url,
                            // img_li.status = 'done'
                            state_ar.push({ 
                                uid : ex_imgs[index].item_id,
                                name : ex_imgs[index].item_name,
                                url : ex_imgs[index].item_url,
                                status : 'done'
                            })
                        }
                        
                    }
                    this.setState({ 
                        fileList : state_ar
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

    get_image_file_contents = (info) => {
        var call_upload = this.state.call_upload;
        var rm = this;
        if(call_upload === true) {
            if(this.state.is_uploading === false) {
                if(info.file.status !== 'uploading') {
                    this.setState({
                        is_uploading : true
                    },()=>{
                        var exist_files = this.state.fileList && this.state.fileList;
                        var ex_file_count = exist_files.length + 1; 
                        var portfolio_limit = this.state.general_info && this.state.general_info.tasker_portfolio_limit;
                        if(parseInt(ex_file_count) > parseInt(portfolio_limit)) {
                            Toast.fire({
                                icon: 'warning',
                                title: i18next.t('Upload limit exceeded!')
                            });
                        }
                        else {
                            this.setState({
                                is_loading : true
                            })

                            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
                            if (validImageTypes.includes(info.file.originFileObj.type)) {
                                if(info.file.originFileObj.size <= 2001000) {
                                    var user_info = JSON.parse(localStorage.getItem('user'));
                                    var user_id = user_info && user_info.user_id; 
                                    const formData = new FormData();
                                    formData.append("image", info.file.originFileObj);
                                    formData.append("user_id", user_id);
                                    formData.append("name", info.file.name);
                                    formData.append("type", 'portfolio');
                                    axios({
                                        method: "post",
                                        url: `${process.env.REACT_APP_MEDIA_URL}/api/v1/tasker/mediaupload`,
                                        data: formData,
                                        headers: { "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s" },
                                    })
                                    .then (res => {
                                        console.log(res);
                                        if(res.data.status_code === 200) {
                                            var state_ar = this.state.fileList;
                                            state_ar.push({ 
                                                uid : res.data.media_id,
                                                name : res.data.name,
                                                url : res.data.image,
                                                status : 'done'
                                            })
                                            this.setState({ 
                                                fileList : state_ar,
                                                is_loading : false,
                                            })
                                            Toast.fire({
                                                icon: 'success',
                                                title: i18next.t('Uploaded successfully')
                                            });
                                        } 
                                        else if(res.data.status_code === 401 || res.data.status_code === 400) {
                                            localStorage.removeItem('access_token');
                                            localStorage.removeItem('user');
                                            this.props.history.push('/');
                                            window.location.reload(false);
                                        }
                                        else {
                                            this.setState({
                                                is_loading : false,
                                            })
                                            Toast.fire({
                                                icon: 'warnig',
                                                title: i18next.t('Fail to Upload!')
                                            });
                                            
                                        }
                                    })
                                    .catch(error => {
                                        this.setState({
                                            is_loading : false,
                                        })
                                        console.log(error);
                                    })
                                }
                                else {
                                    this.setState({
                                        is_loading : false,
                                    })
                                    Toast.fire({
                                        icon: 'warning',
                                        title: i18next.t('Upload file size should be less than 2MB!')
                                    });
                                }
                            }
                            else {
                                this.setState({
                                    is_loading : false,
                                })
                                Toast.fire({
                                    icon: 'warning',
                                    title: i18next.t('Upload only Images!')
                                });
                            }
                            
                        }
                        setTimeout(function(){
                            rm.setState({
                                is_uploading : false
                            })
                        }, 1000);
                    })
                }
            }
        }
        
    }
    next_page = () =>{
        Toast.fire({
            icon: 'success',
            title: i18next.t("Sign up Completed Successfuly, Kindly update Payment Information Later!")
        });
        this.props.history.push('/tasker');
    }
    remove_image_document = (info) => {
        this.setState({
            call_upload : false
        }, () => { 
            var user_info = JSON.parse(localStorage.getItem('user'));
            var user_id = user_info && user_info.user_id; 
            Swal.fire({
                title: i18next.t('Are you sure?'),
                text: i18next.t("You want to Remove this Image!"),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.isConfirmed) {
                    
                    const config = {
                        headers : {
                            'Content-type' : 'application/x-www-form-urlencoded'
                        }
                    }
                    const params = new URLSearchParams();
                    params.append('media_id',info.uid);
                    params.append('user_id',user_id);
                    axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/deletemedia`,params,config)
                    .then(res => {
                        console.log(res);
                        if(res.data.status_code === 200)
                        {
                            var state_arr = this.state.fileList;
                            if(state_arr.length > 0) {
                                for (let i = 0; i < state_arr.length; i++) {
                                    var obj = state_arr[i];
                                    if ( obj.uid === info.uid) {
                                        state_arr.splice(i, 1);
                                    }
                                }
                                this.setState({ 
                                    fileList:state_arr
                                })
                            }
                            Swal.fire(
                                i18next.t('Removed!'),
                                i18next.t('Deleted successfully'),
                                'success'
                            )
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
                    this.setState({ call_upload : true })
                }
                else {
                    this.setState({ call_upload : true })
                }
            })
            
        });
        
    }
    get_back = () => {
        var obj = this.props.location.state;
        this.props.history.push('/tasker/my-verification', obj);
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="pt-5">
                        
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h4 className="fM mb-2">{i18next.t("Portfolio")}</h4>
                                </div>
                                {
                                this.props.location.state !== undefined &&
                                <div className="d-flex align-items-center hover-cont" onClick={ ()=>{ this.get_back(); }  }> 
                                    <ArrowLeftOutlined  />
                                    &nbsp;
                                    <span>{i18next.t('Back')} </span>
                                </div>
                                }
                            </div>
                        

                        {/* <label class="w-100">
                            <input type="file" />
                            <div class="uploadFieldStructure"><p className="mb-0">Drag a File here or <span>Browse</span> for a Image Upload</p></div>
                        </label> */}

                        <Upload
                            accept="image/png,image/gif,image/jpeg"
                            listType="picture-card"
                            defaultFileList={[...fileList]}
                            fileList = { this.state.fileList }
                            onChange = { this.get_image_file_contents }
                            onRemove = { this.remove_image_document }
                            className = { this.state.is_loading === true && "op-30" }
                        >
                            <div class="uploadFieldStructure"><p className="mb-0">{ i18next.t("Drag a File here or") } <span>{ i18next.t("Browse") }</span> { i18next.t("for a Image Upload") }</p></div>
                            {
                                this.state.is_loading === true &&
                                    <div>
                                        <Loader
                                            type="ThreeDots"
                                            color="#10AB81"
                                            height={50}
                                            width={50}
                                        />
                                    </div>
                                
                            }
                        </Upload>  

                        {/* <Link to="/Tasker/MyPortfolio">
                            <div class="col-12 col-sm-4 col-md-3 col-lg-2 px-0">
                                <Button className="PrimaryBtn lg" block> Save</Button>
                            </div>
                        </Link> */}

                        {
                            this.props.location.state !== undefined &&
                            <Button onClick={this.next_page} className="PrimaryBtn lg fM mt-4" type="" block>{ i18next.t("Next") }</Button>
                        }
                        
                       
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default MyPortfolio;