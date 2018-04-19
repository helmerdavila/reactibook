import React from "react";
import "../scss/login.css";
import { auth, db } from "../firebase";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

class ReactibookLogin extends React.Component {
  state = {
    email: "",
    password: "",
    errorMessage: "",
    logged: false,
  };

  handleSubmit = event => {
    event.preventDefault();
    auth
      .loginWithEmailAndPassword(this.state.email, this.state.password)
      .then(authUser => {
        if (authUser) {
          this.props.onSuccessLogin(authUser);
          db.saveUserData(authUser['uid'], authUser['email'])
            .then(() => this.setState({ logged: true }));
        }
      })
      .catch(error => this.setState({ errorMessage: error["message"] }));
  };

  changeEmail = event => {
    this.setState({ email: event.target.value });
  };

  changePassword = event => {
    this.setState({ password: event.target.value });
  };

  componentDidUpdate() {
    if (this.props.authUser !== null) {
      this.setState({ logged: true });
    }
  }

  render() {
    if (this.state.logged === true) {
      return <Redirect to="/feed" />
    }

    const errorMessage = this.state.errorMessage.length ? (
      <article className="message is-danger">
        <div className="message-body">{this.state.errorMessage}</div>
      </article>
    ) : null;

    return (
      <div className="form-container">
        <div className="card">
          <div className="card-header">
            <h3 className="card-header-title is-centered">Reactibook</h3>
          </div>
          <div className="card-content">
            {errorMessage}
            <form className="login-form" onSubmit={this.handleSubmit}>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    onChange={this.changeEmail}
                    type="text"
                    className="input"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input
                    onChange={this.changePassword}
                    type="password"
                    className="input"
                  />
                </div>
              </div>
              <button type="submit" className="button is-link is-fullwidth">
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
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
    onSuccessLogin: authUser => dispatch({type: 'AUTH_USER_SET', authUser}),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReactibookLogin);
