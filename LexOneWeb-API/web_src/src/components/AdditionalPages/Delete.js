import React, { Component } from 'react';
import Footer from '../Footer';

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="pt-5">

                        <div className="row px-3">
                            <div className="col-sm-4 col-md-3 col-lg-3 col-xl-2 pb-4 pb-lg-0 px-0">
                              
                            </div>
                            <div className="col-sm-8 col-md-9 col-lg-9 col-xl-10 pl-0 pl-sm-3 pl-lg-0 pr-0">
                                <h5 className="fM font-xxl">How to delete your account</h5>
                                <div className="mb-2">
                                    <p className="title fM mb-2">You can delete your account from within LexOne. Deleting your account is an irreversible process, which we can't revert even if you perform it by accident.
To delete your account:</p>
                                    <p>Open LexOne App.</p>
                                <p>Tap Profile icon &gt; Settings &gt; Delete account.</p>
                                <p>Are you sure you want to delete your account? Popup will appear, and tap Yes to confirm deletion.</p>
                                </div>
                                <div className="mb-2">
                                <p className="title fM mb-2">Deleting your account will:</p>
                                    <p className="content"> Delete your account from LexOne.</p>
                                    <p className="content"> Erase your message history.</p>
                                    <p className="content"> Delete you from all of your profile.</p>
                                    <p className="title fM mb-2">When you delete your account, your profile, jobs and task history will be permanently removed. If you'd just like to take a break, you can temporarily deactivate your account instead.</p>
                                    <p className="content"> For security reasons, we can't delete an account for you. You’ll need to be able to log into your account to request deletion. If you can't remember your password or username, see some tips for logging in.</p>
                                    <p className="title fM mb-2">When you delete your account, your profile, jobs and task history will be permanently removed. If you'd just like to take a break, you can temporarily deactivate your account instead.</p>
                                    <p className="content"> Before deleting your account, you may want to login and download a copy of your information from . After your account has been deleted, you will not have access to the LexOne Data Download tool.</p>                                                              
                                    <p>Thanks.</p>                              
                                </div>

                            </div>
                        </div>
                       
                    </div>
                </div>
                <Footer />
               
            </React.Fragment>
        );
    }
}

export default Help;