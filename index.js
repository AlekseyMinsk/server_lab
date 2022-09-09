const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(
    cors({
        origin: ['https://dep-client-lab.herokuapp.com', 'http://localhost:3000'],
        credentials: true,
    })
);
app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
    await mongoose.connect(`mongodb+srv://AlekseyLab:headeRs24@clusterlab.1suzst2.mongodb.net/?retryWrites=true&w=majority`);
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    });
}

start();