import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Breadcremb extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            bredcrumb1 : '',
            bredcrumb2 : '',
            bredcrumb3 : ''
         }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.category_id !== this.props.category_id) {
            const cat_id = nextProps.category_id;
            const sub_cat_id = nextProps.sub_category_id;
            this.setState({
                category_id : cat_id,
                sub_category_id : sub_cat_id,
            },()=> {
                this.get_category_by_id();   
                this.get_subcategory_by_id();  
            })
        }
    }
    componentDidMount = () => {
        if(this.props.flag === 'category')
        {
            this.setState({
                category_id : this.props && this.props.category_id,
                sub_category_id : this.props && this.props.sub_category_id
            },()=>{
                this.get_category_by_id();   
                this.get_subcategory_by_id();  
            })
             
        }
        else if(this.props.flag === 'services') {
            this.setState({
                category_id : this.props && this.props.category_id
            },()=>{
                this.get_category_by_id();  
            })
        }
    }
    get_category_by_id = () => {
        
        var cat_id = this.state.category_id && this.state.category_id;
        if(cat_id !== '') {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams()
             params.append('category_id', cat_id)
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/category_by_id`,params,config)
            .then (res=>{
                console.log('bread_1');
                console.log(res.data)
                if(res.data.status_code === 200) {
                    this.setState({ 
                        category_info : res.data,
                        bredcrumb1 : res.data.category[0].parent_category_name,
                        category_type : res.data.category[0].parent_category_type,
                    })
                }
            });
        }
    }
    get_subcategory_by_id = () => {

        var sub_cat_id = this.state.sub_category_id && this.state.sub_category_id;
        if(sub_cat_id !== '') {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams()
             params.append('sub_category_id', sub_cat_id)
            axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/sub_category_by_id`,params,config)
            .then (res=>{
                console.log(res);
                if(res.data.status_code === 200) {
                    this.setState({ bredcrumb2 : res.data.category[0].subcategory_name })
                }
            });
        }
    }
    
    render() { 
        return ( 
            <div className="breadcrumbs">
            {
            this.props.flag && this.props.flag === 'category' && 
            <>    
                { this.state.bredcrumb1 !== '' && 
                <div className=""> <Link to={ `/user/sub-categories/${this.state.category_id && this.state.category_id}` }><p class="mb-0">{this.state.bredcrumb1} </p><span className="mx-3 slashIcon" /> </Link> </div>
                }
                { this.state.bredcrumb2 !== '' && 
                <div className=""> <Link to={ this.state.category_type && this.state.category_type === 'professional' ? `/user/professional-view/${this.state.category_id && this.state.category_id}/${this.state.sub_category_id && this.state.sub_category_id}` : `/user/marketplace-view/${this.state.category_id && this.state.category_id}/${this.state.sub_category_id && this.state.sub_category_id}` }><p class="mb-0">{this.state.bredcrumb2}</p><span className="mx-3 slashIcon" /></Link></div>
                }
                { this.state.bredcrumb3 !== '' && 
                <div className=""><Link to="#!"><p class="mb-0">{this.state.bredcrumb3}</p><span className="mx-3 slashIcon" /></Link></div>
                }
            </>
            }
            {
            this.props.flag && this.props.flag === 'services' && 
            <>   
                <div className=""> <Link to="/"><p class="mb-0">Home</p><span className="mx-3 slashIcon" /></Link></div>
                { this.state.bredcrumb1 !== '' && 
                <div className=""> <Link to="#!"><p class="mb-0">{this.state.bredcrumb1} </p><span className="mx-3 slashIcon" /> </Link> </div>
                }
            </>

            }
            {
            this.props.flag && this.props.flag === 'others' && 
            <>   
                    <div className=""> <Link to={ this.props.bredcrumb1_link && this.props.bredcrumb1_link }><p class="mb-0">{ this.props.bredcrumb1 && this.props.bredcrumb1 }</p><span className="mx-3 slashIcon" /></Link></div>
                { this.props.bredcrumb2 && this.props.bredcrumb2 !== '' && 
                    <div className=""> <Link to={ this.props.bredcrumb2_link && this.props.bredcrumb2_link }><p class="mb-0">{ this.props.bredcrumb2 && this.props.bredcrumb2 } </p><span className="mx-3 slashIcon" /> </Link> </div>
                }
                { this.props.bredcrumb3 && this.props.bredcrumb3 !== '' && 
                    <div className=""> <Link to={ this.props.bredcrumb3_link && this.props.bredcrumb3_link }><p class="mb-0">{ this.props.bredcrumb3 && this.props.bredcrumb3 } </p><span className="mx-3 slashIcon" /> </Link> </div>
                }
            </>

            }
            </div>
         );
    }
}
 
export default Breadcremb;