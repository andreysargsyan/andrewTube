import React, { Component, createRef } from 'react';
import URL from 'url';

class VideoCapture extends Component {
  constructor() {
    super();
    this.videoRef = createRef('video')
    this.savedVideoRef = createRef('video')
  }
  componentWillMount() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.videoRef.current.srcObject = stream;
      let chunks = [];
      this.videoRef.current.onloadedmetadata = (ev) => {
        this.videoRef.current.play();
      };


      this.mediaRecorder.ondataavailable = function (ev) {
        console.log('dataavailable')
        chunks.push(ev.data);
      }
      this.mediaRecorder.onstop = (ev) => {
        console.log('mediastream stopped')
        let blob = new Blob(chunks, { 'type': 'video/mp4;' });
        chunks = [];
        console.log(window.URL)
        let videoURL = URL.createObjectURL(blob);
        console.log('mediastream stopped 2 ', videoURL)
        this.savedVideoRef.current.srcObject = videoURL;
      }
    })
  }

  startCapturing = () => {
    this.mediaRecorder.start();
    console.log('started')
  }

  stopCapturing = () => {
    this.mediaRecorder.stop();
    console.log('stoped')
  }

  render() {
    return (
      <>
        <div className="videoCapture">
          <video width='400' height='300' muted ref={this.videoRef}></video>
          <video width='400' height='300'  ref={this.savedVideoRef} controls></video>
          <div onClick={this.startCapturing}>Start</div>
          <div onClick={this.stopCapturing}>Stop</div>
        </div>
      </>
    );
  }
};

export default VideoCapture;
