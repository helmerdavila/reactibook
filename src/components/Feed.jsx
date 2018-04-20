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
    postsOriginal: [],
    styles: {
      showEmojiPanel: { width: 338, position: "absolute", top: "2.2em", left: 0, zIndex: 10 },
      hideEmojiPanel: { display: "none" },
    },
    activePostsToggle: 1,
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
      return db.deletePost(postId, this.props.authUser['uid']).then(() => this.getPosts());
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
      this.setState({ posts, postsOriginal: posts });
    });
  };

  filterPosts = number => {
    let posts = this.state.postsOriginal;
    switch (number) {
      case 2:
        posts = posts.filter(post => post['isPublic'] && post['uid'] === this.props.authUser['uid']);
        break;
      case 3:
        posts = posts.filter(post => post['isPublic'] === false && post['uid'] === this.props.authUser['uid']);
        break;
    }
    this.setState({ posts, activePostsToggle: number });
  };

  componentDidMount() {
    this.getPosts();
  }

  render() {
    const email = this.props.authUser !== null ? this.props.authUser["email"] : null;

    if (email === null) {
      return <Redirect to="/"/>
    }

    const emojiSelectorStyles = this.state.isEmojiSelectorActive ? this.state.styles.showEmojiPanel : this.state.styles.hideEmojiPanel;

    const posts = this.state.posts.map(post => (
      <Post key={post["id"]}
            post={post}
            styles={this.state.styles}
            deletePost={this.handleDeletePost}/>
    )).reverse();

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
                    disabled={this.state.postText.length === 0}
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="tabs is-fullwidth">
            <ul>
              <li className={this.state.activePostsToggle === 1 ? 'is-active' : null}>
                <a onClick={() => this.filterPosts(1)}>
                  <span className="icon is-small">
                    <i className="fas fa-fw fa-rss-square"/>
                  </span>
                  <span>Todos</span>
                </a>
              </li>
              <li className={this.state.activePostsToggle === 2 ? 'is-active' : null}>
                <a onClick={() => this.filterPosts(2)}>
                  <span className="icon is-small">
                    <i className="fas fa-fw fa-globe"/>
                  </span>
                  <span>Públicos</span>
                </a>
              </li>
              <li className={this.state.activePostsToggle === 3 ? 'is-active' : null}>
                <a onClick={() => this.filterPosts(3)}>
                  <span className="icon is-small">
                    <i className="fas fa-fw fa-users"/>
                  </span>
                  <span>Amigos</span>
                </a>
              </li>
            </ul>
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
