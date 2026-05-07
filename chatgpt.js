import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function run() {
  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "user",
        content: "Create a React Hero Section"
      }
    ],
  });

  console.log(response.choices[0].message.content);
}

run();