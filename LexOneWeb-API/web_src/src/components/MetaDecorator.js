import React, { Component } from 'react';
import {Helmet} from 'react-helmet';

class MetaDecorator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            general_info : {}
        }
    }
    UNSAFE_componentWillMount = () => {
        const general_info = JSON.parse(localStorage.getItem('general_info'));
        this.setState({ general_info : general_info });
    }
    render() {
        return (
            <Helmet>
                <title>{ this.state.general_info ? this.state.general_info.site_name : "Site Name" } { `${this.props.title}` }</title>
                <meta name="description" content={this.props.description}/>
            </Helmet>
        )
    }
}

export default MetaDecorator
