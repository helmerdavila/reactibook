import React, { Component, Fragment } from "react";
import "./App.css";
import ReactibookLogin from "./components/Login";
import ReactibookFeed from "./components/Feed";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { firebase } from "./firebase";

const PrivateRoute = ({ email, component: Component, ...rest }) => {
  const isAuth = !!email;

  return (
    <Route
      {...rest}
      render={props =>
        isAuth ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

class App extends Component {
  state = {
    userEmail: "",
  };

  componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.props.changeUserState(authUser);
        this.setState({ userEmail: authUser['email'] });
      } else {
        this.props.changeUserState(null);
        this.setState({ userEmail: "" });
      }
    });
  }

  render() {
    const email = this.state.userEmail.length ? this.state.userEmail : null;

    return (
      <Fragment>
        <Router>
          <Fragment>
            {/*<Route exact path="/" render={() => <ReactibookLogin email={email}/>} />*/}
            <Route exact path="/" component={ReactibookLogin} />
            <PrivateRoute path="/feed" email={email} component={ReactibookFeed} />
          </Fragment>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    authUser: state.sessionState.authUser,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    changeUserState: authUser => dispatch({type: 'AUTH_USER_SET', authUser}),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
