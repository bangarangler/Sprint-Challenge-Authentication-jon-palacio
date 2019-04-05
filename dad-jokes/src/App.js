import React, { Component } from "react";
import { Route, Link, withRouter } from "react-router-dom";
//import axios from "axios";
import Signup from "./components/Signup/Signup.js";
import Login from "./components/Login/Login.js";
import Users from "./components/Users/Users.js";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Login or Signup!</h1>
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Route
            path="/signup"
            render={props => {
              return <Signup {...props} />;
            }}
          />
          <Route
            path="/login"
            render={props => {
              return <Login {...props} />;
            }}
          />
          <Route
            path="/users"
            render={props => {
              return <Users {...props} logout={this.logout} />;
            }}
          />
        </main>
      </div>
    );
  }

  logout = () => {
    localStorage.removeItem("tokenKey");
    this.props.history.push("/");
  };
}

export default withRouter(App);
