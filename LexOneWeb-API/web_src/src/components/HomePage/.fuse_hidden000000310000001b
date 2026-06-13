import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import { withRouter } from 'react-router-dom';

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

class ServiceSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autoplay : true,
        }
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../assets/images/default_service_image.png");
    }
    stop_autoplay = () =>{
        this.setState({
            autoplay:false,
        })
    }
    render() {
        
        const settings = {
            infinite: false,
            spaceBetween: 20,
            speed: 300,
            slidesToScroll: 6,
            slidesToShow: 6,
            arrow: true,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToScroll: 5,
                        slidesToShow: 5,
                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToScroll: 4,
                        slidesToShow: 4,
                        autoplay: this.state.autoplay,
                        autoplaySpeed: 1500,
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToScroll: 3,
                        slidesToShow: 3,
                        draggable: true,
                        autoplay: this.state.autoplay,
                        autoplaySpeed: 1500
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToScroll: 2,
                        slidesToShow: 2,
                        draggable: true,
                        autoplay: this.state.autoplay,
                        autoplaySpeed: 1500
                    }
                }
            ]
        };
        
        console.log(this.props);
        return (
            <React.Fragment>
                <div >
                <Slider  {...settings}>
                    
                    {
                        this.props.service_info &&
                        this.props.service_info.map((i) => {
                        return (
                            <div key={i.item_id} onTouchStart={ this.stop_autoplay }>
                                
                                    <div className="mx-1 text-center">
                                    <Link to={ "/user/sub-categories/"+i.item_id }>
                                        <div className="serviceImg">
                                            <img onError={this.service_image_err} className="imgBg" src={i.item_image} alt="" height={135} />
                                        </div>
                                        <p className="mb-0 m-t10 text-truncate txtClr">{i.item_name}</p>
                                    </Link>
                                    </div>
                                
                            </div>
                        )
                    })}
                </Slider>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(ServiceSlider);