import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

class CategorySlider extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    service_image_err = (ev) => {
        ev.target.src = require("../../assets/images/default_service_image.png");
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
                    this.props.cat_items &&
                    this.props.cat_items.map((i,k) => { // eslint-disable-line
                        if(k < 20) {
                            return (
                                <div key={i.item_id}>
                                    <Link to={ this.props.cat_type.item_type === "professional" ? "/user/professional-view/"+this.props.cat_type.item_id+"/"+i.item_id : "/user/marketplace-view/"+this.props.cat_type.item_id+"/"+i.item_id}>
                                        <div className="mx-1">
                                            <div className="categoryImg">
                                                <img onError={this.service_image_err} className="imgBg" src={i.item_image} alt="" height={135} />
                                            </div>
                                            <p className="mb-0 m-t10 text-truncate txtClr">{i.item_name}</p>
                                        </div>
                                    </Link>
                                </div>
                            )
                        }
                        
                    })}
                </Slider>
            </React.Fragment>
        );
    }
}

export default CategorySlider;