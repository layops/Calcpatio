const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token)
        return res.status(401).json({message: "Oturum açmanız gerekmektedir."});

    try {
        const payload = jwt.verify(token, process.env.JWT_TOKEN);

        // Tokens issued before expiry was introduced never expire; reject them.
        if (!payload || !payload.exp || !payload._id)
            return res.status(401).json({message: "Geçersiz oturum. Lütfen tekrar giriş yapınız."});

        req.user = payload;
        return next();
    } catch (err) {
        const message = err.name === 'TokenExpiredError'
            ? "Oturum süreniz doldu. Lütfen tekrar giriş yapınız."
            : "Geçersiz oturum. Lütfen tekrar giriş yapınız.";
        return res.status(401).json({message});
    }
};