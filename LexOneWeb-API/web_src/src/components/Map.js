import React, { Component } from 'react';
import { Button } from 'antd';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import {AimOutlined} from '@ant-design/icons';
import {user_live_location} from '../redux/actions';
import {connect} from 'react-redux';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

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

class Map extends Component{

	constructor( props ){
		super( props );
		this.state = {
			address: '',
			city: '',
			area: '',
			state: '',
			mapPosition: {
				lat: this.props.center && this.props.center.lat,
				lng: this.props.center && this.props.center.lng
			},
			markerPosition: {
				lat: this.props.center && this.props.center.lat,
				lng: this.props.center && this.props.center.lng
			},
			zoom : this.props.zoom && this.props.zoom
		}
	}
	/**
	 * Get the current address from the default map position and set those values in the state
	 */
	recenter_current_location = () => {
		alert('hi')
	}
	get_geo_location = () => {
        var rm = this;
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		if(isSafari === true || isSafari === false) {
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
								user_live_location.lat = latitude;
								user_live_location.lng = longitude;
								user_live_location.address = ( address ) ? address : '';
								rm.props.user_live_location(user_live_location);
							},
							error => {
								console.error(error);
							}
						);
					});
				}, function(error) {
					console.log('safari_error',error);
					rm.cant_get_location();
				});
			} else {
				rm.cant_get_location();
			}
		}
		
    }
	cant_get_location = () => {
		Toast.fire({
			icon: 'warning',
			title: "Please allow location, on Browser!"
		});
	}
	componentDidMount() {
		console.log(this.state.mapPosition);
		console.log(this.state.markerPosition);
		Geocode.fromLatLng( this.state.mapPosition.lat , this.state.mapPosition.lng ).then(
			response => {
				const address = response.results[0].formatted_address,
				      addressArray =  response.results[0].address_components,
				      city = this.getCity( addressArray ),
				      area = this.getArea( addressArray ),
				      state = this.getState( addressArray );

				console.log( 'city', city, area, state );

				this.setState( {
					address: ( address ) ? address : '',
					area: ( area ) ? area : '',
					city: ( city ) ? city : '',
					state: ( state ) ? state : '',
				} )
                user_live_location.lat = this.state.mapPosition.lat;
                user_live_location.lng = this.state.mapPosition.lng;
                user_live_location.address = ( address ) ? address : '';
                this.props.user_live_location(user_live_location);
			},
			error => {
				console.error( error );
			}
		);
	};
	
	/**
	 * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
	 *
	 * @param nextProps
	 * @param nextState
	 * @return {boolean}
	 */
	shouldComponentUpdate( nextProps, nextState ){
		if (
			this.state.markerPosition.lat !== this.props.center.lat ||
			this.state.address !== nextState.address ||
			this.state.city !== nextState.city ||
			this.state.area !== nextState.area ||
			this.state.state !== nextState.state
		) {
			// alert(this.props.center.lat);
			// alert(this.state.markerPosition.lat+' marker - props '+this.props.center.lat);

			return true
		} else if ( this.props.center.lat === nextProps.center.lat ){
			// alert(this.state.markerPosition.lat+' marker - props '+this.props.center.lat);
			return false
		}
	}
	/**
	 * Get the city and set the city input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getCity = ( addressArray ) => {
		let city = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
				city = addressArray[ i ].long_name;
				return city;
			}
		}
	};
	/**
	 * Get the area and set the area input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getArea = ( addressArray ) => {
		let area = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0]  ) {
				for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
					if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
						area = addressArray[ i ].long_name;
						return area;
					}
				}
			}
		}
	};
	/**
	 * Get the address and set the address input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getState = ( addressArray ) => {
		let state = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			for( let i = 0; i < addressArray.length; i++ ) {
				if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
					state = addressArray[ i ].long_name;
					return state;
				}
			}
		}
	};
	/**
	 * And function for city,state and address input
	 * @param event
	 */
	onChange = ( event ) => {
		this.setState({ [event.target.name]: event.target.value });
	};
	/**
	 * This Event triggers when the marker window is closed
	 *
	 * @param event
	 */
	onInfoWindowClose = ( event ) => {

	};

	/**
	 * When the marker is dragged you get the lat and long using the functions available from event object.
	 * Use geocode to get the address, city, area and state from the lat and lng positions.
	 * And then set those values in the state.
	 *
	 * @param event
	 */
	onMarkerDragEnd = ( event ) => {
		let newLat = event.latLng.lat(),
		    newLng = event.latLng.lng();

		Geocode.fromLatLng( newLat , newLng ).then(
			response => {
                var user_live_location = {};
				const address = response.results[0].formatted_address,
				      addressArray =  response.results[0].address_components,
				      city = this.getCity( addressArray ),
				      area = this.getArea( addressArray ),
				      state = this.getState( addressArray );
				this.setState( {
					address: ( address ) ? address : '',
					area: ( area ) ? area : '',
					city: ( city ) ? city : '',
					state: ( state ) ? state : '',
					markerPosition: {
						lat: newLat,
						lng: newLng
					},
					mapPosition: {
						lat: newLat,
						lng: newLng
					},
				} )
                user_live_location.lat = newLat;
                user_live_location.lng = newLng;
                user_live_location.address = ( address ) ? address : '';
                this.props.user_live_location(user_live_location);
			},
			error => {
				console.error(error);
			}
		);
	};

	/**
	 * When the user types an address in the search box
	 * @param place
	 */
	onPlaceSelected = ( place ) => {
		console.log( 'plc', place );
        var user_live_location = {};
		if (place["address_components"] !== undefined) {
			const address = place.formatted_address,
			addressArray =  place.address_components,
			city = this.getCity( addressArray ),
			area = this.getArea( addressArray ),
			state = this.getState( addressArray ),
			latValue = place.geometry.location.lat(),
			lngValue = place.geometry.location.lng();
			// Set these values in the state.
			this.setState({
				zoom : 15,
				address: ( address ) ? address : '',
				area: ( area ) ? area : '',
				city: ( city ) ? city : '',
				state: ( state ) ? state : '',
				markerPosition: {
					lat: latValue,
					lng: lngValue
				},
				mapPosition: {
					lat: latValue,
					lng: lngValue
				},
			})
			user_live_location.lat = latValue;
			user_live_location.lng = lngValue;
			user_live_location.address = ( address ) ? address : '';
			this.props.user_live_location(user_live_location);
		}
		
	};
	onMapClick = (e) => {
		var latitude = e.latLng.lat();
		var longitude = e.latLng.lng();
		var rm = this;
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
				user_live_location.lat = latitude;
				user_live_location.lng = longitude;
				user_live_location.address = ( address ) ? address : '';
				rm.props.user_live_location(user_live_location);
			},
			error => {
				console.error(error);
			}
		);
	}

	render(){
		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
                    <>

                    <Autocomplete
                        style={{
                            width: '100%',
                            height: '40px',
                            paddingLeft: '16px',
                            marginTop: '2px'
                        }}
						
                        onPlaceSelected={ this.onPlaceSelected }
                        types={['(regions)']}
                        defaultValue = {this.state.address}
                    />
					<GoogleMap google={ this.props.google }
					           defaultZoom={ this.state.zoom }
					           defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
							   onClick={this.onMapClick}
					>
                        
						{/* InfoWindow on top of marker */}
						<InfoWindow
							onClose={this.onInfoWindowClose}
							position={{ lat: ( this.state.markerPosition.lat + 0.0018 ), lng: this.state.markerPosition.lng }}
						>
							<div>
								<span style={{ padding: 0, margin: 0 }}>{ this.state.address }</span>
							</div>
						</InfoWindow>
						{/*Marker*/}
						<Marker google={this.props.google}
						        name={'Dolores park'}
						        draggable={true}
						        onDragEnd={ this.onMarkerDragEnd }
						        position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
						/>
						<Marker />
						{/* For Auto complete Search Box */}
						
					</GoogleMap>
					
                    </>
				)
			)
		);
		let map;
		if( this.props.center.lat !== undefined ) {
			map = <div>
				<div style={{ display : 'none' }}>
					<div className="form-group">
						<label htmlFor="">City</label>
						<input type="text" name="city" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.city }/>
					</div>
					<div className="form-group">
						<label htmlFor="">Area</label>
						<input type="text" name="area" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.area }/>
					</div>
					<div className="form-group">
						<label htmlFor="">State</label>
						<input type="text" name="state" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.state }/>
					</div>
					<div className="form-group">
						<label htmlFor="">Address</label>
						<input type="text" name="address" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.address }/>
					</div>
				</div>

				<AsyncMap
					googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=places`}
					loadingElement={
						<div style={{ height: `100%` }} />
					}
					containerElement={
						<div style={{ height: this.props.height }} />
					}
					mapElement={
						<div style={{ height: `100%` }} />
					}
				/>
				<div>
					<Button onClick={this.get_geo_location} type="primary" shape="circle" icon={<AimOutlined />} size="large" />
				</div>
			</div>
		} else {
			map = <div style={{height: this.props.height}} />
		}
		return( map )
	}
}
export default connect(mapStateToProps,mapDispatchToProps, null, {forwardRef:true})(Map)
