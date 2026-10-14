const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {userRepository} = require('../db');
const asyncHandler = require('../helper/asyncHandler');

const BCRYPT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 72; // bcrypt only processes up to 72 bytes
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isBcryptHash = (value) => typeof value === 'string' && /^\$2[aby]\$\d{2}\$.{53}$/.test(value);

const safeEqual = (a, b) => {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
};

const validateNewPassword = (password) => {
    if (password.length < MIN_PASSWORD_LENGTH)
        return `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalıdır.`;
    if (password.length > MAX_PASSWORD_LENGTH)
        return `Şifre en fazla ${MAX_PASSWORD_LENGTH} karakter olabilir.`;
    return null;
};

const verifyPassword = async (user, plainPassword) => {
    if (isBcryptHash(user.password))
        return bcrypt.compare(plainPassword, user.password);

    if (!safeEqual(user.password, plainPassword))
        return false;

    // Transparently upgrade legacy plain-text password to bcrypt hash on login
    const hash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
    userRepository.updatePassword(user.id, hash);
    return true;
};

const postLogin = asyncHandler(async (req, res) => {
    const {username, password} = req.body || {};
    if (!isNonEmptyString(username) || !isNonEmptyString(password))
        return res.status(400).json({message: "Lütfen tüm alanları doldurunuz."});

    const user = userRepository.findByUsername(username.trim());
    if (!user || !(await verifyPassword(user, password)))
        return res.status(401).json({message: "Kullanıcı adı veya şifre hatalı."});

    const token = jwt.sign({
        _id: user.id,
        id: user.id,
        username: user.username,
        nameSurname: user.nameSurname
    }, process.env.JWT_TOKEN, {expiresIn: JWT_EXPIRES_IN});

    return res.status(200).json({token});
});

const postRegister = asyncHandler(async (req, res) => {
    const {username, password, nameSurname, secretPassword} = req.body || {};
    if (![username, password, nameSurname, secretPassword].every(isNonEmptyString))
        return res.status(400).json({message: "Lütfen tüm alanları doldurunuz."});

    if (!safeEqual(process.env.SECRET_PASSWORD, secretPassword))
        return res.status(403).json({message: "Yetkisiz işlem! Yönetici güvenlik şifresi hatalı."});

    const passwordError = validateNewPassword(password);
    if (passwordError)
        return res.status(400).json({message: passwordError});

    const cleanUsername = username.trim();
    if (userRepository.exists(cleanUsername))
        return res.status(409).json({message: cleanUsername + " kullanıcı adı zaten kullanılıyor."});

    try {
        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
        const newUser = userRepository.create({
            username: cleanUsername,
            password: hashedPassword,
            nameSurname: nameSurname.trim()
        });
        return res.status(201).json({
            _id: newUser.id,
            id: newUser.id,
            username: newUser.username,
            nameSurname: newUser.nameSurname
        });
    } catch (err) {
        if (err.message && err.message.includes('UNIQUE constraint')) {
            return res.status(409).json({message: cleanUsername + " kullanıcı adı zaten kullanılıyor."});
        }
        throw err;
    }
});

const postUpdatePassword = asyncHandler(async (req, res) => {
    const {currentPassword, newPassword} = req.body || {};
    if (!isNonEmptyString(currentPassword) || !isNonEmptyString(newPassword))
        return res.status(400).json({message: "Lütfen tüm alanları doldurunuz."});

    const passwordError = validateNewPassword(newPassword);
    if (passwordError)
        return res.status(400).json({message: passwordError});

    const userId = req.user.id || req.user._id;
    const user = userRepository.findById(userId);
    if (!user)
        return res.status(404).json({message: "Kullanıcı bulunamadı."});

    if (!(await verifyPassword(user, currentPassword)))
        return res.status(400).json({message: "Mevcut şifre hatalı."});

    const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    userRepository.updatePassword(user.id, hash);
    return res.status(200).json({message: "Şifre başarıyla güncellendi."});
});

module.exports = {
    postLogin,
    postRegister,
    postUpdatePassword
};