import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
dotenv.config();
// OPEN AI STUFF
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const createAIReply = async (prompt) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0.9,
    max_tokens: 100,
  });
  return response.data.choices[0].text;
};

export { createAIReply };
