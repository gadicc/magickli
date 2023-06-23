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

const QA_PROMPT = `You are a helpful assistant.
Use the following context to supplement your current knowledge in answering the question at the end.
In the case of a conflict, information from the context takes precedence.

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
      : new AIChatMessage(m.content.split("\n__META_JSON__\n")[0]);
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
    temperature: 1, // increase temepreature to get more creative answers
  });

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
    .catch((error) => {
      // Note, this does't actually catch the error, or do anything
      // But we'll find where to put this code in the future TODO
      let errorData;
      if (error instanceof Error)
        errorData = {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause,
        };
      else errorData = JSON.parse(JSON.stringify(error));
      const meta = JSON.stringify({ $error: errorData });
      handlers.handleLLMNewToken("\n__META_JSON__\n" + meta);
      handlers.handleChainEnd();
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
