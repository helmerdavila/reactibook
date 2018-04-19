import { auth } from "./firebase";

export const loginWithEmailAndPassword = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const signOut = () => auth.signOut();