import React, { Component, Fragment } from "react";
import "./App.css";
import ReactibookLogin from "./components/Login";
import ReactibookFeed from "./components/Feed";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Fragment>
        <Router>
          <Fragment>
            <Route exact path="/" component={ReactibookLogin} />
            <Route exact path="/feed" component={ReactibookFeed} />
          </Fragment>
        </Router>
      </Fragment>
    );
  }
}

export default App;
