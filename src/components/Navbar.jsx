import React from "react";

const Navbar = props => {
  return (
    <nav className="navbar is-fixed-top is-link">
      <div className="navbar-brand">
        <a className="navbar-item is-uppercase">Reactibook</a>
      </div>
      <div className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">
              <span className="icon">
                <i className="fas fa-fw fa-user" />
              </span>
              <span>{props.authEmail}</span>
            </a>
            <div className="navbar-dropdown is-boxed">
              <a onClick={props.logout} className="navbar-item">
                Cerrar sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
