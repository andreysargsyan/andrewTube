import React, { Component } from 'react';
import Video from './Video';

class Home extends Component {
    constructor() {
        super()
        this.state = {
            videos: []
        };
    }

    componentDidMount() {
        fetch('http://localhost:5000/getVideos').then(res => res.json()).then(data => {
            let videos = [];
            for (const key of Object.keys(data)) {
                data[key].forEach((video) => {
                    videos.push(<Video author={key} link={video.video_link} title={video.video_name} key={video.video_link}/>)
                });

            }
            this.setState({videos});
        }).catch(err => console.err);
    }

    render() {
        const { videos } = this.state;
        return (
            <>
                <div className="videos">
                    {videos}
                </div>
            </>
        );
    }
};

export default Home;
