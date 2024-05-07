import dotenv from "dotenv";
dotenv.config();
import Replicate from "replicate";

export default class AIModel {
  constructor() {
    this.replicate = new Replicate({
      auth: process.env.API_KEY,
    });
  }

  async predict(user) {
    if (user === null) return; //TODO: implement error handling
    const input = {
      top_k: 50,
      top_p: 0.9,
      max_tokens: 512,
      min_tokens: 0,
      temperature: 0.6,
      presence_penalty: 1.15,
      frequency_penalty: 0.2,
      prompt:
        "You are a banking consulting for a leasing bank. Your customer is " +
        user.age +
        "years old, with an income of" +
        user.income +
        " per month and a dailyCommute of " +
        user.dailyCommute +
        "km. The customer wants to lease a new car of the type" +
        user.preferences +
        ", with a " +
        user.environment +
        "environmental impact and the fuel type should be " +
        user.fuelType +
        ". You now have to recommend some cars for the customer, according to the provided specifications.",
      prompt_template:
        "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful assistant<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
    };
    var answer = "";
    for await (const event of this.replicate.stream(
      "meta/meta-llama-3-70b-instruct",
      {
        input,
      }
    )) {
      answer += event.toString();
    }
    console.log(
      "*************************************** \n LLM-export: \n" +
        answer +
        "\n***************************************"
    );
    return answer;
  }
}
