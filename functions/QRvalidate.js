const {v4:uuid} = require('uuid')
const crypto = require('crypto')

exports.handler = async (event) => {
    const scannedTime = Date.now()
    const encryptedText = event.body.encrypted
    
    const [iv, encrypted] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', '12345678901234567890123456789012' , Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    const QRTime = decrypted.split('$')[2];
    const isValidated = scannedTime - QRTime <= 300*1000;
    return {
        decrypted : decrypted,
        isValidated ,
        difference : (scannedTime - QRTime)/1000
    }
};