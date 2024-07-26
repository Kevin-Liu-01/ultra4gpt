//@ts-nocheck
import { Key, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";

import OpenAI from "openai";
import { Box, Flex } from "@radix-ui/themes";

//Components
import Sidebar from "./sideBar";
import MenuBar from "./chat_components/menuBar";
import InputBar from "./chat_components/inputBar";
import UserBubble from "./chat_components/user_chatbubble";
import ModelBubble from "./chat_components/model_chatbubble";
import DefaultBubble from "./chat_components/default_chatbubble";

//File Management
import convertFile from "./file_management/fileConverter";
import FilePreview from "./file_management/filePreview";
import whichConvertedFile from "./gpt_API_functions/fileConverted_Selector";

//GPT API Functions
import modelSwitcher from "./gpt_API_functions/modelSwitcher";
import getCurrentDateTime from "./gpt_API_functions/getCurrentDateTime";

export default function Chat(image: { image: string }) {
  const router = useRouter();
  //TYPES
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

  type ConvertedFileType = {
    type: string;
    name: string;
    result: string;
  };

  //MEMORY MANAGEMENT STATES
  const [threads, setThreads] = useLocalStorage<ThreadType[]>("threads", []);
  const [currentThreadId, setCurrentThreadId] = useLocalStorage(
    "currentThreadId",
    0,
  );

  //INPUT STATES
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState({ image: "", name: "" });
  const [convertedFile, setConvertedFile] = useState<ConvertedFileType | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gpt-3.5-turbo");

  //OPENAI STATES
  const [openAIKey, setOpenAIKey, removeOpenAIKey] = useLocalStorage(
    "openAI_Key",
    "",
  );

  const openai = new OpenAI({
    apiKey: openAIKey,
    dangerouslyAllowBrowser: true,
  });

  //USEEFFECT HOOKS
  useEffect(() => {
    if (!threads[0]) {
      createThread();
    }
  }, [prompt]);

  useEffect(() => {
    if (file) {
      removeImage();
      setImageFile({ image: "", name: "" });
      convertFile(file, setConvertedFile);
    }
  }, [file]);

  useEffect(() => {
    if (image.image) {
      setImageFile({ image: image.image, name: "Your Picture" });
      setFile(null);
    }
    console.log(imageFile);
  }, [image]);

  const removeImage = () => {
    router.replace("/", undefined);
  };

  const addMemory = (
    threadId: number,
    prompt: string,
    file: string,
    response: string,
  ) => {
    const newMemory: MemoryType = { prompt, file, response, model };
    setThreads(
      threads.map((thread) =>
        thread.id === threadId
          ? { ...thread, memory: [...thread.memory, newMemory] }
          : thread,
      ),
    );
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
      model:
        file || imageFile.image ? modelSwitcher(file, model, setModel) : model,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        ...context,
        // { role: "user", content: prompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            whichConvertedFile(convertedFile, imageFile),
          ],
        },
      ],
      stream: true,
      // max_tokens: 300
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        fullResponse += chunk.choices[0]?.delta?.content;
      }
    }

    addMemory(
      currentThread.id,
      prompt,
      imageFile.image ? imageFile.name : file?.name || "",
      fullResponse,
    );
    setPrompt("");
    setFile(null);
    setConvertedFile(null);
    setImageFile({ image: "", name: "" });
    removeImage();
  };

  return (
    <main className="relative h-screen overflow-hidden bg-gray-950 sm:grid sm:grid-cols-3">
      <Sidebar
        openAIKey={openAIKey}
        setOpenAIKey={setOpenAIKey}
        threads={threads}
        setThreads={setThreads}
        currentThreadId={currentThreadId}
        setCurrentThreadId={setCurrentThreadId}
        createThread={createThread}
      />
      <Flex className="h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-red-500 to-red-600 p-3.5 sm:col-span-2 sm:p-4">
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
                    item: {
                      prompt: string;
                      file: string;
                      response: string;
                      model: string;
                    },
                    index: Key | null | undefined,
                  ) => (
                    <>
                      <UserBubble item={item} index={index} />
                      <ModelBubble item={item} />
                    </>
                  ),
                )
              ) : (
                <DefaultBubble model={model} />
              )}
              <FilePreview
                imageFile={imageFile}
                file={file}
                setFile={setFile}
              />
            </Flex>
          </Flex>
        </Box>
        <InputBar
          loading={loading}
          threads={threads}
          prompt={prompt}
          setPrompt={setPrompt}
          setFile={setFile}
          setLoading={setLoading}
          createThread={createThread}
          gptText={gptText}
        />
      </Flex>
    </main>
  );
}
