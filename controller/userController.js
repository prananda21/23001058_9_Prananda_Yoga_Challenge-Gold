const {formatResponse} = require('../response.js');
const {users} = require('../db/db_users.js')

class userController {
    static getUserById (req, res) {
        let data = {};
        let message = 'Success';
        let isUserFound = false;

        let id = req.params.userId;

        for (let i = 0; i < users.length; i++){
            if (users[i].id === +id){
                data = users[i];
                isUserFound = true;
                break;
            }
        }

        if (isUserFound) {
            res.status(200).json(formatResponse(data, message));
        } else {
            res.status(404).json(formatResponse(data, `User with id ${id} not found`))
        }
    }

    static deleteUserById(req, res) {
        let idBody = req.body.userId;

        const index = users.findIndex((user) => user.id === idBody)

        if(index !== -1) {
            users.splice(index, 1);
            res.status(200).json(`User with id ${idBody} deleted!`)
        } else {
            res.status(404).json(`User with id ${idBody} not found or has been deleted`)
        }
    }

    static getAllUsers(req, res) {
        let message = 'Success';
        res.status(200).json(formatResponse(users, message));
    }
}

class registerController {
    static postRegisterUser (req, res)  {
        let data = {
            id: users[users.length -1].id + 1,
            name: req.body.name,
            email: req.body.email,
        };
    
        users.push(data);
    
        res.status(201).json(formatResponse(data, 'Success'));
    }
}

module.exports = { userController, registerController }