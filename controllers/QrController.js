const crypto = require('crypto');
const {v4:uuid} = require('uuid');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');

const CRYPTO_SECRET = process.env.CRYPTO_SECRET
const JWT_SECRET = process.env.JWT_SECRET

const generateQRCodeDataURL = async (text) => {
    try {
      const qrDataURL = await QRCode.toDataURL(text, {width : 300} );
      console.log('QR Code Data URL:', qrDataURL);
      return qrDataURL;
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };
  


const getQR = async (req,res) => {
    try {
        const token = req.headers.authorization;
        if (!token){
            return res.status(400).json({ message: 'Not a Faculty' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const fid = decoded.facultyId;
        if (!fid){
            return res.status(400).json({ message: 'Not a Faculty' });
        }
        try {
            const { sessionId } = req.body;
            if (!sessionId){
                return res.status(400).json({ message: 'Missing required fields' });
            }
            const salt = uuid()
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-cbc', CRYPTO_SECRET, iv);
            const date = Date.now();
            const textToEncypt = `${sessionId}$${salt}$${date}`;
            let encrypted = cipher.update(textToEncypt, 'utf8', 'hex');  
            encrypted += cipher.final('hex');
            const encryptedText = iv.toString('hex') + ':' + encrypted;
            const qrCodeUrl = await generateQRCodeDataURL(encryptedText)
            return res.status(200).json({
                success : true,
                message: 'QR Code Generation Successful',
                qrCode : qrCodeUrl
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } catch (e) {
        return res.status(400).json({ message: 'Not a Faculty' });
    }
}

module.exports = {getQR}