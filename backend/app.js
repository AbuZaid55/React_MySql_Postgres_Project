const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080;

const user = process.env.MYSQL_USER || 'root'
const host = process.env.MYSQL_HOST || 'db'
const password = process.env.MYSQL_PASSWORD || 'rootpassword'
const database = process.env.MYSQL_DATABASE || 'working'
const port = process.env.MYSQL_PORT || 3306

app.use(cors({
    origins: [process.env.FRONTEND_URL],
    credentials: true
}));

app.use(express.json());

const db = mysql.createConnection({
    user: user,
    host: host,
    password: password,
    database: database,
    port: port,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database.');
        checkAndCreateTable()
    }
});

function checkAndCreateTable() {
    const checkTableSql = `SHOW TABLES LIKE 'students'`;
    db.query(checkTableSql, (err, result) => {
        if (err) {
            console.error('Error checking for table existence:', err);
            return;
        }
        if (result.length === 0) {
            const createTableSql = `
                CREATE TABLE students (
                    id INT NOT NULL AUTO_INCREMENT,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id)
                )
            `;
            db.query(createTableSql, (err, result) => {
                if (err) {
                    console.error('Error creating table:', err);
                    return;
                }
                console.log('Table "students" created successfully');
            });
        } else {
            console.log('Table "students" already exists');
        }
    });
}

    
app.post('/create', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const existSql = 'SELECT * FROM students WHERE email = ?';
    db.query(existSql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (result.length > 0) {
            return res.status(400).json({ success: false, message: "Email already exists!" });
        }

        const sql = 'INSERT INTO students (name, email) VALUES (?, ?)';
        db.query(sql, [name, email], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
            return res.status(200).json({ success: true, message: "User added successfully" });
        });
    });
});

app.get('/read', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: err.message });
        }
        return res.status(200).json({ success: true, data: result });
    })
});
app.post('/update', (req, res) => {
    let { id, name } = req.body
    if (!id || !name) {
        return res.status(400).json({ success: false, message: "User id or user name not found!" })
    }
    const sql = 'UPDATE students set name=? where id=?'
    if (name.includes('updated')) {
        const newName = name.split('updated')
        name = newName[0]
    } else {
        name = name + " updated"
    }
    db.query(sql, [name, id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message })
        }
        return res.status(200).json({ success: true, message: "User updated successfully" })
    })
})
app.post('/delete', (req, res) => {
    let { id } = req.body
    if (!id) {
        return res.status(400).json({ success: false, message: "User id not found!" })
    }
    const sql = 'DELETE FROM students where id=?'
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message })
        }
        return res.status(200).json({ success: true, message: "User deleted successfully" })
    })
})


app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
