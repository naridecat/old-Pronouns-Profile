import { SECRET } from '$env/static/private'
import CryptoJS from 'crypto-js';
const pwdEncrypt = (pwd: string, originSalt: string|undefined=undefined) => {
    const salt = originSalt || CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
    
    const hash = CryptoJS.SHA256(pwd + salt);
    
    return {
        hashedPwd: hash.toString(CryptoJS.enc.Hex),
        salt,
    };
};

export default pwdEncrypt;

