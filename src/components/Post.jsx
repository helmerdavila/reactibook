import React, { Fragment } from "react";
import { Picker } from "emoji-mart";
import { connect } from "react-redux";
import * as moment from "moment";
import { db } from '../firebase';

class ReactibookPost extends React.Component {
  state = {
    editing: false,
    postId: "",
    postText: "",
    isEmojiSelectorActive: false,
    postUpdatedText: "",
  };

  toggleEmojiPanel = () => this.setState({ isEmojiSelectorActive: !this.state.isEmojiSelectorActive });

  toggleEditing = () => this.setState({ editing: !this.state.editing });

  addEmoji = emoji => {
    let text = this.state.postText;
    text = `${text}${emoji.native}`;
    this.setState({ postText: text, isEmojiSelectorActive: false });
  };

  updateBody = event => this.setState({ postText: event.target.value });

  updatePost = () => {
    db.updatePost(this.props['post'], this.state.postText)
      .then(() => {
        this.setState({ postUpdatedText: "Post actualizado", editing: false });
        this.getPost();
      });
  };

  getPost = () => {
    db.getPost(this.state.postId).then(snapshot => {
      const post = snapshot.val();
      this.setState({ postText: post['body'] });
    });
  };

  componentDidMount() {
    this.setState({ postText: this.props['post']['body'], postId: this.props['post']['id'] });
  }

  render() {
    const post = this.props['post'];
    let timeAgo;
    let image;
    let isAuthUserPost = post['uid'] === this.props.authUser['uid'];

    if (post["image"]) {
      image = (
        <figure className="image is-square">
          <img src="http://placekitten.com/g/200" alt="" />
        </figure>
      );
    }

    if (post["createdAt"]) {
      timeAgo = moment(parseInt(post["createdAt"], 10)).fromNow();
    }

    const successMessage = this.state.postUpdatedText.length ? (
      <div className="message is-success">
        <div className="message-body">
          {this.state.postUpdatedText}
        </div>
      </div>
    ) : null;

    const buttons = isAuthUserPost ? (
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <button onClick={this.toggleEditing} className="button is-light">Editar</button>
          </div>
          <div className="level-item">
            <button onClick={() => this.props.deletePost(post['id'])} className="button is-light">Eliminar</button>
          </div>
        </div>
      </div>
    ) : null;

    const emojiSelectorStyles = this.state.isEmojiSelectorActive ? this.props.styles.showEmojiPanel : this.props.styles.hideEmojiPanel;

    const editFormOrPost = this.state.editing ? (
      <Fragment>
        <div className="field">
          <div className="control">
            <textarea onChange={this.updateBody} value={this.state.postText} className="textarea"/>
          </div>
        </div>
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <button className="button" onClick={this.toggleEmojiPanel}>
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
            <div className="level-item">
              <button onClick={this.updatePost} className="button is-link">Guardar</button>
            </div>
            <div className="level-item">
              <button onClick={this.toggleEditing} className="button">Cancelar</button>
            </div>
          </div>
        </div>
      </Fragment>
    ) : (
      <Fragment>
        {image}
        <div className="content">
          <p>
            <strong>{post["author"]}</strong> <small>{timeAgo}</small>
            <br />
            {this.state.postText}
          </p>
        </div>
        {buttons}
      </Fragment>
    );

    return (
      <div className="card card-post">
        <div className="card-content">
          {successMessage}
          <article className="media">
            <div className="media-content">
              {editFormOrPost}
            </div>
          </article>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authUser: state.sessionState.authUser
  };
};

export default connect(mapStateToProps)(ReactibookPost);