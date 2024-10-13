import { Message, TextStreamMessage } from "@/components/message";
import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateId } from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { StockInfoView } from "@/components/stock-info-view";
import { TradeHistoryView } from "@/components/trade-history-view";

// Function to fetch stock price
const fetchStockPrice = async (symbol: string) => {
  const response = await fetch(`http://127.0.0.1:5000/api/stock-price?symbol=${symbol}`);
  if (!response.ok) {
    throw new Error('Failed to fetch stock price');
  }
  return response.json();
};

// Function to fetch trade history
const fetchTradeHistory = async () => {
  const response = await fetch('http://127.0.0.1:5000/api/trade-history');
  if (!response.ok) {
    throw new Error('Failed to fetch trade history');
  }
  return response.json();
};

const sendMessage = async (message: string) => {
  "use server";

  const messages = getMutableAIState<typeof AI>("messages");

  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: "user", content: message },
  ]);

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value} />;

  const { value: stream } = await streamUI({
    model: openai("gpt-4o"),
    system: `\
      - you are a friendly assistant that provides information about stock prices and trade history
      - reply in lower case
    `,
    messages: messages.get() as CoreMessage[],
    text: async function* ({ content, done }) {
      if (done) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          { role: "assistant", content },
        ]);

        contentStream.done();
      } else {
        contentStream.update(content);
      }

      return textComponent;
    },
    tools: {
      searchStockPrice: {
        description: "search for a stock price and display basic information",
        parameters: z.object({
          symbol: z.string().describe("The stock symbol to search for"),
        }),
        generate: async function* ({ symbol }) {
          const toolCallId = generateId();

          try {
            const stockInfo = await fetchStockPrice(symbol);

            messages.done([
              ...(messages.get() as CoreMessage[]),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId,
                    toolName: "searchStockPrice",
                    args: { symbol },
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "searchStockPrice",
                    toolCallId,
                    result: `Stock information for ${symbol} has been fetched and is displayed on the screen`,
                  },
                ],
              },
            ]);

            return <Message role="assistant" content={<StockInfoView stockInfo={stockInfo} />} />;
          } catch (error) {
            console.error('Error fetching stock price:', error);
            return <Message role="assistant" content="Sorry, I couldn't fetch the stock information at the moment. Please try again later." />;
          }
        },
      },
      viewTradeHistory: {
        description: "view the history of trades",
        parameters: z.object({}),
        generate: async function* ({}) {
          const toolCallId = generateId();

          try {
            const tradeHistory = await fetchTradeHistory();

            messages.done([
              ...(messages.get() as CoreMessage[]),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId,
                    toolName: "viewTradeHistory",
                    args: {},
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "viewTradeHistory",
                    toolCallId,
                    result: `Trade history has been fetched and is displayed on the screen`,
                  },
                ],
              },
            ]);

            return <Message role="assistant" content={<TradeHistoryView trades={tradeHistory} />} />;
          } catch (error) {
            console.error('Error fetching trade history:', error);
            return <Message role="assistant" content="Sorry, I couldn't fetch the trade history at the moment. Please try again later." />;
          }
        },
      },
    },
  });

  return stream;
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    if (done) {
      // save to database
    }
  },
});