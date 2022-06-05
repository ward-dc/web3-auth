import dotenv from "dotenv";
import express from "express";
import prisma from "./utils/prismaHandler";
var cors = require('cors')
const app = express();

// app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(cors())

dotenv.config();

//POST
app.post( "/auth", require("./events/POST/auth") );
app.post( "/verify", require("./events/POST/verify") );


app.listen(3333, () => {
	console.log("listening to request on port 3333");
});

