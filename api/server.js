const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

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

app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) return res.status(500).json({ message: 'Database error' });
        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error registering user' });
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.json({ message: 'Login successful' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
