import { StreamingTextResponse, LangChainStream } from "ai";
import { CallbackManager } from "langchain/callbacks";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";

import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export const runtime = "edge";

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer in markdown:`;

export default async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const json = await req.json();
  console.log(json);
  // const { messages } = await req.json();
  const { messages } = json;

  const history = messages.map((m) => {
    return m.role === "user"
      ? new HumanChatMessage(m.content)
      : new AIChatMessage(m.content);
  });

  // OpenAI recommends replacing newlines with spaces for best results
  const prompt = history.pop().text.trim().replaceAll("\n", " ");

  console.log({ prompt, history });

  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME || "");

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    {
      pineconeIndex,
      textKey: "text",
      namespace: process.env.PINECONE_NAME_SPACE,
    }
  );

  const { stream, handlers } = LangChainStream();

  const model = new OpenAI({
    streaming: true,
    modelName: "gpt-4",
    openAIApiKey: process.env.OPENAI_API_KEY,
    // callbackManager: CallbackManager.fromHandlers(handlers),
    callbacks: [handlers],
    temperature: 0, // increase temepreature to get more creative answers
  });

  /*
  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  });
  chain.call({ query: prompt }).catch(console.error);
  */
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
    }
  );

  chain
    .call({
      question: prompt,
      chat_history: history,
    })
    .then((values) => {
      // NOTE: This relies on current broken behaviour of handleChainEnd not
      // being called automatically by handlers.  TODO.
      const meta = JSON.stringify({ ...values, text: "ALREADY_SENT" });
      console.log({ values });
      handlers.handleLLMNewToken("\n__META_JSON__\n" + meta);
      handlers.handleChainEnd();
    });

  return new StreamingTextResponse(stream);
}
