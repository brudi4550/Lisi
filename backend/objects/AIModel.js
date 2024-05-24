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
      "You are a banking consulting for a leasing bank and you have to recommend cars for the customer, according to the specifications." +
        "The output has to be a list with the following format: **CAR 1**\nfurther information \n\n **CAR 2** and so on. Always recommend at least 10 cars according to the specification."
    );
  }

  async predict(user) {
    if (user === null) return; //TODO: implement error handling
    const input = {
      top_k: 70,
      top_p: 0.9,
      max_tokens: 512,
      min_tokens: 0,
      temperature: 0.6,
      presence_penalty: 1.15,
      frequency_penalty: 0.2,
      prompt:
        "Your customer is " +
        user.age +
        "years old, with an income of" +
        user.income +
        " per month.The customer wants to lease a new car of the type" +
        user.preferences +
        ", with a " +
        user.environment +
        "environmental awareness and the fuel type should be " +
        user.fuelType +
        ". The car should be in the range of " +
        user.priceRange +
        "euros. You now have to recommend some cars for the customer, according to the provided specifications. ",
      //"euros. You now have to recommend some cars for the customer, according to the provided specifications. Keep in mind to recommend the newest models with production dates near 2024. The output has to be a list with the following format: **CAR 1**\nfurther information \n\n **CAR 2** and so on. Always recommend at least 10 cars according to the specification.",
      prompt_template:
        "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a banking consulting for a leasing bank and you have to recommend cars for the customer, according to the specifications.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
    };

    console.log("\t******** CALLING LLM FOR RECOMMENDATIONS ********");
    let prompt =
      "Your customer is " +
      user.age +
      "years old, with an income of" +
      user.income +
      " per month.The customer wants to lease a new car of the type" +
      user.preferences +
      ", with a " +
      user.environmentalAwareness +
      "environmental awareness and the fuel type should be " +
      user.fuelType +
      ". The car should be in the range of " +
      user.pricePreference +
      "euros. You now have to recommend some cars for the customer, according to the provided specifications. ";

    var api_result = this.call_api(input);
    var selfHost_result = this.call_selfHost(prompt);
    var answer;

    await Promise.race([api_result, selfHost_result]).then(
      (results) => (answer = results)
    );

    return answer;
  }

  async refine(recommendations, userinput, user) {
    //if (userinput === null || recommendations === null) return; //TODO error handling
    console.log("\t******** CALLING LLM FOR REFINEMENT ********");
    console.log(
      "Recommendations: " + recommendations + "\nUserinput: " + userinput
    );
    const input = {
      top_k: 50,
      top_p: 0.9,
      max_tokens: 512,
      min_tokens: 0,
      temperature: 0.6,
      presence_penalty: 1.15,
      frequency_penalty: 0.2,
      prompt:
        "You already delivered the following recommendations: " +
        recommendations +
        "Now the customer " +
        user +
        " has the following refinements about the recommendations: " +
        userinput +
        "Refine your car recommendations and provide the modified ones to the customer. Again keep in mind to recommend the newest models with production dates near 2024. The output has to be a list with the following format: **CAR 1**\nfurther information \n\n **CAR 2** and so on. Always recommend at least 10 cars according to the specification.",
      prompt_template:
        "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a banking consulting for a leasing bank and you have to recommend cars for the customer, according to the specifications.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
    };

    let prompt =
      "You already delivered the following recommendations: " +
      recommendations +
      "Now the customer " +
      user +
      " has the following refinements about the recommendations: " +
      userinput +
      "Refine your car recommendations and provide the modified ones to the customer. Again keep in mind to recommend the newest models with production dates near 2024. ";

    var api_result = this.call_api(input);
    var selfHost_result = this.call_selfHost(prompt);
    var answer;

    await Promise.race([api_result, selfHost_result]).then(
      (results) => (answer = results)
    );

    return answer;
  }

  async call_api(input) {
    var answer = "";
    for await (const event of this.replicate.stream(
      "meta/meta-llama-3-70b-instruct",
      {
        input,
      }
    )) {
      answer += event.toString();
    }

    answer = "API \n" + answer;
    console.log(
      "***************************************" +
        "\n LLM-export: \n" +
        answer +
        "\n***************************************"
    );
    return answer;
  }

  async call_selfHost(prompt) {
    await this.ollama.setModel("llama3");
    var answer = "SELFHOST \n" + (await this.ollama.generate(prompt)).output;
    console.log(
      "***************************************" +
        "\n LLM-export: \n" +
        answer +
        "\n***************************************"
    );
    return answer;
  }
}
