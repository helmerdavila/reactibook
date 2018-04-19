import React, { Fragment } from "react";
import "../scss/feed.css";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { connect } from "react-redux";
import { auth } from "../firebase";

class ReactibookFeed extends React.Component {
  state = {
    isEmojiSelectorActive: false,
    postText: "",
  };

  addEmoji = emoji => {
    let text = this.state.postText;
    text = `${text}${emoji.native}`;
    this.setState({ postText: text });
  };

  toggleEmoji = () => {
    const selector = this.state.isEmojiSelectorActive;

    this.setState({ isEmojiSelectorActive: !selector });
  };

  typeText = event => {
    const text = event.target.value;

    this.setState({ postText: text });
  };

  handlePublish = () => {
    console.table(this.props);
  };

  handleLogout = () => {
    return auth.signOut().then(() => {
      this.props.changeUserState(null);
      return this.props.history.replace('/');
    })
  };

  componentDidMount() {
    console.log('entro aca la wea');
  }

  render() {
    const email = this.props.authUser !== null ? this.props.authUser['email'] : null;

    const posts = [1, 2, 3, 4, 5].map(post => {
      let image;
      if (post % 2 === 0) {
        image = (
          <figure className="image is-square">
            <img src="http://placekitten.com/g/200" alt="" />
          </figure>
        );
      }

      return (
        <div key={post} className="card card-post">
          <div className="card-content">
            <article className="media">
              <div className="media-content">
                {image}
                <div className="content">
                  <p>
                    <strong>John Smith</strong> <small>@johnsmith</small>{" "}
                    <small>31m</small>
                    <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin ornare magna eros, eu pellentesque tortor vestibulum
                    ut. Maecenas non massa sem. Etiam finibus odio quis feugiat
                    facilisis.
                  </p>
                </div>
                <div className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <button className="button is-light">Editar</button>
                    </div>
                    <div className="level-item">
                      <button className="button is-light">Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      );
    });

    const emojiSelectorStyles = this.state.isEmojiSelectorActive
      ? { width: 338, position: "absolute", top: "2.2em", left: 0, zIndex: 10 }
      : { display: "none" };

    return (
      <Fragment>
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
                  <span>{email}</span>
                </a>
                <div className="navbar-dropdown is-boxed">
                  <a onClick={this.handleLogout} className="navbar-item">
                    Cerrar sesión
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <section className="section feed-section">
          <div className="card">
            <div className="card-content">
              <div className="field">
                <div className="control">
                  <textarea
                    className="textarea"
                    placeholder="¿Qué está pasando?"
                    value={this.state.postText}
                    onChange={this.typeText}
                  />
                </div>
              </div>
              <div className="field is-grouped is-grouped-right">
                <div className="control">
                  <button className="button" onClick={this.toggleEmoji}>
                    <span className="icon">
                      <i className="fas fa-fw fa-smile" />
                    </span>
                  </button>
                  <Picker
                    title="Selecciona emoji"
                    onSelect={this.addEmoji}
                    style={emojiSelectorStyles}
                  />
                </div>
                <div className="control has-icons-left">
                  <div className="select">
                    <select>
                      <option>Amigos</option>
                      <option>Público</option>
                    </select>
                  </div>
                  <div className="icon is-small is-left">
                    <i className="fas fa-fw fa-unlock-alt"></i>
                  </div>
                </div>
                <div className="control">
                  <button className="button is-link" onClick={this.handlePublish}>Publicar</button>
                </div>
              </div>
            </div>
          </div>
          {posts}
        </section>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReactibookFeed);
