import { Flex, Tooltip } from "@radix-ui/themes";
import { TrashIcon, BotIcon, BotMessageSquareIcon } from "lucide-react";

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

export default function FilePreview({
  thread,
  threads,
  currentThreadId,
  setCurrentThreadId,
  setThreads,
}: {
  thread: ThreadType;
  threads: ThreadType[];
  currentThreadId: number;
  setCurrentThreadId: (threadId: number) => void;
  setThreads: (threads: any) => void;
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
    <Flex
      key={thread.id}
      align="center"
      onClick={() => switchThread(thread.id)}
      className={`w-full cursor-pointer rounded-lg p-2 text-gray-950 transition-all ${thread.id == currentThreadId ? "bg-red-300 font-bold hover:bg-red-200" : "bg-red-400 hover:bg-red-500 hover:font-semibold"}`}
    >
      {thread.id == currentThreadId ? (
        <BotMessageSquareIcon className="mr-2" />
      ) : (
        <BotIcon className="mr-2" />
      )}
      {thread.name}
      <Tooltip content={`Delete ${thread.name}?`}>
        <button
          onClick={() => deleteThread(thread.id)}
          className="z-10 ml-auto rounded-md bg-white p-1 text-gray-950 transition-all hover:bg-gray-100 hover:text-red-600 hover:opacity-90"
        >
          <TrashIcon />
        </button>
      </Tooltip>
    </Flex>
  );
}
