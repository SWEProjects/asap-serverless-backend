const {v4:uuid} = require('uuid')

exports.handler = async (event) => {
    return {
        sessionId : uuid()
    }
}