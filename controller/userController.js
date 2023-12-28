const { formatResponse } = require("../response.js");
const usersData = require("../db/db_users.json");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { nanoid, customAlphabet } = require("nanoid");
const { log } = require("console");

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
    const usersData = require("../db/db_users.json");
    let { name, email, password } = req.body;
    const existingId = [];
    const data = {
      id: null,
      name: name,
      email: email,
      password: password,
    };

    function generateUserId() {
      fs.readFile(
        "../challenge-gold/db/db_users.json",
        "utf-8",
        (err, data) => {
          if (err) {
            console.log("Error reading db_users.json", err);
          }

          try {
            existingId.push(...usersData.map((data) => data.id));
          } catch (error) {
            console.log("Error parsing db_users.json", error);
          }
        }
      );

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const nanoid = customAlphabet("1234567890abcdef", 10);
          resolve((data.id = nanoid()));
        }, 100);
      });
    }

    let statusCode = 201;
    let message = undefined;

    const foundName = usersData.find((i) => i.name === name);
    const foundEmail = usersData.find((i) => i.email === email);

    if (!foundName && !foundEmail) {
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          generateUserId().then((id) => {
            id = id;
            console.log("Hashed password", hash);
            const dataPush = {
              id: id,
              name: name,
              email: email,
              password: hash,
            };

            const data = {
              id: id,
              name: name,
              email: email,
            };
            usersData.push(dataPush);
            fs.writeFileSync(
              "./db/db_users.json",
              JSON.stringify(usersData),
              "utf-8"
            );
            console.log(data);
            return res.status(statusCode).json(formatResponse(data));
          });
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
  }
}

class loginController {
  static postLoginUser(req, res) {
    let { email, password } = req.body;
    async function login(email, password) {
      const userEmail = usersData.find((i) => i.email === email);
      if (userEmail) {
        const data = {
          id: userEmail.id,
          email: userEmail.email,
          name: userEmail.name,
          password: userEmail.password,
        };
      } else {
        return false;
      }

      const userPassword = await bcrypt.compare(password, userEmail.password);
      if (userPassword) {
        const data = {
          id: userEmail.id,
          email: userEmail.email,
          name: userEmail.name,
          password: userEmail.password,
        };
        const authToken = `${email}-${Date.now()}`;
        const userDataToken = Object.assign(data, {
          authToken: authToken,
        });

        for (const i in usersData) {
          if (usersData[i].email === email) {
            usersData[i] = userDataToken;
          }
        }

        fs.writeFileSync(
          "./db/db_users.json",
          JSON.stringify(usersData),
          "utf-8"
        );
        return res.json(formatResponse({ authToken }, `Welcome, ${data.name}`));
      }
    }

    login(email, password)
      .then((isAuthenticated) => {
        if (isAuthenticated) {
          console.log;
          ("Login successfully");
        } else {
          console.log("Invalid username or password");
        }
      })
      .catch((error) => {
        console.error("Error during login", error);
      });
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
