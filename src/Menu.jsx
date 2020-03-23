import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Menu extends Component {
  constructor() {
    super();
    this.state = {
      home: true,
      capture: false,
      user: false
    };
  }

  componentDidMount() {
    let currentRoute = window.location.pathname.split('/')[1] ? window.location.pathname.split('/')[1] : 'home';
    this.changeActive(currentRoute);
  }

  changeActive = (changing) => {
    let change = {
      home: false,
      capture: false,
      user: false
    };
    change[changing] = true;
    this.setState(change);
  };

  render() {
    const { home, capture, user } = this.state;
    return (
      <>
        <div className="header">
          <div className="header-logo">
            <Link to='/' className="logo" onClick={() => this.changeActive('home')}><span>A</span>ndrew<span>T</span>ube</Link>
          </div>
        </div>
        <div className="sidebar">
          <ul>

            <Link to='/' onClick={() => this.changeActive('home')}>
              <li>
                <p className={home ? 'menu-active' : ''}>
                  <i className="fas fa-home"></i>
                </p>
              </li>
            </Link>

            <Link to='/videoCapture' onClick={() => this.changeActive('capture')}>
              <li>
                <p className={capture ? 'menu-active' : ''}>
                  <i className="fas fa-video"></i>
                </p>
              </li>
            </Link>

            <Link to='/user' onClick={() => this.changeActive('user')}>
              <li>
                <p className={user ? 'menu-active' : ''}>
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
