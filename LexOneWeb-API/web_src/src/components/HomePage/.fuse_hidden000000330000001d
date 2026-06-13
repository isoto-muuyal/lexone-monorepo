import React, { Component } from 'react';
import { Modal, Button } from 'antd';

class HowDoesWork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal2Visible: false,
        }
    }
    componentDidMount = () => {
        this.getId();
    }
    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible });
        // var myScope = document.getElementById('divScope');      
        // //otherwise set scope as the entire document
        // //var myScope = document;

        // //if there is an iframe inside maybe embedded multimedia video/audio, we should reload so it stops playing
        // console.log('myScope',myScope);
        // var iframes = myScope.getElementsByTagName("iframe");
        // console.log('iframes',iframes);
        // if (iframes != null) {
        //     console.log(iframes[0].contentWindow.postMessage);
        //     iframes[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*'); // eslint-disable-line
        // }
    }
    getId = () => {
        var general_info = JSON.parse(localStorage.getItem('general_info'));
        this.setState({general_info : general_info});
        var url = general_info.youtube_link && general_info.youtube_link;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
    
        var video_id = (match && match[2].length === 11)
          ? match[2]
          : null;

          this.setState({ video_id : video_id });
    }
    render() {
        return (
            <React.Fragment>
                <div className="howDoesWork p-4 border mt-5">
                    <div className="row">
                        <div className="col-lg-8 align-self-center">
                            <h1 className="fB resp-font24">{ this.state.general_info && this.state.general_info.youtube_title }</h1>
                            <p>{ this.state.general_info && this.state.general_info.youtube_description }</p>
                            <Button className="PrimaryBtn lg" onClick={() => this.setModal2Visible(true)}>
                                Watch video
                         </Button>
                         {/* <Button className="PrimaryBtn">
                                Watch video
                         </Button> */}
                            <Modal
                                bodyStyle={{ padding: 5, }}
                                footer={null}
                                closable={true}
                                centered
                                visible={this.state.modal2Visible}
                                onCancel={() => this.setModal2Visible(false)}
                                className="howDoesWorkModal"
                            >
                                {
                                    this.state.modal2Visible === true &&
                                    <div class="embed-responsive" >
                                        <iframe src={"https://www.youtube.com/embed/"+this.state.video_id }
                                            frameborder='0'
                                            allow='autoplay; encrypted-media'
                                            allowfullscreen
                                            title='video'
                                        />
                                    </div>
                                }
                            </Modal>
                        </div>
                        <div className="col-lg-4 align-self-center">
                            <div id="divScope" className="mt-4 mt-lg-0 d-flex justify-content-center">
                                
                            
                                <iframe src={"https://www.youtube.com/embed/"+this.state.video_id }
                                    frameborder='0'
                                    allow='autoplay; encrypted-media'
                                    allowfullscreen="true"
                                    title='video'

                                />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default HowDoesWork;