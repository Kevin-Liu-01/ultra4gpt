import { Flex, Box, Tooltip } from "@radix-ui/themes";
import { TrashIcon, MessageSquarePlusIcon } from "lucide-react";

type MemoryType = {
  prompt: string;
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
  const switchThread = (threadId: number) => {
    setCurrentThreadId(threadId);
  };

  const deleteThread = async (threadId: number) => {
    await setThreads(threads.filter((thread) => thread.id !== threadId));
    // If the current thread is deleted, set the current thread to any thread remaining using switchthread
    setCurrentThreadId(threads[0]?.id || 0);
  };

  return (
    <main className="flex h-screen w-full flex-col justify-center gap-4 bg-gradient-to-b from-red-500 to-red-600 p-4">
      <input
        className="w-full max-w-lg rounded-xl bg-gray-950 p-4 text-lg text-white"
        placeholder="Enter OpenAI API Key..."
        value={openAIKey}
        onChange={(e) => setOpenAIKey(e.target.value)}
      />
      <Tooltip content="Create a new conversation">
        <Flex
          onClick={createThread}
          justify="center"
          align="center"
          className="w-full gap-3 rounded-lg bg-white p-3 hover:opacity-80"
        >
          New Conversation
          <MessageSquarePlusIcon />
        </Flex>
      </Tooltip>
      <Box className="h-full w-full overflow-hidden rounded-xl bg-gray-950">
        <Flex
          direction="column"
          className="scrollbar h-full w-full max-w-lg overflow-y-scroll"
        >
          <Flex className="flex-col gap-3 p-4 shadow-inner">
            {threads.toReversed().map((thread) => (
              // thread.memory.length > 0 &&
              <Flex
                key={thread.id}
                align="center"
                onClick={() => switchThread(thread.id)}
                className={`w-full cursor-pointer rounded-lg p-3 ${thread.id == currentThreadId ? "bg-red-300" : "bg-red-400"}`}
              >
                {thread.name}
                <button
                  onClick={() => deleteThread(thread.id)}
                  className="ml-auto"
                >
                  <TrashIcon />
                </button>
              </Flex>
            ))}{" "}
          </Flex>
        </Flex>
      </Box>
      <Flex direction="column" className="rounded-lg bg-red-700 p-3">
        <p className="text-4xl font-extrabold text-white">
          ULTRA<span className="text-gray-950">4</span>GPT
        </p>
        <p className="text-sm text-white">
          This is a tool used to access OpenAI's API (for those sweet unlimited
          credits). Enter your API key to get started. This is a demo project by{" "}
          <a
            href="https://github.com/Kevin-Liu-01"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400"
          >
            @Kevin-Liu-01
          </a>
          .
        </p>
      </Flex>
    </main>
  );
}
