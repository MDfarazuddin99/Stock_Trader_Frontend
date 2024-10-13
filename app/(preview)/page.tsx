"use client";

import { ReactNode, useRef, useState } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { MasonryIcon, VercelIcon } from "@/components/icons";
import Link from "next/link";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MyPortfolio from "@/components/my-portfolio";
import DarkModeToggle from "../../components/dark-mode-toggle";
import BuyAndSellStock from "@/components/buy-sell-stock";
export default function Home() {
  const { sendMessage } = useActions();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    {
      title: "Show me",
      label: "my previous trade history",
      action: "Show me trade my history",
    },
    {
      title: "Get Me",
      label: "current stock value of TSLA",
      action: "Get stock information TSLA",
    },
  ];

  return (
    <main className="bg-background text-foreground">
      <div className="flex flex-row">
        <div className="flex flex-row w-full items-center justify-center mr-auto">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            SellScaleHood
          </h1>
        </div>
        <DarkModeToggle />
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[100vh] rounded-lg border"
      >
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={45}>
              <div className="flex h-full items-center justify-center p-6">
                <MyPortfolio />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={55}>
              <div className="flex h-full items-center justify-center p-6">
                {/* <span className="font-semibold">Buy and Sell Stock 💹</span> */}
                <BuyAndSellStock />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30}>
          <div className=" h-full items-center justify-center ">
            <div className="flex flex-row justify-center pb-20 h-dvh ">
              <div className="flex flex-col justify-between gap-4">
                <div
                  ref={messagesContainerRef}
                  className="flex flex-col gap-3 h-full w-dvw items-center overflow-y-scroll"
                >
                  {messages.length === 0 && (
                    <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
                      <div className="border  rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
                        <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                          {/* <VercelIcon size={16} />
                          <span>+</span>
                          <MasonryIcon /> */}
                          AI Chat Assistant
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {messages.map((message) => message)}
                  <div ref={messagesEndRef} />
                </div>

                <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] mb-4">
                  {messages.length === 0 &&
                    suggestedActions.map((action, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.01 * index }}
                        key={index}
                        className={index > 1 ? "hidden sm:block" : "block"}
                      >
                        <button
                          onClick={async () => {
                            setMessages((messages) => [
                              ...messages,
                              <Message
                                key={messages.length}
                                role="user"
                                content={action.action}
                              />,
                            ]);
                            const response: ReactNode = await sendMessage(
                              action.action
                            );
                            setMessages((messages) => [...messages, response]);
                          }}
                          className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                        >
                          <span className="font-medium">{action.title}</span>
                          <span className="text-zinc-500 dark:text-zinc-400">
                            {action.label}
                          </span>
                        </button>
                      </motion.div>
                    ))}
                </div>

                <form
                  className="flex flex-col gap-2 relative items-center"
                  onSubmit={async (event) => {
                    event.preventDefault();

                    setMessages((messages) => [
                      ...messages,
                      <Message
                        key={messages.length}
                        role="user"
                        content={input}
                      />,
                    ]);
                    setInput("");

                    const response: ReactNode = await sendMessage(input);
                    setMessages((messages) => [...messages, response]);
                  }}
                >
                  <input
                    ref={inputRef}
                    className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[500px] max-w-[calc(100dvw-32px)]"
                    placeholder="Send a message..."
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value);
                    }}
                  />
                </form>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
