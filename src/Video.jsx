import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Video extends Component { // TODO get descripition, author, photo from props

  render() {
    return (
      <div className="video-row" onClick={this.getVideo}>
        <div className="video-col">
          <Link to='/videos/andrew/1584881333977'>
            <div className="video-img">
            {/* https://images.pexels.com/photos/3415401/pexels-photo-3415401.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940 */}
              <img src="https://u.kanobu.ru/editor/images/15/3b859f4a-b08a-4beb-969e-c871e25c9fe7.jpg" alt="" />
              <i className="fas fa-play play-hover"></i>
            </div>
            <div className="video-desc">
              <div className="video-desc-text">AndrewTube AndrewTube AndrewTube AndrewTube AndrewTube AndrewTube AndrewTube</div>
            </div>
            <div className='video-author'>
              <b>
                Vanik Pukhoyan
              </b>
            </div>
          </Link>
        </div>
      </div>
    );
  }
};

export default Video;
