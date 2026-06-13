import React, { Component } from 'react';
import i18next from 'i18next';
import { Upload, Button } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from "react-loader-spinner";
import { ArrowLeftOutlined } from '@ant-design/icons';

const style = { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
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

class MyVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            is_loading: false,
            call_upload: true,
            is_uploading: false
        }
    }
    componentDidMount = () => {
        this.get_existing_documents();
        this.setState({ general_info: JSON.parse(localStorage.getItem('general_info')) })
    }
    get_existing_documents = () => {
        var user_info = JSON.parse(localStorage.getItem('user'));
        var user_id = user_info && user_info.user_id;
        var type = "document";
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const params = new URLSearchParams()
        params.append('user_id', user_id);
        params.append('type', type);

        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/media`,
            params, config)
            .then(res => {
                if (res.data.status_code === 200) {
                    var ex_imgs = res.data.items;
                    var state_ar = this.state.fileList;
                    if (ex_imgs.length > 0) {
                        for (let index = 0; index < ex_imgs.length; index++) {
                            state_ar.push({
                                uid: ex_imgs[index].item_id,
                                name: ex_imgs[index].item_name,
                                url: ex_imgs[index].item_url,
                                status: 'done'
                            })
                        }

                    }
                    this.setState({
                        fileList: state_ar
                    })
                }
                else if (res.data.status_code === 401) {
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
        if (call_upload === true) {
            if(this.state.is_uploading === false) {
                if(info.file.status !== 'uploading') {
                    console.log('hi2');
                    this.setState({
                        is_uploading : true
                    },()=> {
                        console.log('hi3');
                        var exist_files = this.state.fileList && this.state.fileList;
                        var ex_file_count = exist_files.length + 1;
                        var verification_limit = this.state.general_info && this.state.general_info.tasker_documents_limit;
                        if (parseInt(ex_file_count) > parseInt(verification_limit)) {
                            Toast.fire({
                                icon: 'warning',
                                title: i18next.t('Upload limit exceeded!')
                            });
                        }
                        else {
                            this.setState({ is_loading: true });
                            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'application/pdf'];

                            if (validImageTypes.includes(info.file.originFileObj.type)) {
                                if (info.file.originFileObj.size <= 2001000) {
                                    var user_info = JSON.parse(localStorage.getItem('user'));
                                    var user_id = user_info && user_info.user_id;
                                    const formData = new FormData();
                                    formData.append("image", info.file.originFileObj);
                                    formData.append("user_id", user_id);
                                    formData.append("name", info.file.name);
                                    formData.append("type", 'document');

                                    axios({
                                        method: "post",
                                        url: `${process.env.REACT_APP_MEDIA_URL}/api/v1/tasker/mediaupload`,
                                        data: formData,
                                        headers: { "Content-Type": "multipart/form-data" },
                                    })
                                        .then(res => {
                                            console.log(res);
                                            axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
                                            if (res.data.status_code === 200) {
                                                var state_ar = this.state.fileList;
                                                state_ar.push({
                                                    uid: res.data.media_id,
                                                    name: res.data.name,
                                                    url: res.data.image,
                                                    status: 'done'
                                                })
                                                this.setState({
                                                    fileList: state_ar,
                                                    is_loading: false,
                                                })
                                                Toast.fire({
                                                    icon: 'success',
                                                    title: i18next.t('Uploaded successfully')
                                                });
                                            }
                                            else if (res.data.status_code === 401 || res.data.status_code === 400) {
                                                localStorage.removeItem('access_token');
                                                localStorage.removeItem('user');
                                                this.props.history.push('/');
                                                window.location.reload(false);
                                            }
                                            else {
                                                this.setState({
                                                    is_loading: false,
                                                })
                                                Toast.fire({
                                                    icon: 'warning',
                                                    title: i18next.t('Fail to Upload!')
                                                });
                                            }

                                        })
                                        .catch(error => {
                                            this.setState({
                                                is_loading: false,
                                            })
                                            Toast.fire({
                                                icon: 'warning',
                                                title: i18next.t('Fail to Upload!')
                                            });
                                        })
                                }
                                else {
                                    this.setState({
                                        is_loading: false,
                                    })
                                    Toast.fire({
                                        icon: 'warning',
                                        title: i18next.t('Upload file size should be less than 2MB!')
                                    });
                                }
                            }
                            else {
                                this.setState({
                                    is_loading: false,
                                })
                                Toast.fire({
                                    icon: 'warning',
                                    title: i18next.t('Upload only Images or PDF!')
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
    next_page = () => {
        var obj = this.props.location.state;
        this.props.history.push('/tasker/my-portfolio', obj);
    }
    remove_image_document = info => {
        this.setState({
            call_upload: false
        }, () => {
            console.log(info)
            var user_info = JSON.parse(localStorage.getItem('user'));
            var user_id = user_info && user_info.user_id;
            Swal.fire({
                title: i18next.t('Are you sure?'),
                text: i18next.t("You want to Remove this File!"),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.isConfirmed) {

                    const config = {
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        }
                    }
                    const params = new URLSearchParams();
                    params.append('media_id', info.uid);
                    params.append('user_id', user_id);
                    axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/deletemedia`, params, config)
                        .then(res => {
                            console.log(res);
                            if (res.data.status_code === 200) {
                                var state_arr = this.state.fileList;
                                if (state_arr.length > 0) {
                                    for (let i = 0; i < state_arr.length; i++) {
                                        var obj = state_arr[i];
                                        if (obj.uid === info.uid) {
                                            state_arr.splice(i, 1);
                                        }
                                    }
                                    this.setState({
                                        fileList: state_arr
                                    })
                                }
                                Swal.fire(
                                    'Removed!',
                                    i18next.t('Deleted successfully'),
                                    'success'
                                )
                            }
                            else if (res.data.status_code === 401) {
                                localStorage.removeItem('access_token');
                                localStorage.removeItem('user');
                                this.props.history.push('/');
                                window.location.reload(false);
                            }
                            else {
                                Toast.fire({
                                    icon: 'warning',
                                    title: i18next.t("Something Went Wrong, Try Again"),
                                });
                            }
                        })
                    this.setState({ call_upload: true })
                } else {
                    this.setState({ call_upload: true })
                }
            })
        })

    }
    get_back = () => {
        var obj = this.props.location.state;
        this.props.history.push('/tasker/update-bio', obj);
    }
    render() {
        return (
            <React.Fragment>

                <div className="container">
                    <div className="pt-5">

                        
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h4 className="fM mb-3">{i18next.t("Identity Proof")}</h4>
                                </div>
                                {
                                    this.props.location.state !== undefined &&
                                    <div className="d-flex align-items-center hover-cont" onClick={() => { this.get_back(); }}>
                                        <ArrowLeftOutlined />
                                        &nbsp;
                                        <span>{i18next.t("Back")} </span>
                                    </div>
                                }
                            </div>
                        
                        <div className="img-uploads">
                            <Upload
                                accept="application/pdf,application/vnd.ms-excel,image/png,image/gif,image/jpeg"
                                listType="picture"
                                defaultFileList={[...fileList]}
                                fileList={this.state.fileList}
                                onRemove={this.remove_image_document}
                                onChange={this.get_image_file_contents}
                                className={this.state.is_loading === true && "op-30"}
                            >
                                <div class="uploadFieldStructure"><p className="mb-0">{i18next.t("Drag a File here or")} <span>{i18next.t("Browse")}</span> {i18next.t("for a Image Upload")}</p></div>
                            </Upload>

                            {
                                this.state.is_loading === true &&
                                <div style={style}>
                                    <Loader
                                        type="ThreeDots"
                                        color="#10AB81"
                                        height={50}
                                        width={50}
                                    />
                                </div>

                            }
                        </div>

                        <section className="mt-5">
                            <div className="border rounded p-4" >
                                <div dangerouslySetInnerHTML={{ __html: this.state.general_info && this.state.general_info.tasker_verification_guide }}>
                                </div>


                            </div>
                        </section>
                        {
                            this.props.location.state !== undefined &&
                            <Button onClick={this.next_page} className="PrimaryBtn lg fM mt-4" type="" block>{i18next.t("Next")}</Button>
                        }

                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export default MyVerification;