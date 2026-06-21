import React, {Component} from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Home from './Pages/Home';
import UserLogin from './Pages/User/UserLogin';
import UserSignup from './Pages/User/UserSignup';
import ScrollRestoration from './components/ScrollRestoration';
import TaskerView from './Pages/User/Booking/Market/TakerView';
import Booking from './Pages/User/Booking/Booking';
import Chat from './components/ChatModules/Chat';
import ContactUs from './components/AdditionalPages/ContactUs';
import Help from './components/AdditionalPages/Help';
import Delete from './components/AdditionalPages/Delete';
import PrivacyPolicy from './components/AdditionalPages/PrivacyPolicy';
import TermsCondition from './components/AdditionalPages/TermsaAndCondition';
import TaskerTermsCondition from './components/AdditionalPages/TaskerTermsCondition';
import UserMyBooking from './Pages/User/Booking/UserMyBooking';
import MyBookingDetail from './Pages/User/Booking/MyBookingDetail';
import MyBookingTracker from "./components/Directions/DirectionsIndex";
import PostTask from './Pages/User/PostTask';
import EditNeed from './Pages/User/EditNeed';
import TaskerLogin from './Pages/Tasker/TaskerLogin';
import TaskerSignup from './Pages/Tasker/TaskerSignup';
import UpdateBio from './Pages/Tasker/UpdateBio';
import UserJobs from './Pages/Tasker/UserJobs';
import TaskerHome from './Pages/Tasker/TaskerHome/TaskerHome';
import MyServices from './Pages/Tasker/MyServices/MyServices';
import MyServiceDetail from './Pages/Tasker/MyServices/MyServiceDetail';
import MyVerification from './Pages/Tasker/MyVerification';
import MyNeeds from './Pages/User/Needs/MyNeeds';
import BrowseTaskDetail from './Pages/Tasker/BrowseTask/BrowseTaskDetail';
import TaskerMyBooking from './Pages/Tasker/MyBooking/TaskerMyBooking';
import TaskerBookingConfirm from './Pages/Tasker/MyBooking/TaskerBookingConfirm';
import ClientList from './Pages/Tasker/Clients/ClientList';
import ClientDetail from './Pages/Tasker/Clients/ClientDetail';
import CaseList from './Pages/Tasker/Cases/CaseList';
import CaseDetail from './Pages/Tasker/Cases/CaseDetail';
import CalendarPage from './Pages/Tasker/Calendar/CalendarPage';
import MyServiceView from './Pages/Tasker/MyServices/MyServiceView';
import MyPortfolio from './Pages/Tasker/MyPortfolio';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import NotFound from './components/NotFound';
import AddServices from './Pages/Tasker/MyServices/AddServices';
import ProHowItWork from './Pages/User/ServiceProInnerPages/ProHowItWork';
import MarketPlace from './Pages/User/ServiceProInnerPages/MarketPlace';
import SubCategoryLists from './Pages/User/ServiceProInnerPages/SubCategoryLists';
import Header from './components/Header';
import Footer from './components/Footer';
import axios from 'axios';
import {loggedin} from './redux/actions';
import {connect} from 'react-redux';
import firebase from './components/firebase';
import UpdatePaymentStatus from './Pages/User/Booking/UpdatePaymentStatus';
import UpdatePayoutInfo from './Pages/Tasker/UpdatePayoutInfo';
import Contracts from './components/AdditionalPages/Contracts';
import FindLawyers from './Pages/User/FindLawyers';
const mapStateToProps=(props)=> {
  return {
      loginvalue : props.isLogged
  }
}

