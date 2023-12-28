const { formatResponse } = require("../response.js");
const usersData = require("../db/db_users.json");
const fs = require("fs");
const bcrypt = require("bcrypt");

class BasicUserController {
  static getAllUsers(req, res) {
    return res.status(200).json(formatResponse(usersData));
  }

  static getUserById(req, res) {
    let id = +req.params.id;
    let statusCode = 200;
    let message = undefined;
    const user = usersData.find((i) => i.id === id);

    if (user === undefined) {
      statusCode = 404;
      message = `User with id ${id} not found!`;
    }

    return res.status(statusCode).json(formatResponse(user, message));
  }
}

class registerController {
  static async postRegisterUser(req, res) {
    let { name, email, password } = req.body;
    let id = usersData[usersData.length - 1].id + 1;
    let statusCode = 201;
    let message = undefined;
    let usersData = [];

    const data = {
      id: id,
      name: name,
      email: email,
      password: password,
    };

    const foundName = usersData.find((i) => i.name === name);
    const foundEmail = usersData.find((i) => i.email === email);

    if (!foundName && !foundEmail) {
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed password", hash);
          const data = {
            id: id,
            name: name,
            email: email,
            password: hash,
          };
          usersData.push(data);
          fs.writeFileSync(
            "./db/db_users.json",
            JSON.stringify(usersData),
            "utf-8"
          );
        }
      });
    } else {
      if (foundName) {
        statusCode = 404;
        message = `User with name ${name} already exist, try with different name`;
        res.status(statusCode).json(formatResponse(null, message));
      } else if (foundEmail) {
        statusCode = 404;
        message = `User with email ${email} already exist, try with different email`;
        return res.status(statusCode).json(formatResponse(null, message));
      }
    }

    return res.status(statusCode).json(formatResponse(data));
  }
}

class loginController {
  static postLoginUser(req, res) {
    let { email, password } = req.body;
    const userEmail = usersData.find((i) => i.email === email);
    const userPassword = usersData.find((i) => i.password === password);

    if (!email || !password) {
      return res.status(400).json({ message: "Missing Email or Password!" });
    }

    if (!userEmail) {
      return res.status(401).json({ message: "Invalid Email!" });
    }
    if (!userPassword) {
      return res.status(401).json({ message: "Invalid Password!" });
    }

    const userData = {
      id: userEmail.id,
      email: userEmail.email,
      name: userEmail.name,
      password: userEmail.password,
    };
    const authToken = `${email}-${Date.now()}`;
    const userDataToken = Object.assign(userData, { authToken: authToken });

    for (const i in usersData) {
      if (usersData[i].email === userEmail.email) {
        usersData[i] = userDataToken;
      }
    }

    fs.writeFileSync("./db/db_users.json", JSON.stringify(usersData), "utf-8");
    return res.json(formatResponse({ authToken }, `Welcome, ${userData.name}`));
  }

  static deleteLogoutUser(req, res) {
    const userToken = usersData.find((i) => i.authToken);
    let statusCode = 200;
    let message = "Log out Successfully";

    for (const i in usersData) {
      if (userToken) {
        delete usersData[i].authToken;
      } else {
        statusCode = 404;
        message = "Login Action Needed!";
      }
    }

    fs.writeFileSync("./db/db_users.json", JSON.stringify(usersData), "utf-8");
    return res.status(statusCode).json(formatResponse(null, message));
  }
}

module.exports = { BasicUserController, registerController, loginController };
