import React, { Component } from "react";
import { withRouter } from "react-router";
import { convertLatLngToObj } from "../../utility/helper";
import socketIOClient from 'socket.io-client';
import {tasker_live_location} from '../../redux/actions';
import {connect} from 'react-redux';

const { Marker, DirectionsRenderer } = require("react-google-maps");

const socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);

const mapStateToProps=(props)=> {
  return {
      tasker_current_location : props.TaskerLocation
  }
}

const mapDispatchToProps=(dispatch)=> {
  return {
    tasker_live_location : (loc_data)=>dispatch(tasker_live_location(loc_data))
  }
}
class DirectionRenderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: null,
      wayPoints: null,
      currentLocation: null,
      booking_details : {},
      rotate : 50,
    };
    this.get_to_back = this.get_to_back.bind(this);
    let count = 0;
    socket.on('receiveMessage', (data)=>{
      this.props.tasker_live_location(data);
      if(data.lon !== undefined && data.lat !== undefined) {
        const currentLocation = convertLatLngToObj(
          parseFloat(data.lat),
          parseFloat(data.lon)
        );
        if(count === 0) {
          this.setState({ currentLocation },()=> {
              var locations = [];
              const directionService = new window.google.maps.DirectionsService();
              if(this.props.booking_details && this.props.booking_details.location_type === 'transport') {
                locations = [
                  [this.state.currentLocation && this.state.currentLocation.lat, this.state.currentLocation && this.state.currentLocation.lng],
                  [this.state.booking_details && parseFloat(this.state.booking_details.source_lat), this.state.booking_details && parseFloat(this.state.booking_details.source_lon)],
                  [this.state.booking_details && parseFloat(this.state.booking_details.dest_lat), this.state.booking_details && parseFloat(this.state.booking_details.dest_lon)]
                ];
              }
              else if(this.props.booking_details && this.props.booking_details.location_type === 'home'){
                locations = [
                  [this.state.currentLocation && this.state.currentLocation.lat, this.state.currentLocation && this.state.currentLocation.lng],
                  [this.state.booking_details && parseFloat(this.state.booking_details.source_lat), this.state.booking_details && parseFloat(this.state.booking_details.source_lon)],
                ];
              }
              var request = {
                travelMode: window.google.maps.TravelMode.DRIVING
              };
              var marker,i;
              for (i = 0; i < locations.length; i++) {
                marker = new window.google.maps.Marker({
                  position: new window.google.maps.LatLng(locations[i][0], locations[i][1]),
                });
                if (i === 0) request.origin = marker.getPosition();
                else if (i === locations.length - 1) request.destination = marker.getPosition();
                else {
                  if (!request.waypoints) request.waypoints = [];
                  request.waypoints.push({
                    location: marker.getPosition(),
                    stopover: true
                  });
                }
            
              }
              directionService.route(
                request,
                (result, status) => {
                  if (status === window.google.maps.DirectionsStatus.OK) {
                    this.setState({
                      directions: result,
                      wayPoints: result.routes[0].overview_path.filter((elem, index) => {
                        return index % 30 === 0;
                      })
                    });
                  } else if (
                    status === window.google.maps.DirectionsStatus.OVER_QUERY_LIMIT
                  ) {
                  } else {
                    console.error('error fetching directions',status);
                  }
                }
              );
              count = 1;
            
          });
        }
        else {
          if(this.state.currentLocation && ((this.state.currentLocation.lat !== data.lat) || (this.state.currentLocation.lon !== data.lon))) {
            this.setState(prevState =>{
              return{
                   ...prevState,
                   previousLocation : prevState.currentLocation,
                   currentLocation : currentLocation
              }
            })
            // if(this.state.previousLocation && this.state.currentLocation) {
            //   let pointA = new window.google.maps.LatLng(this.state.currentLocation.lat, this.state.currentLocation.lng);
            //   let pointB = new window.google.maps.LatLng(this.state.previousLocation.lat, this.state.previousLocation.lng);
            //   var heading = new window.google.maps.geometry.spherical.computeHeading(pointB,pointA);
            //   this.setState({
            //     bearing : heading
            //   })
            // }
          }
        }
      }
    });
  }
  
  
  componentDidMount = () => {
    this.props.setClick(this.get_to_back);
    const user_info = JSON.parse(localStorage.getItem('user'));
    socket.emit("liveMe",{"user_id":user_info.user_id});
    socket.emit("joinChat",{"chat_id":user_info.user_id});
    
    this.setState({
      user_info : user_info,
      booking_details : this.props.booking_details && this.props.booking_details
    },()=>{
      this.setCurrentLocation();
    })
  }
  componentWillUnmount(){
    clearInterval(this.refreshIntervalId);
  }
  setCurrentLocation = () => {
    var a = 0;
    socket.emit("sendMessage",{"type": "getLocation","user_id":this.state.user_info && this.state.user_info.user_id,"tasker_id":this.state.booking_details && this.state.booking_details.tasker.id });
    this.refreshIntervalId = setInterval(() => {
        socket.emit("sendMessage",{"type": "getLocation","user_id":this.state.user_info && this.state.user_info.user_id,"tasker_id":this.state.booking_details && this.state.booking_details.tasker.id });
        console.log(a++);
    }, 5000);
  };
  get_to_back() {
    clearInterval(this.refreshIntervalId);
    this.props.history.goBack();
  }
  render() {
    let originMarker = null;
    let destinationMarker = null;   
    let originIconMarker = new window.google.maps.MarkerImage(
      require("../../assets/icons/map/pickup_marker.png"),
      null, /* size is determined at runtime */
      null, /* origin is 0,0 */
      null, /* anchor is bottom center of the scaled image */
      new window.google.maps.Size(32, 32)
    );
    let destinationIconMarker = new window.google.maps.MarkerImage(
      require("../../assets/icons/map/drop_marker.png"),
      null, /* size is determined at runtime */
      null, /* origin is 0,0 */
      null, /* anchor is bottom center of the scaled image */
      new window.google.maps.Size(32, 32)
    );
    let navigateIconMarker = new window.google.maps.MarkerImage(
      require("../../assets/icons/map/car.png"),
      null, /* size is determined at runtime */
      null, /* origin is 0,0 */
      null, /* anchor is bottom center of the scaled image */
      new window.google.maps.Size(32, 32),
    );
    if (this.state.directions && this.props.index) {
      
      originMarker = (
        <Marker
          icon={  originIconMarker }
          position={{
            lat: this.state.booking_details && parseFloat(this.state.booking_details.source_lat),
            lng: this.state.booking_details && parseFloat(this.state.booking_details.source_lon)
          }}
        />
      );
      if(this.state.booking_details && this.state.booking_details.location_type === 'transport') {
        destinationMarker = (
          
          <Marker
            icon={  destinationIconMarker }
            position={{
              lat: this.state.booking_details && parseFloat(this.state.booking_details.dest_lat),
              lng: this.state.booking_details && parseFloat(this.state.booking_details.dest_lon)
            }}
          />
        );
      }
    }
    return (
      <div>
        {originMarker}
        {destinationMarker}
        {this.state.currentLocation && (
          <Marker
            icon= {  navigateIconMarker }
            position={{
              lat: this.state.currentLocation.lat,
              lng: this.state.currentLocation.lng
            }}
            rotation = {250}
            style = {{ transform : `rotate(${this.state.bearing && this.state.bearing}deg)` }}
          />
        )}
        {this.state.directions && (
          <DirectionsRenderer
            directions={this.state.directions}
            options={{
              polylineOptions: {
                storkeColor: '#0313FC',
                strokeOpacity: 0.4,
                strokeWeight: 4
              },
              preserveViewport: true,
              suppressMarkers: true,
              icon: { scale: 3 }
            }}
          />
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(DirectionRenderComponent));
