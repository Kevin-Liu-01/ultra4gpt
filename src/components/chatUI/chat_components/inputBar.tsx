// @ts-nocheck
import Link from "next/link";
import { Flex, Tooltip } from "@radix-ui/themes";
import {
  CameraIcon,
  SendIcon,
  LoaderCircleIcon,
  UploadCloudIcon,
} from "lucide-react";

export default function InputBar({
  loading,
  threads,
  prompt,
  setPrompt,
  setFile,
  setLoading,
  createThread,
  gptText,
}: {
  loading: boolean;
  threads: any;
  prompt: string;
  setPrompt: (prompt: string) => void;
  setFile: (file: File | null) => void;
  setLoading: (loading: boolean) => void;
  createThread: () => void;
  gptText: () => void;
}) {
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
      return "You cannot submit an empty prompt!";
    } else if (loading) {
      return "Loading...";
    } else {
      return "Send";
    }
  };

  const handleClick = (event) => {
    const { target = {} } = event || {};
    target.value = "";
  };

  return (
    <Flex
      direction="row"
      align="center"
      justify="center"
      className="w-full items-center gap-3 pt-3.5 text-gray-950 sm:gap-4 sm:pt-4 dark:text-white"
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
          accept="image/png, image/jpg, image/jpeg, image/gif"
          id="doc"
          name="doc"
          hidden
          onChange={(e) => setFile(e?.target?.files?.[0] || null)}
          onClick={handleClick}
        />
      </label>
      <Link
        href="/camera"
        className="rounded-xl border-[2px] border-dashed border-gray-500 bg-gray-900 p-3 font-semibold text-gray-400 no-underline transition hover:bg-gray-800 disabled:bg-gray-700 disabled:text-gray-500"
      >
        <CameraIcon />
      </Link>
      <input
        className="w-full rounded-xl bg-gray-200 p-3 text-lg text-gray-950 placeholder:text-gray-500 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600"
        placeholder="Enter a prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Tooltip content={submitTooltip()}>
        <button
          onClick={handleSubmit}
          disabled={!prompt || !threads[0] || loading}
          className="rounded-xl bg-gray-900 p-3 font-semibold no-underline transition hover:bg-gray-800 disabled:bg-gray-800 disabled:text-gray-400 disabled:hover:text-red-500"
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
  );
}
