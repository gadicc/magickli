import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  BytesOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers";

// import { vectorStore as createVectorStore } from "../openai"; // MongoDB
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

export const runtime = "edge";

const combineDocumentsFn = (docs: Document[]) => {
  // console.log("combineDocsFn", docs);
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join("\n\n");
};

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === "user") {
      return `Human: ${message.content}`;
    } else if (message.role === "assistant") {
      return `Assistant: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  });
  return formattedDialogueTurns.join("\n");
};

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE
);

const ANSWER_TEMPLATE = `You are a helpful assistant.
Use the following context to supplement your current knowledge in answering the question at the end.
In the case of a conflict, information from the context takes precedence.

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

export interface ChatMessageMetaData {
  sources: {
    pageContent: string;
    metadata: Record<string, unknown>;
  }[];
}

/**
 * This handler initializes and calls a retrieval chain. It composes the chain using
 * LangChain Expression Language. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#conversational-retrieval-chain
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    const model = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 1, // increase temepreature to get more creative answers
      /*
      streaming: true,
      openAIApiKey: process.env.OPENAI_API_KEY,
      // callbackManager: CallbackManager.fromHandlers(handlers),
      callbacks: [handlers],
      */
    });

    // const vectorStore = createVectorStore();

    // Uses PINECONE_API_KEY and PINECONE_ENVIRONMENT
    const { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } = process.env;
    if (!PINECONE_INDEX_NAME || !PINECONE_NAME_SPACE) {
      return NextResponse.json(
        { message: "Missing PINECONE_INDEX_NAME or PINECONE_NAME_SPACE" },
        { status: 500 }
      );
    }
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex, namespace: PINECONE_NAME_SPACE }
    );

    /**
     * We use LangChain Expression Language to compose two chains.
     * To learn more, see the guide here:
     *
     * https://js.langchain.com/docs/guides/expression_language/cookbook
     *
     * You can also use the "createRetrievalChain" method with a
     * "historyAwareRetriever" to get something prebaked.
     */
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });

    const retriever = vectorStore.asRetriever({
      searchType: "mmr",
      searchKwargs: { fetchK: 10, lambda: 0.25 },
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            // console.log("hadleRetrieverEnd", documents);
            resolveWithDocuments(documents);
          },
        },
      ],
    });

    /*
    retriever.invoke("neophyte");
    const docs = await documentPromise;
    console.log("docs", docs);
    return NextResponse.json({ message: "Success" }, { status: 200 });
    */

    const retrievalChain = retriever.pipe(combineDocumentsFn);

    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ]);

    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new BytesOutputParser(),
    ]);

    const streamArgs = {
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
    };
    // console.log(streamArgs);

    const stream = await conversationalRetrievalQAChain.stream(streamArgs);

    const documents = await documentPromise;

    const sourcesData = documents.map((doc) => {
      return {
        pageContent: doc.pageContent,
        // pageContent: doc.pageContent.slice(0, 50) + "...",
        metadata: doc.metadata,
      };
    });

    // console.log("Sources data:", sourcesData);
    // return NextResponse.json({ message: "Success" }, { status: 200 });

    const meta: ChatMessageMetaData = { sources: sourcesData };

    const encoder = new TextEncoder();
    const prepend = encoder.encode(
      "\n__META_JSON__\n" + JSON.stringify(meta) + "\n__META_JSON__\n"
    );
    const transform = new TransformStream({
      start(controller) {
        controller.enqueue(prepend);
      },
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
    });

    return new StreamingTextResponse(stream.pipeThrough(transform));
  } catch (e) {
    return NextResponse.json({ message: "Error Processing" }, { status: 500 });
  }
}
