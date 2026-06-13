import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class HomeBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  image_load_err = (ev) => {
    ev.target.src = require("../../assets/images/defualt_carousel.jpg");
  };
  get_to_link = (link) => {
    const win = window.open(link, "_blank");
    win.focus();
  };
  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: false,
      autoplay: true,
      pagination: {
        dynamicBullets: true,
      },
    };
    return (
      <div className="homeBanner">
        <Slider {...settings}>
          {this.props.banners &&
            this.props.banners.map((i) => {
              return (
                <div
                  key={i.item_id}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.get_to_link(i.item_link);
                  }}
                >
                  <div className="position-relative cursorPointer">
                    <div className="containerBanner">
                      <div className="bannerImg">
                        <img
                          onError={this.image_load_err}
                          src={i.item_image}
                          className="w-100 imgBg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="bannerContent">
                      <div className="parent">
                        <p className="title"></p>
                        <p className="subTitle"></p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </Slider>
      </div>
    );
  }
}

export default HomeBanner;
