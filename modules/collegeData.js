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
    status: Sequelize.STRING
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

/** IMPLEMENTED ✅ */
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("unable to sync the database");
            });
    });
};

/** PLACEHOLDER FUNCTIONS — to be implemented next */
module.exports.getAllStudents = function () {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getCourses = function () {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getCourseById = function (id) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};


module.exports.addCourse = function (courseData) {
    return new Promise((resolve, reject) => {
        for (let prop in courseData) {
            if (courseData[prop] === "") {
                courseData[prop] = null;
            }
        }

        Course.create(courseData)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("unable to create course");
            });
    });
};

module.exports.updateCourse = function (courseData) {
    return new Promise((resolve, reject) => {
        for (let prop in courseData) {
            if (courseData[prop] === "") {
                courseData[prop] = null;
            }
        }

        Course.update(courseData, {
            where: { courseId: courseData.courseId }
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("unable to update course");
            });
    });
};

module.exports.deleteCourseById = function (id) {
    return new Promise((resolve, reject) => {
        Course.destroy({
            where: { courseId: id }
        })
            .then((rowsDeleted) => {
                if (rowsDeleted > 0) {
                    resolve();
                } else {
                    reject("Course not found");
                }
            })
            .catch((err) => {
                reject("unable to delete course");
            });
    });
};

module.exports.deleteStudentByNum = function (studentNum) {
    return Student.destroy({ where: { studentNum: studentNum } })
      .then((rowsDeleted) => {
        if (rowsDeleted > 0) {
          return Promise.resolve();
        } else {
          return Promise.reject("Student not found");
        }
      })
      .catch(() => Promise.reject("Unable to delete student"));
  };
  