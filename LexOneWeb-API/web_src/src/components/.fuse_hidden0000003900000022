import React, { Component } from 'react';
import Slider from "react-slick";
import SimpleReactLightbox from "simple-react-lightbox";
import { SRLWrapper } from 'simple-react-lightbox'

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

const options = {
    buttons: {
        showAutoplayButton: false,
        showCloseButton: true,
        showDownloadButton: false,
        showFullscreenButton: false,
        showThumbnailsButton: false,
    }
}
class TaskerImageSlide extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const settings = {
            infinite: false,
            speed: 300,
            slidesToScroll: 8,
            slidesToShow: 8,
            arrow: true,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToScroll: 6,
                        slidesToShow: 6,
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToScroll: 5,
                        slidesToShow: 5,
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToScroll: 3,
                        slidesToShow: 3,
                        draggable: true,
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToScroll: 2,
                        slidesToShow: 2,
                        draggable: true,
                    }
                }
            ]
        };

        return (
            <React.Fragment>
                <div className="homeSlide py-0">
                    <div className="taskerImages"> 
                        <div>
                            <div id="content-page-one" className="container content px-0">
                                <div className="box ">
                                <SimpleReactLightbox>
                                    <SRLWrapper options={options}>
                                    <Slider  {...settings}>
                                    {this.props.tasker_image && this.props.tasker_image.map((i,k) => {
                                        return (
                                            <div key={k}>
                                                <img className="imgBg roundedFivePx cursorPointer" height="80" src={i.item_url} alt="" />
                                            </div>
                                        )
                                        })
                                    }
                                    </Slider>
                                    </SRLWrapper>
                                </SimpleReactLightbox>
                                </div>
                            </div>
                        </div>
                               
                    </div>
                </div>

            </React.Fragment >
        );
    }
}

export default TaskerImageSlide;