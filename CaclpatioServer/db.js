const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency & performance
db.pragma('journal_mode = WAL');

// Initialize users table automatically on startup
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL COLLATE NOCASE,
        password TEXT NOT NULL,
        nameSurname TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

const statements = {
    findByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
    findById: db.prepare('SELECT * FROM users WHERE id = ?'),
    createUser: db.prepare(`
        INSERT INTO users (username, password, nameSurname)
        VALUES (@username, @password, @nameSurname)
    `),
    updatePassword: db.prepare(`
        UPDATE users
        SET password = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
    `),
    countByUsername: db.prepare('SELECT COUNT(*) AS count FROM users WHERE username = ?')
};

const userRepository = {
    findByUsername: (username) => statements.findByUsername.get(username) || null,
    findById: (id) => statements.findById.get(id) || null,
    exists: (username) => (statements.countByUsername.get(username)?.count || 0) > 0,
    create: ({username, password, nameSurname}) => {
        const result = statements.createUser.run({username, password, nameSurname});
        return {
            _id: result.lastInsertRowid,
            id: result.lastInsertRowid,
            username,
            nameSurname
        };
    },
    updatePassword: (id, hashedPassword) => {
        statements.updatePassword.run(hashedPassword, id);
    }
};

module.exports = {
    db,
    userRepository
};
