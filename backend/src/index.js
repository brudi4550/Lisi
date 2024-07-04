import bodyParser from "body-parser";
import express from "express";
import indexRouter from "./router/indexRouter.js";
import dotenv from "dotenv";
import cors from "cors";
const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(indexRouter);

app.listen(process.env.BACKEND_PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.BACKEND_PORT}`
  );
});
