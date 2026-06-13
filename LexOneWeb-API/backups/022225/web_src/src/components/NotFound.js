import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import i18next from 'i18next';

class NotFound extends Component {
    
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="d-flex justify-content-center align-items-center flex-column">
                        <div className="emptydetail">
                            <img alt="" src={ require('../assets/images/404.png') } height="500px"/>
                            
                        </div>
                        <Link to="/">
                            <Button className="PrimaryBtn lg d-flex justify-content-center"> {i18next.t('Home')} </Button>
                        </Link>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default NotFound;