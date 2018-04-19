import React, { Component, Fragment } from "react";
import "./App.css";
import ReactibookLogin from "./components/Login";
import ReactibookFeed from "./components/Feed";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

const FeedRoute = () => {
  const isAuth = false;

  return (
    <Route
      exact
      path="/feed"
      render={props => {
        return isAuth ? (
          <ReactibookFeed {...props}/>
        ) : (
          <Redirect to={{ pathname: "/", from: props.location }} />
        );
      }}
    />
  );
};

class App extends Component {
  render() {
    return (
      <Fragment>
        <Router>
          <Fragment>
            <Route exact path="/" component={ReactibookLogin} />
            <FeedRoute />
          </Fragment>
        </Router>
      </Fragment>
    );
  }
}

export default App;
