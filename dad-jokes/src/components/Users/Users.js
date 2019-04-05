import React from "react";
import axios from "axios";

class Users extends React.Component {
  state = {
    jokes: []
  };
  render() {
    return (
      <>
        <h2>Here are your jokes!</h2>
        <ul>
          {this.state.jokes.map(j => (
            <React.Fragment key={j.id}>
              <li>{j.joke}</li>
            </React.Fragment>
          ))}
        </ul>
      </>
    );
  }

  componentDidMount() {
    const jokeEndpoint = `http://localhost:5000/api/jokes`;
    const token = localStorage.getItem("tokenKey");
    const requestConfig = {
      headers: {
        authorization: token
      }
    };
    axios
      .get(jokeEndpoint, requestConfig)
      .then(res => {
        console.log(res);
        this.setState({ jokes: res.data });
      })
      .catch(err => {
        console.error(`JOKE ERROR`, err);
      });
  }
}

export default Users;
