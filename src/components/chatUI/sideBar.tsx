/// <reference no-default-lib="true"/>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useState } from "react";
import { Flex, Tooltip } from "@radix-ui/themes";
import {
  ChevronsUpIcon,
  ChevronsDownIcon,
  MessageSquarePlusIcon,
  KeyIcon,
} from "lucide-react";
import ConversationSelector from "./sidebar/conversationSelector";
import Blurb from "./sidebar/blurb";

type MemoryType = {
  prompt: string;
  file: string;
  response: string;
  model: string;
};
type ThreadType = {
  id: number;
  name: string;
  memory: MemoryType[];
};

export default function Sidebar({
  openAIKey,
  setOpenAIKey,
  threads,
  setThreads,
  currentThreadId,
  setCurrentThreadId,
  createThread,
}: {
  openAIKey: string;
  setOpenAIKey: (key: string) => void;
  threads: ThreadType[];
  setThreads: (threads: ThreadType[]) => void;
  currentThreadId: number;
  setCurrentThreadId: (threadId: number) => void;
  createThread: () => void;
}) {
  const [showSideBar, setShowSideBar] = useState(false);

  //button to toggle sidebar. make it stick out from the sidebar
  const ToggleSideBar = () => {
    //make it appear on right side of element and stick out when closed, and inverted when open
    return (
      <Flex
        onClick={() => setShowSideBar(!showSideBar)}
        align="center"
        justify="center"
        className="visible absolute left-[-5rem] top-[45%] z-50 size-[7.5rem] rotate-90 cursor-pointer rounded-full border-[5px] border-red-500 bg-gray-100 p-2 text-gray-950 sm:invisible dark:bg-gray-950 dark:text-gray-100"
      >
        {showSideBar ? (
          <ChevronsDownIcon className="mb-[3.75rem] size-6 animate-bounce" />
        ) : (
          <ChevronsUpIcon className="mb-[3.75rem] size-6 animate-bounce" />
        )}
      </Flex>
    );
  };

  return (
    <>
      <ToggleSideBar />
      <Flex
        className={`absolute z-20 transition-all sm:relative ${showSideBar ? "" : "translate-x-[-100%] sm:translate-x-0"}`}
      >
        <Flex
          direction="column"
          justify="center"
          className="relative h-screen w-full gap-4 bg-gradient-to-b from-red-500 to-red-600 p-4"
        >
          <Tooltip content="Enter your OpenAI API Key here">
            <Flex
              align="center"
              className="w-full max-w-lg rounded-xl bg-gray-950 text-lg text-white"
            >
              <KeyIcon className="mx-3" />
              <input
                className="my-2 mr-2 w-full rounded-lg bg-gray-800 p-1 px-2"
                placeholder="Enter OpenAI API Key..."
                value={openAIKey}
                onChange={(e) =>
                  setOpenAIKey((e.target as HTMLInputElement).value)
                }
              />
            </Flex>
          </Tooltip>
          <Tooltip content="Create a new conversation">
            <Flex
              onClick={createThread}
              justify="center"
              align="center"
              className="w-full cursor-pointer gap-3 rounded-xl bg-gray-100 p-3 font-semibold transition-all hover:bg-gray-200 hover:font-bold dark:bg-gray-950 dark:hover:bg-gray-900"
            >
              <MessageSquarePlusIcon />
              New Conversation
            </Flex>
          </Tooltip>
          <Flex className="h-full w-full overflow-hidden rounded-xl bg-gray-950">
            <Flex
              direction="column"
              className="scrollbar h-full w-full overflow-y-scroll"
            >
              <Flex direction="column" className="gap-3 p-4 shadow-inner">
                {threads.toReversed().map((thread) => (
                  // thread.memory.length > 0 &&
                  <ConversationSelector
                    thread={thread}
                    threads={threads}
                    currentThreadId={currentThreadId}
                    setCurrentThreadId={setCurrentThreadId}
                    setThreads={setThreads}
                  />
                ))}
              </Flex>
            </Flex>
          </Flex>
          <Blurb />
        </Flex>
      </Flex>
    </>
  );
}
