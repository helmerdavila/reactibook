import React from 'react';
import '../scss/login.css';

class ReactibookLogin extends React.Component {
  render() {
    return (
      <div className="form-container">
        <div className="card">
          <div className="card-header">
            <h3 className="card-header-title is-centered">Reactibook</h3>
          </div>
          <div className="card-content">
          <form className="login-form">
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input type="text" className="input"/>
              </div>
            </div>
            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input type="password" className="input"/>
              </div>
            </div>
            <button className="button is-link is-fullwidth">Iniciar sesión</button>
          </form>
          </div>
        </div>
      </div>
    );
  }
};

export default ReactibookLogin;