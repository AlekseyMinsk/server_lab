const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
//app.use(cors());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
    await mongoose.connect(`mongodb+srv://AlekseyLab:headeRs24@clusterlab.1suzst2.mongodb.net/?retryWrites=true&w=majority`);
    //await mongoose.connect(`mongodb://127.0.0.1:27017`)
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    });
}

start();








// const express = require("express");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");

// const app = express();

// app.use(cookieParser());

// const authorization = (req, res, next) => {
//   const token = req.cookies.access_token;
//   console.log(req.cookies)
//   if (!token) {
//     return res.sendStatus(403);
//   }
//   try {
//     const data = jwt.verify(token, "YOUR_SECRET_KEY");
//     req.userId = data.id;
//     req.userRole = data.role;
//     return next();
//   } catch {
//     return res.sendStatus(403);
//   }
// };

// app.get("/", (req, res) => {
//   return res.json({ message: "Hello World 🇵🇹 🤘" });
// });

// app.get("/login", (req, res) => {
//   const token = jwt.sign({ id: 7, role: "captain" }, "YOUR_SECRET_KEY");
//   return res
//     .cookie("access_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//     })
//     .status(200)
//     .json({ message: "Logged in successfully 😊 👌" });
// });

// app.get("/protected", authorization, (req, res) => {
//   return res.json({ user: { id: req.userId, role: req.userRole } });
// });

// app.get("/logout", authorization, (req, res) => {
//   return res
//     .clearCookie("access_token")
//     .status(200)
//     .json({ message: "Successfully logged out 😏 🍀" });
// });

// const start = (port) => {
//   try {
//     app.listen(port, () => {
//       console.log(`Api up and running at: http://localhost:${port}`);
//     });
//   } catch (error) {
//     console.error(error);
//     process.exit();
//   }
// };
// start(3333);