import { db } from './firebase';

export const saveUserData = (userId, email) => {
  return db.ref(`users/${userId}`).set({
    email,
  });
};

export const createPost = (uid, email, body, createdAt, isPublic = false) => {
  // A post entry.
  const postData = {
    uid,
    author: email,
    body,
    createdAt,
    isPublic,
  };

  // Get a key for a new Post.
  const postIdKey = db.ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates['/posts/' + postIdKey] = postData;
  updates['/user-posts/' + uid + '/' + postIdKey] = postData;

  return db.ref().update(updates);
};

export const getPosts = () => {
  return db.ref('posts').orderByChild('timestamp').once('value');
};

export const deletePost = (postId) => {
  return db.ref(`posts/${postId}`).remove();
}