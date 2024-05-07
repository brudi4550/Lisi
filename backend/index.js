import bodyParser from "body-parser";
import express from "express";
import indexRouter from "./router/indexRouter.js";
import dotenv from "dotenv";

const app = express();

app.use(bodyParser.json());

app.use(indexRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
