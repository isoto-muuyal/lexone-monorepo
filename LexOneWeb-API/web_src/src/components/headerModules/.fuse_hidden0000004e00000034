import React from 'react';
import { Drawer, Menu } from 'antd';
import SimpleBar from 'simplebar-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import i18next from 'i18next';

const { SubMenu } = Menu;

const SomeIcon = () => {
    return (
        <img src={require("../../assets/icons/close.png")} alt="" height="15px" width="15px"  style={{ objectFit: "contain"}}/>
    )
}

class TopCategories extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            visible: false,
            category_tree_is_setted : false,
            categories : {},
            sub_categories : {},
            services : {},
            category_info : []
        }
    }
    componentDidMount = () => {
        // this.get_categories();
        this.get_category_tree();
    }
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
            OpenKeys : []
        });
    }

    get_category_tree = () => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/categories_service_tree`)
        .then(res => {
            console.log(res.data);
            if(res.data.status_code === 200)
            {
                this.setState({ category_info : res.data.category_tree });
                var rootSubmenuKeys_arr = [];
                // eslint-disable-next-line
                res.data.category_tree.map((i)=>{
                    rootSubmenuKeys_arr.push(i.parent_category_id);
                })
                this.setState({
                    rootSubmenuKeys : rootSubmenuKeys_arr
                })
            }
        });
    }
    onOpenChange = keys => {
        const latestOpenKey = keys.find(key => this.state.OpenKeys && this.state.OpenKeys.indexOf(key) === -1);
        if (this.state.rootSubmenuKeys && this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        //   setOpenKeys(keys);
          this.setState({
            OpenKeys : keys
          })
        } else {
          this.setState({
            OpenKeys : latestOpenKey ? [latestOpenKey] : []
          })
        }
    };
    render() {
        console.log('get_category_tree data');
        console.log(typeof this.state.category_info);
        console.log(typeof this.state.category_info === 'object' && this.state.category_info);
        var rm = this;
        return (
            <React.Fragment>
                <Drawer
                    title={i18next.t('Categories')}
                    placement="left"
                    bodyStyle={{ padding: 0 }}
                    className="categorySidebar"
                    closable={true}
                    maskStyle={{ opacity: 0.7, transition: "unset", animation: "none" }}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    closeIcon={<SomeIcon />}
                >
                    <SimpleBar style={{ height: '91vh' }}>
                        <Menu openKeys={this.state.OpenKeys && this.state.OpenKeys} onOpenChange={this.onOpenChange} onClick={this.onClose} mode="inline">
                            {
                                this.state.category_info &&
                                Object.keys(this.state.category_info).map(function(i) {
                                    return (
                                    <SubMenu key={rm.state.category_info[i].parent_category_id} title={<span>{ rm.state.category_info[i].parent_category_name }</span>} >
                                        {
                                            rm.state.category_info[i].subcategories &&
                                            Object.keys(rm.state.category_info[i].subcategories).map((k)=> (
                                            // rm.state.category_info[i].sub_categories.map((k)=> (
                                                <SubMenu key={rm.state.category_info[i].subcategories[k].subcategory_id} title={<span>{rm.state.category_info[i].subcategories[k].subcategory_name}</span>} >
                                                    {
                                                        rm.state.category_info[i].subcategories[k].services &&
                                                        Object.keys(rm.state.category_info[i].subcategories[k].services).map((j)=> (
                                                            
                                                            <Menu.Item key={rm.state.category_info[i].subcategories[k].services[j].service_id}>
                                                                <Link to={ rm.state.category_info[i].parent_category_type === "professional" ? "/user/professional-view/"+rm.state.category_info[i].parent_category_id+"/"+rm.state.category_info[i].subcategories[k].subcategory_id : "/user/marketplace-view/"+rm.state.category_info[i].parent_category_id+"/"+rm.state.category_info[i].subcategories[k].subcategory_id}></Link>
                                                                { rm.state.category_info[i].subcategories[k].services[j].service_name }
                                                            </Menu.Item>
                                                        ))
                                                    }
                                                    
                                                </SubMenu>
                                            ))
                                        }
                                        
                                        
                                    </SubMenu>
                                )
                                })
                                
                            }
                            

                            

                        </Menu>
                    </SimpleBar>
                </Drawer>

                <div className={"align-self-center ml-md-4 " + (this.props.hideOnResponsive ? " d-none d-md-flex " : "")
                } >
                    <div onClick={this.showDrawer}>
                        <div className="d-flex align-items-center">
                            <span className="align-self-center cursorPointer ">{i18next.t('Categories')}</span>
                            <span className="downIcon ml-2" >{this.onClose}</span>
                        </div>
                    </div>
                </div>
                {/* <div className={"align-self-center ml-md-4 " + (this.props.showOnResponsive ? "d-flex" : "d-md-none")
                } >

                    <div onClick={this.showDrawer}>
                        <div className="d-flex align-items-center">
                            <span className="align-self-center cursorPointer ">New</span>
                            <span className="downIcon ml-2" >{this.onClose}</span>
                        </div>
                    </div>
                </div> */}

            </React.Fragment >
        )
    }
}

export default TopCategories;
