import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="894244013404-shsv1ml0rgs7f5lqtgk6smksm6br8p0t.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
