import React, { Component } from 'react';
import Footer from '../Footer';

class Contracts extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="pt-5">

                       Descarga los contratos aqui.
                       
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default Contracts;