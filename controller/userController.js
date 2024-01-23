const bcrypt = require("bcrypt");
const { User } = require("../models");

class BasicUserController {
  static async getAllUsers(req, res) {
    let message = "Success";
    let statusCode = 200;

    try {
      const data = await User.findAll({
        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
          "phoneNumber",
          "address",
          "authToken",
          "createdAt",
          "updatedAt",
        ],
      });
      if (data.length === 0) {
        throw new Error("Database is empty!");
      } else {
        return res.status(statusCode).json({ data, message });
      }
    } catch (error) {
      statusCode = 404;
      return res.status(200).json(error.message);
    }
  }

  static async getUserById(req, res) {
    let id = +req.params.id;
    let statusCode = 200;
    let message = "Success";

    try {
      const data = await User.findOne({
        where: { id: id },
        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
          "phoneNumber",
          "address",
          "authToken",
          "createdAt",
          "updatedAt",
        ],
      });
      if (!data) {
        throw new Error(`User with Id ${id} not found!`);
      } else {
        return res.status(statusCode).json({ data, message });
      }
    } catch (error) {
      statusCode = 404;
      return res.status(statusCode).json(error.message);
    }
  }
}

class RegisterController {
  static async postRegisterUser(req, res) {
    const { firstName, lastName, email, phoneNumber, address, password } =
      req.body;

    let statusCode = 201;
    let message = "Success";

    const checkEmail = await User.findOne({ where: { email: email } });
    const checkPhone = await User.findOne({
      where: { phoneNumber: phoneNumber },
    });

    try {
      if (checkEmail) {
        throw new Error(
          `User with email ${email} already exist, try with different email`
        );
      } else if (checkPhone) {
        throw new Error(
          `User with phone number ${phoneNumber} already exist, try with different phone number`
        );
      }
      const saltRounds = 10;
      //Note: Bisa gunakan hooks di model user untuk melakukan proses seperti ini. Nama hooksnya beforeCreate silahkan baca dokumentasi sequelize
      let hash = bcrypt.hashSync(password, saltRounds);
      await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        password: hash,
      });

      const data = await User.findOne({
        where: { firstName: firstName, lastName: lastName, email: email },
        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
          "phoneNumber",
          "address",
          "authToken",
          "createdAt",
          "updatedAt",
        ],
      });

      return res.status(statusCode).json({ data, message });
    } catch (error) {
      return res.status(statusCode).json(error.message);
    }
  }
}

class LoginController {
  static async postLoginUser(req, res) {
    const { email, password } = req.body;
    let statusCode = 200;
    let message = "Success";

    try {
      const login = await User.findOne({
        where: { email: email },
        attributes: { password },
      });

      if (login?.dataValues?.email !== email) {
        throw new Error("Incorrect email!");
      } else if (email.length === 0) {
        throw new Error("Bad request: Missing body request!");
      }

      let userDataToken;
      let authToken;
      const userPassword = bcrypt.compareSync(
        password,
        login.dataValues.password
      );
      if (userPassword) {
        authToken = `${email}-${Date.now()}`;
        userDataToken = await User.update(
          { authToken: authToken },
          { where: { email: email } }
        );
      } else {
        throw new Error("Incorrect password!");
      }
      message = `Welcome back, ${login.dataValues.firstName} ${login.dataValues.lastName}!`;
      return res.status(statusCode).json({ authToken, message });
    } catch (error) {
      statusCode = 404;
      return res.status(statusCode).json(error.message);
    }
  }

  static async deleteLogoutUser(req, res) {
    let id = +req.params.id;
    let { authToken } = req.body;
    let statusCode = 200;
    let message = "Log out Successfully";

    try {
      const token = await User.findOne({ where: { authToken: authToken } });
      if (
        !token?.dataValues?.authToken &&
        token?.dataValues?.authToken !== authToken
      ) {
        throw new Error("Login Action Needed!");
      }

      await User.update(
        {
          authToken: null,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(statusCode).json({ message });
    } catch (error) {
      statusCode = 404;
      return res.status(statusCode).json(error.message);
    }
  }
}

module.exports = { BasicUserController, RegisterController, LoginController };
