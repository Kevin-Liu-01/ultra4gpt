import { useSession } from "next-auth/react";
import { Key, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Typewriter from "typewriter-effect";

import OpenAI from "openai";
import { Box, Flex, Avatar, Text, Button, Tooltip } from "@radix-ui/themes";
import {
  UserRoundPenIcon,
  SendIcon,
  LoaderCircleIcon,
  UploadCloudIcon,
  MessageSquarePlusIcon,
  TrashIcon,
} from "lucide-react";

import Sidebar from "./sidebar";
import MenuBar from "./menuBar";

export default function Home() {
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

  const { data: session } = useSession();
  const [threads, setThreads] = useLocalStorage<ThreadType[]>("threads", []);
  const [currentThreadId, setCurrentThreadId] = useLocalStorage(
    "currentThreadId",
    0,
  );
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [openAIKey, setOpenAIKey, removeOpenAIKey] = useLocalStorage(
    "openAI_Key",
    "",
  );

  const openai = new OpenAI({
    apiKey: openAIKey,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    if (!threads[0]) {
      createThread();
    }
  }, [prompt]);

  const addMemory = (threadId: number, prompt: string, response: string) => {
    const newMemory: MemoryType = { prompt, response, model };
    setThreads(
      threads.map((thread) =>
        thread.id === threadId
          ? { ...thread, memory: [...thread.memory, newMemory] }
          : thread,
      ),
    );
  };

  const getCurrentDateTime = () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${month}/${day}/${year} at ${hours}:${minutes}`;
  };

  const createThread = async () => {
    const newThread: ThreadType = {
      id: Date.now(),
      name: `Conversation on ${getCurrentDateTime()}`,
      memory: [],
    };
    setThreads([...threads, newThread]);
    setCurrentThreadId(newThread.id);
  };

  const getCurrentThread = () => {
    return threads.find((thread) => thread.id === currentThreadId);
  };

  const gptText = async () => {
    const currentThread = await getCurrentThread();
    if (!currentThread) {
      return;
    }
    const context = currentThread.memory
      .map((item) => {
        return [
          { role: "user" as const, content: item.prompt },
          { role: "assistant" as const, content: item.response },
        ];
      })
      .flat();

    const stream = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...context,
        { role: "user", content: prompt },
      ],
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        fullResponse += chunk.choices[0]?.delta?.content;
      }
    }

    addMemory(currentThread.id, prompt, fullResponse);
    setPrompt("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!threads[0]) {
      createThread();
    }
    await gptText();
    setLoading(false);
  };

  const submitTooltip = () => {
    if (!prompt || !threads[0]) {
      return "Enter a prompt to start chatting!";
    } else {
      return "Send";
    }
  };

  return (
    <main className="grid h-screen grid-cols-1 bg-gray-950 md:col-span-2 md:grid-cols-2">
      <Sidebar
        openAIKey={openAIKey}
        setOpenAIKey={setOpenAIKey}
        threads={threads}
        setThreads={setThreads}
        currentThreadId={currentThreadId}
        setCurrentThreadId={setCurrentThreadId}
        createThread={createThread}
      />
      <Flex className="h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-red-500 to-red-600 p-4">
        <MenuBar model={model} setModel={setModel} />
        <Box className="h-full w-full overflow-hidden rounded-xl bg-gray-950">
          <Flex
            direction="column-reverse"
            className="scrollbar h-full w-full overflow-y-scroll"
          >
            <Flex className="flex-col gap-4 p-8 shadow-inner md:gap-8">
              {getCurrentThread()?.memory.length ? (
                getCurrentThread()?.memory?.map(
                  (
                    item: { prompt: string; response: string; model: string },
                    index: Key | null | undefined,
                  ) => (
                    <>
                      <Flex
                        key={index}
                        direction="column"
                        className="relative ml-auto gap-4 rounded-xl bg-white/10 p-4 text-white"
                      >
                        <Box className="absolute right-[-1.5rem] top-7 h-0 w-0 rotate-[-90deg] border-l-[1rem] border-r-[1rem] border-t-[1rem] border-l-transparent border-r-transparent border-t-red-500"></Box>
                        <Flex gap="3" direction="row" className="ml-auto">
                          <Text className="text-2xl font-bold">
                            {session ? session.user.name : "Guest"}
                          </Text>
                          <Avatar
                            radius="large"
                            variant="solid"
                            color="orange"
                            highContrast
                            src={session?.user?.image || ""}
                            fallback={<UserRoundPenIcon />}
                          />
                        </Flex>
                        <div className="text-lg">{item.prompt}</div>
                      </Flex>
                      <Flex
                        direction="column"
                        className="relative flex max-w-xs gap-4 rounded-xl bg-white/10 p-4 text-white"
                      >
                        <Box className="absolute left-[-1.5rem] top-7 h-0 w-0 rotate-90 border-l-[1rem] border-r-[1rem] border-t-[1rem] border-l-transparent border-r-transparent border-t-red-500"></Box>
                        <Flex gap="3" direction="row">
                          <Box className="relative size-10 rounded-lg bg-white">
                            <Image
                              src="/assets/openai.png"
                              alt="OpenAI"
                              fill
                              className="p-1"
                            />
                          </Box>
                          <Text className="text-2xl font-bold">
                            {item?.model}
                          </Text>
                        </Flex>
                        <div className="text-lg">{item?.response}</div>
                      </Flex>
                    </>
                  ),
                )
              ) : (
                <Flex
                  direction="column"
                  className="relative flex max-w-xs gap-4 rounded-xl bg-white/10 p-4 text-white"
                >
                  <Box className="absolute left-[-1.5rem] top-7 h-0 w-0 rotate-90 border-l-[1rem] border-r-[1rem] border-t-[1rem] border-l-transparent border-r-transparent border-t-red-500"></Box>
                  <Flex gap="3" direction="row">
                    <Box className="relative size-10 rounded-lg bg-white">
                      <Image
                        src="/assets/openai.png"
                        alt="OpenAI"
                        fill
                        className="p-1"
                      />
                    </Box>
                    <Text className="text-2xl font-bold">{model}</Text>
                  </Flex>
                  <div className="text-lg">
                    <Typewriter
                      options={{
                        loop: false,
                        delay: 20,
                        cursor: "",
                        autoStart: true,
                        strings:
                          "Hi! I'm ChatGPT. Write anything or upload anything below to get started.",
                      }}
                    />
                  </div>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Box>
        <Flex
          direction="row"
          align="center"
          justify="center"
          className="w-full items-center gap-4 pt-4"
        >
          <label
            htmlFor="doc"
            className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-3 py-2"
          >
            <Flex className="gap-3" align="center">
              <UploadCloudIcon className="size-8 text-gray-700" />
              <Flex direction="column">
                <h4 className="text-sm font-semibold text-gray-700">Upload</h4>
                <span className="text-xs text-gray-500">Any File!</span>
              </Flex>
            </Flex>
            <input
              type="file"
              id="doc"
              name="doc"
              hidden
              onChange={(e) => setFile(e?.target?.files?.[0] || null)}
            />
          </label>
          <input
            className="rounded-xl p-3 text-lg text-black"
            placeholder="Enter a prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Tooltip content={submitTooltip()}>
            <button
              onClick={handleSubmit}
              disabled={!prompt || !threads[0]}
              className="rounded-xl bg-gray-900 p-3 font-semibold text-white no-underline transition hover:bg-gray-800 disabled:bg-gray-700 disabled:text-gray-500"
            >
              {loading ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                <SendIcon />
              )}
            </button>
          </Tooltip>
          {/* <Tooltip content="Create a new conversation">
            <Button onClick={createThread} className="mb-4">
              <MessageSquarePlusIcon />
            </Button>
          </Tooltip> */}
        </Flex>
      </Flex>
    </main>
  );
}
