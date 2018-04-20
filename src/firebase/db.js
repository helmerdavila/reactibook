import { db } from './firebase';

export const saveUserData = (userId, email) => {
  return db.ref(`users/${userId}`).set({
    email,
  });
};

export const createPost = (uid, email, imageUrl, body, createdAt, isPublic = false) => {
  const postData = {
    uid,
    author: email,
    imageUrl,
    body,
    createdAt,
    isPublic,
  };

  const postIdKey = db.ref().child('posts').push().key;

  const updates = {};
  updates['/posts/' + postIdKey] = postData;
  updates['/user-posts/' + uid + '/' + postIdKey] = postData;

  return db.ref().update(updates);
};

export const getPosts = () => {
  return db.ref('posts').orderByChild('timestamp').once('value');
};

export const getPost = (postId) => {
  return db.ref(`posts/${postId}`).once('value');
};

export const deletePost = (postId, userId) => {
  return Promise.all([
    db.ref(`posts/${postId}`).remove(),
    db.ref(`user-posts/${userId}/${postId}`).remove()
  ]);
};

export const updatePost = (post, body) => {
  const postData = {
    uid: post['uid'],
    author: post['author'],
    imageUrl: post['imageUrl'],
    body,
    createdAt: post['createdAt'],
    isPublic: post['isPublic'],
  };
  const updates = {};
  updates['/posts/' + post['id']] = postData;
  updates['/user-posts/' + post['uid'] + '/' + post['id']] = postData;

  return db.ref().update(updates);
};