const mapDispatchToProps=(dispatch)=> {
  return {
      loggedin : (userdata)=>dispatch(loggedin(userdata))
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_info : localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : null,
    }
    this.get_appdefault = this.get_appdefault.bind(this)
  }
  UNSAFE_componentWillMount = () => {
    window.scrollTo(0, 0);
    this.get_appdefault();
    setTimeout(() => {
      this.update_device_token()
    }, 3000);
    if(localStorage.getItem('user') !== null) {
      this.setState({ user_info : JSON.parse(localStorage.getItem('user')) });
    }
  }
  update_device_token = () => {
    if(localStorage.getItem('device_token') === null) {
      const messaging = firebase.messaging()
      
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("./firebase-messaging-sw.js")
          .then(function(registration) {
            messaging.useServiceWorker(registration);
            messaging.requestPermission().then(()=>{
              return messaging.getToken()
            }).then(token => {
                localStorage.setItem('device_token',token);
            }).catch((error)=>{
                console.log(error)
            })
          })
          .catch(function(err) {
            console.log('registration_err',err);
            console.log("Service worker registration failed, error:", err);
          });
      }
    }
  }
  async get_appdefault(){ 
    if(localStorage.getItem('general_info') !== null) {
      // localStorage.removeItem('general_info');
    }
    await axios.get(`${process.env.REACT_APP_BASE_URL}/web/api/v1/appdefaults`)
    .then(res => {
        if(res.data.status_code === 200)
        {
          var link = document.querySelector("link[rel~='icon']");
          if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.getElementsByTagName('head')[0].appendChild(link);
          }
          link.href = res.data.site_favicon;
          localStorage.setItem('general_info', JSON.stringify(res.data));
          this.setState({ general_info : res.data });
        }
        else {
            this.setState({ general_info : {} });
        }
    });
  }
  render() {
    return (
      <div className="App">
          <BrowserRouter history={createBrowserHistory} basename="/web">
            <Header user={this.state.user_info && this.state.user_info} />
            <ScrollRestoration />
            <div className="center_pos">
              <div>
                <Switch>
                  {/* these routes working with out login */}
                  <Route exact path="/" component={(props) => this.state.user_info === null ? (<Home {...props}/>) : this.state.user_info && this.state.user_info.type === 'user' ? (<Home {...props}/>) : this.state.user_info.type === 'tasker' && <Redirect to="/tasker"/> } />                  
                  <Route exact path="/user/sub-categories/:cat_id" component={(props) => this.state.user_info === null ? (<SubCategoryLists {...props}/>) : this.state.user_info && this.state.user_info.type === 'user' ? (<SubCategoryLists {...props}/>) : this.state.user_info.type === 'tasker' && <Redirect to="/tasker"/> } /> 
                  <Route exact path="/user/user-login" component={(props) => this.state.user_info === null ? (<UserLogin {...props}/>) : this.state.user_info.type === 'tasker' ? <Redirect to="/tasker"/> : <Redirect to="/"/>} />
                  <Route exact path="/user/user-signup" component={(props) => this.state.user_info === null ? (<UserSignup {...props}/>) : <Redirect to="/"/>} />
                  <Route exact path="/forgotPassword/:role_flag" component={ForgotPassword} />
                  <Route exact path="/reset-password/:user_id/:token" component={ResetPassword} />
                  <Route exact path="/tasker/tasker-login" component={(props) => this.state.user_info === null ?  (<TaskerLogin {...props}/>) : this.state.user_info.type === 'tasker' ? <Redirect to="/tasker"/> : <Redirect to="/"/>} />
                  <Route exact path="/tasker/tasker-signup" component={(props) => this.state.user_info === null ? (<TaskerSignup {...props}/>) : <Redirect to="/tasker"/>} />
                  <Route exact path="/user/professional-view/:cat_id/:sub_cat_id" component={(props) => this.state.user_info === null ? (<ProHowItWork {...props}/>) : this.state.user_info && this.state.user_info.type === 'user' ? (<ProHowItWork {...props}/>) : this.state.user_info.type === 'tasker' && <Redirect to="/tasker"/>} />       
                  <Route exact path="/user/marketplace-view/:cat_id/:sub_cat_id" component={(props) => this.state.user_info === null ? (<MarketPlace {...props}/>) : this.state.user_info && this.state.user_info.type === 'user' ? (<MarketPlace {...props}/>) : this.state.user_info.type === 'tasker' && <Redirect to="/tasker"/>} />
                  {/* these routes working with out login */}
                  <Route exact path="/delete" component={() => (<Delete user_info={this.state.user_info ? this.state.user_info : {} } />)} />
                  <Route exact path="/help" component={() => (<Help user_info={this.state.user_info ? this.state.user_info : {} } />)} />
                  <Route exact path="/contactus/:helps_flag" component={() => (<ContactUs user_info = {this.state.user_info ? this.state.user_info : {}} />) } />
                  <Route exact path="/contracts" component={() => (<Contracts user_info = {this.state.user_info ? this.state.user_info : {}} />) } />
                  <Route exact path="/find-lawyers" component={(props) => (<FindLawyers {...props} user_info={this.state.user_info ? this.state.user_info : {}} />) } />
                  <Route exact path="/privacy-policy" component={() => (<PrivacyPolicy pri_pol_name = { this.state.user_info && this.state.user_info.type === 'tasker' ? this.state.help_info && this.state.help_info.items[1].name : this.state.help_info && this.state.help_info.items[0].name } pri_pol_description = { this.state.user_info && this.state.user_info.type === 'tasker' ? this.state.help_info && this.state.help_info.items[0].description : this.state.help_info && this.state.help_info.items[1].description } />) }  />
                  <Route exact path="/terms-condition" component={() => (<TermsCondition tandc_name = { this.state.user_info && this.state.user_info.type === 'tasker' ? this.state.help_info && this.state.help_info.items[0].name : this.state.help_info && this.state.help_info.items[1].name } tandc_description = { this.state.user_info && this.state.user_info.type === 'tasker' ? this.state.help_info && this.state.help_info.items[0].description : this.state.help_info && this.state.help_info.items[1].description } />)} />
                  <Route exact path="/tasker-terms-condition" component={() => (<TaskerTermsCondition />)} />
                  {/* these routes working with user login only */}
                  <Route exact path="/user/tasker-view/:tasker_id" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'user' ? (<TaskerView {...props}/>) : (<Redirect to="/user/user-login"/>)} />
                  <Route exact path="/user/booking" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'user' ? (<Booking {...props}/>) : (<Redirect to="/user/user-login"/>)} />
                  <Route exact path="/user/updatepaymentstatus/:payment_type/:booking_id/:session_id" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'user' ? (<UpdatePaymentStatus {...props}/>) : (<Redirect to="/user/user-login"/>)} />
                  {/* <Route exact path="/user/updatepaymentstatus/:payment_type/:booking_id/:session_id" component={UpdatePaymentStatus} /> */}
                  <Route exact path="/user/my-booking" component={ (props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'user' ? (<UserMyBooking {...props}/>) : (<Redirect to="/user/user-login"/>) } />
                  <Route exact path="/user/my-booking/detail" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'user' ? (<MyBookingDetail {...props}/>) : (<Redirect to="/user/user-login"/>)} />
                  <Route exact path="/user/my-booking/tracker" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'user' ? (<MyBookingTracker {...props}/>) : (<Redirect to="/user/user-login"/>)} />
                  <Route exact path="/user/post-task" component={PostTask} />
                  <Route exact path="/user/my-needs" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'user' ? (<MyNeeds {...props}/>) : (<Redirect to="/user/user-login"/>)} />
                  <Route exact path="/user/edit-need" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'user' ? (<EditNeed {...props}/>) : (<Redirect to="/user/user-login"/>)} />        
                  <Route exact path="/chat" component={(props) => this.state.user_info && this.state.user_info.type !== undefined ? (<Chat {...props}/>) : (<Redirect to="/user/user-login"/>)} />
                  {/* these routes working with user login only */}
                  {/* these routes working with tasker login only */} 
                  <Route exact path="/tasker" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'tasker' ? (<TaskerHome {...props} user_info = {this.state.user_info ? this.state.user_info : {}} general_info = {this.state.general_info ? this.state.general_info : {}} />) : (<Redirect to="/tasker/tasker-login"/>) } />
                  <Route exact path="/browse-task/detail" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'tasker' ? (<BrowseTaskDetail {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />                  
                  <Route exact path="/tasker/my-services" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'tasker' ? (<MyServices {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />
                  <Route exact path="/tasker/my-service-detail/:cat_id" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'tasker' ? (<MyServiceDetail {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />
                  <Route exact path="/tasker/my-verification" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'tasker' ? (<MyVerification {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />
                  <Route exact path="/tasker/my-booking" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'tasker' ? (<TaskerMyBooking {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />
                  <Route exact path="/tasker/my-booking/detail" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'tasker' ? (<TaskerBookingConfirm {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />
                  <Route exact path="/tasker/my-service/view" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'tasker' ? (<MyServiceView {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />
                  <Route exact path="/tasker/clients" component={(props) => this.state.user_info && this.state.user_info.type === 'tasker' ? (<ClientList {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />
                  <Route exact path="/tasker/clients/:client_id" component={(props) => this.state.user_info && this.state.user_info.type === 'tasker' ? (<ClientDetail {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />
                  <Route exact path="/tasker/cases" component={(props) => this.state.user_info && this.state.user_info.type === 'tasker' ? (<CaseList {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />
                  <Route exact path="/tasker/cases/:case_id" component={(props) => this.state.user_info && this.state.user_info.type === 'tasker' ? (<CaseDetail {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />
                  <Route exact path="/tasker/calendar" component={(props) => this.state.user_info && this.state.user_info.type === 'tasker' ? (<CalendarPage {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />
                  <Route exact path="/tasker/my-portfolio" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'tasker' ? (<MyPortfolio {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />
                  {/* <Route exact path="/tasker/add-services" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'tasker' ? (<AddServices {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} /> */}
                  <Route exact path="/tasker/add-services" component={AddServices} />
                  <Route exact path="/tasker/user-jobs" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'tasker' ? (<UserJobs {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />                 
                  <Route exact path="/tasker/update-bio" component={(props) => this.state.user_info && this.state.user_info.type !== undefined && this.state.user_info.type === 'tasker' ? (<UpdateBio {...props} />) : (<Redirect to="/tasker/tasker-login"/>)} />         
                  <Route exact path="/tasker/update-payout" component={UpdatePayoutInfo} />
                  {/* these routes working with tasker login only */}
                  <Route component={NotFound} />
                </Switch>
              </div>
              <Footer general_info={this.state.general_info} />
              
            </div>
          </BrowserRouter>
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App)