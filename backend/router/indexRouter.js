import express from "express";
import User from "../objects/User.js";
import Car from "../objects/Car.js";
import AIModel from "../objects/AIModel.js";

const router = express.Router();

let receivedAnswers = [];
let recommendedCars = [];
var user = null;

const model = new AIModel();

// Dummy data for demonstration purposes
const dummyData = {
  user: {
    age: 30,
    income: 50000,
    preferences: ["SUV", "Electric"],
    environmentalAwareness: 8,
    fuelType: "Electric",
    pricePreference: "Medium",
  },
  recommendedCars: ["Tesla Model 3", "Nissan Leaf", "Chevrolet Bolt EV"],
};

router
  .post("/user", (req, res) => {
    if (!req.query)
      return res
        .status(400)
        .json({ error: "User information has to be provided" });

    user = new User(
      req.query.age,
      req.query.income,
      req.query.preferences,
      req.query.environmentalAwareness,
      req.query.fuelType,
      req.query.pricePreference
    );
    console.log(user);
    receivedAnswers = [];
    recommendedCars = [];
    return res
      .status(201)
      .json({ message: "User information has been stored" });
  })
  .post("/questions", async (req, res) => {
    const { answers } = req.body;
    if (!Array.isArray(answers))
      return res
        .status(400)
        .json({ error: "Answers must be provided in an array" });

    receivedAnswers.push(...answers);

    try {
      const message = await model.predictFromAnswers(receivedAnswers);
      if (message == null) throw new Error("API error");

      extractCars(message);
      res.status(201).json({ message: "Answers received" });
    } catch (error) {
      console.log("Using dummy data due to API error");
      extractCars("**Tesla Model 3** **Nissan Leaf** **Chevrolet Bolt EV**");
      res.status(201).json({ message: "Answers received (dummy data)" });
    }
  })
  .get("/recommendations", async (req, res) => {
    if (user == null)
      return res.status(400).json({ error: "Provide user information first" });

    try {
      let message = await model.predict(user);
      if (message == null) throw new Error("API error");

      extractCars(message);
      console.log("Number of Cars after extraction: " + recommendedCars.length);
      if (!recommendedCars.length)
        return res.status(400).json({ error: "No recommendations found" });
      return res.status(200).json({ recommendedCars });
    } catch (error) {
      console.log("Using dummy data due to API error");
      recommendedCars = [...dummyData.recommendedCars];
      return res.status(200).json({ recommendedCars });
    }
  })
  .get("/userinfo", (req, res) => {
    if (user === null)
      return res.status(400).json({ error: "Provide user information first" });
    return res.status(200).json(user);
  })
  .post("/getcardetails", async (req, res) => {
    const { carName } = req.body;
    try {
      const carDetails = await model.carinfo(carName);
      if (!carDetails) {
        return res.status(404).json({ error: "Car details not found" });
      }
      return res.status(200).json({ carDetails });
    } catch (error) {
      console.error("Error getting car details:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  })
  .post("/refine", async (req, res) => {
    console.log("------------DEBUG CHAT ----------------");
    if (recommendedCars.length == 0)
      return res.status(400).json({ error: "No recommendations found" });
    try {
      let message = await model.refine(
        recommendedCars,
        req.query.userInput,
        user
      );

      if (message == null) throw new Error("API error");

      extractCars(message);
      if (!recommendedCars.length)
        return res.status(400).json({ error: "No recommendations found" });
      return res.status(200).json({ recommendedCars });
    } catch (error) {
      console.log("Using dummy data due to API error");
      recommendedCars = [...dummyData.recommendedCars];
      return res.status(200).json({ recommendedCars });
    }
  })
  .get("/cars", (req, res) => {
    return res.status(200).json({ recommendedCars });
  })
  .delete("/user", (req, res) => {
    user = null;
    receivedAnswers = [];
    recommendedCars = [];
    return res.status(200).json({
      message: "User information and recommendations have been cleared",
    });
  })
  .get("/test", async (req, res) => {
    if (user == null)
      return res.status(400).json({ error: "Provide user information first" });

    try {
      let message = await model.refine(
        recommendedCars,
        req.query.refined,
        user
      );
      if (message == null) throw new Error("API error");
      return res.status(200).send(message);
    } catch (error) {
      console.log("Using dummy data due to API error");
      return res
        .status(200)
        .send("**Tesla Model 3** **Nissan Leaf** **Chevrolet Bolt EV**");
    }
  });

export default router;

function extractCars(inputString) {
  const regex = /\*\*(.*?)\*\*/gs;
  let match;
  if (recommendedCars.length != 0) recommendedCars = [];
  while ((match = regex.exec(inputString)) !== null) {
    let car = match[1].trim();
    console.log("Recommended car: " + car);

    // Check if car is already recommended
    if (!recommendedCars.includes(car)) {
      recommendedCars.push(car);
    }
  }
}
