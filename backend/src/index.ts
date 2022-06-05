import dotenv from "dotenv";
import express from "express";
import prisma from "./utils/prismaHandler";
var cors = require('cors')
const app = express();

app.use(cors())
dotenv.config();

//get
app.get( "/auth", require("./events/get/auth") );


app.listen(3333, () => {
	console.log("listening to request on port 3333");
});

