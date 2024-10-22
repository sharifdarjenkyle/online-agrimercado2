const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const connection = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12739944',
    password: 'ZzAmmbEm9X',
    database: 'sql12739944',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.get('/api/status', (req, res) => {
    connection.query('SELECT 1 + 1 AS solution', (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error checking database connection' });
        }
        res.json({ message: 'Database connection is active', solution: results[0].solution });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
