
const record = require("../index.js");
//console.log(record)
module.exports = {
    CREATE: `select id, name, age, dept from student_data.student_db`,
    UPDATE: `select id, name, age, dept from student_data.student_db where id=':id'`,
    DELETE: `delete from student_data.student_db where id=':id'`,
    GETBYID: `select id, name, age, dept from student_data.student_db where name REGEXP '^name'`,
    //select id, name, age, dept from student_data.student_db where name REGEXP '^Pa';
    GETALL: `select id, name, age, dept from student_data.student_db`
}