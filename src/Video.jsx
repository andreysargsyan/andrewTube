import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Video extends Component { // TODO get descripition, author, photo from props

  render() {
    const { author, link, title } = this.props;
    return (
      <div className="video-row" onClick={this.getVideo}>
        <div className="video-col">
          <Link to={`/videos/${author}/${link}`}>
            <div className="video-img">
              {/* https://images.pexels.com/photos/3415401/pexels-photo-3415401.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940 */}
              <img src="https://u.kanobu.ru/editor/images/15/3b859f4a-b08a-4beb-969e-c871e25c9fe7.jpg" alt="" /> {/*TODO add an image from video */}
              <i className="fas fa-play play-hover"></i>
            </div>
            <div className="video-desc">
              <div className="video-desc-text">{title}</div>
            </div>
              <div className='video-author'>
                <b>
                  {author}
              </b>
              </div>
          </Link>
        </div>
        </div>
    );
  }
};

export default Video;
