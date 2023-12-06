const {formatResponse} = require('../response.js');
const {users} = require('../db/db_users.js')

const getAllUser = (req, res) => {
    let data = {};
    let message = 'Success';
    let isUserFound = false;

    let id = req.params.userId;

    for (let i = 0; i < users.length; i++){
        if (users[i].id === id){
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

module.exports = {getAllUser}