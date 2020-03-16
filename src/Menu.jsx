import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Menu extends Component {
  render() {
    return (
      <>
        <div className="header">
          <div className="header-logo">
            <Link to='/' className="logo"><span>A</span>ndrew<span>T</span>ube</Link>
          </div>
        </div>
        <div className="sidebar">
          <ul>

            <Link to='/'>
              <li>
                <p>
                  <i className="fas fa-home"></i>
                </p>
              </li>
            </Link>

            <Link to='/videoCapture'>
              <li>
                <p>
                  <i className="fas fa-video"></i>
                </p>
              </li>
            </Link>

            <Link to='/user'>
              <li>
                <p>
                  <i className="fas fa-user"></i>
                </p>
              </li>
            </Link>

          </ul>
        </div>
      </>
    );
  }
};

export default Menu;
