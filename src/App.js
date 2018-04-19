import React, { Component, Fragment } from 'react';
import './App.css';
//import ReactibookLogin from "./components/Login";
import ReactibookFeed from "./components/Feed";

class App extends Component {
  render() {
    return (
      <Fragment>  
        {/* <ReactibookLogin/> */}
        <ReactibookFeed/>
      </Fragment>  
    );
  }
}

export default App;
