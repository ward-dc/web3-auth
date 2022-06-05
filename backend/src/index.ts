import dotenv from "dotenv";
import express from "express";
import prisma from "./utils/prismaHandler";
var cors = require('cors')
const app = express();

app.use(cors())
dotenv.config();

//get
app.get( "/collections", require("./events/get/collections") );



//post
app.post("/collection", require("./events/post/collection"));
app.post("/collection/:slug", require("./events/post/getcollection"));


app.listen(3333, () => {
	console.log("listening to request on port 3333");
});

