import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ReactibookApp from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <ReactibookApp />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
