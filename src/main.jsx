import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
//import { AuthProvider } from "./Context/authContext.jsx";
import { BrowserRouter } from "react-router-dom";

console.log(import.meta.env);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
