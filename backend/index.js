import bodyParser from "body-parser";
import express from "express";
import indexRouter from "./router/indexRouter.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

app.use(indexRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
