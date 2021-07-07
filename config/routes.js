const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../config/secrets.js").jwtSecret;

const db = require("../database/dbConfig.js");

const { authenticate } = require("../auth/authenticate");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
};

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "10m"
  };
  return jwt.sign(payload, secret, options);
}

async function register(req, res) {
  // implement user registration
  const regData = req.body;
  if (!regData.username || !regData.password) {
    res.status(400).json({ message: `Must provide all Info.  Bad Request` });
  }
  try {
    const cantHaveName = await db("users")
      .where({ username: regData.username })
      .first();
    if (cantHaveName) {
      res
        .status(401)
        .json({ message: `Username is already spoken for! Try again` });
    }
  } catch (err) {
    res.status(500).json({ message: `Internal Error, ${err}` });
  }
  const hash = bcrypt.hashSync(regData.password, 8);
  regData.password = hash;
  try {
    const userID = await db("users").insert(regData);
    const token = generateToken(userID);
    res.status(201).json({ userID, token });
  } catch (err) {
    res.status(500).json({ message: `Internal Error, ${err}` });
  }
}

async function login(req, res) {
  // implement user login
  const logData = req.body;
  if (!logData.username || !logData.password) {
    res
      .status(400)
      .json({ message: `must provide username and password, Bad Request` });
  }
  try {
    const user = await db("users")
      .where({ username: logData.username })
      .first();
    if (user && bcrypt.compareSync(logData.password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ message: `Welcome ${user.username}`, token });
    } else {
      res.status(401).json({ message: `You shall not pass` });
    }
  } catch (err) {
    res.status(500).json({ message: `Internal Error, ${err}` });
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: "application/json" }
  };

  axios
    .get("https://icanhazdadjoke.com/search", requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}
