const {v4:uuid} = require('uuid')
const crypto = require('crypto')


exports.handler = async (event) => {
    const sessionId = event.body.sessionId;
    if (!sessionId){
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing sessionId'
            })
        }
    }
    const salt = uuid()
    const date = Date.now();
    const textToEncypt = `${sessionId}$${salt}$${date}`;
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', '12345678901234567890123456789012', iv);
    let encrypted = cipher.update(textToEncypt, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const encryptedText = iv.toString('hex') + ':' + encrypted;    
    return {
        encrypted : encryptedText
    }
};