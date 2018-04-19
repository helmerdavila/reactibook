import React from "react";
import { connect } from "react-redux";
import * as moment from "moment";

class ReactibookPost extends React.Component {
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

    const buttons = isAuthUserPost ? (
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <button className="button is-light">Editar</button>
          </div>
          <div className="level-item">
            <button onClick={() => this.props.deletePost(post['id'])} className="button is-light">Eliminar</button>
          </div>
        </div>
      </div>
    ) : null;

    return (
      <div className="card card-post">
        <div className="card-content">
          <article className="media">
            <div className="media-content">
              {image}
              <div className="content">
                <p>
                  <strong>{post["author"]}</strong> <small>{timeAgo}</small>
                  <br />
                  {post["body"]}
                </p>
              </div>
              {buttons}
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