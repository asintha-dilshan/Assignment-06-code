/*********************************************************************************
 *  WEB700 – Assignment 05
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Asintha Dilshan Jayasekara Wisurumana Arachchige
 *  Student ID: 170388235
 *  Date: 03/25/2025
 *  Online (Vercel) Link: https://assignment-05-code.vercel.app/
 ********************************************************************************/

const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");
const app = express();
const helpers = require("./helpers");
const expressLayouts = require("express-ejs-layouts");

const PORT = process.env.PORT || 8080;

// Set EJS as the view engine
app.set("layout", "layouts/main");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  next();
});

app.use(express.urlencoded({ extended: true }));
const navLink = (url, options) =>
  helpers.navLink(app.locals.activeRoute, url, options);

// Route to Serve addStudent.html
// app.get("/students/add", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "addStudent.html"));
// });

// Home Page Route
app.get("/home", (req, res) => {
  res.render("home", { navLink: navLink });
});

// / Route
app.get("/", (req, res) => {
  res.render("home", { navLink: navLink });
});

// About Page Route
app.get("/about", (req, res) => {
  res.render("about", { navLink: navLink });
});

// HTML Demo Page Route
app.get("/htmlDemo", (req, res) => {
  res.render("htmlDemo", { navLink: navLink });
});

// Route for Add Student
app.get("/students/add", (req, res) => {
  collegeData
    .getCourses()
    .then((courses) => {
      res.render("addStudents", { courses: courses, navLink: navLink });
    })
    .catch(() => {
      res.render("addStudents", { courses: [], navLink: navLink });
    });
});


// POST /students/add
app.post("/students/add", (req, res) => {
  collegeData
    .addStudent(req.body)
    .then(() => res.redirect("/students"))
    .catch((err) =>
      res.status(500).render("error", {
        message: "Error adding student: " + err,
        navLink: navLink,
      })
    );
});



// Get all students or by course
app.get("/students", (req, res) => {
  if (req.query.course) {
    collegeData
      .getStudentsByCourse(req.query.course)
      .then((students) => {
        if (students.length > 0) {
          res.render("students", { students: students, navLink: navLink });
        } else {
          res.render("students", { message: "no results", navLink: navLink });
        }
      })
      .catch(() =>
        res.render("students", { message: "no results", navLink: navLink })
      );
  } else {
    collegeData
      .getAllStudents()
      .then((students) => {
        if (students.length > 0) {
          res.render("students", { students: students, navLink: navLink });
        } else {
          res.render("students", { message: "no results", navLink: navLink });
        }
      })
      .catch(() =>
        res.render("students", { message: "no results", navLink: navLink })
      );
  }
});

// Get all Teaching Assistants
app.get("/tas", (req, res) => {
  collegeData
    .getTAs()
    .then((tas) => res.json(tas))
    .catch(() => res.json({ message: "no results" }));
});

// Get all courses
app.get("/courses", (req, res) => {
  collegeData
    .getCourses()
    .then((courses) => {
      if (courses.length > 0) {
        res.render("courses", { courses: courses, navLink: navLink });
      } else {
        res.render("courses", { message: "no results", navLink: navLink });
      }
    })
    .catch(() =>
      res.render("courses", { message: "no results", navLink: navLink })
    );
});

// initialize

// collegeData.initialize()
//   .then(() => {
//     console.log("Database sync successful ✅");
//   })
//   .catch((err) => {
//     console.log("Database sync failed ❌:", err);
//   });


// Get a student by student number
app.get("/student/:studentNum", (req, res) => {
  let viewData = {};

  collegeData
    .getStudentByNum(req.params.studentNum)
    .then((data) => {
      viewData.student = data || null;
    })
    .catch(() => {
      viewData.student = null;
    })
    .then(collegeData.getCourses)
    .then((data) => {
      viewData.courses = data;

      for (let i = 0; i < viewData.courses.length; i++) {
        if (
          viewData.student &&
          viewData.courses[i].courseId == viewData.student.course
        ) {
          viewData.courses[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.courses = [];
    })
    .then(() => {
      if (viewData.student == null) {
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData, navLink: navLink });
      }
    });
});


//Update a student
app.post("/student/update", (req, res) => {
  console.log(req.body);
  collegeData
    .updateStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => res.status(500).send(err));
});

// Get a course by course code
app.get("/course/:id", (req, res) => {
  collegeData
    .getCourseById(req.params.id)
    .then((course) =>
      res.render("course", { course: course, navLink: navLink })
    )
    .catch(() => res.json({ message: "no results", navLink: navLink }));
});

// GET route to show the add course form
app.get("/courses/add", (req, res) => {
  res.render("addCourse", { navLink: navLink });
});

// POST route to handle adding a new course
app.post("/courses/add", (req, res) => {
  collegeData
    .addCourse(req.body)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err) => {
      res.status(500).render("error", { message: "Error adding course: " + err, navLink: navLink });
    });
});

// POST route to update a course
app.post("/course/update", (req, res) => {
  collegeData
    .updateCourse(req.body)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err) => {
      res.status(500).send("Unable to update course: " + err);
    });
});

// Updated GET /course/:id route with "not found" check
app.get("/course/:id", (req, res) => {
  collegeData
    .getCourseById(req.params.id)
    .then((course) => {
      if (course) {
        res.render("course", { course: course, navLink: navLink });
      } else {
        res.status(404).send("Course Not Found");
      }
    })
    .catch(() => {
      res.status(500).send("Server error");
    });
});

// DELETE route to remove a course by ID
app.get("/course/delete/:id", (req, res) => {
  collegeData
    .deleteCourseById(req.params.id)
    .then(() => {
      res.redirect("/courses");
    })
    .catch(() => {
      res.status(500).send("Unable to Remove Course / Course not found");
    });
});

app.get("/student/delete/:studentNum", (req, res) => {
  collegeData
    .deleteStudentByNum(req.params.studentNum)
    .then(() => res.redirect("/students"))
    .catch(() => res.status(500).send("Unable to Remove Student / Student not found"));
});



// Route to Handle Form Submission
// app.post("/students/add", (req, res) => {
//   collegeData
//     .addStudent(req.body)
//     .then(() => {
//       res.send(`
//                 <html>
//                 <head>
//                     <title>Student Added</title>
//                     <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
//                 </head>
//                 <body class="d-flex justify-content-center align-items-center vh-100">
//                     <div class="text-center">
//                         <h2 class="mb-4">Student Added Successfully!</h2>
//                         <a href="/home" class="btn btn-primary">Go Back to Home</a>
//                         <a href="/students" class="btn btn-success">View All Students</a>
//                     </div>
//                 </body>
//                 </html>
//             `);
//     })
//     .catch((err) => res.status(500).send(err));
// });

// Handle 404 Errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// (async () => {
//   try {
//     await collegeData.initialize().then(() => {
//       app.listen(process.env.PORT, () => {
//         console.log(`Server listening on port ${process.env.PORT}`);
//       });
//     });
//     console.log("Data initialized successfully");
//   } catch (err) {
//     console.error("Failed to initialize data: ", err);
//   }
// })();

(async () => {
  try {
    await collegeData.initialize();
    app.listen(PORT, () => {
      console.log(`✅ Server is running locally on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to initialize data: ", err);
  }
})();

// Export app for Vercel
module.exports = app;
