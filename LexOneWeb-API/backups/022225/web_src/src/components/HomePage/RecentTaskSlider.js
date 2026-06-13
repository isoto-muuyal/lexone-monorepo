import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Slider from "react-slick";

const SampleNextArrow = (props) => {
    const { className, onClick } = props;
    return (
        <div className={className} onClick={onClick}>
            <div className="nextArrow"></div>
        </div>
    );
}

const SamplePrevArrow = (props) => {
    const { className, onClick } = props;
    return (
        <div className={className} onClick={onClick}>
            <div className="prevArrow"></div>
        </div>
    );
}

class RecentTaskSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount = () => {
        this.set_general_info();
    }
    set_general_info = () => {
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        var user_info = JSON.parse(localStorage.getItem('user'));
        this.setState({ general_info : general_info, user_info : user_info });
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../assets/images/default_service_image.png");
    }
    view_booking = (id) => {
        var obj = {};
        obj.booking_id = id;
        this.props.history.push('/user/my-booking/detail', obj);
    }
    tasker_booking_view = (id) => {
        var obj = {};
        obj.booking_id = id;
        this.props.history.push("/tasker/my-booking/detail",obj);
    }
    render() {
        const settings = {
            infinite: false,
            spaceBetween: 20,
            speed: 300,
            slidesToScroll: 4,
            slidesToShow: 4,
            arrow: true,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToScroll: 3,
                        slidesToShow: 3,
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToScroll: 2,
                        slidesToShow: 2,
                        draggable: true,
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToScroll: 1,
                        slidesToShow: 1,
                        draggable: true,
                    }
                }
            ]
        };
        return (
            <React.Fragment>
                <Slider  {...settings}>
                    { 
                    this.state.user_info &&
                    this.state.user_info.type === 'user' &&
                    this.props.recent_bookings &&
                     this.props.recent_bookings.recent_tasks.map((i,k) => {
                        return (
                                <div onClick={ (e)=>{ e.stopPropagation(); this.view_booking(i.item_id)  } } key={k} className="cardOneStyle txtClr cursorPointer">
                                    <div className="detailsSection">
                                        <div className="row">
                                            <div className="col-8 pr-0">
                                                <div className="details">
                                                    <div className="text-truncate fM">{i.subcategory_name}</div>
                                                    <div className="font-lg fB my-2">{this.state.general_info && this.state.general_info.currency_symbol} {i.price}</div>
                                                </div>
                                            </div>
                                            <div className="col-4 align-self-center">
                                                <div className="d-flex justify-content-end">
                                                    <img className="profile sm imgBg" onError={this.service_image_err} src={i.item_image} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detailTwo">
                                        {i.description}
                                    </div>

                                    {/* <div className="d-flex justify-content-end">
                                        <div className="ratingSection d-flex mt-1 font-sm">
                                            <div className="align-self-center mr-2">
                                                <div className="starIcon"></div>
                                            </div>
                                            <div className="align-self-center">
                                                {i.starCount}
                                            </div>
                                        </div>
                                    </div> */}

                                </div>
                        )
                    })
                    }
                    {
                    this.state.user_info &&
                    this.state.user_info.type === 'tasker' &&
                    this.props.recent_bookings &&
                     this.props.recent_bookings.map((i,k) => {
                        return (
                                <div onClick={ (e)=>{ e.stopPropagation(); this.tasker_booking_view(i.item_id)  } } key={k} className="cardOneStyle txtClr cursorPointer">
                                    <div className="detailsSection">
                                        <div className="row">
                                            <div className="col-8 pr-0">
                                                <div className="details">
                                                    <div className="text-truncate fM">{i.subcategory_name}</div>
                                                    <div className="font-lg fB my-2">{this.state.general_info && this.state.general_info.currency_symbol} {i.price}</div>
                                                </div>
                                            </div>
                                            <div className="col-4 align-self-center">
                                                <div className="d-flex justify-content-end">
                                                    <img className="profile sm imgBg" onError={this.service_image_err} src={i.item_image} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detailTwo">
                                        {i.description}
                                    </div>

                                    {/* <div className="d-flex justify-content-end">
                                        <div className="ratingSection d-flex mt-1 font-sm">
                                            <div className="align-self-center mr-2">
                                                <div className="starIcon"></div>
                                            </div>
                                            <div className="align-self-center">
                                                {i.starCount}
                                            </div>
                                        </div>
                                    </div> */}

                                </div>
                        )
                    })
                
                }
                </Slider>
            </React.Fragment>
        );
    }
}

export default withRouter(RecentTaskSlider);