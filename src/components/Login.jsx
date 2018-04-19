import React from "react";
import "../scss/login.css";
import { auth } from "../firebase/index";
import { Redirect } from "react-router-dom";

class ReactibookLogin extends React.Component {
  state = {
    email: "",
    password: "",
    errorMessage: "",
    successAuth: false,
  };

  handleSubmit = event => {
    event.preventDefault();
    auth
      .loginWithEmailAndPassword(this.state.email, this.state.password)
      .then(authUser => {
        console.log(authUser);
        if (authUser) {
          this.setState({ successAuth: true });
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

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    if (this.state.successAuth) {
      return <Redirect to={from} />
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

export default ReactibookLogin;
