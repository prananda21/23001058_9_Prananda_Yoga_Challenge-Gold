const {formatResponse} = require('../response.js');
const usersData = require('../db/db_users.json');
const fs = require('fs');

class userController {
    static getAllUsers(req, res) {
        return res.status(200).json(formatResponse(usersData));
    }
    
    static getUserById (req, res) {
        let id = +req.params.id
        let statusCode = 200;
        let message = undefined;
        const user = usersData.find((i) => i.id === id)

        if (user === undefined) {
            statusCode = 404;
            message = `User with id ${id} not found!`
        }

        return res.status(statusCode).json(formatResponse(user, message))
    }

    static deleteUserById(req, res) {
        let id = +req.params.id
        let statusCode = 200;
        let message = undefined;
        const findId = usersData.find((i) => i.id === +id);
        

        if(findId === undefined) {
            statusCode = 404;
            message = `User with Id ${id} not found!`
            return res.status(statusCode).json(formatResponse(null, message))
            
        } 

        const deleteUser = usersData.filter((findId) => findId.id !== +id);
        if (findId !== undefined) {
            deleteUser;
        }

        fs.writeFileSync(
            "./db/db_users.json", 
            JSON.stringify(deleteUser), 
            "utf-8"
        );
        

        return res.status(statusCode).json(formatResponse())
    }
}

class registerController {
    static postRegisterUser (req, res)  {
        let { name, email } = req.body;
        let id = usersData[usersData.length -1].id + 1
        let statusCode = 201;
        let message = undefined;

        let data = {
            id: id,
            name: name,
            email: email
        }

        const foundName = usersData.find((i) => i.name === name);console.log(foundName);
        const foundEmail = usersData.find((i) => i.email === email);console.log(foundEmail)

        if(!foundName && !foundEmail) {
           usersData.push(data); 
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

        fs.writeFileSync(
            "./db/db_users.json", 
            JSON.stringify(usersData), 
            "utf-8"
        );

        return res.status(statusCode).json(formatResponse(data));
    }
}

class loginController {
    static postLoginUser (req, res) {

    }

    static deleteLoginUser (req, res) {

    }
}

module.exports = { userController, registerController }