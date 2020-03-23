import React, { Component, createRef } from 'react';

class UploadedVideo extends Component {
  constructor() {
    super();
    this.videoRef = createRef('video');
    this.state = {
      title: 'Loading ...',
      description: 'Loading ...'
    };
  }
  componentDidMount() {
    fetch(`http://localhost:5000${this.props.location.pathname}/info`).then((response) => {
      return response.json();
    })
      .then((data) => {
        const newData = data.info.split('\r\n');
        const title = newData[0];
        const description = newData[1];
        this.setState({ title, description });
      }).catch(err => console.log(err));
  }

  render() {
    const { title, description } = this.state;
    return (
      <div className='showVideo'>
        <video ref={this.videoRef} controls src={`http://localhost:5000${this.props.location.pathname}`} className='uploadedVideo'></video>
        <div className='videoInfo'>
          <h1>{title}</h1>
          <br />
          <p>{description}</p>
        </div>
      </div>
    );
  }
};

export default UploadedVideo;
