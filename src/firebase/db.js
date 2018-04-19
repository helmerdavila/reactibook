import { db } from './firebase';

export const saveUserData = (userId, email) => {
  return db.ref(`users/${userId}`).set({
    email,
  });
};