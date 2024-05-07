import express from "express";
import User from "../objects/User.js";
import Car from "../objects/Car.js";
import AIModel from "../objects/AIModel.js";

const router = express.Router();

let receivedAnswers = [];
let recommendedCars = [
  //new Car("Toyota", "Camry", 2022),
  //new Car("Honda", "Civic", 2021),
  //new Car("Ford", "Fusion", 2020),
];
var user = null;

const model = new AIModel();

router
  .post("/user", (req, res) => {
    if (req.query === null)
      return res
        .status(400)
        .json({ error: "Userinformation has to be provided" });

    user = new User(
      req.query.age,
      req.query.income,
      req.query.maritalStatus,
      req.query.dailyCommute,
      req.query.preferences,
      req.query.environment,
      req.query.fuelType
    );
    console.log(user);

    return res
      .status(201)
      .json({ message: "User information has been stored" });
  })
  .post("/questions", (req, res) => {
    const { answers } = req.body;
    if (!Array.isArray(answers))
      return res
        .status(400)
        .json({ error: "Answers must be provided in an array" });

    receivedAnswers.push(...answers);
    //TODO: Call to Large Language Model for car recommendations

    res.status(201).json({ message: "Answers received" });
  })
  .get("/recommendations", async (req, res) => {
    if (user == null)
      return res.status(400).json({ error: "Provide user information first" });
    let message = await model.predict(user);
    if (message == null) return res.status(400).json({ error: "API error" });

    extractCars(message);

    if (!recommendedCars.length)
      return res.status(400).json({ error: "No recommendations found" });
    return res.status(200).json({ recommendedCars });
  })
  .get("/userinfo", (req, res) => {
    if (user === null)
      return res.status(400).json({ error: "Provide user information first" });
    return res.status(200).json(user);
  })
  .get("/test", async (req, res) => {
    if (user == null)
      return res.status(400).json({ error: "Provide user information first" });
    let message = await model.predict(user);
    if (message == null) return res.status(400).json({ error: "API error" });
    return res.status(200).send(message);
  });

export default router;

function extractCars(inputString) {
  const regex = /\*\*(.*?)\*\*/gs;
  let match;

  while ((match = regex.exec(inputString)) !== null) {
    let car = match[1].trim();
    console.log("Recommended car: " + car);
    recommendedCars.push(car);
  }
}
