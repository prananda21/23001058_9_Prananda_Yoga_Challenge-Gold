const { formatResponse } = require("../response.js");
const usersData = require("../db/db_users.json");
const fs = require("fs");
const bcrypt = require("bcrypt");
const generateDate = require("../helper/generateDate.js");
const { error } = require("console");

class BasicUserController {
  static getAllUsers(_, res) {
    const filterData = usersData.map((i) => ({
      id: i.id,
      firstName: i.firstName,
      lastName: i.lastName,
      email: i.email,
      phone_number: i.phone_number,
      address: i.address,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
    }));
    return res.status(200).json(formatResponse(filterData));
  }

  static getUserById(req, res) {
    let id = +req.params.id;
    let statusCode = 200;
    let message = undefined;
    let isFound = false;
    let userData = {};
    const user = usersData.find((i) => i.id === id);

    if (user) {
      userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      isFound = true;
    }

    if (!isFound) {
      statusCode = 404;
      message = `User with id ${id} not found!`;
    }

    return res.status(statusCode).json(formatResponse(userData, message));
  }
}

class RegisterController {
  static postRegisterUser(req, res) {
    const { firstName, lastName, email, phone_number, address, password } =
      req.body;

    let statusCode = 201;
    let message = undefined;

    const foundEmail = usersData.find((i) => i.email === email);
    const foundPhone = usersData.find((i) => i.phone_number === phone_number);

    if (!foundEmail && !foundPhone) {
      const saltRounds = 10;
      let hash = bcrypt.hashSync(password, saltRounds);
      const dataPush = {
        id: usersData.length + 1,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone_number: phone_number,
        address: address,
        createdAt: generateDate(),
        updatedAt: generateDate(),
        password: hash,
        authToken: null,
      };

      const data = {
        id: usersData.length + 1,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone_number: phone_number,
        address: address,
        createdAt: generateDate(),
        updatedAt: generateDate(),
      };

      usersData.push(dataPush);
      fs.writeFileSync(
        "./db/db_users.json",
        JSON.stringify(usersData),
        "utf-8"
      );

      return res.status(statusCode).json(formatResponse(data));
    } else {
      statusCode = 404;
      if (foundEmail) {
        message = `User with email ${email} already exist, try with different email`;
      } else if (foundPhone) {
        message = `User with phone number ${phone_number} already exist, try with different phone number`;
      }
      return res.status(statusCode).json(formatResponse(null, message));
    }
  }
}

class LoginController {
  static async postLoginUser(req, res) {
    const { email, password } = req.body;
    const userEmail = usersData.find((i) => i.email === email);
    const data = {
      id: userEmail?.id,
      firstName: userEmail?.firstName,
      lastName: userEmail?.lastName,
      email: userEmail?.email,
      phone_number: userEmail?.phone_number,
      address: userEmail?.address,
      createdAt: userEmail?.createdAt,
      updatedAt: userEmail?.updatedAt,
      password: userEmail?.password,
      authToken: null,
    };

    if (userEmail === undefined) {
      return res
        .status(400)
        .json({ error: "Bad request: Missing body request!" });
    } else if (!userEmail) {
      return res.json(
        formatResponse(null, `User with email ${email} not found!`)
      );
    }

    let authToken;
    let userDataToken;

    const userPassword = bcrypt.compareSync(password, userEmail.password);
    if (userPassword) {
      authToken = `${email}-${Date.now()}`;
      userDataToken = Object.assign(data, {
        authToken: authToken,
      });
    } else {
      return res.json(formatResponse(null, "Incorrect password!"));
    }

    for (const i in usersData) {
      if (usersData[i].email === email) {
        usersData[i] = userDataToken;
        break;
      }
    }

    fs.writeFileSync("./db/db_users.json", JSON.stringify(usersData), "utf-8");

    try {
      return res.json(
        formatResponse(
          { authToken },
          `Welcome, ${data.firstName} ${data.lastName}`
        )
      );
    } catch (error) {
      return res.json(formatResponse(null, error));
    }
  }

  static deleteLogoutUser(req, res) {
    let { authToken } = req.body;
    const userToken = usersData.find((i) => i.authToken === authToken);
    let statusCode = 200;
    let message = "Log out Successfully";

    if (!userToken) {
      statusCode = 404;
      message = "Login Action Needed!";
      return res.status(statusCode).json(formatResponse(null, message));
    }

    for (const i in usersData) {
      if (userToken.id === usersData[i].id) {
        usersData[i].authToken = null;
        break;
      }
    }

    fs.writeFileSync("./db/db_users.json", JSON.stringify(usersData), "utf-8");
    return res.status(statusCode).json(formatResponse(null, message));
  }
}

module.exports = { BasicUserController, RegisterController, LoginController };
