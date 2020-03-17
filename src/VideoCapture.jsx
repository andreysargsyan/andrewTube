import React, { Component, createRef } from 'react';

class VideoCapture extends Component {
  constructor() {
    super();
    this.videoRef = createRef('video');
    this.savedVideoRef = createRef('video');
    this.buttonRef = createRef('div');
    this.streams = [];
    this.isFocused = true;
    this.state = {
      isRecording: false,
      isRecorded: false,
    };
  }

  componentDidMount() {
    window.addEventListener('focus', this.startCapturingOnFocus);
    window.addEventListener('blur', this.stopCapturingOnBlur);
    this.startCapturing();

  }

  componentWillUnmount() {
    this.stopCapturing();
    // this.streams = null;
    window.removeEventListener('focus', this.startCapturingOnFocus);
    window.removeEventListener('blur', this.stopCapturingOnBlur);
  }

  startCapturing = () => {
    console.log(this.isFocused)
    // this.stopCapturing();
    if (this.savedVideoRef.current && this.savedVideoRef.current.src) return;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      console.log('2')
      if (!this.isFocused) {
        this.stopCapturing();
        return;
      }
      this.mediaRecorder = new MediaRecorder(stream);
      this.streams.push(stream);
      let chunks = [];

      this.videoRef.current.srcObject = stream;

      this.videoRef.current.onloadedmetadata = (ev) => {
        if (!this.videoRef.current) return;
        try {
          this.videoRef.current.play();
        }
        catch{
          console.log('error occured when started video playing')
        }
      };

      this.mediaRecorder.ondataavailable = function (ev) {
        chunks.push(ev.data);
      }

      this.mediaRecorder.onstop = (ev) => {
        let blob = new Blob(chunks, { 'type': 'video/mp4;' });
        chunks = [];
        let videoURL = window.URL.createObjectURL(blob);
        this.savedVideoRef.current.src = videoURL;

        this.videoRef.current.style.display = 'none';
        this.savedVideoRef.current.style.display = 'block';
      };
    }).catch(err => console.error(err.name)) // TODO add modal here
  }

  controlRecording = () => {
    console.log(this.mediaRecorder.state, 6666666666666666666)
    if (this.mediaRecorder.state === 'recording') {
      this.stopRecording();
      this.stopCapturing();
      return;
    }
    this.mediaRecorder.start();
    window.document.documentElement.requestFullscreen();

    // this.videoRef.current.style = { ...videoRefStyle};
    this.buttonRef.current.style.zIndex = '6';
    this.buttonRef.current.style.position = 'absolute';
    this.buttonRef.current.style.top = '5%';
    this.buttonRef.current.style.right = '5%';
    this.buttonRef.current.style.color = 'white';
    this.buttonRef.current.style.fontSize = '20';

    this.setState({ isRecording: true });
  };

  stopRecording = () => {
    this.mediaRecorder.stop();
    this.setState({ isRecording: false, isRecorded: true });
    document.exitFullscreen();
    this.buttonRef.current.style.display = 'none';
  };

  stopCapturing = () => {
    console.log('3')
    if (!this.streams) return;
    console.log('4')
    this.streams.forEach(stream => {
      stream.getTracks().forEach(el => {
        el.stop();
      })
    })
    this.streams = [];
  };

  startCapturingInNextTick = () => {
    console.log('start capt next tick')
    process.nextTick(() => this.startCapturing());
  }

  startCapturingOnFocus = () => {
    console.log('start capt on focus')

    this.isFocused = true;
    this.startCapturingInNextTick();
  }

  stopCapturingOnBlur = () => {
    console.log('stop capt on blur')
    this.isFocused = false;
    process.nextTick(() => {
      if (!this.isFocused) {
        this.stopCapturing();
      }
    });
  }

  render() {  //TODO implement all the code without display none if possible! and add button to send the video 
    const { isRecording, isRecorded } = this.state;

    let recordingIndicator = isRecording ? (
      <div className='recording-indicator'>
        Recording   <i className="fas fa-video"> </i>
      </div>
    ) : '';
    const videoRefStyle = isRecording ? {
      objectFit: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: '5',
      width: '100vw',
      height: '100%'
    } : { width: '50%' };

    const savedVideoRefStyle = isRecording ? { display: 'block', width: '50%' } : { display: 'none', width: '50%' };
    const sendButton = isRecorded ? (<div onClick={() => console.log('submit :D')} className='record-button'>Submit</div>) : '';
    // const buttonRefStyle = isRecorded ? {display: 'none'} : {}

    // console.log(navigator.userAgent,)
    // navigator.platform,
    // navigator.appVersion,
    // navigator.vendor)

    return (
      <>
        <div className="videoCapture">
          <video muted ref={this.videoRef} style={videoRefStyle} className='videoCaptureTag'></video>
          <video ref={this.savedVideoRef} controls style={savedVideoRefStyle} className='savedVideoTag'></video>
          <div onClick={this.controlRecording} ref={this.buttonRef} className='record-button'>{isRecording ? 'Stop Recording' : 'Start Recording'}</div>
          {recordingIndicator}
          {sendButton}
        </div>
      </>
    );
  }
};

export default VideoCapture;
