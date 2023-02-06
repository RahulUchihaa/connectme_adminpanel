import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import { MantineProvider } from "@mantine/core"; //for import mantine required functions and theme
import { ModalsProvider } from "@mantine/modals";

const root = ReactDOM.createRoot(document.getElementById("root"));
const history = createBrowserHistory({ window });
root.render(
  <React.StrictMode>
    <HashRouter history={history}>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </MantineProvider>
    </HashRouter>
  </React.StrictMode>
);
