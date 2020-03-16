import React, { Component } from 'react';

class Home extends Component { // TODO get descripition, author, photo from props
  render() {
    return (
      <>
        <div className="video-row">
          <div className="video-col">
            <div className="video-img">
              <img src="./lit.webp" alt="" />
              <i className="fas fa-play play-hover"></i>
            </div>
            <div className="video-desc">
              <div className="video-desc-text">ЛУЧШИЙ ПОДПИСЧИК ПОЕДЕТ СО МНОЙ В ДУБАЙ / СОЦИАЛЬНЫЙ ЭКСПЕРИМЕНТ !</div>
            </div>
            <div className='video-author'>
              <b>
                Vanik Pukhoyan
              </b>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Home;
