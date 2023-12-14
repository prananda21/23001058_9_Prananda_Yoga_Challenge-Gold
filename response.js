const formatResponse = (data, message) => {
    return {
        data: data ? data : null,
        message: message ? message : 'Success'
    }
}

module.exports = {formatResponse}