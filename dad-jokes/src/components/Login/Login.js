import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="username" />
          <input
            type="text"
            placeholder="Enter Username..."
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password" />
          <input
            type="password"
            placeholder="Enter Password..."
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    );
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const loginEndpoint = `http://localhost:5000/api/login`;
    axios
      .post(loginEndpoint, this.state)
      .then(res => {
        console.log(res);
        localStorage.setItem("tokenKey", res.data.token);
        this.setState({ username: "", password: "" });
        this.props.history.push("/users");
      })
      .catch(err => {
        console.error(`LOGIN ERROR ${err}`);
      });
  };
}

export default Login;
