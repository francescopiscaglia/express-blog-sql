const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

// importazione router
const PostsRouter = require("./routes/posts.js");

// import error 404 middlewareroutes
const notFoundMiddleware = require("./middlewares/notFound.js");

// import server error middleware
const serverError = require("./middlewares/serverError.js");


// json middleware
app.use(express.json());

// middlware to trigger a 500 error
// app.use("/posts", (req, res, next) => {
//     throw new Error("You broke everythink dude!");
// });

// router middleware
app.use("/posts", PostsRouter);

// static assets middleware
app.use(express.static("public"));



// start the server
app.listen(3001, () => {
    console.log("Server is running at http://localhost:3001");
});


// use error middleware
app.use(notFoundMiddleware);

// 500 error middleware
app.use(serverError);