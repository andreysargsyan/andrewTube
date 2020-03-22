import React, { Component } from 'react';

class UserInfo extends Component {
  constructor() {
    super();
    this.state = {
      inputDevices: {
        audio: 0,
        video: 0
      }
    };

    this.osVersions = [
      { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
      { name: 'Windows', value: 'Win', version: 'NT' },
      { name: 'iPhone', value: 'iPhone', version: 'OS' },
      { name: 'iPad', value: 'iPad', version: 'OS' },
      { name: 'Kindle', value: 'Silk', version: 'Silk' },
      { name: 'Android', value: 'Android', version: 'Android' },
      { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
      { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
      { name: 'Macintosh', value: 'Mac', version: 'OS X' },
      { name: 'Linux', value: 'Linux', version: 'rv' },
      { name: 'Palm', value: 'Palm', version: 'PalmOS' }
    ];
    this.browserVersions = [
      { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
      { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
      { name: 'Safari', value: 'Safari', version: 'Version' },
      { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
      { name: 'Opera', value: 'Opera', version: 'Opera' },
      { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
      { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
    ];
    this.agent = [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor].join(' ');
  }

  componentDidMount() {
    this.getDevices();
  }

  detectDevice = (agent, data) => {
    for (let i = 0; i < data.length; i += 1) {
      let regex = new RegExp(data[i].value, 'i');
      let match = regex.test(agent);
      if (match) {
        let regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
        let matches = agent.match(regexv);
        let version = '';
        if (matches) { if (matches[1]) { matches = matches[1]; } }
        if (matches) {
          matches = matches.split(/[._]+/);
          for (let j = 0; j < matches.length; j += 1) {
            if (j === 0) {
              version += matches[j] + '.';
            } else {
              version += matches[j];
            }
          }
        } else {
          version = '0';
        }
        return {
          name: data[i].name,
          version: parseFloat(version)
        };
      }
    }
    return { name: 'unknown', version: 0 };
  };

  getDevices = () => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      let audio = 0;
      let video = 0;
      devices.forEach(el => {
        if (el.kind === 'audioinput') {
          audio++;
        } else if (el.kind === 'videoinput') {
          video++;
        }
      });
      this.setState({ inputDevices: { audio, video } });
    })
  };

  render() {
    const os = this.detectDevice(this.agent, this.osVersions);
    const browser = this.detectDevice(this.agent, this.browserVersions);
    const { inputDevices } = this.state;

    return (
      <div className='userInfo'>
        <p>OS name: {os.name}</p>
        <p>OS version: {os.version}</p>
        <br/>
        <p>Browser name: {browser.name}</p>
        <p>Browser version: {browser.version}</p>
        <br/>
        <p>Video inputs: {inputDevices.video}</p>
        <p>Audio inputs: {inputDevices.audio}</p>
      </div>
    );
  }
};

export default UserInfo;
