const {formatResponse} = require('../response.js');
const {items} = require('../db/db_items.js')

const getAllItem = (req, res) => {
    let data = {};
    let message = 'Success';
    let isUserFound = false;

    let id = req.params.productId;

    for (let i = 0; i < items.length; i++){
        if (items[i].id === +id){
            data = items[i];
            isUserFound = true;
            break;
        }
    }

    if (isUserFound) {
        res.status(200).json(formatResponse(data, message));
    } else {
        res.status(404).json(formatResponse(data, `Product with id ${id} not found`))
    }
}


module.exports = {getAllItem}