import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.scss";
import logoImg from "./content/logo.png";

const root = createRoot(document.getElementById("root"));
root.render(
  <div>
    <h1 className="hello-world">Hello from React DOM</h1>
    <img src={logoImg} alt="Logo" />
  </div>
);