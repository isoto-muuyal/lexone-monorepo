import React, { Component } from "react";
import { compose, withProps } from "recompose";
import { ArrowLeftOutlined } from '@ant-design/icons';
import DirectionRenderComponent from "./DirectionRenderComponent";
import { G_API_URL } from "../../utility/constants";
import { tasker_live_location } from '../../redux/actions';
import { connect } from 'react-redux';

const { withScriptjs, withGoogleMap, GoogleMap } = require("react-google-maps");
const exampleMapStyles = [
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        height: '400px',
        width: '400px'
      },
    ],
  }
];
const mapStateToProps = (props) => {
  return {
    tasker_current_location: props.TaskerLocation
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    tasker_live_location: (loc_data) => dispatch(tasker_live_location(loc_data))
  }
}
class Directions extends Component {
  state = {
    defaultZoom: 17,
    map: null,
    center: {}
  };
  UNSAFE_componentWillMount = () => {
    this.set_tracking_configuration();
  }
  set_tracking_configuration = () => {
    if (this.props.location.state !== undefined) {
      this.setState({
        booking_details: this.props.location.state
      })
    }
  }
  
  render() {
    return (
      <React.Fragment>

        <div className="backbtn">
          <div className="d-flex justify-content-between w-100">
            <div className=""><h5 class=" fB"> Map Tracker </h5> </div>


            <button className="d-flex  align-items-center m-r70 ant-btn"
              onClick={() => this.clear_interval_back()}>

              <ArrowLeftOutlined /><span className="mx-1 ">Back </span>

            </button>
          </div>
        </div>


        <div className="container">
          <div className="pt-5">
            <div className="row">
              <div className="col-6">
                <GoogleMap
                  options={{
                    styles: exampleMapStyles,
                  }}
                  defaultZoom={this.state.defaultZoom}
                  center={{
                    lat: this.props.tasker_current_location.lat === undefined ? 23.217724 : parseFloat(this.props.tasker_current_location.lat),
                    lng: this.props.tasker_current_location.lon === undefined ? 23.217724 : parseFloat(this.props.tasker_current_location.lon),
                  }}
                  defaultCenter={new window.google.maps.LatLng(23.21632, 72.641219)}
                >
                  {
                    this.state.booking_details &&
                    <DirectionRenderComponent
                      setClick={click => this.clear_interval_back = click}
                      key={0}
                      index={0 + 1}
                      booking_details={this.state.booking_details && this.state.booking_details}
                    />
                  }


                </GoogleMap>
              </div>
            </div>

          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  withProps({
    googleMapURL: G_API_URL,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div className="map_tracker" style={{ height: `600px`,margin: `50px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(Directions));
