import dotenv from "dotenv";
dotenv.config();
import Replicate from "replicate";
import { Ollama } from "ollama-node";

export default class AIModel {
  constructor() {
    this.replicate = new Replicate({
      auth: process.env.API_KEY,
    });
    this.ollama = new Ollama();
    this.ollama.setSystemPrompt(
      "You are a banking consultant for a leasing bank, and you have to recommend cars for the customer according to the specifications." +
        "The output has to be a list with the following format: **CAR 1**\nfurther information \n\n **CAR 2** and so on. Always recommend at least 10 cars according to the specification."
    );
  }

  async predict(user) {
    if (user === null) {
      throw new Error("User information is missing");
    }

    const input = {
      top_k: 70,
      top_p: 0.9,
      max_tokens: 900,
      min_tokens: 0,
      temperature: 0.6,
      presence_penalty: 1.15,
      frequency_penalty: 0.2,
      prompt: `Your customer is ${user.age} years old, with an income of ${user.income} per month. The customer wants to lease a new car of the type ${user.preferences}, with a ${user.environmentalAwareness} environmental awareness and the fuel type should be ${user.fuelType}. The car should be in the range of ${user.pricePreference} euros. You now have to recommend some cars for the customer according to the provided specifications.`,
      prompt_template:
        "system\n\nYou are a banking consultant for a leasing bank, and you have to recommend cars for the customer according to the specifications. user\n\n{prompt} assistant\n\n",
    };

    console.log("\t******** CALLING LLM FOR RECOMMENDATIONS ********");

    return this.evaluate_answer(input, input.prompt);
  }

  async refine(recommendations, userInput, user) {
    if (!userInput || !recommendations.length) {
      throw new Error("User input or recommendations are missing");
    }

    console.log("\t******** CALLING LLM FOR REFINEMENT ********");
    console.log(`Recommendations: ${recommendations}\nUserinput: ${userInput}`);

    const input = {
      top_k: 50,
      top_p: 0.9,
      max_tokens: 900,
      min_tokens: 0,
      temperature: 0.6,
      presence_penalty: 1.15,
      frequency_penalty: 0.2,
      prompt: `You already delivered the following recommendations: ${recommendations}. Now the customer ${user.age} years old, with an income of ${user.income} per month, has the following refinements about the recommendations: ${userInput}. Refine your car recommendations and provide the modified ones to the customer. Again, keep in mind to recommend the newest models with production dates near 2024. The output has to be a list with the following format: **CAR 1**\nfurther information \n\n **CAR 2** and so on. Always recommend at least 10 cars according to the specification.`,
      prompt_template:
        "system\n\nYou are a banking consultant for a leasing bank, and you have to recommend cars for the customer according to the specifications. user\n\n{prompt} assistant\n\n",
    };

    console.log("\t******** CALLING LLM FOR REFINEMENT ********");

    return this.evaluate_answer(input, input.prompt);
  }

  async carinfo(car) {
    if (!car) {
      throw new Error("car is missing");
    }

    const input = {
      top_k: 50,
      top_p: 0.9,
      max_tokens: 900,
      min_tokens: 0,
      temperature: 0.6,
      presence_penalty: 1.15,
      frequency_penalty: 0.2,
      prompt: `Provide details for the following car: ${car}.`,
      prompt_template:
        "system\n\nYou are a car consultant, and you have to give all the information for one car according to the given car. user\n\n{prompt} assistant\n\n",
    };

    console.log("\t******** CALLING LLM FOR CAR INFORMATION ********");
    console.log(car);
    return this.evaluate_answer(input, input.prompt);
  }

  async call_api(input) {
    try {
      let answer = "";
      for await (const event of this.replicate.stream(
        "meta/meta-llama-3-70b-instruct",
        { input }
      )) {
        answer += event.toString();
      }
      return "API \n" + answer;
    } catch (error) {
      console.error("API call failed:", error);
      throw new Error("API call failed");
    }
  }

  async call_selfHost(prompt) {
    try {
      await this.ollama.setModel("llama3");
      const result = await this.ollama.generate(prompt);
      return "SELFHOST \n" + result.output;
    } catch (error) {
      console.error("Self-hosted model call failed:", error);
      throw new Error("Self-hosted model call failed");
    }
  }

  async evaluate_answer(input, prompt) {
    try {
      const api_result = this.call_api(input);
      const selfHost_result = this.call_selfHost(prompt);
      const answer = await Promise.race([api_result, selfHost_result]);
      console.log(
        "***************************************" +
          "\n LLM-export: \n" +
          answer +
          "\n***************************************"
      );
      return answer;
    } catch (error) {
      console.error("Evaluation failed:", error);
      throw new Error("Evaluation failed");
    }
  }
}
