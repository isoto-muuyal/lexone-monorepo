import React, { Component, Fragment } from 'react';
import axios from 'axios';
import i18next from 'i18next';
import {withRouter} from 'react-router-dom';

let suggestionsListComponent = "";
class MyAutoComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: "",
            suggestions : [],
            search_paginate : 1,
        };
        this.onChange = this.onChange.bind(this);
    }
    async onChange(e){
        var current_taget = e.currentTarget.value;
        console.log('new',e.currentTarget);
        this.setState({
            userInput: current_taget,
            suggestions : [],
            search_paginate : 1
        })
        if(current_taget.length > 2) {
            
            var search_key = current_taget;
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            const params = new URLSearchParams()
            params.append('search_key', search_key)
            params.append('page', this.state.search_paginate && this.state.search_paginate)
            await axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/searchcategories`, 
            params,config)
            .then(res => {
                if(res.data.status_code === 200){
                    this.setState({
                        suggestions : res.data.items,
                        activeSuggestion: 0,
                        filteredSuggestions : res.data.items,
                        showSuggestions: true,
                    })
                }
            })
        }
        
    };
    paginate_search_fn = () => {
        var search_key = this.state.userInput && this.state.userInput;
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        const params = new URLSearchParams()
        params.append('search_key', search_key)
        params.append('page', this.state.search_paginate && this.state.search_paginate)
        axios.post(`${process.env.REACT_APP_BASE_URL}/web/api/v1/searchcategories`, 
        params,config)
        .then(res => {
            if(res.data.status_code === 200){
                var suggestions = this.state.suggestions && this.state.suggestions;
                suggestions.push(res.data.items);
                var final_res = suggestions.flat();
                this.setState({
                    suggestions : final_res,
                    filteredSuggestions : final_res,
                })
            }
        })
    }
    onClick = (index,type,cat_id,subcat_id,service_id,cat_type) => {
        
        var service_name = document.getElementById('service_name'+index).textContent;
        var user_type = '';
        if(localStorage.getItem('user') !== null) {
            var user_info = JSON.parse(localStorage.getItem('user'));
            user_type = user_info.type;
        }
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: service_name
        },()=>{
            if(user_type === '' || user_type === 'user') {
                if(type === 'category') {
                    this.props.history.push('/user/sub-categories/'+cat_id);
                }
                else if(type === 'subcategory') {
                    if(cat_type === 'professional') {
                        this.props.history.push('/user/professional-view/'+cat_id+'/'+subcat_id);
                    }
                    else {
                        this.props.history.push('/user/marketplace-view/'+cat_id+'/'+subcat_id);
                    }
                }
                else if (type === 'service') {
                    if(cat_type === 'professional') {
                        this.props.history.push('/user/professional-view/'+cat_id+'/'+subcat_id);
                    }
                    else {
                        this.props.history.push('/user/marketplace-view/'+cat_id+'/'+subcat_id);
                    }
                }
            }
            
        });
    };

    onKeyDown = (e) => {
        const { activeSuggestion, filteredSuggestions } = this.state;

        if (e.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion]
            });
        }

        else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion - 1 });
        }

        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
    };
    paneDidMount = (node) => {   
        if(node) {      
            node.addEventListener("scroll", this.handleScroll.bind(this));      
        }
    }
    handleScroll = (e) =>{
        let element = e.target;
        const bottom = parseInt(element.scrollHeight - element.scrollTop) === parseInt(element.clientHeight);
        if (bottom) {      
            this.setState({
                search_paginate : this.state.search_paginate + 1
            },()=>{
                this.paginate_search_fn();
            }) 
        }  
    }
    remove_autocomplete = () => {
        var rm = this;
        setTimeout(
        function() {
            rm.setState({
                showSuggestions : false
            })
        }, 1500);
    }
    render() {
        if (this.state.showSuggestions && this.state.userInput && this.state.userInput.length > 2) {
            if (this.state.suggestions && this.state.suggestions.length) {
                suggestionsListComponent = (
                    <ul ref={this.paneDidMount} className="suggestions list-unstyled">
                        {this.state.suggestions.map((suggestion, index) => {
                            let className;
                            if (index === this.state.activeSuggestion) {
                                className = "suggestion-active";
                            }

                            return (
                                <li className={className} key={index} onClick={ (e)=>{ e.stopPropagation(); this.onClick(index,suggestion.type,suggestion.parent_category_id ? suggestion.parent_category_id : '',suggestion.subcategory_id ? suggestion.subcategory_id : '',suggestion.service_id ? suggestion.service_id : '',suggestion.parent_category_type); } }>
                                    <div className="d-flex mb-1 cursorPointer">
                                        <div className="mr-2"><img className="imgBg" src={suggestion.type === 'subcategory' ? suggestion.subcategory_image : suggestion.type === 'category' ? suggestion.parent_category_image : suggestion.type === 'service' && suggestion.service_image } alt="" /></div>
                                        <div>
                                           <div id={ "service_name"+index }>{ suggestion.type === 'subcategory' ? suggestion.subcategory_name : suggestion.type === 'category' ? suggestion.parent_category_name : suggestion.type === 'service' && suggestion.service_name }</div>
                                          <span className="font-sm" style={{color: '#9ca4ab'}}>{ suggestion.type === "service" ? suggestion.parent_category_name+' - '+suggestion.subcategory_name : suggestion.type === "subcategory" ? suggestion.parent_category_name : suggestion.type === "category" && "Category" }</span>
                                            </div>
                                    </div>
                                    
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div className="no-suggestions suggestions">
                        <em>{ i18next.t("No suggestions, you're on your own!") }</em>
                    </div>
                );
            }
        }
        else {
            suggestionsListComponent = '';
        }
        return (
            <Fragment>
                <input
                    type="search"
                    onChange={this.onChange}
                    onMouseDown = {this.onChange}
                    value={this.state.userInput}
                    placeholder={i18next.t('Search Services')}
                    onBlur = {this.remove_autocomplete}
                />
                <div>
                    {suggestionsListComponent}
                </div>
            </Fragment>
        );
    }
}

export default withRouter(MyAutoComplete);


