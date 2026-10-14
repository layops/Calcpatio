const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const loggerMiddleware = require("./routes/middleware/loggerMiddleware");
const {db} = require('./db');

const REQUIRED_ENV = ['JWT_TOKEN', 'SECRET_PASSWORD'];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
    console.error("Missing required environment variables: " + missingEnv.join(', '));
    process.exit(1);
}

process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...', err);
    process.exit(1);
});

process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION! Shutting down...', err);
    process.exit(1);
});

const app = express();
const port = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(helmet());
app.use(express.json({limit: '10kb'}));

// CORS_ORIGIN: comma separated list, e.g. "http://localhost:3000"
const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
if (allowedOrigins.length === 0)
    console.warn("CORS_ORIGIN is not set; API accepts requests from any origin.");
app.use(cors(allowedOrigins.length > 0 ? {origin: allowedOrigins} : undefined));

// routes
app.use(loggerMiddleware);
app.use('/api/user', require('./routes/user.route'));

app.get('/', (req, res) => {
    res.status(200).json({status: "online", database: "sqlite"});
});

app.use((req, res) => {
    res.status(404).json({message: process.env.MESSAGE_404 || "404 Sayfa bulunamadı!"});
});

// global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    if (status >= 500)
        console.error(err);
    if (res.headersSent)
        return next(err);
    res.status(status).json({message: status >= 500 ? "Sunucu içi bir hata oluştu." : err.message});
});

app.listen(port, () => {
    console.log("==========================================");
    console.log(" Calcpatio Server running on port: " + port);
    console.log(" SQLite database ready: " + db.name);
    console.log("==========================================");
});
