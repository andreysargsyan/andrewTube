import React, { Component, createRef } from 'react';

class VideoCapture extends Component {
  constructor() {
    super();
    this.videoRef = createRef('video');
    this.savedVideoRef = createRef('video');
    this.buttonRef = createRef('div');
    this.videoToSend = null;
    this.streams = [];
    this.isFocused = true;
    this.state = {
      isRecording: false,
      isRecorded: false,
      isWaitingForResponse: false
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
    // this.stopCapturing();
    if (this.savedVideoRef.current && this.savedVideoRef.current.src) return;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      this.streams.push(stream);
      if (!this.isFocused) {
        this.stopCapturing();
        return;
      }
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      
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
        let blob = new Blob(chunks, { 'type': 'video/webm;' });
        chunks = [];
        this.videoToSend = blob;
        let videoURL = window.URL.createObjectURL(blob);
        this.savedVideoRef.current.src = videoURL;

        this.videoRef.current.style.display = 'none';
        this.savedVideoRef.current.style.display = 'block';
      };
    }).catch(err => {
      console.error(err.name) // TODO add modal here
    })
  }

  controlRecording = () => {
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
    if (!this.streams) return;
    this.streams.forEach(stream => {
      stream.getTracks().forEach(el => {
        el.stop();
      })
    })
    this.streams = [];
  };

  startCapturingInNextTick = () => {
    process.nextTick(() => this.startCapturing());
  }

  startCapturingOnFocus = () => {
    this.isFocused = true;
    this.startCapturingInNextTick();
  }

  stopCapturingOnBlur = () => {
    this.isFocused = false;
    process.nextTick(() => {
      if (!this.isFocused) {
        this.stopCapturing();
      }
    });
  }

  sendVideo = (e) => {
    e.preventDefault();
    const {isWaitingForResponse} = this.state;
    if(isWaitingForResponse) return;

    const username = e.target.username.value
    const videoName = e.target.videoName.value
    const description = e.target.description.value

    if(username.length < 2 || videoName.length < 2 || description.length < 2) return; //TODO add modal here

    this.setState({isWaitingForResponse: true});

    const formData = new FormData();
    formData.append('username', username);
    formData.append('videoName', videoName);
    formData.append('description', description);
    formData.append('upl', this.videoToSend);

    fetch('http://localhost:5000/save', {
      method: 'post',
      body: formData
    })
      .then(response => {
        console.log(response) //TODO add modal here
      })
      .catch(function (error) {
        console.error('Request failed', error);
      });
  }

  render() {  //TODO implement all the code without display none if possible!
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

    const send = isRecorded ? (
      <div className="container">
          <h2 style={{margin: '20px 0px', textAlign: 'center'}}>Do you want to upload your video?</h2>
        <div className="containerForm">
          <form onSubmit={this.sendVideo}>
            <label htmlFor="fname">Username</label>
            <input type="text" id="fname" name="username" placeholder="Your name.." minLength={2} required maxLength='20'/>
            <label htmlFor="lname">Title</label>
            <input type="text" id="lname" name="videoName" placeholder="Title.." minLength={2} required maxLength='40'/>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" placeholder="Description.." required style={{ maxHeight: '200px' }}></textarea>
            <input type="submit" value="Upload" className='record-button' />
          </form>
        </div>
      </div>) : '';

    return (
      <div className='videoSending'>
        <div className="videoCapture" style={isRecorded ? { width: '70%' } : { width: '100%' }}>
          <video muted ref={this.videoRef} style={videoRefStyle} className='videoCaptureTag'></video>
          <video ref={this.savedVideoRef} controls style={savedVideoRefStyle} className='savedVideoTag'></video>
          <div onClick={this.controlRecording} ref={this.buttonRef} className='record-button'>{isRecording ? 'Stop Recording' : 'Start Recording'}</div>
          {recordingIndicator}
        </div>
        {send}
      </div>
    );
  }
};

export default VideoCapture;
