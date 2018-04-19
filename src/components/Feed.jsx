import React from "react";
import "../scss/feed.css";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { connect } from "react-redux";
import { auth, db } from "../firebase";
import { Redirect } from "react-router-dom";
import * as moment from "moment";
import Navbar from "./Navbar";
import Post from "./Post";

class ReactibookFeed extends React.Component {
  state = {
    isEmojiSelectorActive: false,
    postText: "",
    isPublic: false,
    posts: [],
    styles: {
      showEmojiPanel: { width: 338, position: "absolute", top: "2.2em", left: 0, zIndex: 10 },
      hideEmojiPanel: { display: "none" },
    }
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

  handleChangePrivacy = event => {
    const selected = event.target.value;

    if (selected === "0") {
      this.setState({ isPublic: false });
    } else if (selected === "1") {
      this.setState({ isPublic: true });
    }
  };

  handlePublish = () => {
    const { email, uid } = this.props.authUser;
    const content = this.state.postText;
    const isPublic = this.state.isPublic;
    const createdAt = moment().format("x");
    db.createPost(uid, email, content, createdAt, isPublic).then(() => {
      this.setState({ postText: "" });
      this.getPosts();
    });
  };

  handleLogout = () => {
    return auth.signOut().then(() => {
      this.props.changeUserState(null);
      return this.setState({ posts: [] });
    });
  };

  handleDeletePost = (postId) => {
    const result = window.confirm("¿Borrar el post?");
    if (result) {
      return db.deletePost(postId).then(() => this.getPosts());
    }
  };

  getPosts = () => {
    return db.getPosts().then(snapshot => {
      const postObject = snapshot.val();
      const posts = Object.keys(postObject).map(postId => {
        return {
          id: postId,
          ...postObject[postId]
        };
      });
      this.setState({ posts });
    });
  };

  componentDidMount() {
    this.getPosts();
  }

  render() {
    const email = this.props.authUser !== null ? this.props.authUser["email"] : null;

    if (email === null) {
      return <Redirect to="/"/>
    }

    const posts = this.state.posts.map(post => <Post key={post["id"]} post={post} deletePost={this.handleDeletePost}/>);

    const emojiSelectorStyles = this.state.isEmojiSelectorActive ? this.state.styles.showEmojiPanel : this.state.styles.hideEmojiPanel;

    return (
      <div className="the-feed">
        <Navbar authEmail={email} logout={this.handleLogout}/>
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
                      <i className="far fa-fw fa-smile" />
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
                    <select onChange={this.handleChangePrivacy}>
                      <option value="0">Amigos</option>
                      <option value="1">Público</option>
                    </select>
                  </div>
                  <div className="icon is-small is-left">
                    <i className="fas fa-fw fa-unlock-alt" />
                  </div>
                </div>
                <div className="control">
                  <button
                    className="button is-link"
                    onClick={this.handlePublish}
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>
          {posts}
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authUser: state.sessionState.authUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeUserState: authUser => dispatch({ type: "AUTH_USER_SET", authUser })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReactibookFeed);
