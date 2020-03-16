import React from 'react';
import './index.css';
import Menu from './Menu';
import Home from './Home';
import VideoCapture from './VideoCapture';
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Menu />
      <div className="content">
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/videoCapture" component={VideoCapture} exact />
          {/* <Route path="/shop" component={Shop} exact /> */}
        </Switch>
      </div>
    </>
  );
}

export default App;
