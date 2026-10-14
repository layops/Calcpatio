const rateLimit = require('express-rate-limit');
const jwtAuth = require("./middleware/jwtAuth");
const {
    postLogin,
    postRegister,
    postUpdatePassword,
} = require("../controllers/user.controller");
const router = require('express').Router();

// Brute-force protection for credential endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {message: "Çok fazla başarısız deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyiniz."}
});

router.post('/login', authLimiter, postLogin);
router.post('/register', authLimiter, postRegister);
router.post('/updatePassword', authLimiter, jwtAuth, postUpdatePassword);


module.exports = router;