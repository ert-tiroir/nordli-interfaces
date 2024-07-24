import { ProtoMap } from "./protomap.ts";

function deepCopy (object) {
  if (Object.keys(object).length == 0) return object;
  
  let res = {};
  for (let x of Object.keys(object))
    res[x] = deepCopy( object[x] );

  return res;
}
globalThis.rocket = deepCopy(_rocket);
rocket.subscribe = (key, callback) => {
  return _rocket.subscribe(key, ProtoMap.wrapReceiver(callback));
};

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./renderer/App.tsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
