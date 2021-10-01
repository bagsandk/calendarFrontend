import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import AuthProvider from "./Context/Auth";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Routes from "./Routes";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  credentials: "include",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
