import React, { Component } from 'react';
import {AimOutlined,DownloadOutlined} from '@ant-design/icons';
import {user_live_location} from '../redux/actions';
import {connect} from 'react-redux';
import Geocode from "react-geocode";

const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} = require("react-google-maps");
const {
    SearchBox
} = require("react-google-maps/lib/components/places/SearchBox");

const mapStateToProps=(props)=> {
    return {
        user_location : props.userLocation
    }
}

const mapDispatchToProps=(dispatch)=> {
    return {
        user_live_location : (location)=>dispatch(user_live_location(location))
    }
}
Geocode.setApiKey( process.env.REACT_APP_GOOGLE_MAP_API_KEY );
Geocode.enableDebug();
const Map = compose(
    withProps({
        googleMapURL:
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyD7iV6SUlJ8IESBIcqPMTbNNagz607XrS4&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />
    }),
    lifecycle({
        componentWillMount() {
            const refs = {};

            this.setState({
                bounds: null,
                markerPosition: {
                    lat: this.props.center && this.props.center.lat,
                    lng: this.props.center && this.props.center.lng
                },
                center: {
                    lat: 41.9,
                    lng: -87.624
                },
                markers: [],
                onMapMounted: ref => {
                    refs.map = ref;
                },
                get_geo_location: () => {
                    var rm = this;
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function(position) {
                                var latitude = position.coords.latitude;
                                var longitude = position.coords.longitude;
                                rm.setState({ lat:latitude,lon:longitude });
                                var pos = {
                                    lat : latitude,
                                    lng : longitude
                                }
                                console.log('current_locat');
                                console.log(pos);
                                rm.setState({ mapPosition : pos,markerPosition : pos,zoom : 15 },()=>{
                                    Geocode.fromLatLng( latitude , longitude ).then(
                                        response => {
                                            var user_live_location = {};
                                            const address = response.results[0].formatted_address,
                                                    addressArray =  response.results[0].address_components,
                                                    city = rm.getCity( addressArray ),
                                                    area = rm.getArea( addressArray ),
                                                    state = rm.getState( addressArray );
                                            rm.setState( {
                                                address: ( address ) ? address : '',
                                                area: ( area ) ? area : '',
                                                city: ( city ) ? city : '',
                                                state: ( state ) ? state : '',
                                                markerPosition: {
                                                    lat: latitude,
                                                    lng: longitude
                                                },
                                                mapPosition: {
                                                    lat: latitude,
                                                    lng: longitude
                                                },
                                            } )
                                        },
                                        error => {
                                            console.error(error);
                                        }
                                    );
                                });
                            }, function(error) {
                                console.log('safari_error',error);
                            });
                        } else {
                        }
                    
                    
                },
                onBoundsChanged: () => {
                    this.setState({
                        bounds: refs.map.getBounds(),
                        center: refs.map.getCenter()
                    });
                },
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },
                onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();
                    const bounds = new window.google.maps.LatLngBounds();

                    places.forEach(place => {
                        if (place.geometry.viewport) {
                            bounds.union(place.geometry.viewport);
                        } else {
                            bounds.extend(place.geometry.location);
                        }
                    });
                    const nextMarkers = places.map(place => ({
                        position: place.geometry.location
                    }));
                    const nextCenter = _.get(
                        nextMarkers,
                        "0.position",
                        this.state.center
                    );

                    this.setState({
                        center: nextCenter,
                        markers: nextMarkers
                    });
                    // refs.map.fitBounds(bounds);
                },
                onMarkerDragEnd: (coord, index) => {
                    const { latLng } = coord;
                    const lat = latLng.lat();
                    const lng = latLng.lng();
                    console.log(111);
                    this.setState(prevState => {
                        const markers = [...this.state.markers];
                        markers[index] = {
                            ...markers[index],
                            position: { lat, lng }
                        };
                        return { markers };
                    });
                }
            });
        }
    }),
    withScriptjs,
    withGoogleMap
)(props => (
    <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={15}
        center={props.center}
        onBoundsChanged={props.onBoundsChanged}
    >
        {/* <SearchBox
            ref={props.onSearchBoxMounted}
            bounds={props.bounds}
            controlPosition={new window.google.maps.ControlPosition.TOP_LEFT}
            onPlacesChanged={props.onPlacesChanged}
        >
            <input
                type="text"
                placeholder="Customized your placeholder"
                style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `240px`,
                    height: `32px`,
                    marginTop: `27px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`
                }}
            />
        </SearchBox> */}
        {props.markers.map((marker, index) => (
            <Marker
                key={index}
                position={marker.position}
                draggable={true}
                onDragEnd={props.onMarkerDragEnd}
            />
        ))}
    </GoogleMap>
));

export default connect(mapStateToProps,mapDispatchToProps, null, {forwardRef:true})(Map);