import { storage } from "./firebase";

export const uploadImage = (image, name = "") => {
  const storageRef = storage.ref();
  const unixTime =  Math.round(+new Date()/1000);
  const hash = `_${unixTime.toString()}_${Math.floor(Math.random() * (999999999 - 100000000)) + 100000000}`;
  name = `${name}${hash}`;

  return storageRef.child(`images/${name}`).put(image);
};