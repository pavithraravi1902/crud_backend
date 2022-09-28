const express = require('express');
const app = express();
const mysql = require('mysql');
const Joi = require('joi');
const STUDENT_QUERY = require("./queries/student.query");
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//middleware
app.use((req, res, next) => {
    console.log(`[${req.method}] URL: ${req.url} Body: ${JSON.stringify(req.body)}`);
    next();
});

//db connection
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'student_data'
});

con.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("connected");
});

//Get all data
app.get('/student', (req, res) => {
    con.query(STUDENT_QUERY.GETALL, function (err, result) {
        if (err) {
            throw err;
        }
        res.send({
            message: result.length > 0 ? "All user data" : "data not found",
            data: result
        });
    })
});

//get single data
app.get('/student/:id', (req, res) => {
    var id = req.params.id;
    var sql = `select id, name, age, dept from student_data.student_db where id=${id}`;
    //select id, name, age, dept from student_data.student_db where name REGEXP '^Pa';
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.send({
            message: result.length > 0 ? "All user data" : "data not found",
            data: result
        })
    })
});

/*//simple  data
let validateStudent = (req, res, next) => {
    let { name, age, dept } = req.body;

    if (!name) {
        return res.end("Invalid property 'name'");
    }

    if (!age || age < 1) {
        return res.end("Invalid property 'age'");
    } else if (typeof age != "number") {
        return res.end("Property 'age' should be number type");
    }

    if (!dept || dept.length < 2) {
        return res.end("Invalid property 'dept'");
    }
    next();
};*/

//Validation schema
const validationSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required(),
    dept: Joi.string().required()
});

app.post('/student', (req, res) => {
    let { name, age, dept } = req.body;
    let sql = `insert into student_data.student_db(name, age, dept)
               values ('${name}', '${age}', '${dept}')`;
    if (validationSchema.validate(req.body).error) {
        res.send(validationSchema.validate(req.body).error.details);
    } else {
        con.query(sql, (err, result, field) => {
            res.send(validationSchema.validate(req.body));
        })
    }
});

//update data
app.put('/student/:id', (req, res) => {
    let qID = req.params.id;
    let data = req.body;
    let sql = `update student_data.student_db set name = '${data.name}', age = '${data.age}', dept = '${data.dept}'  where id= '${qID}'`;
    /* con.query(sql, (err, result) => {
         if (err) { console.log(err); }
         res.send({
             message: "data updated",
             data: result
         });
     });*/
    if (validationSchema.validate(req.body).error) {
        res.send(validationSchema.validate(req.body).error.details);
    } else {
        con.query(sql, (err, result, field) => {
            res.send(validationSchema.validate(req.body));
        })
    }
});


//delete data
app.delete('/student/:id', (req, res) => {
    var gID = req.params.id;
    var sql = `delete from student_data.student_db where id='${gID}'`;
    con.query(sql, (err, result) => {
        if (err) { console.log(err); }
        res.send({
            message: "data deleted"
        });
    });
});

app.listen(8000, () => {
    console.log("Running PORT 8000");
});