/*********************************************************************************
 *  WEB700 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Asintha Dilshan Jayasekara Student ID: 170388235 Date: 16/02/2025
 *
 ********************************************************************************/

const Sequelize = require('sequelize');
var sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'npg_8YsN3kEULHvx', {
    host: 'ep-still-band-a5sdvdwj-pooler.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Define the Student model
const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
    course: Sequelize.INTEGER
});

// Define the Course model
const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

// Define the hasMany relationship between Course and Student
Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
    return sequelize.sync();
};

module.exports.getAllStudents = function () {
    return Student.findAll();
};

module.exports.getTAs = function () {
    return Student.findAll({ where: { TA: true } });
};

module.exports.getCourses = function () {
    return Course.findAll();
};

module.exports.getStudentByNum = function (num) {
    return Student.findOne({ where: { studentNum: num } });
};

module.exports.getStudentsByCourse = function (course) {
    return Student.findAll({ where: { course: course } });
};

module.exports.addStudent = function (studentData) {
    studentData.TA = studentData.TA ? true : false;
    for (let prop in studentData) {
        if (studentData[prop] === "") studentData[prop] = null;
    }
    return Student.create(studentData);
};

module.exports.getCourseById = function (id) {
    return Course.findOne({ where: { courseId: id } });
};

module.exports.updateStudent = function (studentData) {
    studentData.TA = studentData.TA ? true : false;
    for (let prop in studentData) {
        if (studentData[prop] === "") studentData[prop] = null;
    }
    return Student.update(studentData, { where: { studentNum: studentData.studentNum } });
};

module.exports.addCourse = function (courseData) {
    for (let prop in courseData) {
        if (courseData[prop] === "") courseData[prop] = null;
    }
    return Course.create(courseData);
};

module.exports.updateCourse = function (courseData) {
    for (let prop in courseData) {
        if (courseData[prop] === "") courseData[prop] = null;
    }
    return Course.update(courseData, {
        where: { courseId: courseData.courseId }
    });
};

module.exports.deleteCourseById = function (id) {
    return Course.destroy({ where: { courseId: id } });
};

module.exports.deleteStudentByNum = function (studentNum) {
    return Student.destroy({ where: { studentNum: studentNum } });
};