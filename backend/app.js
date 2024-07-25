const express = require('express')
const cors = require('cors')
const mysql = require('mysql')

const app = express()

app.use(cors({
    origins: ['http://localhost:5173/'],
    credentials: true
}))
app.use(express.json())

const db = mysql.createConnection(({
    user: "root",
    host: "localhost",
    password: "",
    database: "working"
}))


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

app.get('/read',(re,res)=>{
    const sql = 'SELECT * FROM students'
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({success:false,message:err.message})
        }
        return res.status(200).json({success:true,data:result})
    })
})
app.post('/update',(req,res)=>{
    let {id,name}=req.body
    if(!id || !name){
        return res.status(400).json({success:false,message:"User id or user name not found!"})
    }
    const sql = 'UPDATE students set name=? where id=?'
    if(name.includes('updated')){
        const newName = name.split('updated')
        name = newName[0]
    }else{
        name = name+" updated"
    }
    db.query(sql,[name,id],(err,result)=>{
        if(err){
            return res.status(500).json({success:false,message:err.message})
        }
        return res.status(200).json({success:true,message:"User updated successfully"})
    })
})
app.post('/delete',(req,res)=>{
    let {id}=req.body
    if(!id){
        return res.status(400).json({success:false,message:"User id not found!"})
    }
    const sql = 'DELETE FROM students where id=?'
    db.query(sql,[id],(err,result)=>{
        if(err){
            return res.status(500).json({success:false,message:err.message})
        }
        return res.status(200).json({success:true,message:"User deleted successfully"})
    })
})


app.listen(8080, () => {
    console.log('App is listening on port no 8080')
})